import { Injectable } from '@angular/core';
import { initializeApp } from 'firebase/app';
import { getDatabase, ref, get, child } from 'firebase/database';

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

  constructor() {
    try {
      const app = initializeApp(firebaseConfig);
      this.db = getDatabase(app);
      console.log('✅ Firebase initialisé');
    } catch (error) {
      console.error('❌ Erreur Firebase:', error);
    }
  }

  // Récupérer tous les produits (depuis "products")
  async getProducts(): Promise<any[]> {
    try {
      const dbRef = ref(this.db);
      const snapshot = await get(child(dbRef, 'products'));
      
      if (snapshot.exists()) {
        const data = snapshot.val();
        const products = Object.keys(data).map(key => ({
          id: key,
          ...data[key]
        }));
        console.log(`📦 ${products.length} produits chargés`);
        return products;
      }
      console.log('⚠️ Aucun produit trouvé');
      return [];
    } catch (error) {
      console.error('Erreur getProducts:', error);
      return [];
    }
  }

  // Récupérer un produit par son ID
  async getProductById(productId: string): Promise<any> {
    try {
      const dbRef = ref(this.db);
      const snapshot = await get(child(dbRef, `products/${productId}`));
      if (snapshot.exists()) {
        return { id: productId, ...snapshot.val() };
      }
      return null;
    } catch (error) {
      console.error('Erreur getProductById:', error);
      return null;
    }
  }

  // Récupérer les boutiques (si vous en avez)
  async getShops(): Promise<any[]> {
    try {
      const dbRef = ref(this.db);
      const snapshot = await get(child(dbRef, 'shops'));
      
      if (snapshot.exists()) {
        const data = snapshot.val();
        const shops = Object.keys(data).map(key => ({
          id: key,
          ...data[key]
        }));
        console.log(`🏪 ${shops.length} boutiques chargées`);
        return shops;
      }
      return [];
    } catch (error) {
      console.error('Erreur getShops:', error);
      return [];
    }
  }

  // Récupérer les catégories
  async getCategories(): Promise<any[]> {
    try {
      const dbRef = ref(this.db);
      const snapshot = await get(child(dbRef, 'categories'));
      
      if (snapshot.exists()) {
        const data = snapshot.val();
        const categories = Object.keys(data).map(key => ({
          id: key,
          ...data[key]
        }));
        return categories;
      }
      return [];
    } catch (error) {
      console.error('Erreur getCategories:', error);
      return [];
    }
  }
}
