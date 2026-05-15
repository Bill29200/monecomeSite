import { Component } from '@angular/core';

@Component({
  selector: 'app-panier',
  template: `
    <div style="padding:64px 0;background:var(--bg);min-height:80vh">
      <div class="container" style="max-width:720px">
        <h2 style="font-size:32px;font-weight:800;margin-bottom:36px">🛒 Mon Panier</h2>

        <div *ngIf="items.length === 0"
             style="text-align:center;padding:80px 20px;background:white;
                    border-radius:var(--radius-lg);box-shadow:var(--shadow-md)">
          <div style="font-size:72px;margin-bottom:20px">🛍️</div>
          <h4 style="font-weight:700;font-size:22px;margin-bottom:10px">Votre panier est vide</h4>
          <p style="color:var(--gray);margin-bottom:28px">
            Découvrez nos produits et commencez vos achats !
          </p>
          <a routerLink="/produits" class="btn-orange" style="padding:14px 36px;font-size:16px">
            Voir les produits →
          </a>
        </div>

      </div>
    </div>
  `
})
export class PanierComponent {
  items: any[] = [];
}
