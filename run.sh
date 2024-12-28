#!/bin/bash

# Couleurs pour les messages
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

# Fonction pour vérifier si les containers sont en cours d'exécution
check_containers() {
    if ! docker compose ps --quiet &>/dev/null; then
        echo -e "${RED}Les containers ne sont pas en cours d'exécution.${NC}"
        echo -e "${YELLOW}Démarrage des containers...${NC}"
        docker compose up -d
    fi
}

# Fonction pour démarrer les containers
up() {
    echo -e "${YELLOW}Construction de l'image Docker si nécessaire...${NC}"
    docker compose build
    echo -e "${YELLOW}Démarrage des containers...${NC}"
    docker compose up -d
    echo -e "${GREEN}Containers démarrés avec succès${NC}"
}

# Fonction pour arrêter les containers
down() {
    echo -e "${YELLOW}Arrêt des containers...${NC}"
    docker compose down
    echo -e "${GREEN}Containers arrêtés avec succès${NC}"
}

reset_containers() {
    echo -e "${YELLOW}Arrêt et nettoyage des containers...${NC}"
    docker compose down -v
    docker compose up -d
    echo -e "${GREEN}Containers réinitialisés avec succès${NC}"
}

case "$1" in
    reset:containers)
        reset_containers
        ;;
    up)
        up
        ;;
    down)
        down
        ;;
    build)
        check_containers
        echo -e "${GREEN}Compilation du projet${NC}"
        docker compose exec zephyr-dev bash -c "\
            cd /traffic-lights-orcherstrator && \
            west build -b qemu_x86 . -- -DCONF_FILE=prj.conf"
        ;;
    run)
        check_containers
        echo -e "${GREEN}Lancement de QEMU...${NC}"
        docker compose exec zephyr-dev bash -c "\
            cd /traffic-lights-orcherstrator && \
            west build -t run"
        ;;
    clean)
        check_containers
        echo -e "${YELLOW}Nettoyage des fichiers de compilation${NC}"
        docker compose exec zephyr-dev bash -c "cd /traffic-lights-orcherstrator && rm -rf build"
        ;;
    shell)
        check_containers
        echo -e "${GREEN}Ouverture d'un shell dans le container${NC}"
        docker compose exec zephyr-dev bash
        ;;
    *)
        echo -e "${RED}Usage: $0 {up|down|build|run|clean|shell}${NC}"
        exit 1
        ;;
esac 