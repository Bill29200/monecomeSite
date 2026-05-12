import { Injectable } from '@angular/core';
import { FirebaseService } from './firebase.service';
import { Boutique } from '../models/boutique.model';

@Injectable({
  providedIn: 'root'
})
export class BoutiqueService {
  constructor(private firebase: FirebaseService) {}

  async createBoutique(boutique: Boutique): Promise<string> {
    return await this.firebase.addData('boutiques', boutique);
  }

  async getBoutiquesByVendeur(vendeurId: string): Promise<Boutique[]> {
    return await this.firebase.getDataOnce('boutiques', 'vendeurId', vendeurId);
  }

  async getAllBoutiques(): Promise<Boutique[]> {
    return await this.firebase.getData('boutiques');
  }

  async updateBoutique(id: string, boutique: Partial<Boutique>) {
    await this.firebase.updateData('boutiques', id, boutique);
  }

  async deleteBoutique(id: string) {
    await this.firebase.deleteData('boutiques', id);
  }
}
