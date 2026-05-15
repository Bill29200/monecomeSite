import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-login',
  template: `
    <div class="login-page"><div class="login-container"><div class="login-card">
      <h2 class="text-center">Connexion</h2>
      <form (ngSubmit)="onLogin()"><div class="mb-3"><label>Email</label><input type="email" class="form-control" [(ngModel)]="email" name="email" required></div>
        <div class="mb-3"><label>Mot de passe</label><input type="password" class="form-control" [(ngModel)]="password" name="password" required></div>
        <button type="submit" class="btn-login w-100" [disabled]="loading">{{ loading ? 'Connexion...' : 'Se connecter' }}</button>
        <div *ngIf="errorMessage" class="alert alert-danger mt-3">{{ errorMessage }}</div>
      </form><hr><p class="text-center">Pas de compte ? <a routerLink="/register">S'inscrire</a></p>
      <p class="text-center text-muted small">Admin: admin&#64;monecome.com / admin123</p>
    </div></div></div>
  `,
  styles: [`
    .login-page { min-height: 100vh; background: linear-gradient(135deg, #0f766e, #14b8a6); display: flex; align-items: center; justify-content: center; padding: 20px; }
    .login-container { width: 100%; max-width: 420px; }
    .login-card { background: white; border-radius: 20px; padding: 40px 30px; box-shadow: 0 20px 40px rgba(0,0,0,0.15); }
    .btn-login { background: linear-gradient(135deg, #0f766e, #14b8a6); border: none; color: white; padding: 14px; border-radius: 50px; font-weight: 600; }
    .form-control { border-radius: 12px; padding: 12px 16px; border: 1.5px solid #e2e8f0; }
    .form-control:focus { border-color: #0f766e; box-shadow: 0 0 0 3px rgba(15,118,110,0.15); }
  `]
})
export class LoginComponent {
  email = ''; password = ''; loading = false; errorMessage = '';
  constructor(private auth: AuthService, private router: Router) {}
  async onLogin() {
    this.loading = true;
    try {
      const user = await this.auth.login(this.email, this.password);
      if (user) this.router.navigate(user.role === 'admin' ? ['/admin'] : ['/']);
      else this.errorMessage = 'Identifiants incorrects';
    } catch(e: any) { this.errorMessage = e.message; }
    finally { this.loading = false; }
  }
}
