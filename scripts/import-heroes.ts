import { db } from "../server/db";
import { prospects, companies, clients, heroes, InsertProspect, InsertHero } from "../shared/schema";
import { eq } from "drizzle-orm";

// Manual parsing of the prospect data
const prospectData = [
  { firstName: 'Adrian', lastName: 'Moreno', position: '', company: '', jobType: '', startDate: '', email: 'aemeonline96@gmail.com' },
  { firstName: 'Agustin', lastName: 'Mandarini', position: 'Web Developer', company: 'Team 63 Solutions', jobType: 'Fulltime', startDate: '3/1/2024', email: 'agustinmandarini47@gmail.com' },
  { firstName: 'Agustin', lastName: 'Puentes', position: 'Administrative', company: 'Team 63 Solutions', jobType: 'Part-Time Weekends', startDate: '1/8/2024', email: 'agustin5puentes@gmail.com' },
  { firstName: 'Andres', lastName: 'Fernandez', position: '', company: '', jobType: '', startDate: '', email: 'aandresfh19@gmail.com' },
  { firstName: 'Antonella', lastName: 'Barbieri', position: 'HR and Project Management', company: 'Remote Hero', jobType: 'Full-Time', startDate: '9/9/2024', email: 'antobarbieriok@gmail.com' },
  { firstName: 'Benito', lastName: 'Barrett', position: 'Sales Representative', company: 'Remote Hero', jobType: 'Full-Time', startDate: '2/23/2025', email: 'benitostar28@gmail.com', phone: '1876866-4127' },
  { firstName: 'Bruno', lastName: 'Viscay', position: 'Project Manager', company: 'Catalyst Growth Systems', jobType: 'Full-Time', startDate: '5/27/2024', email: 'brunoviscay@gmail.com' },
  { firstName: 'Camila', lastName: 'Lopez', position: 'Project Manager', company: 'Brand North', jobType: 'Full-Time', startDate: '8/30/2024', email: 'camilalopezbriozzo@gmail.com' },
  { firstName: 'Camila', lastName: 'Mangueira', position: 'Administrative', company: 'Superior Capital', jobType: 'Full-Time', startDate: '12/2/2024', email: 'adv.camilamangueira@gmail.com' },
  { firstName: 'Camila', lastName: 'Biocca', position: 'Social Media and Marketing', company: 'Catalyst Growth Systems', jobType: 'Full-Time', startDate: '2/5/2024', email: '' },
  { firstName: 'Camilo', lastName: 'Torres', position: 'Data Analyst', company: 'Team 63 Solutions', jobType: 'Full-Time', startDate: '12/3/2024', email: 'juancamilotorresr@gmail.com' },
  { firstName: 'Elisa', lastName: 'Mendoza', position: 'Booking Support Specialist', company: 'Team 63 Solutions', jobType: 'sat/sun 3-11pm', startDate: '8/1/2024', email: 'eli.mendoza@live.com.ar' },
  { firstName: 'Enrique', lastName: 'Arteaga', position: '', company: '', jobType: '', startDate: '', email: 'enriquearteaga23@gmail.com' },
  { firstName: 'Eric', lastName: 'Renner', position: 'Sync', company: 'Team 63 Solutions', jobType: 'Full-Time', startDate: '8/1/2024', email: 'eric-renner@hotmail.com' },
  { firstName: 'Facundo', lastName: 'Samartano', position: 'Sync Coordinator', company: 'Team 63 Solutions', jobType: 'Full-Time', startDate: '8/1/2024', email: 'facundo.samartano@gmail.com' },
  { firstName: 'Francesca', lastName: 'Samartano', position: 'Sales Representative', company: 'Remote Hero', jobType: 'Part-Time', startDate: '2/14/2025', email: 'fransamartano@gmail.com' },
  { firstName: 'Gaston', lastName: 'Arguello', position: 'Sales Representative', company: 'Remote Hero', jobType: 'Full-Time', startDate: '2/23/2025', email: 'gasdgk@gmail.com', phone: '543413295453' },
  { firstName: 'Gonzalo', lastName: 'Pittaluga', position: 'Project Manager', company: 'Team 63 Solutions', jobType: 'Full-Time', startDate: '10/1/2024', email: 'gonzapittaluga@gmail.com' },
  { firstName: 'Jacqueline', lastName: 'Urban', position: '', company: '', jobType: '', startDate: '', email: 'jacquelineurban.ar@gmail.com' },
  { firstName: 'Jhulitza', lastName: 'Taboada', position: 'Researcher', company: 'Team 63 Solutions', jobType: 'Full-Time', startDate: '1/21/2025', email: 'jhulitzataboadamendoza@gmail.com' },
  { firstName: 'Jose', lastName: 'Sanchez', position: 'Administrative', company: 'Remote Hero', jobType: 'Part-Time', startDate: '', email: 'josefus33@gmail.com' },
  { firstName: 'Juan', lastName: 'Manuel', position: 'Booking Support Specialist', company: 'Team 63 Solutions', jobType: 'M-F 3pm-11pm', startDate: '8/30/2024', email: 'barrajmanuel@gmail.com' },
  { firstName: 'Julia', lastName: 'Almeida', position: 'Data Entry', company: 'Team 63 Solutions', jobType: 'Full-Time', startDate: '12/2/2024', email: 'juliaralmeidaj@gmail.com' },
  { firstName: 'Kervin', lastName: 'Roca', position: 'Administrative', company: 'Team 63 Solutions', jobType: 'Monday-Sunday 9-4pm', startDate: '12/18/2023', email: 'kervinplus@gmail.com', phone: '407-728-5582' },
  { firstName: 'Lautaro', lastName: 'Tello', position: 'Sales Representative', company: 'Team 63 Solutions', jobType: 'Full-Time', startDate: '10/1/2024', email: 'lautaro_t11@hotmail.com' },
  { firstName: 'Lizeth', lastName: 'Lopez Laverde', position: 'Lead Research', company: 'Team 63 Solutions', jobType: 'Full-Time', startDate: '3/25/2025', email: 'limlopezla@unal.edu.co' },
  { firstName: 'Luciana', lastName: 'Barra', position: '', company: '', jobType: '', startDate: '', email: 'lucianabarra2@gmail.com' },
  { firstName: 'Luciana Ailin', lastName: 'Rizzo', position: 'Social Media', company: 'Remote Hero', jobType: 'Part-Time', startDate: '2/15/2024', email: 'luciana.ai.rizzo@gmail.com' },
  { firstName: 'Luciana Ailin', lastName: 'Rizzo', position: 'Social Media', company: 'Pearl Benefits Group', jobType: 'Part-Time', startDate: '2/15/2024', email: 'luciana.ai.rizzo@gmail.com' },
  { firstName: 'Luciano', lastName: 'Cavallo', position: 'Administrative', company: 'Team 63 Solutions', jobType: 'Full-Time', startDate: '10/1/2024', email: 'Luciano.cavallo98@gmail.com' },
  { firstName: 'Luna', lastName: 'Memoli', position: 'Social Media and Marketing', company: 'Catalyst Growth Systems', jobType: 'Full-Time', startDate: '6/3/2024', email: 'luna.memoli@gmail.com' },
  { firstName: 'Macarena', lastName: 'Portorrico', position: 'Lead Research', company: 'Team 63 Solutions', jobType: 'Part-Time', startDate: '12/18/2023', email: 'mportorrico@gmail.com' },
  { firstName: 'Maira Carolina', lastName: 'Ramos', position: 'Booking Support', company: 'Team 63 Solutions', jobType: 'M-F 9-3pm', startDate: '8/1/2024', email: 'maicarah@gmail.com' },
  { firstName: 'Maria Gabriela', lastName: 'Perez', position: 'Sync', company: 'Team 63 Solutions', jobType: 'Full-Time', startDate: '11/9/2024', email: 'gabrielaremotehero@gmail.com' },
  { firstName: 'Mariano', lastName: 'Gorriti', position: 'Project Coordinator', company: 'Brand North', jobType: 'Full-Time', startDate: '8/12/2024', email: 'marianogorriti.it@gmail.com' },
  { firstName: 'Mariela', lastName: 'Archondo', position: '', company: '', jobType: '', startDate: '', email: 'boliviajar@gmail.com' },
  { firstName: 'Milko Jose', lastName: 'Bikic', position: 'Project Manager', company: 'Brand North', jobType: 'Full-Time', startDate: '6/17/2024', email: 'milkobikic@gmail.com' },
  { firstName: 'Natalia', lastName: 'Cardona', position: 'Marketing Specialist', company: 'Heal Your Roots Wellness', jobType: 'Full-Time', startDate: '12/23/2024', email: 'natacardozocardona@gmail.com' },
  { firstName: 'Nathalia', lastName: 'Torrez', position: 'Lead Research', company: 'Team 63 Solutions', jobType: 'Full-Time', startDate: '3/25/2025', email: 'nathitat109@gmail.com' },
  { firstName: 'Nicolas', lastName: 'Castagnet', position: 'Web Developer', company: 'Team 63 Solutions', jobType: '9 am - 4:30 pm', startDate: '12/18/2023', email: 'nicolascastagnet002@gmail.com', phone: '+54 9 291 463-8434' },
  { firstName: 'Nicole', lastName: 'Muia', position: 'Administrative', company: 'Remote Hero', jobType: 'Part-Time', startDate: '10/2/2023', email: 'nicolemuia93@gmail.com' },
  { firstName: 'Nicole', lastName: 'Muia', position: 'Administrative', company: 'Team 63 Solutions', jobType: 'Full-Time', startDate: '4/1/2024', email: 'nicolemuia93@gmail.com' },
  { firstName: 'Paula', lastName: 'Albi', position: 'Marketing Coordinator', company: 'Deeper Connecting', jobType: 'Full-Time', startDate: '', email: 'albi.paula@gmail.com' },
  { firstName: 'Paula', lastName: 'Ramirez', position: 'Data Entry Specialist', company: 'Team 63 Solutions', jobType: 'Full-Time', startDate: '', email: 'pauvictoriar@gmail.com' },
  { firstName: 'Raissa', lastName: 'Udovicich', position: '', company: 'Brand North', jobType: '', startDate: '', email: 'rai.udovicich@gmail.com' },
  { firstName: 'Rommel', lastName: 'Aranguren', position: 'Web Developer', company: 'Team 63 Solutions', jobType: 'Full-Time', startDate: '12/18/2023', email: 'rommel.aranguren@gmail.com', address: 'Ecuador 1632 - CABA. Bs As' },
  { firstName: 'Yamila', lastName: 'Perez', position: '', company: '', jobType: '', startDate: '', email: 'yamilaperez94@gmail.com' }
];

// Function to get or create a client
async function getOrCreateClient(clientName: string) {
  try {
    // Try to find existing client
    const existingClient = await db.select()
      .from(clients)
      .where(eq(clients.name, clientName))
      .limit(1);

    if (existingClient.length > 0) {
      console.log(`Client ${clientName} already exists with ID: ${existingClient[0].id}`);
      return existingClient[0];
    } else {
      // Create new client
      const [newClient] = await db.insert(clients)
        .values({
          name: clientName,
          contactPerson: "Contact Person", // Placeholder
          email: "contact@example.com", // Placeholder
          phone: "", // Optional
          status: "active"
        })
        .returning();
      
      console.log(`Created new client ${clientName} with ID: ${newClient.id}`);
      return newClient;
    }
  } catch (error) {
    console.error(`Error getting/creating client ${clientName}:`, error);
    throw error;
  }
}

// Function to get or create a company
async function getOrCreateCompany(companyName: string, clientId: number) {
  try {
    // Clean up company name
    companyName = companyName.replace('(Before Catch Corner)', '').trim();
    
    // Try to find existing company
    const existingCompany = await db.select()
      .from(companies)
      .where(eq(companies.name, companyName))
      .limit(1);

    if (existingCompany.length > 0) {
      console.log(`Company ${companyName} already exists with ID: ${existingCompany[0].id}`);
      return existingCompany[0];
    } else {
      // Create new company
      const [newCompany] = await db.insert(companies)
        .values({
          name: companyName,
          clientId: clientId,
          industry: "Technology", // Default industry
          location: "Remote" // Default location
        })
        .returning();
      
      console.log(`Created new company ${companyName} with ID: ${newCompany.id}`);
      return newCompany;
    }
  } catch (error) {
    console.error(`Error getting/creating company ${companyName}:`, error);
    throw error;
  }
}

// Function to create a prospect
async function createProspect(data: any, clientId: number, companyId: number): Promise<number> {
  try {
    // Check if prospect with this email already exists
    if (!data.email) {
      throw new Error('Missing email for prospect');
    }
    
    const existingProspect = await db.select()
      .from(prospects)
      .where(eq(prospects.email, data.email))
      .limit(1);

    if (existingProspect.length > 0) {
      console.log(`Prospect with email ${data.email} already exists with ID: ${existingProspect[0].id}`);
      return existingProspect[0].id;
    }

    // Create the prospect
    const [newProspect] = await db.insert(prospects)
      .values({
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        phone: data.phone || "",
        position: data.position || "Team Member",
        skills: "",
        resume: "",
        status: "hired", // Setting directly to hired since we're going to convert to heroes
        clientId: clientId,
        companyId: companyId,
        notes: `Job Type: ${data.jobType}\nAddress: ${data.address || ""}`,
        isInterviewed: true,
        isClientApproved: true,
        isBudgetAgreed: true
      })
      .returning();
    
    console.log(`Created prospect: ${data.firstName} ${data.lastName} with ID: ${newProspect.id}`);
    return newProspect.id;
  } catch (error) {
    console.error(`Error creating prospect ${data.firstName} ${data.lastName}:`, error);
    throw error;
  }
}

// Function to convert a prospect to a hero
async function convertToHero(prospectId: number, clientId: number, companyId: number, startDateStr?: string) {
  try {
    // Check if hero already exists for this prospect
    const existingHero = await db.select()
      .from(heroes)
      .where(eq(heroes.prospectId, prospectId))
      .limit(1);

    if (existingHero.length > 0) {
      console.log(`Hero for prospect ID ${prospectId} already exists with ID: ${existingHero[0].id}`);
      return existingHero[0];
    }

    // Parse start date if provided
    let startDate: Date | undefined;
    if (startDateStr) {
      try {
        // Try to parse the date (MM/DD/YYYY format)
        const parts = startDateStr.split('/');
        if (parts.length === 3) {
          startDate = new Date(
            parseInt(parts[2]), // Year
            parseInt(parts[0]) - 1, // Month (0-indexed)
            parseInt(parts[1]) // Day
          );
        }
      } catch (error) {
        console.warn(`Could not parse date: ${startDateStr}, using current date`);
      }
    }

    if (!startDate) {
      startDate = new Date(); // Use current date if no date provided or parsing failed
    }

    // Create the hero entry
    const heroData: InsertHero = {
      prospectId,
      clientId,
      companyId,
      startDate
    };

    const [newHero] = await db.insert(heroes)
      .values(heroData)
      .returning();

    console.log(`Created hero with ID: ${newHero.id} for prospect ID: ${prospectId}`);
    return newHero;
  } catch (error) {
    console.error(`Error converting prospect ${prospectId} to hero:`, error);
    throw error;
  }
}

// Main function to process all data
async function importProspectsAndConvertToHeroes() {
  console.log(`Processing ${prospectData.length} prospect records.`);
  
  let successCount = 0;
  let errorCount = 0;
  
  // Create "Remote Hero" as the default client
  const defaultClient = await getOrCreateClient("Remote Hero");
  
  for (const record of prospectData) {
    try {
      if (!record.email) {
        console.warn(`Skipping record due to missing email: ${record.firstName} ${record.lastName}`);
        errorCount++;
        continue;
      }

      // Get or create client - using the company name or default to "Remote Hero"
      const clientName = record.company ? record.company : "Remote Hero";
      let client;
      
      if (clientName === "Remote Hero") {
        client = defaultClient;
      } else {
        client = await getOrCreateClient(clientName);
      }
      
      // Get or create company
      const companyName = record.company || "Remote Hero";
      const company = await getOrCreateCompany(companyName, client.id);
      
      // Create prospect
      const prospectId = await createProspect(record, client.id, company.id);
      
      // Convert to hero
      await convertToHero(prospectId, client.id, company.id, record.startDate);
      
      console.log(`Successfully processed: ${record.firstName} ${record.lastName}`);
      successCount++;
    } catch (error) {
      console.error(`Error processing record: ${record.firstName} ${record.lastName}`, error);
      errorCount++;
    }
  }
  
  console.log(`Import completed. Success: ${successCount}, Errors: ${errorCount}`);
}

// Call the main function
importProspectsAndConvertToHeroes()
  .then(() => {
    console.log('Import process finished');
    process.exit(0);
  })
  .catch(error => {
    console.error('Import failed:', error);
    process.exit(1);
  });