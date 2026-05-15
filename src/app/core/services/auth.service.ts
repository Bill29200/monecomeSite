import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { FirebaseService } from './firebase.service';
import { User } from '../models/user.model';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private currentUser: User | null = null;

  constructor(private firebase: FirebaseService, private router: Router) {}

  async login(email: string, password: string): Promise<User | null> {
    try {
      const result = await this.firebase.login(email, password);
      const users = await this.firebase.getUsers();
      const userData = users.find((u: any) => u.uid === result.user.uid);
      if (userData) {
        this.currentUser = userData;
        localStorage.setItem('user', JSON.stringify(userData));
        return userData;
      }
      return null;
    } catch (error) { throw error; }
  }

  async logout() {
    await this.firebase.logout();
    this.currentUser = null;
    localStorage.removeItem('user');
    this.router.navigate(['/login']);
  }

  getCurrentUser(): User | null {
    if (this.currentUser) return this.currentUser;
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  }

  isLoggedIn(): boolean { return this.getCurrentUser() !== null; }
  isAdmin(): boolean { return this.getCurrentUser()?.role === 'admin'; }
  isVendeur(): boolean { return this.getCurrentUser()?.role === 'vendeur'; }
}
