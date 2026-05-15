import { Injectable } from '@angular/core';
import { initializeApp } from 'firebase/app';
import { getDatabase, ref, get, push, update, remove } from 'firebase/database';
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut } from 'firebase/auth';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class FirebaseService {
  private db: any;
  private auth: any;

  constructor() {
    const app = initializeApp(environment.firebase);
    this.db = getDatabase(app);
    this.auth = getAuth(app);
    console.log('✅ Firebase initialisé');
  }

  // AUTH
  login(email: string, password: string) { return signInWithEmailAndPassword(this.auth, email, password); }
  register(email: string, password: string) { return createUserWithEmailAndPassword(this.auth, email, password); }
  logout() { return signOut(this.auth); }
  getCurrentUser() { return this.auth.currentUser; }

  // DATABASE CRUD
  async getData(path: string): Promise<any[]> {
    try {
      const snapshot = await get(ref(this.db, path));
      if (snapshot.exists()) {
        const data = snapshot.val();
        return Object.keys(data).map(key => ({ id: key, ...data[key] }));
      }
      return [];
    } catch (error) { console.error(error); return []; }
  }

  async addData(path: string, data: any): Promise<string> {
    const newRef = push(ref(this.db, path));
    await update(newRef, data);
    return newRef.key!;
  }

  async updateData(path: string, id: string, data: any) {
    await update(ref(this.db, `${path}/${id}`), { ...data, updatedAt: new Date().toISOString() });
  }

  async deleteData(path: string, id: string) {
    await remove(ref(this.db, `${path}/${id}`));
  }

  // SPECIFIC
  async getProducts() { return this.getData('products'); }
  async getBoutiques() { return this.getData('boutiques'); }
  async getUsers() { return this.getData('users'); }
  async getCommandes() { return this.getData('commandes'); }
}
