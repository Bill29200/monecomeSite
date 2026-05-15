import { Component, OnInit } from '@angular/core';
import { BoutiqueService } from '../../../services/boutique.service';

@Component({
  selector: 'app-abonnements-admin',
  templateUrl: './abonnements-admin.component.html',
})
export class AbonnementsAdminComponent implements OnInit {
  boutiques: any[] = [];
  filteredBoutiques: any[] = [];
  searchTerm: string = '';

  plans = [
    { nom: 'Gratuit', prix: 0, produits: 5, categories: 1, couleur: 'secondary' },
    { nom: 'Basic', prix: 9.99, produits: 50, categories: 5, couleur: 'primary' },
    { nom: 'Premium', prix: 24.99, produits: 999, categories: 999, couleur: 'success' }
  ];

  constructor(private boutiqueService: BoutiqueService) {}

  async ngOnInit() {
    this.boutiques = await this.boutiqueService.getAllBoutiques();
    this.filteredBoutiques = [...this.boutiques];
  }

  filterBoutiques() {
    const term = this.searchTerm.toLowerCase();
    this.filteredBoutiques = this.boutiques.filter(b => 
      b.nom?.toLowerCase().includes(term) || 
      b.vendeurEmail?.toLowerCase().includes(term)
    );
  }
}
