export interface Boutique {
  id?: string;
  nom: string;
  vendeurId: string;
  vendeurEmail?: string;
  vendeurNom?: string;
  statut: 'active' | 'inactive' | 'suspendue';
  abonnement: 'gratuit' | 'basic' | 'premium';
  description?: string;
  adresse?: string;
  telephone?: string;
  qrCodeUrl?: string;
  createdAt: string;
}
