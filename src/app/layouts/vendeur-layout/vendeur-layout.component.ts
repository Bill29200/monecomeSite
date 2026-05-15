import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { FirebaseService } from '../../core/services/firebase.service';

@Component({
  selector: 'app-vendeur-layout',
  template: `
    <div class="vendeur-layout"><aside class="vendeur-sidebar"><div class="sidebar-header"><h4>🛍️ Vendeur</h4></div>
      <nav><a routerLink="/vendeur/dashboard" class="menu-item">📈 Dashboard</a><a routerLink="/vendeur/produits" class="menu-item">📦 Produits</a>
      <a routerLink="/vendeur/commandes" class="menu-item">📋 Commandes</a></nav>
      <div class="sidebar-footer"><button class="btn-logout" (click)="logout()">🚪 Déconnexion</button></div>
    </aside><main class="vendeur-main"><router-outlet></router-outlet></main></div>
  `,
  styles: [`
    .vendeur-layout { display: flex; min-height: 100vh; background: #f8fafc; }
    .vendeur-sidebar { width: 260px; background: #1e293b; position: fixed; height: 100vh; display: flex; flex-direction: column; }
    .sidebar-header { padding: 24px; border-bottom: 1px solid #334155; color: white; }
    .menu-item { display: flex; align-items: center; gap: 12px; padding: 12px 24px; color: #94a3b8; text-decoration: none; }
    .menu-item:hover, .menu-item.active { background: #0f766e; color: white; }
    .sidebar-footer { padding: 20px; margin-top: auto; border-top: 1px solid #334155; }
    .btn-logout { width: 100%; padding: 10px; background: #dc2626; border: none; border-radius: 8px; color: white; cursor: pointer; }
    .vendeur-main { flex: 1; margin-left: 260px; padding: 24px; }
  `]
})
export class VendeurLayoutComponent implements OnInit {
  constructor(private auth: AuthService, private router: Router, private firebase: FirebaseService) {}
  async ngOnInit() {}
  async logout() { await this.auth.logout(); this.router.navigate(['/login']); }
}
