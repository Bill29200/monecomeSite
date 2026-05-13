import { Injectable } from '@angular/core';
import { FirebaseService } from './firebase.service';
import QRCode from 'qrcode';

@Injectable({ providedIn: 'root' })
export class BoutiqueService {
  constructor(private firebase: FirebaseService) {}

  async getAllBoutiques() {
    return this.firebase.getData('boutiques');
  }

  async createBoutique(boutiqueData: any) {
    const newBoutique = {
      ...boutiqueData,
      createdAt: new Date().toISOString(),
      statut: boutiqueData.statut || 'active',
      abonnement: boutiqueData.abonnement || 'gratuit'
    };

    const boutiqueId = await this.firebase.addData('boutiques', newBoutique);
    
    // Générer QR Code
    await this.generateQRCode(boutiqueId, newBoutique.nom);
    
    return boutiqueId;
  }

  async updateBoutique(id: string, data: any) {
    await this.firebase.updateData('boutiques', id, data);
    console.log(`Boutique ${id} mise à jour`);
  }

  async deleteBoutique(id: string) {
    await this.firebase.deleteData('boutiques', id);
    console.log(`Boutique ${id} supprimée`);
  }

  private async generateQRCode(boutiqueId: string, nom: string) {
    try {
      const url = `https://monecome.com/boutique/${boutiqueId}`;
      const qrDataUrl = await QRCode.toDataURL(url, { width: 300, margin: 2 });
      
      await this.firebase.updateData('boutiques', boutiqueId, {
        qrCodeUrl: qrDataUrl,
        qrLink: url
      });
    } catch (error) {
      console.error('Erreur QR Code:', error);
    }
  }
}
