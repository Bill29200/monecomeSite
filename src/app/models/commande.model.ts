export interface Commande {
  id?: string;
  boutiqueId: string;
  clientId: string;
  clientNom: string;
  clientEmail: string;
  clientTelephone?: string;
  adresse: string;
  produits: CommandeProduit[];
  total: number;
  statut: 'en_attente' | 'confirmee' | 'preparation' | 'expediee' | 'livree' | 'annulee';
  createdAt: string;
  updatedAt?: string;
}

export interface CommandeProduit {
  produitId: string;
  nom: string;
  prix: number;
  quantite: number;
}
