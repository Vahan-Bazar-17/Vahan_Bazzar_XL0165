import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

interface Vehicle {
  _id: string;
  brand: string;
  model: string;
  variant: string;
  category: string;
  fuel_type: string;
  pricing?: {
    ex_showroom_inr: number;
    on_road_inr: number;
  };
  images?: {
    thumbnail: string;
  };
  ratings?: {
    user_rating: number;
    reviews_count?: number;
  };
  performance?: {
    top_speed_kmph: number;
    mileage_kmpl: number;
  };
}

const ComparePage: React.FC = () => {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const navigate = useNavigate();

  const fetchVehicles = async (ids: string[]) => {
    if (ids.length < 2) return;
    
    try {
      setLoading(true);
      const response = await axios.post('http://localhost:5000/api/vehicles/compare', {
        ids: ids,
      });
      setVehicles(response.data);
    } catch (error) {
      console.error('Error fetching vehicles for comparison:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Load compare list from localStorage
    const savedCompareList = localStorage.getItem('compareList');
    if (savedCompareList) {
      const compareIds = JSON.parse(savedCompareList);
      setSelectedIds(compareIds);
      if (compareIds.length > 0) {
        fetchVehicles(compareIds);
      }
    }
  }, []);

  useEffect(() => {
    if (selectedIds.length > 0) {
      fetchVehicles(selectedIds);
    }
  }, [selectedIds]);

  const handleRemoveFromCompare = (vehicleId: string) => {
    const newSelectedIds = selectedIds.filter(id => id !== vehicleId);
    setSelectedIds(newSelectedIds);
    localStorage.setItem('compareList', JSON.stringify(newSelectedIds));
    
    // If less than 2 vehicles, redirect to home
    if (newSelectedIds.length < 2) {
      navigate('/home');
    }
  };

  const handleClearAll = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Clear state first
    setVehicles([]);
    setSelectedIds([]);
    
    // Then update localStorage
    localStorage.removeItem('compareList');
    
    // Navigate without causing page reload
    navigate('/home', { replace: true });
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(price);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-white to-orange-50 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Compare Vehicles</h1>
          <p className="text-lg text-gray-600">
            Select 2-4 vehicles to compare their specifications side by side.
          </p>
        </div>

        {selectedIds.length === 0 && (
          <div className="text-center py-20">
            <div className="max-w-md mx-auto">
              <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-sky-100 to-orange-100 rounded-full flex items-center justify-center">
                <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No vehicles selected</h3>
              <p className="text-gray-600 mb-6">
                No vehicles selected for comparison.
              </p>
              <Link to="/home" className="btn-primary">
                Browse Vehicles
              </Link>
            </div>
          </div>
        )}

        {selectedIds.length > 0 && selectedIds.length < 2 && (
          <div className="text-center py-20">
            <div className="max-w-md mx-auto">
              <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-orange-100 to-orange-200 rounded-full flex items-center justify-center">
                <svg className="w-12 h-12 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Need more vehicles</h3>
              <p className="text-gray-600 mb-6">
                Please select at least 2 vehicles to compare.
              </p>
              <Link to="/home" className="btn-primary">
                Browse Vehicles
              </Link>
            </div>
          </div>
        )}

        {loading && (
          <div className="flex justify-center items-center py-20">
            <div className="loading-spinner"></div>
          </div>
        )}

        {vehicles.length > 0 && (
          <div className="mb-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-3xl font-bold text-gray-900">
                Compare {vehicles.length} Vehicle{vehicles.length > 1 ? 's' : ''}
              </h2>
              <button
                onClick={handleClearAll}
                className="btn-outline text-red-600 hover:bg-red-50 hover:border-red-500"
              >
                Clear All
              </button>
            </div>
            
            <div className="overflow-x-auto bg-white rounded-2xl shadow-lg border border-sky-100">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-gradient-to-r from-sky-50 to-orange-50">
                    <th className="p-6 text-left font-bold text-gray-900 text-lg">Specification</th>
                    {vehicles.map((vehicle) => (
                      <th key={vehicle._id} className="p-6 text-center relative bg-white border-l border-sky-100">
                        <button
                          onClick={() => handleRemoveFromCompare(vehicle._id)}
                          className="absolute top-3 right-3 text-red-500 hover:text-red-700 text-xl font-bold w-8 h-8 rounded-full hover:bg-red-50 flex items-center justify-center transition-all duration-200"
                          title="Remove from comparison"
                          aria-label="Remove from comparison"
                        >
                          ×
                        </button>
                        <div className="flex flex-col items-center space-y-3">
                          <div className="w-32 h-20 rounded-xl overflow-hidden shadow-md">
                            <img
                              src={vehicle.images?.thumbnail || 'https://via.placeholder.com/400x300?text=No+Image'}
                              alt={`${vehicle.brand} ${vehicle.model}`}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="text-center">
                            <h3 className="font-bold text-gray-900 text-lg">
                              {vehicle.brand} {vehicle.model}
                            </h3>
                            <p className="text-sm text-gray-600">{vehicle.variant}</p>
                          </div>
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-sky-100">
                    <td className="p-6 font-bold text-gray-900 bg-sky-50">Category</td>
                    {vehicles.map((vehicle) => (
                      <td key={vehicle._id} className="p-6 text-center bg-white border-l border-sky-100">
                        <span className="badge badge-secondary">{vehicle.category}</span>
                      </td>
                    ))}
                  </tr>
                  <tr className="border-b border-sky-100">
                    <td className="p-6 font-bold text-gray-900 bg-sky-50">Fuel Type</td>
                    {vehicles.map((vehicle) => (
                      <td key={vehicle._id} className="p-6 text-center bg-white border-l border-sky-100">
                        <span className="badge badge-primary">{vehicle.fuel_type}</span>
                      </td>
                    ))}
                  </tr>
                  <tr className="border-b border-sky-100">
                    <td className="p-6 font-bold text-gray-900 bg-sky-50">Ex-showroom Price</td>
                    {vehicles.map((vehicle) => (
                      <td key={vehicle._id} className="p-6 text-center bg-white border-l border-sky-100">
                        <div className="price-display text-xl">
                          {vehicle.pricing?.ex_showroom_inr ? formatPrice(vehicle.pricing.ex_showroom_inr) : 'N/A'}
                        </div>
                      </td>
                    ))}
                  </tr>
                  <tr className="border-b border-sky-100">
                    <td className="p-6 font-bold text-gray-900 bg-sky-50">On-road Price</td>
                    {vehicles.map((vehicle) => (
                      <td key={vehicle._id} className="p-6 text-center bg-white border-l border-sky-100">
                        <div className="price-display text-xl">
                          {vehicle.pricing?.on_road_inr ? formatPrice(vehicle.pricing.on_road_inr) : 'N/A'}
                        </div>
                      </td>
                    ))}
                  </tr>
                  <tr className="border-b border-sky-100">
                    <td className="p-6 font-bold text-gray-900 bg-sky-50">Top Speed</td>
                    {vehicles.map((vehicle) => (
                      <td key={vehicle._id} className="p-6 text-center bg-white border-l border-sky-100">
                        <div className="text-lg font-semibold text-gray-900">
                          {vehicle.performance?.top_speed_kmph ? `${vehicle.performance.top_speed_kmph} kmph` : 'N/A'}
                        </div>
                      </td>
                    ))}
                  </tr>
                  <tr className="border-b border-sky-100">
                    <td className="p-6 font-bold text-gray-900 bg-sky-50">Mileage</td>
                    {vehicles.map((vehicle) => (
                      <td key={vehicle._id} className="p-6 text-center bg-white border-l border-sky-100">
                        <div className="text-lg font-semibold text-gray-900">
                          {vehicle.performance?.mileage_kmpl ? `${vehicle.performance.mileage_kmpl} kmpl` : 'N/A'}
                        </div>
                      </td>
                    ))}
                  </tr>
                  <tr className="border-b border-sky-100">
                    <td className="p-6 font-bold text-gray-900 bg-sky-50">Rating</td>
                    {vehicles.map((vehicle) => (
                      <td key={vehicle._id} className="p-6 text-center bg-white border-l border-sky-100">
                        <div className="flex items-center justify-center space-x-2">
                          <span className="rating-star text-2xl">★</span>
                          <span className="text-lg font-bold text-gray-900">
                            {vehicle.ratings?.user_rating?.toFixed(1) || 'N/A'}
                          </span>
                        </div>
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="p-6 font-bold text-gray-900 bg-sky-50">Actions</td>
                    {vehicles.map((vehicle) => (
                      <td key={vehicle._id} className="p-6 text-center bg-white border-l border-sky-100">
                        <Link
                          to={`/vehicle/${vehicle._id}`}
                          className="btn-primary text-sm"
                        >
                          View Details
                        </Link>
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ComparePage;