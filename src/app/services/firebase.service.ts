import { Injectable } from '@angular/core';
import { initializeApp } from 'firebase/app';
import { getDatabase, ref, push, set, get, query, orderByChild, equalTo, update, remove, onValue } from 'firebase/database';
import { getStorage, ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged, User as FirebaseUser } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyCmjKVEyONacH6u8mxpUOi7IlpBjOxUyS8",
  authDomain: "monecom4y.firebaseapp.com",
  projectId: "monecom4y",
  storageBucket: "monecom4y.firebasestorage.app",
  messagingSenderId: "100626833500",
  appId: "1:100626833500:web:4d128f89f9812bb3214699"
};

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {
  private app = initializeApp(firebaseConfig);
  private db = getDatabase(this.app);
  private storage = getStorage(this.app);
  private auth = getAuth(this.app);
  private currentUser: FirebaseUser | null = null;

  constructor() {
    // Écouter les changements d'état d'authentification
    onAuthStateChanged(this.auth, (user) => {
      this.currentUser = user;
      console.log('Auth state changed:', user?.email);
    });
  }

  // ============= AUTHENTIFICATION =============
  getCurrentUser() {
    return this.currentUser;
  }

  async register(email: string, password: string) {
    return await createUserWithEmailAndPassword(this.auth, email, password);
  }

  async login(email: string, password: string) {
    return await signInWithEmailAndPassword(this.auth, email, password);
  }

  async logout() {
    return await signOut(this.auth);
  }

  // ============= BASE DE DONNÉES =============
  async addData(path: string, data: any): Promise<string> {
    const newRef = push(ref(this.db, path));
    await set(newRef, { ...data, id: newRef.key, createdAt: new Date().toISOString() });
    return newRef.key!;
  }

  async getData(path: string): Promise<any> {
    const snapshot = await get(ref(this.db, path));
    return snapshot.exists() ? this.convertToArray(snapshot.val()) : [];
  }

  async getDataOnce(path: string, field?: string, value?: string): Promise<any> {
    let dataRef = ref(this.db, path);
    if (field && value) {
      const q = query(ref(this.db, path), orderByChild(field), equalTo(value));
      const snapshot = await get(q);
      return snapshot.exists() ? this.convertToArray(snapshot.val()) : [];
    }
    const snapshot = await get(dataRef);
    return snapshot.exists() ? this.convertToArray(snapshot.val()) : [];
  }

  async updateData(path: string, id: string, data: any) {
    await update(ref(this.db, `${path}/${id}`), data);
  }

  async deleteData(path: string, id: string) {
    await remove(ref(this.db, `${path}/${id}`));
  }

  // ============= STOCKAGE =============
  async uploadImage(file: File, path: string): Promise<string> {
    const imageRef = storageRef(this.storage, path);
    await uploadBytes(imageRef, file);
    return await getDownloadURL(imageRef);
  }

  // ============= UTILITAIRES =============
  private convertToArray(obj: any): any[] {
    if (!obj) return [];
    return Object.keys(obj).map(key => ({ ...obj[key], id: key }));
  }
}
