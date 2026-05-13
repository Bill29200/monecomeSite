import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FirebaseService } from '../../../services/firebase.service';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit {
  
  stats = {
    boutiquesActives: 1,
    produits: 0,
    commandes: 0,
    clients: 0,
    vendeurs: 0
  };

  constructor(
    private firebase: FirebaseService,
    private authService: AuthService,
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

      this.stats.boutiquesActives = boutiques.length;
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

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
