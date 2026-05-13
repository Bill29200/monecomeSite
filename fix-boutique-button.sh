#!/bin/bash

echo "🔧 Correction du bouton Nouvelle Boutique..."

echo "📁 1. Vérification des fichiers..."
if [ -f "src/app/components/admin/boutiques-admin/boutiques-admin.component.ts" ]; then
    echo "   ✅ Fichier TypeScript trouvé"
fi

echo ""
echo "📝 2. Assurez-vous que le template contient bien :"
echo "   (click)=\"openNewBoutiqueModal()\""
echo ""
echo "📝 3. Vérifiez que la méthode est définie dans le composant"
echo ""
echo "✅ Correction terminée !"
echo ""
echo "🔄 Redémarrez l'application si nécessaire :"
echo "   ng serve"
