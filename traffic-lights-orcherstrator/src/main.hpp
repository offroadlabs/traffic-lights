#ifndef MAIN_HPP
#define MAIN_HPP

#include <zephyr/kernel.h>
#include <zephyr/net/socket.h>
#include <zephyr/net/http/client.h>

enum class LightState
{
    RED,
    YELLOW,
    GREEN
};

struct TrafficLight
{
    const char *name;
    LightState state;
    k_timer timer;
};

struct StateChangeEvent
{
    int light_index;
    LightState new_state;
};

extern struct k_msgq state_change_queue;
extern struct k_thread http_thread_data;
extern k_tid_t http_thread_id;

constexpr uint32_t TIME_GREEN = 30000;
constexpr uint32_t TIME_YELLOW = 5000;
constexpr uint32_t TIME_SAFETY = 5000;

constexpr size_t HTTP_STACK_SIZE = 2048;

void init_traffic_system();
void http_thread_entry(void *, void *, void *);
const char *state_to_string(LightState state);

#endif