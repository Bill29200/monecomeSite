import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  email: string = 'admin@monecome.com';
  password: string = 'admin123';
  loading: boolean = false;
  errorMessage: string = '';

  constructor(private authService: AuthService, private router: Router) {}

  async onLogin() {
    this.loading = true;
    this.errorMessage = '';

    try {
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
