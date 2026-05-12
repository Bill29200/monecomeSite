import { Component, OnInit } from '@angular/core';
import { FirebaseService } from '../../../services/firebase.service';

@Component({
  selector: 'app-accueil',
  template: `
    <div class="container mt-4">
      <!-- Loading -->
      <div *ngIf="loading" class="text-center py-5">
        <div class="spinner-border text-primary" style="width: 3rem; height: 3rem;" role="status">
          <span class="visually-hidden">Chargement...</span>
        </div>
        <h5 class="mt-3">Chargement des produits...</h5>
      </div>

      <!-- Content -->
      <div *ngIf="!loading">
        <!-- Hero -->
        <div class="hero-section text-center text-white p-5 mb-4 rounded">
          <h1 class="display-4">🏪 Monecome</h1>
          <p class="lead">Votre plateforme de boutiques en ligne</p>
          <p class="mb-0">{{ produits.length }} produits disponibles</p>
        </div>

        <!-- Stats -->
        <div class="row mb-4">
          <div class="col-md-3 mb-3">
            <div class="card text-center">
              <div class="card-body">
                <i class="bi bi-box-seam fs-1 text-primary"></i>
                <h3 class="mt-2">{{ produits.length }}</h3>
                <p class="text-muted">Produits</p>
              </div>
            </div>
          </div>
          <div class="col-md-3 mb-3">
            <div class="card text-center">
              <div class="card-body">
                <i class="bi bi-tags fs-1 text-primary"></i>
                <h3 class="mt-2">{{ categories.length }}</h3>
                <p class="text-muted">Catégories</p>
              </div>
            </div>
          </div>
          <div class="col-md-3 mb-3">
            <div class="card text-center">
              <div class="card-body">
                <i class="bi bi-star-fill fs-1 text-primary"></i>
                <h3 class="mt-2">{{ featuredProducts.length }}</h3>
                <p class="text-muted">Produits vedettes</p>
              </div>
            </div>
          </div>
          <div class="col-md-3 mb-3">
            <div class="card text-center">
              <div class="card-body">
                <i class="bi bi-building fs-1 text-primary"></i>
                <h3 class="mt-2">{{ boutiques.length }}</h3>
                <p class="text-muted">Boutiques</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Catégories -->
        <div *ngIf="categories.length > 0" class="mb-5">
          <h3 class="mb-3">📂 Catégories</h3>
          <div class="row">
            <div class="col-md-2 col-4 mb-2" *ngFor="let cat of categories">
              <div class="card category-card text-center" (click)="selectedCategory = cat.nom">
                <div class="card-body p-3">
                  <i class="bi bi-tag fs-2"></i>
                  <p class="mb-0 mt-2 small">{{ cat.nom }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Filtres -->
        <div class="card mb-4">
          <div class="card-body">
            <div class="row g-3">
              <div class="col-md-6">
                <input type="text" class="form-control" placeholder="🔍 Rechercher un produit..." [(ngModel)]="searchTerm">
              </div>
              <div class="col-md-6">
                <select class="form-select" [(ngModel)]="selectedCategory">
                  <option value="">Toutes les catégories</option>
                  <option *ngFor="let cat of categories" [value]="cat.nom">{{ cat.nom }}</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        <!-- Produits -->
        <div class="row">
          <div class="col-md-4 col-lg-3 mb-4" *ngFor="let produit of filteredProducts">
            <div class="card product-card h-100">
              <img [src]="produit.imageUrl || 'https://via.placeholder.com/300x200?text=' + produit.nom" 
                   class="card-img-top" 
                   style="height: 200px; object-fit: cover;"
                   (error)="produit.imageUrl = 'https://via.placeholder.com/300x200?text=Produit'">
              <div class="card-body">
                <span class="badge bg-primary mb-2">{{ produit.category || produit.categorie }}</span>
                <h5 class="card-title">{{ produit.nom }}</h5>
                <p class="card-text text-muted small">{{ (produit.description || 'Description non disponible') | slice:0:80 }}</p>
                <h4 class="text-primary mb-0">{{ produit.price || produit.prix }} €</h4>
              </div>
              <div class="card-footer bg-white border-0 pb-3">
                <button class="btn btn-primary w-100" (click)="addToCart(produit)">
                  <i class="bi bi-cart-plus"></i> Ajouter
                </button>
              </div>
            </div>
          </div>
        </div>

        <div *ngIf="filteredProducts.length === 0" class="text-center py-5">
          <i class="bi bi-emoji-frown fs-1 text-muted"></i>
          <h4 class="mt-3">Aucun produit trouvé</h4>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .hero-section {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    }
    .category-card {
      cursor: pointer;
      transition: transform 0.2s;
      border: 1px solid #e0e0e0;
    }
    .category-card:hover {
      transform: translateY(-5px);
      border-color: #667eea;
      box-shadow: 0 5px 15px rgba(0,0,0,0.1);
    }
    .product-card {
      transition: transform 0.2s;
      cursor: pointer;
    }
    .product-card:hover {
      transform: translateY(-5px);
      box-shadow: 0 5px 15px rgba(0,0,0,0.1);
    }
    .card-img-top {
      background-color: #f8f9fa;
    }
  `]
})
export class AccueilComponent implements OnInit {
  produits: any[] = [];
  boutiques: any[] = [];
  categories: any[] = [];
  featuredProducts: any[] = [];
  searchTerm: string = '';
  selectedCategory: string = '';
  loading: boolean = true;

  constructor(private firebase: FirebaseService) {}

  async ngOnInit() {
    await this.loadData();
  }

  async loadData() {
    try {
      // Charger les produits
      this.produits = await this.firebase.getProducts();
      console.log('Produits:', this.produits);
      
      // Charger les boutiques
      this.boutiques = await this.firebase.getShops();
      
      // Extraire les catégories uniques
      const cats = new Set(this.produits.map(p => p.category || p.categorie).filter(c => c));
      this.categories = Array.from(cats).map(cat => ({ nom: cat }));
      
      // Produits vedettes
      this.featuredProducts = this.produits.filter(p => p.isFeatured === true);
      
      this.loading = false;
    } catch (error) {
      console.error('Erreur:', error);
      this.loading = false;
    }
  }

  get filteredProducts() {
    let filtered = [...this.produits];
    
    if (this.searchTerm) {
      const term = this.searchTerm.toLowerCase();
      filtered = filtered.filter(p => 
        p.nom?.toLowerCase().includes(term) || 
        p.description?.toLowerCase().includes(term)
      );
    }
    
    if (this.selectedCategory) {
      filtered = filtered.filter(p => 
        (p.category || p.categorie) === this.selectedCategory
      );
    }
    
    return filtered;
  }

  addToCart(produit: any) {
    let cart = JSON.parse(localStorage.getItem('cart') || '[]');
    const existing = cart.find((item: any) => item.id === produit.id);
    
    if (existing) {
      existing.quantite++;
    } else {
      cart.push({
        id: produit.id,
        nom: produit.nom,
        prix: produit.price || produit.prix,
        quantite: 1,
        imageUrl: produit.imageUrl
      });
    }
    
    localStorage.setItem('cart', JSON.stringify(cart));
    alert(`✓ ${produit.nom} ajouté au panier`);
  }
}
