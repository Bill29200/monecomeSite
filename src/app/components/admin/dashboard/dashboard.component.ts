import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FirebaseService } from '../../../services/firebase.service';

@Component({
  selector: 'app-dashboard',
  template: `
    <div style="padding:48px 0;background:var(--bg);min-height:80vh">
      <div class="container">

        <h2 style="font-size:30px;font-weight:800;margin-bottom:36px">📊 Tableau de bord Admin</h2>

        <!-- Stat cards -->
        <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(220px,1fr));gap:20px;margin-bottom:40px">
          <div *ngFor="let s of statCards" class="card-modern"
               [style.background]="s.gradient" style="padding:30px;color:white">
            <div style="font-size:12px;font-weight:700;text-transform:uppercase;
                        letter-spacing:1px;opacity:.75;margin-bottom:10px">{{ s.label }}</div>
            <div style="font-size:44px;font-weight:800;line-height:1">{{ s.value }}</div>
            <div style="font-size:13px;opacity:.65;margin-top:10px">{{ s.sub }}</div>
          </div>
        </div>

        <!-- Nav sections -->
        <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(220px,1fr));gap:20px">
          <div *ngFor="let s of sections" class="card-modern"
               (click)="router.navigate([s.route])"
               style="padding:28px;text-align:center;cursor:pointer">
            <div style="font-size:40px;margin-bottom:14px">{{ s.emoji }}</div>
            <h5 style="font-weight:700;margin-bottom:8px">{{ s.title }}</h5>
            <p style="font-size:13px;color:var(--gray);margin-bottom:18px">{{ s.description }}</p>
            <button class="btn-outline-orange" style="padding:8px 20px;font-size:13px">Accéder →</button>
          </div>
        </div>

      </div>
    </div>
  `
})
export class DashboardComponent implements OnInit {

  stats = {
    boutiques: 0, boutiquesActives: 0,
    produits: 0,
    commandes: 0, commandesEnAttente: 0,
    clients: 0
  };

  get statCards() {
    return [
      { label: 'Boutiques',  value: this.stats.boutiques,  sub: `Actives : ${this.stats.boutiquesActives}`,         gradient: 'linear-gradient(135deg,#ff6b35,#e8541f)' },
      { label: 'Produits',   value: this.stats.produits,   sub: 'Total catalogue',                                  gradient: 'linear-gradient(135deg,#10b981,#059669)' },
      { label: 'Commandes',  value: this.stats.commandes,  sub: `En attente : ${this.stats.commandesEnAttente}`,    gradient: 'linear-gradient(135deg,#3b82f6,#2563eb)' },
      { label: 'Clients',    value: this.stats.clients,    sub: 'Inscrits',                                         gradient: 'linear-gradient(135deg,#8b5cf6,#7c3aed)' },
    ];
  }

  sections = [
    { title: 'Boutiques',   description: 'Gérer les boutiques et aperçus',  emoji: ' 🛍️', route: '/admin/boutiques'   },
    { title: 'Vendeurs',    description: 'Créer et gérer les vendeurs',      emoji: '👤', route: '/admin/vendeurs'    },
    { title: 'Abonnements', description: 'Configurer les packs et forfaits', emoji: '💳', route: '/admin/abonnements' },
    { title: 'Catégories',  description: 'Gérer les catégories produits',    emoji: '🏷️', route: '/admin/categories'  },
  ];

  constructor(public router: Router, private firebase: FirebaseService) {}

  async ngOnInit() {
    try {
      const [boutiques, produits, commandes, clients] = await Promise.all([
        this.firebase.getData('boutiques'),
        this.firebase.getData('produits'),
        this.firebase.getData('commandes'),
        this.firebase.getDataOnce('users', 'role', 'client'),
      ]);
      this.stats.boutiques          = boutiques.length;
      this.stats.boutiquesActives   = boutiques.filter((b: any) => b.estActive).length;
      this.stats.produits           = produits.length;
      this.stats.commandes          = commandes.length;
      this.stats.commandesEnAttente = commandes.filter((c: any) => c.statut === 'en_attente').length;
      this.stats.clients            = clients.length;
    } catch (e) {
      console.error('Erreur stats dashboard', e);
    }
  }
}
