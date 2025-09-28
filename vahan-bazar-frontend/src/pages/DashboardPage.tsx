import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';

interface TestRide {
  _id: string;
  vehicleId: string;
  vehicleName: string;
  vehicleImage: string;
  scheduledDate: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  location: string;
  createdAt: string;
}

interface UserListing {
  _id: string;
  brand: string;
  model: string;
  variant: string;
  year: number;
  category: string;
  fuel_type: string;
  mileage: string;
  condition: string;
  price: number;
  description: string;
  location: string;
  images: string[];
  status: 'active' | 'sold' | 'removed';
  createdAt: string;
}

const DashboardPage: React.FC = () => {
  const { user } = useAuth();
  const [testRides, setTestRides] = useState<TestRide[]>([]);
  const [userListings, setUserListings] = useState<UserListing[]>([]);
  const [loading, setLoading] = useState(true);
  const [cancelingId, setCancelingId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'test-rides' | 'listings'>('test-rides');

  useEffect(() => {
    if (user) {
      fetchUserData();
    }
  }, [user]);

  const fetchUserData = async () => {
    try {
      setLoading(true);
      // Fetch test rides and listings for the user
      const [testRidesResponse, listingsResponse] = await Promise.all([
        axios.get(`http://localhost:5000/api/users/${user?.id}/test-rides`),
        axios.get(`http://localhost:5000/api/users/${user?.id}/listings`)
      ]);
      
      setTestRides(testRidesResponse.data);
      setUserListings(listingsResponse.data);
    } catch (error) {
      console.error('Error fetching user data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelTestRide = async (testRideId: string) => {
    setCancelingId(testRideId);
    const endpoints = [
      { method: 'put',   url: `http://localhost:5000/api/test-rides/${testRideId}/cancel`, body: undefined },
      { method: 'patch', url: `http://localhost:5000/api/test-rides/${testRideId}`,        body: { status: 'cancelled' } },
      { method: 'post',  url: `http://localhost:5000/api/users/${user?.id}/test-rides/${testRideId}/cancel`, body: undefined },
      { method: 'delete',url: `http://localhost:5000/api/test-rides/${testRideId}`,        body: undefined },
      { method: 'delete',url: `http://localhost:5000/api/users/${user?.id}/test-rides/${testRideId}`, body: undefined },
      { method: 'patch', url: `http://localhost:5000/api/users/${user?.id}/test-rides/${testRideId}`, body: { status: 'cancelled' } },
    ] as const;

    let lastError: any = null;
    for (const ep of endpoints) {
      try {
        // @ts-ignore narrowed by method
        await axios[ep.method](ep.url, ep.body);
        setTestRides(prev => prev.map(ride => (
          ride._id === testRideId ? { ...ride, status: 'cancelled' } : ride
        )));
        setCancelingId(null);
        return;
      } catch (err: any) {
        lastError = err;
        console.warn('Cancel attempt failed', { endpoint: ep, status: err?.response?.status, data: err?.response?.data });
        if (err?.response?.status === 404) {
          continue; // try next route
        }
        break;
      }
    }

    console.error('Error cancelling test ride:', {
      status: lastError?.response?.status,
      data: lastError?.response?.data,
    });
    alert((lastError?.response?.data?.message ? `${lastError.response.data.message}\n` : '') + 'Failed to cancel test ride. Please confirm the backend cancel endpoint path/method.');
    setCancelingId(null);
  };

  const handleRemoveListing = async (listingId: string) => {
    if (window.confirm('Are you sure you want to remove this listing?')) {
      try {
        await axios.delete(`http://localhost:5000/api/listings/${listingId}`);
        setUserListings(prev => prev.filter(listing => listing._id !== listingId));
        alert('Listing removed successfully!');
      } catch (error) {
        console.error('Error removing listing:', error);
        alert('Failed to remove listing. Please try again.');
      }
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
      maximumFractionDigits: 0,
    }).format(price);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'confirmed': return 'bg-blue-100 text-blue-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      case 'active': return 'bg-green-100 text-green-800';
      case 'sold': return 'bg-blue-100 text-blue-800';
      case 'removed': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-2">Welcome back, {user?.name || 'User'}!</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-blue-100">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Test Rides</p>
                <p className="text-2xl font-semibold text-gray-900">{testRides.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-green-100">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Active Listings</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {userListings.filter(listing => listing.status === 'active').length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-purple-100">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Value</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {formatPrice(userListings.reduce((sum, listing) => sum + listing.price, 0))}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8 px-6">
              <button
                onClick={() => setActiveTab('test-rides')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'test-rides'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Test Rides ({testRides.length})
              </button>
              <button
                onClick={() => setActiveTab('listings')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'listings'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                My Listings ({userListings.length})
              </button>
            </nav>
          </div>

          <div className="p-6">
            {/* Test Rides Tab */}
            {activeTab === 'test-rides' && (
              <div>
                {testRides.length === 0 ? (
                  <div className="text-center py-12">
                    <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <h3 className="mt-2 text-sm font-medium text-gray-900">No test rides</h3>
                    <p className="mt-1 text-sm text-gray-500">Get started by booking a test ride for a vehicle.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {testRides.map((ride) => (
                      <div key={ride._id} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4">
                            <img
                              src={ride.vehicleImage || 'https://via.placeholder.com/80x60?text=No+Image'}
                              alt={ride.vehicleName}
                              className="w-20 h-15 object-cover rounded-lg"
                            />
                            <div>
                              <h3 className="text-lg font-medium text-gray-900">{ride.vehicleName}</h3>
                              <p className="text-sm text-gray-600">Scheduled: {formatDate(ride.scheduledDate)}</p>
                              <p className="text-sm text-gray-600">Location: {ride.location}</p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-4">
                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(ride.status)}`}>
                              {ride.status.charAt(0).toUpperCase() + ride.status.slice(1)}
                            </span>
                            {ride.status === 'pending' || ride.status === 'confirmed' ? (
                              <button
                                onClick={() => handleCancelTestRide(ride._id)}
                                disabled={cancelingId === ride._id}
                                className="text-red-600 hover:text-red-800 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                              >
                                {cancelingId === ride._id ? 'Cancelling...' : 'Cancel'}
                              </button>
                            ) : null}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Listings Tab */}
            {activeTab === 'listings' && (
              <div>
                {userListings.length === 0 ? (
                  <div className="text-center py-12">
                    <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <h3 className="mt-2 text-sm font-medium text-gray-900">No listings</h3>
                    <p className="mt-1 text-sm text-gray-500">Get started by listing your vehicle for sale.</p>
                    <div className="mt-6">
                      <a
                        href="/sell-vehicle"
                        className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                      >
                        List Your Vehicle
                      </a>
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {userListings.map((listing) => (
                      <div key={listing._id} className="border border-gray-200 rounded-lg overflow-hidden">
                        <img
                          src={listing.images[0] || 'https://via.placeholder.com/300x200?text=No+Image'}
                          alt={`${listing.brand} ${listing.model}`}
                          className="w-full h-48 object-cover"
                        />
                        <div className="p-4">
                          <div className="flex items-center justify-between mb-2">
                            <h3 className="text-lg font-medium text-gray-900">
                              {listing.brand} {listing.model}
                            </h3>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(listing.status)}`}>
                              {listing.status.charAt(0).toUpperCase() + listing.status.slice(1)}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600 mb-2">{listing.variant} • {listing.year}</p>
                          <p className="text-lg font-semibold text-blue-600 mb-2">{formatPrice(listing.price)}</p>
                          <p className="text-sm text-gray-600 mb-4">Listed on {formatDate(listing.createdAt)}</p>
                          <div className="flex space-x-2">
                            <button
                              onClick={() => handleRemoveListing(listing._id)}
                              className="flex-1 bg-red-600 text-white px-3 py-2 rounded-md text-sm font-medium hover:bg-red-700"
                            >
                              Remove
                            </button>
                            <button className="flex-1 bg-blue-600 text-white px-3 py-2 rounded-md text-sm font-medium hover:bg-blue-700">
                              Edit
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