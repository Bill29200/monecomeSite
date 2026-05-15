import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-admin-layout',
  template: `
    <div class="admin-layout"><aside class="admin-sidebar"><div class="sidebar-header"><h4>🛍️ Admin</h4></div>
      <nav><a routerLink="/admin/dashboard" class="menu-item">📈 Dashboard</a><a routerLink="/admin/boutiques" class="menu-item"> 🛍️ Boutiques</a>
      <a routerLink="/admin/vendeurs" class="menu-item">👥 Vendeurs</a><a routerLink="/admin/abonnements" class="menu-item">💳 Abonnements</a></nav>
      <div class="sidebar-footer"><button class="btn-logout" (click)="logout()">🚪 Déconnexion</button></div>
    </aside><main class="admin-main"><router-outlet></router-outlet></main></div>
  `,
  styles: [`
    .admin-layout { display: flex; min-height: 100vh; background: #f8fafc; }
    .admin-sidebar { width: 260px; background: #1e293b; position: fixed; height: 100vh; display: flex; flex-direction: column; }
    .sidebar-header { padding: 24px; border-bottom: 1px solid #334155; color: white; }
    .menu-item { display: flex; align-items: center; gap: 12px; padding: 12px 24px; color: #94a3b8; text-decoration: none; transition: all 0.3s; }
    .menu-item:hover, .menu-item.active { background: #0f766e; color: white; }
    .sidebar-footer { padding: 20px; margin-top: auto; border-top: 1px solid #334155; }
    .btn-logout { width: 100%; padding: 10px; background: #dc2626; border: none; border-radius: 8px; color: white; cursor: pointer; }
    .admin-main { flex: 1; margin-left: 260px; padding: 24px; }
  `]
})
export class AdminLayoutComponent {
  constructor(private auth: AuthService, private router: Router) {}
  async logout() { await this.auth.logout(); this.router.navigate(['/login']); }
}
