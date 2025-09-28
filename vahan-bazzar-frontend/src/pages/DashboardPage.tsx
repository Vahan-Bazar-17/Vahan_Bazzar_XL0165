import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';

interface TestRide {
  _id: string;
  vehicleId: {
    _id: string;
    brand: string;
    model: string;
    variant: string;
  };
  scheduledDate: string;
  location: string;
  status: string;
  createdAt: string;
}

interface UserListing {
  _id: string;
  vehicleId: {
    _id: string;
    brand: string;
    model: string;
    variant: string;
    pricing: {
      ex_showroom_inr: number;
    };
    images: {
      thumbnail?: string;
    };
  };
  status: string;
  createdAt: string;
}

const DashboardPage: React.FC = () => {
  const { user } = useAuth();
  const [testRides, setTestRides] = useState<TestRide[]>([]);
  const [userListings, setUserListings] = useState<UserListing[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'test-rides' | 'listings'>('test-rides');

  useEffect(() => {
    if (user) {
      fetchUserData();
    }
  }, [user]);

  const fetchUserData = async () => {
    try {
      setLoading(true);
      const [testRidesResponse, listingsResponse] = await Promise.all([
        axios.get(`http://localhost:5000/api/users/${user?.id}/test-rides`),
        axios.get(`http://localhost:5000/api/users/${user?.id}/listings`)
      ]);
      
      setTestRides(testRidesResponse.data || []);
      setUserListings(listingsResponse.data || []);
    } catch (error) {
      console.error('Error fetching user data:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', { 
      style: 'currency', 
      currency: 'INR', 
      maximumFractionDigits: 0 
    }).format(price);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex items-center justify-center">
        <div className="loading-spinner"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Welcome back, {user?.name}!
          </h1>
          <p className="text-xl text-gray-600">
            Manage your test rides and vehicle listings
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="stats-card">
            <div className="flex items-center">
              <div className="p-3 bg-blue-100 rounded-lg">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <div className="ml-4">
                <div className="stats-number">{testRides.length}</div>
                <div className="stats-label">Test Rides Booked</div>
              </div>
            </div>
          </div>

          <div className="stats-card">
            <div className="flex items-center">
              <div className="p-3 bg-green-100 rounded-lg">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="ml-4">
                <div className="stats-number">{userListings.length}</div>
                <div className="stats-label">Vehicles Listed</div>
              </div>
            </div>
          </div>

          <div className="stats-card">
            <div className="flex items-center">
              <div className="p-3 bg-purple-100 rounded-lg">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              </div>
              <div className="ml-4">
                <div className="stats-number">{userListings.filter(l => l.status === 'active').length}</div>
                <div className="stats-label">Active Listings</div>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-2xl shadow-soft overflow-hidden">
          <div className="border-b border-gray-200">
            <nav className="flex">
              <button
                onClick={() => setActiveTab('test-rides')}
                className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors duration-300 ${
                  activeTab === 'test-rides'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                My Test Rides ({testRides.length})
              </button>
              <button
                onClick={() => setActiveTab('listings')}
                className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors duration-300 ${
                  activeTab === 'listings'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                My Listings ({userListings.length})
              </button>
            </nav>
          </div>

          <div className="p-6">
            {activeTab === 'test-rides' ? (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl font-semibold text-gray-900">Test Rides</h3>
                  <Link to="/browse" className="btn-primary">
                    Book New Test Ride
                  </Link>
                </div>

                {testRides.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="text-6xl mb-4">🏍️</div>
                    <h4 className="text-xl font-semibold text-gray-900 mb-2">No test rides booked yet</h4>
                    <p className="text-gray-600 mb-6">Book a test ride to experience your dream vehicle</p>
                    <Link to="/browse" className="btn-primary">
                      Browse Vehicles
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {testRides.map((ride) => (
                      <div key={ride._id} className="bg-gray-50 rounded-lg p-6">
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="text-lg font-semibold text-gray-900">
                              {ride.vehicleId.brand} {ride.vehicleId.model} {ride.vehicleId.variant}
                            </h4>
                            <p className="text-gray-600">Scheduled for {formatDate(ride.scheduledDate)}</p>
                            <p className="text-gray-600">Location: {ride.location}</p>
                          </div>
                          <div className="text-right">
                            <span className={`badge ${
                              ride.status === 'confirmed' ? 'badge-success' :
                              ride.status === 'pending' ? 'badge-warning' :
                              'badge-danger'
                            }`}>
                              {ride.status}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl font-semibold text-gray-900">My Listings</h3>
                  <Link to="/sell" className="btn-primary">
                    List New Vehicle
                  </Link>
                </div>

                {userListings.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="text-6xl mb-4">🚗</div>
                    <h4 className="text-xl font-semibold text-gray-900 mb-2">No vehicles listed yet</h4>
                    <p className="text-gray-600 mb-6">Start selling by listing your vehicle</p>
                    <Link to="/sell" className="btn-primary">
                      List Your Vehicle
                    </Link>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {userListings.map((listing) => (
                      <div key={listing._id} className="vehicle-card">
                        <div className="relative overflow-hidden">
                          <img
                            src={listing.vehicleId.images?.thumbnail || 'https://via.placeholder.com/400x300?text=No+Image'}
                            alt={`${listing.vehicleId.brand} ${listing.vehicleId.model}`}
                            className="vehicle-card-image"
                          />
                          <div className="absolute top-4 right-4">
                            <span className={`badge ${
                              listing.status === 'active' ? 'badge-success' :
                              listing.status === 'sold' ? 'badge-warning' :
                              'badge-danger'
                            }`}>
                              {listing.status}
                            </span>
                          </div>
                        </div>
                        
                        <div className="p-6">
                          <h4 className="text-lg font-semibold text-gray-900 mb-2">
                            {listing.vehicleId.brand} {listing.vehicleId.model} {listing.vehicleId.variant}
                          </h4>
                          <div className="price-display mb-4">
                            {formatPrice(listing.vehicleId.pricing.ex_showroom_inr)}
                          </div>
                          <div className="flex space-x-2">
                            <button className="flex-1 btn-secondary text-sm">
                              Edit
                            </button>
                            <button className="flex-1 btn-danger text-sm">
                              Remove
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
