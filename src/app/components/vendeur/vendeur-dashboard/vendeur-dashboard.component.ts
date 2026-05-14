import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { VendeurAuthService } from '../../../services/vendeur-auth.service';
import { VendeurService } from '../../../services/vendeur.service';
import { Boutique } from '../../../models/boutique.model';

@Component({
  selector: 'app-vendeur-dashboard',
  templateUrl: './vendeur-dashboard.component.html',
  styleUrls: ['./vendeur-dashboard.component.css']
})
export class VendeurDashboardComponent implements OnInit {
  boutiques: Boutique[] = [];
  boutiqueSelectionnee: Boutique | null = null;
  
  stats = {
    boutiques: 0,
    produits: 0,
    clients: 0,
    clientsTotal: 0,
    commandes: 0,
    commandesEnAttente: 0,
    chiffreAffaire: 0
  };

  constructor(
    private vendeurAuth: VendeurAuthService,
    private vendeurService: VendeurService,
    private router: Router
  ) {}

  async ngOnInit() {
    await this.loadBoutiques();
  }

  async loadBoutiques() {
    this.boutiques = await this.vendeurService.getCurrentVendeurBoutiques();
    this.stats.boutiques = this.boutiques.length;
    
    if (this.boutiques.length > 0) {
      this.boutiqueSelectionnee = this.boutiques[0];
      await this.loadStats();
      await this.loadAllClientsCount();
    }
  }

  async selectBoutique(boutique: Boutique) {
    this.boutiqueSelectionnee = boutique;
    localStorage.setItem('boutiqueVendeurId', boutique.id!);
    await this.loadStats();
  }

  async loadStats() {
    if (!this.boutiqueSelectionnee) return;

    const produits = await this.vendeurService.getBoutiqueProduits(this.boutiqueSelectionnee.id!);
    const clients = await this.vendeurService.getBoutiqueClients(this.boutiqueSelectionnee.id!);
    const commandes = await this.vendeurService.getBoutiqueCommandes(this.boutiqueSelectionnee.id!);
    
    this.stats.produits = produits.length;
    this.stats.clients = clients.length;
    this.stats.commandes = commandes.length;
    this.stats.commandesEnAttente = commandes.filter((c: any) => c.statut === 'en_attente').length;
    this.stats.chiffreAffaire = await this.vendeurService.getChiffreAffaire(this.boutiqueSelectionnee.id!);
  }

  async loadAllClientsCount() {
    let totalClients = 0;
    for (const boutique of this.boutiques) {
      const clients = await this.vendeurService.getBoutiqueClients(boutique.id!);
      totalClients += clients.length;
    }
    this.stats.clientsTotal = totalClients;
  }

  getVendeurName(): string {
    const vendeur = this.vendeurAuth.getCurrentVendeur();
    return vendeur?.nom || vendeur?.displayName || 'Vendeur';
  }

  getVendeurEmail(): string {
    const vendeur = this.vendeurAuth.getCurrentVendeur();
    return vendeur?.email || '';
  }

  async logout() {
    await this.vendeurAuth.logout();
    this.router.navigate(['/login']);
  }
}
