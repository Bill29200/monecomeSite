import { Routes } from '@angular/router';
import { AccueilComponent } from './components/client/accueil/accueil.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { ProduitsComponent } from './components/client/produits/produits.component';
import { PanierComponent } from './components/client/panier/panier.component';

// Admin
import { DashboardComponent } from './components/admin/dashboard/dashboard.component';
import { BoutiquesAdminComponent } from './components/admin/boutiques-admin/boutiques-admin.component';
import { VendeursAdminComponent } from './components/admin/vendeurs-admin/vendeurs-admin.component';
import { AbonnementsAdminComponent } from './components/admin/abonnements-admin/abonnements-admin.component';

export const routes: Routes = [
  { path: '', component: AccueilComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'produits', component: ProduitsComponent },
  { path: 'panier', component: PanierComponent },

  // Admin Routes
  { path: 'admin', component: DashboardComponent },
  { path: 'admin/dashboard', component: DashboardComponent },
  { path: 'admin/boutiques', component: BoutiquesAdminComponent },
  { path: 'admin/vendeurs', component: VendeursAdminComponent },
  { path: 'admin/abonnements', component: AbonnementsAdminComponent },

  { path: '**', redirectTo: '' }
];
