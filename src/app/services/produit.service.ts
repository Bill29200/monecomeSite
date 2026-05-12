import { Injectable } from '@angular/core';
import { FirebaseService } from './firebase.service';
import { Produit } from '../models/produit.model';

@Injectable({
  providedIn: 'root'
})
export class ProduitService {
  constructor(private firebase: FirebaseService) {}

  async createProduit(produit: Produit): Promise<string> {
    return await this.firebase.addData('produits', produit);
  }

  async getProduitsByBoutique(boutiqueId: string): Promise<Produit[]> {
    return await this.firebase.getDataOnce('produits', 'boutiqueId', boutiqueId);
  }

  async getAllProduits(): Promise<Produit[]> {
    return await this.firebase.getData('produits');
  }

  async updateProduit(id: string, produit: Partial<Produit>) {
    await this.firebase.updateData('produits', id, produit);
  }

  async deleteProduit(id: string) {
    await this.firebase.deleteData('produits', id);
  }

  async uploadProductImage(file: File, productId: string): Promise<string> {
    return await this.firebase.uploadImage(file, `produits/${productId}_${Date.now()}`);
  }
}
