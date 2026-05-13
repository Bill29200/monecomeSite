import { Component, OnInit } from '@angular/core';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  title = 'monecome';

  constructor(public authService: AuthService) {}

  ngOnInit() {}

  isLoggedIn(): boolean {
    return this.authService.isLoggedIn();
  }

  getUserName(): string {
    const user = this.authService.getCurrentUser();
    return user ? (user.nom || user.displayName || 'Utilisateur') : '';
  }

  async logout() {
    await this.authService.logout();
  }
}
