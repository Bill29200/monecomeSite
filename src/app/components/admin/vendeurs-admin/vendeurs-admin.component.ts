import { Component, OnInit } from '@angular/core';
import { FirebaseService } from '../../../services/firebase.service';
import { BoutiqueService } from '../../../services/boutique.service';
import { ProduitService } from '../../../services/produit.service';
import { getAuth, createUserWithEmailAndPassword, updateEmail, updatePassword } from 'firebase/auth';

@Component({
  selector: 'app-vendeurs-admin',
  templateUrl: './vendeurs-admin.component.html',
  styleUrl: './vendeurs-admin.component.css'
})
export class VendeursAdminComponent implements OnInit {
  vendeurs: any[] = [];
  filteredVendeurs: any[] = [];
  searchTerm: string = '';

  // Modal Ajout/Modification
  showModal = false;
  editingVendeur: any = null;
  saving = false;
  
  formVendeur = {
    nom: '',
    email: '',
    password: '',
    telephone: '',
    isActive: true,
    role: 'vendeur' as const
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

  // ====================== AJOUT / MODIFICATION ======================
  openAddModal() {
    this.editingVendeur = null;
    this.formVendeur = {
      nom: '',
      email: '',
      password: '',
      telephone: '',
      isActive: true,
      role: 'vendeur'
    };
    this.showModal = true;
  }

  openEditModal(vendeur: any) {
    this.editingVendeur = vendeur;
    this.formVendeur = {
      nom: vendeur.nom || '',
      email: vendeur.email || '',
      password: '',
      telephone: vendeur.telephone || '',
      isActive: vendeur.isActive !== false,
      role: 'vendeur'
    };
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
    this.editingVendeur = null;
    this.saving = false;
  }

  async saveVendeur() {
    if (!this.formVendeur.nom || !this.formVendeur.email) {
      alert("Nom et email sont obligatoires");
      return;
    }

    if (!this.editingVendeur && !this.formVendeur.password) {
      alert("Mot de passe obligatoire pour un nouveau vendeur");
      return;
    }

    if (!this.editingVendeur && this.formVendeur.password.length < 6) {
      alert("Le mot de passe doit contenir au moins 6 caractères");
      return;
    }

    this.saving = true;

    try {
      const auth = getAuth();

      if (this.editingVendeur) {
        // ===== MODIFICATION =====
        const updateData: any = {
          nom: this.formVendeur.nom,
          telephone: this.formVendeur.telephone,
          isActive: this.formVendeur.isActive,
          updatedAt: new Date().toISOString()
        };

        // Mise à jour Firebase Auth (email)
        if (this.formVendeur.email !== this.editingVendeur.email) {
          const user = auth.currentUser;
          if (user) {
            await updateEmail(user, this.formVendeur.email);
          }
          updateData.email = this.formVendeur.email;
        }

        // Mise à jour mot de passe si fourni
        if (this.formVendeur.password) {
          const user = auth.currentUser;
          if (user) {
            await updatePassword(user, this.formVendeur.password);
          }
        }

        await this.firebase.updateData('users', this.editingVendeur.id, updateData);
        alert(`✅ Vendeur "${this.formVendeur.nom}" modifié avec succès !`);
        
      } else {
        // ===== CRÉATION =====
        const userCredential = await createUserWithEmailAndPassword(
          auth,
          this.formVendeur.email,
          this.formVendeur.password
        );

        const vendeurData = {
          uid: userCredential.user.uid,
          nom: this.formVendeur.nom,
          email: this.formVendeur.email,
          telephone: this.formVendeur.telephone,
          role: 'vendeur',
          isActive: this.formVendeur.isActive,
          createdAt: new Date().toISOString()
        };

        await this.firebase.addData('users', vendeurData);
        alert(`✅ Vendeur "${this.formVendeur.nom}" ajouté avec succès !`);
      }

      this.closeModal();
      await this.loadVendeurs();
      
    } catch (error: any) {
      console.error('Erreur:', error);
      if (error.code === 'auth/email-already-in-use') {
        alert("❌ Cet email est déjà utilisé");
      } else if (error.code === 'auth/weak-password') {
        alert("❌ Mot de passe trop faible (minimum 6 caractères)");
      } else {
        alert("❌ Erreur: " + (error.message || "Veuillez réessayer"));
      }
    } finally {
      this.saving = false;
    }
  }

  // ====================== SUPPRESSION ======================
  confirmDeleteVendeur(vendeur: any) {
    this.vendeurToDelete = vendeur;
    this.showDeleteConfirm = true;
  }

  cancelDelete() {
    this.showDeleteConfirm = false;
    this.vendeurToDelete = null;
  }

  async deleteVendeurConfirmed() {
    if (!this.vendeurToDelete) return;

    try {
      // 1. Récupérer toutes les boutiques du vendeur
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

      alert(`✅ Vendeur "${this.vendeurToDelete.nom}" supprimé !\n` +
            `${boutiquesDuVendeur.length} boutique(s) et ${totalProduitsSupprimes} produit(s) supprimés.`);

      this.cancelDelete();
      await this.loadVendeurs();

    } catch (error) {
      console.error('Erreur suppression:', error);
      alert("❌ Une erreur est survenue lors de la suppression");
    }
  }
}
