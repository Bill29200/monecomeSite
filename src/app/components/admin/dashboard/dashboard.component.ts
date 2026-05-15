import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FirebaseService } from '../../../services/firebase.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styles: []
})
export class DashboardComponent implements OnInit {
  stats = {
    boutiquesActives: 0,
    produits: 0,
    vendeurs: 0,
    clients: 0
  };

  constructor(
    private firebase: FirebaseService,
    private router: Router
  ) {}

  async ngOnInit() {
    await this.loadStats();
  }

  async loadStats() {
    try {
      const boutiques = await this.firebase.getData('boutiques');
      const produits = await this.firebase.getData('products');
      const users = await this.firebase.getData('users');

      this.stats.boutiquesActives = boutiques.filter((b: any) => b.statut === 'active').length;
      this.stats.produits = produits.length;
      this.stats.vendeurs = users.filter((u: any) => u.role === 'vendeur').length;
      this.stats.clients = users.filter((u: any) => u.role === 'client').length;
    } catch (error) {
      console.error('Erreur chargement stats:', error);
    }
  }

  navigateTo(route: string) {
    this.router.navigate([route]);
  }
}
