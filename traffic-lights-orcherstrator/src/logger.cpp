#include "logger.h"
#include <zephyr/logging/log.h>

LOG_MODULE_REGISTER(traffic_lights, LOG_LEVEL_INF);

void log_light_state(const char *name, const char *state)
{
    LOG_INF("Feu tricolore %s: %s", name, state);
}

void log_cycle_start(const char *axis)
{
    LOG_INF("Début du cycle %s", axis);
}