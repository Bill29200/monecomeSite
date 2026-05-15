import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-admin-layout',
  templateUrl: './admin-layout.component.html',
  styles: []
})
export class AdminLayoutComponent {
  sidebarOpen: boolean = false;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  getUserName(): string {
    const user = this.authService.getCurrentUser();
    return user?.nom || user?.displayName || 'Admin';
  }

  getUserInitial(): string {
    return this.getUserName().charAt(0).toUpperCase();
  }

  getUserEmail(): string {
    const user = this.authService.getCurrentUser();
    return user?.email || 'admin@monecome.com';
  }

  toggleSidebar() {
    this.sidebarOpen = !this.sidebarOpen;
    const sidebar = document.querySelector('.admin-sidebar');
    if (sidebar) {
      sidebar.classList.toggle('open', this.sidebarOpen);
    }
  }

  async logout() {
    await this.authService.logout();
    this.router.navigate(['/login']);
  }
}
