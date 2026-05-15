import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { CartService } from '../../core/services/cart.service';

@Component({
  selector: 'app-navbar',
  template: `
    <nav class="navbar navbar-expand-lg sticky-top">
      <div class="container">
        <a class="navbar-brand fw-bold" routerLink="/">🛍️ Monecome</a>
        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarNav">
          <ul class="navbar-nav ms-auto align-items-center gap-2">
            <li class="nav-item"><a class="nav-link" routerLink="/">Accueil</a></li>
            <li class="nav-item"><a class="nav-link" routerLink="/produits">Produits</a></li>
            <li class="nav-item">
              <a class="nav-link position-relative" routerLink="/panier">🛒 Panier
                <span *ngIf="cartCount > 0" class="cart-badge">{{ cartCount }}</span>
              </a>
            </li>
            <li class="nav-item" *ngIf="!isLoggedIn">
              <a class="btn btn-outline-light btn-sm" routerLink="/login">Connexion</a>
              <a class="btn btn-light btn-sm ms-2" routerLink="/register">Inscription</a>
            </li>
            <li class="nav-item dropdown" *ngIf="isLoggedIn">
              <a class="nav-link dropdown-toggle" data-bs-toggle="dropdown">👤 {{ getUserName() }}</a>
              <ul class="dropdown-menu dropdown-menu-end">
                <li><a class="dropdown-item" [routerLink]="getDashboardLink()">📊 Dashboard</a></li>
                <li><a class="dropdown-item" routerLink="/panier">🛒 Mon panier</a></li>
                <li><hr class="dropdown-divider"></li>
                <li><a class="dropdown-item text-danger" (click)="logout()">🚪 Déconnexion</a></li>
              </ul>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  `,
  styles: [`
    .navbar { background: linear-gradient(135deg, #0f766e, #14b8a6); padding: 0.75rem 0; }
    .navbar-brand, .nav-link { color: white !important; }
    .btn-outline-light { border-color: rgba(255,255,255,0.3); color: white; }
    .btn-outline-light:hover { background: rgba(255,255,255,0.15); }
    .btn-light { background: white; color: #0f766e; }
    .cart-badge { position: absolute; top: -8px; right: -12px; background: #ef4444; color: white; font-size: 0.65rem; padding: 2px 6px; border-radius: 20px; }
    .dropdown-menu { border-radius: 12px; box-shadow: 0 10px 25px rgba(0,0,0,0.1); }
  `]
})
export class NavbarComponent implements OnInit {
  cartCount = 0; isLoggedIn = false; currentUser: any = null;
  constructor(private authService: AuthService, private cartService: CartService, private router: Router) {}
  ngOnInit() {
    this.cartService.cart$.subscribe(() => this.cartCount = this.cartService.getCount());
    this.isLoggedIn = this.authService.isLoggedIn();
    this.currentUser = this.authService.getCurrentUser();
  }
  getUserName(): string { return this.currentUser?.nom || 'Utilisateur'; }
  getDashboardLink(): string { return this.currentUser?.role === 'admin' ? '/admin' : '/vendeur'; }
  async logout() { await this.authService.logout(); this.router.navigate(['/login']); }
}
