import { Component } from '@angular/core';

@Component({
  selector: 'app-register',
  template: `
    <div class="row justify-content-center">
      <div class="col-md-6">
        <div class="card">
          <div class="card-header">
            <h4>Inscription</h4>
          </div>
          <div class="card-body">
            <form>
              <div class="mb-3">
                <label class="form-label">Nom complet</label>
                <input type="text" class="form-control" placeholder="Votre nom">
              </div>
              <div class="mb-3">
                <label class="form-label">Email</label>
                <input type="email" class="form-control" placeholder="email@exemple.com">
              </div>
              <div class="mb-3">
                <label class="form-label">Mot de passe</label>
                <input type="password" class="form-control" placeholder="Mot de passe">
              </div>
              <div class="mb-3">
                <label class="form-label">Rôle</label>
                <select class="form-select">
                  <option value="client">Client</option>
                  <option value="vendeur">Vendeur</option>
                </select>
              </div>
              <button type="submit" class="btn btn-primary w-100">S'inscrire</button>
            </form>
            <hr>
            <p class="text-center">Déjà un compte ? <a routerLink="/login">Se connecter</a></p>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: []
})
export class RegisterComponent {}
