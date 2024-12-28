"use client";

import { useEffect, useState } from "react";
import { TrafficLight } from "./traffic-light";
import { getTrafficLights } from "@/application/use-cases/get-traffic-lights";
import { TrafficLightAdapter } from "@/infrastructure/adapters/traffic-light.adapter";
import { TrafficLightState } from "@/domain/traffic-light";

export function Intersection() {
  const [lights, setLights] = useState<TrafficLightState[]>([
    { id: "North", state: "red" },
    { id: "South", state: "red" },
    { id: "East", state: "red" },
    { id: "West", state: "red" },
  ]);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const adapter = new TrafficLightAdapter();

    // Initial state
    getTrafficLights().then(setLights);
    setIsConnected(true);

    // Subscribe to updates
    const unsubscribe = adapter.subscribeToUpdates((newState) => {
      setLights((prevLights) =>
        prevLights.map((light) =>
          light.id === newState.id ? { ...light, state: newState.state } : light
        )
      );
    });

    return () => {
      unsubscribe();
      setIsConnected(false);
    };
  }, []);

  return (
    <div className="flex flex-col items-center gap-4">
      <div
        className={`px-3 py-1 rounded-full text-sm ${
          isConnected
            ? "bg-green-500/10 text-green-500"
            : "bg-red-500/10 text-red-500"
        }`}
      >
        {isConnected ? "Connecté" : "Déconnecté"}
      </div>
      <div className="relative grid grid-cols-3 gap-8 p-8">
        <div className="absolute left-0 right-0 top-1/2 h-32 -translate-y-1/2 bg-neutral-700">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="flex-1 flex justify-center">
              <div className="w-full h-[2px] bg-dashed-white" />
            </div>
            <div className="w-32" />
            <div className="flex-1 flex justify-center">
              <div className="w-full h-[2px] bg-dashed-white" />
            </div>
          </div>
        </div>

        <div className="absolute top-0 bottom-0 left-1/2 w-32 -translate-x-1/2 bg-neutral-700">
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <div className="flex-1 flex flex-col justify-center">
              <div className="h-full w-[2px] bg-dashed-white-vertical" />
            </div>
            <div className="h-32" />
            <div className="flex-1 flex flex-col justify-center">
              <div className="h-full w-[2px] bg-dashed-white-vertical" />
            </div>
          </div>
        </div>

        <div className="col-start-2 z-10 -translate-x-8">
          <TrafficLight {...lights.find((l) => l.id === "North")!} />
        </div>
        <div className="col-start-3 row-start-2 z-10 -translate-y-12">
          <TrafficLight
            {...lights.find((l) => l.id === "East")!}
            orientation="horizontal"
          />
        </div>
        <div className="col-start-2 row-start-3 z-10 translate-x-8">
          <TrafficLight {...lights.find((l) => l.id === "South")!} />
        </div>
        <div className="col-start-1 row-start-2 z-10 -translate-y-12">
          <TrafficLight
            {...lights.find((l) => l.id === "West")!}
            orientation="horizontal"
          />
        </div>
      </div>
    </div>
  );
}
