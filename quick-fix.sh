#!/bin/bash

echo "🚀 CORRECTION RAPIDE"
echo "==================="

# Créer les dossiers si nécessaire
mkdir -p src/app/components/admin/boutiques-admin

# Copier les fichiers
echo "📁 Copie des fichiers corrigés..."
cat > src/app/components/admin/boutiques-admin/boutiques-admin.component.ts << 'TYPESCRIPT'
import { Component, OnInit } from '@angular/core';
import { BoutiqueService } from '../../../services/boutique.service';
import { FirebaseService } from '../../../services/firebase.service';
import { ProduitService } from '../../../services/produit.service';

@Component({
  selector: 'app-boutiques-admin',
  templateUrl: './boutiques-admin.component.html',
  styleUrls: ['./boutiques-admin.component.css']
})
export class BoutiquesAdminComponent implements OnInit {
  boutiques: any[] = [];
  filteredBoutiques: any[] = [];
  searchTerm: string = '';
  vendeurs: any[] = [];
  showModal = false;
  editingBoutique: any = null;
  isSubmitting = false;
  boutiqueToDelete: any = null;
  showDeleteConfirm = false;

  newBoutique = {
    nom: '', vendeurId: '', vendeurEmail: '', vendeurNom: '',
    statut: 'active', abonnement: 'gratuit', description: '',
    adresse: '', telephone: '', createdAt: new Date().toISOString()
  };

  constructor(
    private boutiqueService: BoutiqueService,
    private produitService: ProduitService,
    private firebase: FirebaseService
  ) {}

  async ngOnInit() {
    await this.loadData();
  }

  async loadData() {
    this.boutiques = await this.boutiqueService.getAllBoutiques();
    this.filteredBoutiques = [...this.boutiques];
    const allUsers = await this.firebase.getData('users');
    this.vendeurs = allUsers.filter((u: any) => u.role === 'vendeur');
  }

  filterBoutiques() {
    const term = this.searchTerm.toLowerCase();
    this.filteredBoutiques = this.boutiques.filter(b => 
      b.nom?.toLowerCase().includes(term) || b.vendeurEmail?.toLowerCase().includes(term)
    );
  }

  openNewBoutiqueModal() {
    console.log('🔘 Modal ouverte');
    this.editingBoutique = null;
    this.newBoutique = {
      nom: '', vendeurId: '', vendeurEmail: '', vendeurNom: '',
      statut: 'active', abonnement: 'gratuit', description: '',
      adresse: '', telephone: '', createdAt: new Date().toISOString()
    };
    this.showModal = true;
  }

  editBoutique(boutique: any) {
    this.editingBoutique = boutique;
    this.newBoutique = { ...boutique };
    this.showModal = true;
  }

  onVendeurSelected() {
    const selected = this.vendeurs.find(v => v.id === this.newBoutique.vendeurId);
    if (selected) {
      this.newBoutique.vendeurEmail = selected.email || '';
      this.newBoutique.vendeurNom = selected.nom || selected.displayName || '';
    }
  }

  async saveBoutique() {
    if (!this.newBoutique.nom) { alert("Nom obligatoire"); return; }
    if (!this.newBoutique.vendeurId) { alert("Sélectionnez un vendeur"); return; }
    
    this.isSubmitting = true;
    try {
      if (this.editingBoutique) {
        await this.boutiqueService.updateBoutique(this.editingBoutique.id, this.newBoutique);
        alert("✅ Boutique modifiée");
      } else {
        await this.boutiqueService.createBoutique(this.newBoutique);
        alert("✅ Boutique créée");
      }
      this.showModal = false;
      await this.loadData();
    } catch (error) {
      alert("❌ Erreur");
    } finally {
      this.isSubmitting = false;
    }
  }

  closeModal() {
    this.showModal = false;
    this.editingBoutique = null;
  }

  confirmDelete(boutique: any) {
    this.boutiqueToDelete = boutique;
    this.showDeleteConfirm = true;
  }

  async deleteBoutiqueConfirmed() {
    if (!this.boutiqueToDelete) return;
    const products = await this.produitService.getProductsByBoutique(this.boutiqueToDelete.id);
    for (const product of products) await this.produitService.deleteProduit(product.id);
    await this.boutiqueService.deleteBoutique(this.boutiqueToDelete.id);
    alert(`✅ Supprimé: ${products.length} produits`);
    this.showDeleteConfirm = false;
    await this.loadData();
  }

  cancelDelete() {
    this.showDeleteConfirm = false;
    this.boutiqueToDelete = null;
  }
}
TYPESCRIPT

cat > src/app/components/admin/boutiques-admin/boutiques-admin.component.html << 'HTML'
<div class="admin-content">
  <div class="d-flex justify-content-between align-items-center mb-4">
    <div>
      <h2>Boutiques</h2>
      <p class="text-muted">{{ filteredBoutiques.length }} boutique(s)</p>
    </div>
    <button class="btn btn-primary" (click)="openNewBoutiqueModal()" style="padding: 10px 20px; border-radius: 10px;">
      ➕ Nouvelle boutique
    </button>
  </div>

  <input type="text" class="form-control mb-4" [(ngModel)]="searchTerm" (input)="filterBoutiques()" placeholder="Rechercher...">

  <div class="boutique-card" *ngFor="let b of filteredBoutiques">
    <div class="d-flex justify-content-between align-items-center">
      <div>
        <h5>{{ b.nom }}</h5>
        <p class="text-muted">{{ b.vendeurEmail }}</p>
      </div>
      <div>
        <button class="btn btn-sm btn-outline-primary me-2" (click)="editBoutique(b)">Modifier</button>
        <button class="btn btn-sm btn-outline-danger" (click)="confirmDelete(b)">Supprimer</button>
      </div>
    </div>
  </div>
</div>

<!-- Modal -->
<div *ngIf="showModal" style="position: fixed; top:0; left:0; right:0; bottom:0; background:rgba(0,0,0,0.6); display:flex; align-items:center; justify-content:center; z-index:10000;">
  <div style="background:white; border-radius:20px; width:500px; max-width:90%;">
    <div style="padding:20px; border-bottom:1px solid #ddd;">
      <h3>{{ editingBoutique ? 'Modifier' : 'Nouvelle' }} boutique</h3>
    </div>
    <div style="padding:20px;">
      <input class="form-control mb-3" [(ngModel)]="newBoutique.nom" placeholder="Nom *">
      <select class="form-control mb-3" [(ngModel)]="newBoutique.vendeurId" (change)="onVendeurSelected()">
        <option value="">Sélectionner un vendeur</option>
        <option *ngFor="let v of vendeurs" [value]="v.id">{{ v.nom }} ({{ v.email }})</option>
      </select>
      <select class="form-control mb-3" [(ngModel)]="newBoutique.statut">
        <option value="active">Active</option>
        <option value="inactive">Inactive</option>
      </select>
      <textarea class="form-control mb-3" [(ngModel)]="newBoutique.description" placeholder="Description" rows="2"></textarea>
    </div>
    <div style="padding:20px; border-top:1px solid #ddd; display:flex; justify-content:flex-end; gap:10px;">
      <button class="btn btn-secondary" (click)="closeModal()">Annuler</button>
      <button class="btn btn-primary" (click)="saveBoutique()" [disabled]="isSubmitting">{{ isSubmitting ? 'Enregistrement...' : 'Enregistrer' }}</button>
    </div>
  </div>
</div>

<div *ngIf="showDeleteConfirm" style="position: fixed; top:0; left:0; right:0; bottom:0; background:rgba(0,0,0,0.7); display:flex; align-items:center; justify-content:center; z-index:10001;">
  <div style="background:white; border-radius:20px; width:400px;">
    <div style="padding:20px; background:#dc2626; color:white; border-radius:20px 20px 0 0;">
      <h5>⚠️ Suppression définitive</h5>
    </div>
    <div style="padding:20px;">
      <p>Supprimer "{{ boutiqueToDelete?.nom }}" ?</p>
      <p style="color:#dc2626;">Tous les produits seront supprimés.</p>
    </div>
    <div style="padding:20px; display:flex; justify-content:flex-end; gap:10px;">
      <button class="btn btn-secondary" (click)="cancelDelete()">Annuler</button>
      <button class="btn btn-danger" (click)="deleteBoutiqueConfirmed()">Supprimer</button>
    </div>
  </div>
</div>
HTML

echo ""
echo "✅ Fichiers copiés !"
echo ""
echo "🔄 Redémarrez l'application :"
echo "   ng serve"
echo ""
echo "📌 Testez :"
echo "   1. Allez sur http://localhost:4200/admin/boutiques"
echo "   2. Cliquez sur 'Nouvelle boutique'"
echo "   3. La modale doit s'ouvrir"
