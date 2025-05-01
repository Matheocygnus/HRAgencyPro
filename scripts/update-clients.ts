import { db } from "../server/db";
import { clients, companies } from "../shared/schema";
import { eq } from "drizzle-orm";

// Client data structure
interface ClientData {
  name: string;
  contactPerson: string;
  email: string;
  phone?: string;
  position?: string;
  companies: string[];
}

// Client data provided by user
const clientsData: ClientData[] = [
  {
    name: "Brand North",
    contactPerson: "Gene Milman",
    email: "gene@brandnorth.com",
    position: "COO",
    companies: ["Brand North"]
  },
  {
    name: "Valley Spring Recovery Center",
    contactPerson: "Michael O'Sullivan",
    email: "mosullivan@valleyspringrc.com",
    companies: ["Valley Spring Recovery Center"]
  },
  {
    name: "Catalyst Growth Systems",
    contactPerson: "Aran Ploshansky",
    email: "aran@catalystgrowthsystems.com",
    companies: ["Catalyst Growth Systems", "Heal Your Roots Wellness", "Deeper Connecting"]
  },
  {
    name: "Pearl Benefits Group",
    contactPerson: "Jay Abramowitz",
    email: "jay.a@pearlbenefitsgroup.com",
    position: "CEO",
    companies: ["Pearl Benefits Group"]
  },
  {
    name: "Team 63 Solutions",
    contactPerson: "Ben Simon",
    email: "ben@catchcorner.com",
    companies: ["Team 63 Solutions"]
  },
  {
    name: "Superior Capital",
    contactPerson: "Alex Mantofel",
    email: "alex@superiorcapital.net",
    companies: ["Superior Capital"]
  },
  {
    name: "Team 63 Solutions",
    contactPerson: "Francesca",
    email: "francesca@catchcorner.com",
    companies: ["Team 63 Solutions"]
  },
  {
    name: "Heal Your Roots Wellness",
    contactPerson: "Kira Ploshansky",
    email: "kira@healyourrootswellness.com",
    companies: ["Heal Your Roots Wellness", "Deeper Connecting"]
  },
  {
    name: "Team 63 Solutions",
    contactPerson: "Jonathan Azouri",
    email: "jonathan@catchcorner.com",
    position: "CEO",
    companies: ["Team 63 Solutions"]
  },
  {
    name: "Team 63 Solutions",
    contactPerson: "Maya Azouri",
    email: "maya@catchcorner.com",
    position: "COO",
    companies: ["Team 63 Solutions"]
  },
  {
    name: "Brand North",
    contactPerson: "George Kocher",
    email: "george@brandnorth.com",
    position: "CEO",
    companies: ["Brand North", "Sector Solutions"]
  },
  {
    name: "Team 63 Solutions",
    contactPerson: "Jesse",
    email: "jesse@catchcorner.com",
    companies: ["Team 63 Solutions"]
  },
  {
    name: "Azure Skincare",
    contactPerson: "David Klar",
    email: "david@klarandco.com",
    phone: "+1 (917) 755-1430",
    position: "CEO",
    companies: ["Azure Skincare", "Klar and Co"]
  }
];

// Primary clients (first contact person for each unique client company)
const uniqueClientsByName = new Map<string, ClientData>();

// Process the clients to get unique primary clients
clientsData.forEach(client => {
  if (!uniqueClientsByName.has(client.name)) {
    uniqueClientsByName.set(client.name, client);
  }
});

// Function to update a client
async function updateClient(client: ClientData) {
  try {
    // Check if client already exists
    const existingClient = await db.select()
      .from(clients)
      .where(eq(clients.name, client.name))
      .limit(1);

    if (existingClient.length > 0) {
      // Update the existing client
      await db.update(clients)
        .set({
          contactPerson: client.contactPerson,
          email: client.email,
          phone: client.phone || "",
        })
        .where(eq(clients.id, existingClient[0].id));
      
      console.log(`Updated client: ${client.name} with contact ${client.contactPerson}`);
      return existingClient[0].id;
    } else {
      // Create a new client
      const [newClient] = await db.insert(clients)
        .values({
          name: client.name,
          contactPerson: client.contactPerson,
          email: client.email,
          phone: client.phone || "",
          status: "active"
        })
        .returning();
      
      console.log(`Created new client: ${client.name} with id ${newClient.id}`);
      return newClient.id;
    }
  } catch (error) {
    console.error(`Error updating client ${client.name}:`, error);
    throw error;
  }
}

// Function to update or create a company
async function ensureCompanyExists(companyName: string, clientId: number) {
  try {
    // Check if company already exists
    const existingCompany = await db.select()
      .from(companies)
      .where(eq(companies.name, companyName))
      .limit(1);

    if (existingCompany.length > 0) {
      // Update company's client ID if different
      if (existingCompany[0].clientId !== clientId) {
        await db.update(companies)
          .set({ clientId })
          .where(eq(companies.id, existingCompany[0].id));
        
        console.log(`Updated company ${companyName} with client ID ${clientId}`);
      } else {
        console.log(`Company ${companyName} already exists with correct client ID`);
      }
      return existingCompany[0].id;
    } else {
      // Create a new company
      const [newCompany] = await db.insert(companies)
        .values({
          name: companyName,
          clientId,
          industry: "Technology",
          location: "Remote"
        })
        .returning();
      
      console.log(`Created new company: ${companyName} with id ${newCompany.id}`);
      return newCompany.id;
    }
  } catch (error) {
    console.error(`Error ensuring company ${companyName} exists:`, error);
    throw error;
  }
}

// Main function to update all clients and their companies
async function updateAllClients() {
  console.log("Starting client update process...");
  
  // First, process all the unique primary clients
  for (const [clientName, clientData] of uniqueClientsByName.entries()) {
    try {
      // Update or create the client
      const clientId = await updateClient(clientData);
      
      // Ensure all companies exist and are linked to this client
      for (const companyName of clientData.companies) {
        await ensureCompanyExists(companyName, clientId);
      }
      
      console.log(`Successfully processed primary client: ${clientName}`);
    } catch (error) {
      console.error(`Error processing primary client ${clientName}:`, error);
    }
  }
  
  console.log("Client update process completed!");
}

// Run the update function
updateAllClients()
  .then(() => {
    console.log("Client database update completed successfully!");
    process.exit(0);
  })
  .catch(error => {
    console.error("Update failed:", error);
    process.exit(1);
  });