"use client";

import { TrafficLightState } from "@/domain/traffic-light";

interface TrafficLightProps extends TrafficLightState {
  orientation?: "vertical" | "horizontal";
}

export function TrafficLight({
  id,
  state,
  orientation = "vertical",
}: TrafficLightProps) {
  const lights = ["red", "yellow", "green"];

  return (
    <div className="flex flex-col gap-2 items-center">
      <h3 className="text-sm font-semibold">{id}</h3>
      <div
        className={`bg-gray-800 p-2 rounded-lg flex ${
          orientation === "horizontal" ? "flex-row" : "flex-col"
        } gap-2`}
      >
        {lights.map((light) => (
          <div
            key={light}
            className={`w-8 h-8 rounded-full ${
              state === light
                ? {
                    red: "bg-red-500",
                    yellow: "bg-yellow-500",
                    green: "bg-green-500",
                  }[light]
                : "bg-gray-700"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
