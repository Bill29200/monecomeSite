export interface User {
  uid?: string;
  id?: string;        // Ajout de l'id optionnel
  nom?: string;
  email: string;
  role: 'client' | 'vendeur' | 'admin';
  displayName?: string;
  createdAt?: string;
  photoURL?: string;
  telephone?: string;
  isActive?: boolean;
}
