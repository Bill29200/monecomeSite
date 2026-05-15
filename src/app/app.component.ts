import { Component, OnInit } from '@angular/core';
import { AuthService } from './services/auth.service';
import { VendeurAuthService } from './services/vendeur-auth.service';
import { Router, NavigationEnd } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'monecome';
  cartCount: number = 0;

  constructor(
    private authService: AuthService,
    private vendeurAuthService: VendeurAuthService,
    private router: Router
  ) {
    this.updateCartCount();
    window.addEventListener('storage', () => this.updateCartCount());
  }

  ngOnInit() {}

  updateCartCount() {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    this.cartCount = cart.reduce((total: number, item: any) => total + (item.quantite || 1), 0);
  }

  refreshPage() {
    window.location.reload();
  }

  isLoggedIn(): boolean {
    return this.authService.isLoggedIn() || this.vendeurAuthService.isLoggedIn();
  }

  getUserName(): string {
    const user = this.authService.getCurrentUser();
    const vendeur = this.vendeurAuthService.getCurrentVendeur();
    
    if (vendeur) {
      return vendeur.nom || vendeur.displayName || 'Vendeur';
    }
    if (user) {
      return user.nom || user.displayName || 'Client';
    }
    return '';
  }

  getUserInitial(): string {
    const name = this.getUserName();
    return name.charAt(0).toUpperCase();
  }

  getDashboardLink(): string {
    const user = this.authService.getCurrentUser();
    const vendeur = this.vendeurAuthService.getCurrentVendeur();
    
    if (vendeur || user?.role === 'vendeur') {
      return '/vendeur';
    }
    if (user?.role === 'admin') {
      return '/admin';
    }
    return '/';
  }

  async logout() {
    if (this.vendeurAuthService.isLoggedIn()) {
      await this.vendeurAuthService.logout();
    } else {
      await this.authService.logout();
    }
    this.router.navigate(['/login']);
    this.updateCartCount();
  }
}
