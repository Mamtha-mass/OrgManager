import { Organization, User } from '../types';

// Initial Mock Data to populate if empty
const INITIAL_DATA: Organization[] = [
  {
    id: '1',
    name: 'Acme Corp',
    adminEmail: 'admin@acme.com',
    status: 'Active',
    createdAt: '2023-10-15T10:00:00Z',
    collectionName: 'org_acme_corp',
    dbConnection: 'mongodb://cluster0:27017/master'
  },
  {
    id: '2',
    name: 'Globex Inc',
    adminEmail: 'manager@globex.com',
    status: 'Active',
    createdAt: '2023-11-02T14:30:00Z',
    collectionName: 'org_globex_inc',
    dbConnection: 'mongodb://cluster0:27017/master'
  },
  {
    id: '3',
    name: 'Soylent Corp',
    adminEmail: 'director@soylent.com',
    status: 'Inactive',
    createdAt: '2023-12-01T09:15:00Z',
    collectionName: 'org_soylent_corp',
    dbConnection: 'mongodb://cluster0:27017/master'
  }
];

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Helper to access LocalStorage
const getDB = (): Organization[] => {
  try {
    const stored = localStorage.getItem('org_db_v1');
    if (stored) {
      return JSON.parse(stored);
    }
    // Initialize if empty
    localStorage.setItem('org_db_v1', JSON.stringify(INITIAL_DATA));
    return INITIAL_DATA;
  } catch (e) {
    console.error("Storage error", e);
    return INITIAL_DATA;
  }
};

const saveDB = (data: Organization[]) => {
  localStorage.setItem('org_db_v1', JSON.stringify(data));
};

export const api = {
  login: async (email: string, password: string): Promise<{ user: User, token: string }> => {
    await delay(800);
    // Simple mock auth
    if (email === 'admin@example.com' && password === 'password') {
      return {
        user: { id: 'admin-1', email, name: 'Super Admin', role: 'super_admin' },
        token: 'fake-jwt-token-123456'
      };
    }
    throw new Error('Invalid credentials');
  },

  getOrganizations: async (): Promise<Organization[]> => {
    await delay(600);
    return getDB();
  },

  createOrganization: async (data: { name: string; email: string }) => {
    await delay(800);
    const db = getDB();
    const exists = db.find(o => o.name.toLowerCase() === data.name.toLowerCase());
    if (exists) throw new Error('Organization name already exists');

    const newOrg: Organization = {
      id: Math.random().toString(36).substr(2, 9),
      name: data.name,
      adminEmail: data.email,
      status: 'Active',
      createdAt: new Date().toISOString(),
      collectionName: `org_${data.name.toLowerCase().replace(/\s+/g, '_').replace(/[^a-z0-9_]/g, '')}`,
      dbConnection: 'mongodb://cluster0:27017/master'
    };
    
    const newDb = [newOrg, ...db];
    saveDB(newDb);
    return newOrg;
  },

  updateOrganization: async (id: string, data: { name: string; email: string }) => {
    await delay(800);
    const db = getDB();
    const index = db.findIndex(o => o.id === id);
    if (index === -1) throw new Error('Organization not found');

    const updatedOrg = {
      ...db[index],
      name: data.name,
      adminEmail: data.email,
      collectionName: `org_${data.name.toLowerCase().replace(/\s+/g, '_').replace(/[^a-z0-9_]/g, '')}` 
    };
    
    db[index] = updatedOrg;
    saveDB(db);
    return updatedOrg;
  },

  deleteOrganization: async (id: string) => {
    await delay(800);
    const db = getDB();
    const newDb = db.filter(o => o.id !== id);
    saveDB(newDb);
    return true;
  }
};