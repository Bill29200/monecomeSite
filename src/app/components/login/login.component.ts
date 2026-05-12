import { Component } from '@angular/core';

@Component({
  selector: 'app-login',
  template: `
    <div class="row justify-content-center">
      <div class="col-md-6">
        <div class="card">
          <div class="card-header">
            <h4>Connexion</h4>
          </div>
          <div class="card-body">
            <form>
              <div class="mb-3">
                <label class="form-label">Email</label>
                <input type="email" class="form-control" placeholder="email@exemple.com">
              </div>
              <div class="mb-3">
                <label class="form-label">Mot de passe</label>
                <input type="password" class="form-control" placeholder="Mot de passe">
              </div>
              <button type="submit" class="btn btn-primary w-100">Se connecter</button>
            </form>
            <hr>
            <p class="text-center">Pas de compte ? <a routerLink="/register">S'inscrire</a></p>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: []
})
export class LoginComponent {}
