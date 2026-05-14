export interface Produit {
  id?: string;
  nom: string;
  description?: string;
  prix: number;
  ancienPrix?: number;
  stock: number;
  category: string;
  boutiqueId: string;
  imageUrl?: string;
  images?: string[];
  isActive: boolean;
  isHot?: boolean;
  isNew?: boolean;
  rating?: number;
  reviews?: number;
  createdAt: string;
  updatedAt?: string;
}
