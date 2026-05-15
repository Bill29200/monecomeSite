import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { VendeurAuthService } from '../../../services/vendeur-auth.service';
import { VendeurService } from '../../../services/vendeur.service';
import { Boutique } from '../../../models/boutique.model';

@Component({
  selector: 'app-vendeur-layout',
  templateUrl: './vendeur-layout.component.html',
})
export class VendeurLayoutComponent implements OnInit {
  boutiques: Boutique[] = [];
  boutiqueSelectionnee: Boutique | null = null;
  vendeurNom: string = '';
  vendeurEmail: string = '';

  constructor(
    private vendeurAuth: VendeurAuthService,
    private vendeurService: VendeurService,
    private router: Router
  ) {}

  async ngOnInit() {
    await this.loadVendeurInfo();
    await this.loadBoutiques();
  }

  async loadVendeurInfo() {
    const vendeur = this.vendeurAuth.getCurrentVendeur();
    this.vendeurNom = vendeur?.nom || vendeur?.displayName || 'Vendeur';
    this.vendeurEmail = vendeur?.email || '';
  }

  getVendeurName(): string {
    return this.vendeurNom;
  }

  getVendeurEmail(): string {
    return this.vendeurEmail;
  }

  async loadBoutiques() {
    this.boutiques = await this.vendeurService.getCurrentVendeurBoutiques();
    if (this.boutiques.length > 0) {
      const savedBoutiqueId = localStorage.getItem('boutiqueVendeurId');
      if (savedBoutiqueId) {
        this.boutiqueSelectionnee = this.boutiques.find(b => b.id === savedBoutiqueId) || this.boutiques[0];
      } else {
        this.boutiqueSelectionnee = this.boutiques[0];
      }
    }
  }

  async selectBoutique(boutique: Boutique) {
    this.boutiqueSelectionnee = boutique;
    localStorage.setItem('boutiqueVendeurId', boutique.id!);
    const currentUrl = this.router.url;
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.router.navigate([currentUrl]);
    });
  }

  async logout() {
    await this.vendeurAuth.logout();
    this.router.navigate(['/login']);
  }

  getInitial(): string {
    return this.vendeurNom.charAt(0).toUpperCase();
  }
}
