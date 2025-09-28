import mongoose from "mongoose";
import dotenv from "dotenv";
import Vehicle from "../models/Vehicle.js";

dotenv.config();

async function run() {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/vahan-bazar');
    const res = await Vehicle.updateMany({}, { $unset: { images: 1 } });
    console.log(`Updated ${res.modifiedCount || res.nModified || 0} documents`);
    await mongoose.disconnect();
    console.log('Removed images fields from all Vehicle documents');
  } catch (e) {
    console.error('Error removing images fields:', e);
    process.exit(1);
  }
}

run();


