import { Component, OnInit } from '@angular/core';
import { VendeurService } from '../../../services/vendeur.service';
import { BoutiqueService } from '../../../services/boutique.service';

@Component({
  selector: 'app-vendeur-boutique',
  template: `
    <div class="vendeur-content">
      <h2><i class="bi bi-shop"></i> Ma boutique</h2>
      <div *ngIf="boutique" class="card mt-4">
        <div class="card-body">
          <h4>{{ boutique.nom }}</h4>
          <p><strong>Statut:</strong> <span class="badge" [class.bg-success]="boutique.statut === 'active'" [class.bg-secondary]="boutique.statut !== 'active'">{{ boutique.statut }}</span></p>
          <p><strong>Abonnement:</strong> {{ boutique.abonnement }}</p>
          <p><strong>Adresse:</strong> {{ boutique.adresse || 'Non renseignée' }}</p>
          <p><strong>Téléphone:</strong> {{ boutique.telephone || 'Non renseigné' }}</p>
          <div *ngIf="boutique.qrCodeUrl" class="mt-3">
            <strong>QR Code boutique:</strong><br>
            <img [src]="boutique.qrCodeUrl" width="150" alt="QR Code">
          </div>
        </div>
      </div>
      <div *ngIf="!boutique" class="alert alert-warning mt-4">
        Vous n'avez pas encore de boutique. Contactez l'administrateur.
      </div>
    </div>
  `,
  styles: ['.vendeur-content { padding: 20px; }']
})
export class VendeurBoutiqueComponent implements OnInit {
  boutique: any = null;

  constructor(private vendeurService: VendeurService) {}

  async ngOnInit() {
    this.boutique = await this.vendeurService.getCurrentVendeurBoutique();
  }
}
