import { db } from "../server/db";
import { prospectsDatabase } from "../shared/schema";

async function importAdditionalProspects() {
  console.log("Starting import of additional prospects data...");
  
  const prospectsData = [
    {
      name: "Lourdes",
      status: "Screening",
      rolePosition: "Paid Media Consultant",
      otherRoleOfInterest: null,
      vocarooRecord: null,
      resume: "My Resume- Lourdes Bea-24.pdf",
      country: "Argentina",
      email: "lourdesbea8@gmail.com",
      phone: "(113) 246-9122",
      programTools: "Meta, Google Ads",
      englishLevel: "Intermediate"
    },
    {
      name: "Lucia",
      status: "Screening",
      rolePosition: "Paid Media Consultant",
      otherRoleOfInterest: null,
      vocarooRecord: null,
      resume: "Lucía Vazquez english.pdf",
      country: "Argentina",
      email: "lu-vaz@hotmail.com",
      phone: "+54 113018-7496",
      programTools: "Google Ads, Google Analytics",
      englishLevel: "Advanced"
    },
    {
      name: "Sofia",
      status: "Screening",
      rolePosition: "Paid Media Consultant",
      otherRoleOfInterest: null,
      vocarooRecord: null,
      resume: "CV  Sofía Portero .pdf",
      country: "Argentina",
      email: "sofiportero7@gmail.com",
      phone: "+54 911 69549161",
      programTools: "Canva, capcut, Facebook Ads",
      englishLevel: "Advanced"
    },
    {
      name: "Luis Azevedo",
      status: "Not Selected",
      rolePosition: "Marketing Specialist",
      otherRoleOfInterest: "NA",
      vocarooRecord: null,
      resume: "LUIS_AZEVEDO_2025_EN.pdf",
      country: "Brasil",
      email: "username.azevedo@gmail.com",
      phone: "+5522997265249",
      programTools: "Adobe Photoshop, Adobe Illustrator, Canva, capcut, formeta, JavaScript",
      englishLevel: "Advanced"
    },
    {
      name: "Paula Marulanda",
      status: "Terminated",
      rolePosition: "Paid Media Consultant",
      otherRoleOfInterest: "NA",
      vocarooRecord: null,
      resume: "Paula_Marulanda CV_ 2025.pdf",
      country: "Colombia",
      email: "paomaru2009@gmail.com",
      phone: "+573015164379",
      programTools: "Wordpress, CSS, Email Marketing, Mainchat, Canva, Google Ads, Hubspot, Zapier, capcut, Adobe Illustrator, shopify, Elemantor, Google Analytics, Pixel, Notion, trello, Slack",
      englishLevel: "Intermediate"
    },
    {
      name: "João Victor Alves",
      status: "Screen call Done",
      rolePosition: "SEO Project Manager",
      otherRoleOfInterest: "NA",
      vocarooRecord: null,
      resume: "CVEN11 (3) (3).pdf",
      country: "Brasil",
      email: "audiovisualvitor@gmail.com",
      phone: "+5531992759045",
      programTools: "Google Search Console, Google Analytics, rocket, Wordpress",
      englishLevel: "Intermediate"
    },
    {
      name: "Clecio Oliveira",
      status: "Not Screened",
      rolePosition: "Marketing Specialist",
      otherRoleOfInterest: "NA",
      vocarooRecord: null,
      resume: "Resume Clecio 2025.pdf",
      country: "Brasil",
      email: "cleciogo@gmail.com",
      phone: "+555562984119433",
      programTools: null,
      englishLevel: null
    },
    {
      name: "Ana Itacarambi",
      status: "Not Selected",
      rolePosition: "Marketing Specialist",
      otherRoleOfInterest: "NA",
      vocarooRecord: null,
      resume: "Ana Itacarambi - mkt.pdf",
      country: "Brasil",
      email: "anacassiaribas@gmail.com",
      phone: "+5511970664653",
      programTools: "HTML, Wordpress, Notion, MLabsç, trello, Github",
      englishLevel: "Intermediate"
    },
    {
      name: "Fernanda Siewerdt",
      status: "Not Selected",
      rolePosition: "Marketing Specialist",
      otherRoleOfInterest: "NA",
      vocarooRecord: "https://voca.ro/11pUIfQyW6MO",
      resume: "CV_FernandaSiewerdt_2025_english.pdf",
      country: "Brasil",
      email: "siewerdt.f@gmail.com",
      phone: "+5547997695911",
      programTools: "JavaScript, CSS, HTML, kutsu, Google Analytics, Meta, paperclip, SEO, Hubspot, Wordpress",
      englishLevel: "Advanced"
    },
    {
      name: "Nicolas Esteban Parra Pineda",
      status: "Screen call Done",
      rolePosition: "Media Buyer / Ads Expert Account Manager",
      otherRoleOfInterest: null,
      vocarooRecord: "https://www.linkedin.com/feed/update/urn:li:activity:7273331538254073856/",
      resume: "Upwork NicolasParra  INGLISH CVC .pdf.pdf",
      country: "Colombia",
      email: "nicoparratrumpet@gmail.com",
      phone: "(350) 826-6155",
      programTools: null,
      englishLevel: "Beginner"
    },
    {
      name: "Candela Bossert",
      status: "Not Selected",
      rolePosition: "UX/UI Design",
      otherRoleOfInterest: null,
      vocarooRecord: null,
      resume: "cv English Cande.pdf",
      country: "Argentina",
      email: "candeboss@gmail.com",
      phone: "+5493416385235",
      programTools: "Figma, Adobe Illustrator, Adobe Photoshop, Jira",
      englishLevel: "Advanced"
    },
    {
      name: "Jimena Zapolski",
      status: "Not Selected",
      rolePosition: "UX/UI Design",
      otherRoleOfInterest: null,
      vocarooRecord: null,
      resume: "Jimena Zapolski - Resume.pdf",
      country: "Argentina",
      email: "jimezapolski@gmail.com",
      phone: "(+54) 9 1132382575",
      programTools: "Figma, Adobe Illustrator, winSQL, HTML, JavaScript, Wordpress, trello, Notion",
      englishLevel: "Advanced"
    },
    {
      name: "Clayson Rodrigues Julião",
      status: "Not Selected",
      rolePosition: "Paid Media Consultant",
      otherRoleOfInterest: null,
      vocarooRecord: "https://voca.ro/1jShqcLzu8KF",
      resume: "2025 - CURRICULO - EN-US.pdf",
      country: "Brasil",
      email: "rjclayson@gmail.com",
      phone: "5531988210186",
      programTools: "Google tech manager",
      englishLevel: "Intermediate"
    },
    {
      name: "Stiven Mora",
      status: "Not Selected",
      rolePosition: "Lead Research Team",
      otherRoleOfInterest: null,
      vocarooRecord: null,
      resume: "cv stiven mora english 2024 (1).pdf",
      country: "Colombia",
      email: "smora4@gmail.com",
      phone: "+573016031605",
      programTools: null,
      englishLevel: null
    },
    {
      name: "Valentina Gomez Gomez",
      status: "Not Selected",
      rolePosition: "Paid Media Consultant",
      otherRoleOfInterest: null,
      vocarooRecord: "https://voca.ro/122NH4e6keg9",
      resume: "CV VALENTINA GOMEZ ENGLISH.pdf",
      country: "Colombia",
      email: "vdevalentinagomez@gmail.com",
      phone: "+57 3507732363",
      programTools: "Adobe Illustrator, Adobe Photoshop, Canva, Google Analytics",
      englishLevel: "Intermediate"
    },
    {
      name: "Junior Alves",
      status: "Not Screened",
      rolePosition: "Marketing Specialist",
      otherRoleOfInterest: null,
      vocarooRecord: "https://voca.ro/1blgWR2mIFC2",
      resume: "Junior Alves english version .pdf",
      country: "Brasil",
      email: "junior-alves2@hotmail.com",
      phone: "+5511992047402",
      programTools: null,
      englishLevel: "Advanced"
    },
    {
      name: "Marco Fernandez Llano",
      status: "Not Selected",
      rolePosition: "UX/UI Design",
      otherRoleOfInterest: null,
      vocarooRecord: null,
      resume: "Marco Fernández Llano Resume.pdf",
      country: "Argentina",
      email: "marcofllb@gmail.com",
      phone: "+5491140626875",
      programTools: "Figma, Adobe, CSS, HTML, JavaScript basic",
      englishLevel: "Intermediate"
    },
    {
      name: "Mauricio Prado",
      status: "Not Selected",
      rolePosition: "UX/UI Design",
      otherRoleOfInterest: null,
      vocarooRecord: null,
      resume: "RESUME 2025.pdf",
      country: "Bolivia",
      email: "contacto@mauprado.com",
      phone: "+59170512923",
      programTools: "Figma, HTML, CSS, JavaScript, Wordpress, Adobe",
      englishLevel: "Advanced"
    },
    {
      name: "Alexis Racuk",
      status: "Not Screened",
      rolePosition: "UX/UI QA Tester",
      otherRoleOfInterest: null,
      vocarooRecord: "https://voca.ro/1fL6pDGTfoXm",
      resume: "CV - Alexis Racuk ENG.pdf",
      country: "Argentina",
      email: "alexracuk7@gmail.com",
      phone: "(116) 616-4050",
      programTools: null,
      englishLevel: "Advanced"
    },
    {
      name: "Federico Quintana",
      status: "Not Selected",
      rolePosition: "UX/UI QA Tester",
      otherRoleOfInterest: null,
      vocarooRecord: "https://voca.ro/1gKKDICijKED",
      resume: "Quintana Federico CV.pdf",
      country: "Argentina",
      email: "nebulak32@gmail.com",
      phone: "+5492342446958",
      programTools: null,
      englishLevel: "Advanced"
    }
  ];

  try {
    // Insert new prospects data
    for (const prospect of prospectsData) {
      await db.insert(prospectsDatabase).values(prospect);
      console.log(`Added prospect: ${prospect.name}`);
    }
    
    // Check how many records were inserted
    const count = await db.select({ count: db.fn.count() }).from(prospectsDatabase);
    console.log(`Total prospects in database: ${count[0].count}`);
    
    console.log("Import completed successfully!");
  } catch (error) {
    console.error("Error importing data:", error);
  } finally {
    process.exit(0);
  }
}

importAdditionalProspects();