import { Injectable } from '@angular/core';
import { FirebaseService } from './firebase.service';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUser: User | null = null;

  constructor(private firebase: FirebaseService) {
    this.loadCurrentUser();
  }

  async loadCurrentUser() {
    const firebaseUser = this.firebase.getCurrentUser();
    if (firebaseUser) {
      const users = await this.firebase.getDataOnce('users', 'uid', firebaseUser.uid);
      if (users && users.length > 0) {
        this.currentUser = users[0];
      }
    }
  }

  async login(email: string, password: string): Promise<User | null> {
    try {
      const result = await this.firebase.login(email, password);
      
      const users = await this.firebase.getDataOnce('users', 'uid', result.user.uid);
      
      if (users && users.length > 0) {
        this.currentUser = users[0];
        localStorage.setItem('user', JSON.stringify(this.currentUser));
        return this.currentUser;
      } else {
        // Si l'utilisateur Firebase existe mais pas dans la table "users"
        this.currentUser = {
          uid: result.user.uid,
          email: result.user.email!,
          role: 'client',
          nom: result.user.displayName || ''
        };
        localStorage.setItem('user', JSON.stringify(this.currentUser));
        return this.currentUser;
      }
    } catch (error: any) {
      console.error('Erreur de connexion:', error);
      throw error;
    }
  }

  async logout() {
    await this.firebase.logout();
    this.currentUser = null;
    localStorage.removeItem('user');
  }

  getCurrentUser(): User | null {
    if (this.currentUser) return this.currentUser;
    
    const userStr = localStorage.getItem('user');
    if (userStr) {
      this.currentUser = JSON.parse(userStr);
      return this.currentUser;
    }
    return null;
  }

  isLoggedIn(): boolean {
    return this.getCurrentUser() !== null;
  }
}
