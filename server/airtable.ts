import Airtable from 'airtable';

// Configure Airtable with API key
export const configureAirtable = () => {
  if (!process.env.AIRTABLE_API_KEY) {
    throw new Error('AIRTABLE_API_KEY environment variable is not set');
  }
  
  Airtable.configure({
    apiKey: process.env.AIRTABLE_API_KEY,
  });
  
  if (!process.env.AIRTABLE_BASE_ID) {
    throw new Error('AIRTABLE_BASE_ID environment variable is not set');
  }
  
  return Airtable.base(process.env.AIRTABLE_BASE_ID);
};

// Define the basic user type from pasted data
export interface AirtablePerson {
  fullName: string;
  firstName: string;
  lastName: string;
  role?: string;
  company?: string;
  employmentType?: string;
  startDate?: string;
  email: string;
  phone?: string;
  linkedIn?: string;
  resumeUrl?: string;
  address?: string;
  status?: string;
}

// Map to determine if a person is a hero or a prospect based on their status
const statusMapping = {
  '🟩 Completed': 'hero',
  '🟥 In progress': 'prospect',
};

// Get all records from a table
export const getRecordsFromTable = async (tableName: string) => {
  const base = configureAirtable();
  const records = await base(tableName).select().all();
  return records.map(record => {
    return {
      id: record.id as string,
      ...record.fields as Record<string, any>
    };
  });
};

// Create a new record in a table
export const createRecord = async (tableName: string, fields: any) => {
  const base = configureAirtable();
  const createdRecord = await base(tableName).create(fields);
  return { 
    id: createdRecord.id as string, 
    ...createdRecord.fields as Record<string, any> 
  };
};

// Import people data to appropriate tables
export const importPeopleToAirtable = async (people: AirtablePerson[]) => {
  const base = configureAirtable();
  const heroesTable = 'Heroes';
  const prospectsTable = 'Prospects';
  
  const results = {
    heroes: 0,
    prospects: 0,
    skipped: 0,
  };
  
  for (const person of people) {
    // Skip entries without a role
    if (!person.role) {
      results.skipped++;
      continue;
    }
    
    // Determine if the person is a Hero or Prospect based on status
    let tableName;
    
    if (person.status && person.status.includes('🟩 Completed')) {
      tableName = heroesTable;
      results.heroes++;
    } else {
      tableName = prospectsTable;
      results.prospects++;
    }
    
    try {
      // Create record in the appropriate table
      await base(tableName).create({
        "Full Name": person.fullName,
        "First Name": person.firstName,
        "Last Name": person.lastName,
        "Role": person.role || '',
        "Company": person.company || '',
        "Employment Type": person.employmentType || '',
        "Start Date": person.startDate || '',
        "Email": person.email,
        "Phone": person.phone || '',
        "LinkedIn": person.linkedIn || '',
        "Resume URL": person.resumeUrl || '',
        "Address": person.address || '',
        "Status": person.status || 'New',
      });
    } catch (error) {
      console.error(`Error creating record for ${person.fullName}:`, error);
    }
  }
  
  return results;
};

// Process the raw CSV or TSV data from pasted content
export const processPastedData = (data: string): AirtablePerson[] => {
  const lines = data.trim().split('\n');
  const people: AirtablePerson[] = [];
  
  for (const line of lines) {
    const fields = line.split('\t');
    
    // Skip if we don't have enough fields
    if (fields.length < 8) continue;
    
    const person: AirtablePerson = {
      fullName: fields[0].trim(),
      firstName: fields[1].trim(),
      lastName: fields[2].trim(),
      role: fields[3].trim() || undefined,
      company: fields[4].trim() || undefined,
      employmentType: fields[5].trim() || undefined,
      startDate: fields[6].trim() || undefined,
      email: fields[7].trim(),
      phone: fields[8]?.trim() || undefined,
      linkedIn: fields[9]?.trim() || undefined,
      resumeUrl: fields[10]?.trim() || undefined,
      address: fields[11]?.trim() || undefined,
      status: fields.length > 12 && fields[12] ? fields[12].trim() : undefined
    };
    
    people.push(person);
  }
  
  return people;
};