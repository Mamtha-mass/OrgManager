export interface Organization {
  id: string;
  name: string;
  adminEmail: string;
  status: 'Active' | 'Inactive' | 'Pending';
  createdAt: string;
  collectionName: string;
  dbConnection: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'super_admin' | 'org_admin';
}

export interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  token: string | null;
}

export type ModalType = 'CREATE' | 'EDIT' | 'DELETE' | 'VIEW' | null;
