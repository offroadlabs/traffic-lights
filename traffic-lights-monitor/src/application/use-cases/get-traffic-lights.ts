"use server";

import { TrafficLightAdapter } from "@/infrastructure/adapters/traffic-light.adapter";
import { TrafficLightState } from "@/domain/traffic-light";

export async function getTrafficLights(): Promise<TrafficLightState[]> {
  const adapter = new TrafficLightAdapter();
  return adapter.getInitialStates();
} 