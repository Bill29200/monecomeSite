export interface Client {
  id?: string;
  nom: string;
  email: string;
  telephone?: string;
  adresse?: string;
  boutiqueId: string;
  createdAt: string;
  totalCommandes?: number;
  totalDepenses?: number;
}
