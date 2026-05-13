import { Component, OnInit, OnDestroy } from '@angular/core';
import { BoutiqueService } from '../../../services/boutique.service';
import { FirebaseService } from '../../../services/firebase.service';
import { ProduitService } from '../../../services/produit.service';

@Component({
  selector: 'app-boutiques-admin',
  templateUrl: './boutiques-admin.component.html',
  styleUrls: ['./boutiques-admin.component.css']
})
export class BoutiquesAdminComponent implements OnInit, OnDestroy {
  boutiques: any[] = [];
  filteredBoutiques: any[] = [];
  searchTerm: string = '';
  vendeurs: any[] = [];
  
  showModal = false;
  editingBoutique: any = null;
  isSubmitting = false;
  isLoading = true;
  
  boutiqueToDelete: any = null;
  showDeleteConfirm = false;

  private listenerId: string | null = null;

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

  ngOnDestroy() {
    // Nettoyer le listener si présent
    if (this.listenerId) {
      this.firebase.removeListener(this.listenerId);
    }
  }

  async loadData() {
    this.isLoading = true;
    try {
      // Charger les boutiques
      this.boutiques = await this.boutiqueService.getAllBoutiques();
      this.filteredBoutiques = [...this.boutiques];
      
      // Charger les vendeurs
      const allUsers = await this.firebase.getUsers();
      this.vendeurs = allUsers.filter((u: any) => u.role === 'vendeur');
      
      console.log(`✅ Chargé: ${this.boutiques.length} boutiques, ${this.vendeurs.length} vendeurs`);
    } catch (error) {
      console.error('Erreur chargement:', error);
      // Données mock en cas d'erreur
      this.boutiques = [];
      this.filteredBoutiques = [];
      this.vendeurs = [];
    } finally {
      this.isLoading = false;
    }
  }

  filterBoutiques() {
    const term = this.searchTerm.toLowerCase();
    this.filteredBoutiques = this.boutiques.filter(b => 
      b.nom?.toLowerCase().includes(term) || 
      b.vendeurEmail?.toLowerCase().includes(term)
    );
  }

  openNewBoutiqueModal() {
    console.log('🔘 Ouverture modale nouvelle boutique');
    this.editingBoutique = null;
    this.resetForm();
    this.showModal = true;
  }

  editBoutique(boutique: any) {
    console.log('✏️ Modification boutique:', boutique.nom);
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
    } catch (error: any) {
      console.error('Erreur:', error);
      alert("❌ Une erreur est survenue: " + (error.message || 'Erreur inconnue'));
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

    this.isSubmitting = true;

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
      console.error('Erreur suppression:', error);
      alert("❌ Une erreur est survenue lors de la suppression");
    } finally {
      this.isSubmitting = false;
    }
  }

  cancelDelete() {
    this.showDeleteConfirm = false;
    this.boutiqueToDelete = null;
  }

  // Méthode utilitaire pour recharger
  async refresh() {
    await this.loadData();
  }
}
