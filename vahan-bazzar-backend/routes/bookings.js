import express from "express";
import Booking from "../models/Booking.js";
import { authenticateToken } from "../middleware/auth.js";

const router = express.Router();

// Create booking
router.post("/", authenticateToken, async (req, res) => {
  try {
    const bookingData = {
      ...req.body,
      user: req.user._id
    };
    const booking = new Booking(bookingData);
    const saved = await booking.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ message: "Booking failed", error: err.message });
  }
});

// Get user's bookings
router.get("/my-bookings", authenticateToken, async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user._id })
      .populate("vehicle", "brand model variant pricing images")
      .sort({ createdAt: -1 });
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ message: "Server Error", error: err.message });
  }
});

// Get all bookings (admin/dealer)
router.get("/", authenticateToken, async (req, res) => {
  try {
    if (req.user.role !== "admin" && req.user.role !== "dealer") {
      return res.status(403).json({ message: "Not authorized" });
    }
    
    const bookings = await Booking.find()
      .populate("user", "name email phone")
      .populate("vehicle", "brand model variant")
      .sort({ createdAt: -1 });
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ message: "Server Error", error: err.message });
  }
});

// Update booking status
router.put("/:id/status", authenticateToken, async (req, res) => {
  try {
    if (req.user.role !== "admin" && req.user.role !== "dealer") {
      return res.status(403).json({ message: "Not authorized" });
    }
    
    const { status } = req.body;
    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    ).populate("user", "name email phone")
     .populate("vehicle", "brand model variant");
    
    if (!booking) return res.status(404).json({ message: "Booking not found" });
    res.json(booking);
  } catch (err) {
    res.status(400).json({ message: "Update failed", error: err.message });
  }
});

export default router;
