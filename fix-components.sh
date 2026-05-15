#!/bin/bash

# Liste des composants à corriger
components=(
  "src/app/components/admin/abonnements-admin/abonnements-admin.component.ts"
  "src/app/components/admin/admin-layout/admin-layout.component.ts"
  "src/app/components/admin/boutiques-admin/boutiques-admin.component.ts"
  "src/app/components/admin/dashboard/dashboard.component.ts"
  "src/app/components/admin/vendeurs-admin/vendeurs-admin.component.ts"
  "src/app/components/client/accueil/accueil.component.ts"
  "src/app/components/client/panier/panier.component.ts"
  "src/app/components/client/produits/produits.component.ts"
  "src/app/components/footer/footer.component.ts"
  "src/app/components/login/login.component.ts"
  "src/app/components/register/register.component.ts"
  "src/app/components/vendeur/vendeur-boutiques/vendeur-boutiques.component.ts"
  "src/app/components/vendeur/vendeur-clients/vendeur-clients.component.ts"
  "src/app/components/vendeur/vendeur-commandes/vendeur-commandes.component.ts"
  "src/app/components/vendeur/vendeur-dashboard/vendeur-dashboard.component.ts"
  "src/app/components/vendeur/vendeur-layout/vendeur-layout.component.ts"
  "src/app/components/vendeur/vendeur-produits/vendeur-produits.component.ts"
)

for component in "${components[@]}"; do
  if [ -f "$component" ]; then
    # Supprimer les lignes styleUrls et styleUrl
    sed -i '' '/styleUrls:/d' "$component"
    sed -i '' '/styleUrl:/d' "$component"
    # Ajouter styles: [] après templateUrl si nécessaire
    echo "✅ Fixed: $component"
  fi
done

echo "✅ Tous les composants ont été corrigés"
