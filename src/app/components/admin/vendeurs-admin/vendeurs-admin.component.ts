import { Component, OnInit } from '@angular/core';
import { FirebaseService } from '../../../services/firebase.service';
import { BoutiqueService } from '../../../services/boutique.service';
import { ProduitService } from '../../../services/produit.service';

@Component({
  selector: 'app-vendeurs-admin',
  templateUrl: './vendeurs-admin.component.html',
  styleUrl: './vendeurs-admin.component.css'
})
export class VendeursAdminComponent implements OnInit {
  vendeurs: any[] = [];
  filteredVendeurs: any[] = [];
  searchTerm: string = '';

  // Modal Ajout
  showModal = false;
  newVendeur = {
    nom: '',
    email: '',
    role: 'vendeur' as const,
    isActive: true,
    createdAt: new Date().toISOString()
  };

  // Suppression
  vendeurToDelete: any = null;
  showDeleteConfirm = false;

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

  // ====================== SUPPRESSION VENDEUR + BOUTIQUES + PRODUITS ======================
  confirmDeleteVendeur(vendeur: any) {
    this.vendeurToDelete = vendeur;
    this.showDeleteConfirm = true;
  }

  async deleteVendeurConfirmed() {
    if (!this.vendeurToDelete) return;

    const confirmMsg = `Voulez-vous vraiment supprimer le vendeur "${this.vendeurToDelete.nom}" ?\n\nToutes ses boutiques et tous leurs produits seront également supprimés de façon irréversible.`;
    
    if (!confirm(confirmMsg)) {
      this.cancelDelete();
      return;
    }

    try {
      console.log(`🗑️ Suppression du vendeur: ${this.vendeurToDelete.nom}`);

      // 1. Récupérer toutes les boutiques du vendeur
      const allBoutiques = await this.boutiqueService.getAllBoutiques();
      const boutiquesDuVendeur = allBoutiques.filter((b: any) => 
        b.vendeurId === this.vendeurToDelete.uid || 
        b.vendeurId === this.vendeurToDelete.id
      );

      let totalProduitsSupprimes = 0;

      // 2. Pour chaque boutique : supprimer ses produits
      for (const boutique of boutiquesDuVendeur) {
        const produits = await this.produitService.getProductsByBoutique(boutique.id);
        
        for (const produit of produits) {
          await this.produitService.deleteProduit(produit.id);
          totalProduitsSupprimes++;
        }

        // 3. Supprimer la boutique
        await this.boutiqueService.deleteBoutique(boutique.id);
        console.log(`   → Boutique supprimée: ${boutique.nom}`);
      }

      // 4. Supprimer le vendeur
      await this.firebase.deleteData('users', this.vendeurToDelete.id);

      alert(`✅ Vendeur "${this.vendeurToDelete.nom}" supprimé avec succès !\n` +
            `${boutiquesDuVendeur.length} boutique(s) et ${totalProduitsSupprimes} produit(s) ont été supprimés.`);

      this.cancelDelete();
      await this.loadVendeurs();

    } catch (error) {
      console.error('Erreur lors de la suppression du vendeur:', error);
      alert("❌ Une erreur est survenue lors de la suppression.");
    }
  }

  cancelDelete() {
    this.showDeleteConfirm = false;
    this.vendeurToDelete = null;
  }
}
