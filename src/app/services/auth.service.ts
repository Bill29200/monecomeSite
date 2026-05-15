import { Injectable, NgZone } from '@angular/core';
import { FirebaseService } from './firebase.service';
import { User } from '../models/user.model';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private currentUser: User | null = null;

  constructor(
    private firebase: FirebaseService,
    private ngZone: NgZone
  ) {}

  async login(email: string, password: string): Promise<User | null> {
    console.log('🔐 Login attempt:', email);
    
    // Force l'exécution en dehors de la zone Angular
    return this.ngZone.runOutsideAngular(async () => {
      try {
        const result = await this.firebase.login(email, password);
        console.log('✅ Firebase auth success:', result.user.uid);
        
        const users = await this.firebase.getData('users');
        let userData = users.find((u: any) => u.uid === result.user.uid);

        if (!userData) {
          userData = {
            uid: result.user.uid,
            email: email,
            nom: email.split('@')[0],
            role: email === 'admin@monecome.com' ? 'admin' : 'client',
            isActive: true,
            createdAt: new Date().toISOString()
          };
          await this.firebase.addData('users', userData);
        }

        this.currentUser = userData;
        
        // Retourner dans la zone Angular pour mettre à jour l'UI
        this.ngZone.run(() => {
          localStorage.setItem('user', JSON.stringify(userData));
        });
        
        return userData;
        
      } catch (error: any) {
        console.error('❌ Login error:', error);
        throw error;
      }
    });
  }

  async logout() {
    await this.firebase.logout();
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
