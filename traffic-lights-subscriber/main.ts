import { createClient } from "redis";

async function main() {
    // Création du client Redis
    const redis = createClient({
        url: "redis://localhost:6379"
    });

    // Gestion des erreurs de connexion
    redis.on('error', err => console.error('Erreur Redis:', err));
    redis.on('connect', () => console.log('Connecté à Redis'));

    // Connexion à Redis
    await redis.connect();

    // Configuration du subscriber
    const subscriber = redis.duplicate();
    await subscriber.connect();

    // Souscription au canal des feux tricolores
    await subscriber.subscribe('traffic-lights', (message) => {
        try {
            const data = JSON.parse(message);
            console.log('Nouveau changement de feu tricolore:', data);
        } catch (err) {
            console.error('Erreur lors du parsing du message:', err);
        }
    });

    console.log('En attente des changements de feux tricolores...');
}

main().catch(console.error);
