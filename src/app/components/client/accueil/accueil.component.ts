import { Component } from '@angular/core';

@Component({
  selector: 'app-accueil',
  template: `
    <div class="text-center">
      <h1 class="display-4">🏪 Bienvenue sur Monecome</h1>
      <p class="lead">Plateforme de location de boutiques en ligne</p>
      <div class="row mt-5">
        <div class="col-md-4">
          <div class="card">
            <div class="card-body">
              <h5 class="card-title">👨‍💼 Admin</h5>
              <p class="card-text">Gérez les vendeurs et leurs boutiques</p>
            </div>
          </div>
        </div>
        <div class="col-md-4">
          <div class="card">
            <div class="card-body">
              <h5 class="card-title">🛍️ Vendeur</h5>
              <p class="card-text">Gérez vos boutiques et produits</p>
            </div>
          </div>
        </div>
        <div class="col-md-4">
          <div class="card">
            <div class="card-body">
              <h5 class="card-title">👤 Client</h5>
              <p class="card-text">Achetez des produits en ligne</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: []
})
export class AccueilComponent {}
