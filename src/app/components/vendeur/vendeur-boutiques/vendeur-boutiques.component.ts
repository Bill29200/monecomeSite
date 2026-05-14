import { Component, OnInit } from '@angular/core';
import { VendeurService } from '../../../services/vendeur.service';
import { Boutique } from '../../../models/boutique.model';

@Component({
  selector: 'app-vendeur-boutiques',
  templateUrl: './vendeur-boutiques.component.html',
  styleUrls: ['./vendeur-boutiques.component.css']
})
export class VendeurBoutiquesComponent implements OnInit {
  boutiques: Boutique[] = [];
  showModal = false;
  editingBoutique: Boutique | null = null;
  saving = false;

  formBoutique = {
    nom: '',
    description: '',
    adresse: '',
    telephone: ''
  };

  constructor(private vendeurService: VendeurService) {}

  async ngOnInit() {
    await this.loadBoutiques();
  }

  async loadBoutiques() {
    this.boutiques = await this.vendeurService.getCurrentVendeurBoutiques();
  }

  openCreateModal() {
    this.editingBoutique = null;
    this.formBoutique = { nom: '', description: '', adresse: '', telephone: '' };
    this.showModal = true;
  }

  openEditModal(boutique: Boutique) {
    this.editingBoutique = boutique;
    this.formBoutique = {
      nom: boutique.nom,
      description: boutique.description || '',
      adresse: boutique.adresse || '',
      telephone: boutique.telephone || ''
    };
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
    this.editingBoutique = null;
  }

  async saveBoutique() {
    if (!this.formBoutique.nom) {
      alert("Le nom de la boutique est obligatoire");
      return;
    }

    this.saving = true;

    try {
      if (this.editingBoutique) {
        await this.vendeurService.updateBoutique(this.editingBoutique.id!, this.formBoutique);
        alert("✅ Boutique modifiée avec succès");
      } else {
        await this.vendeurService.createBoutique(this.formBoutique);
        alert("✅ Boutique créée avec succès");
      }
      this.closeModal();
      await this.loadBoutiques();
    } catch (error) {
      console.error(error);
      alert("❌ Erreur lors de l'enregistrement");
    } finally {
      this.saving = false;
    }
  }

  async deleteBoutique(boutique: Boutique) {
    if (confirm(`Supprimer la boutique "${boutique.nom}" ? Tous les produits et clients seront supprimés.`)) {
      alert("Fonctionnalité à venir");
    }
  }
}
