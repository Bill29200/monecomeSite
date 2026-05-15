import { Component, OnInit } from '@angular/core';
import { FirebaseService } from '../../../core/services/firebase.service';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-vendeur-dashboard',
  template: `<div class="p-4"><h2>📊 Dashboard Vendeur</h2><div class="row mt-4"><div class="col-md-4"><div class="card p-3"><h3>{{ produitsCount }}</h3><p>Mes produits</p></div></div>
    <div class="col-md-4"><div class="card p-3"><h3>{{ commandesCount }}</h3><p>Commandes</p></div></div></div></div>`
})
export class VendeurDashboardComponent implements OnInit {
  produitsCount = 0; commandesCount = 0;
  constructor(private firebase: FirebaseService, private auth: AuthService) {}
  async ngOnInit() {
    const produits = await this.firebase.getProducts();
    const user = this.auth.getCurrentUser();
    const userProduits = produits.filter((p: any) => p.vendeurId === user?.uid);
    this.produitsCount = userProduits.length;
    const commandes = await this.firebase.getCommandes();
    this.commandesCount = commandes.length;
  }
}
