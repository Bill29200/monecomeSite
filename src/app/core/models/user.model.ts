export interface User {
  uid?: string;
  id?: string;
  nom?: string;
  email: string;
  role: 'client' | 'vendeur' | 'admin';
  displayName?: string;
  createdAt?: string;
  telephone?: string;
  isActive?: boolean;
}
