import { Routes } from '@angular/router';
import { AccueilComponent } from './components/client/accueil/accueil.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { ProduitsComponent } from './components/client/produits/produits.component';
import { PanierComponent } from './components/client/panier/panier.component';

// Admin Components
import { DashboardComponent } from './components/admin/dashboard/dashboard.component';

export const routes: Routes = [
  { path: '', component: AccueilComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'produits', component: ProduitsComponent },
  { path: 'panier', component: PanierComponent },

  // === ADMIN ROUTES ===
  { path: 'admin', component: DashboardComponent },
  { path: 'admin/dashboard', component: DashboardComponent },
  { path: 'admin/boutiques', component: DashboardComponent }, // À remplacer plus tard
  { path: 'admin/vendeurs', component: DashboardComponent },   // À remplacer plus tard

  { path: '**', redirectTo: '' }
];
