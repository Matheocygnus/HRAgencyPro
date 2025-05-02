// This script creates the prospects_database table

const { db, pool } = require('../server/db');
const { prospectsDatabase } = require('../shared/schema');
const { eq } = require('drizzle-orm');

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
    
    // Test if the table exists by querying it
    try {
      const result = await db.select().from(prospectsDatabase).limit(1);
      console.log('Table query test succeeded:', result);
    } catch (error) {
      console.error('Error querying the new table:', error);
    }
    
  } catch (error) {
    console.error('Error creating prospects_database table:', error);
  } finally {
    // Close the database connection
    await pool.end();
  }
}

createProspectsDatabaseTable();