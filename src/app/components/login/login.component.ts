import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { VendeurAuthService } from '../../services/vendeur-auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
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
      // Essayer d'abord de se connecter en tant que vendeur
      try {
        const vendeur = await this.vendeurAuthService.login(this.email, this.password);
        if (vendeur) {
          console.log('✅ Connexion vendeur réussie:', vendeur);
          this.router.navigate(['/vendeur']);
          return;
        }
      } catch (vendeurError: any) {
        // Si ce n'est pas un vendeur, essayer client/admin
        if (vendeurError.message === 'Accès réservé aux vendeurs') {
          // Continuer avec la connexion normale
        } else {
          throw vendeurError;
        }
      }

      // Connexion normale (client ou admin)
      const user = await this.authService.login(this.email, this.password);
      if (user) {
        console.log('✅ Connexion réussie:', user);
        
        if (user.role === 'admin') {
          this.router.navigate(['/admin']);
        } else {
          this.router.navigate(['/']);
        }
      } else {
        this.errorMessage = 'Identifiants incorrects';
      }
    } catch (error: any) {
      console.error('Erreur login:', error);
      this.errorMessage = error.message || 'Erreur de connexion. Vérifiez vos identifiants.';
    } finally {
      this.loading = false;
    }
  }
}
