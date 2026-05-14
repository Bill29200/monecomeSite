import { Injectable } from '@angular/core';
import { FirebaseService } from './firebase.service';
import { User } from '../models/user.model';

@Injectable({ providedIn: 'root' })
export class VendeurAuthService {
  private currentVendeur: User | null = null;

  constructor(private firebase: FirebaseService) {
    this.loadCurrentVendeur();
  }

  async loadCurrentVendeur() {
    const firebaseUser = this.firebase.getCurrentUser();
    if (firebaseUser?.uid) {
      const users = await this.firebase.getData('users');
      const user = users.find((u: any) => u.uid === firebaseUser.uid && u.role === 'vendeur');
      if (user) {
        this.currentVendeur = user;
      }
    }
  }

  async login(email: string, password: string): Promise<User | null> {
    try {
      const result = await this.firebase.login(email, password);
      const users = await this.firebase.getData('users');
      const userData = users.find((u: any) => u.uid === result.user.uid && u.role === 'vendeur');

      if (userData) {
        this.currentVendeur = userData;
        localStorage.setItem('vendeur', JSON.stringify(userData));
        localStorage.removeItem('user');
        return userData;
      } else {
        await this.firebase.logout();
        throw new Error('Accès réservé aux vendeurs');
      }
    } catch (error: any) {
      console.error('Erreur login vendeur:', error);
      throw error;
    }
  }

  async logout() {
    try {
      await this.firebase.logout();
    } catch (error) {
      console.error('Erreur logout:', error);
    }
    this.currentVendeur = null;
    localStorage.removeItem('vendeur');
    localStorage.removeItem('boutiqueVendeurId');
  }

  getCurrentVendeur(): User | null {
    if (this.currentVendeur) return this.currentVendeur;
    const vendeurStr = localStorage.getItem('vendeur');
    return vendeurStr ? JSON.parse(vendeurStr) : null;
  }

  isLoggedIn(): boolean {
    return this.getCurrentVendeur() !== null;
  }
}
