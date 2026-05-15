export interface Produit {
  id?: string;
  nom: string;
  description?: string;
  prix: number;
  ancienPrix?: number;
  stock: number;
  category: string;
  boutiqueId: string;
  imageBase64?: string;
  imageUrl?: string;
  isActive: boolean;
  isHot?: boolean;
  isNew?: boolean;
  createdAt: string;
}
