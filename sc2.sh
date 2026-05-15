#!/bin/bash

echo "========================================="
echo "🔧 CORRECTION COMPLÈTE ANGULAR + FIREBASE"
echo "========================================="

# 1. METTRE À JOUR FirebaseService AVEC TOUTES LES MÉTHODES
echo "📝 Mise à jour de FirebaseService..."

cat > src/app/services/firebase.service.ts << 'EOF'
import { Injectable } from '@angular/core';
import { initializeApp } from 'firebase/app';
import { getDatabase, ref, get, child, push, update, remove, query, orderByChild, equalTo } from 'firebase/database';
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyCmjKVEyONacH6u8mxpUOi7IlpBjOxUyS8",
  authDomain: "monecom4y.firebaseapp.com",
  databaseURL: "https://monecom4y-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "monecom4y",
  storageBucket: "monecom4y.firebasestorage.app",
  messagingSenderId: "100626833500",
  appId: "1:100626833500:web:4d128f89f9812bb3214699"
};

@Injectable({ providedIn: 'root' })
export class FirebaseService {
  private db: any;
  private auth: any;
  private initialized = false;

  constructor() {
    console.log('🔥 Initialisation Firebase...');
    const app = initializeApp(firebaseConfig);
    this.db = getDatabase(app);
    this.auth = getAuth(app);
    console.log('✅ Firebase configuré');
  }

  async init() {
    if (this.initialized) return;
    await new Promise(resolve => setTimeout(resolve, 100));
    this.initialized = true;
    console.log('✅ Firebase prêt');
  }

  // ====================== AUTH ======================
  login(email: string, password: string) {
    return signInWithEmailAndPassword(this.auth, email, password);
  }

  register(email: string, password: string) {
    return createUserWithEmailAndPassword(this.auth, email, password);
  }

  logout() {
    return signOut(this.auth);
  }

  getCurrentUser() {
    return this.auth.currentUser;
  }

  // ====================== CRUD ======================
  async getData(path: string): Promise<any[]> {
    console.log(`📦 getData: ${path}`);
    const snapshot = await get(child(ref(this.db), path));
    if (snapshot.exists()) {
      const data = snapshot.val();
      return Object.keys(data).map(key => ({ id: key, ...data[key] }));
    }
    return [];
  }

  async getDataOnce(path: string, field: string, value: string): Promise<any[]> {
    const allData = await this.getData(path);
    return allData.filter((item: any) => item[field] === value);
  }

  async addData(path: string, data: any): Promise<string> {
    const newRef = push(ref(this.db, path));
    await update(newRef, data);
    return newRef.key!;
  }

  async updateData(path: string, id: string, data: any) {
    await update(ref(this.db, `${path}/${id}`), data);
  }

  async deleteData(path: string, id: string) {
    await remove(ref(this.db, `${path}/${id}`));
  }

  async uploadImage(file: File, path: string): Promise<string> {
    console.log('Upload image:', path);
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        resolve(reader.result as string);
      };
      reader.readAsDataURL(file);
    });
  }

  // ====================== SPÉCIFIQUE ======================
  async getProducts(): Promise<any[]> {
    const products = await this.getData('products');
    return products.map(p => ({
      id: p.id,
      nom: p.name || p.nom,
      prix: p.price || p.prix,
      category: p.category || p.categorie,
      description: p.description || '',
      imageUrl: p.imageUrl,
      stock: p.stock || 0,
      rating: p.rating || 0,
      isActive: p.isActive !== false,
      boutiqueId: p.boutiqueId || ''
    }));
  }

  async getShops(): Promise<any[]> {
    return this.getData('boutiques');
  }

  async getBoutiques(): Promise<any[]> {
    return this.getData('boutiques');
  }
}
EOF

echo "✅ FirebaseService mis à jour"

# 2. CORRIGER TOUS LES MODULES QUI MANQUENT FormsModule
echo "📝 Correction des modules..."

# Mettre à jour app.module.ts
cat > src/app/app.module.ts << 'EOF'
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
EOF

echo "✅ AppModule mis à jour"

# 3. NETTOYER LE CACHE
echo "🧹 Nettoyage du cache..."
rm -rf node_modules/.cache .angular/cache

echo ""
echo "========================================="
echo "✅ CORRECTIONS APPLIQUÉES !"
echo "========================================="
echo ""
echo "🚀 Redémarrez Angular :"
echo "   ng serve"
echo ""
