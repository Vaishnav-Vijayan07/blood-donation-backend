console.log("Initializing associations.js");

// Load models
let User, Office, Rank, DiaryPdf;
try {
  User = require("./user");
  console.log("User model loaded:", User ? "Defined" : "Undefined");
} catch (error) {
  console.error("Error loading User model:", error);
}

try {
  Office = require("./office");
  console.log("Office model loaded:", Office ? "Defined" : "Undefined");
} catch (error) {
  console.error("Error loading Office model:", error);
}

try {
  Rank = require("./rank");
  console.log("Rank model loaded:", Rank ? "Defined" : "Undefined");
} catch (error) {
  console.error("Error loading Rank model:", error);
}

try {
  DiaryPdf = require("./diary_pdf");
  console.log("DiaryPdf model loaded:", DiaryPdf ? "Defined" : "Undefined");
} catch (error) {
  console.error("Error loading DiaryPdf model:", error);
}

// Initialize models object
const models = { User, Office, Rank, DiaryPdf };

// Set associations after all models are loaded
const setAssociations = () => {
  console.log("Setting up associations");
  Object.values(models).forEach((model) => {
    if (model && model.associate) {
      console.log(`Setting associations for ${model.name}`);
      model.associate(models);
    } else {
      console.warn(`Model ${model?.name || "unknown"} has no associate method`);
    }
  });
};

// Call associations setup
setAssociations();

// Verify associations
console.log("User associations:", Object.keys(models.User?.associations || {}));
console.log("Office associations:", Object.keys(models.Office?.associations || {}));
console.log("Rank associations:", Object.keys(models.Rank?.associations || {}));
console.log("DiaryPdf associations:", Object.keys(models.DiaryPdf?.associations || {}));

module.exports = models;
