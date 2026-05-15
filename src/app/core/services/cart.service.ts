import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface CartItem {
  id: string; nom: string; prix: number; quantite: number; imageUrl?: string;
}

@Injectable({ providedIn: 'root' })
export class CartService {
  private cartSubject = new BehaviorSubject<CartItem[]>([]);
  public cart$ = this.cartSubject.asObservable();

  constructor() { this.loadCart(); }

  private loadCart() {
    const saved = localStorage.getItem('cart');
    if (saved) this.cartSubject.next(JSON.parse(saved));
  }

  private saveCart(items: CartItem[]) {
    localStorage.setItem('cart', JSON.stringify(items));
    this.cartSubject.next(items);
  }

  getItems(): CartItem[] { return this.cartSubject.value; }
  getCount(): number { return this.getItems().reduce((s, i) => s + i.quantite, 0); }
  getTotal(): number { return this.getItems().reduce((s, i) => s + (i.prix * i.quantite), 0); }

  add(item: CartItem) {
    const items = this.getItems();
    const existing = items.find(i => i.id === item.id);
    if (existing) existing.quantite += item.quantite;
    else items.push(item);
    this.saveCart(items);
  }

  updateQuantity(id: string, quantite: number) {
    if (quantite <= 0) this.remove(id);
    else {
      const items = this.getItems();
      const item = items.find(i => i.id === id);
      if (item) item.quantite = quantite;
      this.saveCart(items);
    }
  }

  remove(id: string) { this.saveCart(this.getItems().filter(i => i.id !== id)); }
  clear() { this.saveCart([]); }
}
