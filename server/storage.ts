import { 
  users, type User, type InsertUser,
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

/* We'll implement the PostgreSQL storage in the future.
export class PgStorage implements IStorage {
  // Session store and implementation will go here
} */

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
    
    // Initialize session store with memory store
    this.sessionStore = new MemoryStore({
      checkPeriod: 86400000 // 24 hours
    });
    
    // Initialize with mock data
    this.initializeMockData();
  }
  
  private async initializeMockData() {
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

    // Add mock heroes for hired prospects
    const heroes = [
      {
        prospectId: 6,
        startDate: new Date("2023-11-01"),
        clientId: 5,
        companyId: 7,
      }
    ];

    for (const hero of heroes) {
      await this.createHero(hero as InsertHero);
    }

    // Add mock contracts
    const contracts = [
      {
        title: "Development Contract",
        heroId: 1,
        clientId: 5,
        companyId: 7,
        startDate: new Date("2023-11-01"),
        endDate: new Date("2024-11-01"),
        compensation: 120000,
        status: "active",
        document: "contract_1.pdf",
      }
    ];

    for (const contract of contracts) {
      await this.createContract(contract as InsertContract);
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
        contractId: 1,
        heroId: 1,
        clientId: 5,
        companyId: 7,
        amount: 10000,
        status: "pending",
        dueDate: new Date("2024-02-01"),
      },
      {
        invoiceNumber: "INV-1004",
        contractId: 1,
        heroId: 1,
        clientId: 5,
        companyId: 7,
        amount: 10000,
        status: "overdue",
        dueDate: new Date("2023-10-01"),
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
        jobType: "Full-time",
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
        jobType: "Full-time",
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
        jobType: "Contract",
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
        jobType: "Full-time",
        salary: "$90,000 - $120,000",
        isActive: false,
        clientId: 5,
        companyId: 7
      }
    ];
    
    for (const jobOpening of jobOpenings) {
      await this.createJobOpening(jobOpening as InsertJobOpening);
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

export const storage = new MemStorage();
