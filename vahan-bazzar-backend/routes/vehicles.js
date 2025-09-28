import express from "express";
import Vehicle from "../models/Vehicle.js";
import User from "../models/User.js";
import { calculateEMI, calculateFuelCost } from "./utils.js";
import { authenticateToken } from "../middleware/auth.js";

const router = express.Router();

// Get all vehicles with filters
router.get("/", async (req, res) => {
  try {
    const { category, brand, fuel_type, min_price, max_price, search } = req.query;
    const filter = {};

    if (category) filter.category = category;
    if (brand) filter.brand = brand;
    if (fuel_type) filter.fuel_type = fuel_type;
    if (min_price || max_price) {
      filter["pricing.ex_showroom"] = {};
      if (min_price) filter["pricing.ex_showroom"].$gte = Number(min_price);
      if (max_price) filter["pricing.ex_showroom"].$lte = Number(max_price);
    }
    if (search) {
      const q = String(search).trim();
      const isNumeric = !isNaN(Number(q));
      const orClauses = [
        { brand: { $regex: q, $options: "i" } },
        { model: { $regex: q, $options: "i" } },
        { variant: { $regex: q, $options: "i" } },
        { category: { $regex: q, $options: "i" } },
        { fuel_type: { $regex: q, $options: "i" } },
        { "listingDetails.createdBy": { $regex: q, $options: "i" } }
      ];
      if (isNumeric) {
        const n = Number(q);
        orClauses.push(
          { "pricing.ex_showroom": n },
          { "pricing.on_road": n }
        );
        // Also match textual performance fields
        orClauses.push({ "performance.mileage": { $regex: q, $options: "i" } });
        orClauses.push({ "performance.top_speed": { $regex: q, $options: "i" } });
      } else {
        // textual performance fields
        orClauses.push({ "performance.mileage": { $regex: q, $options: "i" } });
        orClauses.push({ "performance.top_speed": { $regex: q, $options: "i" } });
      }
      filter.$or = orClauses;
    }

    const vehicles = await Vehicle.find(filter).sort({ "pricing.ex_showroom": 1 });
    res.json(vehicles);
  } catch (err) {
    res.status(500).json({ message: "Server Error", error: err.message });
  }
});

// Get single vehicle
router.get("/:id", async (req, res) => {
  try {
    const vehicle = await Vehicle.findById(req.params.id);
    if (!vehicle) return res.status(404).json({ message: "Vehicle not found" });
    res.json(vehicle);
  } catch (err) {
    res.status(500).json({ message: "Server Error", error: err.message });
  }
});

// Compare vehicles (by IDs)
router.post("/compare", async (req, res) => {
  try {
    const { ids } = req.body;
    if (!ids || ids.length < 2 || ids.length > 4) {
      return res.status(400).json({ message: "Please select 2-4 vehicles to compare" });
    }
    const vehicles = await Vehicle.find({ _id: { $in: ids } });
    res.json(vehicles);
  } catch (err) {
    res.status(500).json({ message: "Compare Error", error: err.message });
  }
});

// EMI calculator
router.post("/emi", (req, res) => {
  const { principal, rate, tenure } = req.body;
  const emi = calculateEMI(principal, rate, tenure);
  res.json({ emi });
});

// Fuel cost calculator
router.post("/fuel-cost", (req, res) => {
  const { distance, mileage, fuelPrice } = req.body;
  const cost = calculateFuelCost(distance, mileage, fuelPrice);
  res.json({ cost });
});

// Add a new vehicle (protected route)
router.post("/", authenticateToken, async (req, res) => {
  try {
    const vehicleData = { ...req.body, dealer: req.user._id };
    const vehicle = new Vehicle(vehicleData);
    const saved = await vehicle.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ message: "Invalid Data", error: err.message });
  }
});

// Update vehicle (protected route)
router.put("/:id", authenticateToken, async (req, res) => {
  try {
    const vehicle = await Vehicle.findById(req.params.id);
    if (!vehicle) return res.status(404).json({ message: "Vehicle not found" });
    
    // Check if user is the dealer or admin
    if (vehicle.dealer.toString() !== req.user._id.toString() && req.user.role !== "admin") {
      return res.status(403).json({ message: "Not authorized" });
    }

    const updated = await Vehicle.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ message: "Update Error", error: err.message });
  }
});

// Delete vehicle (protected route)
router.delete("/:id", authenticateToken, async (req, res) => {
  try {
    const vehicle = await Vehicle.findById(req.params.id);
    if (!vehicle) return res.status(404).json({ message: "Vehicle not found" });
    
    // Check if user is the dealer or admin
    if (vehicle.dealer.toString() !== req.user._id.toString() && req.user.role !== "admin") {
      return res.status(403).json({ message: "Not authorized" });
    }

    await Vehicle.findByIdAndDelete(req.params.id);
    res.json({ message: "Vehicle removed" });
  } catch (err) {
    res.status(500).json({ message: "Delete Error", error: err.message });
  }
});

// Create user listing
router.post("/user-listing", authenticateToken, async (req, res) => {
  try {
    // TEMP DEBUG: Log headers and body to diagnose missing-fields issue
    try {
      console.log("/api/vehicles/user-listing headers:", req.headers);
      console.log("/api/vehicles/user-listing body:", req.body);
    } catch (_) {}
    const {
      brand,
      model,
      variant,
      year,
      category,
      fuel_type,
      mileage,
      condition,
      price,
      description,
      location,
      contact,
      engine_capacity,
      max_power,
      max_torque,
      top_speed,
      mileage_kmpl,
      seat_capacity,
      kerb_weight,
      fuel_tank_capacity,
      safety_features,
      comfort_features,
      technology_features
    } = req.body;


    // Validate required fields
    if (!brand || !model || !category || !fuel_type || !price) {
      return res.status(400).json({ 
        message: "Missing required fields: brand, model, category, fuel_type, and price are required",
        received: { brand, model, category, fuel_type, price }
      });
    }

    // Validate price is a number
    if (isNaN(parseInt(price))) {
      return res.status(400).json({ 
        message: "Price must be a valid number" 
      });
    }

    // Create vehicle with user listing details (new schema fields)
    const now = new Date();
    const generatedId = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const vehicle = new Vehicle({
      product_id: generatedId,
      category,
      brand,
      model,
      variant: variant || '',
      year: year ? parseInt(year) : new Date().getFullYear(),
      fuel_type,
      engine: {
        capacity: engine_capacity ? `${engine_capacity}cc` : undefined,
        power: max_power ? `${max_power} bhp` : undefined,
        torque: max_torque ? `${max_torque} Nm` : undefined
      },
      performance: {
        top_speed: top_speed ? `${top_speed} km/h` : undefined,
        mileage: mileage_kmpl ? `${mileage_kmpl} kmpl` : (mileage || undefined)
      },
      dimensions: {
        weight: kerb_weight ? `${kerb_weight} kg` : undefined,
      },
      features: {
        abs: safety_features?.includes('ABS') || false,
        digital_console: comfort_features?.includes('Digital Display') || false,
        led_headlamp: technology_features?.includes('LED') || false,
        bluetooth_connectivity: technology_features?.includes('Bluetooth') || false
      },
      pricing: {
        ex_showroom: parseInt(price),
        currency: 'INR'
      },
      isUserListing: true,
      listedBy: req.user._id,
      listingDetails: {
        createdBy: 'user',
        createdAt: now,
        lastUpdated: now
      }
    });

    await vehicle.save();

    // Add to user's listings
    const user = await User.findById(req.user._id);
    if (user) {
      user.listings.push({
        vehicleId: vehicle._id,
        status: 'active'
      });
      await user.save();
    }

    res.status(201).json({ message: "Vehicle listed successfully", vehicle });
  } catch (err) {
    console.error("User listing error:", err);
    res.status(500).json({ message: "Listing Error", error: err.message });
  }
});

export default router;
