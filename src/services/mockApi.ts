import { User, Customer, ChitScheme, Payment, Auction, LoginCredentials, RegisterData } from '../types';

// Mock Users
const mockUsers: User[] = [
  { id: '1', username: 'admin', email: 'admin@chitfund.com', name: 'Admin User', role: 'admin' },
  { id: '2', username: 'manager', email: 'manager@chitfund.com', name: 'Manager User', role: 'manager' }
];

// Mock Customers
let mockCustomers: Customer[] = [
  {
    id: '1',
    name: 'Rajesh Kumar',
    email: 'rajesh@example.com',
    phone: '9876543210',
    address: '123 Main Street, City',
    aadharNumber: '1234-5678-9012',
    panNumber: 'ABCDE1234F',
    createdAt: '2024-01-15',
    status: 'active'
  },
  {
    id: '2',
    name: 'Priya Sharma',
    email: 'priya@example.com',
    phone: '9876543211',
    address: '456 Park Avenue, City',
    aadharNumber: '2345-6789-0123',
    panNumber: 'FGHIJ5678K',
    createdAt: '2024-01-20',
    status: 'active'
  },
  {
    id: '3',
    name: 'Amit Patel',
    email: 'amit@example.com',
    phone: '9876543212',
    address: '789 Market Road, City',
    aadharNumber: '3456-7890-1234',
    panNumber: 'LMNOP9012Q',
    createdAt: '2024-02-01',
    status: 'active'
  }
];

// Mock Chit Schemes
const mockSchemes: ChitScheme[] = [
  {
    id: '1',
    name: 'Monthly Chit Scheme - 1 Lakh',
    totalAmount: 100000,
    duration: 12,
    monthlyInstallment: 8333,
    startDate: '2024-01-01',
    endDate: '2024-12-31',
    status: 'active',
    totalMembers: 20,
    currentMembers: 15
  },
  {
    id: '2',
    name: 'Monthly Chit Scheme - 5 Lakh',
    totalAmount: 500000,
    duration: 24,
    monthlyInstallment: 20833,
    startDate: '2024-01-01',
    endDate: '2025-12-31',
    status: 'active',
    totalMembers: 25,
    currentMembers: 20
  },
  {
    id: '3',
    name: 'Monthly Chit Scheme - 2 Lakh',
    totalAmount: 200000,
    duration: 12,
    monthlyInstallment: 16666,
    startDate: '2023-06-01',
    endDate: '2024-05-31',
    status: 'completed',
    totalMembers: 15,
    currentMembers: 15
  }
];

// Mock Payments
const mockPayments: Payment[] = [
  {
    id: '1',
    customerId: '1',
    customerName: 'Rajesh Kumar',
    schemeId: '1',
    schemeName: 'Monthly Chit Scheme - 1 Lakh',
    amount: 8333,
    paymentDate: '2024-01-05',
    month: 1,
    status: 'paid'
  },
  {
    id: '2',
    customerId: '2',
    customerName: 'Priya Sharma',
    schemeId: '1',
    schemeName: 'Monthly Chit Scheme - 1 Lakh',
    amount: 8333,
    paymentDate: '2024-01-06',
    month: 1,
    status: 'paid'
  },
  {
    id: '3',
    customerId: '1',
    customerName: 'Rajesh Kumar',
    schemeId: '1',
    schemeName: 'Monthly Chit Scheme - 1 Lakh',
    amount: 8333,
    paymentDate: '2024-02-05',
    month: 2,
    status: 'paid'
  },
  {
    id: '4',
    customerId: '3',
    customerName: 'Amit Patel',
    schemeId: '2',
    schemeName: 'Monthly Chit Scheme - 5 Lakh',
    amount: 20833,
    paymentDate: '',
    month: 1,
    status: 'pending'
  }
];

// Mock Auctions
const mockAuctions: Auction[] = [
  {
    id: '1',
    schemeId: '1',
    schemeName: 'Monthly Chit Scheme - 1 Lakh',
    auctionDate: '2024-02-15',
    baseAmount: 100000,
    highestBid: 95000,
    winnerId: '1',
    winnerName: 'Rajesh Kumar',
    status: 'completed'
  },
  {
    id: '2',
    schemeId: '1',
    schemeName: 'Monthly Chit Scheme - 1 Lakh',
    auctionDate: '2024-03-15',
    baseAmount: 100000,
    highestBid: 0,
    status: 'scheduled'
  }
];

// Simulate API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const mockApi = {
  // Authentication
  async login(credentials: LoginCredentials): Promise<{ user: User; token: string }> {
    await delay(500);
    const user = mockUsers.find(u => u.username === credentials.username);
    if (user && credentials.password === 'password') {
      return { user, token: 'mock-token-' + user.id };
    }
    throw new Error('Invalid credentials');
  },

  async register(data: RegisterData): Promise<{ user: User; token: string }> {
    await delay(500);
    const newUser: User = {
      id: String(mockUsers.length + 1),
      username: data.username,
      email: data.email,
      name: data.name,
      role: 'manager'
    };
    mockUsers.push(newUser);
    return { user: newUser, token: 'mock-token-' + newUser.id };
  },

  async logout(): Promise<void> {
    await delay(300);
    return Promise.resolve();
  },

  // Customers
  async getCustomers(): Promise<Customer[]> {
    await delay(500);
    return [...mockCustomers];
  },

  async addCustomer(customer: Omit<Customer, 'id' | 'createdAt'>): Promise<Customer> {
    await delay(500);
    const newCustomer: Customer = {
      ...customer,
      id: String(mockCustomers.length + 1),
      createdAt: new Date().toISOString().split('T')[0]
    };
    mockCustomers.push(newCustomer);
    return newCustomer;
  },

  // Chit Schemes
  async getSchemes(): Promise<ChitScheme[]> {
    await delay(500);
    return [...mockSchemes];
  },

  async addScheme(scheme: Omit<ChitScheme, 'id'>): Promise<ChitScheme> {
    await delay(500);
    const newScheme: ChitScheme = {
      ...scheme,
      id: String(mockSchemes.length + 1)
    };
    mockSchemes.push(newScheme);
    return newScheme;
  },

  // Payments
  async getPayments(): Promise<Payment[]> {
    await delay(500);
    return [...mockPayments];
  },

  // Auctions
  async getAuctions(): Promise<Auction[]> {
    await delay(500);
    return [...mockAuctions];
  }
};

