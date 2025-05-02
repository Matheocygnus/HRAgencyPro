// This script creates the prospects_database table and imports data

import { db, pool } from '../server/db';
import { prospectsDatabase } from '../shared/schema';
import * as fs from 'fs';
import * as path from 'path';

async function createProspectsDatabaseTable() {
  try {
    console.log('Creating prospects_database table...');
    
    // Create the table
    await db.execute(`
      CREATE TABLE IF NOT EXISTS prospects_database (
        id SERIAL PRIMARY KEY,
        name TEXT,
        status TEXT,
        role_position TEXT,
        other_role_of_interest TEXT,
        vocaroo_record TEXT,
        resume TEXT,
        country TEXT,
        email TEXT,
        phone TEXT,
        program_tools TEXT,
        english_level TEXT,
        created_at TIMESTAMP DEFAULT now()
      )
    `);
    
    console.log('Prospects database table created successfully');
    return true;
  } catch (error) {
    console.error('Error creating prospects_database table:', error);
    return false;
  }
}

async function parseProspectsData() {
  try {
    // Read the file with the prospect data
    const filePath = path.resolve('./attached_assets/Pasted-Adrian-Moreno-Hired-Signing-contract-checked-He-has-been-working-in-marketing-and-content-relati-1746196945853.txt');
    const fileContent = fs.readFileSync(filePath, 'utf-8');
    
    // Parse the data - tab-separated values
    const lines = fileContent.split('\n').filter(line => line.trim() !== '');
    
    // Extract prospects data
    const prospects = lines.map(line => {
      const parts = line.split('\t');
      
      // Skip if line doesn't have enough columns
      if (parts.length < 2) {
        return null;
      }
      
      return {
        name: parts[0] ? parts[0].trim() : null,
        status: parts[1] ? parts[1].trim() : null,
        rolePosition: parts[3] ? parts[3].trim() : null,
        otherRoleOfInterest: parts[6] ? parts[6].trim() : null,
        vocarooRecord: parts[13] ? parts[13].trim() : null,
        resume: parts[14] ? parts[14].trim() : null,
        country: parts[15] ? parts[15].trim() : null,
        email: parts[17] ? parts[17].trim() : null,
        phone: parts[18] ? parts[18].trim() : null,
        programTools: parts[20] ? parts[20].trim() : null,
        englishLevel: parts[27] ? parts[27].trim() : null
      };
    }).filter(prospect => prospect && prospect.name);
    
    console.log(`Parsed ${prospects.length} prospects from data file`);
    return prospects;
  } catch (error) {
    console.error('Error parsing prospects data:', error);
    return [];
  }
}

async function importProspectsToDatabase() {
  try {
    // First ensure the table exists
    const tableCreated = await createProspectsDatabaseTable();
    
    if (!tableCreated) {
      console.error('Failed to create/verify table. Aborting import.');
      return;
    }
    
    // Parse the data
    const prospectsData = await parseProspectsData();
    
    if (prospectsData.length === 0) {
      console.log('No prospects data to import');
      return;
    }
    
    // Import data in batches
    console.log(`Importing ${prospectsData.length} prospects...`);
    
    // First clear existing data
    await db.delete(prospectsDatabase);
    console.log('Cleared existing data');
    
    let successCount = 0;
    
    // Insert prospects one by one (more robust than batch insert for inconsistent data)
    for (const prospect of prospectsData) {
      try {
        const result = await db.insert(prospectsDatabase).values({
          name: prospect.name,
          status: prospect.status,
          rolePosition: prospect.rolePosition,
          otherRoleOfInterest: prospect.otherRoleOfInterest,
          vocarooRecord: prospect.vocarooRecord,
          resume: prospect.resume,
          country: prospect.country,
          email: prospect.email,
          phone: prospect.phone,
          programTools: prospect.programTools,
          englishLevel: prospect.englishLevel
        }).returning();
        
        successCount++;
        
        if (successCount % 10 === 0) {
          console.log(`Imported ${successCount} prospects so far...`);
        }
      } catch (error) {
        console.error(`Error importing prospect ${prospect.name}:`, error);
      }
    }
    
    console.log(`Successfully imported ${successCount} prospects out of ${prospectsData.length}`);
    
    // Verify import
    const count = await db.select({ count: db.fn.count() }).from(prospectsDatabase);
    console.log(`Total prospects in database: ${count[0].count}`);
    
  } catch (error) {
    console.error('Error importing prospects:', error);
  } finally {
    // Close the database connection
    await pool.end();
  }
}

// Run the import
importProspectsToDatabase();