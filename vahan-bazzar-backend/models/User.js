import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    phone: { type: String },
    role: { type: String, enum: ["user", "dealer"], default: "user" },
    testRides: [{
      vehicleId: { type: mongoose.Schema.Types.ObjectId, ref: 'Vehicle' },
      scheduledDate: { type: Date, required: true },
      location: { type: String, required: true },
      status: { type: String, enum: ['pending', 'confirmed', 'completed', 'cancelled'], default: 'pending' },
      createdAt: { type: Date, default: Date.now }
    }],
    listings: [{
      vehicleId: { type: mongoose.Schema.Types.ObjectId, ref: 'Vehicle' },
      status: { type: String, enum: ['active', 'sold', 'removed'], default: 'active' },
      createdAt: { type: Date, default: Date.now }
    }]
  },
  { timestamps: true }
);

// Hash password before saving
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

// Compare password method
userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.model("User", userSchema);

export default User;
