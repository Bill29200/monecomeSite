import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { VendeurAuthService } from '../../services/vendeur-auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
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
    console.log('🔐 Tentative de connexion:', this.email);

    this.loading = true;
    this.errorMessage = '';

    try {
      // D'abord, essayer de se connecter comme vendeur
      try {
        const vendeur = await this.vendeurAuthService.login(this.email, this.password);
        if (vendeur) {
          console.log('✅ Connexion vendeur réussie:', vendeur);
          this.router.navigate(['/vendeur']);
          return;
        }
      } catch (vendeurError: any) {
        console.log('Pas un compte vendeur, tentative client...');
      }

      // Sinon, connexion normale (client ou admin)
      const user = await this.authService.login(this.email, this.password);
      console.log('✅ Connexion réussie:', user);

      if (user) {
        if (user.role === 'admin') {
          console.log('👑 Redirection vers /admin');
          this.router.navigate(['/admin']);
        } else if (user.role === 'vendeur') {
          console.log(' 🛍️ Redirection vers /vendeur');
          this.router.navigate(['/vendeur']);
        } else {
          console.log('👤 Redirection vers /');
          this.router.navigate(['/']);
        }
      }
    } catch (error: any) {
      console.error('❌ Erreur:', error);
      this.errorMessage = error.message || 'Email ou mot de passe incorrect';
    } finally {
      this.loading = false;
    }
  }
}
