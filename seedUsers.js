import mongoose from "mongoose";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";

// Import models
import Customer from "./src/models/Customer.js";
import Provider from "./src/models/Provider.js";
import Service from "./src/models/Service.js";
import JobPost from "./src/models/JobPost.js";
import WorkPost from "./src/models/WorkPost.js";
import Review from "./src/models/Review.js";
import Subscription from "./src/models/Subscription.js";
import PriceList from "./src/models/PriceList.js";

// Load environment variables
dotenv.config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB Connected for Seeding...");
  } catch (error) {
    console.error("MongoDB connection error:", error);
    process.exit(1);
  }
};

const servicesData = [
  {
    name: "Deep Cleaning",
    description: "Comprehensive cleaning for homes and offices.",
    category: "Cleaning",
    base_price: 100,
    unit: "project",
  },
  {
    name: "Pipe Repair",
    description: "Fixing leaks and broken pipes.",
    category: "Plumbing",
    base_price: 50,
    unit: "hour",
  },
  {
    name: "Wiring Installation",
    description: "Full house wiring and electrical setup.",
    category: "Electrical",
    base_price: 80,
    unit: "hour",
  },
  {
    name: "Interior Painting",
    description: "Professional painting for interiors.",
    category: "Painting",
    base_price: 2,
    unit: "1 square feet",
  },
  {
    name: "Furniture Assembly",
    description: "Assembling IKEA and other furniture.",
    category: "Carpentry",
    base_price: 40,
    unit: "item",
  },
  {
    name: "Garden Maintenance",
    description: "Mowing, trimming, and general garden care.",
    category: "Gardening",
    base_price: 60,
    unit: "hour",
  },
  {
    name: "Moving Assistance",
    description: "Help with packing and moving boxes.",
    category: "Moving",
    base_price: 45,
    unit: "hour",
  },
  {
    name: "TV Mounting",
    description: "Securely mounting TVs on walls.",
    category: "Handyman",
    base_price: 70,
    unit: "item",
  },
  {
    name: "Faucet Replacement",
    description: "Replacing old or broken faucets.",
    category: "Plumbing",
    base_price: 60,
    unit: "item",
  },
  {
    name: "Light Fixture Installation",
    description: "Installing new light fixtures.",
    category: "Electrical",
    base_price: 55,
    unit: "item",
  },
];

const generateCustomers = (count) => {
  const customers = [];
  for (let i = 1; i <= count; i++) {
    customers.push({
      name: `Customer ${i}`,
      email: `customer${i}@example.com`,
      password: "Password@123",
      phone: `10000000${i < 10 ? "0" + i : i}`,
      address: `${i} Customer Lane, Cityville`,
    });
  }
  return customers;
};

const generateProviders = (count) => {
  const providers = [];
  const skillsList = ["Plumbing", "Electrical", "Cleaning", "Carpentry", "Painting"];
  for (let i = 1; i <= count; i++) {
    providers.push({
      name: `Provider ${i}`,
      email: `provider${i}@example.com`,
      password: "Password@123",
      phone: `20000000${i < 10 ? "0" + i : i}`,
      address: `${i} Provider Road, Townsville`,
      experience_years: Math.floor(Math.random() * 15) + 1,
      skills: [skillsList[i % skillsList.length], skillsList[(i + 1) % skillsList.length]],
      availability_status: i % 5 === 0 ? "Unavailable" : "Available",
      isApproved: true,
      isActive: true,
    });
  }
  return providers;
};

const seedDatabase = async () => {
  try {
    await connectDB();

    console.log("Clearing existing data...");
    await Customer.deleteMany({});
    await Provider.deleteMany({});
    await Service.deleteMany({});
    await JobPost.deleteMany({});
    await WorkPost.deleteMany({});
    await Review.deleteMany({});
    await Subscription.deleteMany({});
    await PriceList.deleteMany({});
    console.log("Data cleared.");

    // Seed Services
    console.log("Seeding Services...");
    const createdServices = await Service.insertMany(servicesData);
    console.log(`Created ${createdServices.length} services.`);

    // Seed Customers
    console.log("Seeding Customers...");
    const customersData = generateCustomers(20);
    const createdCustomers = [];
    for (const customer of customersData) {
      const newCustomer = new Customer(customer);
      await newCustomer.save();
      createdCustomers.push(newCustomer);
    }
    console.log(`Created ${createdCustomers.length} customers.`);

    // Seed Providers
    console.log("Seeding Providers...");
    const providersData = generateProviders(20);
    const createdProviders = [];
    for (const provider of providersData) {
      const newProvider = new Provider(provider);
      await newProvider.save();
      createdProviders.push(newProvider);
    }
    console.log(`Created ${createdProviders.length} providers.`);

    // Seed Subscriptions
    console.log("Seeding Subscriptions...");
    const subscriptions = [];
    const plans = ["Free", "Standard", "Premium"];
    const amounts = { "Free": 0, "Standard": 29.99, "Premium": 59.99 };
    
    for (const provider of createdProviders) {
      const plan = plans[Math.floor(Math.random() * plans.length)];
      subscriptions.push({
        provider_id: provider._id,
        plan_name: plan,
        end_date: new Date(new Date().setFullYear(new Date().getFullYear() + 1)),
        amount: amounts[plan],
        status: "Active",
      });
    }
    await Subscription.insertMany(subscriptions);
    console.log(`Created ${subscriptions.length} subscriptions.`);

    // Seed PriceLists (20 items)
    console.log("Seeding PriceLists...");
    const priceLists = [];
    for (let i = 0; i < 20; i++) {
      const service = createdServices[i % createdServices.length];
      const type = i % 2 === 0 ? "fixed" : "per_unit";
      
      let unit = service.unit;
      if (unit === "1 square feet") {
        unit = "square_feet";
      }

      priceLists.push({
        service_id: service._id,
        price_type: type,
        fixed_price: type === "fixed" ? service.base_price + (i * 5) : undefined,
        unit_price: type === "per_unit" ? service.base_price / 2 : undefined,
        unit: unit,
        description: `Price list entry ${i + 1} for ${service.name}`,
      });
    }
    await PriceList.insertMany(priceLists);
    console.log(`Created ${priceLists.length} price lists.`);

    // Seed JobPosts (10 items)
    console.log("Seeding JobPosts...");
    const jobPosts = [];
    for (let i = 0; i < 10; i++) {
      const customer = createdCustomers[Math.floor(Math.random() * createdCustomers.length)];
      const service = createdServices[Math.floor(Math.random() * createdServices.length)];
      jobPosts.push({
        title: `Need help with ${service.name}`,
        description: `Looking for a professional for ${service.name} at my place.`,
        duration: `${Math.floor(Math.random() * 5) + 1} hours`,
        service_id: service._id,
        location: customer.address,
        customerId: customer._id,
        jobStatus: "open",
      });
    }
    const createdJobPosts = await JobPost.insertMany(jobPosts);
    console.log(`Created ${createdJobPosts.length} job posts.`);

    // Seed WorkPosts (10 items)
    console.log("Seeding WorkPosts...");
    const workPosts = [];
    for (let i = 0; i < 10; i++) {
      const provider = createdProviders[Math.floor(Math.random() * createdProviders.length)];
      const job = createdJobPosts[i % createdJobPosts.length]; // Associate with created jobs for realism
      workPosts.push({
        title: `Completed ${job.title}`,
        description: "Job done successfully and on time.",
        beforeImage: "https://via.placeholder.com/150",
        afterImage: "https://via.placeholder.com/150",
        category: "General",
        providerId: provider._id,
        jobPostId: job._id,
        service_id: job.service_id,
        customerId: job.customerId,
      });
    }
    await WorkPost.insertMany(workPosts);
    console.log(`Created ${workPosts.length} work posts.`);

    // Seed Reviews (10 items)
    console.log("Seeding Reviews...");
    const reviews = [];
    for (let i = 0; i < 10; i++) {
      const customer = createdCustomers[Math.floor(Math.random() * createdCustomers.length)];
      const provider = createdProviders[Math.floor(Math.random() * createdProviders.length)];
      reviews.push({
        customer_id: customer._id,
        provider_id: provider._id,
        rating: Math.floor(Math.random() * 2) + 4, // 4 or 5
        comment: "Great service! Highly recommended.",
      });
    }
    await Review.insertMany(reviews);
    console.log(`Created ${reviews.length} reviews.`);

    console.log("Database seeded successfully!");
    process.exit(0);
  } catch (error) {
    console.error("Error seeding database:", error);
    process.exit(1);
  }
};

seedDatabase();
