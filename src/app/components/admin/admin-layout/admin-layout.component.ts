import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-admin-layout',
  templateUrl: './admin-layout.component.html',
  styleUrls: ['./admin-layout.component.css']
})
export class AdminLayoutComponent implements OnInit {
  adminName: string = '';
  adminEmail: string = '';

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadAdminInfo();
  }

  loadAdminInfo() {
    const user = this.authService.getCurrentUser();
    console.log('Admin user:', user);
    if (user) {
      this.adminName = user.nom || user.displayName || 'Admin';
      this.adminEmail = user.email || '';
    } else {
      // Valeurs par défaut pour le test
      this.adminName = 'Administrateur';
      this.adminEmail = 'admin@monecome.com';
    }
  }

  getAdminName(): string {
    return this.adminName;
  }

  getAdminEmail(): string {
    return this.adminEmail;
  }

  getAdminInitial(): string {
    return this.adminName.charAt(0).toUpperCase();
  }

  async logout() {
    await this.authService.logout();
    this.router.navigate(['/login']);
  }
}
