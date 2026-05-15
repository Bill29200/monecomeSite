import { NgModule, APP_INITIALIZER } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AppComponent } from './app.component';
import { routes } from './app.routes';
import { FirebaseService } from './services/firebase.service';

// Composants
import { AccueilComponent } from './components/client/accueil/accueil.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { ProduitsComponent } from './components/client/produits/produits.component';
import { PanierComponent } from './components/client/panier/panier.component';
import { DashboardComponent } from './components/admin/dashboard/dashboard.component';
import { BoutiquesAdminComponent } from './components/admin/boutiques-admin/boutiques-admin.component';
import { VendeursAdminComponent } from './components/admin/vendeurs-admin/vendeurs-admin.component';
import { AbonnementsAdminComponent } from './components/admin/abonnements-admin/abonnements-admin.component';
import { AdminLayoutComponent } from './components/admin/admin-layout/admin-layout.component';
import { VendeurLayoutComponent } from './components/vendeur/vendeur-layout/vendeur-layout.component';
import { VendeurDashboardComponent } from './components/vendeur/vendeur-dashboard/vendeur-dashboard.component';
import { VendeurBoutiquesComponent } from './components/vendeur/vendeur-boutiques/vendeur-boutiques.component';
import { VendeurProduitsComponent } from './components/vendeur/vendeur-produits/vendeur-produits.component';
import { VendeurClientsComponent } from './components/vendeur/vendeur-clients/vendeur-clients.component';
import { VendeurCommandesComponent } from './components/vendeur/vendeur-commandes/vendeur-commandes.component';
import { FooterComponent } from './components/footer/footer.component';

export function initializeApp(firebaseService: FirebaseService) {
  return (): Promise<void> => firebaseService.init();
}

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
    AdminLayoutComponent,
    VendeurLayoutComponent,
    VendeurDashboardComponent,
    VendeurBoutiquesComponent,
    VendeurProduitsComponent,
    VendeurClientsComponent,
    VendeurCommandesComponent,
    FooterComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    RouterModule.forRoot(routes, { initialNavigation: 'enabledBlocking' })
  ],
  providers: [
    FirebaseService,
    { provide: APP_INITIALIZER, useFactory: initializeApp, deps: [FirebaseService], multi: true }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
