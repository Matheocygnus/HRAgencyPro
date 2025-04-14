import { 
  users, type User, type InsertUser,
  clients, type Client, type InsertClient,
  companies, type Company, type InsertCompany,
  prospects, type Prospect, type InsertProspect,
  heroes, type Hero, type InsertHero,
  contracts, type Contract, type InsertContract,
  invoices, type Invoice, type InsertInvoice
} from "@shared/schema";
import createMemoryStore from "memorystore";
import session from "express-session";

// Memory store for session
const MemoryStore = createMemoryStore(session);

// Helper functions to ensure correct types
function ensureUserFields(userData: any): User {
  return {
    id: userData.id,
    username: userData.username,
    password: userData.password,
    email: userData.email,
    firstName: userData.firstName,
    lastName: userData.lastName,
    avatar: userData.avatar || null,
    role: userData.role || "recruiter",
    createdAt: userData.createdAt
  };
}

function ensureClientFields(clientData: any): Client {
  return {
    id: clientData.id,
    name: clientData.name,
    contactPerson: clientData.contactPerson,
    email: clientData.email,
    phone: clientData.phone || null,
    status: clientData.status || "active",
    createdAt: clientData.createdAt
  };
}

function ensureCompanyFields(companyData: any): Company {
  return {
    id: companyData.id,
    name: companyData.name,
    clientId: companyData.clientId,
    industry: companyData.industry || null,
    size: companyData.size || null,
    location: companyData.location || null,
    createdAt: companyData.createdAt
  };
}

function ensureProspectFields(prospectData: any): Prospect {
  return {
    id: prospectData.id,
    firstName: prospectData.firstName,
    lastName: prospectData.lastName,
    email: prospectData.email,
    phone: prospectData.phone || null,
    position: prospectData.position,
    skills: prospectData.skills || null,
    resume: prospectData.resume || null,
    status: prospectData.status || "sourcing",
    clientId: prospectData.clientId || null,
    companyId: prospectData.companyId || null,
    notes: prospectData.notes || null,
    createdAt: prospectData.createdAt,
    isInterviewed: prospectData.isInterviewed || false,
    isClientApproved: prospectData.isClientApproved || false,
    isBudgetAgreed: prospectData.isBudgetAgreed || false
  };
}

function ensureHeroFields(heroData: any): Hero {
  return {
    id: heroData.id,
    prospectId: heroData.prospectId,
    startDate: heroData.startDate || null,
    contractId: heroData.contractId || null,
    clientId: heroData.clientId,
    companyId: heroData.companyId,
    createdAt: heroData.createdAt
  };
}

function ensureContractFields(contractData: any): Contract {
  return {
    id: contractData.id,
    title: contractData.title,
    heroId: contractData.heroId,
    clientId: contractData.clientId,
    companyId: contractData.companyId,
    startDate: contractData.startDate,
    endDate: contractData.endDate || null,
    compensation: contractData.compensation,
    status: contractData.status || "draft",
    document: contractData.document || null,
    createdAt: contractData.createdAt
  };
}

function ensureInvoiceFields(invoiceData: any): Invoice {
  return {
    id: invoiceData.id,
    invoiceNumber: invoiceData.invoiceNumber,
    contractId: invoiceData.contractId,
    heroId: invoiceData.heroId,
    clientId: invoiceData.clientId,
    companyId: invoiceData.companyId,
    amount: invoiceData.amount,
    status: invoiceData.status || "pending",
    dueDate: invoiceData.dueDate,
    paidDate: invoiceData.paidDate || null,
    createdAt: invoiceData.createdAt
  };
}

export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: number, user: Partial<User>): Promise<User | undefined>;
  getUsers(): Promise<User[]>;
  
  // Client methods
  getClient(id: number): Promise<Client | undefined>;
  getClients(): Promise<Client[]>;
  createClient(client: InsertClient): Promise<Client>;
  updateClient(id: number, client: Partial<Client>): Promise<Client | undefined>;
  
  // Company methods
  getCompany(id: number): Promise<Company | undefined>;
  getCompanies(): Promise<Company[]>;
  getCompaniesByClient(clientId: number): Promise<Company[]>;
  createCompany(company: InsertCompany): Promise<Company>;
  updateCompany(id: number, company: Partial<Company>): Promise<Company | undefined>;
  
  // Prospect methods
  getProspect(id: number): Promise<Prospect | undefined>;
  getProspects(): Promise<Prospect[]>;
  getProspectsByStatus(status: string): Promise<Prospect[]>;
  getProspectsByClient(clientId: number): Promise<Prospect[]>;
  createProspect(prospect: InsertProspect): Promise<Prospect>;
  updateProspect(id: number, prospect: Partial<Prospect>): Promise<Prospect | undefined>;
  
  // Hero methods
  getHero(id: number): Promise<Hero | undefined>;
  getHeroes(): Promise<Hero[]>;
  getHeroesByClient(clientId: number): Promise<Hero[]>;
  createHero(hero: InsertHero): Promise<Hero>;
  updateHero(id: number, hero: Partial<Hero>): Promise<Hero | undefined>;
  
  // Contract methods
  getContract(id: number): Promise<Contract | undefined>;
  getContracts(): Promise<Contract[]>;
  getContractsByClient(clientId: number): Promise<Contract[]>;
  createContract(contract: InsertContract): Promise<Contract>;
  updateContract(id: number, contract: Partial<Contract>): Promise<Contract | undefined>;
  
  // Invoice methods
  getInvoice(id: number): Promise<Invoice | undefined>;
  getInvoices(): Promise<Invoice[]>;
  getInvoicesByClient(clientId: number): Promise<Invoice[]>;
  createInvoice(invoice: InsertInvoice): Promise<Invoice>;
  updateInvoice(id: number, invoice: Partial<Invoice>): Promise<Invoice | undefined>;
  
  // Session store
  sessionStore: any; // Using 'any' temporarily to resolve type issues
}

/* We'll implement the PostgreSQL storage in the future.
export class PgStorage implements IStorage {
  // Session store and implementation will go here
} */

export class MemStorage implements IStorage {
  // Storage maps
  private usersMap: Map<number, User>;
  private clientsMap: Map<number, Client>;
  private companiesMap: Map<number, Company>;
  private prospectsMap: Map<number, Prospect>;
  private heroesMap: Map<number, Hero>;
  private contractsMap: Map<number, Contract>;
  private invoicesMap: Map<number, Invoice>;
  
  // Auto-increment counters
  private userIdCounter: number;
  private clientIdCounter: number;
  private companyIdCounter: number;
  private prospectIdCounter: number;
  private heroIdCounter: number;
  private contractIdCounter: number;
  private invoiceIdCounter: number;
  private invoiceNumberCounter: number;
  
  // Session store
  sessionStore: any;
  
  constructor() {
    // Initialize maps
    this.usersMap = new Map();
    this.clientsMap = new Map();
    this.companiesMap = new Map();
    this.prospectsMap = new Map();
    this.heroesMap = new Map();
    this.contractsMap = new Map();
    this.invoicesMap = new Map();
    
    // Initialize counters
    this.userIdCounter = 1;
    this.clientIdCounter = 1;
    this.companyIdCounter = 1;
    this.prospectIdCounter = 1;
    this.heroIdCounter = 1;
    this.contractIdCounter = 1;
    this.invoiceIdCounter = 1;
    this.invoiceNumberCounter = 10001;
    
    // Initialize session store with memory store
    this.sessionStore = new MemoryStore({
      checkPeriod: 86400000 // 24 hours
    });
  }
  
  // User methods
  async getUser(id: number): Promise<User | undefined> {
    return this.usersMap.get(id);
  }
  
  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.usersMap.values()).find(
      (user) => user.username === username
    );
  }
  
  async createUser(userData: InsertUser): Promise<User> {
    const id = this.userIdCounter++;
    const createdAt = new Date();
    const user = ensureUserFields({ id, ...userData, createdAt });
    this.usersMap.set(id, user);
    return user;
  }
  
  async updateUser(id: number, userData: Partial<User>): Promise<User | undefined> {
    const user = await this.getUser(id);
    if (!user) return undefined;
    
    const updatedUser = ensureUserFields({ ...user, ...userData });
    this.usersMap.set(id, updatedUser);
    return updatedUser;
  }
  
  async getUsers(): Promise<User[]> {
    return Array.from(this.usersMap.values());
  }
  
  // Client methods
  async getClient(id: number): Promise<Client | undefined> {
    return this.clientsMap.get(id);
  }
  
  async getClients(): Promise<Client[]> {
    return Array.from(this.clientsMap.values());
  }
  
  async createClient(clientData: InsertClient): Promise<Client> {
    const id = this.clientIdCounter++;
    const createdAt = new Date();
    const client = ensureClientFields({ id, ...clientData, createdAt });
    this.clientsMap.set(id, client);
    return client;
  }
  
  async updateClient(id: number, clientData: Partial<Client>): Promise<Client | undefined> {
    const client = await this.getClient(id);
    if (!client) return undefined;
    
    const updatedClient = ensureClientFields({ ...client, ...clientData });
    this.clientsMap.set(id, updatedClient);
    return updatedClient;
  }
  
  // Company methods
  async getCompany(id: number): Promise<Company | undefined> {
    return this.companiesMap.get(id);
  }
  
  async getCompanies(): Promise<Company[]> {
    return Array.from(this.companiesMap.values());
  }
  
  async getCompaniesByClient(clientId: number): Promise<Company[]> {
    return Array.from(this.companiesMap.values()).filter(
      (company) => company.clientId === clientId
    );
  }
  
  async createCompany(companyData: InsertCompany): Promise<Company> {
    const id = this.companyIdCounter++;
    const createdAt = new Date();
    const company = ensureCompanyFields({ id, ...companyData, createdAt });
    this.companiesMap.set(id, company);
    return company;
  }
  
  async updateCompany(id: number, companyData: Partial<Company>): Promise<Company | undefined> {
    const company = await this.getCompany(id);
    if (!company) return undefined;
    
    const updatedCompany = ensureCompanyFields({ ...company, ...companyData });
    this.companiesMap.set(id, updatedCompany);
    return updatedCompany;
  }
  
  // Prospect methods
  async getProspect(id: number): Promise<Prospect | undefined> {
    return this.prospectsMap.get(id);
  }
  
  async getProspects(): Promise<Prospect[]> {
    return Array.from(this.prospectsMap.values());
  }
  
  async getProspectsByStatus(status: string): Promise<Prospect[]> {
    return Array.from(this.prospectsMap.values()).filter(
      (prospect) => prospect.status === status
    );
  }
  
  async getProspectsByClient(clientId: number): Promise<Prospect[]> {
    return Array.from(this.prospectsMap.values()).filter(
      (prospect) => prospect.clientId === clientId
    );
  }
  
  async createProspect(prospectData: InsertProspect): Promise<Prospect> {
    const id = this.prospectIdCounter++;
    const createdAt = new Date();
    const prospect = ensureProspectFields({ id, ...prospectData, createdAt });
    this.prospectsMap.set(id, prospect);
    return prospect;
  }
  
  async updateProspect(id: number, prospectData: Partial<Prospect>): Promise<Prospect | undefined> {
    const prospect = await this.getProspect(id);
    if (!prospect) return undefined;
    
    const updatedProspect = ensureProspectFields({ ...prospect, ...prospectData });
    this.prospectsMap.set(id, updatedProspect);
    return updatedProspect;
  }
  
  // Hero methods
  async getHero(id: number): Promise<Hero | undefined> {
    return this.heroesMap.get(id);
  }
  
  async getHeroes(): Promise<Hero[]> {
    return Array.from(this.heroesMap.values());
  }
  
  async getHeroesByClient(clientId: number): Promise<Hero[]> {
    return Array.from(this.heroesMap.values()).filter(
      (hero) => hero.clientId === clientId
    );
  }
  
  async createHero(heroData: InsertHero): Promise<Hero> {
    const id = this.heroIdCounter++;
    const createdAt = new Date();
    const hero = ensureHeroFields({ id, ...heroData, createdAt });
    this.heroesMap.set(id, hero);
    return hero;
  }
  
  async updateHero(id: number, heroData: Partial<Hero>): Promise<Hero | undefined> {
    const hero = await this.getHero(id);
    if (!hero) return undefined;
    
    const updatedHero = ensureHeroFields({ ...hero, ...heroData });
    this.heroesMap.set(id, updatedHero);
    return updatedHero;
  }
  
  // Contract methods
  async getContract(id: number): Promise<Contract | undefined> {
    return this.contractsMap.get(id);
  }
  
  async getContracts(): Promise<Contract[]> {
    return Array.from(this.contractsMap.values());
  }
  
  async getContractsByClient(clientId: number): Promise<Contract[]> {
    return Array.from(this.contractsMap.values()).filter(
      (contract) => contract.clientId === clientId
    );
  }
  
  async createContract(contractData: InsertContract): Promise<Contract> {
    const id = this.contractIdCounter++;
    const createdAt = new Date();
    const contract = ensureContractFields({ id, ...contractData, createdAt });
    this.contractsMap.set(id, contract);
    return contract;
  }
  
  async updateContract(id: number, contractData: Partial<Contract>): Promise<Contract | undefined> {
    const contract = await this.getContract(id);
    if (!contract) return undefined;
    
    const updatedContract = ensureContractFields({ ...contract, ...contractData });
    this.contractsMap.set(id, updatedContract);
    return updatedContract;
  }
  
  // Invoice methods
  async getInvoice(id: number): Promise<Invoice | undefined> {
    return this.invoicesMap.get(id);
  }
  
  async getInvoices(): Promise<Invoice[]> {
    return Array.from(this.invoicesMap.values());
  }
  
  async getInvoicesByClient(clientId: number): Promise<Invoice[]> {
    return Array.from(this.invoicesMap.values()).filter(
      (invoice) => invoice.clientId === clientId
    );
  }
  
  async createInvoice(invoiceData: InsertInvoice): Promise<Invoice> {
    const id = this.invoiceIdCounter++;
    const createdAt = new Date();
    // If invoiceNumber is not provided, generate one
    const invoiceNumber = invoiceData.invoiceNumber || `INV-${this.invoiceNumberCounter++}`;
    const invoice = ensureInvoiceFields({ id, ...invoiceData, invoiceNumber, createdAt });
    this.invoicesMap.set(id, invoice);
    return invoice;
  }
  
  async updateInvoice(id: number, invoiceData: Partial<Invoice>): Promise<Invoice | undefined> {
    const invoice = await this.getInvoice(id);
    if (!invoice) return undefined;
    
    const updatedInvoice = ensureInvoiceFields({ ...invoice, ...invoiceData });
    this.invoicesMap.set(id, updatedInvoice);
    return updatedInvoice;
  }
}

export const storage = new MemStorage();
