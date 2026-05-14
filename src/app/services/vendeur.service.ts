import { Injectable } from '@angular/core';
import { FirebaseService } from './firebase.service';
import { BoutiqueService } from './boutique.service';
import { ProduitService } from './produit.service';
import { VendeurAuthService } from './vendeur-auth.service';
import { Boutique } from '../models/boutique.model';
import { Produit } from '../models/produit.model';
import { Client } from '../models/client.model';
import { Commande } from '../models/commande.model';

@Injectable({ providedIn: 'root' })
export class VendeurService {
  constructor(
    private firebase: FirebaseService,
    private boutiqueService: BoutiqueService,
    private produitService: ProduitService,
    private vendeurAuth: VendeurAuthService
  ) {}

  // ====================== BOUTIQUES ======================
  async getCurrentVendeurBoutiques(): Promise<Boutique[]> {
    const vendeur = this.vendeurAuth.getCurrentVendeur();
    if (!vendeur) return [];
    
    const vendeurId = vendeur.uid || (vendeur as any).id;
    const allBoutiques = await this.boutiqueService.getAllBoutiques();
    return allBoutiques.filter((b: Boutique) => b.vendeurId === vendeurId);
  }

  async getCurrentVendeurBoutique(): Promise<Boutique | null> {
    const boutiques = await this.getCurrentVendeurBoutiques();
    return boutiques.length > 0 ? boutiques[0] : null;
  }

  async getBoutiqueById(boutiqueId: string): Promise<Boutique | null> {
    const boutiques = await this.getCurrentVendeurBoutiques();
    return boutiques.find(b => b.id === boutiqueId) || null;
  }

  async createBoutique(boutiqueData: Partial<Boutique>): Promise<string> {
    const vendeur = this.vendeurAuth.getCurrentVendeur();
    if (!vendeur) throw new Error('Vendeur non connecté');

    const vendeurId = vendeur.uid || (vendeur as any).id;
    const newBoutique: Boutique = {
      nom: boutiqueData.nom || '',
      vendeurId: vendeurId,
      vendeurEmail: vendeur.email,
      vendeurNom: vendeur.nom || vendeur.displayName,
      statut: 'active',
      abonnement: 'gratuit',
      description: boutiqueData.description || '',
      adresse: boutiqueData.adresse || '',
      telephone: boutiqueData.telephone || '',
      createdAt: new Date().toISOString(),
      ...boutiqueData
    };
    
    return await this.boutiqueService.createBoutique(newBoutique);
  }

  async updateBoutique(boutiqueId: string, data: Partial<Boutique>): Promise<void> {
    await this.boutiqueService.updateBoutique(boutiqueId, data);
  }

  // ====================== PRODUITS ======================
  async getBoutiqueProduits(boutiqueId: string): Promise<Produit[]> {
    const allProduits = await this.produitService.getAllProducts();
    return allProduits.filter((p: Produit) => p.boutiqueId === boutiqueId);
  }

  async createProduit(boutiqueId: string, produitData: Partial<Produit>): Promise<string> {
    const newProduit: Produit = {
      nom: produitData.nom || '',
      prix: produitData.prix || 0,
      stock: produitData.stock || 0,
      category: produitData.category || '',
      boutiqueId: boutiqueId,
      isActive: true,
      createdAt: new Date().toISOString(),
      ...produitData
    };
    return await this.produitService.createProduct(newProduit);
  }

  async updateProduit(produitId: string, data: Partial<Produit>): Promise<void> {
    await this.produitService.updateProduit(produitId, data);
  }

  async deleteProduit(produitId: string): Promise<void> {
    await this.produitService.deleteProduit(produitId);
  }

  // ====================== CLIENTS ======================
  async getBoutiqueClients(boutiqueId: string): Promise<Client[]> {
    const allClients = await this.firebase.getData('clients');
    return allClients.filter((c: Client) => c.boutiqueId === boutiqueId);
  }

  async createClient(boutiqueId: string, clientData: Partial<Client>): Promise<string> {
    const newClient: Client = {
      nom: clientData.nom || '',
      email: clientData.email || '',
      telephone: clientData.telephone || '',
      adresse: clientData.adresse || '',
      boutiqueId: boutiqueId,
      createdAt: new Date().toISOString(),
      ...clientData
    };
    return await this.firebase.addData('clients', newClient);
  }

  async updateClient(clientId: string, data: Partial<Client>): Promise<void> {
    await this.firebase.updateData('clients', clientId, data);
  }

  async deleteClient(clientId: string): Promise<void> {
    await this.firebase.deleteData('clients', clientId);
  }

  // ====================== COMMANDES ======================
  async getBoutiqueCommandes(boutiqueId: string): Promise<Commande[]> {
    const allCommandes = await this.firebase.getData('commandes');
    return allCommandes.filter((c: Commande) => c.boutiqueId === boutiqueId);
  }

  async updateCommandeStatut(commandeId: string, statut: Commande['statut']): Promise<void> {
    await this.firebase.updateData('commandes', commandeId, { 
      statut, 
      updatedAt: new Date().toISOString() 
    });
  }

  async getChiffreAffaire(boutiqueId: string): Promise<number> {
    const commandes = await this.getBoutiqueCommandes(boutiqueId);
    const commandesLivrees = commandes.filter((c: Commande) => c.statut === 'livree');
    return commandesLivrees.reduce((total, c) => total + (c.total || 0), 0);
  }

  async getCommandesByStatut(boutiqueId: string, statut: Commande['statut']): Promise<Commande[]> {
    const commandes = await this.getBoutiqueCommandes(boutiqueId);
    return commandes.filter(c => c.statut === statut);
  }

  // ====================== UPLOAD IMAGE ======================
  async uploadProductImage(file: File, produitId: string): Promise<string> {
    const extension = file.name.split('.').pop();
    const vendeur = this.vendeurAuth.getCurrentVendeur();
    const vendeurId = vendeur?.uid || (vendeur as any)?.id;
    const path = `produits/${vendeurId}/${produitId}_${Date.now()}.${extension}`;
    return await this.firebase.uploadImage(file, path);
  }
}
