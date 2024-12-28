export interface TrafficLightState {
  id: string;
  state: "red" | "yellow" | "green";
}

export interface TrafficLightPort {
  getInitialStates(): Promise<TrafficLightState[]>;
  subscribeToUpdates(callback: (state: TrafficLightState) => void): () => void;
} 