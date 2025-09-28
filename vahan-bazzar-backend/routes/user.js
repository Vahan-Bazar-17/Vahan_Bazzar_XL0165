import express from 'express';
import User from '../models/User.js';
import Vehicle from '../models/Vehicle.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Get user test rides
router.get('/:userId/test-rides', authenticateToken, async (req, res) => {
  try {
    // Use the authenticated user's ID instead of URL parameter
    const user = await User.findById(req.user._id).populate('testRides.vehicleId');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const testRides = user.testRides.map(ride => ({
      _id: ride._id,
      vehicleId: ride.vehicleId._id,
      vehicleName: `${ride.vehicleId.brand} ${ride.vehicleId.model}`,
      vehicleImage: ride.vehicleId.images?.thumbnail,
      scheduledDate: ride.scheduledDate,
      status: ride.status,
      location: ride.location,
      createdAt: ride.createdAt
    }));

    res.json(testRides);
  } catch (error) {
    console.error('Error fetching test rides:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get user listings
router.get('/:userId/listings', authenticateToken, async (req, res) => {
  try {
    // Use the authenticated user's ID instead of URL parameter
    const user = await User.findById(req.user._id).populate('listings.vehicleId');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const listings = user.listings.map(listing => ({
      _id: listing._id,
      brand: listing.vehicleId.brand,
      model: listing.vehicleId.model,
      variant: listing.vehicleId.variant,
      year: listing.vehicleId.year,
      category: listing.vehicleId.category,
      fuel_type: listing.vehicleId.fuel_type,
      mileage: listing.vehicleId.listingDetails?.mileage,
      condition: listing.vehicleId.listingDetails?.condition,
      price: listing.vehicleId.pricing?.ex_showroom_inr,
      description: listing.vehicleId.listingDetails?.description,
      location: listing.vehicleId.listingDetails?.location,
      images: listing.vehicleId.images?.gallery || [listing.vehicleId.images?.thumbnail],
      status: listing.status,
      createdAt: listing.createdAt
    }));

    res.json(listings);
  } catch (error) {
    console.error('Error fetching listings:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Book a test ride
router.post('/:userId/test-rides', authenticateToken, async (req, res) => {
  try {
    const { vehicleId, scheduledDate, location } = req.body;
    
    // Use the authenticated user's ID instead of URL parameter
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const vehicle = await Vehicle.findById(vehicleId);
    if (!vehicle) {
      return res.status(404).json({ message: 'Vehicle not found' });
    }

    const testRide = {
      vehicleId,
      scheduledDate: new Date(scheduledDate),
      location,
      status: 'pending'
    };

    user.testRides.push(testRide);
    await user.save();

    res.status(201).json({ message: 'Test ride booked successfully', testRide });
  } catch (error) {
    console.error('Error booking test ride:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Cancel a test ride
router.put('/test-rides/:testRideId/cancel', authenticateToken, async (req, res) => {
  try {
    const user = await User.findOne({ 'testRides._id': req.params.testRideId });
    
    if (!user) {
      return res.status(404).json({ message: 'Test ride not found' });
    }

    const testRide = user.testRides.id(req.params.testRideId);
    if (!testRide) {
      return res.status(404).json({ message: 'Test ride not found' });
    }

    testRide.status = 'cancelled';
    await user.save();

    res.json({ message: 'Test ride cancelled successfully' });
  } catch (error) {
    console.error('Error cancelling test ride:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Remove a listing
router.delete('/listings/:listingId', authenticateToken, async (req, res) => {
  try {
    const user = await User.findOne({ 'listings._id': req.params.listingId });
    
    if (!user) {
      return res.status(404).json({ message: 'Listing not found' });
    }

    const listing = user.listings.id(req.params.listingId);
    if (!listing) {
      return res.status(404).json({ message: 'Listing not found' });
    }

    // Update vehicle status
    await Vehicle.findByIdAndUpdate(listing.vehicleId, {
      'listingDetails.status': 'removed'
    });

    // Remove from user's listings
    user.listings.pull(req.params.listingId);
    await user.save();

    res.json({ message: 'Listing removed successfully' });
  } catch (error) {
    console.error('Error removing listing:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
