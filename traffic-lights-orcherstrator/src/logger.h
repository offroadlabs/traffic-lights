#ifndef LOGGER_H
#define LOGGER_H

#include <zephyr/kernel.h>

void log_light_state(const char *light_name, const char *state);
void log_system_start(uint32_t green_time, uint32_t yellow_time, uint32_t safety_time);
void log_cycle_start(const char *axis);

#endif