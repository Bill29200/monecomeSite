// Correction du service BoutiqueService si nécessaire
import { Injectable } from '@angular/core';
import { FirebaseService } from './firebase.service';
import QRCode from 'qrcode';

@Injectable({ providedIn: 'root' })
export class BoutiqueService {
  constructor(private firebase: FirebaseService) {}

  async getAllBoutiques() {
    return this.firebase.getData('boutiques');
  }

  async createBoutique(boutiqueData: any): Promise<string> {
    const newBoutique = {
      ...boutiqueData,
      createdAt: new Date().toISOString(),
      statut: boutiqueData.statut || 'active',
      abonnement: boutiqueData.abonnement || 'gratuit'
    };

    const boutiqueId = await this.firebase.addData('boutiques', newBoutique);
    
    // Générer QR Code en arrière-plan
    this.generateQRCode(boutiqueId, newBoutique.nom).catch(console.error);
    
    return boutiqueId;
  }

  async updateBoutique(id: string, data: any) {
    await this.firebase.updateData('boutiques', id, data);
  }

  async deleteBoutique(id: string) {
    await this.firebase.deleteData('boutiques', id);
  }

  private async generateQRCode(boutiqueId: string, nom: string) {
    try {
      const url = `/boutique/${boutiqueId}`;
      const qrDataUrl = await QRCode.toDataURL(url, { width: 250, margin: 1 });
      
      await this.firebase.updateData('boutiques', boutiqueId, {
        qrCodeUrl: qrDataUrl,
        qrLink: url
      });
    } catch (error) {
      console.error('Erreur QR Code:', error);
    }
  }
}
