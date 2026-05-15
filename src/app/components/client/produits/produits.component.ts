import { Component, OnInit } from '@angular/core';
import { FirebaseService } from '../../../services/firebase.service';

@Component({
  selector: 'app-produits',
  template: `
    <div style="padding:48px 0;background:var(--bg);min-height:80vh">
      <div class="container">

        <div style="margin-bottom:40px">
          <span class="badge-orange">Catalogue</span>
          <h2 style="font-size:32px;font-weight:800;margin-top:12px">Tous nos produits</h2>
        </div>

        <div *ngIf="produits.length > 0; else empty"
             style="display:grid;grid-template-columns:repeat(auto-fill,minmax(260px,1fr));gap:24px">
          <div class="card-modern" *ngFor="let p of produits; let i = index"
               style="overflow:hidden;cursor:pointer">
            <img [src]="p.imageUrl || 'https://picsum.photos/seed/' + i + '/400/260'"
                 [alt]="p.nom"
                 style="width:100%;height:200px;object-fit:cover">
            <div style="padding:20px">
              <span class="badge-orange" style="font-size:11px">{{ p.categorie || p.category }}</span>
              <h5 style="font-weight:700;margin:10px 0 6px">{{ p.nom }}</h5>
              <p style="color:var(--gray);font-size:14px;margin-bottom:18px">{{ p.description }}</p>
              <div style="display:flex;align-items:center;justify-content:space-between">
                <span style="font-size:22px;font-weight:800;color:var(--orange)">
                  {{ (p.prix || p.price) | currency:'EUR':'symbol':'1.2-2' }}
                </span>
                <button class="btn-orange" style="padding:10px 18px;font-size:13px">
                  + Panier
                </button>
              </div>
            </div>
          </div>
        </div>

        <ng-template #empty>
          <div style="text-align:center;padding:80px 20px;color:var(--gray)">
            <div style="font-size:64px;margin-bottom:16px">📦</div>
            <h4 style="font-weight:700;margin-bottom:8px">Catalogue en cours de chargement</h4>
            <p>Les produits seront disponibles très bientôt.</p>
          </div>
        </ng-template>

      </div>
    </div>
  `
})
export class ProduitsComponent implements OnInit {
  produits: any[] = [];

  constructor(private firebase: FirebaseService) {}

  async ngOnInit() {
    try {
      const all = await this.firebase.getProducts();
      this.produits = all.filter((p: any) => p.isActive !== false);
    } catch (e) {
      console.error('Erreur chargement produits', e);
    }
  }
}
