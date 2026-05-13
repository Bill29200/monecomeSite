import { Injectable } from '@angular/core';
import { initializeApp } from 'firebase/app';
import { getDatabase, ref, get, child, push, update, remove, query, orderByChild, equalTo } from 'firebase/database';
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, User as FirebaseUser } from 'firebase/auth';

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

  constructor() {
    try {
      const app = initializeApp(firebaseConfig);
      this.db = getDatabase(app);
      this.auth = getAuth(app);
      console.log('✅ Firebase initialisé avec succès');
    } catch (error) {
      console.error('❌ Erreur Firebase:', error);
    }
  }

  // ====================== AUTH ======================
  async login(email: string, password: string) {
    return await signInWithEmailAndPassword(this.auth, email, password);
  }

  async register(email: string, password: string) {
    return await createUserWithEmailAndPassword(this.auth, email, password);
  }

  async logout() {
    return await signOut(this.auth);
  }

  getCurrentUser(): FirebaseUser | null {
    return this.auth.currentUser;
  }

  // ====================== DATABASE ======================
  async getData(path: string): Promise<any[]> {
    try {
      const dbRef = ref(this.db, path);
      const snapshot = await get(dbRef);
      if (snapshot.exists()) {
        const data = snapshot.val();
        return Object.keys(data).map(key => ({ id: key, ...data[key] }));
      }
      return [];
    } catch (error) {
      console.error(`Erreur getData(${path}):`, error);
      return [];
    }
  }

  async getDataOnce(path: string, field: string, value: any): Promise<any[]> {
    try {
      const dbRef = ref(this.db, path);
      const q = query(dbRef, orderByChild(field), equalTo(value));
      const snapshot = await get(q);
      if (snapshot.exists()) {
        const data = snapshot.val();
        return Object.keys(data).map(key => ({ id: key, ...data[key] }));
      }
      return [];
    } catch (error) {
      console.error(`Erreur getDataOnce(${path}):`, error);
      return [];
    }
  }

  async addData(path: string, data: any): Promise<string> {
    const dbRef = ref(this.db, path);
    const newRef = push(dbRef);
    await update(newRef, data);
    return newRef.key!;
  }

  async updateData(path: string, id: string, data: any) {
    const dbRef = ref(this.db, `${path}/${id}`);
    await update(dbRef, data);
  }

  async deleteData(path: string, id: string) {
    const dbRef = ref(this.db, `${path}/${id}`);
    await remove(dbRef);
  }

  // Méthodes spécifiques
  async getProducts() {
    return this.getData('products');
  }

  async getShops() {
    return this.getData('shops');
  }

  async getBoutiques() {
    return this.getData('boutiques');
  }
}
