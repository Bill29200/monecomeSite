import { Component, OnInit } from '@angular/core';
import { FirebaseService } from '../../../core/services/firebase.service';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-vendeur-produits',
  template: `<div class="p-4"><h2>📦 Mes produits</h2><div class="row"><div class="col-md-4" *ngFor="let p of produits"><div class="card mb-3"><div class="card-body"><h5>{{ p.nom }}</h5><p>{{ p.prix }}€</p></div></div></div></div></div>`
})
export class VendeurProduitsComponent implements OnInit {
  produits: any[] = [];
  constructor(private firebase: FirebaseService, private auth: AuthService) {}
  async ngOnInit() {
    const all = await this.firebase.getProducts();
    const user = this.auth.getCurrentUser();
    this.produits = all.filter((p: any) => p.vendeurId === user?.uid);
  }
}
