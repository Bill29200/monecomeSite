import { Component, OnInit } from '@angular/core';
import { BoutiqueService } from '../../../services/boutique.service';
import { FirebaseService } from '../../../services/firebase.service';
import { ProduitService } from '../../../services/produit.service';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';

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

  boutiqueToDelete: any = null;
  showDeleteConfirm = false;

  // Modal Nouveau Vendeur
  showVendeurModal = false;
  savingVendeur = false;
  newVendeur = {
    nom: '',
    email: '',
    password: '',
    role: 'vendeur' as const,
    createdAt: new Date().toISOString()
  };

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

  closeModal() {
    this.showModal = false;
    this.editingBoutique = null;
    this.resetForm();
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

  async saveBoutique() {
    if (!this.newBoutique.nom || !this.newBoutique.vendeurId) {
      alert("Veuillez remplir tous les champs obligatoires");
      return;
    }

    try {
      if (this.editingBoutique) {
        await this.boutiqueService.updateBoutique(this.editingBoutique.id, this.newBoutique);
        alert("✅ Boutique modifiée avec succès");
      } else {
        await this.boutiqueService.createBoutique(this.newBoutique);
        alert("✅ Boutique créée avec succès");
      }
      this.closeModal();
      await this.loadData();
    } catch (error) {
      console.error(error);
      alert("❌ Erreur lors de l'enregistrement");
    }
  }

  // ====================== GESTION NOUVEAU VENDEUR ======================
  openNewVendeurModal() {
    this.newVendeur = {
      nom: '',
      email: '',
      password: '',
      role: 'vendeur',
      createdAt: new Date().toISOString()
    };
    this.showVendeurModal = true;
  }

  closeVendeurModal() {
    this.showVendeurModal = false;
    this.savingVendeur = false;
  }

  async createVendeurAndSelect() {
    if (!this.newVendeur.nom || !this.newVendeur.email || !this.newVendeur.password) {
      alert("Veuillez remplir tous les champs");
      return;
    }

    this.savingVendeur = true;

    try {
      // 1. Créer l'utilisateur dans Firebase Auth
      const auth = getAuth();
      const userCredential = await createUserWithEmailAndPassword(
        auth, 
        this.newVendeur.email, 
        this.newVendeur.password
      );

      // 2. Sauvegarder les données du vendeur dans Realtime Database
      const vendeurData = {
        uid: userCredential.user.uid,
        nom: this.newVendeur.nom,
        email: this.newVendeur.email,
        role: 'vendeur',
        createdAt: new Date().toISOString(),
        isActive: true
      };

      const vendeurId = await this.firebase.addData('users', vendeurData);
      
      // 3. Recharger la liste des vendeurs
      await this.loadData();
      
      // 4. Sélectionner automatiquement le nouveau vendeur
      this.newBoutique.vendeurId = vendeurId;
      this.newBoutique.vendeurNom = this.newVendeur.nom;
      this.newBoutique.vendeurEmail = this.newVendeur.email;
      
      // 5. Fermer le modal vendeur
      this.closeVendeurModal();
      
      alert(`✅ Vendeur "${this.newVendeur.nom}" créé avec succès et sélectionné !`);
      
    } catch (error: any) {
      console.error('Erreur création vendeur:', error);
      if (error.code === 'auth/email-already-in-use') {
        alert("❌ Cet email est déjà utilisé");
      } else {
        alert("❌ Erreur lors de la création du vendeur: " + error.message);
      }
    } finally {
      this.savingVendeur = false;
    }
  }

  // ====================== SUPPRESSION ======================
  confirmDelete(boutique: any) {
    this.boutiqueToDelete = boutique;
    this.showDeleteConfirm = true;
  }

  cancelDelete() {
    this.showDeleteConfirm = false;
    this.boutiqueToDelete = null;
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
      
      this.cancelDelete();
      await this.loadData();
    } catch (error) {
      console.error(error);
      alert("❌ Une erreur est survenue lors de la suppression");
    }
  }
}
