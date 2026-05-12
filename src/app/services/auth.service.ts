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
      const userData = await this.firebase.getDataOnce('users', 'uid', firebaseUser.uid);
      if (userData && userData.length > 0) {
        this.currentUser = userData[0];
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
      }
      return null;
    } catch (error) {
      console.error('Erreur de connexion:', error);
      throw error;
    }
  }

  async register(user: User, password: string): Promise<User | null> {
    try {
      const result = await this.firebase.register(user.email, password);
      user.uid = result.user.uid;
      user.createdAt = new Date().toISOString();
      await this.firebase.addData('users', user);
      this.currentUser = user;
      localStorage.setItem('user', JSON.stringify(user));
      return user;
    } catch (error) {
      console.error('Erreur d\'inscription:', error);
      throw error;
    }
  }

  async logout() {
    await this.firebase.logout();
    this.currentUser = null;
    localStorage.removeItem('user');
  }

  getCurrentUser(): User | null {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      return JSON.parse(userStr);
    }
    return this.currentUser;
  }

  isLoggedIn(): boolean {
    return this.getCurrentUser() !== null;
  }

  hasRole(role: string): boolean {
    const user = this.getCurrentUser();
    return user ? user.role === role : false;
  }
}
