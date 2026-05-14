import { Injectable } from '@angular/core';
import { initializeApp } from 'firebase/app';
import { getDatabase, ref, get, push, update, remove } from 'firebase/database';
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut } from 'firebase/auth';
import { getStorage, ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage';

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
  private storage: any;

  constructor() {
    const app = initializeApp(firebaseConfig);
    this.db = getDatabase(app);
    this.auth = getAuth(app);
    this.storage = getStorage(app);
    console.log('✅ Firebase Service initialisé');
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

  // ====================== GENERIC ======================
  async getData(path: string): Promise<any[]> {
    const dbRef = ref(this.db, path);
    const snapshot = await get(dbRef);
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
    const dbRef = ref(this.db, `${path}/${id}`);
    await update(dbRef, data);
  }

  async deleteData(path: string, id: string) {
    await remove(ref(this.db, `${path}/${id}`));
  }

  // ====================== STORAGE ======================
  async uploadImage(file: File, path: string): Promise<string> {
    try {
      console.log('📤 Uploading image...', path);
      const imageRef = storageRef(this.storage, path);
      const snapshot = await uploadBytes(imageRef, file);
      const downloadURL = await getDownloadURL(snapshot.ref);
      console.log('✅ Image uploaded:', downloadURL);
      return downloadURL;
    } catch (error) {
      console.error('❌ Erreur upload image:', error);
      throw error;
    }
  }

  // ====================== SPECIFIC ======================
  async getProducts() { return this.getData('products'); }
  async getShops() { return this.getData('boutiques'); }
  async getBoutiques() { return this.getData('boutiques'); }
}
