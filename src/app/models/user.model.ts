export interface User {
  uid?: string;
  nom?: string;
  email: string;
  role: 'client' | 'vendeur' | 'admin';
  displayName?: string;
  createdAt?: string;
  photoURL?: string;
}
