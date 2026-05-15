#!/bin/bash

# Supprime les tableaux 'styles' vides ou avec contenu dans les composants
find src/app -name "*.ts" -exec sed -i '' '/styles: \[/,/\]/d' {} \;
find src/app -name "*.ts" -exec sed -i '' '/styleUrl/d' {} \;
find src/app -name "*.ts" -exec sed -i '' '/styleUrls/d' {} \;

echo "✅ Styles locaux supprimés des composants TypeScript"
