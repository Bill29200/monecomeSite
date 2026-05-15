import { Component, OnInit } from '@angular/core';
import { CartService, CartItem } from '../../../core/services/cart.service';

@Component({
  selector: 'app-panier',
  template: `
    <div class="container py-4"><h1 class="mb-4">Mon Panier</h1>
      <div *ngIf="items.length===0" class="text-center py-5"><i class="bi bi-cart-x display-1 text-muted"></i><h3>Panier vide</h3><a routerLink="/" class="btn btn-primary mt-3">Découvrir</a></div>
      <div *ngIf="items.length>0" class="row"><div class="col-lg-8">
        <div class="list-group"><div class="list-group-item" *ngFor="let item of items">
          <div class="d-flex justify-content-between align-items-center"><div><h5>{{ item.nom }}</h5><small>{{ item.prix }}€/u</small></div>
            <div class="d-flex gap-2 align-items-center"><button class="btn btn-sm btn-outline-secondary" (click)="updateQty(item, -1)">-</button>
              <span class="px-2">{{ item.quantite }}</span><button class="btn btn-sm btn-outline-secondary" (click)="updateQty(item, 1)">+</button>
              <span class="fw-bold">{{ item.prix * item.quantite }}€</span>
              <button class="btn btn-sm btn-danger" (click)="remove(item.id)">🗑️</button>
            </div>
          </div>
        </div></div>
      </div><div class="col-lg-4"><div class="card"><div class="card-body"><h5>Total</h5><hr><h3 class="text-primary">{{ total }}€</h3>
        <button class="btn btn-primary w-100 mb-2">Commander</button><button class="btn btn-outline-danger w-100" (click)="clear()">Vider</button>
      </div></div></div></div></div>
  `,
  styles: [`.list-group-item { border-radius: 10px; margin-bottom: 8px; }`]
})
export class PanierComponent implements OnInit {
  items: CartItem[] = []; total = 0;
  constructor(private cart: CartService) {}
  ngOnInit() { this.cart.cart$.subscribe(items => { this.items = items; this.total = this.cart.getTotal(); }); }
  updateQty(item: CartItem, delta: number) { this.cart.updateQuantity(item.id, item.quantite + delta); }
  remove(id: string) { this.cart.remove(id); }
  clear() { if (confirm('Vider le panier ?')) this.cart.clear(); }
}
