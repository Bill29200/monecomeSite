import { Component, OnInit } from '@angular/core';
import { FirebaseService } from '../../../services/firebase.service';

@Component({
  selector: 'app-accueil',
  templateUrl: './accueil.component.html',
  styleUrl: './accueil.component.css'
})
export class AccueilComponent implements OnInit {
  produits: any[] = [];
  boutiques: any[] = [];
  categories: any[] = [];
  filteredProducts: any[] = [];
  
  searchTerm: string = '';
  selectedCategory: string = 'Tous';
  sortBy: string = 'pertinence';
  
  loading: boolean = true;

  stats = {
    boutiques: 0,
    produits: 0,
    categories: 0
  };

  popularSearches: string[] = ['iPhone', 'Sneakers', 'Montre', 'Sac', 'Robot Cuisine', 'MacBook'];

  constructor(private firebase: FirebaseService) {}

  async ngOnInit() {
    await this.loadData();
  }

  async loadData() {
    try {
      this.produits = await this.firebase.getProducts();
      this.boutiques = await this.firebase.getShops();

      // Calcul des stats
      this.stats.produits = this.produits.length;
      this.stats.boutiques = this.boutiques.length;
      
      const cats = new Set(this.produits.map(p => p.category || p.categorie).filter(Boolean));
      this.categories = ['Tous', ...Array.from(cats)];
      this.stats.categories = cats.size;

      this.applyFilters();
      this.loading = false;
    } catch (error) {
      console.error('Erreur chargement données:', error);
      this.loading = false;
    }
  }

  applyFilters() {
    let filtered = [...this.produits];

    // Recherche
    if (this.searchTerm) {
      const term = this.searchTerm.toLowerCase();
      filtered = filtered.filter(p => 
        p.nom?.toLowerCase().includes(term) || 
        p.description?.toLowerCase().includes(term) ||
        (p.category || p.categorie)?.toLowerCase().includes(term)
      );
    }

    // Filtre catégorie
    if (this.selectedCategory !== 'Tous') {
      filtered = filtered.filter(p => 
        (p.category || p.categorie) === this.selectedCategory
      );
    }

    // Tri
    switch(this.sortBy) {
      case 'prix_asc':
        filtered.sort((a, b) => (a.price || a.prix || 0) - (b.price || b.prix || 0));
        break;
      case 'prix_desc':
        filtered.sort((a, b) => (b.price || b.prix || 0) - (a.price || a.prix || 0));
        break;
      case 'popularite':
        filtered.sort((a, b) => (b.reviews || 0) - (a.reviews || 0));
        break;
      default:
        filtered.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    }

    this.filteredProducts = filtered;
  }

  resetFilters() {
    this.searchTerm = '';
    this.selectedCategory = 'Tous';
    this.sortBy = 'pertinence';
    this.applyFilters();
  }

  getBoutiqueName(boutiqueId: string): string {
    const boutique = this.boutiques.find(b => b.id === boutiqueId);
    return boutique?.nom || 'Boutique partenaire';
  }

  addToCart(product: any) {
    let cart = JSON.parse(localStorage.getItem('cart') || '[]');
    const existing = cart.find((item: any) => item.id === product.id);
    
    if (existing) {
      existing.quantite++;
    } else {
      cart.push({
        id: product.id,
        nom: product.nom,
        prix: product.price || product.prix,
        quantite: 1,
        imageUrl: product.imageUrl
      });
    }
    
    localStorage.setItem('cart', JSON.stringify(cart));
    alert(`✅ ${product.nom} ajouté au panier !`);
  }

  quickView(product: any) {
    alert(`👁️ Aperçu rapide : ${product.nom}\nPrix : ${(product.price || product.prix)} €`);
  }
}
