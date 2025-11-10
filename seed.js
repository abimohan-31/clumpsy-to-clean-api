import mongoose from "mongoose";
import dotenv from "dotenv";

// Import models
import User from "./models/User.js";
import Provider from "./models/Provider.js";
import Customer from "./models/Customer.js";
import Booking from "./models/Booking.js";
import Review from "./models/Review.js";
import Item from "./models/Item.js";

// Load environment variables
dotenv.config();

// Check if running in development
if (process.env.NODE_ENV === "production") {
  console.error("❌ Seeding is not allowed in production environment!");
  process.exit(1);
}

// Connect to MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("✅ MongoDB Connected!");
  } catch (error) {
    console.error("❌ MongoDB connection error:", error);
    process.exit(1);
  }
};

// Clear all collections
const clearCollections = async () => {
  try {
    console.log("\n🗑️  Clearing existing data...");
    await User.deleteMany({});
    await Provider.deleteMany({});
    await Customer.deleteMany({});
    await Booking.deleteMany({});
    await Review.deleteMany({});
    await Item.deleteMany({});
    console.log("✅ Collections cleared successfully!");
  } catch (error) {
    console.error("❌ Error clearing collections:", error);
    throw error;
  }
};

// Seed Admin
const seedAdmin = async () => {
  try {
    console.log("\n👤 Seeding Admin...");
    
    const admin = new User({
      name: "Admin User",
      email: "admin@example.com",
      password: "admin123", // Will be hashed by pre-save hook
      role: "admin",
    });

    await admin.save();
    console.log(`✅ Admin created: ${admin.email} (password: admin123)`);
    return admin;
  } catch (error) {
    console.error("❌ Error seeding admin:", error);
    throw error;
  }
};

// Seed Providers
const seedProviders = async () => {
  try {
    console.log("\n👷 Seeding Providers...");
    
    const providersData = [
      {
        name: "John Smith",
        email: "john.smith@example.com",
        password: "provider123", // Will be hashed by pre-save hook
        phone: "1234567890",
        address: "123 Main Street, City, State 12345",
        experience_years: 5,
        skills: ["Cleaning", "Deep Cleaning", "Window Cleaning"],
        availability_status: "Available",
        rating: 4.5,
        role: "provider",
        isApproved: true,
      },
      {
        name: "Sarah Johnson",
        email: "sarah.johnson@example.com",
        password: "provider123",
        phone: "2345678901",
        address: "456 Oak Avenue, City, State 12345",
        experience_years: 3,
        skills: ["Plumbing", "Pipe Repair", "Leak Fixing"],
        availability_status: "Available",
        rating: 4.8,
        role: "provider",
        isApproved: true,
      },
      {
        name: "Mike Davis",
        email: "mike.davis@example.com",
        password: "provider123",
        phone: "3456789012",
        address: "789 Pine Road, City, State 12345",
        experience_years: 7,
        skills: ["Electrical", "Wiring", "Outlet Installation"],
        availability_status: "Available",
        rating: 4.2,
        role: "provider",
        isApproved: true,
      },
      {
        name: "Emily Wilson",
        email: "emily.wilson@example.com",
        password: "provider123",
        phone: "4567890123",
        address: "321 Elm Street, City, State 12345",
        experience_years: 4,
        skills: ["Painting", "Interior Painting", "Exterior Painting"],
        availability_status: "Unavailable",
        rating: 4.7,
        role: "provider",
        isApproved: true,
      },
      {
        name: "David Brown",
        email: "david.brown@example.com",
        password: "provider123",
        phone: "5678901234",
        address: "654 Maple Drive, City, State 12345",
        experience_years: 6,
        skills: ["Carpentry", "Furniture Repair", "Cabinet Installation"],
        availability_status: "Available",
        rating: 4.6,
        role: "provider",
        isApproved: true,
      },
    ];

    // Create providers individually to trigger password hashing hooks
    const providers = [];
    for (const providerData of providersData) {
      const provider = new Provider(providerData);
      await provider.save();
      providers.push(provider);
    }
    
    console.log(`✅ Created ${providers.length} providers (password: provider123)`);
    return providers;
  } catch (error) {
    console.error("❌ Error seeding providers:", error);
    throw error;
  }
};

// Seed Customers
const seedCustomers = async () => {
  try {
    console.log("\n👥 Seeding Customers...");
    
    const customersData = [
      {
        name: "Alice Anderson",
        email: "alice.anderson@example.com",
        password: "customer123", // Will be hashed by pre-save hook
        phone: "6789012345",
        address: "987 Cedar Lane, City, State 12345",
        role: "customer",
        isActive: true,
      },
      {
        name: "Bob Martinez",
        email: "bob.martinez@example.com",
        password: "customer123",
        phone: "7890123456",
        address: "147 Birch Boulevard, City, State 12345",
        role: "customer",
        isActive: true,
      },
      {
        name: "Carol Taylor",
        email: "carol.taylor@example.com",
        password: "customer123",
        phone: "8901234567",
        address: "258 Spruce Court, City, State 12345",
        role: "customer",
        isActive: true,
      },
      {
        name: "Daniel Lee",
        email: "daniel.lee@example.com",
        password: "customer123",
        phone: "9012345678",
        address: "369 Willow Way, City, State 12345",
        role: "customer",
        isActive: true,
      },
      {
        name: "Eva Garcia",
        email: "eva.garcia@example.com",
        password: "customer123",
        phone: "0123456789",
        address: "741 Ash Street, City, State 12345",
        role: "customer",
        isActive: true,
      },
    ];

    // Create customers individually to trigger password hashing hooks
    const customers = [];
    for (const customerData of customersData) {
      const customer = new Customer(customerData);
      await customer.save();
      customers.push(customer);
    }
    
    console.log(`✅ Created ${customers.length} customers (password: customer123)`);
    return customers;
  } catch (error) {
    console.error("❌ Error seeding customers:", error);
    throw error;
  }
};

// Seed Items
const seedItems = async () => {
  try {
    console.log("\n📦 Seeding Items...");
    
    const itemsData = [
      {
        name: "Vacuum Cleaner",
        description: "High-power vacuum cleaner for deep cleaning",
        category: "Cleaning Equipment",
        price: 299.99,
        quantity: 10,
        isAvailable: true,
      },
      {
        name: "Cleaning Supplies Kit",
        description: "Complete cleaning supplies kit with detergents and brushes",
        category: "Cleaning Supplies",
        price: 49.99,
        quantity: 25,
        isAvailable: true,
      },
      {
        name: "Plumbing Tools Set",
        description: "Professional plumbing tools set",
        category: "Tools",
        price: 199.99,
        quantity: 8,
        isAvailable: true,
      },
      {
        name: "Electrical Wire",
        description: "Copper electrical wire 12 AWG, 100ft",
        category: "Electrical Supplies",
        price: 89.99,
        quantity: 15,
        isAvailable: true,
      },
      {
        name: "Paint Brush Set",
        description: "Professional paint brush set with various sizes",
        category: "Painting Supplies",
        price: 34.99,
        quantity: 20,
        isAvailable: true,
      },
      {
        name: "Hammer",
        description: "Heavy-duty hammer for carpentry work",
        category: "Tools",
        price: 24.99,
        quantity: 30,
        isAvailable: true,
      },
      {
        name: "Screwdriver Set",
        description: "Complete screwdriver set with multiple sizes",
        category: "Tools",
        price: 19.99,
        quantity: 40,
        isAvailable: true,
      },
      {
        name: "Safety Gloves",
        description: "Protective safety gloves for work",
        category: "Safety Equipment",
        price: 12.99,
        quantity: 50,
        isAvailable: true,
      },
      {
        name: "Ladder",
        description: "Extendable aluminum ladder 10ft",
        category: "Equipment",
        price: 149.99,
        quantity: 5,
        isAvailable: true,
      },
      {
        name: "Toolbox",
        description: "Large professional toolbox with compartments",
        category: "Storage",
        price: 79.99,
        quantity: 12,
        isAvailable: true,
      },
    ];

    const items = await Item.insertMany(itemsData);
    console.log(`✅ Created ${items.length} items`);
    return items;
  } catch (error) {
    console.error("❌ Error seeding items:", error);
    throw error;
  }
};

// Seed Bookings
const seedBookings = async (customers, providers) => {
  try {
    console.log("\n📅 Seeding Bookings...");
    
    if (customers.length === 0 || providers.length === 0) {
      console.log("⚠️  Skipping bookings - no customers or providers available");
      return [];
    }

    const statuses = ["Pending", "Confirmed", "Completed", "Cancelled"];
    const bookingsData = [];

    // Create 5 bookings with random assignments
    for (let i = 0; i < 5; i++) {
      const customer = customers[Math.floor(Math.random() * customers.length)];
      const provider = providers[Math.floor(Math.random() * providers.length)];
      const status = statuses[Math.floor(Math.random() * statuses.length)];
      
      // Create scheduled date (between today and 30 days from now)
      const scheduledDate = new Date();
      scheduledDate.setDate(scheduledDate.getDate() + Math.floor(Math.random() * 30));
      
      // Random amount between 50 and 500
      const totalAmount = Math.floor(Math.random() * 450) + 50;

      bookingsData.push({
        customer: customer._id,
        provider: provider._id,
        scheduled_date: scheduledDate,
        status: status,
        total_amount: totalAmount,
      });
    }

    const bookings = await Booking.insertMany(bookingsData);
    console.log(`✅ Created ${bookings.length} bookings`);
    return bookings;
  } catch (error) {
    console.error("❌ Error seeding bookings:", error);
    throw error;
  }
};

// Seed Reviews
const seedReviews = async (bookings, customers, providers) => {
  try {
    console.log("\n⭐ Seeding Reviews...");
    
    if (bookings.length === 0) {
      console.log("⚠️  Skipping reviews - no bookings available");
      return [];
    }

    const comments = [
      "Great service! Very professional and efficient.",
      "Excellent work, highly recommended!",
      "Satisfied with the service, will use again.",
      "Good quality work, but could be faster.",
      "Outstanding service, exceeded expectations!",
      "Professional and reliable, very happy!",
      "Good service, fair pricing.",
    ];

    const reviewsData = [];
    
    // Create reviews for completed bookings only
    const completedBookings = bookings.filter(b => b.status === "Completed");
    const bookingsToReview = completedBookings.slice(0, Math.min(5, completedBookings.length));

    if (bookingsToReview.length === 0) {
      // If no completed bookings, create reviews for some bookings anyway
      const bookingsForReview = bookings.slice(0, Math.min(3, bookings.length));
      
      for (const booking of bookingsForReview) {
        const customer = customers.find(c => c._id.toString() === booking.customer.toString());
        const provider = providers.find(p => p._id.toString() === booking.provider.toString());
        
        if (customer && provider) {
          reviewsData.push({
            booking_id: booking._id,
            customer_id: customer._id,
            provider_id: provider._id,
            rating: Math.floor(Math.random() * 3) + 3, // Rating between 3 and 5
            comment: comments[Math.floor(Math.random() * comments.length)],
          });
        }
      }
    } else {
      for (const booking of bookingsToReview) {
        const customer = customers.find(c => c._id.toString() === booking.customer.toString());
        const provider = providers.find(p => p._id.toString() === booking.provider.toString());
        
        if (customer && provider) {
          reviewsData.push({
            booking_id: booking._id,
            customer_id: customer._id,
            provider_id: provider._id,
            rating: Math.floor(Math.random() * 3) + 3, // Rating between 3 and 5
            comment: comments[Math.floor(Math.random() * comments.length)],
          });
        }
      }
    }

    if (reviewsData.length > 0) {
      const reviews = await Review.insertMany(reviewsData);
      console.log(`✅ Created ${reviews.length} reviews`);
      return reviews;
    } else {
      console.log("⚠️  No reviews created - no valid bookings found");
      return [];
    }
  } catch (error) {
    console.error("❌ Error seeding reviews:", error);
    throw error;
  }
};

// Main seeding function
const seedDatabase = async () => {
  try {
    console.log("\n🌱 Starting database seeding process...\n");
    console.log("Environment: ", process.env.NODE_ENV || "development");

    // Connect to database
    await connectDB();

    // Clear existing data
    await clearCollections();

    // Seed data
    const admin = await seedAdmin();
    const providers = await seedProviders();
    const customers = await seedCustomers();
    const items = await seedItems();
    const bookings = await seedBookings(customers, providers);
    const reviews = await seedReviews(bookings, customers, providers);

    // Summary
    console.log("\n" + "=".repeat(50));
    console.log("📊 Seeding Summary:");
    console.log("=".repeat(50));
    console.log(`👤 Admin: 1`);
    console.log(`👷 Providers: ${providers.length}`);
    console.log(`👥 Customers: ${customers.length}`);
    console.log(`📦 Items: ${items.length}`);
    console.log(`📅 Bookings: ${bookings.length}`);
    console.log(`⭐ Reviews: ${reviews.length}`);
    console.log("=".repeat(50));
    console.log("\n✅ Database seeded successfully!");
    console.log("\n📝 Test Credentials:");
    console.log("   Admin: admin@example.com / admin123");
    console.log("   Provider: john.smith@example.com / provider123");
    console.log("   Customer: alice.anderson@example.com / customer123");
    console.log("\n");

    // Close connection
    await mongoose.connection.close();
    console.log("✅ Database connection closed.");
    process.exit(0);
  } catch (error) {
    console.error("\n❌ Error during seeding:", error);
    await mongoose.connection.close();
    process.exit(1);
  }
};

// Run seeding
seedDatabase();

