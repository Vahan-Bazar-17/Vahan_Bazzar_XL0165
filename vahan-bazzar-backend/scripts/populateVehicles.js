import mongoose from "mongoose";
import dotenv from "dotenv";
import Vehicle from "../models/Vehicle.js";

dotenv.config();

// Connect to MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost:27017/vahan-bazar");
    console.log("MongoDB connected");
  } catch (error) {
    console.error("MongoDB connection error:", error);
    process.exit(1);
  }
};

// Sample vehicles data (new format)
const sampleVehicles = [
  {
    product_id: "V001",
    category: "Bike",
    sub_type: "Sports",
    fuel_type: "Petrol",
    brand: "Honda",
    model: "CBR 250R",
    variant: "Standard",
    year: 2024,
    engine: {
      capacity: "249cc",
      type: "Liquid-cooled, 4-stroke, DOHC",
      cylinders: 1,
      power: "26.5 bhp @ 8500 rpm",
      torque: "22.9 Nm @ 7000 rpm"
    },
    dimensions: {
      length: "2030 mm",
      width: "720 mm",
      height: "1127 mm",
      weight: "161 kg",
      wheelbase: "1369 mm"
    },
    performance: {
      top_speed: "135 km/h",
      mileage: "30 kmpl"
    },
    features: {
      abs: true,
      digital_console: true,
      led_headlamp: true,
      bluetooth_connectivity: false
    },
    pricing: {
      ex_showroom: 180000,
      on_road: 210000,
      currency: "INR"
    },
    availability: {
      in_stock: true,
      stock_count: 15,
      delivery_time: "7-10 days"
    },
    images: {
      thumbnail: "https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=400",
      gallery: [
        "https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=800",
        "https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?w=800"
      ]
    },
    ratings: {
      average: 4.5,
      total_reviews: 126
    },
    isUserListing: false,
    listingDetails: {
      createdBy: "admin",
      createdAt: new Date(),
      lastUpdated: new Date()
    }
  },
  {
    product_id: "V002",
    category: "Scooter",
    sub_type: "Commuter",
    fuel_type: "Petrol",
    brand: "Yamaha",
    model: "Fascino 125",
    variant: "Deluxe",
    year: 2024,
    engine: {
      capacity: "125cc",
      type: "Air-cooled, 4-stroke",
      cylinders: 1,
      power: "8.2 bhp @ 6500 rpm",
      torque: "9.7 Nm @ 5000 rpm"
    },
    dimensions: {
      length: "1800 mm",
      width: "685 mm",
      height: "1115 mm",
      weight: "99 kg",
      wheelbase: "1280 mm"
    },
    performance: {
      top_speed: "90 km/h",
      mileage: "55 kmpl"
    },
    features: {
      abs: false,
      digital_console: true,
      led_headlamp: true,
      bluetooth_connectivity: false
    },
    pricing: {
      ex_showroom: 85000,
      on_road: 95000,
      currency: "INR"
    },
    availability: {
      in_stock: true,
      stock_count: 25,
      delivery_time: "5-7 days"
    },
    images: {
      thumbnail: "https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=400",
      gallery: [
        "https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=800",
        "https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?w=800"
      ]
    },
    ratings: {
      average: 4.2,
      total_reviews: 200
    },
    isUserListing: false,
    listingDetails: {
      createdBy: "admin",
      createdAt: new Date(),
      lastUpdated: new Date()
    }
  },
  {
    product_id: "V003",
    category: "EV",
    sub_type: "Electric Scooter",
    fuel_type: "Electric",
    brand: "Ola",
    model: "S1 Pro",
    variant: "Gen 2",
    year: 2024,
    battery: {
      capacity_kwh: 3.97,
      charging_time_hours: 4.5,
      fast_charging: true,
      range_km: 195
    },
    dimensions: {
      length: "1860 mm",
      width: "700 mm",
      height: "1150 mm",
      weight: "125 kg",
      wheelbase: "1300 mm"
    },
    performance: {
      top_speed: "116 km/h",
      mileage: "195 km range"
    },
    features: {
      abs: true,
      digital_console: true,
      led_headlamp: true,
      bluetooth_connectivity: true
    },
    pricing: {
      ex_showroom: 140000,
      on_road: 150000,
      currency: "INR"
    },
    availability: {
      in_stock: true,
      stock_count: 10,
      delivery_time: "7-10 days"
    },
    images: {
      thumbnail: "https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=400",
      gallery: [
        "https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=800",
        "https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?w=800"
      ]
    },
    ratings: {
      average: 4.3,
      total_reviews: 300
    },
    isUserListing: false,
    listingDetails: {
      createdBy: "admin",
      createdAt: new Date(),
      lastUpdated: new Date()
    }
  },
  {
    product_id: "V004",
    category: "Bike",
    sub_type: "Cruiser",
    fuel_type: "Petrol",
    brand: "Royal Enfield",
    model: "Classic 350",
    variant: "Rebel Red",
    year: 2024,
    engine: {
      capacity: "349cc",
      type: "Air-cooled, 4-stroke",
      cylinders: 1,
      power: "20.2 bhp @ 6100 rpm",
      torque: "27 Nm @ 4000 rpm"
    },
    dimensions: {
      length: "2160 mm",
      width: "800 mm",
      height: "1100 mm",
      weight: "195 kg",
      wheelbase: "1390 mm"
    },
    performance: {
      top_speed: "120 km/h",
      mileage: "30 kmpl"
    },
    features: {
      abs: true,
      digital_console: false,
      led_headlamp: true,
      bluetooth_connectivity: false
    },
    pricing: {
      ex_showroom: 200000,
      on_road: 225000,
      currency: "INR"
    },
    availability: {
      in_stock: true,
      stock_count: 8,
      delivery_time: "15-20 days"
    },
    images: {
      thumbnail: "https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=400",
      gallery: [
        "https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=800",
        "https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?w=800"
      ]
    },
    ratings: {
      average: 4.4,
      total_reviews: 500
    },
    isUserListing: false,
    listingDetails: {
      createdBy: "admin",
      createdAt: new Date(),
      lastUpdated: new Date()
    }
  },
  {
    product_id: "V005",
    category: "Bike",
    sub_type: "Sports",
    fuel_type: "Petrol",
    brand: "KTM",
    model: "Duke 390",
    variant: "Orange",
    year: 2024,
    engine: {
      capacity: "373cc",
      type: "Liquid-cooled, 4-stroke, DOHC",
      cylinders: 1,
      power: "43 bhp @ 9000 rpm",
      torque: "37 Nm @ 7000 rpm"
    },
    dimensions: {
      length: "2002 mm",
      width: "821 mm",
      height: "1267 mm",
      weight: "149 kg",
      wheelbase: "1357 mm"
    },
    performance: {
      top_speed: "170 km/h",
      mileage: "25 kmpl"
    },
    features: {
      abs: true,
      digital_console: true,
      led_headlamp: true,
      bluetooth_connectivity: true
    },
    pricing: {
      ex_showroom: 320000,
      on_road: 360000,
      currency: "INR"
    },
    availability: {
      in_stock: true,
      stock_count: 5,
      delivery_time: "20-25 days"
    },
    images: {
      thumbnail: "https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=400",
      gallery: [
        "https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=800",
        "https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?w=800"
      ]
    },
    ratings: {
      average: 4.8,
      total_reviews: 1200
    },
    isUserListing: false,
    listingDetails: {
      createdBy: "admin",
      createdAt: new Date(),
      lastUpdated: new Date()
    }
  }
];

// Function to populate database
const populateDatabase = async () => {
  try {
    await connectDB();
    
    // Clear existing vehicles
    await Vehicle.deleteMany({});
    console.log("Cleared existing vehicles");
    
    // Insert sample vehicles one by one
    let insertedCount = 0;
    for (const vehicleData of sampleVehicles) {
      try {
        const vehicle = new Vehicle(vehicleData);
        await vehicle.save();
        insertedCount++;
        console.log(`Inserted vehicle ${vehicleData.product_id}`);
      } catch (error) {
        console.error(`Error inserting vehicle ${vehicleData.product_id}:`, error.message);
      }
    }
    console.log(`Inserted ${insertedCount} vehicles`);
    
    console.log("Database populated successfully!");
    process.exit(0);
  } catch (error) {
    console.error("Error populating database:", error);
    process.exit(1);
  }
};

// Run the script
populateDatabase();
