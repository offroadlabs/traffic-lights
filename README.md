# Light Orchestrator

Un système de gestion de feux de circulation basé sur Zephyr RTOS. Ce projet sert de démonstration pour un article technique sur [timoner.com](https://timoner.com) explorant l'utilisation de Zephyr RTOS avec le C++ moderne dans un contexte IoT.

## Architecture

Le projet est composé de plusieurs services :

- **Zephyr RTOS** : Système d'exploitation temps réel pour la gestion des feux, développé en C++17
- **Redis** : Base de données pour stocker les états des feux
- **WebSocket Server** : Serveur de diffusion en temps réel des états des feux
- **HTTP Gateway** : API REST pour la communication avec le système
- **Interface Web** : Moniteur de visualisation des feux en temps réel
- **Docker** : Conteneurisation de l'environnement de développement

### Choix techniques

#### Zephyr & C++
Le contrôleur des feux est développé en C++17 sur Zephyr RTOS, démontrant :
- L'utilisation du C++ moderne dans un contexte embarqué
- La gestion des ressources avec RAII
- Les timers et threads temps réel
- La communication réseau via sockets

#### Interface Web avec Next.js 15
L'interface de monitoring est développée avec Next.js 15, utilisant :
- App Router pour une navigation optimisée
- React Server Components pour de meilleures performances
- TypeScript pour la sécurité du typage
- Tailwind CSS pour le styling
- WebSocket pour les mises à jour en temps réel

### Structure des fichiers 

## Installation

1. Prérequis :
   - Docker
   - Docker Compose

2. Cloner le repository :
   ```bash
   git clone git@github.com:offroadlabs/traffic-lights.git
   cd lightorchestrator
   ```

## Utilisation

Pour démarrer l'application :

1. Lancer tous les services :
   ```bash
   ./run.sh up
   ```
   > ⚠️ Note : Le premier démarrage peut prendre plusieurs minutes car il inclut :
   > - La compilation du projet Zephyr
   > - L'installation des dépendances Node.js/Bun
   > - La construction des images Docker
   > - La compilation de l'interface web Next.js

2. Une fois tous les services démarrés, accéder à l'interface de monitoring :
   - Ouvrir [http://localhost:3000](http://localhost:3000) dans votre navigateur

Pour arrêter l'application :
```bash
./run.sh down
```

L'interface web est accessible sur :
- [http://localhost:3000](http://localhost:3000)

## Fonctionnement

Le système gère un carrefour avec 4 feux de circulation :
- Feux Nord-Sud
- Feux Est-Ouest

Chaque feu suit un cycle :
1. Vert : 30 secondes
2. Jaune : 5 secondes
3. Rouge : pendant que l'autre axe est actif

Sécurité :
- Temps de sécurité (tous feux rouges) : 5 secondes
- Gestion synchronisée des feux opposés
- Impossibilité d'avoir deux axes au vert simultanément

## Développement

### Environnement de développement

Le projet utilise Docker pour garantir un environnement de développement cohérent :
- Image Zephyr officielle pour la compilation
- Redis pour la persistance des données
- Réseau dédié pour la communication inter-containers

### Logs

Le système utilise un module de logging dédié qui :
- Enregistre les changements d'état des feux
- Trace les démarrages de cycles
- Affiche les informations de configuration

## Article technique

Ce projet sert de base à un article technique détaillé sur [timoner.com](https://timoner.com) qui explore :
- L'utilisation de Zephyr RTOS avec le C++ moderne
- L'architecture d'un système IoT distribué
- Les bonnes pratiques de développement embarqué
- L'intégration avec des technologies web modernes

L'article complet sera bientôt disponible sur [timoner.com](https://timoner.com).