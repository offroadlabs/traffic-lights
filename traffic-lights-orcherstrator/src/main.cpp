#include "main.hpp"
#include "logger.h"
#include "http_client.hpp"
#include <zephyr/kernel.h>
#include <string.h>

K_MSGQ_DEFINE(state_change_queue, sizeof(StateChangeEvent), 10, 4);
K_THREAD_STACK_DEFINE(http_stack, HTTP_STACK_SIZE);
struct k_thread http_thread_data;
k_tid_t http_thread_id;

TrafficLight lights[4] = {
    {"North", LightState::RED},
    {"South", LightState::RED},
    {"East", LightState::RED},
    {"West", LightState::RED}};

// Timer callback
void timer_expiry_callback(struct k_timer *timer)
{
    auto *light = CONTAINER_OF(timer, TrafficLight, timer);
    StateChangeEvent evt;
    evt.light_index = light - &lights[0];
    evt.new_state = LightState::RED;
    k_msgq_put(&state_change_queue, &evt, K_NO_WAIT);
}

// Thread HTTP
void http_thread_entry(void *, void *, void *)
{
    HttpClient client;
    StateChangeEvent evt;

    while (1)
    {
        if (k_msgq_get(&state_change_queue, &evt, K_FOREVER) == 0)
        {
            auto &light = lights[evt.light_index];
            light.state = evt.new_state;

            // Envoi asynchrone de l'état
            client.send_traffic_light_state(
                light.name,
                state_to_string(light.state));

            log_light_state(light.name,
                            state_to_string(light.state));
        }
    }
}

void change_axis_state(int light1_index, int light2_index, LightState new_state, uint32_t duration_ms)
{
    StateChangeEvent evt1 = {light1_index, new_state};
    StateChangeEvent evt2 = {light2_index, new_state};

    k_msgq_put(&state_change_queue, &evt1, K_NO_WAIT);
    k_msgq_put(&state_change_queue, &evt2, K_NO_WAIT);

    if (duration_ms > 0)
    {
        k_timer_start(&lights[light1_index].timer, K_MSEC(duration_ms), K_NO_WAIT);
        k_timer_start(&lights[light2_index].timer, K_MSEC(duration_ms), K_NO_WAIT);
    }
}

void init_traffic_system()
{
    for (auto &light : lights)
    {
        k_timer_init(&light.timer, timer_expiry_callback, nullptr);
    }

    http_thread_id = k_thread_create(&http_thread_data, http_stack,
                                     K_THREAD_STACK_SIZEOF(http_stack),
                                     http_thread_entry,
                                     NULL, NULL, NULL,
                                     5, 0, K_NO_WAIT);
    k_thread_name_set(http_thread_id, "http_thread");
}

const char *state_to_string(LightState state)
{
    switch (state)
    {
    case LightState::RED:
        return "red";
    case LightState::YELLOW:
        return "yellow";
    case LightState::GREEN:
        return "green";
    default:
        return "unknown";
    }
}

void intersection_cycle()
{
    // Nord-Sud passage au vert
    log_cycle_start("North-South");
    change_axis_state(0, 1, LightState::GREEN, TIME_GREEN);
    k_sleep(K_MSEC(TIME_GREEN));

    change_axis_state(0, 1, LightState::YELLOW, TIME_YELLOW);
    k_sleep(K_MSEC(TIME_YELLOW));

    change_axis_state(0, 1, LightState::RED, TIME_SAFETY);
    k_sleep(K_MSEC(TIME_SAFETY));

    // Est-Ouest passage au vert
    log_cycle_start("East-West");
    change_axis_state(2, 3, LightState::GREEN, TIME_GREEN);
    k_sleep(K_MSEC(TIME_GREEN));

    change_axis_state(2, 3, LightState::YELLOW, TIME_YELLOW);
    k_sleep(K_MSEC(TIME_YELLOW));

    change_axis_state(2, 3, LightState::RED, TIME_SAFETY);
    k_sleep(K_MSEC(TIME_SAFETY));
}

int main()
{
    init_traffic_system();

    while (1)
    {
        intersection_cycle();
    }
    return 0;
}