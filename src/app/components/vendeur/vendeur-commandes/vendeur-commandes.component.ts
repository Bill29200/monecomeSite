import { Component, OnInit } from '@angular/core';
import { VendeurService } from '../../../services/vendeur.service';

@Component({
  selector: 'app-vendeur-commandes',
  templateUrl: './vendeur-commandes.component.html',
  styleUrls: ['./vendeur-commandes.component.css']
})
export class VendeurCommandesComponent implements OnInit {
  commandes: any[] = [];
  filteredCommandes: any[] = [];
  searchTerm: string = '';
  statutFilter: string = 'tous';
  boutique: any = null;
  
  statuts: string[] = ['en_attente', 'confirmee', 'preparation', 'expediee', 'livree', 'annulee'];
  statutsLabels: Record<string, string> = {
    en_attente: '⏳ En attente',
    confirmee: '✅ Confirmée',
    preparation: '📦 En préparation',
    expediee: '🚚 Expédiée',
    livree: '🏠 Livrée',
    annulee: '❌ Annulée'
  };

  constructor(private vendeurService: VendeurService) {}

  async ngOnInit() {
    await this.loadData();
  }

  async loadData() {
    this.boutique = await this.vendeurService.getCurrentVendeurBoutique();
    if (this.boutique) {
      this.commandes = await this.vendeurService.getBoutiqueCommandes(this.boutique.id);
      this.applyFilters();
    }
  }

  applyFilters() {
    let filtered = [...this.commandes];
    
    if (this.searchTerm) {
      const term = this.searchTerm.toLowerCase();
      filtered = filtered.filter(c => 
        c.clientNom?.toLowerCase().includes(term) ||
        c.id?.toLowerCase().includes(term)
      );
    }
    
    if (this.statutFilter !== 'tous') {
      filtered = filtered.filter(c => c.statut === this.statutFilter);
    }
    
    this.filteredCommandes = filtered;
  }

  async updateStatut(commande: any, statut: string) {
    // Utiliser 'as any' pour contourner le typage strict
    await this.vendeurService.updateCommandeStatut(commande.id, statut as any);
    await this.loadData();
    alert(`✅ Commande ${this.statutsLabels[statut] || statut}`);
  }

  getStatutClass(statut: string): string {
    const classes: Record<string, string> = {
      en_attente: 'bg-warning',
      confirmee: 'bg-info',
      preparation: 'bg-primary',
      expediee: 'bg-info',
      livree: 'bg-success',
      annulee: 'bg-danger'
    };
    return classes[statut] || 'bg-secondary';
  }

  getTotalCommandes(): number {
    return this.commandes.length;
  }

  getChiffreAffaire(): number {
    return this.commandes
      .filter(c => c.statut === 'livree')
      .reduce((total, c) => total + (c.total || 0), 0);
  }
}
