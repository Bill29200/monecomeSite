import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { VendeurAuthService } from '../../services/vendeur-auth.service';

@Component({
  selector: 'app-login',
  template: `
    <div class="auth-page">
      <div class="auth-container">
        <div class="auth-card">
          <h2>Connexion</h2>
          <p class="auth-subtitle">Connectez-vous à votre compte</p>
          
          <form (ngSubmit)="onLogin()">
            <div class="form-group">
              <label class="form-label">Email</label>
              <div class="input-icon">
                <i class="bi bi-envelope"></i>
                <input type="email" class="form-control" 
                       [(ngModel)]="email" name="email" 
                       placeholder="exemple@email.com" required>
              </div>
            </div>
            
            <div class="form-group">
              <label class="form-label">Mot de passe</label>
              <div class="input-icon">
                <i class="bi bi-lock"></i>
                <input type="password" class="form-control" 
                       [(ngModel)]="password" name="password" 
                       placeholder="••••••••" required>
              </div>
            </div>

            <button type="submit" class="auth-btn" [disabled]="loading">
              <i class="bi bi-box-arrow-in-right"></i>
              {{ loading ? 'Connexion en cours...' : 'Se connecter' }}
            </button>
          </form>

          <div *ngIf="errorMessage" class="alert alert-danger">
            <i class="bi bi-exclamation-triangle"></i> {{ errorMessage }}
          </div>

          <div class="auth-footer">
            <p>Pas encore de compte ? <a routerLink="/register">Créer un compte</a></p>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: []
})
export class LoginComponent {
  email: string = '';
  password: string = '';
  loading: boolean = false;
  errorMessage: string = '';

  constructor(
    private authService: AuthService,
    private vendeurAuthService: VendeurAuthService,
    private router: Router
  ) {}

  async onLogin() {
    this.loading = true;
    this.errorMessage = '';

    try {
      // Essayer connexion vendeur
      try {
        const vendeur = await this.vendeurAuthService.login(this.email, this.password);
        if (vendeur) {
          this.router.navigate(['/vendeur']);
          return;
        }
      } catch (vendeurError: any) {
        if (vendeurError.message !== 'Accès réservé aux vendeurs') {
          throw vendeurError;
        }
      }

      // Connexion client ou admin
      const user = await this.authService.login(this.email, this.password);
      if (user) {
        if (user.role === 'admin') {
          this.router.navigate(['/admin']);
        } else {
          this.router.navigate(['/']);
        }
      } else {
        this.errorMessage = 'Email ou mot de passe incorrect';
      }
    } catch (error: any) {
      this.errorMessage = error.message || 'Erreur de connexion';
    } finally {
      this.loading = false;
    }
  }
}
