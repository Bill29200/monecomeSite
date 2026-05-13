#!/bin/bash

echo "🔍 VÉRIFICATION DU PROBLÈME"
echo "=========================="
echo ""

echo "1️⃣ Vérification que le composant est déclaré dans app.module.ts..."
if grep -q "BoutiquesAdminComponent" src/app/app.module.ts 2>/dev/null; then
    echo "   ✅ BoutiquesAdminComponent est déclaré"
else
    echo "   ❌ BoutiquesAdminComponent n'est PAS déclaré dans app.module.ts"
    echo "   ➕ Ajoutez-le dans declarations: [..., BoutiquesAdminComponent]"
fi

echo ""
echo "2️⃣ Vérification de la route..."
if grep -q "admin/boutiques" src/app/app.routes.ts 2>/dev/null; then
    echo "   ✅ Route /admin/boutiques existe"
else
    echo "   ❌ Route /admin/boutiques manquante"
fi

echo ""
echo "3️⃣ Vérification du template du dashboard..."
if grep -q "routerLink=\"/admin/boutiques\"" src/app/components/admin/dashboard/dashboard.component.html 2>/dev/null; then
    echo "   ✅ Lien vers boutiques présent dans le dashboard"
else
    echo "   ⚠️ Vérifiez que le dashboard a un lien vers /admin/boutiques"
fi

echo ""
echo "4️⃣ Solution rapide :"
echo "   - Copiez le fichier boutiques-admin-complete.component.ts"
echo "   - Copiez le fichier boutiques-admin-complete.html"
echo "   - Redémarrez: ng serve"
echo "   - Ouvrez la console navigateur F12 pour voir les logs"
