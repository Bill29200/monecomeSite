import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FirebaseService } from '../../../services/firebase.service';

@Component({
  selector: 'app-dashboard',
  template: `
    <div class="admin-dashboard">
      <h2 class="mb-4">📊 Tableau de Board Admin</h2>
      
      <!-- Stats Cards -->
      <div class="row mb-4">
        <div class="col-md-3 mb-3">
          <div class="card stat-card bg-gradient-primary text-white h-100">
            <div class="card-body">
              <div class="d-flex justify-content-between align-items-center">
                <div>
                  <h6 class="card-title text-uppercase fw-bold">Boutiques</h6>
                  <h2 class="mb-0 display-4">{{ stats.boutiques }}</h2>
                  <small>Actives: {{ stats.boutiquesActives }}</small>
                </div>
                <i class="bi bi-shop fs-1 opacity-50"></i>
              </div>
            </div>
          </div>
        </div>
        
        <div class="col-md-3 mb-3">
          <div class="card stat-card bg-gradient-success text-white h-100">
            <div class="card-body">
              <div class="d-flex justify-content-between align-items-center">
                <div>
                  <h6 class="card-title text-uppercase fw-bold">Produits</h6>
                  <h2 class="mb-0 display-4">{{ stats.produits }}</h2>
                  <small>Total catalogue</small>
                </div>
                <i class="bi bi-box-seam fs-1 opacity-50"></i>
              </div>
            </div>
          </div>
        </div>
        
        <div class="col-md-3 mb-3">
          <div class="card stat-card bg-gradient-info text-white h-100">
            <div class="card-body">
              <div class="d-flex justify-content-between align-items-center">
                <div>
                  <h6 class="card-title text-uppercase fw-bold">Commandes</h6>
                  <h2 class="mb-0 display-4">{{ stats.commandes }}</h2>
                  <small>En attente: {{ stats.commandesEnAttente }}</small>
                </div>
                <i class="bi bi-cart-check fs-1 opacity-50"></i>
              </div>
            </div>
          </div>
        </div>
        
        <div class="col-md-3 mb-3">
          <div class="card stat-card bg-gradient-warning text-white h-100">
            <div class="card-body">
              <div class="d-flex justify-content-between align-items-center">
                <div>
                  <h6 class="card-title text-uppercase fw-bold">Clients</h6>
                  <h2 class="mb-0 display-4">{{ stats.clients }}</h2>
                  <small>Inscrits</small>
                </div>
                <i class="bi bi-people fs-1 opacity-50"></i>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Navigation Cards -->
      <div class="row">
        <div class="col-md-6 col-lg-3 mb-3" *ngFor="let section of sections">
          <div class="card nav-card h-100" (click)="navigateTo(section.route)">
            <div class="card-body text-center">
              <i [class]="section.icon + ' fs-1 mb-3 d-block'"></i>
              <h5 class="card-title">{{ section.title }}</h5>
              <p class="card-text text-muted small">{{ section.description }}</p>
              <button class="btn btn-sm btn-outline-primary">Accéder →</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .stat-card {
      border-radius: 15px;
      cursor: pointer;
      transition: transform 0.3s, box-shadow 0.3s;
      border: none;
    }
    .stat-card:hover {
      transform: translateY(-5px);
      box-shadow: 0 10px 30px rgba(0,0,0,0.2);
    }
    .nav-card {
      cursor: pointer;
      transition: all 0.3s;
      border-radius: 15px;
      border: 1px solid #e0e0e0;
    }
    .nav-card:hover {
      transform: translateY(-5px);
      box-shadow: 0 10px 25px rgba(0,0,0,0.1);
      border-color: #667eea;
    }
    .bg-gradient-primary {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    }
    .bg-gradient-success {
      background: linear-gradient(135deg, #11998e 0%, #38ef7d 100%);
    }
    .bg-gradient-info {
      background: linear-gradient(135deg, #3b82f6 0%, #2dd4bf 100%);
    }
    .bg-gradient-warning {
      background: linear-gradient(135deg, #f59e0b 0%, #f97316 100%);
    }
    .fs-1 {
      font-size: 2.5rem;
    }
  `]
})
export class DashboardComponent implements OnInit {
  stats = {
    boutiques: 12,
    boutiquesActives: 8,
    produits: 156,
    commandes: 45,
    commandesEnAttente: 12,
    clients: 89
  };

  sections = [
    { title: 'Boutiques', description: 'Gérer les boutiques, voir aperçu client', icon: 'bi bi-shop', route: '/admin/boutiques' },
    { title: 'Vendeurs', description: 'Créer et gérer les vendeurs', icon: 'bi bi-person-badge', route: '/admin/vendeurs' },
    { title: 'Abonnements', description: 'Configurer les packs', icon: 'bi bi-credit-card', route: '/admin/abonnements' },
    { title: 'Catégories', description: 'Gérer les catégories de produits', icon: 'bi bi-tags', route: '/admin/categories' }
  ];

  constructor(private router: Router, private firebase: FirebaseService) {}

  ngOnInit() {
    this.loadStats();
  }

  async loadStats() {
    // Charger les vraies données depuis Firebase
    try {
      const boutiques = await this.firebase.getData('boutiques');
      const produits = await this.firebase.getData('produits');
      const commandes = await this.firebase.getData('commandes');
      const clients = await this.firebase.getDataOnce('users', 'role', 'client');
      
      this.stats.boutiques = boutiques.length;
      this.stats.boutiquesActives = boutiques.filter((b: any) => b.estActive).length;
      this.stats.produits = produits.length;
      this.stats.commandes = commandes.length;
      this.stats.commandesEnAttente = commandes.filter((c: any) => c.statut === 'en_attente').length;
      this.stats.clients = clients.length;
    } catch (error) {
      console.error('Erreur chargement stats:', error);
    }
  }

  navigateTo(route: string) {
    this.router.navigate([route]);
  }
}
