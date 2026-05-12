import { Component, OnInit } from '@angular/core';
import { FirebaseService } from '../../../services/firebase.service';

@Component({
  selector: 'app-accueil',
  template: `
    <div class="modern-shop">
      <!-- Hero Section Premium -->
      <section class="hero-premium">
        <div class="hero-bg-animation"></div>
        <div class="container">
          <div class="hero-content">
            <div class="hero-text">
              <span class="hero-badge">🌟 Bienvenue sur Monecome</span>
              <h1 class="hero-title">
                Découvrez l'art de<br>
                <span class="gradient-text">shopping moderne</span>
              </h1>
              <p class="hero-description">
                Explorez notre marketplace premium avec +{{ produits.length }} produits 
                de qualité dans {{ categories.length }} catégories
              </p>
              <div class="hero-stats">
                <div class="stat">
                  <div class="stat-number">{{ boutiques.length }}</div>
                  <div class="stat-label">Boutiques</div>
                </div>
                <div class="stat-divider"></div>
                <div class="stat">
                  <div class="stat-number">{{ produits.length }}</div>
                  <div class="stat-label">Produits</div>
                </div>
                <div class="stat-divider"></div>
                <div class="stat">
                  <div class="stat-number">{{ categories.length }}</div>
                  <div class="stat-label">Catégories</div>
                </div>
              </div>
            </div>
            <div class="hero-search">
              <div class="search-card">
                <div class="search-header">
                  <i class="bi bi-search"></i>
                  <input type="text" 
                         placeholder="Rechercher un produit, une boutique..."
                         [(ngModel)]="searchTerm"
                         (input)="applyFilters()">
                </div>
                <div class="search-filters" *ngIf="popularSearches.length">
                  <span>Recherches populaires :</span>
                  <button *ngFor="let term of popularSearches" 
                          (click)="searchTerm = term; applyFilters()">
                    {{ term }}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="hero-wave">
          <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 64L60 69.3C120 75 240 85 360 80C480 75 600 53 720 48C840 43 960 53 1080 58.7C1200 64 1320 64 1380 64L1440 64L1440 120L1380 120C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120L0 120Z" fill="white"/>
          </svg>
        </div>
      </section>

      <div class="container main-container" *ngIf="!loading; else loader">
        <!-- Catégories Premium -->
        <div class="categories-premium mb-5">
          <div class="section-header">
            <div>
              <span class="section-badge">Catégories</span>
              <h2 class="section-title">Explorez par catégorie</h2>
            </div>
            <button class="view-all" (click)="showAllCategories = !showAllCategories">
              {{ showAllCategories ? 'Voir moins' : 'Voir tout' }}
              <i class="bi" [class.bi-arrow-up]="showAllCategories" [class.bi-arrow-right]="!showAllCategories"></i>
            </button>
          </div>
          <div class="categories-grid">
            <div class="category-premium" 
                 *ngFor="let cat of (showAllCategories ? categories : categories.slice(0, 8))"
                 (click)="selectedCategory = cat.nom; applyFilters()"
                 [class.active]="selectedCategory === cat.nom">
              <div class="category-icon" [style.background]="getCategoryColor(cat.nom)">
                <i [class]="getCategoryIcon(cat.nom)"></i>
              </div>
              <div class="category-details">
                <h6>{{ cat.nom }}</h6>
                <span>{{ getProductCountByCategory(cat.nom) }} produits</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Filtres actifs -->
        <div class="active-filters" *ngIf="selectedCategory || searchTerm">
          <div class="filter-chip" *ngIf="selectedCategory">
            <span>{{ selectedCategory }}</span>
            <i class="bi bi-x" (click)="selectedCategory = ''; applyFilters()"></i>
          </div>
          <div class="filter-chip" *ngIf="searchTerm">
            <span>Recherche : {{ searchTerm }}</span>
            <i class="bi bi-x" (click)="clearSearch()"></i>
          </div>
          <button class="clear-all" (click)="resetFilters()">Tout effacer</button>
        </div>

        <!-- Sidebar + Products Layout -->
        <div class="shop-layout">
          <!-- Sidebar Filtres -->
          <aside class="shop-sidebar">
            <div class="filter-group">
              <h4>Prix</h4>
              <div class="price-range">
                <input type="range" min="0" [max]="maxPrice" [(ngModel)]="priceRange" (change)="applyFilters()">
                <div class="price-values">
                  <span>0 €</span>
                  <span>{{ priceRange }} €</span>
                </div>
              </div>
            </div>

            <div class="filter-group">
              <h4>Note minimum</h4>
              <div class="rating-filter">
                <div class="rating-option" *ngFor="let rating of [4.5, 4, 3.5]" (click)="minRating = rating; applyFilters()">
                  <div class="stars">
                    <i class="bi bi-star-fill" *ngFor="let star of getStars(rating)"></i>
                    <i class="bi bi-star" *ngFor="let star of getEmptyStars(rating)"></i>
                  </div>
                  <span class="ms-2">{{ rating }}+</span>
                </div>
              </div>
            </div>

            <div class="filter-group">
              <h4>Livraison</h4>
              <label class="checkbox-label">
                <input type="checkbox" [(ngModel)]="freeShipping" (change)="applyFilters()">
                <span>Livraison gratuite</span>
              </label>
            </div>
          </aside>

          <!-- Products Grid -->
          <main class="products-main">
            <div class="products-header">
              <div class="results-info">
                <strong>{{ filteredProducts.length }}</strong> produits trouvés
              </div>
              <div class="sort-options">
                <span>Trier par :</span>
                <select [(ngModel)]="sortBy" (change)="applyFilters()">
                  <option value="pertinence">Pertinence</option>
                  <option value="prix_asc">Prix croissant</option>
                  <option value="prix_desc">Prix décroissant</option>
                  <option value="popularite">Les plus populaires</option>
                </select>
              </div>
            </div>

            <div class="products-grid">
              <div class="product-premium" *ngFor="let produit of filteredProducts; let i = index"
                   [style.animation-delay]="i * 0.05 + 's'">
                <div class="product-badges">
                  <span class="badge-hot" *ngIf="produit.isHot">🔥 Hot</span>
                  <span class="badge-new" *ngIf="produit.isNew">Nouveau</span>
                  <span class="badge-sale" *ngIf="produit.discount">-{{ produit.discount }}%</span>
                </div>
                <div class="product-image-wrapper">
                  <img [src]="produit.imageUrl || 'https://picsum.photos/400/300?random=' + i" [alt]="produit.nom">
                  <div class="product-actions">
                    <button class="action-btn" (click)="quickView(produit)" title="Aperçu rapide">
                      <i class="bi bi-eye"></i>
                    </button>
                    <button class="action-btn" (click)="addToWishlist(produit)" title="Ajouter aux favoris">
                      <i class="bi bi-heart"></i>
                    </button>
                    <button class="action-btn add-to-cart" (click)="addToCart(produit)" title="Ajouter au panier">
                      <i class="bi bi-cart-plus"></i>
                    </button>
                  </div>
                </div>
                <div class="product-info">
                  <span class="product-category">{{ produit.category || produit.categorie }}</span>
                  <h5 class="product-title">{{ produit.nom }}</h5>
                  <div class="product-shop">
                    <i class="bi bi-building"></i> {{ getBoutiqueName(produit.boutiqueId) }}
                  </div>
                  <div class="product-rating" *ngIf="produit.rating">
                    <div class="stars">
                      <i class="bi bi-star-fill" *ngFor="let star of getStars(produit.rating)"></i>
                      <i class="bi bi-star" *ngFor="let star of getEmptyStars(produit.rating)"></i>
                    </div>
                    <span class="rating-count">({{ produit.reviews || 0 }})</span>
                  </div>
                  <div class="product-price">
                    <span class="current">{{ (produit.price || produit.prix) | currency:'EUR':'symbol':'1.2-2' }}</span>
                    <span class="old" *ngIf="produit.oldPrice">{{ produit.oldPrice | currency:'EUR':'symbol':'1.2-2' }}</span>
                  </div>
                </div>
              </div>
            </div>

            <div *ngIf="filteredProducts.length === 0" class="empty-state">
              <i class="bi bi-emoji-frown"></i>
              <h4>Aucun produit trouvé</h4>
              <button class="btn-reset" (click)="resetFilters()">Réinitialiser les filtres</button>
            </div>
          </main>
        </div>
      </div>

      <ng-template #loader>
        <div class="loader-wrapper">
          <div class="loader">
            <div class="loader-spinner"></div>
            <p>Chargement de l'expérience Monecome...</p>
          </div>
        </div>
      </ng-template>
    </div>
  `,
  styles: [`
    .modern-shop {
      background: #f8fafc;
      min-height: 100vh;
    }

    /* Hero Premium */
    .hero-premium {
      position: relative;
      background: linear-gradient(135deg, #0f0c29, #302b63, #24243e);
      padding: 80px 0 120px;
      overflow: hidden;
    }

    .hero-bg-animation {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: radial-gradient(circle at 20% 50%, rgba(255,255,255,0.1) 0%, transparent 50%);
      animation: pulse 4s ease-in-out infinite;
    }

    @keyframes pulse {
      0%, 100% { transform: scale(1); opacity: 0.5; }
      50% { transform: scale(1.1); opacity: 0.8; }
    }

    .hero-content {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 60px;
      position: relative;
      z-index: 2;
    }

    .hero-badge {
      display: inline-block;
      padding: 8px 16px;
      background: rgba(255,255,255,0.2);
      backdrop-filter: blur(10px);
      border-radius: 50px;
      color: white;
      font-size: 14px;
      margin-bottom: 24px;
    }

    .hero-title {
      font-size: 56px;
      font-weight: 800;
      color: white;
      line-height: 1.2;
      margin-bottom: 24px;
    }

    .gradient-text {
      background: linear-gradient(135deg, #a8edea 0%, #fed6e3 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }

    .hero-description {
      font-size: 18px;
      color: rgba(255,255,255,0.8);
      margin-bottom: 32px;
      line-height: 1.6;
    }

    .hero-stats {
      display: flex;
      gap: 40px;
      margin-bottom: 40px;
    }

    .stat {
      text-align: center;
    }

    .stat-number {
      font-size: 32px;
      font-weight: 700;
      color: white;
    }

    .stat-label {
      font-size: 14px;
      color: rgba(255,255,255,0.7);
      margin-top: 4px;
    }

    .stat-divider {
      width: 1px;
      height: 40px;
      background: rgba(255,255,255,0.2);
    }

    .search-card {
      background: white;
      border-radius: 20px;
      padding: 20px;
      box-shadow: 0 20px 40px rgba(0,0,0,0.1);
    }

    .search-header {
      display: flex;
      align-items: center;
      gap: 12px;
      border-bottom: 2px solid #f0f0f0;
      padding-bottom: 12px;
    }

    .search-header i {
      font-size: 20px;
      color: #667eea;
    }

    .search-header input {
      flex: 1;
      border: none;
      font-size: 16px;
      outline: none;
    }

    .search-filters {
      display: flex;
      flex-wrap: wrap;
      gap: 10px;
      margin-top: 15px;
    }

    .search-filters span {
      font-size: 13px;
      color: #666;
    }

    .search-filters button {
      background: #f0f0f0;
      border: none;
      padding: 4px 12px;
      border-radius: 20px;
      font-size: 13px;
      cursor: pointer;
      transition: all 0.2s;
    }

    .search-filters button:hover {
      background: #667eea;
      color: white;
    }

    .hero-wave {
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      line-height: 0;
    }

    /* Section Header */
    .section-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-end;
      margin-bottom: 30px;
    }

    .section-badge {
      display: inline-block;
      padding: 4px 12px;
      background: linear-gradient(135deg, #667eea20, #764ba220);
      border-radius: 20px;
      color: #667eea;
      font-size: 12px;
      font-weight: 600;
      margin-bottom: 12px;
    }

    .section-title {
      font-size: 28px;
      font-weight: 700;
      color: #1a1a2e;
      margin: 0;
    }

    .view-all {
      background: none;
      border: none;
      color: #667eea;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.2s;
    }

    .view-all:hover {
      transform: translateX(5px);
    }

    /* Categories Premium */
    .categories-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
      gap: 20px;
    }

    .category-premium {
      display: flex;
      align-items: center;
      gap: 15px;
      padding: 15px;
      background: white;
      border-radius: 16px;
      cursor: pointer;
      transition: all 0.3s;
      border: 1px solid #e2e8f0;
    }

    .category-premium:hover {
      transform: translateY(-4px);
      box-shadow: 0 10px 25px rgba(0,0,0,0.1);
      border-color: #667eea;
    }

    .category-premium.active {
      border-color: #667eea;
      background: linear-gradient(135deg, #667eea10, #764ba210);
    }

    .category-icon {
      width: 48px;
      height: 48px;
      border-radius: 14px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      font-size: 24px;
    }

    .category-details h6 {
      margin: 0 0 4px 0;
      font-weight: 600;
      color: #1a1a2e;
    }

    .category-details span {
      font-size: 12px;
      color: #6c757d;
    }

    /* Active Filters */
    .active-filters {
      display: flex;
      align-items: center;
      gap: 12px;
      flex-wrap: wrap;
      margin-bottom: 30px;
      padding: 15px;
      background: white;
      border-radius: 12px;
    }

    .filter-chip {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 6px 12px;
      background: #f0f0f0;
      border-radius: 20px;
      font-size: 14px;
    }

    .filter-chip i {
      cursor: pointer;
      font-size: 12px;
    }

    .clear-all {
      padding: 6px 12px;
      background: none;
      border: 1px solid #ddd;
      border-radius: 20px;
      font-size: 13px;
      cursor: pointer;
      transition: all 0.2s;
    }

    .clear-all:hover {
      background: #667eea;
      color: white;
      border-color: #667eea;
    }

    /* Shop Layout */
    .shop-layout {
      display: grid;
      grid-template-columns: 280px 1fr;
      gap: 40px;
    }

    /* Sidebar */
    .filter-group {
      background: white;
      border-radius: 16px;
      padding: 20px;
      margin-bottom: 20px;
    }

    .filter-group h4 {
      font-size: 16px;
      font-weight: 600;
      margin-bottom: 15px;
      color: #1a1a2e;
    }

    .price-range {
      margin-top: 15px;
    }

    .price-range input {
      width: 100%;
      margin-bottom: 10px;
    }

    .price-values {
      display: flex;
      justify-content: space-between;
      font-size: 14px;
      color: #666;
    }

    .rating-option {
      display: flex;
      align-items: center;
      margin-bottom: 12px;
      cursor: pointer;
    }

    .rating-option .stars {
      color: #ffc107;
      font-size: 14px;
    }

    .checkbox-label {
      display: flex;
      align-items: center;
      gap: 10px;
      cursor: pointer;
    }

    /* Products Header */
    .products-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 30px;
    }

    .results-info {
      font-size: 14px;
      color: #6c757d;
    }

    .sort-options {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .sort-options select {
      padding: 8px 12px;
      border: 1px solid #e2e8f0;
      border-radius: 8px;
      outline: none;
      cursor: pointer;
    }

    /* Products Grid */
    .products-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
      gap: 25px;
    }

    .product-premium {
      background: white;
      border-radius: 20px;
      overflow: hidden;
      transition: all 0.3s;
      position: relative;
      animation: fadeInUp 0.5s ease-out both;
    }

    @keyframes fadeInUp {
      from {
        opacity: 0;
        transform: translateY(30px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    .product-premium:hover {
      transform: translateY(-8px);
      box-shadow: 0 20px 35px rgba(0,0,0,0.1);
    }

    .product-badges {
      position: absolute;
      top: 12px;
      left: 12px;
      display: flex;
      gap: 8px;
      z-index: 2;
    }

    .badge-hot, .badge-new, .badge-sale {
      padding: 4px 10px;
      border-radius: 20px;
      font-size: 11px;
      font-weight: 600;
    }

    .badge-hot {
      background: linear-gradient(135deg, #ff6b6b, #ee5a24);
      color: white;
    }

    .badge-new {
      background: #10b981;
      color: white;
    }

    .badge-sale {
      background: #f59e0b;
      color: white;
    }

    .product-image-wrapper {
      position: relative;
      overflow: hidden;
      height: 260px;
    }

    .product-image-wrapper img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: transform 0.4s;
    }

    .product-premium:hover .product-image-wrapper img {
      transform: scale(1.08);
    }

    .product-actions {
      position: absolute;
      bottom: -50px;
      left: 0;
      right: 0;
      display: flex;
      justify-content: center;
      gap: 12px;
      padding: 15px;
      background: linear-gradient(to top, rgba(0,0,0,0.8), transparent);
      transition: bottom 0.3s;
    }

    .product-premium:hover .product-actions {
      bottom: 0;
    }

    .action-btn {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      background: white;
      border: none;
      cursor: pointer;
      transition: all 0.2s;
    }

    .action-btn:hover {
      background: #667eea;
      color: white;
    }

    .action-btn.add-to-cart {
      background: #667eea;
      color: white;
    }

    .product-info {
      padding: 18px;
    }

    .product-category {
      font-size: 12px;
      color: #667eea;
      font-weight: 600;
      text-transform: uppercase;
      margin-bottom: 8px;
      display: block;
    }

    .product-title {
      font-size: 16px;
      font-weight: 600;
      margin-bottom: 8px;
      line-height: 1.4;
    }

    .product-shop {
      font-size: 13px;
      color: #6c757d;
      margin-bottom: 8px;
    }

    .product-rating {
      display: flex;
      align-items: center;
      gap: 8px;
      margin-bottom: 10px;
    }

    .product-rating .stars {
      color: #ffc107;
      font-size: 13px;
    }

    .product-price {
      display: flex;
      align-items: baseline;
      gap: 8px;
    }

    .product-price .current {
      font-size: 20px;
      font-weight: 700;
      color: #667eea;
    }

    .product-price .old {
      font-size: 14px;
      color: #999;
      text-decoration: line-through;
    }

    .empty-state {
      text-align: center;
      padding: 60px;
      background: white;
      border-radius: 20px;
    }

    .empty-state i {
      font-size: 64px;
      color: #ddd;
    }

    .empty-state h4 {
      margin: 20px 0;
      color: #666;
    }

    .btn-reset {
      padding: 10px 24px;
      background: #667eea;
      color: white;
      border: none;
      border-radius: 30px;
      cursor: pointer;
    }

    .loader-wrapper {
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 400px;
    }

    .loader {
      text-align: center;
    }

    .loader-spinner {
      width: 50px;
      height: 50px;
      border: 3px solid #f0f0f0;
      border-top-color: #667eea;
      border-radius: 50%;
      animation: spin 1s linear infinite;
      margin-bottom: 15px;
    }

    @keyframes spin {
      to { transform: rotate(360deg); }
    }

    @media (max-width: 992px) {
      .hero-content {
        grid-template-columns: 1fr;
        text-align: center;
      }
      
      .shop-layout {
        grid-template-columns: 1fr;
      }
      
      .hero-stats {
        justify-content: center;
      }
      
      .hero-title {
        font-size: 40px;
      }
    }
  `]
})
export class AccueilComponent implements OnInit {
  produits: any[] = [];
  boutiques: any[] = [];
  categories: any[] = [];
  filteredProducts: any[] = [];
  searchTerm: string = '';
  selectedCategory: string = '';
  sortBy: string = 'pertinence';
  loading: boolean = true;
  showAllCategories: boolean = false;
  priceRange: number = 500;
  maxPrice: number = 1000;
  minRating: number = 0;
  freeShipping: boolean = false;
  popularSearches: string[] = ['iPhone', 'Sac', 'Montre', 'Casque', 'Chaussures'];

  constructor(private firebase: FirebaseService) {}

  async ngOnInit() {
    await this.loadData();
  }

  async loadData() {
    try {
      this.produits = await this.firebase.getProducts();
      this.boutiques = await this.firebase.getShops();
      this.maxPrice = Math.max(...this.produits.map(p => p.price || p.prix || 0));
      this.priceRange = this.maxPrice;
      
      const cats = new Set(this.produits.map(p => p.category || p.categorie).filter(c => c));
      this.categories = Array.from(cats).map(cat => ({ nom: cat }));
      
      this.applyFilters();
      this.loading = false;
    } catch (error) {
      console.error('Erreur:', error);
      this.loading = false;
    }
  }

  applyFilters() {
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
    
    filtered = filtered.filter(p => (p.price || p.prix) <= this.priceRange);
    
    if (this.minRating > 0) {
      filtered = filtered.filter(p => (p.rating || 0) >= this.minRating);
    }
    
    if (this.freeShipping) {
      filtered = filtered.filter(p => p.freeShipping);
    }
    
    switch(this.sortBy) {
      case 'prix_asc':
        filtered.sort((a,b) => (a.price || a.prix) - (b.price || b.prix));
        break;
      case 'prix_desc':
        filtered.sort((a,b) => (b.price || b.prix) - (a.price || a.prix));
        break;
      case 'popularite':
        filtered.sort((a,b) => (b.reviews || 0) - (a.reviews || 0));
        break;
      default:
        filtered.sort((a,b) => (a.rating || 0) - (b.rating || 0));
    }
    
    this.filteredProducts = filtered;
  }

  clearSearch() {
    this.searchTerm = '';
    this.applyFilters();
  }

  resetFilters() {
    this.searchTerm = '';
    this.selectedCategory = '';
    this.priceRange = this.maxPrice;
    this.minRating = 0;
    this.freeShipping = false;
    this.applyFilters();
  }

  getProductCountByCategory(categorie: string): number {
    return this.produits.filter(p => (p.category || p.categorie) === categorie).length;
  }

  getCategoryIcon(categorie: string): string {
    const icons: any = {
      'Électronique': 'bi bi-laptop',
      'Mode': 'bi bi-bag',
      'Maison': 'bi bi-house',
      'Beauté': 'bi bi-droplet',
      'Ordinateurs': 'bi bi-pc-display',
      'Smartphones': 'bi bi-phone'
    };
    return icons[categorie] || 'bi bi-tag';
  }

  getCategoryColor(categorie: string): string {
    const colors: any = {
      'Électronique': 'linear-gradient(135deg, #667eea, #764ba2)',
      'Mode': 'linear-gradient(135deg, #f093fb, #f5576c)',
      'Maison': 'linear-gradient(135deg, #4facfe, #00f2fe)',
      'Beauté': 'linear-gradient(135deg, #fa709a, #fee140)'
    };
    return colors[categorie] || 'linear-gradient(135deg, #667eea, #764ba2)';
  }

  getBoutiqueName(boutiqueId: string): string {
    const boutique = this.boutiques.find(b => b.id === boutiqueId);
    return boutique ? boutique.nom : 'Boutique partenaire';
  }

  getStars(rating: number): number[] {
    return new Array(Math.floor(rating));
  }

  getEmptyStars(rating: number): number[] {
    return new Array(5 - Math.floor(rating));
  }

  quickView(product: any) {
    // Implémenter le modal de vue rapide
    alert(`Aperçu de ${product.nom}`);
  }

  addToWishlist(product: any) {
    let wishlist = JSON.parse(localStorage.getItem('wishlist') || '[]');
    if (!wishlist.find((item: any) => item.id === product.id)) {
      wishlist.push(product);
      localStorage.setItem('wishlist', JSON.stringify(wishlist));
      alert(`❤️ ${product.nom} ajouté aux favoris`);
    }
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
    alert(`✓ ${product.nom} ajouté au panier`);
  }
}
