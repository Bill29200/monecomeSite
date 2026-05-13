import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

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
    AbonnementsAdminComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,           // ← Important pour ngModel
    RouterModule.forRoot(routes)
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
