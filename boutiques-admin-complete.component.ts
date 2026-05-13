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

  // Modale
  showModal = false;
  editingBoutique: any = null;
  isSubmitting = false;

  // Suppression
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
    try {
      this.boutiques = await this.boutiqueService.getAllBoutiques();
      this.filteredBoutiques = [...this.boutiques];
      
      const allUsers = await this.firebase.getData('users');
      this.vendeurs = allUsers.filter((u: any) => u.role === 'vendeur');
      console.log('✅ Données chargées:', this.boutiques.length, 'boutiques,', this.vendeurs.length, 'vendeurs');
    } catch (error) {
      console.error('Erreur chargement:', error);
    }
  }

  filterBoutiques() {
    const term = this.searchTerm.toLowerCase();
    this.filteredBoutiques = this.boutiques.filter(b => 
      b.nom?.toLowerCase().includes(term) || 
      b.vendeurEmail?.toLowerCase().includes(term)
    );
  }

  // Méthode appelée par le bouton "Nouvelle boutique"
  openNewBoutiqueModal() {
    console.log('🔘 openNewBoutiqueModal appelée');
    this.editingBoutique = null;
    this.resetForm();
    this.showModal = true;
  }

  editBoutique(boutique: any) {
    this.editingBoutique = boutique;
    this.newBoutique = { 
      nom: boutique.nom || '',
      vendeurId: boutique.vendeurId || '',
      vendeurEmail: boutique.vendeurEmail || '',
      vendeurNom: boutique.vendeurNom || '',
      statut: boutique.statut || 'active',
      abonnement: boutique.abonnement || 'gratuit',
      description: boutique.description || '',
      adresse: boutique.adresse || '',
      telephone: boutique.telephone || '',
      createdAt: boutique.createdAt || new Date().toISOString()
    };
    this.showModal = true;
  }

  resetForm() {
    this.newBoutique = {
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
  }

  onVendeurSelected() {
    const selected = this.vendeurs.find(v => v.id === this.newBoutique.vendeurId);
    if (selected) {
      this.newBoutique.vendeurEmail = selected.email || '';
      this.newBoutique.vendeurNom = selected.nom || selected.displayName || '';
    }
  }

  async saveBoutique() {
    if (!this.newBoutique.nom) {
      alert("Le nom de la boutique est obligatoire");
      return;
    }

    if (!this.newBoutique.vendeurId) {
      alert("Veuillez sélectionner un vendeur");
      return;
    }

    this.isSubmitting = true;

    try {
      if (this.editingBoutique) {
        await this.boutiqueService.updateBoutique(this.editingBoutique.id, this.newBoutique);
        alert("✅ Boutique modifiée avec succès !");
      } else {
        await this.boutiqueService.createBoutique(this.newBoutique);
        alert("✅ Boutique créée avec succès !");
      }
      
      this.showModal = false;
      await this.loadData();
      this.resetForm();
    } catch (error) {
      console.error('Erreur:', error);
      alert("❌ Une erreur est survenue");
    } finally {
      this.isSubmitting = false;
    }
  }

  closeModal() {
    this.showModal = false;
    this.resetForm();
    this.editingBoutique = null;
  }

  confirmDelete(boutique: any) {
    this.boutiqueToDelete = boutique;
    this.showDeleteConfirm = true;
  }

  async deleteBoutiqueConfirmed() {
    if (!this.boutiqueToDelete) return;

    try {
      const products = await this.produitService.getProductsByBoutique(this.boutiqueToDelete.id);
      for (const product of products) {
        await this.produitService.deleteProduit(product.id);
      }

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
