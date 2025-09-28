import mongoose from "mongoose";
import dotenv from "dotenv";
import Vehicle from "../models/Vehicle.js";

dotenv.config();

const connectDB = async () => {
  const uri = process.env.MONGODB_URI || "mongodb://localhost:27017/vahan-bazar";
  await mongoose.connect(uri);
  console.log("MongoDB connected");
};

function ensureStringWithUnit(value, unit) {
  if (value === undefined || value === null) return undefined;
  if (typeof value === 'string') return value;
  if (typeof value === 'number' && !isNaN(value)) return `${value} ${unit}`.trim();
  return undefined;
}

async function migrate() {
  await connectDB();
  const cursor = Vehicle.find({}).cursor();
  let processed = 0;
  let updated = 0;

  for (let doc = await cursor.next(); doc != null; doc = await cursor.next()) {
    processed++;
    const update = {};

    // product_id
    if (!doc.product_id) {
      update.product_id = doc.id || `prod_${doc._id.toString().slice(-8)}`;
    }

    // category normalization (allow existing)
    if (doc.category && !["Car","Bike","Scooter","EV","Sports"].includes(doc.category)) {
      // keep as-is; schema allows these plus Sports
    }

    // engine mapping
    if (doc.engine) {
      const engUpdate = { ...doc.engine };
      if (doc.engine.capacity_cc && !doc.engine.capacity) {
        engUpdate.capacity = ensureStringWithUnit(doc.engine.capacity_cc, 'cc');
      }
      if (doc.engine.max_power_bhp && !doc.engine.power) {
        engUpdate.power = ensureStringWithUnit(doc.engine.max_power_bhp, 'bhp');
      }
      if (doc.engine.max_torque_nm && !doc.engine.torque) {
        engUpdate.torque = ensureStringWithUnit(doc.engine.max_torque_nm, 'Nm');
      }
      update.engine = engUpdate;
    }

    // dimensions mapping to string fields when numeric available
    const dim = doc.dimensions || {};
    const dimUpdate = { ...doc.dimensions };
    if (dim.length_mm && !dim.length) dimUpdate.length = ensureStringWithUnit(dim.length_mm, 'mm');
    if (dim.width_mm && !dim.width) dimUpdate.width = ensureStringWithUnit(dim.width_mm, 'mm');
    if (dim.height_mm && !dim.height) dimUpdate.height = ensureStringWithUnit(dim.height_mm, 'mm');
    if (dim.kerb_weight_kg && !dim.weight) dimUpdate.weight = ensureStringWithUnit(dim.kerb_weight_kg, 'kg');
    if (dim.wheelbase_mm && !dim.wheelbase) dimUpdate.wheelbase = ensureStringWithUnit(dim.wheelbase_mm, 'mm');
    if (Object.keys(dimUpdate).length) update.dimensions = dimUpdate;

    // performance mapping
    const perf = doc.performance || {};
    const perfUpdate = { ...doc.performance };
    if (perf.top_speed_kmph && !perf.top_speed) perfUpdate.top_speed = ensureStringWithUnit(perf.top_speed_kmph, 'km/h');
    if (perf.mileage_kmpl && !perf.mileage) perfUpdate.mileage = ensureStringWithUnit(perf.mileage_kmpl, 'kmpl');
    if (Object.keys(perfUpdate).length) update.performance = perfUpdate;

    // pricing mapping
    const pricing = doc.pricing || {};
    const pricingUpdate = { ...doc.pricing };
    if (pricing.ex_showroom_inr && !pricing.ex_showroom) pricingUpdate.ex_showroom = pricing.ex_showroom_inr;
    if (pricing.on_road_inr && !pricing.on_road) pricingUpdate.on_road = pricing.on_road_inr;
    if (!pricingUpdate.currency) pricingUpdate.currency = 'INR';
    update.pricing = pricingUpdate;

    // ratings mapping
    const ratings = doc.ratings || {};
    const ratingsUpdate = { ...doc.ratings };
    if (!ratingsUpdate.average) {
      // prefer user_rating if present, else expert_rating
      ratingsUpdate.average = ratings.user_rating ?? ratings.expert_rating ?? undefined;
    }
    if (!ratingsUpdate.total_reviews && ratings.reviews_count) ratingsUpdate.total_reviews = ratings.reviews_count;
    update.ratings = ratingsUpdate;

    // listingDetails timestamps
    const ld = doc.listingDetails || {};
    const ldUpdate = { ...ld };
    if (!ldUpdate.createdAt) ldUpdate.createdAt = doc.createdAt || new Date();
    if (!ldUpdate.lastUpdated) ldUpdate.lastUpdated = doc.updatedAt || new Date();
    update.listingDetails = ldUpdate;

    // write back if changes
    await Vehicle.updateOne({ _id: doc._id }, { $set: update });
    updated++;
  }

  console.log(`Processed: ${processed}, Updated: ${updated}`);
  await mongoose.disconnect();
  console.log("Migration complete");
}

migrate().catch((e) => {
  console.error("Migration error:", e);
  process.exit(1);
});


