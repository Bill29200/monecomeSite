import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FirebaseService } from '../../../core/services/firebase.service';

@Component({
  selector: 'app-register',
  template: `
    <div class="register-page"><div class="register-container"><div class="register-card">
      <h2 class="text-center">Inscription</h2>
      <form (ngSubmit)="onRegister()"><div class="mb-3"><label>Nom</label><input type="text" class="form-control" [(ngModel)]="nom" required></div>
        <div class="mb-3"><label>Email</label><input type="email" class="form-control" [(ngModel)]="email" required></div>
        <div class="mb-3"><label>Mot de passe</label><input type="password" class="form-control" [(ngModel)]="password" required></div>
        <div class="mb-3"><label>Rôle</label><select class="form-select" [(ngModel)]="role"><option value="client">Client</option><option value="vendeur">Vendeur</option></select></div>
        <button type="submit" class="btn-register w-100" [disabled]="loading">{{ loading ? 'Inscription...' : "S'inscrire" }}</button>
        <div *ngIf="errorMessage" class="alert alert-danger mt-3">{{ errorMessage }}</div>
      </form><hr><p class="text-center">Déjà un compte ? <a routerLink="/login">Se connecter</a></p>
    </div></div></div>
  `,
  styles: [`
    .register-page { min-height: 100vh; background: linear-gradient(135deg, #0f766e, #14b8a6); display: flex; align-items: center; justify-content: center; padding: 20px; }
    .register-container { width: 100%; max-width: 480px; }
    .register-card { background: white; border-radius: 20px; padding: 40px 30px; box-shadow: 0 20px 40px rgba(0,0,0,0.15); }
    .btn-register { background: linear-gradient(135deg, #0f766e, #14b8a6); border: none; color: white; padding: 14px; border-radius: 50px; font-weight: 600; width: 100%; }
    .form-control, .form-select { border-radius: 12px; padding: 12px 16px; border: 1.5px solid #e2e8f0; }
  `]
})
export class RegisterComponent {
  nom = ''; email = ''; password = ''; role: 'client' | 'vendeur' = 'client'; loading = false; errorMessage = '';
  constructor(private firebase: FirebaseService, private router: Router) {}
  async onRegister() {
    if (!this.nom || !this.email || !this.password) { this.errorMessage = 'Tous les champs sont requis'; return; }
    if (this.password.length < 6) { this.errorMessage = 'Mot de passe: 6 caractères minimum'; return; }
    this.loading = true;
    try {
      const result = await this.firebase.register(this.email, this.password);
      await this.firebase.addData('users', { uid: result.user.uid, nom: this.nom, email: this.email, role: this.role, isActive: true, createdAt: new Date().toISOString() });
      alert('✅ Inscription réussie ! Connectez-vous.');
      this.router.navigate(['/login']);
    } catch(e: any) { this.errorMessage = e.code === 'auth/email-already-in-use' ? 'Email déjà utilisé' : e.message; }
    finally { this.loading = false; }
  }
}
