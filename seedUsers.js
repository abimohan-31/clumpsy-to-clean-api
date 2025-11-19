import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";

// Import models from src
import Provider from "./src/models/Provider.js";
import Customer from "./src/models/Customer.js";
import Service from "./src/models/Service.js";
import PriceList from "./src/models/PriceList.js";

dotenv.config();

// --------------------
// 2. Provider & Customer Data
// --------------------
const providers = [
  {
    name: "Tharindu Weerasinghe",
    email: "tharindu.weerasinghe@example.com",
    phone: "0761234567",
    address: "Colombo",
    experience_years: 3,
    skills: ["Plumbing", "Maintenance"],
    availability_status: "Available",
    rating: 4,
    role: "provider",
    isApproved: true,
  },
  {
    name: "Sajini Perera",
    email: "sajini.perera@example.com",
    phone: "0719876543",
    address: "Gampaha",
    experience_years: 2,
    skills: ["Cleaning"],
    availability_status: "Unavailable",
    rating: 5,
    role: "provider",
    isApproved: true,
  },
  {
    name: "Dulitha Madushanka",
    email: "dulitha.madushanka@example.com",
    phone: "0758765432",
    address: "Kandy",
    experience_years: 4,
    skills: ["Electrician", "Repairing"],
    availability_status: "Available",
    rating: 3,
    role: "provider",
    isApproved: false,
  },
  {
    name: "Nadeesha Fernando",
    email: "nadeesha.fernando@example.com",
    phone: "0773456789",
    address: "Negombo",
    experience_years: 3,
    skills: ["Painting"],
    availability_status: "Available",
    rating: 4,
    role: "provider",
    isApproved: true,
  },
  {
    name: "Ishara Jayawardena",
    email: "ishara.jayawardena@example.com",
    phone: "0742345678",
    address: "Matara",
    experience_years: 5,
    skills: ["Gardening", "Cleaning"],
    availability_status: "Unavailable",
    rating: 5,
    role: "provider",
    isApproved: true,
  },
  {
    name: "Ravindu Silva",
    email: "ravindu.silva@example.com",
    phone: "0709988776",
    address: "Kurunegala",
    experience_years: 3,
    skills: ["Electrician"],
    availability_status: "Available",
    rating: 4,
    role: "provider",
    isApproved: false,
  },
  {
    name: "Gayani Dias",
    email: "gayani.dias@example.com",
    phone: "0768889991",
    address: "Ratnapura",
    experience_years: 2,
    skills: ["Cleaning"],
    availability_status: "Available",
    rating: 3,
    role: "provider",
    isApproved: true,
  },
  {
    name: "Kaveeshan Ratnayake",
    email: "kaveeshan.ratnayake@example.com",
    phone: "0712233445",
    address: "Jaffna",
    experience_years: 4,
    skills: ["Plumbing", "Repairing"],
    availability_status: "Unavailable",
    rating: 4,
    role: "provider",
    isApproved: true,
  },
  {
    name: "Sathsara Gunasekara",
    email: "sathsara.gunasekara@example.com",
    phone: "0751122334",
    address: "Anuradhapura",
    experience_years: 3,
    skills: ["Painting"],
    availability_status: "Available",
    rating: 5,
    role: "provider",
    isApproved: true,
  },
  {
    name: "Harshi Aluwihare",
    email: "harshi.aluwihare@example.com",
    phone: "0776655443",
    address: "Kegalle",
    experience_years: 1,
    skills: ["Cleaning"],
    availability_status: "Unavailable",
    rating: 3,
    role: "provider",
    isApproved: false,
  },
  {
    name: "Sanjula Karunaratne",
    email: "sanjula.karunaratne@example.com",
    phone: "0702345678",
    address: "Colombo",
    experience_years: 2,
    skills: ["Electrician"],
    availability_status: "Available",
    rating: 4,
    role: "provider",
    isApproved: true,
  },
  {
    name: "Nimashi Ranathunga",
    email: "nimashi.ranathunga@example.com",
    phone: "0763456789",
    address: "Galle",
    experience_years: 3,
    skills: ["Cleaning", "Gardening"],
    availability_status: "Available",
    rating: 5,
    role: "provider",
    isApproved: true,
  },
  {
    name: "Kalpa Abeysekara",
    email: "kalpa.abeysekara@example.com",
    phone: "0715566778",
    address: "Matale",
    experience_years: 4,
    skills: ["Plumbing"],
    availability_status: "Unavailable",
    rating: 4,
    role: "provider",
    isApproved: false,
  },
  {
    name: "Vindya Udayanga",
    email: "vindya.udayanga@example.com",
    phone: "0754433221",
    address: "Trincomalee",
    experience_years: 2,
    skills: ["Painting"],
    availability_status: "Available",
    rating: 3,
    role: "provider",
    isApproved: true,
  },
  {
    name: "Malith Peris",
    email: "malith.peris@example.com",
    phone: "0771122443",
    address: "Badulla",
    experience_years: 5,
    skills: ["Electrician"],
    availability_status: "Unavailable",
    rating: 5,
    role: "provider",
    isApproved: true,
  },
  {
    name: "Yasas Muthumala",
    email: "yasas.muthumala@example.com",
    phone: "0746677889",
    address: "Kurunegala",
    experience_years: 3,
    skills: ["Plumbing"],
    availability_status: "Available",
    rating: 4,
    role: "provider",
    isApproved: false,
  },
  {
    name: "Chathuni Ekanayake",
    email: "chathuni.ekanayake@example.com",
    phone: "0709988771",
    address: "Hambantota",
    experience_years: 1,
    skills: ["Cleaning"],
    availability_status: "Available",
    rating: 3,
    role: "provider",
    isApproved: true,
  },
  {
    name: "Sachintha Prabath",
    email: "sachintha.prabath@example.com",
    phone: "0765544332",
    address: "Nuwara Eliya",
    experience_years: 4,
    skills: ["Painter", "Repairing"],
    availability_status: "Unavailable",
    rating: 4,
    role: "provider",
    isApproved: true,
  },
  {
    name: "Nirasha Herath",
    email: "nirasha.herath@example.com",
    phone: "0754455667",
    address: "Kandy",
    experience_years: 3,
    skills: ["Electrician"],
    availability_status: "Available",
    rating: 5,
    role: "provider",
    isApproved: true,
  },
  {
    name: "Ayesh Fonseka",
    email: "ayesh.fonseka@example.com",
    phone: "0716677885",
    address: "Colombo",
    experience_years: 2,
    skills: ["Gardening"],
    availability_status: "Unavailable",
    rating: 3,
    role: "provider",
    isApproved: false,
  },
  {
    name: "Thilini Samarasekara",
    email: "thilini.samarasekara@example.com",
    phone: "0702233441",
    address: "Gampaha",
    experience_years: 3,
    skills: ["Painting"],
    availability_status: "Available",
    rating: 4,
    role: "provider",
    isApproved: true,
  },
  {
    name: "Chamod Lakshan",
    email: "chamod.lakshan@example.com",
    phone: "0768899001",
    address: "Colombo",
    experience_years: 2,
    skills: ["Electrician"],
    availability_status: "Unavailable",
    rating: 5,
    role: "provider",
    isApproved: false,
  },
  {
    name: "Pavani Senanayake",
    email: "pavani.senanayake@example.com",
    phone: "0753322114",
    address: "Kegalle",
    experience_years: 4,
    skills: ["Cleaning"],
    availability_status: "Available",
    rating: 4,
    role: "provider",
    isApproved: true,
  },
  {
    name: "Ramesh Priyadarshana",
    email: "ramesh.priyadarshana@example.com",
    phone: "0775566443",
    address: "Anuradhapura",
    experience_years: 5,
    skills: ["Plumbing"],
    availability_status: "Unavailable",
    rating: 5,
    role: "provider",
    isApproved: true,
  },
  {
    name: "Imesha Wijeratne",
    email: "imesha.wijeratne@example.com",
    phone: "0749988774",
    address: "Kurunegala",
    experience_years: 3,
    skills: ["Painting"],
    availability_status: "Available",
    rating: 4,
    role: "provider",
    isApproved: false,
  },
];

const customers = [
  {
    name: "Tharindu Weerasinghe",
    email: "tharindu.customer1@example.com",
    role: "customer",
    isActive: true,
  },
  {
    name: "Sajini Perera",
    email: "sajini.customer2@example.com",
    role: "customer",
    isActive: true,
  },
  {
    name: "Dilshan Jayawardena",
    email: "dilshan.customer3@example.com",
    role: "customer",
    isActive: true,
  },
  {
    name: "Nadeesha Fernando",
    email: "nadeesha.customer4@example.com",
    role: "customer",
    isActive: true,
  },
  {
    name: "Ishara Madushani",
    email: "ishara.customer5@example.com",
    role: "customer",
    isActive: true,
  },
  {
    name: "Ravindu Silva",
    email: "ravindu.customer6@example.com",
    role: "customer",
    isActive: true,
  },
  {
    name: "Gayani Dias",
    email: "gayani.customer7@example.com",
    role: "customer",
    isActive: true,
  },
  {
    name: "Kaveesha Ratnayake",
    email: "kaveesha.customer8@example.com",
    role: "customer",
    isActive: true,
  },
  {
    name: "Sathsara Gunasekara",
    email: "sathsara.customer9@example.com",
    role: "customer",
    isActive: true,
  },
  {
    name: "Harshi Aluwihare",
    email: "harshi.customer10@example.com",
    role: "customer",
    isActive: true,
  },
  {
    name: "Sanjula Karunaratne",
    email: "sanjula.customer11@example.com",
    role: "customer",
    isActive: true,
  },
  {
    name: "Nimashi Ranathunga",
    email: "nimashi.customer12@example.com",
    role: "customer",
    isActive: true,
  },
  {
    name: "Kalpa Abeysekara",
    email: "kalpa.customer13@example.com",
    role: "customer",
    isActive: true,
  },
  {
    name: "Vindya Udayanga",
    email: "vindya.customer14@example.com",
    role: "customer",
    isActive: true,
  },
  {
    name: "Malith Peris",
    email: "malith.customer15@example.com",
    role: "customer",
    isActive: true,
  },
  {
    name: "Yasas Muthumala",
    email: "yasas.customer16@example.com",
    role: "customer",
    isActive: true,
  },
  {
    name: "Chathuni Ekanayake",
    email: "chathuni.customer17@example.com",
    role: "customer",
    isActive: true,
  },
  {
    name: "Sachintha Prabath",
    email: "sachintha.customer18@example.com",
    role: "customer",
    isActive: true,
  },
  {
    name: "Nirasha Herath",
    email: "nirasha.customer19@example.com",
    role: "customer",
    isActive: true,
  },
  {
    name: "Ayesh Fonseka",
    email: "ayesh.customer20@example.com",
    role: "customer",
    isActive: true,
  },
  {
    name: "Thilini Samarasekara",
    email: "thilini.customer21@example.com",
    role: "customer",
    isActive: true,
  },
  {
    name: "Chamod Lakshan",
    email: "chamod.customer22@example.com",
    role: "customer",
    isActive: true,
  },
  {
    name: "Pavani Senanayake",
    email: "pavani.customer23@example.com",
    role: "customer",
    isActive: true,
  },
  {
    name: "Ramesh Priyadarshana",
    email: "ramesh.customer24@example.com",
    role: "customer",
    isActive: true,
  },
  {
    name: "Imesha Wijeratne",
    email: "imesha.customer25@example.com",
    role: "customer",
    isActive: true,
  },
];

// Seed Services
const seedServices = async () => {
  try {
    console.log("Seeding Services...");

    const services = [
      {
        name: "painting",
        description: "Professional painting services for homes and offices",
        category: "Painting",
        base_price: 5000, // LKR per hour
        unit: "hour",
        isActive: true,
      },
      {
        name: "gardening",
        description: "Expert gardening and landscaping services",
        category: "Gardening",
        base_price: 4000, // LKR per hour
        unit: "hour",
        isActive: true,
      },
      {
        name: "cleaning",
        description: "Thorough cleaning services for residential and commercial spaces",
        category: "Cleaning",
        base_price: 3000, // LKR per hour
        unit: "hour",
        isActive: true,
      },
      {
        name: "plumbing",
        description: "Professional plumbing repairs and installations",
        category: "Plumbing",
        base_price: 6000, // LKR per hour
        unit: "hour",
        isActive: true,
      },
      {
        name: "electrical",
        description: "Licensed electrical work and repairs",
        category: "Electrical",
        base_price: 7000, // LKR per hour
        unit: "hour",
        isActive: true,
      },
    ];

    const createdServices = await Service.insertMany(services);
    console.log(`${createdServices.length} services created`);
    return createdServices;
  } catch (error) {
    console.error("Error seeding services:", error);
    throw error;
  }
};

// Seed Price Lists
const seedPriceLists = async (services) => {
  try {
    console.log("Seeding Price Lists...");

    const paintingService = services.find((s) => s.name === "painting");
    const gardeningService = services.find((s) => s.name === "gardening");
    const cleaningService = services.find((s) => s.name === "cleaning");
    const plumbingService = services.find((s) => s.name === "plumbing");
    const electricalService = services.find((s) => s.name === "electrical");

    const priceLists = [];

    // Paint: price per square foot
    if (paintingService) {
      priceLists.push({
        service_id: paintingService._id,
        price_type: "per_unit",
        unit_price: 250, // Rs. 250 per square foot
        unit: "square_feet",
        description: "Price per square foot for interior painting (LKR)",
        isActive: true,
      });
      priceLists.push({
        service_id: paintingService._id,
        price_type: "per_unit",
        unit_price: 300, // Rs. 300 per square foot
        unit: "square_feet",
        description: "Price per square foot for exterior painting (LKR)",
        isActive: true,
      });
    }

    // Gardening: average price range
    if (gardeningService) {
      priceLists.push({
        service_id: gardeningService._id,
        price_type: "range",
        min_price: 5000,
        max_price: 15000,
        description: "Average price range for basic gardening services per visit (LKR)",
        isActive: true,
      });
      priceLists.push({
        service_id: gardeningService._id,
        price_type: "range",
        min_price: 20000,
        max_price: 50000,
        description: "Price range for full landscaping projects (LKR)",
        isActive: true,
      });
    }

    // Cleaning: fixed price
    if (cleaningService) {
      priceLists.push({
        service_id: cleaningService._id,
        price_type: "fixed",
        fixed_price: 10000,
        description: "Standard cleaning service for small apartments (1-2 bedrooms) - LKR",
        isActive: true,
      });
      priceLists.push({
        service_id: cleaningService._id,
        price_type: "fixed",
        fixed_price: 15000,
        description: "Deep cleaning service for medium homes (3-4 bedrooms) - LKR",
        isActive: true,
      });
    }

    // Plumbing: per unit (per hour)
    if (plumbingService) {
      priceLists.push({
        service_id: plumbingService._id,
        price_type: "per_unit",
        unit_price: 8000,
        unit: "hour",
        description: "Standard plumbing service rate per hour (LKR)",
        isActive: true,
      });
    }

    // Electrical: fixed price for common jobs
    if (electricalService) {
      priceLists.push({
        service_id: electricalService._id,
        price_type: "fixed",
        fixed_price: 12000,
        description: "Fixed price for standard electrical outlet installation (LKR)",
        isActive: true,
      });
      priceLists.push({
        service_id: electricalService._id,
        price_type: "per_unit",
        unit_price: 9000,
        unit: "hour",
        description: "Electrical repair service rate per hour (LKR)",
        isActive: true,
      });
    }

    const createdPriceLists = await PriceList.insertMany(priceLists);
    console.log(`${createdPriceLists.length} price lists created`);
    return createdPriceLists;
  } catch (error) {
    console.error("Error seeding price lists:", error);
    throw error;
  }
};

// --------------------
// 3. Seed Function
// --------------------
async function seedUsers() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB");

    // Clear existing data
    await Provider.deleteMany();
    await Customer.deleteMany();
    await Service.deleteMany();
    await PriceList.deleteMany();

    console.log("Old data removed");

    // Hash password for all users
    const hashedPassword = await bcrypt.hash("Password123", 10);

    const providerData = providers.map((p) => ({
      ...p,
      password: hashedPassword,
    }));

    const customerData = customers.map((c) => ({
      ...c,
      password: hashedPassword,
    }));

    // Insert providers and customers
    await Provider.insertMany(providerData);
    await Customer.insertMany(customerData);
    console.log("Providers and customers seeded");

    // Seed services and price lists
    const services = await seedServices();
    const priceLists = await seedPriceLists(services);

    // Summary
    console.log("=".repeat(50));
    console.log("Seeding Summary:");
    console.log("=".repeat(50));
    console.log(`Providers: ${providerData.length}`);
    console.log(`Customers: ${customerData.length}`);
    console.log(`Services: ${services.length}`);
    console.log(`Price Lists: ${priceLists.length}`);
    console.log("=".repeat(50));
    console.log("Seed successfully completed");
    console.log("");
    console.log("Example Price Lists:");
    console.log(" - Painting: Rs. 250-300 per square foot");
    console.log(" - Gardening: Rs. 5,000-15,000 (basic) or Rs. 20,000-50,000 (landscaping)");
    console.log(" - Cleaning: Rs. 10,000-15,000 fixed price");
    console.log("");

    process.exit();
  } catch (error) {
    console.error("Seed failed", error);
    process.exit(1);
  }
}

seedUsers();
