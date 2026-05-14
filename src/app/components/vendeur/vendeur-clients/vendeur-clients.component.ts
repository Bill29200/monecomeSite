import { Component, OnInit } from '@angular/core';
import { VendeurService } from '../../../services/vendeur.service';

@Component({
  selector: 'app-vendeur-clients',
  templateUrl: './vendeur-clients.component.html',
  styleUrls: ['./vendeur-clients.component.css']
})
export class VendeurClientsComponent implements OnInit {
  clients: any[] = [];
  filteredClients: any[] = [];
  searchTerm: string = '';
  boutique: any = null;
  
  showModal = false;
  saving = false;
  
  newClient = {
    nom: '',
    email: '',
    telephone: '',
    adresse: ''
  };

  constructor(private vendeurService: VendeurService) {}

  async ngOnInit() {
    await this.loadData();
  }

  async loadData() {
    this.boutique = await this.vendeurService.getCurrentVendeurBoutique();
    if (this.boutique) {
      this.clients = await this.vendeurService.getBoutiqueClients(this.boutique.id);
      this.filteredClients = [...this.clients];
    }
  }

  filterClients() {
    const term = this.searchTerm.toLowerCase();
    this.filteredClients = this.clients.filter(c => 
      c.nom?.toLowerCase().includes(term) || 
      c.email?.toLowerCase().includes(term)
    );
  }

  openAddModal() {
    this.newClient = { nom: '', email: '', telephone: '', adresse: '' };
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
  }

  async saveClient() {
    if (!this.newClient.nom || !this.newClient.email) {
      alert("Nom et email sont obligatoires");
      return;
    }

    if (!this.boutique) {
      alert("Aucune boutique trouvée");
      return;
    }

    this.saving = true;

    try {
      await this.vendeurService.createClient(this.boutique.id, this.newClient);
      alert("✅ Client ajouté avec succès");
      this.closeModal();
      await this.loadData();
    } catch (error) {
      console.error(error);
      alert("❌ Erreur lors de l'ajout");
    } finally {
      this.saving = false;
    }
  }
}
