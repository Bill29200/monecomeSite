import { Injectable } from '@angular/core';
import { FirebaseService } from './firebase.service';

@Injectable({ providedIn: 'root' })
export class BoutiqueService {
  constructor(private firebase: FirebaseService) {}

  async getAllBoutiques(): Promise<any[]> {
    try {
      const boutiques = await this.firebase.getBoutiques();
      return boutiques || [];
    } catch (error) {
      console.error('Erreur getAllBoutiques:', error);
      return [];
    }
  }

  async getBoutiqueById(id: string): Promise<any | null> {
    try {
      const boutiques = await this.getAllBoutiques();
      return boutiques.find(b => b.id === id) || null;
    } catch (error) {
      console.error('Erreur getBoutiqueById:', error);
      return null;
    }
  }

  async createBoutique(boutiqueData: any): Promise<string> {
    try {
      const newBoutique = {
        ...boutiqueData,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        statut: boutiqueData.statut || 'active',
        abonnement: boutiqueData.abonnement || 'gratuit'
      };

      const boutiqueId = await this.firebase.addData('boutiques', newBoutique);
      console.log(`✅ Boutique créée: ${boutiqueId}`);
      return boutiqueId;
    } catch (error) {
      console.error('Erreur createBoutique:', error);
      throw error;
    }
  }

  async updateBoutique(id: string, data: any): Promise<void> {
    try {
      const updateData = {
        ...data,
        updatedAt: new Date().toISOString()
      };
      await this.firebase.updateData('boutiques', id, updateData);
      console.log(`✅ Boutique mise à jour: ${id}`);
    } catch (error) {
      console.error('Erreur updateBoutique:', error);
      throw error;
    }
  }

  async deleteBoutique(id: string): Promise<void> {
    try {
      await this.firebase.deleteData('boutiques', id);
      console.log(`✅ Boutique supprimée: ${id}`);
    } catch (error) {
      console.error('Erreur deleteBoutique:', error);
      throw error;
    }
  }

  async getBoutiquesByVendeur(vendeurId: string): Promise<any[]> {
    try {
      const boutiques = await this.getAllBoutiques();
      return boutiques.filter(b => b.vendeurId === vendeurId);
    } catch (error) {
      console.error('Erreur getBoutiquesByVendeur:', error);
      return [];
    }
  }
}
