import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { FirebaseService } from '../../services/firebase.service';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';

@Component({
  selector: 'app-register',
  template: `
    <div class="auth-page">
      <div class="auth-container">
        <div class="auth-card">
          <h2>Inscription</h2>
          <p class="auth-subtitle">Créez votre compte gratuitement</p>
          
          <!-- Sélecteur de rôle -->
          <div class="role-selector">
            <div class="role-option" [class.active]="selectedRole === 'client'" (click)="selectedRole = 'client'">
              <i class="bi bi-person"></i> Client
            </div>
            <div class="role-option" [class.active]="selectedRole === 'vendeur'" (click)="selectedRole = 'vendeur'">
              <i class="bi bi-shop"></i> Vendeur
            </div>
          </div>

          <form (ngSubmit)="onRegister()">
            <div class="form-group">
              <label class="form-label">Nom complet</label>
              <div class="input-icon">
                <i class="bi bi-person"></i>
                <input type="text" class="form-control" 
                       [(ngModel)]="nom" name="nom" 
                       placeholder="Jean Dupont" required>
              </div>
            </div>

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
                       placeholder="Minimum 6 caractères" required>
              </div>
            </div>

            <div class="form-group" *ngIf="selectedRole === 'vendeur'">
              <label class="form-label">Téléphone (optionnel)</label>
              <div class="input-icon">
                <i class="bi bi-telephone"></i>
                <input type="tel" class="form-control" 
                       [(ngModel)]="telephone" name="telephone" 
                       placeholder="+33 6 12 34 56 78">
              </div>
            </div>

            <button type="submit" class="auth-btn" [disabled]="loading">
              <i class="bi bi-person-plus"></i>
              {{ loading ? 'Inscription en cours...' : "S'inscrire" }}
            </button>
          </form>

          <div *ngIf="errorMessage" class="alert alert-danger">
            <i class="bi bi-exclamation-triangle"></i> {{ errorMessage }}
          </div>

          <div *ngIf="successMessage" class="alert alert-success">
            <i class="bi bi-check-circle"></i> {{ successMessage }}
          </div>

          <div class="auth-footer">
            <p>Déjà un compte ? <a routerLink="/login">Se connecter</a></p>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: []
})
export class RegisterComponent {
  nom: string = '';
  email: string = '';
  password: string = '';
  telephone: string = '';
  selectedRole: 'client' | 'vendeur' = 'client';
  loading: boolean = false;
  errorMessage: string = '';
  successMessage: string = '';

  constructor(
    private authService: AuthService,
    private firebase: FirebaseService,
    private router: Router
  ) {}

  async onRegister() {
    this.loading = true;
    this.errorMessage = '';
    this.successMessage = '';

    if (!this.nom || !this.email || !this.password) {
      this.errorMessage = 'Veuillez remplir tous les champs obligatoires';
      this.loading = false;
      return;
    }

    if (this.password.length < 6) {
      this.errorMessage = 'Le mot de passe doit contenir au moins 6 caractères';
      this.loading = false;
      return;
    }

    try {
      const auth = getAuth();
      const userCredential = await createUserWithEmailAndPassword(auth, this.email, this.password);
      
      const userData = {
        uid: userCredential.user.uid,
        nom: this.nom,
        email: this.email,
        telephone: this.telephone,
        role: this.selectedRole,
        isActive: true,
        createdAt: new Date().toISOString()
      };

      await this.firebase.addData('users', userData);
      
      this.successMessage = `Compte ${this.selectedRole} créé avec succès ! Redirection...`;
      
      setTimeout(() => {
        if (this.selectedRole === 'vendeur') {
          this.router.navigate(['/login']);
        } else {
          this.router.navigate(['/login']);
        }
      }, 2000);
      
    } catch (error: any) {
      if (error.code === 'auth/email-already-in-use') {
        this.errorMessage = 'Cet email est déjà utilisé';
      } else {
        this.errorMessage = error.message || 'Erreur lors de l\'inscription';
      }
    } finally {
      this.loading = false;
    }
  }
}
