#!/bin/bash

echo "🔧 CORRECTION COMPLÈTE DE L'ERREUR FIREBASE"
echo "==========================================="
echo ""

# 1. Mettre à jour FirebaseService
echo "📁 1. Mise à jour de FirebaseService..."
cat > src/app/services/firebase.service.ts << 'FIREBASE'
import { Injectable } from '@angular/core';
import { initializeApp } from 'firebase/app';
import { getDatabase, ref, get, push, update, remove } from 'firebase/database';
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

  constructor() {
    try {
      const app = initializeApp(firebaseConfig);
      this.db = getDatabase(app);
      this.auth = getAuth(app);
      console.log('✅ Firebase initialisé');
    } catch (error) {
      console.error('❌ Firebase error:', error);
    }
  }

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

  // Auth
  async login(email: string, password: string) {
    return signInWithEmailAndPassword(this.auth, email, password);
  }

  async logout() {
    return signOut(this.auth);
  }

  getCurrentUser() {
    return this.auth.currentUser;
  }

  // Helpers
  async getProducts() { return this.getData('products'); }
  async getBoutiques() { return this.getData('boutiques'); }
  async getUsers() { return this.getData('users'); }
}
FIREBASE

# 2. Mettre à jour BoutiqueService
echo "📁 2. Mise à jour de BoutiqueService..."
cat > src/app/services/boutique.service.ts << 'BOUTIQUE'
import { Injectable } from '@angular/core';
import { FirebaseService } from './firebase.service';

@Injectable({ providedIn: 'root' })
export class BoutiqueService {
  constructor(private firebase: FirebaseService) {}

  async getAllBoutiques() {
    return this.firebase.getBoutiques();
  }

  async createBoutique(data: any) {
    return this.firebase.addData('boutiques', {
      ...data,
      createdAt: new Date().toISOString()
    });
  }

  async updateBoutique(id: string, data: any) {
    return this.firebase.updateData('boutiques', id, data);
  }

  async deleteBoutique(id: string) {
    return this.firebase.deleteData('boutiques', id);
  }
}
BOUTIQUE

echo ""
echo "✅ Correction terminée !"
echo ""
echo "🔄 Redémarrez l'application :"
echo "   npm start"
echo "   ou"
echo "   ng serve"
echo ""
echo "🧹 Videz le cache du navigateur (Ctrl+Shift+R)"
