import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

import { AppComponent } from './app.component';
import { routes } from './app.routes';

// Client Components
import { AccueilComponent } from './components/client/accueil/accueil.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { ProduitsComponent } from './components/client/produits/produits.component';
import { PanierComponent } from './components/client/panier/panier.component';

// Admin Components
import { DashboardComponent } from './components/admin/dashboard/dashboard.component';
import { BoutiquesAdminComponent } from './components/admin/boutiques-admin/boutiques-admin.component';
import { VendeursAdminComponent } from './components/admin/vendeurs-admin/vendeurs-admin.component';
import { AbonnementsAdminComponent } from './components/admin/abonnements-admin/abonnements-admin.component';

// Vendeur Components
import { VendeurDashboardComponent } from './components/vendeur/vendeur-dashboard/vendeur-dashboard.component';
import { VendeurBoutiquesComponent } from './components/vendeur/vendeur-boutiques/vendeur-boutiques.component';
import { VendeurProduitsComponent } from './components/vendeur/vendeur-produits/vendeur-produits.component';
import { VendeurClientsComponent } from './components/vendeur/vendeur-clients/vendeur-clients.component';
import { VendeurCommandesComponent } from './components/vendeur/vendeur-commandes/vendeur-commandes.component';

@NgModule({
  declarations: [
    AppComponent,
    AccueilComponent,
    LoginComponent,
    RegisterComponent,
    ProduitsComponent,
    PanierComponent,
    DashboardComponent,
    BoutiquesAdminComponent,
    VendeursAdminComponent,
    AbonnementsAdminComponent,
    VendeurDashboardComponent,
    VendeurBoutiquesComponent,
    VendeurProduitsComponent,
    VendeurClientsComponent,
    VendeurCommandesComponent
  ],
  imports: [
    BrowserModule,
    CommonModule,
    FormsModule,
    RouterModule.forRoot(routes)
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
