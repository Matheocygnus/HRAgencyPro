import { db } from "../server/db";
import { prospects, companies, clients, heroes, InsertProspect, InsertHero } from "../shared/schema";
import { hashPassword } from "../server/auth";
import { eq } from "drizzle-orm";

// Function to parse the CSV-like data from the text file
function parseProspectData(data: string): any[] {
  const lines = data.trim().split("\n");
  const parsedData = lines.map(line => {
    const fields = line.split("\t");
    return {
      firstName: fields[0]?.trim() || "",
      lastName: fields[1]?.trim() || "",
      position: fields[2]?.trim() || "",
      company: fields[3]?.trim() || "",
      jobType: fields[4]?.trim() || "",
      startDate: fields[5]?.trim() || "",
      email: fields[6]?.trim() || "",
      phone: fields[7]?.trim() || "",
      linkedIn: fields[8]?.trim() || "",
      resume: fields[9]?.trim() || "",
      address: fields[11]?.trim() || ""
    };
  });
  return parsedData;
}

// Function to insert a company if it doesn't exist
async function getOrCreateCompany(companyName: string, clientId: number) {
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
        industry: "Technology", // Default industry as placeholder
        location: "Remote" // Default location
      })
      .returning();
    
    console.log(`Created new company ${companyName} with ID: ${newCompany.id}`);
    return newCompany;
  }
}

// Function to insert a client if it doesn't exist
async function getOrCreateClient(clientName: string) {
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
        email: "client@example.com", // Placeholder
        phone: "", // Optional
        status: "active"
      })
      .returning();
    
    console.log(`Created new client ${clientName} with ID: ${newClient.id}`);
    return newClient;
  }
}

// Function to create a prospect
async function createProspect(prospectData: any, clientId: number, companyId: number): Promise<number> {
  try {
    // Convert the data into the format expected by the schema
    const insertData: Partial<InsertProspect> = {
      firstName: prospectData.firstName,
      lastName: prospectData.lastName,
      email: prospectData.email,
      phone: prospectData.phone || "",
      position: prospectData.position || "Developer",
      skills: prospectData.linkedIn || "",
      resume: prospectData.resume || "",
      status: "hired", // Setting directly to hired since we're going to convert to heroes
      clientId: clientId,
      companyId: companyId,
      notes: `Job Type: ${prospectData.jobType}\nAddress: ${prospectData.address}`
    };

    // Check if prospect with this email already exists
    const existingProspect = await db.select()
      .from(prospects)
      .where(eq(prospects.email, prospectData.email))
      .limit(1);

    if (existingProspect.length > 0) {
      console.log(`Prospect with email ${prospectData.email} already exists with ID: ${existingProspect[0].id}`);
      return existingProspect[0].id;
    }

    // Create the prospect
    const [newProspect] = await db.insert(prospects)
      .values({
        firstName: insertData.firstName || "",
        lastName: insertData.lastName || "",
        email: insertData.email || "",
        phone: insertData.phone || "",
        position: insertData.position || "Developer",
        skills: insertData.skills || "",
        resume: insertData.resume || "",
        status: "hired",
        clientId: insertData.clientId,
        companyId: insertData.companyId,
        notes: insertData.notes || ""
      })
      .returning();
    
    console.log(`Created prospect: ${prospectData.firstName} ${prospectData.lastName} with ID: ${newProspect.id}`);
    return newProspect.id;
  } catch (error) {
    console.error('Error creating prospect:', error);
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
    console.error('Error converting prospect to hero:', error);
    throw error;
  }
}

// Main function to process all data
async function importProspectsAndConvertToHeroes(data: string) {
  const parsedData = parseProspectData(data);
  console.log(`Parsed ${parsedData.length} prospect records.`);
  
  for (const record of parsedData) {
    try {
      if (!record.email || !record.firstName || !record.lastName) {
        console.warn('Skipping record due to missing required fields:', record);
        continue;
      }

      // Get or create client - using either the company field or "Remote Hero" as default
      const clientName = "Remote Hero"; // Default client 
      const client = await getOrCreateClient(clientName);
      
      // Get or create company
      const companyName = record.company || "Remote Hero";
      const company = await getOrCreateCompany(companyName, client.id);
      
      // Create prospect
      const prospectId = await createProspect(record, client.id, company.id);
      
      // Convert to hero
      await convertToHero(prospectId, client.id, company.id, record.startDate);
      
      console.log(`Successfully processed: ${record.firstName} ${record.lastName}`);
    } catch (error) {
      console.error(`Error processing record: ${record.firstName} ${record.lastName}`, error);
    }
  }
}

// Main execution
// Data contains the pasted prospect information
const prospectData = `Adrian    Moreno                                  aemeonline96@gmail.com                                          
Agustin         Mandarini       Web Developer   Team 63 Solutions (Before Catch Corner) Fulltime        3/1/2024        agustinmandarini47@gmail.com                                            
Agustin         Puentes Administrative  Team 63 Solutions (Before Catch Corner) Part-Time Weekends      1/8/2024        agustin5puentes@gmail.com                                               
Andres  Fernandez                                       aandresfh19@gmail.com                                           
Antonella       Barbieri        HR and Project Management       Remote Hero     Full-Time       9/9/2024        antobarbieriok@gmail.com                                                
Benito  Barrett Sales Representative    Remote Hero     Full-Time       2/23/2025       benitostar28@gmail.com  1876866-4127     https://www.linkedin.com/in/benito-barrett-123226152/details/skills/   Benito Barrett- SDR resume.pdf          1056 West Road, Westchester, Portmore, St. Catherine, Jamaica.  
Bruno   Viscay  Project Manager Catalyst Growth Systems Full-Time       5/27/2024       brunoviscay@gmail.com                                           
Camila  Lopez   Project Manager Brand North     Full-Time       8/30/2024       camilalopezbriozzo@gmail.com                                            
Camila  Mangueira       Administrative  Superior Capital        Full-Time       12/2/2024       adv.camilamangueira@gmail.com                                           
Camila  Biocca  Social Media and Marketing      Catalyst Growth Systems Full-Time       2/5/2024                                                        
Camilo  Torres  Data Analyst    Team 63 Solutions (Before Catch Corner) Full-Time       12/3/2024       juancamilotorresr@gmail.com                                             
Elisa   Mendoza Booking Support Specialist      Team 63 Solutions (Before Catch Corner) sat/sun 3-11pm  8/1/2024        eli.mendoza@live.com.ar                                         
Enrique         Arteaga                                         enriquearteaga23@gmail.com                                              
Eric    Renner  Sync    Team 63 Solutions (Before Catch Corner) Full-Time       8/1/2024        eric-renner@hotmail.com                                         
Facundo         Samartano       Sync Coordinator        Team 63 Solutions (Before Catch Corner) Full-Time       8/1/2024        facundo.samartano@gmail.com                                             
Francesca       Samartano       Sales Representative    Remote Hero     Part-Time       2/14/2025       fransamartano@gmail.com                                         
Gaston  Arguello        Sales Representative    Remote Hero     Full-Time       2/23/2025       gasdgk@gmail.com        543413295453                            Santiago 2670, Rosario, Santa Fe Argentina      
Gonzalo         Pittaluga       Project Manager Team 63 Solutions (Before Catch Corner) Full-Time       10/1/2024       gonzapittaluga@gmail.com                                                
Jacqueline      Urban                                   jacquelineurban.ar@gmail.com                                            
Jhulitza        Taboada Researcher      Team 63 Solutions (Before Catch Corner) Full-Time       1/21/2025       jhulitzataboadamendoza@gmail.com                                                
Jose    Sanchez Administrative  Remote Hero     Part-Time               josefus33@gmail.com                                             
Juan    Manuel  Booking Support Specialist      Team 63 Solutions (Before Catch Corner) M-F 3pm-11pm    8/30/2024       barrajmanuel@gmail.com                                          
Julia   Almeida Data Entry      Team 63 Solutions (Before Catch Corner) Full-Time       12/2/2024       juliaralmeidaj@gmail.com                                                
Kervin  Roca    Administrative  Team 63 Solutions (Before Catch Corner) Monday-Sunday 9-4pm     12/18/2023      kervinplus@gmail.com    407 - 728 - 5582                Cv KervinRoca.pdf               6809 53rd Ave, Maspeth NY 11378 
Lautaro         Tello   Sales Representative    Team 63 Solutions (Before Catch Corner) Full-Time       10/1/2024       lautaro_t11@hotmail.com                                         
Lizeth  Lopez Laverde   Lead Research   Team 63 Solutions (Before Catch Corner) Full-Time       3/25/2025       limlopezla@unal.edu.co                                          
Luciana         Barra                                   lucianabarra2@gmail.com                                         
Luciana Ailin   Rizzo   Social Media    Remote Hero     Part-Time       2/15/2024       luciana.ai.rizzo@gmail.com                                              
Luciana Ailin   Rizzo   Social Media    Pearl Benefits Group    Part-Time       2/15/2024       luciana.ai.rizzo@gmail.com                                              
Luciano         Cavallo Administrative  Team 63 Solutions (Before Catch Corner) Full-Time       10/1/2024       Luciano.cavallo98@gmail.com                                             
Luna    Memoli  Social Media and Marketing      Catalyst Growth Systems Full-Time       6/3/2024        luna.memoli@gmail.com                                           
Macarena        Portorrico      Lead Research   Team 63 Solutions (Before Catch Corner) Part-Time       12/18/2023      mportorrico@gmail.com                                           
Maira Carolina  Ramos   Booking Support Team 63 Solutions (Before Catch Corner) M-F 9-3pm       8/1/2024        maicarah@gmail.com                                              
Maria Gabriela  Perez   Sync    Team 63 Solutions (Before Catch Corner) Full-Time       11/9/2024       gabrielaremotehero@gmail.com                                            
Mariano         Gorriti Project Coordinator     Brand North     Full-Time       8/12/2024       marianogorriti.it@gmail.com                                             
Mariela         Archondo                                        boliviajar@gmail.com                                            
Milko Jose      Bikic   Project Manager         Brand North     Full-Time       6/17/2024       milkobikic@gmail.com                                            
Natalia         Cardona Marketing Specialist    Heal Your Roots Wellness        Full-Time       12/23/2024      natacardozocardona@gmail.com                                            
Nathalia        Torrez  Lead Research   Team 63 Solutions (Before Catch Corner) Full-Time       3/25/2025       nathitat109@gmail.com                                           
Nicolas         Castagnet       Web Developer   Team 63 Solutions (Before Catch Corner) 9 am - 4:30 pm  12/18/2023      nicolascastagnet002@gmail.com   +54 9 291 463-8434      https://www.linkedin.com/in/nicolas-castagnet/  CV Nicolas Castagnet - Fullstack (ENG).pdf              Bahía Blanca, Buenos Aires - Argentina. 
Nicole  Muia    Administrative  Remote Hero     Part-Time       10/2/2023       nicolemuia93@gmail.com                                          
Nicole  Muia    Administrative  Team 63 Solutions (Before Catch Corner) Full-Time       4/1/2024        nicolemuia93@gmail.com                                          
Paula   Albi    Marketing Coordinator   Deeper Connecting       Full-Time               albi.paula@gmail.com                                            
Paula   Ramirez Data Entry Specialist   Team 63 Solutions (Before Catch Corner) Full-Time               pauvictoriar@gmail.com                                          
Raissa  Udovicich               Brand North                     rai.udovicich@gmail.com                                         
Rommel  Aranguren       Web Developer   Team 63 Solutions (Before Catch Corner) Full-Time       12/18/2023      rommel.aranguren@gmail.com                                      Ecuador 1632 - CABA. Bs As      
Yamila  Perez                                   yamilaperez94@gmail.com`;

// Call the main function
importProspectsAndConvertToHeroes(prospectData)
  .then(() => {
    console.log('Import completed successfully');
    process.exit(0);
  })
  .catch(error => {
    console.error('Import failed:', error);
    process.exit(1);
  });