import { Component, OnInit } from '@angular/core';
import { BoutiqueService } from '../../../services/boutique.service';
import { FirebaseService } from '../../../services/firebase.service';
import { ProduitService } from '../../../services/produit.service';

@Component({
  selector: 'app-boutiques-admin',
  templateUrl: './boutiques-admin.component.html',
  styleUrl: './boutiques-admin.component.css'
})
export class BoutiquesAdminComponent implements OnInit {
  boutiques: any[] = [];
  filteredBoutiques: any[] = [];
  searchTerm: string = '';
  vendeurs: any[] = [];

  showModal = false;
  editingBoutique: any = null;

  // Pour la suppression
  boutiqueToDelete: any = null;
  showDeleteConfirm = false;

  newBoutique = {
    nom: '',
    vendeurId: '',
    vendeurEmail: '',
    vendeurNom: '',
    statut: 'active',
    abonnement: 'gratuit',
    description: '',
    adresse: '',
    telephone: '',
    createdAt: new Date().toISOString()
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
    this.editingBoutique = null;
    this.resetForm();
    this.showModal = true;
  }

  editBoutique(boutique: any) {
    this.editingBoutique = boutique;
    this.newBoutique = { ...boutique };
    this.showModal = true;
  }

  resetForm() {
    this.newBoutique = {
      nom: '', vendeurId: '', vendeurEmail: '', vendeurNom: '',
      statut: 'active', abonnement: 'gratuit', description: '',
      adresse: '', telephone: '', createdAt: new Date().toISOString()
    };
  }

  onVendeurSelected() {
    const selected = this.vendeurs.find(v => v.id === this.newBoutique.vendeurId);
    if (selected) {
      this.newBoutique.vendeurEmail = selected.email || '';
      this.newBoutique.vendeurNom = selected.nom || selected.displayName || '';
    }
  }

  confirmDelete(boutique: any) {
    this.boutiqueToDelete = boutique;
    this.showDeleteConfirm = true;
  }

  async deleteBoutiqueConfirmed() {
    if (!this.boutiqueToDelete) return;

    try {
      // 1. Supprimer tous les produits de cette boutique
      const products = await this.produitService.getProductsByBoutique(this.boutiqueToDelete.id);
      for (const product of products) {
        await this.produitService.deleteProduit(product.id);
      }

      // 2. Supprimer la boutique
      await this.boutiqueService.deleteBoutique(this.boutiqueToDelete.id);

      alert(`✅ Boutique "${this.boutiqueToDelete.nom}" et ses ${products.length} produits ont été supprimés.`);
      
      this.showDeleteConfirm = false;
      this.boutiqueToDelete = null;
      await this.loadData();
    } catch (error) {
      console.error(error);
      alert("❌ Une erreur est survenue lors de la suppression");
    }
  }

  cancelDelete() {
    this.showDeleteConfirm = false;
    this.boutiqueToDelete = null;
  }
}
