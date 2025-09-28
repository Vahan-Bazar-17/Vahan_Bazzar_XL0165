import mongoose from "mongoose";
import dotenv from "dotenv";
import Vehicle from "./models/Vehicle.js";
import User from "./models/User.js";
import connectDB from "./config/db.js";
import fs from "fs";
import path from "path";

dotenv.config();
connectDB();

// Read sample data from JSON file
const sampleDataPath = path.join(process.cwd(), "data", "sample-vehicles.json");
const vehicles = JSON.parse(fs.readFileSync(sampleDataPath, "utf8"));

const importData = async () => {
  try {
    // Clear existing data
    await Vehicle.deleteMany();
    await User.deleteMany();

    // Create sample users
    const users = [
      {
        name: "John Doe",
        email: "john@example.com",
        password: "password123",
        phone: "+91-9876543210",
        role: "user"
      },
      {
        name: "Dealer Admin",
        email: "dealer@vahanbazar.com",
        password: "dealer123",
        phone: "+91-9876543211",
        role: "dealer"
      }
    ];

    const createdUsers = await User.insertMany(users);
    console.log("✅ Users created:", createdUsers.length);

    // Add dealer reference to vehicles
    const dealerId = createdUsers.find(u => u.role === "dealer")._id;
    const vehiclesWithDealer = vehicles.map(vehicle => ({
      ...vehicle,
      dealer: dealerId
    }));

    await Vehicle.insertMany(vehiclesWithDealer);
    console.log("✅ Vehicles imported:", vehicles.length);
    
    console.log("\n🎉 Sample data imported successfully!");
    console.log("📧 Test accounts created:");
    console.log("   User: john@example.com / password123");
    console.log("   Dealer: dealer@vahanbazar.com / dealer123");
    
    process.exit();
  } catch (err) {
    console.error("❌ Error with Data Import", err);
    process.exit(1);
  }
};

importData();
