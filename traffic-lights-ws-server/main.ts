import type { ServerWebSocket } from "bun";
import { createClient } from "redis";
import { serve } from "bun";

const REDIS_URL = process.env.REDIS_URL || "redis://redis:6379";

const redis = createClient({
  url: REDIS_URL
});

await redis.connect();

const wsConnections = new Set<ServerWebSocket<unknown>>();

const server = serve({
  port: 8001,
  fetch(req) {
    if (req.method === "OPTIONS") {
      return new Response(null, {
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
          "Access-Control-Allow-Headers": "*"
        }
      });
    }

    const upgraded = server.upgrade(req, {
      headers: {
        "Access-Control-Allow-Origin": "*"
      }
    });
    
    if (upgraded) {
      return;
    }
    
    return new Response("Échec de la mise à niveau WebSocket", { 
      status: 400,
      headers: {
        "Access-Control-Allow-Origin": "*"
      }
    });
  },
  websocket: {
    open(ws: ServerWebSocket<unknown>) {
      console.log("Nouvelle connexion WebSocket");
      wsConnections.add(ws);
    },
    close(ws: ServerWebSocket<unknown>) {
      console.log("Fermeture connexion WebSocket");
      wsConnections.delete(ws);
    },
    message(ws: ServerWebSocket<unknown>, message: string) {
      console.log("Message reçu:", message);
    },
  },
});

const subscriber = redis.duplicate();
await subscriber.connect();

await subscriber.subscribe('traffic-lights', (message) => {
  try {
    const data = JSON.parse(message);
    console.log('Nouveau changement de feu tricolore:', data);
    
    wsConnections.forEach(ws => {
      ws.send(JSON.stringify(data));
    });
  } catch (err) {
    console.error('Erreur lors du parsing du message:', err);
  }
});

console.log('Serveur WebSocket démarré sur le port 8001'); 