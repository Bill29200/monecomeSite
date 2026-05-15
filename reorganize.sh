#!/bin/bash

# Structure du projet optimisée
PROJECT_NAME="monecome-optimized"

echo "📁 Création de la structure optimisée pour $PROJECT_NAME..."

mkdir -p $PROJECT_NAME/src/app/{core,shared,features,layouts,guards,interceptors}
mkdir -p $PROJECT_NAME/src/app/core/{services,models,constants}
mkdir -p $PROJECT_NAME/src/app/shared/{components,directives,pipes}
mkdir -p $PROJECT_NAME/src/app/features/{auth,client,admin,vendeur}
mkdir -p $PROJECT_NAME/src/app/layouts/{navbar,footer,sidebar}
mkdir -p $PROJECT_NAME/src/environments
mkdir -p $PROJECT_NAME/src/assets/{images,icons}

echo "✅ Structure créée avec succès !"
echo ""
echo "📋 Structure générée :"
tree $PROJECT_NAME -L 3 2>/dev/null || ls -la $PROJECT_NAME/

