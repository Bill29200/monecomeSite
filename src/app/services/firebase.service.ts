import { Injectable, NgZone } from '@angular/core';
import { initializeApp } from 'firebase/app';
import { getDatabase, ref, get, child, push, update, remove } from 'firebase/database';
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

  constructor(private ngZone: NgZone) {
    console.log('🔥 Initialisation Firebase...');
    const app = initializeApp(firebaseConfig);
    this.db = getDatabase(app);
    this.auth = getAuth(app);
    console.log('✅ Firebase configuré');
  }

  async init() {
    console.log('✅ Firebase déjà initialisé');
    return Promise.resolve();
  }

  // ====================== AUTH ======================
  async login(email: string, password: string) {
    return this.ngZone.runOutsideAngular(() => 
      signInWithEmailAndPassword(this.auth, email, password)
    );
  }

  async register(email: string, password: string) {
    return this.ngZone.runOutsideAngular(() => 
      createUserWithEmailAndPassword(this.auth, email, password)
    );
  }

  async logout() {
    return this.ngZone.runOutsideAngular(() => signOut(this.auth));
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
    console.log('📤 Upload image:', path);
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
