import { db } from "../server/db";
import { prospectsDatabase } from "../shared/schema";
import { eq, or, inArray } from "drizzle-orm";

async function checkProspectsDatabase() {
  try {
    // Check for newly added prospects
    const names = ['Lourdes', 'Lucia', 'Sofia', 'Luis Azevedo', 'Paula Marulanda'];
    const newProspects = await db.select()
      .from(prospectsDatabase)
      .where(inArray(prospectsDatabase.name, names));
    
    console.log(`Found ${newProspects.length} new prospects:`);
    for (const prospect of newProspects) {
      console.log(`- ${prospect.name} (${prospect.rolePosition} - ${prospect.country})`);
    }
    
    // Get total count
    const allProspects = await db.select().from(prospectsDatabase);
    console.log(`\nTotal records in prospects_database: ${allProspects.length}`);
    
  } catch (error) {
    console.error("Error checking prospects database:", error);
  } finally {
    process.exit(0);
  }
}

checkProspectsDatabase();