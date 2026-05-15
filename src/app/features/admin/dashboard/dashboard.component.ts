import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FirebaseService } from '../../../core/services/firebase.service';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-dashboard',
  template: `
    <div class="admin-container"><h2 class="mb-4">📊 Tableau de bord Admin</h2>
      <div class="row g-4 mb-4"><div class="col-md-3"><div class="stat-card bg-primary text-white"><h3>{{ stats.boutiques }}</h3><p>Boutiques</p></div></div>
        <div class="col-md-3"><div class="stat-card bg-success text-white"><h3>{{ stats.produits }}</h3><p>Produits</p></div></div>
        <div class="col-md-3"><div class="stat-card bg-info text-white"><h3>{{ stats.vendeurs }}</h3><p>Vendeurs</p></div></div>
        <div class="col-md-3"><div class="stat-card bg-warning text-white"><h3>{{ stats.clients }}</h3><p>Clients</p></div></div>
      </div>
      <div class="row"><div class="col-md-3 mb-3" *ngFor="let s of sections"><div class="card action-card" (click)="go(s.route)"><div class="card-body text-center"><i [class]="s.icon + ' fs-1'"></i><h5>{{ s.title }}</h5><button class="btn btn-sm btn-primary mt-2">Accéder</button></div></div></div></div>
    </div>
  `,
  styles: [`
    .admin-container { padding: 20px; background: #f8fafc; min-height: 100vh; }
    .stat-card { padding: 20px; border-radius: 16px; text-align: center; }
    .action-card { cursor: pointer; transition: transform 0.3s; border-radius: 16px; }
    .action-card:hover { transform: translateY(-5px); box-shadow: 0 10px 25px rgba(0,0,0,0.1); }
  `]
})
export class DashboardComponent implements OnInit {
  stats = { boutiques: 0, produits: 0, vendeurs: 0, clients: 0 };
  sections = [
    { title: 'Boutiques', icon: 'bi bi-shop', route: '/admin/boutiques' },
    { title: 'Vendeurs', icon: 'bi bi-people', route: '/admin/vendeurs' },
    { title: 'Abonnements', icon: 'bi bi-credit-card', route: '/admin/abonnements' }
  ];
  constructor(private firebase: FirebaseService, private auth: AuthService, private router: Router) {}
  async ngOnInit() {
    const boutiques = await this.firebase.getBoutiques();
    const produits = await this.firebase.getProducts();
    const users = await this.firebase.getUsers();
    this.stats.boutiques = boutiques.length;
    this.stats.produits = produits.length;
    this.stats.vendeurs = users.filter((u: any) => u.role === 'vendeur').length;
    this.stats.clients = users.filter((u: any) => u.role === 'client').length;
  }
  go(route: string) { this.router.navigate([route]); }
}
