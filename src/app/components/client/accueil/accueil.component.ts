import { Component, OnInit } from '@angular/core';
import { FirebaseService } from '../../../services/firebase.service';

@Component({
  selector: 'app-accueil',
  template: `
    <div style="background:var(--bg);min-height:100vh">

      <!-- HERO -->
      <section style="background:linear-gradient(135deg,#1a1a2e 0%,#2d1b4e 55%,#1a1a2e 100%);
                      padding:100px 0 140px;position:relative;overflow:hidden">
        <div style="position:absolute;top:-100px;right:-100px;width:450px;height:450px;
                    border-radius:50%;background:rgba(255,107,53,.1);pointer-events:none"></div>
        <div style="position:absolute;bottom:-130px;left:-80px;width:550px;height:550px;
                    border-radius:50%;background:rgba(255,107,53,.06);pointer-events:none"></div>

        <div class="container" style="position:relative;z-index:2">
          <div style="max-width:700px">

            <span style="display:inline-block;padding:8px 22px;
                         background:rgba(255,107,53,.2);border:1px solid rgba(255,107,53,.35);
                         border-radius:50px;color:#ff9a7a;font-size:14px;font-weight:600;margin-bottom:28px">
              🌟 Bienvenue sur Monecome
            </span>

            <h1 style="font-size:clamp(36px,6vw,62px);font-weight:800;color:white;
                       line-height:1.15;margin-bottom:24px">
              Découvrez l'art du<br>
              <span style="color:var(--orange)">shopping moderne</span>
            </h1>

            <p style="font-size:18px;color:rgba(255,255,255,.75);margin-bottom:40px;line-height:1.75">
              Explorez notre marketplace premium — {{ produits.length }} produits de qualité
              dans {{ categories.length }} catégories.
            </p>

            <!-- Stats -->
            <div style="display:flex;gap:44px;margin-bottom:48px">
              <div *ngFor="let s of heroStats">
                <div style="font-size:38px;font-weight:800;color:white">{{ s.value }}</div>
                <div style="font-size:13px;color:rgba(255,255,255,.55);margin-top:4px">{{ s.label }}</div>
              </div>
            </div>

            <!-- Recherche -->
            <div style="background:white;border-radius:16px;padding:8px 8px 8px 22px;
                        display:flex;align-items:center;gap:14px;
                        box-shadow:0 20px 60px rgba(0,0,0,.3);max-width:580px">
              <svg width="20" height="20" fill="none" stroke="#ff6b35" stroke-width="2" viewBox="0 0 24 24">
                <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
              </svg>
              <input type="text" placeholder="Rechercher un produit, une boutique..."
                     [(ngModel)]="searchTerm" (input)="applyFilters()"
                     style="flex:1;border:none;font-size:15px;outline:none;padding:10px 0;
                            font-family:inherit">
              <button class="btn-orange" style="padding:12px 26px;white-space:nowrap">Rechercher</button>
            </div>

            <!-- Tags -->
            <div style="display:flex;flex-wrap:wrap;gap:10px;margin-top:20px;align-items:center">
              <span style="font-size:13px;color:rgba(255,255,255,.45)">Populaire :</span>
              <span *ngFor="let tag of popularTags"
                    (click)="searchTerm = tag; applyFilters()"
                    style="background:rgba(255,255,255,.1);border-radius:50px;
                           color:rgba(255,255,255,.75);padding:5px 14px;font-size:13px;cursor:pointer;
                           transition:background .2s"
                    onmouseover="this.style.background='rgba(255,107,53,.35)'"
                    onmouseout="this.style.background='rgba(255,255,255,.1)'">
                {{ tag }}
              </span>
            </div>

          </div>
        </div>

        <!-- Vague -->
        <div style="position:absolute;bottom:0;left:0;right:0;line-height:0">
          <svg viewBox="0 0 1440 80" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 40 C360 80 1080 0 1440 40 L1440 80 L0 80 Z" fill="#fafafa"/>
          </svg>
        </div>
      </section>

      <!-- LOADER -->
      <div *ngIf="loading" style="text-align:center;padding:80px 0">
        <div style="width:50px;height:50px;border:4px solid var(--orange-mid);
                    border-top-color:var(--orange);border-radius:50%;
                    animation:spin .8s linear infinite;margin:0 auto 16px"></div>
        <p style="color:var(--gray)">Chargement de l'expérience Monecome...</p>
      </div>

      <div class="container" style="padding:60px 16px" *ngIf="!loading">

        <!-- CATÉGORIES -->
        <div style="margin-bottom:60px">
          <div style="display:flex;justify-content:space-between;align-items:flex-end;margin-bottom:28px">
            <div>
              <span class="badge-orange">Catégories</span>
              <h2 style="font-size:28px;font-weight:800;margin-top:12px">Explorez par catégorie</h2>
            </div>
            <button (click)="showAllCat = !showAllCat"
                    style="background:none;border:none;color:var(--orange);font-weight:700;cursor:pointer;font-size:14px">
              {{ showAllCat ? 'Voir moins ↑' : 'Voir tout →' }}
            </button>
          </div>
          <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(190px,1fr));gap:16px">
            <div *ngFor="let cat of (showAllCat ? categories : categories.slice(0,8))"
                 (click)="selectedCategory = cat.nom; applyFilters()"
                 [style.border]="selectedCategory === cat.nom ? '2px solid var(--orange)' : '2px solid var(--border)'"
                 [style.background]="selectedCategory === cat.nom ? 'var(--orange-light)' : 'white'"
                 style="display:flex;align-items:center;gap:14px;padding:16px;
                        border-radius:var(--radius-md);cursor:pointer;transition:all .25s">
              <div [style.background]="getCategoryColor(cat.nom)"
                   style="width:46px;height:46px;border-radius:12px;display:flex;
                          align-items:center;justify-content:center;font-size:22px;flex-shrink:0">
                {{ getCategoryEmoji(cat.nom) }}
              </div>
              <div>
                <div style="font-weight:700;font-size:14px">{{ cat.nom }}</div>
                <div style="font-size:12px;color:var(--gray)">{{ getCountByCategory(cat.nom) }} produits</div>
              </div>
            </div>
          </div>
        </div>

        <!-- FILTRES ACTIFS -->
        <div *ngIf="selectedCategory || searchTerm"
             style="display:flex;flex-wrap:wrap;gap:10px;margin-bottom:28px;
                    background:white;padding:16px 20px;border-radius:var(--radius-md);
                    box-shadow:var(--shadow-sm)">
          <span *ngIf="selectedCategory"
                style="display:flex;align-items:center;gap:8px;background:var(--orange-light);
                       color:var(--orange);border-radius:50px;padding:6px 14px;font-size:14px;font-weight:600">
            {{ selectedCategory }}
            <span (click)="selectedCategory=''; applyFilters()"
                  style="cursor:pointer;font-size:18px;line-height:1">×</span>
          </span>
          <span *ngIf="searchTerm"
                style="display:flex;align-items:center;gap:8px;background:var(--orange-light);
                       color:var(--orange);border-radius:50px;padding:6px 14px;font-size:14px;font-weight:600">
            "{{ searchTerm }}"
            <span (click)="searchTerm=''; applyFilters()"
                  style="cursor:pointer;font-size:18px;line-height:1">×</span>
          </span>
          <button (click)="resetFilters()"
                  style="border:1px solid var(--border);background:none;border-radius:50px;
                         padding:6px 14px;font-size:13px;cursor:pointer;color:var(--gray)">
            Tout effacer
          </button>
        </div>

        <!-- LAYOUT -->
        <div style="display:grid;grid-template-columns:260px 1fr;gap:32px">

          <!-- Sidebar -->
          <aside>
            <div class="card-modern" style="padding:24px;margin-bottom:20px">
              <h4 style="font-weight:700;font-size:15px;margin-bottom:16px">💰 Prix maximum</h4>
              <input type="range" min="0" [max]="maxPrice" [(ngModel)]="priceRange"
                     (change)="applyFilters()" style="width:100%;margin-bottom:10px">
              <div style="display:flex;justify-content:space-between;font-size:13px;color:var(--gray)">
                <span>0 €</span>
                <span style="color:var(--orange);font-weight:700">{{ priceRange }} €</span>
              </div>
            </div>

            <div class="card-modern" style="padding:24px;margin-bottom:20px">
              <h4 style="font-weight:700;font-size:15px;margin-bottom:16px">⭐ Note minimum</h4>
              <div *ngFor="let r of [4.5, 4, 3.5]"
                   (click)="minRating = r; applyFilters()"
                   [style.color]="minRating === r ? 'var(--orange)' : 'var(--gray)'"
                   [style.fontWeight]="minRating === r ? '700' : '400'"
                   style="padding:8px 0;cursor:pointer;font-size:14px;transition:color .2s">
                ★ {{ r }}+
              </div>
            </div>

            <div class="card-modern" style="padding:24px">
              <h4 style="font-weight:700;font-size:15px;margin-bottom:16px">🚚 Livraison</h4>
              <label style="display:flex;align-items:center;gap:10px;cursor:pointer;font-size:14px">
                <input type="checkbox" [(ngModel)]="freeShipping" (change)="applyFilters()"
                       style="accent-color:var(--orange);width:16px;height:16px">
                Livraison gratuite uniquement
              </label>
            </div>
          </aside>

          <!-- Produits -->
          <main>
            <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:24px">
              <span style="font-size:14px;color:var(--gray)">
                <strong style="color:var(--dark)">{{ filteredProducts.length }}</strong> produits trouvés
              </span>
              <select [(ngModel)]="sortBy" (change)="applyFilters()"
                      style="padding:10px 18px;border:1.5px solid var(--border);border-radius:50px;
                             font-size:14px;outline:none;cursor:pointer;font-family:inherit">
                <option value="pertinence">Pertinence</option>
                <option value="prix_asc">Prix ↑</option>
                <option value="prix_desc">Prix ↓</option>
                <option value="popularite">Populaires</option>
              </select>
            </div>

            <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(240px,1fr));gap:22px">
              <div *ngFor="let p of filteredProducts; let i = index"
                   class="card-modern" style="overflow:hidden;cursor:pointer">
                <div style="position:relative">
                  <img [src]="p.imageUrl || 'https://picsum.photos/seed/' + (i+20) + '/400/260'"
                       [alt]="p.nom" style="width:100%;height:190px;object-fit:cover">
                  <div style="position:absolute;top:10px;left:10px;display:flex;gap:6px">
                    <span *ngIf="p.isHot"
                          style="background:linear-gradient(135deg,#ff6b6b,#ee5a24);color:white;
                                 border-radius:20px;padding:3px 10px;font-size:11px;font-weight:700">
                      🔥 Hot
                    </span>
                    <span *ngIf="p.isNew"
                          style="background:#10b981;color:white;
                                 border-radius:20px;padding:3px 10px;font-size:11px;font-weight:700">
                      Nouveau
                    </span>
                    <span *ngIf="p.discount"
                          style="background:var(--orange);color:white;
                                 border-radius:20px;padding:3px 10px;font-size:11px;font-weight:700">
                      -{{ p.discount }}%
                    </span>
                  </div>
                </div>
                <div style="padding:18px">
                  <span class="badge-orange" style="font-size:11px">{{ p.category || p.categorie }}</span>
                  <h5 style="font-weight:700;margin:10px 0 5px;font-size:15px">{{ p.nom }}</h5>
                  <div style="font-size:13px;color:var(--gray);margin-bottom:14px">
                     🛍️ {{ getBoutiqueName(p.boutiqueId) }}
                  </div>
                  <div style="display:flex;align-items:center;justify-content:space-between">
                    <span style="font-size:20px;font-weight:800;color:var(--orange)">
                      {{ (p.price || p.prix) | currency:'EUR':'symbol':'1.2-2' }}
                    </span>
                    <button class="btn-orange" style="padding:9px 16px;font-size:13px"
                            (click)="addToCart(p)">
                      + Panier
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <!-- Vide -->
            <div *ngIf="filteredProducts.length === 0"
                 style="text-align:center;padding:80px 20px;color:var(--gray)">
              <div style="font-size:60px;margin-bottom:16px">😕</div>
              <h4 style="font-weight:700;margin-bottom:8px">Aucun produit trouvé</h4>
              <button class="btn-orange" (click)="resetFilters()" style="margin-top:8px">
                Réinitialiser les filtres
              </button>
            </div>
          </main>

        </div>
      </div>
    </div>
  `
})
export class AccueilComponent implements OnInit {
  produits:          any[] = [];
  boutiques:         any[] = [];
  categories:        any[] = [];
  filteredProducts:  any[] = [];

  searchTerm       = '';
  selectedCategory = '';
  priceRange       = 1000;
  maxPrice         = 1000;
  minRating        = 0;
  freeShipping     = false;
  sortBy           = 'pertinence';
  loading          = true;
  showAllCat       = false;

  popularTags = ['Électronique', 'Mode', 'Maison', 'Sport', 'Beauté'];

  get heroStats() {
    return [
      { value: this.boutiques.length  || 0, label: 'Boutiques'  },
      { value: this.produits.length   || 0, label: 'Produits'   },
      { value: this.categories.length || 0, label: 'Catégories' },
    ];
  }

  constructor(private firebase: FirebaseService) {}

  async ngOnInit() {
    try {
      const [prods, bouts, cats] = await Promise.all([
        this.firebase.getProducts(),
        this.firebase.getData('boutiques'),
        this.firebase.getData('categories'),
      ]);
      this.produits   = prods.filter((p: any) => p.isActive !== false);
      this.boutiques  = bouts;
      this.categories = cats;
      this.maxPrice   = this.produits.reduce(
        (m: number, p: any) => Math.max(m, p.prix || p.price || 0), 1000
      );
      this.priceRange = this.maxPrice;
      this.applyFilters();
    } catch (e) {
      console.error('Erreur chargement accueil', e);
    } finally {
      this.loading = false;
    }
  }

  applyFilters() {
    let r = [...this.produits];
    if (this.selectedCategory) r = r.filter((p: any) => (p.category || p.categorie) === this.selectedCategory);
    if (this.searchTerm)       r = r.filter((p: any) => p.nom?.toLowerCase().includes(this.searchTerm.toLowerCase()));
    if (this.minRating)        r = r.filter((p: any) => (p.rating || 0) >= this.minRating);
    if (this.freeShipping)     r = r.filter((p: any) => p.freeShipping);
    r = r.filter((p: any) => (p.prix || p.price || 0) <= this.priceRange);
    if (this.sortBy === 'prix_asc')   r.sort((a: any, b: any) => (a.prix || a.price || 0) - (b.prix || b.price || 0));
    if (this.sortBy === 'prix_desc')  r.sort((a: any, b: any) => (b.prix || b.price || 0) - (a.prix || a.price || 0));
    if (this.sortBy === 'popularite') r.sort((a: any, b: any) => (b.rating || 0) - (a.rating || 0));
    this.filteredProducts = r;
  }

  resetFilters() {
    this.searchTerm = '';
    this.selectedCategory = '';
    this.minRating = 0;
    this.freeShipping = false;
    this.priceRange = this.maxPrice;
    this.sortBy = 'pertinence';
    this.applyFilters();
  }

  getBoutiqueName(id: string): string {
    return this.boutiques.find((b: any) => b.id === id)?.nom || 'Boutique';
  }

  getCountByCategory(nom: string): number {
    return this.produits.filter((p: any) => (p.category || p.categorie) === nom).length;
  }

  getCategoryColor(nom: string): string {
    const m: Record<string, string> = {
      'Électronique': '#3b82f6', 'Mode': '#ec4899', 'Maison': '#10b981',
      'Sport': '#f59e0b', 'Beauté': '#8b5cf6', 'Alimentation': '#22c55e'
    };
    return m[nom] || 'var(--orange)';
  }

  getCategoryEmoji(nom: string): string {
    const m: Record<string, string> = {
      'Électronique': '💻', 'Mode': '👗', 'Maison': '🏡',
      'Sport': '⚽', 'Beauté': '💄', 'Alimentation': '🥗'
    };
    return m[nom] || '📦';
  }

  addToCart(produit: any) {
    console.log('Ajout au panier:', produit.nom);
  }
}
