import { Component, OnInit } from '@angular/core';
import { FirebaseService } from '../../../core/services/firebase.service';
import { CartService } from '../../../core/services/cart.service';

@Component({
  selector: 'app-accueil',
  template: `
    <div class="homepage"><section class="hero"><div class="container text-center">
      <h1 class="hero-title">Découvrez notre marketplace</h1><p class="hero-subtitle">Des milliers de produits à petits prix</p>
      <div class="search-bar mx-auto"><i class="bi bi-search"></i><input type="text" [(ngModel)]="searchTerm" (input)="onSearchChange()" placeholder="Rechercher..."><button (click)="onSearchChange()">OK</button></div>
      <div class="filters-wrapper"><button class="filter-btn" [class.active]="selectedCategorie==='tous'" (click)="filterByCategorie('tous')">📦 Tous</button>
        <button *ngFor="let cat of categories" class="filter-btn" [class.active]="selectedCategorie===cat.nom" (click)="filterByCategorie(cat.nom)">
          <i [class]="getCategoryIcon(cat.nom)"></i> {{ cat.nom }} <span class="count">{{ cat.count }}</span>
        </button>
      </div>
    </div></section><div class="hero-spacer"></div>
    <div *ngIf="loading" class="text-center py-5"><div class="spinner-border text-primary"></div></div>
    <div *ngIf="!loading" class="container">
      <div *ngFor="let cat of filteredCategories" class="category-section mb-5">
        <div class="category-header"><h2>{{ cat.nom }}</h2><span class="badge bg-secondary">{{ cat.produits.length }} produits</span></div>
        <div class="products-grid"><div class="product-card" *ngFor="let p of cat.produits">
          <div class="product-image"><img [src]="p.imageBase64 || p.imageUrl || 'https://picsum.photos/300/300?random='+p.id" [alt]="p.nom">
            <div class="product-badges"><span class="badge hot" *ngIf="p.isHot">🔥 Hot</span><span class="badge new" *ngIf="p.isNew">Nouveau</span>
            <span class="badge discount" *ngIf="p.ancienPrix && p.ancienPrix>p.prix">-{{getDiscount(p.ancienPrix,p.prix)}}%</span></div>
          </div>
          <div class="product-info"><h3 class="product-title">{{ p.nom }}</h3><p class="product-description">{{ p.description | slice:0:70 }}</p>
            <div class="product-price"><span class="current-price">{{ p.prix }}€</span><span class="old-price" *ngIf="p.ancienPrix">{{ p.ancienPrix }}€</span></div>
            <button class="add-to-cart" (click)="addToCart(p)">🛒 Ajouter</button>
          </div>
        </div></div>
      </div>
    </div></div>
  `,
  styles: [`
    .homepage { background: #f8fafc; min-height: 100vh; }
    .hero { background: linear-gradient(135deg, #0f766e, #14b8a6); padding: 2rem 0; position: fixed; top: 0; left: 0; right: 0; z-index: 100; }
    .hero-title { font-size: 1.8rem; font-weight: 700; color: white; }
    .hero-subtitle { color: rgba(255,255,255,0.9); margin-bottom: 1rem; }
    .search-bar { max-width: 450px; display: flex; background: white; border-radius: 50px; overflow: hidden; }
    .search-bar i { padding: 0.75rem 0 0.75rem 1rem; color: #0f766e; }
    .search-bar input { flex: 1; padding: 0.75rem 0; border: none; outline: none; }
    .search-bar button { padding: 0 1.5rem; background: #0f766e; color: white; border: none; cursor: pointer; }
    .filters-wrapper { display: flex; flex-wrap: wrap; justify-content: center; gap: 0.5rem; margin-top: 1rem; }
    .filter-btn { padding: 0.4rem 1rem; background: rgba(255,255,255,0.2); border: none; border-radius: 50px; color: white; cursor: pointer; }
    .filter-btn.active { background: white; color: #0f766e; }
    .filter-btn .count { background: rgba(0,0,0,0.1); border-radius: 20px; padding: 0.1rem 0.4rem; margin-left: 0.3rem; }
    .hero-spacer { height: 185px; }
    .category-header { display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 1rem; border-bottom: 2px solid #0f766e; }
    .category-header h2 { font-size: 1.25rem; font-weight: 600; }
    .products-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(240px, 1fr)); gap: 1.5rem; }
    .product-card { background: white; border-radius: 1rem; overflow: hidden; border: 1px solid #e2e8f0; transition: transform 0.3s; }
    .product-card:hover { transform: translateY(-4px); box-shadow: 0 8px 25px rgba(0,0,0,0.1); }
    .product-image { position: relative; height: 200px; overflow: hidden; }
    .product-image img { width: 100%; height: 100%; object-fit: cover; }
    .product-badges { position: absolute; top: 0.75rem; left: 0.75rem; display: flex; gap: 0.5rem; }
    .badge { padding: 0.25rem 0.6rem; border-radius: 20px; font-size: 0.7rem; font-weight: 600; }
    .badge.hot { background: #ef4444; color: white; }
    .badge.new { background: #10b981; color: white; }
    .badge.discount { background: #f59e0b; color: white; }
    .product-info { padding: 1rem; }
    .product-title { font-size: 0.95rem; font-weight: 600; margin-bottom: 0.5rem; }
    .current-price { font-size: 1.1rem; font-weight: 700; color: #0f766e; }
    .old-price { font-size: 0.75rem; color: #94a3b8; text-decoration: line-through; margin-left: 0.5rem; }
    .add-to-cart { width: 100%; padding: 0.6rem; background: #f1f5f9; border: none; border-radius: 0.5rem; font-weight: 600; cursor: pointer; }
    .add-to-cart:hover { background: #0f766e; color: white; }
    @media (max-width: 768px) { .hero-spacer { height: 170px; } .products-grid { grid-template-columns: repeat(auto-fill, minmax(180px, 1fr)); } .product-image { height: 160px; } }
  `]
})
export class AccueilComponent implements OnInit {
  produits: any[] = []; categories: any[] = []; filteredCategories: any[] = []; loading = true; searchTerm = ''; selectedCategorie = 'tous';
  constructor(private firebase: FirebaseService, private cart: CartService) {}
  async ngOnInit() { await this.loadData(); }
  async loadData() {
    try {
      const all = await this.firebase.getProducts();
      this.produits = all.filter(p => p.isActive !== false);
      const map = new Map();
      this.produits.forEach(p => { const cat = p.category || 'Autres'; if (!map.has(cat)) map.set(cat, []); map.get(cat).push(p); });
      this.categories = Array.from(map.entries()).map(([n, p]) => ({ nom: n, produits: p, count: p.length }));
      this.filteredCategories = [...this.categories];
    } catch(e) { console.error(e); } finally { this.loading = false; }
  }
  filterByCategorie(cat: string) { this.selectedCategorie = cat; this.searchTerm = ''; this.filteredCategories = cat === 'tous' ? [...this.categories] : this.categories.filter(c => c.nom === cat); }
  onSearchChange() {
    if (!this.searchTerm.trim()) { this.filterByCategorie(this.selectedCategorie); return; }
    const term = this.searchTerm.toLowerCase();
    const filtered = this.produits.filter(p => p.nom?.toLowerCase().includes(term) || p.description?.toLowerCase().includes(term));
    const map = new Map();
    filtered.forEach(p => { const cat = p.category || 'Autres'; if (!map.has(cat)) map.set(cat, []); map.get(cat).push(p); });
    this.filteredCategories = Array.from(map.entries()).map(([n, p]) => ({ nom: n, produits: p, count: p.length }));
  }
  getDiscount(ancien: number, prix: number): number { if (!ancien || ancien <= prix) return 0; return Math.round((ancien - prix) / ancien * 100); }
  getCategoryIcon(cat: string): string { const icons: any = { 'Électronique': 'bi-laptop', 'Mode': 'bi-bag', 'Maison': 'bi-house', 'Beauté': 'bi-droplet', 'Sport': 'bi-bicycle' }; return `bi ${icons[cat] || 'bi-tag'}`; }
  addToCart(p: any) { this.cart.add({ id: p.id, nom: p.nom, prix: p.prix, quantite: 1, imageUrl: p.imageBase64 || p.imageUrl }); }
}
