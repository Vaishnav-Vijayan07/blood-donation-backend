const sequelize = require("../config/database");
const Office = require("../models/office");

const officeData = [
  {
    name: "Excise Commissionerate",
    email: "ecoffice.exc@kerala.gov.in",
    alternate_email: "excomoffice@yahoo.com",
    phone_number: "0471-23332632",
    alternate_phone_number: "1123",
    address: null,
  },
  {
    name: "Addl. EC (Admin)",
    email: "addlecadmin.exc@kerala.gov.in",
    alternate_email: null,
    phone_number: "9447178044",
    alternate_phone_number: null,
    address: null,
  },
  {
    name: "Addl. EC (Enfo)",
    email: "addlecenfo.exc@kerala.gov.in",
    alternate_email: null,
    phone_number: "9447179000",
    alternate_phone_number: null,
    address: null,
  },
  {
    name: "JEC (Central Zone)",
    email: "jeccz.exc@kerala.gov.in",
    alternate_email: "jeccz.exc@yahoo.co.in",
    phone_number: "0484-2397839",
    alternate_phone_number: "9447178051",
    address: null,
  },
  {
    name: "State Excise Academy and Research Centre",
    email: "jecsearc.exc@kerala.gov.in",
    alternate_email: "principal_sea@yahoo.com",
    phone_number: "0487-2388090",
    alternate_phone_number: "1522",
    address: null,
  },
  {
    name: "EDO Thrissur",
    email: "dcxtsr@gmail.com",
    alternate_email: "dectsr.exc@kerala.gov.in",
    phone_number: "0487-2361237",
    alternate_phone_number: "1500",
    address: null,
  },
  {
    name: "DC Thrissur",
    email: null,
    alternate_email: null,
    phone_number: "9447178060",
    alternate_phone_number: null,
    address: null,
  },
  {
    name: "AEC Thrissur",
    email: "aectsr.exc@kerala.gov.in",
    alternate_email: null,
    phone_number: "9496002868",
    alternate_phone_number: null,
    address: null,
  },
  {
    name: "EE&ANSS Thrissur",
    email: "essquadtsr.exc@kerala.gov.in",
    alternate_email: "essquadtsr@gmail.com",
    phone_number: "0487-2362002",
    alternate_phone_number: "1502",
    address: null,
  },
  {
    name: "EI & IB Thrissur",
    email: "eiibthrissur@gmail.com",
    alternate_email: null,
    phone_number: "0480-2751994",
    alternate_phone_number: "1501",
    address: null,
  },
  {
    name: "ECO Thrissur",
    email: "ecotsr.exc@kerala.gov.in",
    alternate_email: "ecotsr@gmail.com",
    phone_number: "0487-2327020",
    alternate_phone_number: null,
    address: null,
  },
  {
    name: "ECO Wadakkanchery",
    email: "ecowky.exc@kerala.gov.in",
    alternate_email: "ecowky@gmail.com",
    phone_number: "0488-4232407",
    alternate_phone_number: "1504",
    address: null,
  },
  {
    name: "ECO Vatanappally",
    email: "ecovtply.exc@kerala.gov.in",
    alternate_email: "ecovtply@gmail.com",
    phone_number: "0487-2290005",
    alternate_phone_number: "1505",
    address: null,
  },
  {
    name: "ECO Irinjalakuda",
    email: "ecoijk.exc@kerala.gov.in",
    alternate_email: "ecoirinjalakuda@gmail.com",
    phone_number: "0480-2832800",
    alternate_phone_number: "1506",
    address: null,
  },
  {
    name: "ECO Kodungallur",
    email: "ecokdlr.exc@kerala.gov.in",
    alternate_email: "ecokdlr@gmail.com",
    phone_number: "0480-2809390",
    alternate_phone_number: "1507",
    address: null,
  },
  {
    name: "ERO Anthikkad",
    email: "eroakd.exc@kerala.gov.in",
    alternate_email: "eroanthikkad@gmail.com",
    phone_number: "0487-2631900",
    alternate_phone_number: "1508",
    address: null,
  },
  {
    name: "ERO Cherpu",
    email: "erocherpu.exc@kerala.gov.in",
    alternate_email: "erocherpu@gmail.com",
    phone_number: "0487-2348806",
    alternate_phone_number: "1509",
    address: null,
  },
  {
    name: "ERO Chalakudy",
    email: "erockdy.exc@kerala.gov.in",
    alternate_email: "erochalakudy@gmail.com",
    phone_number: "0480-2705522",
    alternate_phone_number: "1510",
    address: null,
  },
  {
    name: "ERO Chavakkad",
    email: "erocvkd.exc@kerala.gov.in",
    alternate_email: "erochavakkad@gmail.com",
    phone_number: "0487-2554299",
    alternate_phone_number: "1511",
    address: null,
  },
  {
    name: "ERO Irinjalakuda",
    email: "eroijk.exc@kerala.gov.in",
    alternate_email: "eroijk@gmail.com",
    phone_number: "0480-2822831",
    alternate_phone_number: "1512",
    address: null,
  },
  {
    name: "ERO Kodungallur",
    email: "erokdlr.exc@kerala.gov.in",
    alternate_email: "erokodungallur@gmail.com",
    phone_number: "0480-2804630",
    alternate_phone_number: "1513",
    address: null,
  },
  {
    name: "ERO Kolazhy",
    email: "erokzy.exc@kerala.gov.in",
    alternate_email: "erokolazhy@gmail.com",
    phone_number: "0487-2204884",
    alternate_phone_number: "1514",
    address: null,
  },
  {
    name: "ERO Kunnamkulam",
    email: "erokkm.exc@kerala.gov.in",
    alternate_email: "erokkm@gmail.com",
    phone_number: "04885-223652",
    alternate_phone_number: "1515",
    address: null,
  },
  {
    name: "ERO Mala",
    email: "eromla.exc@kerala.gov.in",
    alternate_email: "rangeofficemala@gmail.com",
    phone_number: "0480-2895770",
    alternate_phone_number: "1516",
    address: null,
  },
  {
    name: "ERO Pazhayannur",
    email: "eropzr.exc@kerala.gov.in",
    alternate_email: "eropzr@gmail.com",
    phone_number: "0488-4226087",
    alternate_phone_number: "1517",
    address: null,
  },
  {
    name: "ERO Thrissur",
    email: "erotsr.exc@kerala.gov.in",
    alternate_email: "eierotsr@gmail.com",
    phone_number: "0487-2389455",
    alternate_phone_number: "1518",
    address: null,
  },
  {
    name: "ERO Vatanappally",
    email: "erovtply.exc@kerala.gov.in",
    alternate_email: "erovtply@gmail.com",
    phone_number: "0487-2402990",
    alternate_phone_number: "1519",
    address: null,
  },
  {
    name: "ERO Wadakkanchery",
    email: "erowky.exc@kerala.gov.in",
    alternate_email: "erowky@gmail.com",
    phone_number: "0488-4231051",
    alternate_phone_number: "1520",
    address: null,
  },
  {
    name: "ECP Vettilappara",
    email: "ecpvtpa.exc@kerala.gov.in",
    alternate_email: "ecpvtsr@gmail.com",
    phone_number: "0480-2769011",
    alternate_phone_number: "1521",
    address: null,
  },
  {
    name: "KSBC Thrissur",
    email: "ksbccitsr@yahoo.in",
    alternate_email: "ksbctsr.exc@kerala.gov.in",
    phone_number: "0487-2250524",
    alternate_phone_number: null,
    address: null,
  },
  {
    name: "KSBC Chalakudy",
    email: "ksbcexciseckdy@gmail.com",
    alternate_email: "ksbcckdy.exc@kerala.gov.in",
    phone_number: "0480-2708284",
    alternate_phone_number: null,
    address: null,
  },
  {
    name: "Superstar Distillery",
    email: "sdfexcise@gmail.com",
    alternate_email: "cisdf.exc@kerala.gov.in",
    phone_number: "0488-4283537",
    alternate_phone_number: null,
    address: null,
  },
  {
    name: "Kaycee Distillery",
    email: "cix.kaycee.pkd@gmail.com",
    alternate_email: "cikayceed.exc@kerala.gov.in",
    phone_number: "0480-2751994",
    alternate_phone_number: null,
    address: null,
  },
  {
    name: "Polson Distillery",
    email: "polsonsdistillery@gmail.com",
    alternate_email: "eipolsond.exc@kerala.gov.in",
    phone_number: "0480-2708285",
    alternate_phone_number: null,
    address: null,
  },
  {
    name: "Seven Seas Distillery",
    email: "info@sevenseasmail.in",
    alternate_email: "eissd.exc@kerala.gov.in",
    phone_number: "0487-2370679",
    alternate_phone_number: null,
    address: null,
  },
  {
    name: "Elite Distillery",
    email: "ofofeielite@gmail.com",
    alternate_email: "eielited.exc@kerala.gov.in",
    phone_number: "0487-2210240",
    alternate_phone_number: null,
    address: null,
  },
  {
    name: "Malabar Breweries",
    email: "excise4malabar@gmail.com",
    alternate_email: "elmbrckdy.exc@kerala.gov.in",
    phone_number: "0480-3981070",
    alternate_phone_number: null,
    address: null,
  },
  {
    name: "SUP Thrissur",
    email: "suptcr55@gmail.com",
    alternate_email: "eisuptsr.exc@kerala.gov.in",
    phone_number: "0487-2357454",
    alternate_phone_number: null,
    address: null,
  },
];

async function importOffices(req, res) {
  try {
    // Sync database (optional, for testing; avoid in production)
    // await sequelize.sync({ force: false });

    // Import each office
    for (const office of officeData) {
      try {
        await Office.create(office);
        console.log(`Successfully imported office: ${office.name}`);
      } catch (error) {
        if (error.name === "SequelizeUniqueConstraintError") {
          console.error(`Unique constraint error for ${office.name}: ${error.message}`);
        } else {
          console.error(`Error importing office ${office.name}: ${error.message}`);
        }
      }
    }

    console.log("Office import completed.");
    res.send({ message: "Office import completed" });
  } catch (error) {
    console.error("Error during import:", error);
  } finally {
    // Close the database connection
    await sequelize.close();
  }
}

// Run the import
// importOffices();
module.exports = importOffices;
