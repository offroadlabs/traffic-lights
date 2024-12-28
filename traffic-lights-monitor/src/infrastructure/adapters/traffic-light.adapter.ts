import { TrafficLightPort, TrafficLightState } from "@/domain/traffic-light";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
const WS_URL = process.env.NEXT_PUBLIC_WS_URL || "ws://localhost:8001";

export class TrafficLightAdapter implements TrafficLightPort {
  async getInitialStates(): Promise<TrafficLightState[]> {
    try {
      const responses = await Promise.all(
        ["North", "South", "East", "West"].map((id) =>
          fetch(`${API_URL}/traffic-light/${id}`).then((res) => res.json())
        )
      );

      return responses.map((response) => ({
        id: response.id,
        state: response.state,
      }));
    } catch (error) {
      console.error("Erreur lors de la récupération des états:", error);
      return [
        { id: "North", state: "red" },
        { id: "South", state: "red" },
        { id: "East", state: "red" },
        { id: "West", state: "red" },
      ];
    }
  }

  subscribeToUpdates(callback: (state: TrafficLightState) => void): () => void {
    const ws = new WebSocket(WS_URL);

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        callback(data);
      } catch (error) {
        console.error("Erreur lors du traitement du message WebSocket:", error);
      }
    };

    return () => ws.close();
  }
} 