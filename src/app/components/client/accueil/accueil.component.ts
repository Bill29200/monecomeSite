import { Component, OnInit } from '@angular/core';
import { FirebaseService } from '../../../services/firebase.service';

@Component({
  selector: 'app-accueil',
  templateUrl: './accueil.component.html',
  styleUrls: ['./accueil.component.css']
})
export class AccueilComponent implements OnInit {
  produits: any[] = [];
  categories: any[] = [];
  categoriesList: any[] = [];
  filteredCategories: any[] = [];
  loading: boolean = true;
  searchTerm: string = '';
  selectedCategorie: string = 'tous';

  constructor(private firebase: FirebaseService) {}

  async ngOnInit() {
    await this.loadData();
  }

  async loadData() {
    try {
      const allProduits = await this.firebase.getProducts();
      this.produits = allProduits.filter(p => p.isActive !== false);
      
      // Grouper les produits par catégorie
      const categoriesMap = new Map();
      
      this.produits.forEach(produit => {
        const categorie = produit.category || 'Autres';
        if (!categoriesMap.has(categorie)) {
          categoriesMap.set(categorie, []);
        }
        categoriesMap.get(categorie).push(produit);
      });
      
      this.categories = Array.from(categoriesMap.entries()).map(([nom, produits]) => ({
        nom: nom,
        produits: produits
      }));
      
      this.categoriesList = this.categories;
      this.filteredCategories = this.categories;
      this.loading = false;
    } catch (error) {
      console.error('Erreur chargement:', error);
      this.loading = false;
    }
  }

  filterByCategorie(categorie: string) {
    this.selectedCategorie = categorie;
    this.searchTerm = '';
    
    if (categorie === 'tous') {
      this.filteredCategories = this.categories;
    } else {
      const found = this.categories.find(c => c.nom === categorie);
      this.filteredCategories = found ? [found] : [];
    }
  }

  onSearchChange() {
    if (this.searchTerm === '') {
      this.filterByCategorie(this.selectedCategorie);
    }
  }

  filterProduits() {
    if (!this.searchTerm) {
      this.filterByCategorie(this.selectedCategorie);
      return;
    }
    
    const term = this.searchTerm.toLowerCase();
    const filteredProduits = this.produits.filter(p => 
      p.nom?.toLowerCase().includes(term) || 
      p.description?.toLowerCase().includes(term)
    );
    
    const categoriesMap = new Map();
    filteredProduits.forEach(produit => {
      const categorie = produit.category || 'Autres';
      if (!categoriesMap.has(categorie)) {
        categoriesMap.set(categorie, []);
      }
      categoriesMap.get(categorie).push(produit);
    });
    
    this.filteredCategories = Array.from(categoriesMap.entries()).map(([nom, produits]) => ({
      nom: nom,
      produits: produits
    }));
  }

  getDiscountPercentage(ancienPrix: number, prix: number): number {
    if (!ancienPrix || ancienPrix <= prix) return 0;
    return Math.round((ancienPrix - prix) / ancienPrix * 100);
  }

  getCategoryIcon(category: string): string {
    const icons: any = {
      'Électronique': 'bi bi-laptop',
      'Mode': 'bi bi-bag',
      'Maison': 'bi bi-house',
      'Beauté': 'bi bi-droplet',
      'Sport': 'bi bi-bicycle',
      'Jouets': 'bi bi-toy',
      'Livres': 'bi bi-book',
      'Alimentation': 'bi bi-egg-fried',
      'Auto': 'bi bi-car-front',
      'Jardin': 'bi bi-flower1',
      'Autres': 'bi bi-tag'
    };
    return icons[category] || 'bi bi-tag';
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
        prix: product.prix || product.price,
        quantite: 1,
        imageUrl: product.imageUrl || product.imageBase64
      });
    }
    
    localStorage.setItem('cart', JSON.stringify(cart));
    alert(`✅ ${product.nom} ajouté au panier !`);
  }
}
