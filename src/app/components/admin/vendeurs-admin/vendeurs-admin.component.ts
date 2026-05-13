import { Component, OnInit } from '@angular/core';
import { FirebaseService } from '../../../services/firebase.service';

@Component({
  selector: 'app-vendeurs-admin',
  templateUrl: './vendeurs-admin.component.html',
  styleUrl: './vendeurs-admin.component.css'
})
export class VendeursAdminComponent implements OnInit {
  vendeurs: any[] = [];
  filteredVendeurs: any[] = [];
  searchTerm: string = '';

  // Modal
  showModal = false;
  newVendeur = {
    nom: '',
    email: '',
    role: 'vendeur' as const,
    isActive: true,
    createdAt: new Date().toISOString()
  };

  constructor(private firebase: FirebaseService) {}

  async ngOnInit() {
    await this.loadVendeurs();
  }

  async loadVendeurs() {
    const allUsers = await this.firebase.getData('users');
    this.vendeurs = allUsers.filter((u: any) => u.role === 'vendeur');
    this.filteredVendeurs = [...this.vendeurs];
  }

  filterVendeurs() {
    const term = this.searchTerm.toLowerCase();
    this.filteredVendeurs = this.vendeurs.filter(v => 
      v.nom?.toLowerCase().includes(term) || 
      v.email?.toLowerCase().includes(term)
    );
  }

  openAddModal() {
    this.newVendeur = {
      nom: '',
      email: '',
      role: 'vendeur',
      isActive: true,
      createdAt: new Date().toISOString()
    };
    this.showModal = true;
  }

  async addVendeur() {
    if (!this.newVendeur.nom || !this.newVendeur.email) {
      alert("Nom et email sont obligatoires");
      return;
    }

    try {
      await this.firebase.addData('users', this.newVendeur);
      alert("✅ Vendeur ajouté avec succès !");
      this.showModal = false;
      await this.loadVendeurs();
    } catch (error) {
      console.error(error);
      alert("❌ Erreur lors de l'ajout du vendeur");
    }
  }
}
