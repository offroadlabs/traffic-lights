import { serve } from "bun";
import { createClient } from "redis";

// Création du client Redis
const redis = createClient({
  url: "redis://redis:6379"
});

// Connexion à Redis
await redis.connect();

// Configuration du subscriber Redis
const subscriber = redis.duplicate();
await subscriber.connect();

const server = serve({
  port: 8000,
  async fetch(req: Request) {
    const url = new URL(req.url);
    
    // Headers CORS pour toutes les réponses
    const corsHeaders = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    };

    // Gestion de la requête OPTIONS pour CORS
    if (req.method === "OPTIONS") {
      return new Response(null, { 
        headers: corsHeaders 
      });
    }
    
    // Route pour recevoir les mises à jour des feux tricolores
    if (req.method === "POST" && url.pathname === "/traffic-light") {
      try {
        const data = await req.json();
        const { id, state } = data;
        
        if (!id || !state) {
          return new Response("ID et état requis", { 
            status: 400,
            headers: corsHeaders
          });
        }

        // Validation de l'état
        const validStates = ["red", "yellow", "green"];
        if (!validStates.includes(state)) {
          return new Response("État invalide", { 
            status: 400,
            headers: corsHeaders
          });
        }
        
        // Publication de l'état dans Redis
        await redis.publish("traffic-lights", JSON.stringify({ id, state }));
        // Stockage de l'état actuel
        await redis.set(`traffic-light:${id}`, state);
        
        return new Response(JSON.stringify({ success: true }), { 
          status: 200,
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json"
          }
        });
      } catch (error) {
        console.error("Erreur:", error);
        return new Response(JSON.stringify({ error: error.message }), { 
          status: 500,
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json"
          }
        });
      }
    }
    
    // Route pour obtenir l'état actuel d'un feu tricolore
    if (req.method === "GET" && url.pathname.startsWith("/traffic-light/")) {
      const id = url.pathname.split("/")[2];
      const state = await redis.get(`traffic-light:${id}`);
      
      if (!state) {
        return new Response(JSON.stringify({ error: "Feu tricolore non trouvé" }), { 
          status: 404,
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json"
          }
        });
      }
      
      return new Response(JSON.stringify({ id, state }), { 
        status: 200,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json"
        }
      });
    }

    return new Response(JSON.stringify({ error: "Route non trouvée" }), { 
      status: 404,
      headers: {
        ...corsHeaders,
        "Content-Type": "application/json"
      }
    });
  },
});

// Écoute des événements Redis
subscriber.subscribe("traffic-lights", (message) => {
  const { id, state } = JSON.parse(message);
  console.log(`Mise à jour du feu tricolore ${id}: ${state}`);
});

console.log(`Serveur en écoute sur http://localhost:${server.port}`);
