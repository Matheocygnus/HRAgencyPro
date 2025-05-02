import { 
  users, type User, type InsertUser,
  roles, type Role, type InsertRole,
  clients, type Client, type InsertClient,
  companies, type Company, type InsertCompany,
  prospects, type Prospect, type InsertProspect,
  heroes, type Hero, type InsertHero,
  contracts, type Contract, type InsertContract,
  invoices, type Invoice, type InsertInvoice,
  interviews, type Interview, type InsertInterview,
  jobOpenings, type JobOpening, type InsertJobOpening,
  jobApplications, type JobApplication, type InsertJobApplication,
  jobRequests, type JobRequest, type InsertJobRequest
} from "@shared/schema";
import createMemoryStore from "memorystore";
import connectPg from "connect-pg-simple";
import session from "express-session";
import { eq, and, desc, asc, isNull, gt, or, inArray } from "drizzle-orm";
import { db, pool } from "./db";

// Memory store for session
const MemoryStore = createMemoryStore(session);

// Helper functions to ensure correct types
function ensureUserFields(userData: any): User {
  // Map snake_case database fields to camelCase application fields
  return {
    id: userData.id,
    username: userData.username,
    password: userData.password,
    email: userData.email,
    firstName: userData.first_name || userData.firstName,
    lastName: userData.last_name || userData.lastName,
    avatar: userData.avatar || null,
    role: userData.role || "user",
    createdAt: userData.created_at || userData.createdAt
  };
}

function ensureClientFields(clientData: any): Client {
  // Map snake_case database fields to camelCase application fields
  return {
    id: clientData.id,
    name: clientData.name,
    contactPerson: clientData.contact_person || clientData.contactPerson,
    email: clientData.email,
    phone: clientData.phone || null,
    status: clientData.status || "active",
    createdAt: clientData.created_at || clientData.createdAt
  };
}

function ensureCompanyFields(companyData: any): Company {
  // Map snake_case database fields to camelCase application fields
  return {
    id: companyData.id,
    name: companyData.name,
    clientId: companyData.client_id || companyData.clientId,
    industry: companyData.industry || null,
    size: companyData.size || null,
    location: companyData.location || null,
    createdAt: companyData.created_at || companyData.createdAt
  };
}

function ensureProspectFields(prospectData: any): Prospect {
  // Map snake_case database fields to camelCase application fields
  return {
    id: prospectData.id,
    firstName: prospectData.first_name || prospectData.firstName,
    lastName: prospectData.last_name || prospectData.lastName,
    email: prospectData.email,
    phone: prospectData.phone || null,
    position: prospectData.position,
    skills: prospectData.skills || null,
    resume: prospectData.resume || null,
    voiceMessageUrl: null, // Not in database, set default
    status: prospectData.status || "sourcing",
    clientId: prospectData.client_id || prospectData.clientId || null,
    companyId: prospectData.company_id || prospectData.companyId || null,
    notes: prospectData.notes || null,
    notesHistory: "[]", // Not in database, set default
    createdAt: prospectData.created_at || prospectData.createdAt,
    isInterviewed: prospectData.is_interviewed || prospectData.isInterviewed || false,
    isClientApproved: prospectData.is_client_approved || prospectData.isClientApproved || false,
    isBudgetAgreed: prospectData.is_budget_agreed || prospectData.isBudgetAgreed || false
  };
}

function ensureHeroFields(heroData: any): Hero {
  // Map snake_case database fields to camelCase application fields
  return {
    id: heroData.id,
    prospectId: heroData.prospect_id || heroData.prospectId,
    startDate: heroData.start_date || heroData.startDate || null,
    contractId: heroData.contract_id || heroData.contractId || null,
    clientId: heroData.client_id || heroData.clientId,
    companyId: heroData.company_id || heroData.companyId,
    createdAt: heroData.created_at || heroData.createdAt
  };
}

function ensureContractFields(contractData: any): Contract {
  // Map snake_case database fields to camelCase application fields
  const compensation = contractData.compensation || 0;
  return {
    id: contractData.id,
    title: contractData.title,
    heroId: contractData.hero_id || contractData.heroId,
    clientId: contractData.client_id || contractData.clientId,
    companyId: contractData.company_id || contractData.companyId,
    startDate: contractData.start_date || contractData.startDate,
    endDate: contractData.end_date || contractData.endDate || null,
    compensation: compensation,
    companyPayment: contractData.company_payment || contractData.companyPayment || Math.round(compensation * 1.3), // Default to 130% of compensation
    profit: contractData.profit || Math.round(compensation * 0.3), // Default to 30% of compensation
    status: contractData.status || "draft",
    document: contractData.document || null,
    createdAt: contractData.created_at || contractData.createdAt
  };
}

function ensureInvoiceFields(invoiceData: any): Invoice {
  // Map snake_case database fields to camelCase application fields
  return {
    id: invoiceData.id,
    invoiceNumber: invoiceData.invoice_number || invoiceData.invoiceNumber,
    contractId: invoiceData.contract_id || invoiceData.contractId,
    heroId: invoiceData.hero_id || invoiceData.heroId,
    clientId: invoiceData.client_id || invoiceData.clientId,
    companyId: invoiceData.company_id || invoiceData.companyId,
    amount: invoiceData.amount,
    status: invoiceData.status || "pending",
    dueDate: invoiceData.due_date || invoiceData.dueDate,
    paidDate: invoiceData.paid_date || invoiceData.paidDate || null,
    stripeInvoiceId: invoiceData.stripe_invoice_id || invoiceData.stripeInvoiceId || null,
    stripeInvoiceUrl: invoiceData.stripe_invoice_url || invoiceData.stripeInvoiceUrl || null,
    createdAt: invoiceData.created_at || invoiceData.createdAt
  };
}

function ensureRoleFields(roleData: any): Role {
  // Map snake_case database fields to camelCase application fields
  return {
    id: roleData.id,
    name: roleData.name,
    description: roleData.description || null,
    permissions: roleData.permissions,
    createdAt: roleData.created_at || roleData.createdAt
  };
}

export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: number, user: Partial<User>): Promise<User | undefined>;
  getUsers(): Promise<User[]>;
  
  // Role methods
  getRole(id: number): Promise<Role | undefined>;
  getRoleByName(name: string): Promise<Role | undefined>;
  getRoles(): Promise<Role[]>;
  createRole(roleData: InsertRole): Promise<Role>;
  updateRole(id: number, roleData: Partial<Role>): Promise<Role | undefined>;
  deleteRole(id: number): Promise<boolean>;
  
  // Client methods
  getClient(id: number): Promise<Client | undefined>;
  getClientByEmail(email: string): Promise<Client | undefined>;
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
  
  // Interview methods
  getInterview(id: number): Promise<Interview | undefined>;
  getInterviews(): Promise<Interview[]>;
  getInterviewsByProspect(prospectId: number): Promise<Interview[]>;
  getUpcomingInterviews(): Promise<Interview[]>;
  createInterview(interview: InsertInterview): Promise<Interview>;
  updateInterview(id: number, interview: Partial<Interview>): Promise<Interview | undefined>;
  
  // Job Opening methods
  getJobOpening(id: number): Promise<JobOpening | undefined>;
  getJobOpenings(): Promise<JobOpening[]>;
  getActiveJobOpenings(): Promise<JobOpening[]>;
  createJobOpening(jobOpening: InsertJobOpening): Promise<JobOpening>;
  updateJobOpening(id: number, jobOpening: Partial<JobOpening>): Promise<JobOpening | undefined>;
  
  // Job Application methods
  getJobApplication(id: number): Promise<JobApplication | undefined>;
  getJobApplications(): Promise<JobApplication[]>;
  getJobApplicationsByJobOpening(jobOpeningId: number): Promise<JobApplication[]>;
  getJobApplicationsByStatus(status: string): Promise<JobApplication[]>;
  createJobApplication(jobApplication: InsertJobApplication): Promise<JobApplication>;
  updateJobApplication(id: number, jobApplication: Partial<JobApplication>): Promise<JobApplication | undefined>;
  
  // Job Request methods
  getJobRequest(id: number): Promise<JobRequest | undefined>;
  getJobRequests(): Promise<JobRequest[]>;
  getJobRequestsByClient(clientId: number): Promise<JobRequest[]>;
  getJobRequestsByStatus(status: string): Promise<JobRequest[]>;
  createJobRequest(jobRequest: InsertJobRequest): Promise<JobRequest>;
  updateJobRequest(id: number, jobRequest: Partial<JobRequest>): Promise<JobRequest | undefined>;
  approveJobRequest(id: number, notes?: string): Promise<JobRequest | undefined>;
  rejectJobRequest(id: number, notes?: string): Promise<JobRequest | undefined>;
  publishJobRequest(id: number): Promise<JobOpening | undefined>;
  
  // Session store
  sessionStore: any; // Using 'any' temporarily to resolve type issues
}

// Create a PostgresSQL session store
const PostgresSessionStore = connectPg(session);

// PostgreSQL implementation of the storage
export class DatabaseStorage implements IStorage {
  sessionStore: any;

  constructor() {
    this.sessionStore = new PostgresSessionStore({
      pool,
      createTableIfMissing: true
    });
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user ? ensureUserFields(user) : undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user ? ensureUserFields(user) : undefined;
  }

  async createUser(userData: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(userData).returning();
    return ensureUserFields(user);
  }

  async updateUser(id: number, userData: Partial<User>): Promise<User | undefined> {
    const [updatedUser] = await db
      .update(users)
      .set(userData)
      .where(eq(users.id, id))
      .returning();
    return updatedUser ? ensureUserFields(updatedUser) : undefined;
  }

  async getUsers(): Promise<User[]> {
    const allUsers = await db.select().from(users);
    return allUsers.map(u => ensureUserFields(u));
  }
  
  // Role methods
  async getRole(id: number): Promise<Role | undefined> {
    try {
      // Only select columns that exist in the database
      const [role] = await db.select({
        id: roles.id,
        name: roles.name,
        description: roles.description,
        permissions: roles.permissions,
        created_at: roles.createdAt
      }).from(roles).where(eq(roles.id, id));
      
      return role ? ensureRoleFields(role) : undefined;
    } catch (error) {
      console.error(`Error in getRole(${id}):`, error);
      return undefined;
    }
  }

  async getRoles(): Promise<Role[]> {
    try {
      // Only select columns that exist in the database
      const allRoles = await db.select({
        id: roles.id,
        name: roles.name,
        description: roles.description,
        permissions: roles.permissions,
        created_at: roles.createdAt
      }).from(roles);
      
      console.log("Successfully retrieved roles:", allRoles.length);
      return allRoles.map(r => ensureRoleFields(r));
    } catch (error) {
      console.error("Error in getRoles:", error);
      // Fallback to simpler query if column mapping is wrong
      const basicRoles = await db.select({
        id: roles.id,
      }).from(roles);
      
      // Manually fetch each role with more detailed error handling
      const detailedRoles = [];
      for (const { id } of basicRoles) {
        try {
          const role = await this.getRole(id);
          if (role) detailedRoles.push(role);
        } catch (err) {
          console.error(`Error fetching role ${id}:`, err);
        }
      }
      
      console.log(`Fallback retrieved ${detailedRoles.length} out of ${basicRoles.length} roles`);
      return detailedRoles;
    }
  }

  async createRole(roleData: InsertRole): Promise<Role> {
    try {
      const [role] = await db.insert(roles).values(roleData).returning();
      console.log("Role created successfully:", role);
      return ensureRoleFields(role);
    } catch (error) {
      console.error("Error in createRole:", error);
      throw error; // Rethrow since we can't recover from a creation error
    }
  }

  async updateRole(id: number, roleData: Partial<Role>): Promise<Role | undefined> {
    try {
      const [updatedRole] = await db
        .update(roles)
        .set(roleData)
        .where(eq(roles.id, id))
        .returning();
      console.log("Role updated successfully:", updatedRole);
      return updatedRole ? ensureRoleFields(updatedRole) : undefined;
    } catch (error) {
      console.error(`Error in updateRole(${id}):`, error);
      // Try to get the current role to return if update fails
      return await this.getRole(id);
    }
  }

  async getRoleByName(name: string): Promise<Role | undefined> {
    try {
      // Only select columns that exist in the database
      const [role] = await db.select({
        id: roles.id,
        name: roles.name,
        description: roles.description,
        permissions: roles.permissions,
        created_at: roles.createdAt
      }).from(roles).where(eq(roles.name, name));
      
      return role ? ensureRoleFields(role) : undefined;
    } catch (error) {
      console.error(`Error in getRoleByName(${name}):`, error);
      return undefined;
    }
  }

  async deleteRole(id: number): Promise<boolean> {
    try {
      const result = await db
        .delete(roles)
        .where(eq(roles.id, id))
        .returning();
      
      console.log("Role deletion result:", result);
      return result.length > 0;
    } catch (error) {
      console.error(`Error in deleteRole(${id}):`, error);
      return false;
    }
  }

  // Client methods
  async getClient(id: number): Promise<Client | undefined> {
    try {
      // Only select columns that exist in the database
      const [client] = await db.select({
        id: clients.id,
        name: clients.name,
        contact_person: clients.contactPerson,
        email: clients.email,
        phone: clients.phone,
        status: clients.status,
        created_at: clients.createdAt
      }).from(clients).where(eq(clients.id, id));
      
      return client ? ensureClientFields(client) : undefined;
    } catch (error) {
      console.error(`Error in getClient(${id}):`, error);
      return undefined;
    }
  }
  
  async getClientByEmail(email: string): Promise<Client | undefined> {
    try {
      // Select the client with matching email
      const [client] = await db.select({
        id: clients.id,
        name: clients.name,
        contact_person: clients.contactPerson,
        email: clients.email,
        phone: clients.phone,
        status: clients.status,
        created_at: clients.createdAt
      }).from(clients).where(eq(clients.email, email));
      
      return client ? ensureClientFields(client) : undefined;
    } catch (error) {
      console.error(`Error in getClientByEmail(${email}):`, error);
      return undefined;
    }
  }

  async getClients(): Promise<Client[]> {
    try {
      // Only select columns that exist in the database
      const allClients = await db.select({
        id: clients.id,
        name: clients.name,
        contact_person: clients.contactPerson,
        email: clients.email,
        phone: clients.phone,
        status: clients.status,
        created_at: clients.createdAt
      }).from(clients);
      
      console.log("Successfully retrieved clients:", allClients.length);
      return allClients.map(c => ensureClientFields(c));
    } catch (error) {
      console.error("Error in getClients:", error);
      // Fallback to simpler query if column mapping is wrong
      const basicClients = await db.select({
        id: clients.id,
      }).from(clients);
      
      // Manually fetch each client with more detailed error handling
      const detailedClients = [];
      for (const { id } of basicClients) {
        try {
          const client = await this.getClient(id);
          if (client) detailedClients.push(client);
        } catch (err) {
          console.error(`Error fetching client ${id}:`, err);
        }
      }
      
      console.log(`Fallback retrieved ${detailedClients.length} out of ${basicClients.length} clients`);
      return detailedClients;
    }
  }

  async createClient(clientData: InsertClient): Promise<Client> {
    try {
      const [client] = await db.insert(clients).values(clientData).returning();
      return ensureClientFields(client);
    } catch (error) {
      console.error("Error in createClient:", error);
      throw error; // Rethrow since we can't recover from a creation error
    }
  }

  async updateClient(id: number, clientData: Partial<Client>): Promise<Client | undefined> {
    try {
      const [updatedClient] = await db
        .update(clients)
        .set(clientData)
        .where(eq(clients.id, id))
        .returning();
      return updatedClient ? ensureClientFields(updatedClient) : undefined;
    } catch (error) {
      console.error(`Error in updateClient(${id}):`, error);
      // Try to get the current client to return if update fails
      return await this.getClient(id);
    }
  }

  // Company methods
  async getCompany(id: number): Promise<Company | undefined> {
    try {
      // Only select columns that exist in the database
      const [company] = await db.select({
        id: companies.id,
        name: companies.name,
        client_id: companies.clientId,
        industry: companies.industry,
        size: companies.size,
        location: companies.location,
        created_at: companies.createdAt
      }).from(companies).where(eq(companies.id, id));
      
      return company ? ensureCompanyFields(company) : undefined;
    } catch (error) {
      console.error(`Error in getCompany(${id}):`, error);
      return undefined;
    }
  }

  async getCompanies(): Promise<Company[]> {
    try {
      // Only select columns that exist in the database
      const allCompanies = await db.select({
        id: companies.id,
        name: companies.name,
        client_id: companies.clientId,
        industry: companies.industry,
        size: companies.size,
        location: companies.location,
        created_at: companies.createdAt
      }).from(companies);
      
      console.log("Successfully retrieved companies:", allCompanies.length);
      return allCompanies.map(c => ensureCompanyFields(c));
    } catch (error) {
      console.error("Error in getCompanies:", error);
      // Fallback to simpler query if column mapping is wrong
      const basicCompanies = await db.select({
        id: companies.id,
      }).from(companies);
      
      // Manually fetch each company with more detailed error handling
      const detailedCompanies = [];
      for (const { id } of basicCompanies) {
        try {
          const company = await this.getCompany(id);
          if (company) detailedCompanies.push(company);
        } catch (err) {
          console.error(`Error fetching company ${id}:`, err);
        }
      }
      
      console.log(`Fallback retrieved ${detailedCompanies.length} out of ${basicCompanies.length} companies`);
      return detailedCompanies;
    }
  }

  async getCompaniesByClient(clientId: number): Promise<Company[]> {
    try {
      // Only select columns that exist in the database
      const clientCompanies = await db.select({
        id: companies.id,
        name: companies.name,
        client_id: companies.clientId,
        industry: companies.industry,
        size: companies.size,
        location: companies.location,
        created_at: companies.createdAt
      }).from(companies).where(eq(companies.clientId, clientId));
      
      return clientCompanies.map(c => ensureCompanyFields(c));
    } catch (error) {
      console.error(`Error in getCompaniesByClient(${clientId}):`, error);
      // Fallback to in-memory filtering if database query fails
      const allCompanies = await this.getCompanies();
      return allCompanies.filter(c => c.clientId === clientId);
    }
  }

  async createCompany(companyData: InsertCompany): Promise<Company> {
    try {
      const [company] = await db.insert(companies).values(companyData).returning();
      return ensureCompanyFields(company);
    } catch (error) {
      console.error("Error in createCompany:", error);
      throw error; // Rethrow since we can't recover from a creation error
    }
  }

  async updateCompany(id: number, companyData: Partial<Company>): Promise<Company | undefined> {
    try {
      const [updatedCompany] = await db
        .update(companies)
        .set(companyData)
        .where(eq(companies.id, id))
        .returning();
      return updatedCompany ? ensureCompanyFields(updatedCompany) : undefined;
    } catch (error) {
      console.error(`Error in updateCompany(${id}):`, error);
      // Try to get the current company to return if update fails
      return await this.getCompany(id);
    }
  }

  // Prospect methods
  async getProspect(id: number): Promise<Prospect | undefined> {
    try {
      // Only select columns that exist in the database
      const [prospect] = await db.select({
        id: prospects.id,
        first_name: prospects.firstName,
        last_name: prospects.lastName,
        email: prospects.email,
        phone: prospects.phone,
        position: prospects.position,
        skills: prospects.skills,
        resume: prospects.resume,
        status: prospects.status,
        client_id: prospects.clientId,
        company_id: prospects.companyId,
        notes: prospects.notes,
        created_at: prospects.createdAt,
        is_interviewed: prospects.isInterviewed,
        is_client_approved: prospects.isClientApproved,
        is_budget_agreed: prospects.isBudgetAgreed
      }).from(prospects).where(eq(prospects.id, id));
      
      return prospect ? ensureProspectFields(prospect) : undefined;
    } catch (error) {
      console.error(`Error in getProspect(${id}):`, error);
      // For a single entity, if it fails, just return undefined
      return undefined;
    }
  }

  async getProspects(): Promise<Prospect[]> {
    try {
      // Only select columns that exist in the database
      const allProspects = await db.select({
        id: prospects.id,
        first_name: prospects.firstName,
        last_name: prospects.lastName,
        email: prospects.email,
        phone: prospects.phone,
        position: prospects.position,
        skills: prospects.skills,
        resume: prospects.resume,
        status: prospects.status,
        client_id: prospects.clientId,
        company_id: prospects.companyId,
        notes: prospects.notes,
        created_at: prospects.createdAt,
        is_interviewed: prospects.isInterviewed,
        is_client_approved: prospects.isClientApproved,
        is_budget_agreed: prospects.isBudgetAgreed
      }).from(prospects);
      
      console.log("Successfully retrieved prospects:", allProspects.length);
      return allProspects.map(p => ensureProspectFields(p));
    } catch (error) {
      console.error("Error in getProspects:", error);
      // Fallback to simpler query if column mapping is wrong
      const basicProspects = await db.select({
        id: prospects.id,
      }).from(prospects);
      
      // Manually fetch each prospect with more detailed error handling
      const detailedProspects = [];
      for (const { id } of basicProspects) {
        try {
          const prospect = await this.getProspect(id);
          if (prospect) detailedProspects.push(prospect);
        } catch (err) {
          console.error(`Error fetching prospect ${id}:`, err);
        }
      }
      
      return detailedProspects;
    }
  }

  async getProspectsByStatus(status: string): Promise<Prospect[]> {
    try {
      // Get all prospects and filter by status in memory for now
      // This is safer as status might have different case or format in the database
      const allProspects = await this.getProspects();
      return allProspects.filter(p => p.status === status);
    } catch (error) {
      console.error(`Error in getProspectsByStatus(${status}):`, error);
      return [];
    }
  }

  async getProspectsByClient(clientId: number): Promise<Prospect[]> {
    try {
      // Only select columns that exist in the database
      const clientProspects = await db.select({
        id: prospects.id,
        first_name: prospects.firstName,
        last_name: prospects.lastName,
        email: prospects.email,
        phone: prospects.phone,
        position: prospects.position,
        skills: prospects.skills,
        resume: prospects.resume,
        status: prospects.status,
        client_id: prospects.clientId,
        company_id: prospects.companyId,
        notes: prospects.notes,
        created_at: prospects.createdAt,
        is_interviewed: prospects.isInterviewed,
        is_client_approved: prospects.isClientApproved,
        is_budget_agreed: prospects.isBudgetAgreed
      }).from(prospects).where(eq(prospects.clientId, clientId));
      
      return clientProspects.map(p => ensureProspectFields(p));
    } catch (error) {
      console.error(`Error in getProspectsByClient(${clientId}):`, error);
      // Fallback to in-memory filtering if database query fails
      const allProspects = await this.getProspects();
      return allProspects.filter(p => p.clientId === clientId);
    }
  }

  async createProspect(prospectData: InsertProspect): Promise<Prospect> {
    try {
      const [prospect] = await db.insert(prospects).values(prospectData).returning();
      return ensureProspectFields(prospect);
    } catch (error) {
      console.error("Error in createProspect:", error);
      throw error; // Rethrow since we can't recover from a creation error
    }
  }

  async updateProspect(id: number, prospectData: Partial<Prospect>): Promise<Prospect | undefined> {
    try {
      const [updatedProspect] = await db
        .update(prospects)
        .set(prospectData)
        .where(eq(prospects.id, id))
        .returning();
      return updatedProspect ? ensureProspectFields(updatedProspect) : undefined;
    } catch (error) {
      console.error(`Error in updateProspect(${id}):`, error);
      // Try to get the current prospect to return if update fails
      return await this.getProspect(id);
    }
  }

  // Hero methods
  async getHero(id: number): Promise<Hero | undefined> {
    try {
      // Only select columns that exist in the database
      const [hero] = await db.select({
        id: heroes.id,
        prospect_id: heroes.prospectId,
        start_date: heroes.startDate,
        contract_id: heroes.contractId,
        client_id: heroes.clientId,
        company_id: heroes.companyId,
        created_at: heroes.createdAt
      }).from(heroes).where(eq(heroes.id, id));
      
      return hero ? ensureHeroFields(hero) : undefined;
    } catch (error) {
      console.error(`Error in getHero(${id}):`, error);
      return undefined;
    }
  }

  async getHeroes(): Promise<Hero[]> {
    try {
      // Only select columns that exist in the database
      const allHeroes = await db.select({
        id: heroes.id,
        prospect_id: heroes.prospectId,
        start_date: heroes.startDate,
        contract_id: heroes.contractId,
        client_id: heroes.clientId,
        company_id: heroes.companyId,
        created_at: heroes.createdAt
      }).from(heroes);
      
      console.log("Successfully retrieved heroes:", allHeroes.length);
      return allHeroes.map(h => ensureHeroFields(h));
    } catch (error) {
      console.error("Error in getHeroes:", error);
      // Fallback to simpler query if column mapping is wrong
      const basicHeroes = await db.select({
        id: heroes.id,
      }).from(heroes);
      
      // Manually fetch each hero with more detailed error handling
      const detailedHeroes = [];
      for (const { id } of basicHeroes) {
        try {
          const hero = await this.getHero(id);
          if (hero) detailedHeroes.push(hero);
        } catch (heroError) {
          console.error(`Error fetching hero ${id}:`, heroError);
        }
      }
      console.log(`Fallback retrieved ${detailedHeroes.length} out of ${basicHeroes.length} heroes`);
      return detailedHeroes;
    }
  }

  async getHeroesByClient(clientId: number): Promise<Hero[]> {
    try {
      // First, get all companies associated with this client
      const clientCompanies = await this.getCompaniesByClient(clientId);
      const companyIds = clientCompanies.map(company => company.id);
      
      console.log(`Fetching heroes for client ${clientId} with companies:`, companyIds);
      
      if (companyIds.length === 0) {
        // If no companies found, fall back to just client ID
        const clientHeroes = await db.select({
          id: heroes.id,
          prospect_id: heroes.prospectId,
          start_date: heroes.startDate,
          contract_id: heroes.contractId,
          client_id: heroes.clientId,
          company_id: heroes.companyId,
          created_at: heroes.createdAt
        }).from(heroes).where(eq(heroes.clientId, clientId));
        
        return clientHeroes.map(h => ensureHeroFields(h));
      }
      
      // Get heroes for all companies associated with this client
      const clientHeroes = await db.select({
        id: heroes.id,
        prospect_id: heroes.prospectId,
        start_date: heroes.startDate,
        contract_id: heroes.contractId,
        client_id: heroes.clientId,
        company_id: heroes.companyId,
        created_at: heroes.createdAt
      }).from(heroes).where(
        or(
          eq(heroes.clientId, clientId),
          inArray(heroes.companyId, companyIds)
        )
      );
      
      console.log(`Found ${clientHeroes.length} heroes for client ${clientId} across ${companyIds.length} companies`);
      return clientHeroes.map(h => ensureHeroFields(h));
    } catch (error) {
      console.error(`Error in getHeroesByClient(${clientId}):`, error);
      // Fallback to in-memory filtering if database query fails
      const allHeroes = await this.getHeroes();
      return allHeroes.filter(h => h.clientId === clientId);
    }
  }

  async createHero(heroData: InsertHero): Promise<Hero> {
    try {
      const [hero] = await db.insert(heroes).values(heroData).returning();
      return ensureHeroFields(hero);
    } catch (error) {
      console.error("Error in createHero:", error);
      throw error; // Rethrow since we can't recover from a creation error
    }
  }

  async updateHero(id: number, heroData: Partial<Hero>): Promise<Hero | undefined> {
    try {
      const [updatedHero] = await db
        .update(heroes)
        .set(heroData)
        .where(eq(heroes.id, id))
        .returning();
      return updatedHero ? ensureHeroFields(updatedHero) : undefined;
    } catch (error) {
      console.error(`Error in updateHero(${id}):`, error);
      // Try to get the current hero to return if update fails
      return await this.getHero(id);
    }
  }

  // Contract methods
  async getContract(id: number): Promise<Contract | undefined> {
    try {
      // Only select columns that exist in the database
      const [contract] = await db.select({
        id: contracts.id,
        title: contracts.title,
        hero_id: contracts.heroId,
        client_id: contracts.clientId,
        company_id: contracts.companyId,
        start_date: contracts.startDate,
        end_date: contracts.endDate,
        compensation: contracts.compensation,
        company_payment: contracts.companyPayment,
        profit: contracts.profit,
        status: contracts.status,
        document: contracts.document,
        created_at: contracts.createdAt
      }).from(contracts).where(eq(contracts.id, id));
      
      return contract ? ensureContractFields(contract) : undefined;
    } catch (error) {
      console.error(`Error in getContract(${id}):`, error);
      return undefined;
    }
  }

  async getContracts(): Promise<Contract[]> {
    try {
      // Only select columns that exist in the database
      const allContracts = await db.select({
        id: contracts.id,
        title: contracts.title,
        hero_id: contracts.heroId,
        client_id: contracts.clientId,
        company_id: contracts.companyId,
        start_date: contracts.startDate,
        end_date: contracts.endDate,
        compensation: contracts.compensation,
        company_payment: contracts.companyPayment,
        profit: contracts.profit,
        status: contracts.status,
        document: contracts.document,
        created_at: contracts.createdAt
      }).from(contracts);
      
      console.log("Successfully retrieved contracts:", allContracts.length);
      return allContracts.map(c => ensureContractFields(c));
    } catch (error) {
      console.error("Error in getContracts:", error);
      // Fallback to simpler query if column mapping is wrong
      const basicContracts = await db.select({
        id: contracts.id,
      }).from(contracts);
      
      // Manually fetch each contract with more detailed error handling
      const detailedContracts = [];
      for (const { id } of basicContracts) {
        try {
          const contract = await this.getContract(id);
          if (contract) detailedContracts.push(contract);
        } catch (err) {
          console.error(`Error fetching contract ${id}:`, err);
        }
      }
      
      console.log(`Fallback retrieved ${detailedContracts.length} out of ${basicContracts.length} contracts`);
      return detailedContracts;
    }
  }

  async getContractsByClient(clientId: number): Promise<Contract[]> {
    try {
      // Only select columns that exist in the database
      const clientContracts = await db.select({
        id: contracts.id,
        title: contracts.title,
        hero_id: contracts.heroId,
        client_id: contracts.clientId,
        company_id: contracts.companyId,
        start_date: contracts.startDate,
        end_date: contracts.endDate,
        compensation: contracts.compensation,
        company_payment: contracts.companyPayment,
        profit: contracts.profit,
        status: contracts.status,
        document: contracts.document,
        created_at: contracts.createdAt
      }).from(contracts).where(eq(contracts.clientId, clientId));
      
      return clientContracts.map(c => ensureContractFields(c));
    } catch (error) {
      console.error(`Error in getContractsByClient(${clientId}):`, error);
      // Fallback to in-memory filtering if database query fails
      const allContracts = await this.getContracts();
      return allContracts.filter(c => c.clientId === clientId);
    }
  }

  async createContract(contractData: InsertContract): Promise<Contract> {
    try {
      const [contract] = await db.insert(contracts).values(contractData).returning();
      return ensureContractFields(contract);
    } catch (error) {
      console.error("Error in createContract:", error);
      throw error; // Rethrow since we can't recover from a creation error
    }
  }

  async updateContract(id: number, contractData: Partial<Contract>): Promise<Contract | undefined> {
    try {
      const [updatedContract] = await db
        .update(contracts)
        .set(contractData)
        .where(eq(contracts.id, id))
        .returning();
      return updatedContract ? ensureContractFields(updatedContract) : undefined;
    } catch (error) {
      console.error(`Error in updateContract(${id}):`, error);
      // Try to get the current contract to return if update fails
      return await this.getContract(id);
    }
  }

  // Invoice methods
  async getInvoice(id: number): Promise<Invoice | undefined> {
    try {
      // Only select columns that exist in the database
      const [invoice] = await db.select({
        id: invoices.id,
        invoice_number: invoices.invoiceNumber,
        contract_id: invoices.contractId,
        hero_id: invoices.heroId,
        client_id: invoices.clientId,
        company_id: invoices.companyId,
        amount: invoices.amount,
        status: invoices.status,
        due_date: invoices.dueDate,
        paid_date: invoices.paidDate,
        created_at: invoices.createdAt
        // stripe_invoice_id and stripe_invoice_url are not in the database
      }).from(invoices).where(eq(invoices.id, id));
      
      return invoice ? ensureInvoiceFields(invoice) : undefined;
    } catch (error) {
      console.error(`Error in getInvoice(${id}):`, error);
      // For a single entity, if it fails, just return undefined
      return undefined;
    }
  }

  async getInvoices(): Promise<Invoice[]> {
    try {
      // Only select columns that exist in the database
      const allInvoices = await db.select({
        id: invoices.id,
        invoice_number: invoices.invoiceNumber,
        contract_id: invoices.contractId,
        hero_id: invoices.heroId,
        client_id: invoices.clientId,
        company_id: invoices.companyId,
        amount: invoices.amount,
        status: invoices.status,
        due_date: invoices.dueDate,
        paid_date: invoices.paidDate,
        created_at: invoices.createdAt
        // stripe_invoice_id and stripe_invoice_url are not in the database
      }).from(invoices);
      
      console.log("Successfully retrieved invoices:", allInvoices.length);
      return allInvoices.map(i => ensureInvoiceFields(i));
    } catch (error) {
      console.error("Error in getInvoices:", error);
      // Fallback to simpler query if column mapping is wrong
      const basicInvoices = await db.select({
        id: invoices.id,
      }).from(invoices);
      
      // Manually fetch each invoice with more detailed error handling
      const detailedInvoices = [];
      for (const { id } of basicInvoices) {
        try {
          const invoice = await this.getInvoice(id);
          if (invoice) detailedInvoices.push(invoice);
        } catch (err) {
          console.error(`Error fetching invoice ${id}:`, err);
        }
      }
      
      return detailedInvoices;
    }
  }

  async getInvoicesByClient(clientId: number): Promise<Invoice[]> {
    const clientInvoices = await db.select().from(invoices).where(eq(invoices.clientId, clientId));
    return clientInvoices.map(i => ensureInvoiceFields(i));
  }

  async createInvoice(invoiceData: InsertInvoice): Promise<Invoice> {
    const [invoice] = await db.insert(invoices).values(invoiceData).returning();
    return ensureInvoiceFields(invoice);
  }

  async updateInvoice(id: number, invoiceData: Partial<Invoice>): Promise<Invoice | undefined> {
    const [updatedInvoice] = await db
      .update(invoices)
      .set(invoiceData)
      .where(eq(invoices.id, id))
      .returning();
    return updatedInvoice ? ensureInvoiceFields(updatedInvoice) : undefined;
  }

  // Interview methods
  async getInterview(id: number): Promise<Interview | undefined> {
    const [interview] = await db.select().from(interviews).where(eq(interviews.id, id));
    return interview ? ensureInterviewFields(interview) : undefined;
  }

  async getInterviews(): Promise<Interview[]> {
    const allInterviews = await db.select().from(interviews);
    return allInterviews.map(i => ensureInterviewFields(i));
  }

  async getInterviewsByProspect(prospectId: number): Promise<Interview[]> {
    const prospectInterviews = await db.select().from(interviews).where(eq(interviews.prospectId, prospectId));
    return prospectInterviews.map(i => ensureInterviewFields(i));
  }

  async getUpcomingInterviews(): Promise<Interview[]> {
    // Get all scheduled interviews and filter in memory
    const scheduledInterviews = await db
      .select()
      .from(interviews)
      .where(eq(interviews.status, "scheduled"));
    
    // Filter for upcoming interviews
    const now = new Date();
    const upcomingInterviews = scheduledInterviews.filter(interview => {
      const interviewDate = new Date(interview.scheduledDate);
      return interviewDate > now;
    });
    
    return upcomingInterviews.map(i => ensureInterviewFields(i));
  }

  async createInterview(interviewData: InsertInterview): Promise<Interview> {
    const [interview] = await db.insert(interviews).values(interviewData).returning();
    return ensureInterviewFields(interview);
  }

  async updateInterview(id: number, interviewData: Partial<Interview>): Promise<Interview | undefined> {
    const [updatedInterview] = await db
      .update(interviews)
      .set(interviewData)
      .where(eq(interviews.id, id))
      .returning();
    return updatedInterview ? ensureInterviewFields(updatedInterview) : undefined;
  }

  // Job Opening methods
  async getJobOpening(id: number): Promise<JobOpening | undefined> {
    const [jobOpening] = await db.select().from(jobOpenings).where(eq(jobOpenings.id, id));
    return jobOpening ? ensureJobOpeningFields(jobOpening) : undefined;
  }

  async getJobOpenings(): Promise<JobOpening[]> {
    const allJobOpenings = await db.select().from(jobOpenings);
    return allJobOpenings.map(jo => ensureJobOpeningFields(jo));
  }

  async getActiveJobOpenings(): Promise<JobOpening[]> {
    const activeJobOpenings = await db.select().from(jobOpenings).where(eq(jobOpenings.isActive, true));
    return activeJobOpenings.map(jo => ensureJobOpeningFields(jo));
  }

  async createJobOpening(jobOpeningData: InsertJobOpening): Promise<JobOpening> {
    const [jobOpening] = await db.insert(jobOpenings).values(jobOpeningData).returning();
    return ensureJobOpeningFields(jobOpening);
  }

  async updateJobOpening(id: number, jobOpeningData: Partial<JobOpening>): Promise<JobOpening | undefined> {
    const [updatedJobOpening] = await db
      .update(jobOpenings)
      .set(jobOpeningData)
      .where(eq(jobOpenings.id, id))
      .returning();
    return updatedJobOpening ? ensureJobOpeningFields(updatedJobOpening) : undefined;
  }

  // Job Application methods
  async getJobApplication(id: number): Promise<JobApplication | undefined> {
    const [jobApplication] = await db.select().from(jobApplications).where(eq(jobApplications.id, id));
    return jobApplication ? ensureJobApplicationFields(jobApplication) : undefined;
  }

  async getJobApplications(): Promise<JobApplication[]> {
    const allApplications = await db.select().from(jobApplications);
    return allApplications.map(app => ensureJobApplicationFields(app));
  }

  async getJobApplicationsByJobOpening(jobOpeningId: number): Promise<JobApplication[]> {
    const openingApplications = await db.select().from(jobApplications).where(eq(jobApplications.jobOpeningId, jobOpeningId));
    return openingApplications.map(app => ensureJobApplicationFields(app));
  }

  async getJobApplicationsByStatus(status: string): Promise<JobApplication[]> {
    // Get all applications and filter in memory
    const allApplications = await db.select().from(jobApplications);
    const filteredApplications = allApplications.filter(app => app.status === status);
    return filteredApplications.map(app => ensureJobApplicationFields(app));
  }

  async createJobApplication(jobApplicationData: InsertJobApplication): Promise<JobApplication> {
    const [jobApplication] = await db.insert(jobApplications).values(jobApplicationData).returning();
    return ensureJobApplicationFields(jobApplication);
  }

  async updateJobApplication(id: number, jobApplicationData: Partial<JobApplication>): Promise<JobApplication | undefined> {
    const [updatedJobApplication] = await db
      .update(jobApplications)
      .set(jobApplicationData)
      .where(eq(jobApplications.id, id))
      .returning();
    return updatedJobApplication ? ensureJobApplicationFields(updatedJobApplication) : undefined;
  }

  // Job Request methods
  async getJobRequest(id: number): Promise<JobRequest | undefined> {
    const [jobRequest] = await db.select().from(jobRequests).where(eq(jobRequests.id, id));
    return jobRequest ? ensureJobRequestFields(jobRequest) : undefined;
  }

  async getJobRequests(): Promise<JobRequest[]> {
    const allJobRequests = await db.select().from(jobRequests);
    return allJobRequests.map(jr => ensureJobRequestFields(jr));
  }

  async getJobRequestsByClient(clientId: number): Promise<JobRequest[]> {
    const clientJobRequests = await db.select().from(jobRequests).where(eq(jobRequests.clientId, clientId));
    return clientJobRequests.map(jr => ensureJobRequestFields(jr));
  }

  async getJobRequestsByStatus(status: string): Promise<JobRequest[]> {
    // Get all job requests and filter in memory
    const allJobRequests = await db.select().from(jobRequests);
    const filteredJobRequests = allJobRequests.filter(jr => jr.status === status);
    return filteredJobRequests.map(jr => ensureJobRequestFields(jr));
  }

  async createJobRequest(jobRequestData: InsertJobRequest): Promise<JobRequest> {
    const [jobRequest] = await db.insert(jobRequests).values(jobRequestData).returning();
    return ensureJobRequestFields(jobRequest);
  }

  async updateJobRequest(id: number, jobRequestData: Partial<JobRequest>): Promise<JobRequest | undefined> {
    const [updatedJobRequest] = await db
      .update(jobRequests)
      .set(jobRequestData)
      .where(eq(jobRequests.id, id))
      .returning();
    return updatedJobRequest ? ensureJobRequestFields(updatedJobRequest) : undefined;
  }

  async approveJobRequest(id: number, notes?: string): Promise<JobRequest | undefined> {
    const [updatedJobRequest] = await db
      .update(jobRequests)
      .set({
        status: "approved",
        notes: notes || null,
        updatedAt: new Date()
      })
      .where(eq(jobRequests.id, id))
      .returning();
    return updatedJobRequest ? ensureJobRequestFields(updatedJobRequest) : undefined;
  }

  async rejectJobRequest(id: number, notes?: string): Promise<JobRequest | undefined> {
    const [updatedJobRequest] = await db
      .update(jobRequests)
      .set({
        status: "rejected",
        notes: notes || null,
        updatedAt: new Date()
      })
      .where(eq(jobRequests.id, id))
      .returning();
    return updatedJobRequest ? ensureJobRequestFields(updatedJobRequest) : undefined;
  }

  async publishJobRequest(id: number): Promise<JobOpening | undefined> {
    // Get the job request
    const [jobRequest] = await db.select().from(jobRequests).where(eq(jobRequests.id, id));
    
    if (!jobRequest) {
      return undefined;
    }
    
    // Create a job opening based on the job request
    const jobOpeningData: InsertJobOpening = {
      title: jobRequest.title,
      description: jobRequest.description,
      requirements: jobRequest.requirements,
      location: jobRequest.location,
      jobType: jobRequest.jobType,
      salary: jobRequest.salary,
      isActive: true,
      clientId: jobRequest.clientId,
      companyId: jobRequest.companyId
    };
    
    // Insert the job opening
    const [jobOpening] = await db.insert(jobOpenings).values(jobOpeningData).returning();
    
    // Update the job request to published
    await db
      .update(jobRequests)
      .set({
        status: "published",
        updatedAt: new Date()
      })
      .where(eq(jobRequests.id, id));
    
    return ensureJobOpeningFields(jobOpening);
  }
}

// Helper function for interview fields
function ensureInterviewFields(interviewData: any): Interview {
  // Convert ISO date string to Date object if it's a string
  const scheduledDate = typeof interviewData.scheduledDate === 'string' 
    ? new Date(interviewData.scheduledDate) 
    : interviewData.scheduledDate;
    
  return {
    id: interviewData.id,
    prospectId: interviewData.prospectId,
    title: interviewData.title,
    scheduledDate: scheduledDate,
    duration: interviewData.duration,
    meetingLink: interviewData.meetingLink || null,
    interviewerIds: interviewData.interviewerIds || [],
    notes: interviewData.notes || null,
    status: interviewData.status || "scheduled",
    createdAt: interviewData.createdAt
  };
}

// Helper functions for job openings and applications
function ensureJobOpeningFields(jobOpeningData: any): JobOpening {
  return {
    id: jobOpeningData.id,
    title: jobOpeningData.title,
    description: jobOpeningData.description,
    requirements: jobOpeningData.requirements,
    location: jobOpeningData.location,
    jobType: jobOpeningData.jobType,
    salary: jobOpeningData.salary || null,
    isActive: jobOpeningData.isActive !== undefined ? jobOpeningData.isActive : true,
    clientId: jobOpeningData.clientId || null,
    companyId: jobOpeningData.companyId || null,
    createdAt: jobOpeningData.createdAt
  };
}

function ensureJobApplicationFields(jobApplicationData: any): JobApplication {
  return {
    id: jobApplicationData.id,
    jobOpeningId: jobApplicationData.jobOpeningId,
    firstName: jobApplicationData.firstName,
    lastName: jobApplicationData.lastName,
    email: jobApplicationData.email,
    phone: jobApplicationData.phone,
    resumeUrl: jobApplicationData.resumeUrl || null,
    voiceMessageUrl: jobApplicationData.voiceMessageUrl || null,
    coverLetter: jobApplicationData.coverLetter || null,
    status: jobApplicationData.status || "new",
    notes: jobApplicationData.notes || null,
    createdAt: jobApplicationData.createdAt
  };
}

function ensureJobRequestFields(jobRequestData: any): JobRequest {
  return {
    id: jobRequestData.id,
    clientId: jobRequestData.clientId,
    companyId: jobRequestData.companyId,
    clientName: jobRequestData.clientName || null,
    companyName: jobRequestData.companyName || null,
    title: jobRequestData.title,
    description: jobRequestData.description,
    requirements: jobRequestData.requirements,
    location: jobRequestData.location,
    jobType: jobRequestData.jobType,
    salary: jobRequestData.salary || null,
    status: jobRequestData.status || "pending",
    notes: jobRequestData.notes || null,
    createdAt: jobRequestData.createdAt,
    updatedAt: jobRequestData.updatedAt || jobRequestData.createdAt
  };
}

export class MemStorage implements IStorage {
  // Storage maps
  private usersMap: Map<number, User>;
  private clientsMap: Map<number, Client>;
  private companiesMap: Map<number, Company>;
  private prospectsMap: Map<number, Prospect>;
  private heroesMap: Map<number, Hero>;
  private contractsMap: Map<number, Contract>;
  private invoicesMap: Map<number, Invoice>;
  private interviewsMap: Map<number, Interview>;
  private jobOpeningsMap: Map<number, JobOpening>;
  private jobApplicationsMap: Map<number, JobApplication>;
  private jobRequestsMap: Map<number, JobRequest>;
  private rolesMap: Map<number, Role>;
  
  // Auto-increment counters
  private userIdCounter: number;
  private clientIdCounter: number;
  private companyIdCounter: number;
  private prospectIdCounter: number;
  private heroIdCounter: number;
  private contractIdCounter: number;
  private invoiceIdCounter: number;
  private invoiceNumberCounter: number;
  private interviewIdCounter: number;
  private jobOpeningIdCounter: number;
  private jobApplicationIdCounter: number;
  private jobRequestIdCounter: number;
  private roleIdCounter: number;
  
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
    this.interviewsMap = new Map();
    this.jobOpeningsMap = new Map();
    this.jobApplicationsMap = new Map();
    this.jobRequestsMap = new Map();
    this.rolesMap = new Map();
    
    // Initialize counters
    this.userIdCounter = 1;
    this.clientIdCounter = 1;
    this.companyIdCounter = 1;
    this.prospectIdCounter = 1;
    this.heroIdCounter = 1;
    this.contractIdCounter = 1;
    this.invoiceIdCounter = 1;
    this.invoiceNumberCounter = 10001;
    this.interviewIdCounter = 1;
    this.jobOpeningIdCounter = 1;
    this.jobApplicationIdCounter = 1;
    this.jobRequestIdCounter = 1;
    this.roleIdCounter = 1;
    
    // Initialize session store with memory store
    this.sessionStore = new MemoryStore({
      checkPeriod: 86400000 // 24 hours
    });
    
    // Initialize with mock data
    this.initializeMockData();
  }
  
  private async initializeMockData() {
    // Create a Super Admin role
    await this.createRole({
      name: "super_admin",
      description: "Super Administrator with access to all features",
      permissions: ["dashboard", "prospects", "interviews", "heroes", "hero_detail", "companies", 
                   "company_detail", "contracts", "invoices", "user_management", "job_management", 
                   "settings", "role_management", "client_dashboard", "hero_dashboard", "prospect_dashboard"]
    });
    
    // Create an admin user
    await this.createUser({
      username: "admin@remotehero.com",
      password: "password123",
      email: "admin@remotehero.com",
      firstName: "Admin",
      lastName: "User",
      role: "admin"
    });
    
    // Add mock clients
    const clients = [
      {
        name: "Acme Corporation",
        contactPerson: "John Smith",
        email: "john@acme.com",
        phone: "+1 (555) 123-4567",
        status: "active",
      },
      {
        name: "Globex Industries",
        contactPerson: "Jane Doe",
        email: "jane@globex.com",
        phone: "+1 (555) 987-6543",
        status: "active",
      },
      {
        name: "Stark Enterprises",
        contactPerson: "Tony Stark",
        email: "tony@stark.com",
        phone: "+1 (555) 111-2222",
        status: "active",
      },
      {
        name: "Wayne Industries",
        contactPerson: "Bruce Wayne",
        email: "bruce@wayne.com",
        phone: "+1 (555) 333-4444",
        status: "inactive",
      },
      {
        name: "Umbrella Corp",
        contactPerson: "Albert Wesker",
        email: "wesker@umbrella.com",
        phone: "+1 (555) 666-7777",
        status: "active",
      }
    ];

    for (const client of clients) {
      await this.createClient(client as InsertClient);
    }

    // Add mock companies for each client
    const companies = [
      {
        name: "Acme Software",
        clientId: 1,
        industry: "Technology",
        size: "Large",
        location: "New York",
      },
      {
        name: "Acme Hardware",
        clientId: 1,
        industry: "Manufacturing",
        size: "Medium",
        location: "Chicago",
      },
      {
        name: "Globex Tech",
        clientId: 2,
        industry: "Technology",
        size: "Large",
        location: "San Francisco",
      },
      {
        name: "Stark Innovations",
        clientId: 3,
        industry: "R&D",
        size: "Large",
        location: "Los Angeles",
      },
      {
        name: "Stark Energy",
        clientId: 3,
        industry: "Energy",
        size: "Medium",
        location: "Houston",
      },
      {
        name: "Wayne Biotech",
        clientId: 4,
        industry: "Healthcare",
        size: "Medium",
        location: "Gotham City",
      },
      {
        name: "Umbrella Pharmaceuticals",
        clientId: 5,
        industry: "Pharmaceuticals",
        size: "Large",
        location: "Raccoon City",
      }
    ];

    for (const company of companies) {
      await this.createCompany(company as InsertCompany);
    }

    // Add mock prospects
    const prospects = [
      {
        firstName: "Michael",
        lastName: "Johnson",
        email: "michael@example.com",
        phone: "+1 (555) 111-2233",
        position: "Senior Developer",
        skills: "JavaScript, React, Node.js",
        status: "sourcing",
        clientId: 1,
        companyId: 1,
      },
      {
        firstName: "Sarah",
        lastName: "Williams",
        email: "sarah@example.com",
        phone: "+1 (555) 444-5566",
        position: "UI/UX Designer",
        skills: "Figma, Adobe XD, UI Design",
        status: "interview",
        clientId: 1,
        companyId: 1,
      },
      {
        firstName: "David",
        lastName: "Brown",
        email: "david@example.com",
        phone: "+1 (555) 777-8899",
        position: "DevOps Engineer",
        skills: "AWS, Docker, Kubernetes",
        status: "client_review",
        clientId: 2,
        companyId: 3,
      },
      {
        firstName: "Emily",
        lastName: "Jones",
        email: "emily@example.com",
        phone: "+1 (555) 222-3333",
        position: "Data Scientist",
        skills: "Python, R, Machine Learning",
        status: "budget",
        clientId: 3,
        companyId: 4,
      },
      {
        firstName: "James",
        lastName: "Wilson",
        email: "james@example.com",
        phone: "+1 (555) 555-6666",
        position: "Product Manager",
        skills: "Agile, Scrum, Product Strategy",
        status: "contract",
        clientId: 3,
        companyId: 5,
      },
      {
        firstName: "Alexandra",
        lastName: "Garcia",
        email: "alex@example.com",
        phone: "+1 (555) 888-9999",
        position: "Backend Developer",
        skills: "Java, Spring, Microservices",
        status: "hired",
        clientId: 5,
        companyId: 7,
      },
      {
        firstName: "Robert",
        lastName: "Miller",
        email: "robert@example.com",
        phone: "+1 (555) 333-4444",
        position: "Network Engineer",
        skills: "Cisco, Networking, Security",
        status: "rejected",
        clientId: 4,
        companyId: 6,
      },
      {
        firstName: "Jennifer",
        lastName: "Davis",
        email: "jennifer@example.com",
        phone: "+1 (555) 999-0000",
        position: "Frontend Developer",
        skills: "HTML, CSS, JavaScript, React",
        status: "sourcing",
        clientId: 2,
        companyId: 3,
      },
      {
        firstName: "Thomas",
        lastName: "Taylor",
        email: "thomas@example.com",
        phone: "+1 (555) 123-3456",
        position: "Cloud Architect",
        skills: "AWS, Azure, GCP, Infrastructure",
        status: "interview",
        clientId: 1,
        companyId: 2,
      },
      {
        firstName: "Lisa",
        lastName: "Anderson",
        email: "lisa@example.com",
        phone: "+1 (555) 456-7890",
        position: "iOS Developer",
        skills: "Swift, Objective-C, iOS SDK",
        status: "client_review",
        clientId: 5,
        companyId: 7,
      }
    ];

    for (const prospect of prospects) {
      await this.createProspect(prospect as InsertProspect);
    }

    // Define the contract templates for later creation
    const contractTemplates = [
      {
        title: "Development Contract",
        clientId: 5,
        companyId: 7,
        startDate: new Date("2023-11-01"),
        endDate: new Date("2024-11-01"),
        compensation: 120000,
        companyPayment: 156000, // 130% of compensation
        profit: 36000, // 30% profit margin
        status: "active",
        document: "contract_1.pdf",
      },
      {
        title: "Senior Backend Developer",
        clientId: 4,
        companyId: 6,
        startDate: new Date("2023-08-15"),
        endDate: new Date("2024-08-15"),
        compensation: 140000,
        companyPayment: 182000, // 130% of compensation
        profit: 42000, // 30% profit margin
        status: "active",
        document: "contract_2.pdf",
      },
      {
        title: "Frontend Engineer Contract",
        clientId: 1,
        companyId: 1,
        startDate: new Date("2023-12-01"),
        endDate: new Date("2024-12-01"),
        compensation: 110000,
        companyPayment: 143000, // 130% of compensation
        profit: 33000, // 30% profit margin
        status: "active",
        document: "contract_3.pdf",
      },
      {
        title: "Data Scientist Agreement",
        clientId: 2,
        companyId: 3,
        startDate: new Date("2023-10-01"),
        endDate: new Date("2024-10-01"),
        compensation: 130000,
        companyPayment: 169000, // 130% of compensation
        profit: 39000, // 30% profit margin
        status: "active",
        document: "contract_4.pdf",
      },
      {
        title: "DevOps Specialist",
        clientId: 3,
        companyId: 4,
        startDate: new Date("2023-09-15"),
        endDate: new Date("2024-09-15"),
        compensation: 135000,
        companyPayment: 175500, // 130% of compensation
        profit: 40500, // 30% profit margin
        status: "active",
        document: "contract_5.pdf",
      },
      {
        title: "Mobile Developer Contract",
        clientId: 5,
        companyId: 7,
        startDate: new Date("2023-11-01"),
        endDate: new Date("2024-11-01"),
        compensation: 125000,
        companyPayment: 162500, // 130% of compensation
        profit: 37500, // 30% profit margin
        status: "active",
        document: "contract_6.pdf",
      },
      {
        title: "UX/UI Designer",
        clientId: 3,
        companyId: 5,
        startDate: new Date("2024-01-15"),
        endDate: new Date("2025-01-15"),
        compensation: 105000,
        companyPayment: 136500, // 130% of compensation
        profit: 31500, // 30% profit margin
        status: "active",
        document: "contract_7.pdf",
      },
      {
        title: "Product Manager Contract",
        clientId: 2,
        companyId: 3,
        startDate: new Date("2024-02-01"),
        endDate: new Date("2025-02-01"),
        compensation: 145000,
        companyPayment: 188500, // 130% of compensation
        profit: 43500, // 30% profit margin
        status: "active",
        document: "contract_8.pdf",
      }
    ];

    // Add mock heroes for hired prospects
    const heroes = [
      {
        prospectId: 6,
        startDate: new Date("2023-11-01"),
        clientId: 5,
        companyId: 7,
      },
      {
        prospectId: 5,
        startDate: new Date("2023-09-15"),
        clientId: 3,
        companyId: 4,
      },
      {
        prospectId: 4,
        startDate: new Date("2023-10-01"),
        clientId: 2,
        companyId: 3,
      },
      {
        prospectId: 3,
        startDate: new Date("2023-12-01"),
        clientId: 1,
        companyId: 1,
      },
      {
        prospectId: 2,
        startDate: new Date("2023-08-15"),
        clientId: 4,
        companyId: 6,
      },
      {
        prospectId: 1,
        startDate: new Date("2023-07-01"),
        clientId: 5,
        companyId: 7,
      },
      {
        prospectId: 7,
        startDate: new Date("2024-01-15"),
        clientId: 3,
        companyId: 5,
      },
      {
        prospectId: 8,
        startDate: new Date("2024-02-01"),
        clientId: 2,
        companyId: 3,
      }
    ];

    // Create heroes first
    const createdHeroes = [];
    for (const hero of heroes) {
      const createdHero = await this.createHero(hero as InsertHero);
      createdHeroes.push(createdHero);
    }

    // Add mock interviews with correct structure based on schema
    const interviews = [
      {
        prospectId: 1,
        title: "Technical Interview - React Skills",
        scheduledDate: new Date("2023-06-15T10:00:00"),
        duration: 60,
        status: "completed",
        notes: "Excellent technical skills. Strong understanding of React and Node.js.",
        meetingLink: "https://meet.google.com/abc-defg-hij",
        interviewerIds: ["1"]
      },
      {
        prospectId: 2,
        title: "Behavioral Interview",
        scheduledDate: new Date("2023-07-20T14:00:00"),
        duration: 45,
        status: "completed",
        notes: "Good communication skills. Showed leadership qualities.",
        meetingLink: "https://meet.google.com/klm-nopq-rst",
        interviewerIds: ["1"]
      },
      {
        prospectId: 3,
        title: "Technical Interview - Database Skills",
        scheduledDate: new Date("2023-11-10T11:00:00"),
        duration: 60,
        status: "completed",
        notes: "Solid understanding of database concepts and SQL.",
        meetingLink: "https://meet.google.com/uvw-xyz-123",
        interviewerIds: ["1"]
      },
      {
        prospectId: 4,
        title: "Technical Interview - Frontend Skills",
        scheduledDate: new Date("2023-09-05T15:30:00"),
        duration: 60,
        status: "completed",
        notes: "Strong in frontend development. Good understanding of CSS and responsive design.",
        meetingLink: "https://meet.google.com/456-789-abc",
        interviewerIds: ["1"]
      },
      {
        prospectId: 5,
        title: "Behavioral Assessment",
        scheduledDate: new Date("2023-08-22T09:00:00"),
        duration: 45,
        status: "completed",
        notes: "Excellent problem-solving skills. Adapts well to challenging situations.",
        meetingLink: "https://meet.google.com/def-ghi-jkl",
        interviewerIds: ["1"]
      },
      {
        prospectId: 6,
        title: "Final Interview",
        scheduledDate: new Date("2023-10-18T13:30:00"),
        duration: 90,
        status: "completed",
        notes: "Great fit for the role. Ready to move forward with an offer.",
        meetingLink: "https://meet.google.com/mno-pqr-stu",
        interviewerIds: ["1"]
      },
      {
        prospectId: 7,
        title: "Technical Skills Assessment",
        scheduledDate: new Date("2024-01-05T10:00:00"),
        duration: 60,
        status: "completed",
        notes: "Strong in Python and data analysis. Could improve on web development skills.",
        meetingLink: "https://meet.google.com/vwx-yz1-234",
        interviewerIds: ["1"]
      },
      {
        prospectId: 8,
        title: "Technical Interview - Project Discussion",
        scheduledDate: new Date("2024-02-28T16:00:00"),
        duration: 60,
        status: "scheduled",
        notes: "",
        meetingLink: "https://meet.google.com/567-89a-bcd",
        interviewerIds: ["1"]
      }
    ];

    for (const interview of interviews) {
      await this.createInterview(interview as InsertInterview);
    }

    // Create contracts and assign to heroes
    for (let i = 0; i < contractTemplates.length && i < createdHeroes.length; i++) {
      // Create contract with hero ID
      const contract = {
        ...contractTemplates[i],
        heroId: createdHeroes[i].id
      };
      const createdContract = await this.createContract(contract as InsertContract);
      
      // Update hero with contract ID to establish the relationship
      await this.updateHero(createdHeroes[i].id, {
        contractId: createdContract.id
      });
    }

    // Add mock invoices
    const invoices = [
      {
        invoiceNumber: "INV-1001",
        contractId: 1,
        heroId: 1,
        clientId: 5,
        companyId: 7,
        amount: 10000,
        status: "paid",
        dueDate: new Date("2023-12-01"),
        paidDate: new Date("2023-11-28"),
      },
      {
        invoiceNumber: "INV-1002",
        contractId: 1,
        heroId: 1,
        clientId: 5,
        companyId: 7,
        amount: 10000,
        status: "pending",
        dueDate: new Date("2024-01-01"),
      },
      {
        invoiceNumber: "INV-1003",
        contractId: 2,
        heroId: 2,
        clientId: 4,
        companyId: 6,
        amount: 11667,
        status: "paid",
        dueDate: new Date("2023-09-15"),
        paidDate: new Date("2023-09-10"),
      },
      {
        invoiceNumber: "INV-1004",
        contractId: 2,
        heroId: 2,
        clientId: 4,
        companyId: 6,
        amount: 11667,
        status: "paid",
        dueDate: new Date("2023-10-15"),
        paidDate: new Date("2023-10-12"),
      },
      {
        invoiceNumber: "INV-1005",
        contractId: 3,
        heroId: 3,
        clientId: 1,
        companyId: 1,
        amount: 9167,
        status: "pending",
        dueDate: new Date("2024-01-01"),
      },
      {
        invoiceNumber: "INV-1006",
        contractId: 4,
        heroId: 4,
        clientId: 2,
        companyId: 3,
        amount: 10833,
        status: "paid",
        dueDate: new Date("2023-11-01"),
        paidDate: new Date("2023-10-29"),
      },
      {
        invoiceNumber: "INV-1007",
        contractId: 5,
        heroId: 5,
        clientId: 3,
        companyId: 4,
        amount: 11250,
        status: "overdue",
        dueDate: new Date("2023-12-15"),
      },
      {
        invoiceNumber: "INV-1008",
        contractId: 6,
        heroId: 6,
        clientId: 5,
        companyId: 7,
        amount: 10417,
        status: "pending",
        dueDate: new Date("2024-02-01"),
      }
    ];

    for (const invoice of invoices) {
      await this.createInvoice(invoice as InsertInvoice);
    }
    
    // Add mock job openings
    const jobOpenings = [
      {
        title: "Senior React Developer",
        description: "We're looking for a senior React developer with 5+ years of experience to join our team. You'll be working on cutting-edge projects for our clients.",
        requirements: "- 5+ years of experience with React\n- Strong TypeScript skills\n- Experience with state management libraries\n- Good understanding of web performance optimization",
        location: "Remote - US",
        jobType: "full_time",
        salary: "$120,000 - $150,000",
        isActive: true,
        clientId: 1,
        companyId: 1
      },
      {
        title: "DevOps Engineer",
        description: "Join our team as a DevOps Engineer and help us build and maintain our cloud infrastructure. You'll be responsible for automation, CI/CD pipelines, and more.",
        requirements: "- Experience with AWS or Azure\n- Knowledge of Docker and Kubernetes\n- Experience with CI/CD tools\n- Understanding of infrastructure as code",
        location: "New York, NY",
        jobType: "full_time",
        salary: "$130,000 - $160,000",
        isActive: true,
        clientId: 3,
        companyId: 4
      },
      {
        title: "UI/UX Designer",
        description: "We're seeking a talented UI/UX Designer to create beautiful and functional user interfaces for our web and mobile applications.",
        requirements: "- Portfolio demonstrating UI/UX work\n- Experience with Figma or Adobe XD\n- Understanding of user-centered design principles\n- Ability to create wireframes, prototypes, and high-fidelity designs",
        location: "Remote",
        jobType: "contract",
        salary: "$90,000 - $110,000",
        isActive: true,
        clientId: 2,
        companyId: 3
      },
      {
        title: "Frontend Developer",
        description: "Join our fast-growing tech team as a Frontend Developer. You'll be building responsive, accessible, and performant web applications.",
        requirements: "- 3+ years of experience with HTML, CSS, and JavaScript\n- Experience with a modern JavaScript framework (React, Vue, Angular)\n- Understanding of web accessibility standards\n- Experience with responsive design",
        location: "Chicago, IL",
        jobType: "full_time",
        salary: "$90,000 - $120,000",
        isActive: false,
        clientId: 5,
        companyId: 7
      },
      {
        title: "Data Scientist",
        description: "We are looking for a Data Scientist to analyze complex data sets and build predictive models to help our clients make data-driven decisions.",
        requirements: "- Experience with Python, R, or similar\n- Knowledge of machine learning algorithms\n- Experience with data visualization tools\n- Strong statistical background",
        location: "Boston, MA",
        jobType: "full_time",
        salary: "$110,000 - $140,000",
        isActive: true,
        clientId: 4,
        companyId: 6
      },
      {
        title: "Mobile App Developer",
        description: "Join our mobile development team to build innovative iOS and Android applications for our clients in various industries.",
        requirements: "- Experience with Swift or Kotlin\n- Knowledge of mobile app architecture\n- Understanding of UI/UX design principles for mobile\n- Experience with RESTful APIs",
        location: "San Francisco, CA",
        jobType: "full_time",
        salary: "$100,000 - $130,000",
        isActive: true,
        clientId: 1,
        companyId: 2
      },
      {
        title: "Backend Developer",
        description: "We're looking for a Backend Developer to design and implement server-side logic and maintain database systems.",
        requirements: "- Experience with Node.js, Python, or Java\n- Knowledge of database systems (SQL and NoSQL)\n- Understanding of RESTful API design\n- Experience with cloud services (AWS, GCP, or Azure)",
        location: "Remote",
        jobType: "contract",
        salary: "$95,000 - $125,000",
        isActive: true,
        clientId: 3,
        companyId: 5
      },
      {
        title: "Product Manager",
        description: "We're seeking an experienced Product Manager to lead the development of innovative digital products for our clients.",
        requirements: "- Experience in product management for digital products\n- Strong understanding of user-centered design\n- Excellent communication skills\n- Ability to translate business requirements into product features",
        location: "Austin, TX",
        jobType: "full_time",
        salary: "$110,000 - $150,000",
        isActive: true,
        clientId: 2,
        companyId: 3
      }
    ];
    
    for (const jobOpening of jobOpenings) {
      await this.createJobOpening(jobOpening as InsertJobOpening);
    }
    
    // Add mock job applications
    const jobApplications = [
      {
        jobOpeningId: 1,
        firstName: "John",
        lastName: "Doe",
        email: "john.doe@example.com",
        phone: "555-123-4567",
        resumeUrl: "https://example.com/resume/johndoe.pdf",
        coverLetter: "I am excited to apply for the Senior React Developer position. With over 6 years of experience in React development...",
        status: "in_review",
        notes: "Strong React experience. Scheduling technical interview.",
      },
      {
        jobOpeningId: 1,
        firstName: "Jane",
        lastName: "Smith",
        email: "jane.smith@example.com",
        phone: "555-987-6543",
        resumeUrl: "https://example.com/resume/janesmith.pdf",
        coverLetter: "As a senior developer with expertise in React and TypeScript, I am thrilled to apply for this role...",
        status: "interview",
        notes: "Passed initial screening. Technical interview scheduled for next week.",
      },
      {
        jobOpeningId: 2,
        firstName: "Michael",
        lastName: "Johnson",
        email: "michael.j@example.com",
        phone: "555-456-7890",
        resumeUrl: "https://example.com/resume/michaelj.pdf",
        coverLetter: "With my extensive experience in AWS and CI/CD pipelines, I believe I am a perfect fit for the DevOps Engineer position...",
        status: "new",
        notes: "",
      },
      {
        jobOpeningId: 3,
        firstName: "Emily",
        lastName: "Williams",
        email: "emily.w@example.com",
        phone: "555-234-5678",
        resumeUrl: "https://example.com/resume/emilyw.pdf",
        coverLetter: "I am applying for the UI/UX Designer position with great enthusiasm. My portfolio demonstrates my ability to create user-centered designs...",
        status: "hired",
        notes: "Excellent portfolio. Hired as contractor starting next month.",
      },
      {
        jobOpeningId: 4,
        firstName: "Daniel",
        lastName: "Brown",
        email: "daniel.b@example.com",
        phone: "555-876-5432",
        resumeUrl: "https://example.com/resume/danielb.pdf",
        coverLetter: "I am excited to apply for the Frontend Developer position. I have 4 years of experience with React and responsive design...",
        status: "rejected",
        notes: "Not enough experience with accessibility standards.",
      },
      {
        jobOpeningId: 5,
        firstName: "Sophia",
        lastName: "Miller",
        email: "sophia.m@example.com",
        phone: "555-345-6789",
        resumeUrl: "https://example.com/resume/sophiam.pdf",
        coverLetter: "As a Data Scientist with a strong background in machine learning and statistics, I am excited to apply for this role...",
        status: "offered",
        notes: "Strong technical skills. Offer being prepared.",
      },
      {
        jobOpeningId: 6,
        firstName: "Matthew",
        lastName: "Taylor",
        email: "matthew.t@example.com",
        phone: "555-654-3210",
        resumeUrl: "https://example.com/resume/matthewt.pdf",
        coverLetter: "I am applying for the Mobile App Developer position with 5 years of experience developing iOS applications...",
        status: "interview",
        notes: "Good initial interview. Moving to technical assessment.",
      },
      {
        jobOpeningId: 7,
        firstName: "Olivia",
        lastName: "Anderson",
        email: "olivia.a@example.com",
        phone: "555-789-0123",
        resumeUrl: "https://example.com/resume/oliviaa.pdf",
        coverLetter: "I am excited to apply for the Backend Developer position. With my experience in Node.js and database management...",
        status: "new",
        notes: "Recently applied. Need to review resume.",
      }
    ];
    
    for (const jobApplication of jobApplications) {
      await this.createJobApplication(jobApplication as InsertJobApplication);
    }
    
    // Add mock job requests
    const jobRequests = [
      {
        clientId: 1,
        companyId: 1,
        clientName: "Acme Corporation",
        companyName: "Acme Software",
        title: "Full Stack Developer",
        description: "We're looking for a full stack developer to join our team to work on our customer-facing web applications.",
        requirements: "- Experience with React and Node.js\n- Familiarity with SQL databases\n- Understanding of RESTful API design\n- Experience with Git version control",
        location: "Remote",
        jobType: "full_time",
        salary: "$100,000 - $130,000",
        status: "pending",
        notes: ""
      },
      {
        clientId: 2,
        companyId: 3,
        clientName: "TechCorp Inc.",
        companyName: "TechCorp Software",
        title: "Machine Learning Engineer",
        description: "Join our AI team to develop machine learning models for our prediction engine.",
        requirements: "- Experience with Python and machine learning libraries\n- Understanding of neural networks\n- Experience with data preprocessing\n- Knowledge of model deployment",
        location: "San Francisco, CA",
        jobType: "full_time",
        salary: "$120,000 - $150,000",
        status: "approved",
        notes: "Strong requirement. Approved for publishing."
      },
      {
        clientId: 3,
        companyId: 4,
        clientName: "Global Solutions",
        companyName: "Global Tech",
        title: "Security Engineer",
        description: "We need a security engineer to help maintain and enhance our cybersecurity infrastructure.",
        requirements: "- Experience with network security\n- Knowledge of security protocols\n- Experience with security auditing\n- Familiarity with compliance requirements",
        location: "New York, NY",
        jobType: "full_time",
        salary: "$110,000 - $140,000",
        status: "published",
        notes: "Position published on careers page."
      },
      {
        clientId: 4,
        companyId: 6,
        clientName: "Innovative Systems",
        companyName: "Innovative Tech",
        title: "Cloud Architect",
        description: "Looking for a cloud architect to design and implement our cloud infrastructure strategy.",
        requirements: "- Experience with AWS or Azure\n- Knowledge of infrastructure as code\n- Experience with containerization\n- Understanding of cloud security best practices",
        location: "Chicago, IL",
        jobType: "full_time",
        salary: "$130,000 - $160,000",
        status: "rejected",
        notes: "Requirements need to be more specific."
      },
      {
        clientId: 5,
        companyId: 7,
        clientName: "Digital Solutions",
        companyName: "Digital Innovations",
        title: "Quality Assurance Engineer",
        description: "Join our QA team to ensure the quality of our software products.",
        requirements: "- Experience with test automation\n- Knowledge of testing methodologies\n- Experience with bug tracking systems\n- Understanding of CI/CD pipelines",
        location: "Remote",
        jobType: "full_time",
        salary: "$90,000 - $110,000",
        status: "pending",
        notes: ""
      },
      {
        clientId: 1,
        companyId: 2,
        clientName: "Acme Corporation",
        companyName: "Acme Mobile",
        title: "iOS Developer",
        description: "We're seeking an iOS developer to create and maintain our mobile applications.",
        requirements: "- Experience with Swift and iOS SDK\n- Knowledge of iOS design guidelines\n- Experience with third-party libraries\n- Understanding of app submission process",
        location: "Boston, MA",
        jobType: "full_time",
        salary: "$100,000 - $130,000",
        status: "approved",
        notes: "Ready to be published."
      },
      {
        clientId: 3,
        companyId: 5,
        clientName: "Global Solutions",
        companyName: "Global AI",
        title: "Data Engineer",
        description: "Join our data team to build and maintain our data pipelines.",
        requirements: "- Experience with ETL processes\n- Knowledge of data warehousing\n- Experience with big data technologies\n- Understanding of data modeling",
        location: "Austin, TX",
        jobType: "contract",
        salary: "$95,000 - $125,000",
        status: "pending",
        notes: ""
      },
      {
        clientId: 2,
        companyId: 3,
        clientName: "TechCorp Inc.",
        companyName: "TechCorp Software",
        title: "Product Owner",
        description: "We're looking for a product owner to guide the development of our software products.",
        requirements: "- Experience with agile methodologies\n- Strong communication skills\n- Experience with product roadmapping\n- Understanding of user-centered design",
        location: "Remote",
        jobType: "full_time",
        salary: "$100,000 - $140,000",
        status: "published",
        notes: "Position published on careers page."
      }
    ];
    
    for (const jobRequest of jobRequests) {
      await this.createJobRequest(jobRequest as InsertJobRequest);
    }
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
  
  // Role methods
  async getRole(id: number): Promise<Role | undefined> {
    return this.rolesMap.get(id);
  }
  
  async getRoleByName(name: string): Promise<Role | undefined> {
    // Find role by name in memory
    for (const role of this.rolesMap.values()) {
      if (role.name === name) {
        return role;
      }
    }
    return undefined;
  }

  async getRoles(): Promise<Role[]> {
    return Array.from(this.rolesMap.values());
  }

  async createRole(roleData: InsertRole): Promise<Role> {
    const id = this.roleIdCounter++;
    const now = new Date();
    
    const role: Role = {
      id,
      name: roleData.name,
      description: roleData.description || null,
      permissions: roleData.permissions,
      createdAt: now
    };
    
    this.rolesMap.set(id, role);
    return role;
  }

  async updateRole(id: number, roleData: Partial<Role>): Promise<Role | undefined> {
    const role = this.rolesMap.get(id);
    
    if (!role) {
      return undefined;
    }
    
    const updatedRole: Role = {
      ...role,
      ...roleData
    };
    
    this.rolesMap.set(id, updatedRole);
    return updatedRole;
  }

  async deleteRole(id: number): Promise<boolean> {
    return this.rolesMap.delete(id);
  }
  
  // Client methods
  async getClient(id: number): Promise<Client | undefined> {
    return this.clientsMap.get(id);
  }
  
  async getClientByEmail(email: string): Promise<Client | undefined> {
    const allClients = Array.from(this.clientsMap.values());
    return allClients.find(client => client.email === email);
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
  
  // Interview methods
  async getInterview(id: number): Promise<Interview | undefined> {
    return this.interviewsMap.get(id);
  }
  
  async getInterviews(): Promise<Interview[]> {
    return Array.from(this.interviewsMap.values());
  }
  
  async getInterviewsByProspect(prospectId: number): Promise<Interview[]> {
    return Array.from(this.interviewsMap.values()).filter(
      (interview) => interview.prospectId === prospectId
    );
  }
  
  async getUpcomingInterviews(): Promise<Interview[]> {
    const now = new Date();
    return Array.from(this.interviewsMap.values()).filter(
      (interview) => interview.scheduledDate > now && interview.status === "scheduled"
    );
  }
  
  async createInterview(interviewData: InsertInterview): Promise<Interview> {
    const id = this.interviewIdCounter++;
    const createdAt = new Date();
    const interview = ensureInterviewFields({ id, ...interviewData, createdAt });
    this.interviewsMap.set(id, interview);
    
    // Update prospect to mark as interviewed
    if (interviewData.prospectId) {
      const prospect = await this.getProspect(interviewData.prospectId);
      if (prospect) {
        await this.updateProspect(prospect.id, { isInterviewed: true });
      }
    }
    
    return interview;
  }
  
  async updateInterview(id: number, interviewData: Partial<Interview>): Promise<Interview | undefined> {
    const interview = await this.getInterview(id);
    if (!interview) return undefined;
    
    const updatedInterview = ensureInterviewFields({ ...interview, ...interviewData });
    this.interviewsMap.set(id, updatedInterview);
    return updatedInterview;
  }

  // Job Opening methods
  async getJobOpening(id: number): Promise<JobOpening | undefined> {
    return this.jobOpeningsMap.get(id);
  }
  
  async getJobOpenings(): Promise<JobOpening[]> {
    return Array.from(this.jobOpeningsMap.values());
  }
  
  async getActiveJobOpenings(): Promise<JobOpening[]> {
    return Array.from(this.jobOpeningsMap.values()).filter(
      (jobOpening) => jobOpening.isActive
    );
  }
  
  async createJobOpening(jobOpeningData: InsertJobOpening): Promise<JobOpening> {
    const id = this.jobOpeningIdCounter++;
    const createdAt = new Date();
    const jobOpening = ensureJobOpeningFields({ id, ...jobOpeningData, createdAt });
    this.jobOpeningsMap.set(id, jobOpening);
    return jobOpening;
  }
  
  async updateJobOpening(id: number, jobOpeningData: Partial<JobOpening>): Promise<JobOpening | undefined> {
    const jobOpening = await this.getJobOpening(id);
    if (!jobOpening) return undefined;
    
    const updatedJobOpening = ensureJobOpeningFields({ ...jobOpening, ...jobOpeningData });
    this.jobOpeningsMap.set(id, updatedJobOpening);
    return updatedJobOpening;
  }
  
  // Job Application methods
  async getJobApplication(id: number): Promise<JobApplication | undefined> {
    return this.jobApplicationsMap.get(id);
  }
  
  async getJobApplications(): Promise<JobApplication[]> {
    return Array.from(this.jobApplicationsMap.values());
  }
  
  async getJobApplicationsByJobOpening(jobOpeningId: number): Promise<JobApplication[]> {
    return Array.from(this.jobApplicationsMap.values()).filter(
      (jobApplication) => jobApplication.jobOpeningId === jobOpeningId
    );
  }
  
  async getJobApplicationsByStatus(status: string): Promise<JobApplication[]> {
    return Array.from(this.jobApplicationsMap.values()).filter(
      (jobApplication) => jobApplication.status === status
    );
  }
  
  async createJobApplication(jobApplicationData: InsertJobApplication): Promise<JobApplication> {
    const id = this.jobApplicationIdCounter++;
    const createdAt = new Date();
    const jobApplication = ensureJobApplicationFields({ id, ...jobApplicationData, createdAt });
    this.jobApplicationsMap.set(id, jobApplication);
    
    return jobApplication;
  }
  
  async updateJobApplication(id: number, jobApplicationData: Partial<JobApplication>): Promise<JobApplication | undefined> {
    const jobApplication = await this.getJobApplication(id);
    if (!jobApplication) return undefined;
    
    const updatedJobApplication = ensureJobApplicationFields({ ...jobApplication, ...jobApplicationData });
    this.jobApplicationsMap.set(id, updatedJobApplication);
    return updatedJobApplication;
  }
  
  // Job Request methods
  async getJobRequest(id: number): Promise<JobRequest | undefined> {
    return this.jobRequestsMap.get(id);
  }
  
  async getJobRequests(): Promise<JobRequest[]> {
    return Array.from(this.jobRequestsMap.values());
  }
  
  async getJobRequestsByClient(clientId: number): Promise<JobRequest[]> {
    return Array.from(this.jobRequestsMap.values()).filter(
      (request) => request.clientId === clientId
    );
  }
  
  async getJobRequestsByStatus(status: string): Promise<JobRequest[]> {
    return Array.from(this.jobRequestsMap.values()).filter(
      (request) => request.status === status
    );
  }
  
  async createJobRequest(jobRequestData: InsertJobRequest): Promise<JobRequest> {
    const id = this.jobRequestIdCounter++;
    const createdAt = new Date();
    const updatedAt = createdAt;
    const jobRequest = ensureJobRequestFields({ 
      id, 
      ...jobRequestData, 
      createdAt,
      updatedAt,
      status: "pending" // Default status for new job requests
    });
    this.jobRequestsMap.set(id, jobRequest);
    return jobRequest;
  }
  
  async updateJobRequest(id: number, jobRequestData: Partial<JobRequest>): Promise<JobRequest | undefined> {
    const jobRequest = await this.getJobRequest(id);
    if (!jobRequest) return undefined;
    
    const updatedAt = new Date();
    const updatedJobRequest = ensureJobRequestFields({ 
      ...jobRequest, 
      ...jobRequestData,
      updatedAt 
    });
    this.jobRequestsMap.set(id, updatedJobRequest);
    return updatedJobRequest;
  }
  
  async approveJobRequest(id: number, notes?: string): Promise<JobRequest | undefined> {
    const jobRequest = await this.getJobRequest(id);
    if (!jobRequest) return undefined;
    
    const updatedAt = new Date();
    const updatedJobRequest = ensureJobRequestFields({
      ...jobRequest,
      status: "approved",
      notes: notes || jobRequest.notes,
      updatedAt
    });
    this.jobRequestsMap.set(id, updatedJobRequest);
    return updatedJobRequest;
  }
  
  async rejectJobRequest(id: number, notes?: string): Promise<JobRequest | undefined> {
    const jobRequest = await this.getJobRequest(id);
    if (!jobRequest) return undefined;
    
    const updatedAt = new Date();
    const updatedJobRequest = ensureJobRequestFields({
      ...jobRequest,
      status: "rejected",
      notes: notes || jobRequest.notes,
      updatedAt
    });
    this.jobRequestsMap.set(id, updatedJobRequest);
    return updatedJobRequest;
  }
  
  async publishJobRequest(id: number): Promise<JobOpening | undefined> {
    const jobRequest = await this.getJobRequest(id);
    if (!jobRequest || jobRequest.status !== "approved") return undefined;
    
    // Create a job opening from the approved request
    const jobOpeningData: InsertJobOpening = {
      title: jobRequest.title,
      description: jobRequest.description,
      requirements: jobRequest.requirements,
      location: jobRequest.location,
      jobType: jobRequest.jobType,
      salary: jobRequest.salary,
      isActive: true,
      clientId: jobRequest.clientId,
      companyId: jobRequest.companyId
    };
    
    // Create the job opening
    const jobOpening = await this.createJobOpening(jobOpeningData);
    
    // Update the job request status to 'published'
    await this.updateJobRequest(id, { 
      status: "published",
      updatedAt: new Date()
    });
    
    return jobOpening;
  }
}

export const storage = new DatabaseStorage();
