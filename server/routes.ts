import type { Express, Request, Response, NextFunction } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth, hashPassword, comparePasswords } from "./auth";
import { 
  insertClientSchema, 
  insertCompanySchema, 
  insertProspectSchema, 
  insertHeroSchema, 
  insertContractSchema, 
  insertInvoiceSchema,
  insertInterviewSchema,
  insertJobOpeningSchema,
  insertJobApplicationSchema,
  insertJobRequestSchema,
  insertRoleSchema,
  insertUserSchema,
  insertProspectDatabaseSchema
} from "@shared/schema";
import { ZodError, z } from "zod";
import { fromZodError } from "zod-validation-error";
import Stripe from "stripe";
import { generateVideoToken, createVideoRoom, endVideoRoom, listVideoRooms } from './twilio';

// Initialize Stripe
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-03-31.basil",
});

// Authentication middleware
function isAuthenticated(req: Request, res: Response, next: NextFunction) {
  if (!req.isAuthenticated()) {
    return res.status(401).json({ message: "Not authenticated" });
  }
  return next();
}

// Role-based access control middleware
function hasRole(roles: string[]) {
  return async (req: Request, res: Response, next: NextFunction) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    const user = req.user;
    if (!user || !user.role) {
      return res.status(403).json({ message: "User has no role assigned" });
    }

    // Check if the user's role is in the allowed roles list
    if (roles.includes(user.role)) {
      return next();
    }

    return res.status(403).json({ message: "Insufficient permissions" });
  };
}

// Permission-based access control middleware
function hasPermission(requiredPermissions: string[]) {
  return async (req: Request, res: Response, next: NextFunction) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    const user = req.user;
    if (!user || !user.role) {
      return res.status(403).json({ message: "User has no role assigned" });
    }

    try {
      // Get user's role from database
      const role = await storage.getRoleByName(user.role);
      
      if (!role) {
        return res.status(403).json({ message: "Role not found" });
      }
      
      // Parse permissions if they're stored as a string
      let permissionsArray = role.permissions;
      if (typeof permissionsArray === 'string') {
        try {
          // If it's a JSON string, parse it
          permissionsArray = JSON.parse(permissionsArray);
        } catch (e) {
          // If parsing fails, it's a comma-separated string
          permissionsArray = permissionsArray.split(',');
        }
      }
      
      // Check if the user's permissions include all required permissions
      const hasAllPermissions = requiredPermissions.every(permission => 
        permissionsArray.includes(permission)
      );
      
      if (hasAllPermissions) {
        return next();
      }
      
      return res.status(403).json({ 
        message: "Insufficient permissions",
        required: requiredPermissions,
        available: permissionsArray
      });
    } catch (error) {
      console.error("Error checking permissions:", error);
      return res.status(500).json({ message: "Error checking permissions" });
    }
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
  
  // Get user's permissions based on their role
  app.get("/api/permissions", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Not authenticated" });
    }
    
    try {
      const user = req.user;
      
      if (!user || !user.role) {
        return res.status(400).json({ message: "User has no role assigned" });
      }
      
      // Get user's role from the database
      const role = await storage.getRoleByName(user.role);
      
      // Define default permissions based on the user's role name (case-insensitive)
      const userRoleLower = user.role.toLowerCase();
      
      // If role doesn't exist in the database, assign default permissions
      if (!role) {
        console.log(`Role not found in database: ${user.role}, assigning default permissions`);
        
        let defaultPermissions: string[] = ["dashboard"]; // Base dashboard for unknown roles
        
        // Define role-specific default permissions
        if (userRoleLower === "client") {
          defaultPermissions = ["client_dashboard"];
        } else if (userRoleLower === "recruiter") {
          defaultPermissions = ["dashboard", "prospects", "interviews"];
        } else if (userRoleLower === "hero") {
          defaultPermissions = ["hero_dashboard"];
        } else if (userRoleLower === "prospect") {
          defaultPermissions = ["prospect_dashboard"];
        }
        
        // Return default permissions
        return res.json({
          role: user.role,
          permissions: defaultPermissions
        });
      }
      
      // Return the permissions for the role from database
      // Handle both string and array formats for backwards compatibility
      let permissionsArray = role.permissions;
      if (typeof permissionsArray === 'string') {
        try {
          // If it's a JSON string, parse it
          permissionsArray = JSON.parse(permissionsArray);
        } catch (e) {
          // If parsing fails, it's a comma-separated string
          permissionsArray = permissionsArray.split(',');
        }
      }
      
      res.json({
        role: role.name,
        permissions: permissionsArray
      });
    } catch (error) {
      console.error("Error retrieving permissions:", error);
      
      // Return empty permissions array to avoid breaking the client
      res.json({
        role: req.user.role || "unknown",
        permissions: ["dashboard"] // Provide a basic default permission
      });
    }
  });
  
  // Client routes
  app.get("/api/clients", isAuthenticated, async (req, res) => {
    try {
      // If user has Client role, only return their own client
      if (req.user.role === "Client") {
        const client = await storage.getClientByEmail(req.user.email);
        res.json(client ? [client] : []);
      } else {
        // For admin roles, return all clients
        const clients = await storage.getClients();
        res.json(clients);
      }
    } catch (error) {
      res.status(500).json({ message: "Failed to retrieve clients" });
    }
  });
  
  // Get current user's client data
  app.get("/api/user/client", isAuthenticated, async (req, res) => {
    try {
      if (req.user.role === "Client") {
        const client = await storage.getClientByEmail(req.user.email);
        if (!client) {
          return res.status(404).json({ message: "No client found for this user" });
        }
        res.json(client);
      } else {
        res.status(403).json({ message: "Only client users can access this endpoint" });
      }
    } catch (error) {
      res.status(500).json({ message: "Failed to retrieve client information" });
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
      // If user has Client role, only return their companies
      if (req.user?.role === "Client") {
        const client = await storage.getClientByEmail(req.user.email);
        if (client) {
          const companies = await storage.getCompaniesByClient(client.id);
          return res.json(companies);
        }
        return res.json([]);
      }
      // For admin roles, return all companies
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
      const clientId = parseInt(req.params.clientId);
      
      // If user is a client, make sure they can only access their own companies
      if (req.user?.role === "Client") {
        const client = await storage.getClientByEmail(req.user.email);
        if (!client || client.id !== clientId) {
          return res.status(403).json({ message: "You do not have permission to access this client's companies" });
        }
      }
      
      const companies = await storage.getCompaniesByClient(clientId);
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
      console.log("Getting prospects...");
      
      // If user has Client role, only return their prospects
      if (req.user?.role === "Client") {
        const client = await storage.getClientByEmail(req.user.email);
        if (client) {
          const prospects = await storage.getProspectsByClient(client.id);
          console.log("Client prospects retrieved:", prospects.length);
          return res.json(prospects);
        }
        return res.json([]);
      }
      
      // For admin roles, return all prospects
      const prospects = await storage.getProspects();
      console.log("Prospects retrieved:", prospects ? "success" : "null or undefined");
      res.json(prospects);
    } catch (error) {
      console.error("Error retrieving prospects:", error);
      res.status(500).json({ message: "Failed to retrieve prospects", error: String(error) });
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
  
  // PATCH endpoint for prospects to allow partial updates (like status changes)
  app.patch("/api/prospects/:id", isAuthenticated, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      // Validate the prospect exists
      const existingProspect = await storage.getProspect(id);
      if (!existingProspect) {
        return res.status(404).json({ message: "Prospect not found" });
      }
      
      // Validate the data
      const prospectData = insertProspectSchema.partial().parse(req.body);
      
      // Update the prospect
      const updatedProspect = await storage.updateProspect(id, prospectData);
      
      console.log(`Updated prospect ${id} status to ${prospectData.status || 'unchanged'}`);
      res.json(updatedProspect);
    } catch (error) {
      if (error instanceof ZodError) {
        return handleZodError(error, res);
      }
      console.error("Error updating prospect:", error);
      res.status(500).json({ message: "Failed to update prospect" });
    }
  });
  
  // Endpoint to move a prospect to the prospects database (used when rejecting prospects)
  app.post("/api/prospects/:id/move-to-database", isAuthenticated, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      
      // Get the prospect
      const prospect = await storage.getProspect(id);
      if (!prospect) {
        return res.status(404).json({ message: "Prospect not found" });
      }
      
      // Format data for prospects database
      const prospectDbData = {
        name: `${prospect.firstName} ${prospect.lastName}`,
        status: 'rejected',
        rolePosition: prospect.position || null,
        otherRoleOfInterest: null,
        vocarooRecord: prospect.voiceMessageUrl || null,
        resume: prospect.resume || null,
        country: null,
        email: prospect.email,
        phone: prospect.phone || null,
        programTools: prospect.skills || null,
        englishLevel: null,
        clientId: prospect.clientId,
        companyId: prospect.companyId,
      };
      
      // Add to prospects database
      const newDbEntry = await storage.createProspectDatabase(prospectDbData);
      
      // Don't remove the prospect from the pipeline - just mark it as rejected
      // The UI will handle showing/hiding it in the appropriate view
      
      // Respond with success and the new database entry
      res.status(201).json({
        message: "Prospect successfully moved to database",
        prospectDb: newDbEntry
      });
    } catch (error) {
      console.error("Error moving prospect to database:", error);
      res.status(500).json({ 
        message: "Failed to move prospect to database", 
        error: error instanceof Error ? error.message : String(error)
      });
    }
  });
  
  // Hero routes
  app.get("/api/heroes", isAuthenticated, async (req, res) => {
    try {
      // If user has Client role, only return their heroes
      if (req.user?.role === "Client") {
        const client = await storage.getClientByEmail(req.user.email);
        if (client) {
          const heroes = await storage.getHeroesByClient(client.id);
          return res.json(heroes);
        }
        return res.json([]);
      }
      
      // For admin roles, return all heroes
      const heroes = await storage.getHeroes();
      res.json(heroes);
    } catch (error) {
      res.status(500).json({ message: "Failed to retrieve heroes" });
    }
  });
  
  app.get("/api/heroes/:id", isAuthenticated, async (req, res) => {
    try {
      const heroId = parseInt(req.params.id);
      const hero = await storage.getHero(heroId);
      
      if (!hero) {
        return res.status(404).json({ message: "Hero not found" });
      }
      
      // If user is a client, make sure they can only access their own heroes
      if (req.user?.role === "Client") {
        const client = await storage.getClientByEmail(req.user.email);
        if (!client || hero.clientId !== client.id) {
          return res.status(403).json({ message: "You do not have permission to access this hero" });
        }
      }
      
      res.json(hero);
    } catch (error) {
      res.status(500).json({ message: "Failed to retrieve hero" });
    }
  });
  
  // Get all heroes for a specific client
  app.get("/api/clients/:clientId/heroes", isAuthenticated, async (req, res) => {
    try {
      const clientId = parseInt(req.params.clientId);
      
      // If user is a client, make sure they can only access their own heroes
      if (req.user?.role === "Client") {
        const client = await storage.getClientByEmail(req.user.email);
        if (!client || client.id !== clientId) {
          return res.status(403).json({ message: "You do not have permission to access this client's heroes" });
        }
      }
      
      const heroes = await storage.getHeroesByClient(clientId);
      
      // Enhance heroes with prospect data
      const enhancedHeroes = await Promise.all(
        heroes.map(async (hero) => {
          const prospect = await storage.getProspect(hero.prospectId);
          console.log(`Found prospect for hero ${hero.id}:`, prospect ? `${prospect.firstName} ${prospect.lastName}` : "No prospect found");
          
          return {
            ...hero,
            firstName: prospect?.firstName,
            lastName: prospect?.lastName,
            email: prospect?.email,
            phone: prospect?.phone,
            skills: prospect?.skills,
            position: prospect?.position
          };
        })
      );
      
      console.log("Enhanced heroes:", enhancedHeroes.map(h => ({ 
        id: h.id, 
        name: h.firstName && h.lastName ? `${h.firstName} ${h.lastName}` : `Hero #${h.id}`,
        position: h.position
      })));
      
      res.json(enhancedHeroes);
    } catch (error) {
      res.status(500).json({ message: "Failed to retrieve heroes for client" });
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
      // If user has Client role, only return their contracts
      if (req.user?.role === "Client") {
        const client = await storage.getClientByEmail(req.user.email);
        if (client) {
          const contracts = await storage.getContractsByClient(client.id);
          return res.json(contracts);
        }
        return res.json([]);
      }
      
      // For admin roles, return all contracts
      const contracts = await storage.getContracts();
      res.json(contracts);
    } catch (error) {
      res.status(500).json({ message: "Failed to retrieve contracts" });
    }
  });
  
  app.get("/api/contracts/:id", isAuthenticated, async (req, res) => {
    try {
      const contractId = parseInt(req.params.id);
      const contract = await storage.getContract(contractId);
      
      if (!contract) {
        return res.status(404).json({ message: "Contract not found" });
      }
      
      // If user is a client, make sure they can only access their own contracts
      if (req.user?.role === "Client") {
        const client = await storage.getClientByEmail(req.user.email);
        if (!client || contract.clientId !== client.id) {
          return res.status(403).json({ message: "You do not have permission to access this contract" });
        }
      }
      
      res.json(contract);
    } catch (error) {
      res.status(500).json({ message: "Failed to retrieve contract" });
    }
  });
  
  // Get all contracts for a specific client
  app.get("/api/clients/:clientId/contracts", isAuthenticated, async (req, res) => {
    try {
      const clientId = parseInt(req.params.clientId);
      
      // If user is a client, make sure they can only access their own contracts
      if (req.user?.role === "Client") {
        const client = await storage.getClientByEmail(req.user.email);
        if (!client || client.id !== clientId) {
          return res.status(403).json({ message: "You do not have permission to access this client's contracts" });
        }
      }
      
      const contracts = await storage.getContractsByClient(clientId);
      res.json(contracts);
    } catch (error) {
      res.status(500).json({ message: "Failed to retrieve contracts for client" });
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
  
  // Function to create a Stripe invoice
  async function createStripeInvoice(invoiceData: any, customer: any = null) {
    try {
      // Get related data
      const hero = await storage.getHero(invoiceData.heroId);
      const prospect = hero ? await storage.getProspect(hero.prospectId) : null;
      const client = await storage.getClient(invoiceData.clientId);
      const company = await storage.getCompany(invoiceData.companyId);
      
      if (!hero || !prospect || !client || !company) {
        throw new Error("Missing related data");
      }
      
      // Create a customer if not provided
      let customerId = customer ? customer.id : null;
      if (!customerId) {
        // Check if customer already exists
        const customers = await stripe.customers.list({
          email: client.email,
          limit: 1,
        });
        
        if (customers.data.length > 0) {
          customerId = customers.data[0].id;
        } else {
          // Create a new customer
          // @ts-ignore: Type inconsistencies with Stripe SDK
          const newCustomer = await stripe.customers.create({
            name: client.name || 'Unknown Client',
            email: client.email || '',
            phone: client.phone,
            metadata: {
              clientId: client.id.toString(),
              companyId: company.id.toString(),
            },
          });
          customerId = newCustomer.id;
        }
      }
      
      // Create an invoice item
      const invoiceItem = await stripe.invoiceItems.create({
        customer: customerId,
        amount: Math.round(invoiceData.amount * 100), // Convert to cents
        currency: 'usd',
        description: `Services by ${prospect.firstName} ${prospect.lastName} (Reference: ${invoiceData.invoiceNumber})`,
        metadata: {
          invoiceId: invoiceData.id ? invoiceData.id.toString() : 'pending',
          heroId: hero.id.toString(),
          prospectId: prospect.id.toString(),
        },
      });
      
      // Create invoice
      const stripeInvoice = await stripe.invoices.create({
        customer: customerId,
        auto_advance: true, // Auto-finalize the invoice
        collection_method: 'send_invoice',
        due_date: Math.floor(new Date(invoiceData.dueDate).getTime() / 1000), // Convert to Unix timestamp
        metadata: {
          invoiceId: invoiceData.id ? invoiceData.id.toString() : 'pending',
          invoiceNumber: invoiceData.invoiceNumber,
        },
        footer: `Invoice generated by RemoteHero HR Management System`,
      });
      
      // Finalize invoice only if ID exists
      if (!stripeInvoice.id) {
        throw new Error('Stripe invoice ID is undefined');
      }
      
      // Finalize invoice
      // @ts-ignore: Type inconsistencies with Stripe SDK
      const finalizedInvoice = await stripe.invoices.finalizeInvoice(stripeInvoice.id);
      
      // Send invoice by email
      if (!finalizedInvoice.id) {
        throw new Error('Finalized invoice ID is undefined');
      }
      
      // @ts-ignore: Type inconsistencies with Stripe SDK
      await stripe.invoices.sendInvoice(finalizedInvoice.id);
      
      return {
        stripeInvoiceId: finalizedInvoice.id,
        stripeInvoiceUrl: finalizedInvoice.hosted_invoice_url,
      };
    } catch (error: any) {
      console.error("Stripe invoice creation error:", error.message);
      throw new Error(`Failed to create Stripe invoice: ${error.message}`);
    }
  }

// Invoice routes
  app.get("/api/invoices", isAuthenticated, async (req, res) => {
    try {
      console.log("Getting invoices...");
      
      // If user has Client role, only return their invoices
      if (req.user?.role === "Client") {
        const client = await storage.getClientByEmail(req.user.email);
        if (client) {
          const invoices = await storage.getInvoicesByClient(client.id);
          console.log("Client invoices retrieved:", invoices.length);
          return res.json(invoices);
        }
        return res.json([]);
      }
      
      // For admin roles, return all invoices
      const invoices = await storage.getInvoices();
      console.log("Invoices retrieved:", invoices ? "success" : "null or undefined");
      res.json(invoices);
    } catch (error) {
      console.error("Error retrieving invoices:", error);
      res.status(500).json({ message: "Failed to retrieve invoices", error: String(error) });
    }
  });
  
  app.get("/api/invoices/:id", isAuthenticated, async (req, res) => {
    try {
      const invoiceId = parseInt(req.params.id);
      const invoice = await storage.getInvoice(invoiceId);
      
      if (!invoice) {
        return res.status(404).json({ message: "Invoice not found" });
      }
      
      // If user is a client, make sure they can only access their own invoices
      if (req.user?.role === "Client") {
        const client = await storage.getClientByEmail(req.user.email);
        if (!client || invoice.clientId !== client.id) {
          return res.status(403).json({ message: "You do not have permission to access this invoice" });
        }
      }
      
      res.json(invoice);
    } catch (error) {
      res.status(500).json({ message: "Failed to retrieve invoice" });
    }
  });
  
  app.post("/api/invoices", hasRole(["super_admin", "admin"]), async (req, res) => {
    try {
      const invoiceData = insertInvoiceSchema.parse(req.body);
      
      // First create the invoice in our database
      const invoice = await storage.createInvoice(invoiceData);
      
      try {
        // Then create the invoice in Stripe
        const { stripeInvoiceId, stripeInvoiceUrl } = await createStripeInvoice({ 
          ...invoiceData, 
          id: invoice.id 
        });
        
        // Update our invoice with Stripe information
        const updatedInvoice = await storage.updateInvoice(invoice.id, {
          stripeInvoiceId,
          stripeInvoiceUrl
        });
        
        res.status(201).json(updatedInvoice || invoice);
      } catch (stripeError: any) {
        // If Stripe fails, we still return the created invoice but with an error message
        console.error("Stripe invoice creation failed:", stripeError);
        res.status(201).json({
          ...invoice,
          stripeError: stripeError.message
        });
      }
    } catch (error) {
      if (error instanceof ZodError) {
        return handleZodError(error, res);
      }
      res.status(500).json({ message: "Failed to create invoice" });
    }
  });
  
  app.put("/api/invoices/:id", hasRole(["super_admin", "admin"]), async (req, res) => {
    try {
      const invoiceId = parseInt(req.params.id);
      const invoiceData = insertInvoiceSchema.partial().parse(req.body);
      const currentInvoice = await storage.getInvoice(invoiceId);
      
      if (!currentInvoice) {
        return res.status(404).json({ message: "Invoice not found" });
      }
      
      // Update the invoice in our database
      const updatedInvoice = await storage.updateInvoice(invoiceId, invoiceData);
      
      // If the invoice status is changing to "paid" and we have a Stripe invoice ID,
      // mark the Stripe invoice as paid
      if (invoiceData.status === 'paid' && currentInvoice.stripeInvoiceId) {
        try {
          await stripe.invoices.pay(currentInvoice.stripeInvoiceId);
        } catch (stripeError: any) {
          console.error("Failed to mark Stripe invoice as paid:", stripeError);
        }
      }
      
      res.json(updatedInvoice);
    } catch (error) {
      if (error instanceof ZodError) {
        return handleZodError(error, res);
      }
      res.status(500).json({ message: "Failed to update invoice" });
    }
  });
  
  // Interview routes
  app.get("/api/interviews", isAuthenticated, async (req, res) => {
    try {
      const interviews = await storage.getInterviews();
      res.json(interviews);
    } catch (error) {
      res.status(500).json({ message: "Failed to retrieve interviews" });
    }
  });
  
  app.get("/api/interviews/upcoming", isAuthenticated, async (req, res) => {
    try {
      const interviews = await storage.getUpcomingInterviews();
      res.json(interviews);
    } catch (error) {
      res.status(500).json({ message: "Failed to retrieve upcoming interviews" });
    }
  });
  
  app.get("/api/interviews/:id", isAuthenticated, async (req, res) => {
    try {
      const interview = await storage.getInterview(parseInt(req.params.id));
      if (!interview) {
        return res.status(404).json({ message: "Interview not found" });
      }
      res.json(interview);
    } catch (error) {
      res.status(500).json({ message: "Failed to retrieve interview" });
    }
  });
  
  app.get("/api/prospects/:id/interviews", isAuthenticated, async (req, res) => {
    try {
      const prospectId = parseInt(req.params.id);
      const interviews = await storage.getInterviewsByProspect(prospectId);
      res.json(interviews);
    } catch (error) {
      res.status(500).json({ message: "Failed to retrieve prospect interviews" });
    }
  });
  
  app.post("/api/interviews", isAuthenticated, async (req, res) => {
    try {
      const interviewData = insertInterviewSchema.parse(req.body);
      const interview = await storage.createInterview(interviewData);
      res.status(201).json(interview);
    } catch (error) {
      if (error instanceof ZodError) {
        return handleZodError(error, res);
      }
      res.status(500).json({ message: "Failed to create interview" });
    }
  });
  
  app.put("/api/interviews/:id", isAuthenticated, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const interview = await storage.getInterview(id);
      
      if (!interview) {
        return res.status(404).json({ message: "Interview not found" });
      }
      
      const interviewData = insertInterviewSchema.partial().parse(req.body);
      const updatedInterview = await storage.updateInterview(id, interviewData);
      res.json(updatedInterview);
    } catch (error) {
      if (error instanceof ZodError) {
        return handleZodError(error, res);
      }
      res.status(500).json({ message: "Failed to update interview" });
    }
  });
  
  // Role management (Super Admin only)
  app.get("/api/roles", hasRole(["super_admin"]), async (req, res) => {
    try {
      const roles = await storage.getRoles();
      res.json(roles);
    } catch (error) {
      res.status(500).json({ message: "Failed to retrieve roles" });
    }
  });
  
  app.get("/api/roles/:id", hasRole(["super_admin"]), async (req, res) => {
    try {
      const role = await storage.getRole(parseInt(req.params.id));
      if (!role) {
        return res.status(404).json({ message: "Role not found" });
      }
      res.json(role);
    } catch (error) {
      res.status(500).json({ message: "Failed to retrieve role" });
    }
  });
  
  app.post("/api/roles", hasRole(["super_admin"]), async (req, res) => {
    try {
      const roleData = insertRoleSchema.parse(req.body);
      const role = await storage.createRole(roleData);
      res.status(201).json(role);
    } catch (error) {
      if (error instanceof ZodError) {
        return handleZodError(error, res);
      }
      res.status(500).json({ message: "Failed to create role" });
    }
  });
  
  app.patch("/api/roles/:id", hasRole(["super_admin"]), async (req, res) => {
    try {
      const roleData = insertRoleSchema.partial().parse(req.body);
      const updatedRole = await storage.updateRole(parseInt(req.params.id), roleData);
      if (!updatedRole) {
        return res.status(404).json({ message: "Role not found" });
      }
      res.json(updatedRole);
    } catch (error) {
      if (error instanceof ZodError) {
        return handleZodError(error, res);
      }
      res.status(500).json({ message: "Failed to update role" });
    }
  });
  
  app.delete("/api/roles/:id", hasRole(["super_admin"]), async (req, res) => {
    try {
      const success = await storage.deleteRole(parseInt(req.params.id));
      if (!success) {
        return res.status(404).json({ message: "Role not found or could not be deleted" });
      }
      res.status(204).end();
    } catch (error) {
      res.status(500).json({ message: "Failed to delete role" });
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
  
  app.post("/api/users", hasRole(["super_admin"]), async (req, res) => {
    try {
      const existingUser = await storage.getUserByUsername(req.body.username);
      if (existingUser) {
        return res.status(400).json({ message: "Username already exists" });
      }

      // Validate user data
      const userData = insertUserSchema.parse(req.body);
      
      // Hash the password
      const hashedPassword = await hashPassword(userData.password);
      
      // Create the user
      const user = await storage.createUser({
        ...userData,
        password: hashedPassword,
      });

      // Remove password from response
      const { password, ...userWithoutPassword } = user;
      res.status(201).json(userWithoutPassword);
    } catch (error) {
      if (error instanceof ZodError) {
        return handleZodError(error, res);
      }
      res.status(500).json({ message: "Failed to create user" });
    }
  });
  
  app.put("/api/users/:id", hasRole(["super_admin"]), async (req, res) => {
    try {
      // Super admin can update user roles
      const userData = req.body;
      if (userData.password) {
        // If updating password, hash it
        userData.password = await hashPassword(userData.password);
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
  
  // User profile update - allows users to update their own profile
  app.patch("/api/users/:id", isAuthenticated, async (req, res) => {
    try {
      const userId = parseInt(req.params.id);
      
      // Ensure user can only update their own profile unless they're an admin
      if (req.user!.id !== userId && !["super_admin", "admin"].includes(req.user!.role.toLowerCase())) {
        return res.status(403).json({ message: "You are not authorized to update this user's profile" });
      }
      
      // Only allow updating specific fields
      const { firstName, lastName, avatar } = req.body;
      const updateData: any = {};
      
      if (firstName !== undefined) updateData.firstName = firstName;
      if (lastName !== undefined) updateData.lastName = lastName;
      if (avatar !== undefined) updateData.avatar = avatar;
      
      const updatedUser = await storage.updateUser(userId, updateData);
      
      if (!updatedUser) {
        return res.status(404).json({ message: "User not found" });
      }
      
      // Remove sensitive data
      const { password, ...userWithoutPassword } = updatedUser;
      
      res.json(userWithoutPassword);
    } catch (error) {
      console.error("Error updating user profile:", error);
      res.status(500).json({ message: "Failed to update user profile" });
    }
  });
  
  // Change password endpoint
  app.post("/api/users/:id/change-password", isAuthenticated, async (req, res) => {
    try {
      const userId = parseInt(req.params.id);
      
      // Ensure user can only change their own password
      if (req.user!.id !== userId) {
        return res.status(403).json({ message: "You are not authorized to change this user's password" });
      }
      
      const { currentPassword, newPassword } = req.body;
      
      if (!currentPassword || !newPassword) {
        return res.status(400).json({ message: "Current password and new password are required" });
      }
      
      // Get the user
      const user = await storage.getUser(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      // Validate current password
      const isValid = await comparePasswords(currentPassword, user.password);
      
      if (!isValid) {
        return res.status(400).json({ message: "Current password is incorrect" });
      }
      
      // Update with new hashed password
      const hashedPassword = await hashPassword(newPassword);
      const updatedUser = await storage.updateUser(userId, { password: hashedPassword });
      
      if (!updatedUser) {
        return res.status(404).json({ message: "User not found" });
      }
      
      res.json({ message: "Password updated successfully" });
    } catch (error) {
      console.error("Error changing password:", error);
      res.status(500).json({ message: "Failed to change password" });
    }
  });
  
  // Job Opening routes
  app.get("/api/job-openings", async (req, res) => {
    try {
      const jobOpenings = await storage.getJobOpenings();
      res.json(jobOpenings);
    } catch (error) {
      res.status(500).json({ message: "Failed to retrieve job openings" });
    }
  });
  
  app.get("/api/job-openings/active", async (req, res) => {
    try {
      const activeJobOpenings = await storage.getActiveJobOpenings();
      res.json(activeJobOpenings);
    } catch (error) {
      res.status(500).json({ message: "Failed to retrieve active job openings" });
    }
  });
  
  app.get("/api/job-openings/:id", async (req, res) => {
    try {
      const jobOpening = await storage.getJobOpening(parseInt(req.params.id));
      if (!jobOpening) {
        return res.status(404).json({ message: "Job opening not found" });
      }
      res.json(jobOpening);
    } catch (error) {
      res.status(500).json({ message: "Failed to retrieve job opening" });
    }
  });
  
  app.post("/api/job-openings", hasRole(["super_admin", "admin"]), async (req, res) => {
    try {
      const jobOpeningData = insertJobOpeningSchema.parse(req.body);
      const jobOpening = await storage.createJobOpening(jobOpeningData);
      res.status(201).json(jobOpening);
    } catch (error) {
      if (error instanceof ZodError) {
        return handleZodError(error, res);
      }
      res.status(500).json({ message: "Failed to create job opening" });
    }
  });
  
  app.put("/api/job-openings/:id", hasRole(["super_admin", "admin"]), async (req, res) => {
    try {
      const jobOpeningData = insertJobOpeningSchema.partial().parse(req.body);
      const updatedJobOpening = await storage.updateJobOpening(parseInt(req.params.id), jobOpeningData);
      if (!updatedJobOpening) {
        return res.status(404).json({ message: "Job opening not found" });
      }
      res.json(updatedJobOpening);
    } catch (error) {
      if (error instanceof ZodError) {
        return handleZodError(error, res);
      }
      res.status(500).json({ message: "Failed to update job opening" });
    }
  });
  
  // Job Application routes
  app.get("/api/job-applications", hasRole(["super_admin", "admin", "recruiter"]), async (req, res) => {
    try {
      const jobApplications = await storage.getJobApplications();
      res.json(jobApplications);
    } catch (error) {
      res.status(500).json({ message: "Failed to retrieve job applications" });
    }
  });
  
  app.get("/api/job-applications/:id", hasRole(["super_admin", "admin", "recruiter"]), async (req, res) => {
    try {
      const jobApplication = await storage.getJobApplication(parseInt(req.params.id));
      if (!jobApplication) {
        return res.status(404).json({ message: "Job application not found" });
      }
      res.json(jobApplication);
    } catch (error) {
      res.status(500).json({ message: "Failed to retrieve job application" });
    }
  });
  
  app.get("/api/job-openings/:id/applications", hasRole(["super_admin", "admin", "recruiter"]), async (req, res) => {
    try {
      const jobOpeningId = parseInt(req.params.id);
      const jobApplications = await storage.getJobApplicationsByJobOpening(jobOpeningId);
      res.json(jobApplications);
    } catch (error) {
      res.status(500).json({ message: "Failed to retrieve job applications for this job opening" });
    }
  });
  
  app.post("/api/job-applications", async (req, res) => {
    try {
      const jobApplicationData = insertJobApplicationSchema.parse(req.body);
      const jobApplication = await storage.createJobApplication(jobApplicationData);
      res.status(201).json(jobApplication);
    } catch (error) {
      if (error instanceof ZodError) {
        return handleZodError(error, res);
      }
      res.status(500).json({ message: "Failed to submit job application" });
    }
  });
  
  // Convert a job application to a prospect
  app.post("/api/job-applications/:id/convert-to-prospect", hasRole(["super_admin", "admin", "recruiter"]), async (req, res) => {
    try {
      const applicationId = parseInt(req.params.id);
      const application = await storage.getJobApplication(applicationId);
      
      if (!application) {
        return res.status(404).json({ message: "Job application not found" });
      }
      
      // Get the job opening details to include in the prospect
      const jobOpening = await storage.getJobOpening(application.jobOpeningId);
      
      if (!jobOpening) {
        return res.status(404).json({ message: "Job opening not found" });
      }
      
      // Create a prospect from the application
      const prospectData = {
        firstName: application.firstName,
        lastName: application.lastName,
        email: application.email,
        phone: application.phone,
        resumeUrl: application.resumeUrl,
        notes: application.coverLetter || "",
        status: "sourcing" as const,
        clientId: jobOpening.clientId,
        source: `Job Application (#${application.id}) for ${jobOpening.title}`,
        skills: "",
        experience: "",
        expectedSalary: "",
        currentPosition: "",
        currentCompany: "",
        location: jobOpening.location,
        position: jobOpening.title, // Use job title as the position
      };
      
      const prospect = await storage.createProspect(prospectData);
      
      // Update the job application to mark it as converted
      await storage.updateJobApplication(applicationId, { 
        status: "converted" as any, // Cast to any to bypass type checking since we added "converted" to the schema
        notes: `Converted to prospect #${prospect.id}`
      });
      
      res.status(201).json({
        application,
        prospect
      });
    } catch (error) {
      console.error("Error converting application to prospect:", error);
      res.status(500).json({ message: "Failed to convert job application to prospect" });
    }
  });
  
  app.put("/api/job-applications/:id", hasRole(["super_admin", "admin", "recruiter"]), async (req, res) => {
    try {
      const jobApplicationData = insertJobApplicationSchema.partial().parse(req.body);
      const updatedJobApplication = await storage.updateJobApplication(parseInt(req.params.id), jobApplicationData);
      if (!updatedJobApplication) {
        return res.status(404).json({ message: "Job application not found" });
      }
      res.json(updatedJobApplication);
    } catch (error) {
      if (error instanceof ZodError) {
        return handleZodError(error, res);
      }
      res.status(500).json({ message: "Failed to update job application" });
    }
  });
  
  // Job Request routes
  app.get("/api/job-requests", hasRole(["super_admin", "admin"]), async (req, res) => {
    try {
      const jobRequests = await storage.getJobRequests();
      res.json(jobRequests);
    } catch (error) {
      res.status(500).json({ message: "Failed to retrieve job requests" });
    }
  });
  
  app.get("/api/job-requests/:id", hasRole(["super_admin", "admin", "client"]), async (req, res) => {
    try {
      const jobRequest = await storage.getJobRequest(parseInt(req.params.id));
      if (!jobRequest) {
        return res.status(404).json({ message: "Job request not found" });
      }
      res.json(jobRequest);
    } catch (error) {
      res.status(500).json({ message: "Failed to retrieve job request" });
    }
  });
  
  app.get("/api/job-requests/status/:status", hasRole(["super_admin", "admin"]), async (req, res) => {
    try {
      const jobRequests = await storage.getJobRequestsByStatus(req.params.status);
      res.json(jobRequests);
    } catch (error) {
      res.status(500).json({ message: "Failed to retrieve job requests by status" });
    }
  });
  
  app.get("/api/clients/:clientId/job-requests", hasRole(["super_admin", "admin", "client"]), async (req, res) => {
    try {
      const jobRequests = await storage.getJobRequestsByClient(parseInt(req.params.clientId));
      res.json(jobRequests);
    } catch (error) {
      res.status(500).json({ message: "Failed to retrieve job requests for client" });
    }
  });
  
  app.post("/api/job-requests", hasRole(["super_admin", "admin", "client"]), async (req, res) => {
    try {
      const jobRequestData = insertJobRequestSchema.parse(req.body);
      const jobRequest = await storage.createJobRequest(jobRequestData);
      res.status(201).json(jobRequest);
    } catch (error) {
      if (error instanceof ZodError) {
        return handleZodError(error, res);
      }
      res.status(500).json({ message: "Failed to create job request" });
    }
  });
  
  app.put("/api/job-requests/:id", hasRole(["super_admin", "admin", "client"]), async (req, res) => {
    try {
      const jobRequestData = insertJobRequestSchema.partial().parse(req.body);
      const updatedJobRequest = await storage.updateJobRequest(parseInt(req.params.id), jobRequestData);
      if (!updatedJobRequest) {
        return res.status(404).json({ message: "Job request not found" });
      }
      res.json(updatedJobRequest);
    } catch (error) {
      if (error instanceof ZodError) {
        return handleZodError(error, res);
      }
      res.status(500).json({ message: "Failed to update job request" });
    }
  });
  
  app.post("/api/job-requests/:id/approve", hasRole(["super_admin", "admin"]), async (req, res) => {
    try {
      const notes = req.body.notes;
      const jobRequest = await storage.approveJobRequest(parseInt(req.params.id), notes);
      
      if (!jobRequest) {
        return res.status(404).json({ message: "Job request not found" });
      }
      
      res.json(jobRequest);
    } catch (error) {
      res.status(500).json({ message: "Failed to approve job request" });
    }
  });
  
  app.post("/api/job-requests/:id/reject", hasRole(["super_admin", "admin"]), async (req, res) => {
    try {
      const notes = req.body.notes;
      const jobRequest = await storage.rejectJobRequest(parseInt(req.params.id), notes);
      
      if (!jobRequest) {
        return res.status(404).json({ message: "Job request not found" });
      }
      
      res.json(jobRequest);
    } catch (error) {
      res.status(500).json({ message: "Failed to reject job request" });
    }
  });
  
  app.post("/api/job-requests/:id/publish", hasRole(["super_admin", "admin"]), async (req, res) => {
    try {
      const jobOpening = await storage.publishJobRequest(parseInt(req.params.id));
      
      if (!jobOpening) {
        return res.status(404).json({ message: "Job request not found or not approved" });
      }
      
      res.json(jobOpening);
    } catch (error) {
      res.status(500).json({ message: "Failed to publish job request" });
    }
  });
  
  // Video conferencing routes
  app.post("/api/video/token", isAuthenticated, async (req, res) => {
    try {
      const { identity, roomName } = req.body;
      
      if (!identity || !roomName) {
        return res.status(400).json({ message: "Identity and roomName are required" });
      }
      
      const token = generateVideoToken(identity, roomName);
      res.json({ token });
    } catch (error: any) {
      console.error("Error generating video token:", error);
      res.status(500).json({ message: "Failed to generate video token", error: error.message });
    }
  });
  
  app.post("/api/video/room", isAuthenticated, async (req, res) => {
    try {
      const { roomName } = req.body;
      
      if (!roomName) {
        return res.status(400).json({ message: "Room name is required" });
      }
      
      const room = await createVideoRoom(roomName);
      res.json({ room });
    } catch (error: any) {
      console.error("Error creating video room:", error);
      res.status(500).json({ message: "Failed to create video room", error: error.message });
    }
  });
  
  app.post("/api/video/room/end", isAuthenticated, async (req, res) => {
    try {
      const { roomName } = req.body;
      
      if (!roomName) {
        return res.status(400).json({ message: "Room name is required" });
      }
      
      const result = await endVideoRoom(roomName);
      res.json({ success: true, result });
    } catch (error: any) {
      console.error("Error ending video room:", error);
      res.status(500).json({ message: "Failed to end video room", error: error.message });
    }
  });
  
  app.get("/api/video/rooms", isAuthenticated, async (req, res) => {
    try {
      const rooms = await listVideoRooms();
      res.json({ rooms });
    } catch (error: any) {
      console.error("Error listing video rooms:", error);
      res.status(500).json({ message: "Failed to list video rooms", error: error.message });
    }
  });
  
  // Prospects Database routes
  app.get("/api/prospects-database", isAuthenticated, async (req, res) => {
    try {
      console.log("Getting prospects database...");
      
      // Get all prospects from the database
      const prospectsData = await storage.getProspectsDatabase();
      console.log("Prospects database records retrieved:", prospectsData.length);
      res.json(prospectsData);
    } catch (error) {
      console.error("Error retrieving prospects database:", error);
      res.status(500).json({ message: "Failed to retrieve prospects database", error: String(error) });
    }
  });
  
  app.get("/api/prospects-database/:id", isAuthenticated, async (req, res) => {
    try {
      const prospectData = await storage.getProspectDatabase(parseInt(req.params.id));
      if (!prospectData) {
        return res.status(404).json({ message: "Prospect not found" });
      }
      res.json(prospectData);
    } catch (error) {
      res.status(500).json({ message: "Failed to retrieve prospect" });
    }
  });
  
  app.post("/api/prospects-database", isAuthenticated, async (req, res) => {
    try {
      const prospectData = insertProspectDatabaseSchema.parse(req.body);
      const prospect = await storage.createProspectDatabase(prospectData);
      res.status(201).json(prospect);
    } catch (error) {
      if (error instanceof ZodError) {
        return handleZodError(error, res);
      }
      res.status(500).json({ message: "Failed to create prospect in database" });
    }
  });
  
  app.put("/api/prospects-database/:id", isAuthenticated, async (req, res) => {
    try {
      const prospectData = insertProspectDatabaseSchema.partial().parse(req.body);
      const updatedProspect = await storage.updateProspectDatabase(parseInt(req.params.id), prospectData);
      if (!updatedProspect) {
        return res.status(404).json({ message: "Prospect not found" });
      }
      res.json(updatedProspect);
    } catch (error) {
      if (error instanceof ZodError) {
        return handleZodError(error, res);
      }
      res.status(500).json({ message: "Failed to update prospect in database" });
    }
  });
  
  // Add PATCH endpoint for partial updates (client/company association)
  app.patch("/api/prospects-database/:id", isAuthenticated, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      
      // Create a schema for validating only the fields we want to update
      const updateSchema = z.object({
        clientId: z.number().nullable().optional(),
        companyId: z.number().nullable().optional(),
      });
      
      const validatedData = updateSchema.parse(req.body);
      
      // If updating company, verify it belongs to the client if clientId is provided
      if (validatedData.companyId && validatedData.clientId) {
        const company = await storage.getCompany(validatedData.companyId);
        if (!company) {
          return res.status(404).json({ message: "Company not found" });
        }
        
        if (company.clientId !== validatedData.clientId) {
          return res.status(400).json({ 
            message: "Invalid company selection. The company must belong to the selected client." 
          });
        }
      } else if (validatedData.companyId && !validatedData.clientId) {
        // If updating only company, get the company and set the clientId accordingly
        const company = await storage.getCompany(validatedData.companyId);
        if (!company) {
          return res.status(404).json({ message: "Company not found" });
        }
        
        // Set the clientId to match the company's client
        validatedData.clientId = company.clientId;
      }
      
      // Update the prospect in the database
      const updatedProspect = await storage.updateProspectDatabase(id, validatedData);
      if (!updatedProspect) {
        return res.status(404).json({ message: "Prospect not found" });
      }
      
      res.json(updatedProspect);
    } catch (error) {
      console.error("Error updating prospect:", error);
      if (error instanceof ZodError) {
        return handleZodError(error, res);
      }
      res.status(500).json({ 
        message: "Failed to update prospect", 
        error: error instanceof Error ? error.message : String(error) 
      });
    }
  });
  
  // Add to sourcing endpoint - creates a new prospect from a prospect database entry
  app.post("/api/prospects-database/:id/move-to-sourcing", isAuthenticated, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      
      // Get the prospect database entry
      const prospectData = await storage.getProspectDatabase(id);
      if (!prospectData) {
        return res.status(404).json({ message: "Prospect not found in database" });
      }
      
      // Split name into first and last names safely (handling null values)
      const nameParts = prospectData.name?.split(' ') || ['', ''];
      const firstName = nameParts[0] || '';
      const lastName = nameParts.slice(1).join(' ') || '';
      
      // Create a new prospect based on the database entry
      const newProspect = {
        firstName,
        lastName,
        email: prospectData.email || '', 
        phone: prospectData.phone || null,
        position: prospectData.rolePosition || '',
        skills: prospectData.programTools || null,
        resume: prospectData.resume || null,
        status: "sourcing" as const, // Use type assertion to match the expected type
        // Pass client and company IDs if they exist
        clientId: prospectData.clientId || null,
        companyId: prospectData.companyId || null,
        notes: `Imported from prospect database. 
Country: ${prospectData.country || 'Not specified'}
English level: ${prospectData.englishLevel || 'Not specified'}
Other role of interest: ${prospectData.otherRoleOfInterest || 'Not specified'}`
      };
      
      // Create the prospect
      const createdProspect = await storage.createProspect(newProspect);
      
      // Update the prospect database entry to mark it as moved to sourcing
      await storage.updateProspectDatabase(id, { status: 'moved to sourcing' });
      
      res.status(201).json({
        message: "Prospect moved to sourcing successfully",
        prospect: createdProspect
      });
    } catch (error) {
      console.error("Error moving prospect to sourcing:", error);
      res.status(500).json({ message: "Failed to move prospect to sourcing", error: String(error) });
    }
  });
  
  const httpServer = createServer(app);
  return httpServer;
}
