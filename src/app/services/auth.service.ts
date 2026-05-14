import { Injectable } from '@angular/core';
import { FirebaseService } from './firebase.service';
import { User } from '../models/user.model';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private currentUser: User | null = null;

  constructor(private firebase: FirebaseService) {
    this.loadCurrentUser();
  }

  async loadCurrentUser() {
    const firebaseUser = this.firebase.getCurrentUser();
    if (firebaseUser?.uid) {
      const users = await this.firebase.getData('users');
      const user = users.find((u: any) => u.uid === firebaseUser.uid);
      if (user) this.currentUser = user;
    }
  }

  async login(email: string, password: string): Promise<User | null> {
    try {
      const result = await this.firebase.login(email, password);
      
      const users = await this.firebase.getData('users');
      const userData = users.find((u: any) => u.uid === result.user.uid);

      if (userData) {
        this.currentUser = userData;
        localStorage.setItem('user', JSON.stringify(userData));
        return userData;
      } else {
        this.currentUser = { uid: result.user.uid, email: result.user.email!, role: 'client', nom: '' };
        localStorage.setItem('user', JSON.stringify(this.currentUser));
        return this.currentUser;
      }
    } catch (error: any) {
      console.error('Erreur login:', error);
      throw error;
    }
  }

  async logout() {
    try {
      await this.firebase.logout();
    } catch (error) {
      console.error('Erreur logout:', error);
    }
    this.currentUser = null;
    localStorage.removeItem('user');
  }

  getCurrentUser(): User | null {
    if (this.currentUser) return this.currentUser;
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  }

  isLoggedIn(): boolean {
    return this.getCurrentUser() !== null;
  }
}
