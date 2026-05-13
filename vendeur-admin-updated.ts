// Mise à jour du composant VendeursAdminComponent
import { Component, OnInit } from '@angular/core';
import { FirebaseService } from '../../../services/firebase.service';
import { BoutiqueService } from '../../../services/boutique.service';
import { ProduitService } from '../../../services/produit.service';

@Component({
  selector: 'app-vendeurs-admin',
  templateUrl: './vendeurs-admin.component.html',
  styleUrls: ['./vendeurs-admin.component.css']
})
export class VendeursAdminComponent implements OnInit {
  vendeurs: any[] = [];
  filteredVendeurs: any[] = [];
  searchTerm: string = '';
  showModal = false;
  showDeleteVendeurModal = false;  // Propriété pour la modale pro
  vendeurToDelete: any = null;
  isDeleting = false;

  newVendeur = {
    nom: '',
    email: '',
    role: 'vendeur' as const,
    isActive: true,
    createdAt: new Date().toISOString()
  };

  constructor(
    private firebase: FirebaseService,
    private boutiqueService: BoutiqueService,
    private produitService: ProduitService
  ) {}

  async ngOnInit() {
    await this.loadVendeurs();
  }

  async loadVendeurs() {
    const allUsers = await this.firebase.getData('users');
    this.vendeurs = allUsers.filter((u: any) => u.role === 'vendeur');
    this.filteredVendeurs = [...this.vendeurs];
  }

  filterVendeurs() {
    const term = this.searchTerm.toLowerCase();
    this.filteredVendeurs = this.vendeurs.filter(v => 
      v.nom?.toLowerCase().includes(term) || 
      v.email?.toLowerCase().includes(term)
    );
  }

  openAddModal() {
    this.newVendeur = {
      nom: '',
      email: '',
      role: 'vendeur',
      isActive: true,
      createdAt: new Date().toISOString()
    };
    this.showModal = true;
  }

  async addVendeur() {
    if (!this.newVendeur.nom || !this.newVendeur.email) {
      alert("Nom et email sont obligatoires");
      return;
    }

    try {
      await this.firebase.addData('users', this.newVendeur);
      alert("✅ Vendeur ajouté avec succès !");
      this.showModal = false;
      await this.loadVendeurs();
    } catch (error) {
      console.error(error);
      alert("❌ Erreur lors de l'ajout du vendeur");
    }
  }

  // Nouvelle méthode - ouvre la modale pro
  openDeleteVendeurModal(vendeur: any) {
    this.vendeurToDelete = vendeur;
    this.showDeleteVendeurModal = true;
  }

  // Ferme la modale
  closeDeleteModal() {
    this.showDeleteVendeurModal = false;
    this.vendeurToDelete = null;
    this.isDeleting = false;
  }

  // Confirme la suppression
  async confirmVendeurDelete() {
    if (!this.vendeurToDelete || this.isDeleting) return;
    
    this.isDeleting = true;

    try {
      console.log(`🗑️ Suppression du vendeur: ${this.vendeurToDelete.nom}`);

      // 1. Récupérer les boutiques du vendeur
      const allBoutiques = await this.boutiqueService.getAllBoutiques();
      const boutiquesDuVendeur = allBoutiques.filter((b: any) => 
        b.vendeurId === this.vendeurToDelete.uid || 
        b.vendeurId === this.vendeurToDelete.id
      );

      let totalProduitsSupprimes = 0;

      // 2. Supprimer les produits et boutiques
      for (const boutique of boutiquesDuVendeur) {
        const produits = await this.produitService.getProductsByBoutique(boutique.id);
        
        for (const produit of produits) {
          await this.produitService.deleteProduit(produit.id);
          totalProduitsSupprimes++;
        }

        await this.boutiqueService.deleteBoutique(boutique.id);
      }

      // 3. Supprimer le vendeur
      await this.firebase.deleteData('users', this.vendeurToDelete.id);

      alert(`✅ Vendeur "${this.vendeurToDelete.nom}" supprimé\n` +
            `${boutiquesDuVendeur.length} boutique(s) et ${totalProduitsSupprimes} produit(s) supprimés`);

      this.closeDeleteModal();
      await this.loadVendeurs();

    } catch (error) {
      console.error('Erreur:', error);
      alert("❌ Une erreur est survenue lors de la suppression");
    } finally {
      this.isDeleting = false;
    }
  }
}
