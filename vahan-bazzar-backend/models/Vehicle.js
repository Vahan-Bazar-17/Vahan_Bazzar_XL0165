import mongoose from "mongoose";

// Define Schema (updated to new format)
const vehicleSchema = new mongoose.Schema(
  {
    product_id: { type: String, required: true, unique: true },
    category: { type: String, required: true, enum: ["Car", "Bike", "Scooter", "EV", "Sports"] },
    sub_type: { type: String },
    fuel_type: { type: String },

    brand: { type: String, required: true },
    model: { type: String, required: true },
    variant: { type: String },
    year: { type: Number },

    engine: {
      capacity: { type: String },
      type: { type: String },
      cylinders: { type: Number },
      power: { type: String },
      torque: { type: String }
    },

    battery: {
      capacity_kwh: { type: Number },
      charging_time_hours: { type: Number },
      fast_charging: { type: Boolean },
      range_km: { type: Number },
    },

    dimensions: {
      length: { type: String },
      width: { type: String },
      height: { type: String },
      weight: { type: String },
      wheelbase: { type: String }
    },

    performance: {
      top_speed: { type: String },
      mileage: { type: String }
    },

    features: {
      abs: { type: Boolean },
      digital_console: { type: Boolean },
      led_headlamp: { type: Boolean },
      bluetooth_connectivity: { type: Boolean }
    },

    pricing: {
      ex_showroom: { type: Number },
      on_road: { type: Number },
      currency: { type: String, default: "INR" }
    },

    availability: {
      in_stock: { type: Boolean, default: true },
      stock_count: { type: Number },
      delivery_time: { type: String }
    },

    images: {
      thumbnail: { type: String },
      gallery: [{ type: String }],
    },

    ratings: {
      average: { type: Number, min: 0, max: 5 },
      total_reviews: { type: Number }
    },

    last_updated: { type: Date, default: Date.now },
    
    // User listing fields
    isUserListing: { type: Boolean, default: false },
    listedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    listingDetails: {
      createdBy: { type: String },
      createdAt: { type: Date },
      lastUpdated: { type: Date }
    }
  },
  { timestamps: true }
);

// Create Model
const Vehicle = mongoose.model("Vehicle", vehicleSchema);

export default Vehicle;