import type { Express, Request, Response, NextFunction } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth } from "./auth";
import { 
  insertClientSchema, 
  insertCompanySchema, 
  insertProspectSchema, 
  insertHeroSchema, 
  insertContractSchema, 
  insertInvoiceSchema 
} from "@shared/schema";
import { ZodError } from "zod";
import { fromZodError } from "zod-validation-error";

// Temporary development middleware - allows all requests without authentication
function isAuthenticated(req: Request, res: Response, next: NextFunction) {
  // In development mode, always grant access
  return next();
}

// Temporary development middleware - allows all role access
function hasRole(roles: string[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    // In development mode, always grant access regardless of role
    return next();
  };
}

// Helper function to handle validation errors
function handleZodError(error: ZodError, res: Response) {
  const validationError = fromZodError(error);
  return res.status(400).json({ message: validationError.message });
}

export async function registerRoutes(app: Express): Promise<Server> {
  // Authentication routes
  setupAuth(app);
  
  // Client routes
  app.get("/api/clients", isAuthenticated, async (req, res) => {
    try {
      const clients = await storage.getClients();
      res.json(clients);
    } catch (error) {
      res.status(500).json({ message: "Failed to retrieve clients" });
    }
  });
  
  app.get("/api/clients/:id", isAuthenticated, async (req, res) => {
    try {
      const client = await storage.getClient(parseInt(req.params.id));
      if (!client) {
        return res.status(404).json({ message: "Client not found" });
      }
      res.json(client);
    } catch (error) {
      res.status(500).json({ message: "Failed to retrieve client" });
    }
  });
  
  app.post("/api/clients", hasRole(["super_admin", "admin"]), async (req, res) => {
    try {
      const clientData = insertClientSchema.parse(req.body);
      const client = await storage.createClient(clientData);
      res.status(201).json(client);
    } catch (error) {
      if (error instanceof ZodError) {
        return handleZodError(error, res);
      }
      res.status(500).json({ message: "Failed to create client" });
    }
  });
  
  app.put("/api/clients/:id", hasRole(["super_admin", "admin"]), async (req, res) => {
    try {
      const clientData = insertClientSchema.partial().parse(req.body);
      const updatedClient = await storage.updateClient(parseInt(req.params.id), clientData);
      if (!updatedClient) {
        return res.status(404).json({ message: "Client not found" });
      }
      res.json(updatedClient);
    } catch (error) {
      if (error instanceof ZodError) {
        return handleZodError(error, res);
      }
      res.status(500).json({ message: "Failed to update client" });
    }
  });
  
  // Company routes
  app.get("/api/companies", isAuthenticated, async (req, res) => {
    try {
      const companies = await storage.getCompanies();
      res.json(companies);
    } catch (error) {
      res.status(500).json({ message: "Failed to retrieve companies" });
    }
  });
  
  app.get("/api/companies/:id", isAuthenticated, async (req, res) => {
    try {
      const company = await storage.getCompany(parseInt(req.params.id));
      if (!company) {
        return res.status(404).json({ message: "Company not found" });
      }
      res.json(company);
    } catch (error) {
      res.status(500).json({ message: "Failed to retrieve company" });
    }
  });
  
  app.get("/api/clients/:clientId/companies", isAuthenticated, async (req, res) => {
    try {
      const companies = await storage.getCompaniesByClient(parseInt(req.params.clientId));
      res.json(companies);
    } catch (error) {
      res.status(500).json({ message: "Failed to retrieve companies for client" });
    }
  });
  
  app.post("/api/companies", hasRole(["super_admin", "admin"]), async (req, res) => {
    try {
      const companyData = insertCompanySchema.parse(req.body);
      const company = await storage.createCompany(companyData);
      res.status(201).json(company);
    } catch (error) {
      if (error instanceof ZodError) {
        return handleZodError(error, res);
      }
      res.status(500).json({ message: "Failed to create company" });
    }
  });
  
  app.put("/api/companies/:id", hasRole(["super_admin", "admin"]), async (req, res) => {
    try {
      const companyData = insertCompanySchema.partial().parse(req.body);
      const updatedCompany = await storage.updateCompany(parseInt(req.params.id), companyData);
      if (!updatedCompany) {
        return res.status(404).json({ message: "Company not found" });
      }
      res.json(updatedCompany);
    } catch (error) {
      if (error instanceof ZodError) {
        return handleZodError(error, res);
      }
      res.status(500).json({ message: "Failed to update company" });
    }
  });
  
  // Prospect routes
  app.get("/api/prospects", isAuthenticated, async (req, res) => {
    try {
      const prospects = await storage.getProspects();
      res.json(prospects);
    } catch (error) {
      res.status(500).json({ message: "Failed to retrieve prospects" });
    }
  });
  
  app.get("/api/prospects/:id", isAuthenticated, async (req, res) => {
    try {
      const prospect = await storage.getProspect(parseInt(req.params.id));
      if (!prospect) {
        return res.status(404).json({ message: "Prospect not found" });
      }
      res.json(prospect);
    } catch (error) {
      res.status(500).json({ message: "Failed to retrieve prospect" });
    }
  });
  
  app.get("/api/prospects/status/:status", isAuthenticated, async (req, res) => {
    try {
      const prospects = await storage.getProspectsByStatus(req.params.status);
      res.json(prospects);
    } catch (error) {
      res.status(500).json({ message: "Failed to retrieve prospects by status" });
    }
  });
  
  app.post("/api/prospects", isAuthenticated, async (req, res) => {
    try {
      const prospectData = insertProspectSchema.parse(req.body);
      const prospect = await storage.createProspect(prospectData);
      res.status(201).json(prospect);
    } catch (error) {
      if (error instanceof ZodError) {
        return handleZodError(error, res);
      }
      res.status(500).json({ message: "Failed to create prospect" });
    }
  });
  
  app.put("/api/prospects/:id", isAuthenticated, async (req, res) => {
    try {
      const prospectData = insertProspectSchema.partial().parse(req.body);
      const updatedProspect = await storage.updateProspect(parseInt(req.params.id), prospectData);
      if (!updatedProspect) {
        return res.status(404).json({ message: "Prospect not found" });
      }
      res.json(updatedProspect);
    } catch (error) {
      if (error instanceof ZodError) {
        return handleZodError(error, res);
      }
      res.status(500).json({ message: "Failed to update prospect" });
    }
  });
  
  // Hero routes
  app.get("/api/heroes", isAuthenticated, async (req, res) => {
    try {
      const heroes = await storage.getHeroes();
      res.json(heroes);
    } catch (error) {
      res.status(500).json({ message: "Failed to retrieve heroes" });
    }
  });
  
  app.get("/api/heroes/:id", isAuthenticated, async (req, res) => {
    try {
      const hero = await storage.getHero(parseInt(req.params.id));
      if (!hero) {
        return res.status(404).json({ message: "Hero not found" });
      }
      res.json(hero);
    } catch (error) {
      res.status(500).json({ message: "Failed to retrieve hero" });
    }
  });
  
  app.post("/api/heroes", hasRole(["super_admin", "admin"]), async (req, res) => {
    try {
      const heroData = insertHeroSchema.parse(req.body);
      const hero = await storage.createHero(heroData);
      
      // Update prospect status to hired
      const prospect = await storage.getProspect(heroData.prospectId);
      if (prospect) {
        await storage.updateProspect(prospect.id, { status: "hired" });
      }
      
      res.status(201).json(hero);
    } catch (error) {
      if (error instanceof ZodError) {
        return handleZodError(error, res);
      }
      res.status(500).json({ message: "Failed to create hero" });
    }
  });
  
  // Contract routes
  app.get("/api/contracts", isAuthenticated, async (req, res) => {
    try {
      const contracts = await storage.getContracts();
      res.json(contracts);
    } catch (error) {
      res.status(500).json({ message: "Failed to retrieve contracts" });
    }
  });
  
  app.get("/api/contracts/:id", isAuthenticated, async (req, res) => {
    try {
      const contract = await storage.getContract(parseInt(req.params.id));
      if (!contract) {
        return res.status(404).json({ message: "Contract not found" });
      }
      res.json(contract);
    } catch (error) {
      res.status(500).json({ message: "Failed to retrieve contract" });
    }
  });
  
  app.post("/api/contracts", hasRole(["super_admin", "admin"]), async (req, res) => {
    try {
      const contractData = insertContractSchema.parse(req.body);
      const contract = await storage.createContract(contractData);
      
      // Update hero with contract id
      await storage.updateHero(contractData.heroId, { contractId: contract.id });
      
      res.status(201).json(contract);
    } catch (error) {
      if (error instanceof ZodError) {
        return handleZodError(error, res);
      }
      res.status(500).json({ message: "Failed to create contract" });
    }
  });
  
  app.put("/api/contracts/:id", hasRole(["super_admin", "admin"]), async (req, res) => {
    try {
      const contractData = insertContractSchema.partial().parse(req.body);
      const updatedContract = await storage.updateContract(parseInt(req.params.id), contractData);
      if (!updatedContract) {
        return res.status(404).json({ message: "Contract not found" });
      }
      res.json(updatedContract);
    } catch (error) {
      if (error instanceof ZodError) {
        return handleZodError(error, res);
      }
      res.status(500).json({ message: "Failed to update contract" });
    }
  });
  
  // Invoice routes
  app.get("/api/invoices", isAuthenticated, async (req, res) => {
    try {
      const invoices = await storage.getInvoices();
      res.json(invoices);
    } catch (error) {
      res.status(500).json({ message: "Failed to retrieve invoices" });
    }
  });
  
  app.get("/api/invoices/:id", isAuthenticated, async (req, res) => {
    try {
      const invoice = await storage.getInvoice(parseInt(req.params.id));
      if (!invoice) {
        return res.status(404).json({ message: "Invoice not found" });
      }
      res.json(invoice);
    } catch (error) {
      res.status(500).json({ message: "Failed to retrieve invoice" });
    }
  });
  
  app.post("/api/invoices", hasRole(["super_admin", "admin"]), async (req, res) => {
    try {
      const invoiceData = insertInvoiceSchema.parse(req.body);
      const invoice = await storage.createInvoice(invoiceData);
      res.status(201).json(invoice);
    } catch (error) {
      if (error instanceof ZodError) {
        return handleZodError(error, res);
      }
      res.status(500).json({ message: "Failed to create invoice" });
    }
  });
  
  app.put("/api/invoices/:id", hasRole(["super_admin", "admin"]), async (req, res) => {
    try {
      const invoiceData = insertInvoiceSchema.partial().parse(req.body);
      const updatedInvoice = await storage.updateInvoice(parseInt(req.params.id), invoiceData);
      if (!updatedInvoice) {
        return res.status(404).json({ message: "Invoice not found" });
      }
      res.json(updatedInvoice);
    } catch (error) {
      if (error instanceof ZodError) {
        return handleZodError(error, res);
      }
      res.status(500).json({ message: "Failed to update invoice" });
    }
  });
  
  // User management (Super Admin only)
  app.get("/api/users", hasRole(["super_admin"]), async (req, res) => {
    try {
      const users = await storage.getUsers();
      // Remove passwords from response
      const usersWithoutPasswords = users.map(({ password, ...user }) => user);
      res.json(usersWithoutPasswords);
    } catch (error) {
      res.status(500).json({ message: "Failed to retrieve users" });
    }
  });
  
  app.put("/api/users/:id", hasRole(["super_admin"]), async (req, res) => {
    try {
      // Super admin can update user roles
      const userData = req.body;
      if (userData.password) {
        // If updating password, hash it
        userData.password = await require('crypto').scryptSync(userData.password, 
          require('crypto').randomBytes(16).toString('hex'), 64).toString('hex');
      }
      
      const updatedUser = await storage.updateUser(parseInt(req.params.id), userData);
      if (!updatedUser) {
        return res.status(404).json({ message: "User not found" });
      }
      
      // Remove password from response
      const { password, ...userWithoutPassword } = updatedUser;
      res.json(userWithoutPassword);
    } catch (error) {
      res.status(500).json({ message: "Failed to update user" });
    }
  });
  
  const httpServer = createServer(app);
  return httpServer;
}
