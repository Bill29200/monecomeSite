import { Component } from '@angular/core';

@Component({
  selector: 'app-register',
  template: `
    <div style="min-height:82vh;display:flex;align-items:center;background:var(--bg);padding:48px 16px">
      <div style="max-width:480px;width:100%;margin:auto">

        <div style="text-align:center;margin-bottom:36px">
          <span style="font-size:52px"> 🛍️</span>
          <h2 style="font-size:30px;font-weight:800;margin:14px 0 8px">Créer un compte</h2>
          <p style="color:var(--gray)">Rejoignez la communauté Monecome</p>
        </div>

        <div class="card-modern" style="padding:40px">
          <form>
            <div style="margin-bottom:22px">
              <label style="font-size:11px;font-weight:700;letter-spacing:1.2px;
                            color:var(--gray);text-transform:uppercase;display:block;margin-bottom:8px">
                Nom complet
              </label>
              <input type="text" class="form-control" placeholder="John Doe"
                     [(ngModel)]="nom" name="nom">
            </div>

            <div style="margin-bottom:22px">
              <label style="font-size:11px;font-weight:700;letter-spacing:1.2px;
                            color:var(--gray);text-transform:uppercase;display:block;margin-bottom:8px">
                Email
              </label>
              <input type="email" class="form-control" placeholder="john@exemple.com"
                     [(ngModel)]="email" name="email">
            </div>

            <div style="margin-bottom:22px">
              <label style="font-size:11px;font-weight:700;letter-spacing:1.2px;
                            color:var(--gray);text-transform:uppercase;display:block;margin-bottom:8px">
                Mot de passe
              </label>
              <input type="password" class="form-control" placeholder="••••••••"
                     [(ngModel)]="password" name="password">
            </div>

            <div style="margin-bottom:32px">
              <label style="font-size:11px;font-weight:700;letter-spacing:1.2px;
                            color:var(--gray);text-transform:uppercase;display:block;margin-bottom:8px">
                Vous êtes ?
              </label>
              <select class="form-select" [(ngModel)]="role" name="role">
                <option value="client">🛍️ Client — Je veux acheter</option>
                <option value="vendeur">🏬 Vendeur — Je veux vendre</option>
              </select>
            </div>

            <button type="submit" class="btn-orange" style="width:100%;padding:16px;font-size:16px;text-align:center">
              Créer mon compte gratuitement →
            </button>
          </form>

          <p style="text-align:center;margin-top:28px;color:var(--gray);font-size:14px">
            Déjà membre ?
            <a routerLink="/login" style="color:var(--orange);font-weight:700;text-decoration:none">
              Se connecter
            </a>
          </p>
        </div>

      </div>
    </div>
  `
})
export class RegisterComponent {
  nom      = '';
  email    = '';
  password = '';
  role     = 'client';
}
