import { Injectable } from '@angular/core';
import { FirebaseService } from './firebase.service';

@Injectable({ providedIn: 'root' })
export class ProduitService {
  constructor(private firebase: FirebaseService) {}

  async getAllProducts() {
    return this.firebase.getData('products');
  }

  async getProductsByBoutique(boutiqueId: string) {
    const all = await this.getAllProducts();
    return all.filter((p: any) => p.boutiqueId === boutiqueId);
  }

  async createProduct(product: any) {
    return this.firebase.addData('products', product);
  }

  async updateProduit(id: string, data: any) {
    await this.firebase.updateData('products', id, data);
  }

  async deleteProduit(id: string) {
    await this.firebase.deleteData('products', id);
    console.log(`Produit ${id} supprimé`);
  }
}
