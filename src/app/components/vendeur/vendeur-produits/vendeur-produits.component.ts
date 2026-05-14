import { Component, OnInit } from '@angular/core';
import { VendeurService } from '../../../services/vendeur.service';
import { Boutique } from '../../../models/boutique.model';
import { Produit } from '../../../models/produit.model';

@Component({
  selector: 'app-vendeur-produits',
  templateUrl: './vendeur-produits.component.html',
  styleUrls: ['./vendeur-produits.component.css']
})
export class VendeurProduitsComponent implements OnInit {
  boutiques: Boutique[] = [];
  boutiqueSelectionnee: Boutique | null = null;
  produits: Produit[] = [];
  filteredProduits: Produit[] = [];
  searchTerm: string = '';
  
  showModal = false;
  editingProduit: any = null;
  saving = false;
  showBoutiqueModal = false;
  creatingNewBoutique = false;
  
  newBoutiqueData = {
    nom: '',
    description: '',
    adresse: '',
    telephone: ''
  };
  
  newProduit = {
    nom: '',
    description: '',
    prix: 0,
    ancienPrix: 0,
    stock: 0,
    category: '',
    imageBase64: '',  // Changé: imageUrl devient imageBase64
    isActive: true,
    isHot: false,
    isNew: true
  };

  // Upload image
  selectedImage: File | null = null;
  imagePreview: string | null = null;

  categories = ['Électronique', 'Mode', 'Maison', 'Beauté', 'Sport', 'Jouets', 'Livres', 'Alimentation', 'Auto', 'Jardin'];

  constructor(private vendeurService: VendeurService) {}

  async ngOnInit() {
    await this.loadBoutiques();
    
    const savedBoutiqueId = localStorage.getItem('boutiqueVendeurId');
    if (savedBoutiqueId && this.boutiques.length > 0) {
      this.boutiqueSelectionnee = this.boutiques.find(b => b.id === savedBoutiqueId) || this.boutiques[0];
    } else if (this.boutiques.length > 0) {
      this.boutiqueSelectionnee = this.boutiques[0];
    }
    
    if (this.boutiqueSelectionnee) {
      await this.loadProduits();
    }
  }

  async loadBoutiques() {
    this.boutiques = await this.vendeurService.getCurrentVendeurBoutiques();
  }

  async selectBoutique(boutique: Boutique) {
    this.boutiqueSelectionnee = boutique;
    localStorage.setItem('boutiqueVendeurId', boutique.id!);
    await this.loadProduits();
  }

  async loadProduits() {
    if (this.boutiqueSelectionnee) {
      this.produits = await this.vendeurService.getBoutiqueProduits(this.boutiqueSelectionnee.id!);
      this.filteredProduits = [...this.produits];
    }
  }

  filterProduits() {
    const term = this.searchTerm.toLowerCase();
    this.filteredProduits = this.produits.filter(p => 
      p.nom?.toLowerCase().includes(term) || 
      p.category?.toLowerCase().includes(term)
    );
  }

  openAddModal() {
    if (this.boutiques.length === 0) {
      alert("Vous devez d'abord créer une boutique");
      this.openBoutiqueModal();
      return;
    }
    this.editingProduit = null;
    this.newProduit = {
      nom: '', description: '', prix: 0, ancienPrix: 0, stock: 0,
      category: '', imageBase64: '', isActive: true, isHot: false, isNew: true
    };
    this.selectedImage = null;
    this.imagePreview = null;
    this.showModal = true;
  }

  openEditModal(produit: any) {
    this.editingProduit = produit;
    this.newProduit = { ...produit };
    this.imagePreview = produit.imageBase64 || null;
    this.selectedImage = null;
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
    this.editingProduit = null;
    this.selectedImage = null;
    this.imagePreview = null;
  }

  openBoutiqueModal() {
    this.newBoutiqueData = { nom: '', description: '', adresse: '', telephone: '' };
    this.showBoutiqueModal = true;
  }

  closeBoutiqueModal() {
    this.showBoutiqueModal = false;
    this.creatingNewBoutique = false;
  }

  async createBoutiqueAndSelect() {
    if (!this.newBoutiqueData.nom) {
      alert("Le nom de la boutique est obligatoire");
      return;
    }

    this.creatingNewBoutique = true;

    try {
      const boutiqueId = await this.vendeurService.createBoutique(this.newBoutiqueData);
      await this.loadBoutiques();
      
      this.boutiqueSelectionnee = this.boutiques.find(b => b.id === boutiqueId) || null;
      if (this.boutiqueSelectionnee) {
        localStorage.setItem('boutiqueVendeurId', this.boutiqueSelectionnee.id!);
        await this.loadProduits();
      }
      
      this.closeBoutiqueModal();
      alert("✅ Boutique créée avec succès ! Vous pouvez maintenant ajouter des produits.");
      this.openAddModal();
    } catch (error) {
      console.error(error);
      alert("❌ Erreur lors de la création de la boutique");
    } finally {
      this.creatingNewBoutique = false;
    }
  }

  // Convertir l'image en Base64 (stockée directement dans la base de données)
  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];
      
      if (!file.type.startsWith('image/')) {
        alert("Veuillez sélectionner une image");
        return;
      }
      
      if (file.size > 5 * 1024 * 1024) {
        alert("L'image ne doit pas dépasser 5MB");
        return;
      }
      
      this.selectedImage = file;
      
      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreview = reader.result as string;
        // Stocker l'image en Base64
        this.newProduit.imageBase64 = reader.result as string;
      };
      reader.readAsDataURL(file);
    }
  }

  async saveProduit() {
    if (!this.newProduit.nom || !this.newProduit.prix || !this.newProduit.category) {
      alert("Veuillez remplir tous les champs obligatoires");
      return;
    }

    if (!this.boutiqueSelectionnee) {
      alert("Veuillez sélectionner une boutique");
      return;
    }

    this.saving = true;

    try {
      const produitData: any = {
        nom: this.newProduit.nom,
        description: this.newProduit.description,
        prix: this.newProduit.prix,
        ancienPrix: this.newProduit.ancienPrix,
        stock: this.newProduit.stock,
        category: this.newProduit.category,
        imageBase64: this.newProduit.imageBase64,  // Stocker l'image en Base64
        isActive: this.newProduit.isActive,
        isHot: this.newProduit.isHot,
        isNew: this.newProduit.isNew,
        updatedAt: new Date().toISOString()
      };

      if (this.editingProduit) {
        await this.vendeurService.updateProduit(this.editingProduit.id, produitData);
        alert("✅ Produit modifié avec succès");
      } else {
        produitData.boutiqueId = this.boutiqueSelectionnee.id;
        produitData.createdAt = new Date().toISOString();
        await this.vendeurService.createProduit(this.boutiqueSelectionnee.id!, produitData);
        alert("✅ Produit ajouté avec succès");
      }

      this.closeModal();
      await this.loadProduits();
    } catch (error) {
      console.error(error);
      alert("❌ Erreur lors de l'enregistrement: " + (error as Error).message);
    } finally {
      this.saving = false;
    }
  }

  async deleteProduit(produit: any) {
    if (confirm(`Supprimer le produit "${produit.nom}" ?`)) {
      await this.vendeurService.deleteProduit(produit.id);
      await this.loadProduits();
      alert("✅ Produit supprimé");
    }
  }

  getImageUrl(produit: any): string {
    // Utiliser l'image Base64 ou une image par défaut
    return produit.imageBase64 || `https://picsum.photos/400/300?random=${produit.id}`;
  }
}
