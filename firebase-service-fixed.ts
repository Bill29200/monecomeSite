import { Injectable } from '@angular/core';
import { initializeApp } from 'firebase/app';
import { getDatabase, ref, get, push, update, remove, onValue, off } from 'firebase/database';
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
  private listeners: Map<string, any> = new Map();

  constructor() {
    try {
      const app = initializeApp(firebaseConfig);
      this.db = getDatabase(app);
      this.auth = getAuth(app);
      console.log('✅ Firebase Service initialisé');
    } catch (error) {
      console.error('❌ Erreur Firebase:', error);
    }
  }

  // ====================== AUTH ======================
  async login(email: string, password: string) {
    try {
      const result = await signInWithEmailAndPassword(this.auth, email, password);
      return result;
    } catch (error: any) {
      console.error('Erreur login:', error);
      throw error;
    }
  }

  async register(email: string, password: string) {
    try {
      const result = await createUserWithEmailAndPassword(this.auth, email, password);
      return result;
    } catch (error: any) {
      console.error('Erreur register:', error);
      throw error;
    }
  }

  async logout() {
    try {
      await signOut(this.auth);
      // Nettoyer tous les listeners
      this.listeners.forEach((_, key) => {
        this.removeListener(key);
      });
    } catch (error) {
      console.error('Erreur logout:', error);
    }
  }

  getCurrentUser() {
    return this.auth.currentUser;
  }

  // ====================== GENERIC avec gestion d'erreurs ======================
  async getData(path: string): Promise<any[]> {
    try {
      const dbRef = ref(this.db, path);
      const snapshot = await get(dbRef);
      
      if (snapshot.exists()) {
        const data = snapshot.val();
        // Vérifier si les données sont un objet
        if (typeof data === 'object' && data !== null) {
          const result = Object.keys(data).map(key => ({ 
            id: key, 
            ...data[key] 
          }));
          return result;
        }
        return [];
      }
      return [];
    } catch (error) {
      console.error(`Erreur getData(${path}):`, error);
      return [];
    }
  }

  async addData(path: string, data: any): Promise<string> {
    try {
      const newRef = push(ref(this.db, path));
      await update(newRef, data);
      return newRef.key!;
    } catch (error) {
      console.error(`Erreur addData(${path}):`, error);
      throw error;
    }
  }

  async updateData(path: string, id: string, data: any) {
    try {
      const dbRef = ref(this.db, `${path}/${id}`);
      await update(dbRef, data);
    } catch (error) {
      console.error(`Erreur updateData(${path}/${id}):`, error);
      throw error;
    }
  }

  async deleteData(path: string, id: string) {
    try {
      const dbRef = ref(this.db, `${path}/${id}`);
      await remove(dbRef);
    } catch (error) {
      console.error(`Erreur deleteData(${path}/${id}):`, error);
      throw error;
    }
  }

  // ====================== LISTENERS (à utiliser avec précaution) ======================
  addListener(path: string, callback: (data: any[]) => void): string {
    const listenerId = `${path}_${Date.now()}_${Math.random()}`;
    const dbRef = ref(this.db, path);
    
    const handler = onValue(dbRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        const result = Object.keys(data).map(key => ({ id: key, ...data[key] }));
        callback(result);
      } else {
        callback([]);
      }
    }, (error) => {
      console.error(`Erreur listener ${path}:`, error);
      callback([]);
    });
    
    this.listeners.set(listenerId, { path, ref: dbRef, handler });
    return listenerId;
  }

  removeListener(listenerId: string) {
    const listener = this.listeners.get(listenerId);
    if (listener) {
      off(listener.ref, 'value', listener.handler);
      this.listeners.delete(listenerId);
    }
  }

  removeAllListeners() {
    this.listeners.forEach((_, key) => {
      this.removeListener(key);
    });
  }

  // ====================== MÉTHODES SPÉCIFIQUES ======================
  async getProducts() { 
    return this.getData('products'); 
  }
  
  async getShops() { 
    return this.getData('boutiques'); 
  }
  
  async getBoutiques() { 
    return this.getData('boutiques'); 
  }

  async getUsers() {
    return this.getData('users');
  }
}
