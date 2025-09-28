// BrowsePage fetches vehicles from MongoDB backend with server-side filtering and search
import React, { useState, useEffect, useCallback } from 'react';
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
    thumbnail?: string;
    gallery?: string[];
  };
  ratings?: {
    user_rating: number;
    reviews_count?: number;
  };
}

const BrowsePage: React.FC = () => {
  const API_BASE = (import.meta as any)?.env?.VITE_API_BASE_URL || 'http://localhost:5000';
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [compareList, setCompareList] = useState<string[]>([]);
  const [showCompareModal, setShowCompareModal] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const [filters, setFilters] = useState({
    category: '',
    brand: '',
    fuel_type: '',
    min_price: '',
    max_price: '',
    search: '',
  });

  // Fetch vehicles from MongoDB backend with server-side filtering
  const fetchVehicles = useCallback(async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value) params.append(key, value);
      });
      
      const response = await axios.get(`http://localhost:5000/api/vehicles?${params}`);
      // Guard against null/undefined entries coming from the API
      const cleaned = (Array.isArray(response.data) ? response.data : [])
        .filter((v) => !!v && typeof v === 'object');
      setVehicles(cleaned as Vehicle[]);
    } catch (error) {
      console.error('Error fetching vehicles:', error);
      setVehicles([]);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchVehicles();

    // Load compare list from localStorage
    const savedCompareList = localStorage.getItem('compareList');
    if (savedCompareList) setCompareList(JSON.parse(savedCompareList));
  }, [fetchVehicles]);

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const handleAddToCompare = (vehicleId: string) => {
    let newCompareList: string[];
    if (compareList.includes(vehicleId)) {
      newCompareList = compareList.filter(id => id !== vehicleId);
    } else {
      if (compareList.length >= 4) {
        setShowCompareModal(true);
        return;
      }
      newCompareList = [...compareList, vehicleId];
    }
    setCompareList(newCompareList);
    localStorage.setItem('compareList', JSON.stringify(newCompareList));
  };

  const handleCompareNow = () => {
    if (compareList.length >= 2) navigate('/compare');
  };

  const clearFilters = () => {
    setFilters({ category: '', brand: '', fuel_type: '', min_price: '', max_price: '', search: '' });
  };

  const formatPrice = (price: number) =>
    new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(price);

  const activeFiltersCount = Object.values(filters).filter(value => value !== '').length;

  // Curated sample bike images for fallback
  const SAMPLE_BIKE_IMAGES: string[] = [
    'https://images.unsplash.com/photo-1502877338535-766e1452684a?q=80&w=1200&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1493238792000-8113da705763?q=80&w=1200&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1517602302552-471fe67acf66?q=80&w=1200&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1504215680853-026ed2a45def?q=80&w=1200&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1465447142348-e9952c393450?q=80&w=1200&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1517777596321-5aa7cdb9c2f0?q=80&w=1200&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1495539406979-bf61750d38ad?q=80&w=1200&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1531816458010-fb7685eec5e1?q=80&w=1200&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1485960994840-902a67e187c8?q=80&w=1200&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1485965120184-e220f721d03e?q=80&w=1200&auto=format&fit=crop'
  ];

  const pickSampleImage = (id: string) => {
    const code = Array.from(id || 'x').reduce((acc, ch) => acc + ch.charCodeAt(0), 0);
    return SAMPLE_BIKE_IMAGES[code % SAMPLE_BIKE_IMAGES.length];
  };

  // Always use frontend-managed images; ignore backend image fields
  const getVehicleImage = (vehicle: Vehicle) => {
    return pickSampleImage(vehicle._id);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-white to-orange-50 pb-20">
      {/* Sidebar Overlay */}
      {sidebarOpen && <div className="sidebar-overlay" onClick={() => setSidebarOpen(false)} aria-hidden="true" />}

      {/* Sidebar */}
      <div className={`sidebar ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Filters</h2>
            <button onClick={() => setSidebarOpen(false)} className="text-gray-500 hover:text-gray-700 text-2xl">×</button>
          </div>

          <div className="space-y-6">
            {/* Search */}
            <div>
              <label htmlFor="search" className="block text-sm font-semibold text-gray-700 mb-2">Search Vehicles</label>
              <input
                id="search"
                type="text"
                name="search"
                value={filters.search}
                onChange={handleFilterChange}
                placeholder="Search by brand, model, variant, fuel, mileage, features..."
                className="input-field"
              />
            </div>

            {/* Category */}
            <div>
              <label htmlFor="category" className="block text-sm font-semibold text-gray-700 mb-2">Category</label>
              <select id="category" name="category" value={filters.category} onChange={handleFilterChange} className="input-field">
                <option value="">All Categories</option>
                <option value="Bike">Bike</option>
                <option value="Scooter">Scooter</option>
                <option value="EV">Electric Vehicle</option>
              </select>
            </div>

            {/* Brand */}
            <div>
              <label htmlFor="brand" className="block text-sm font-semibold text-gray-700 mb-2">Brand</label>
              <select id="brand" name="brand" value={filters.brand} onChange={handleFilterChange} className="input-field">
                <option value="">All Brands</option>
                <option value="Honda">Honda</option>
                <option value="Yamaha">Yamaha</option>
                <option value="TVS">TVS</option>
                <option value="Ola">Ola</option>
                <option value="Royal Enfield">Royal Enfield</option>
              </select>
            </div>

            {/* Fuel Type */}
            <div>
              <label htmlFor="fuel_type" className="block text-sm font-semibold text-gray-700 mb-2">Fuel Type</label>
              <select id="fuel_type" name="fuel_type" value={filters.fuel_type} onChange={handleFilterChange} className="input-field">
                <option value="">All Fuel Types</option>
                <option value="Petrol">Petrol</option>
                <option value="Electric">Electric</option>
                <option value="Diesel">Diesel</option>
              </select>
            </div>

            {/* Price Range */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="min_price" className="block text-sm font-semibold text-gray-700 mb-2">Min Price</label>
                <input id="min_price" type="number" name="min_price" value={filters.min_price} onChange={handleFilterChange} placeholder="Min price" className="input-field" />
              </div>
              <div>
                <label htmlFor="max_price" className="block text-sm font-semibold text-gray-700 mb-2">Max Price</label>
                <input id="max_price" type="number" name="max_price" value={filters.max_price} onChange={handleFilterChange} placeholder="Max price" className="input-field" />
              </div>
            </div>

            <button onClick={clearFilters} className="w-full btn-outline mt-4">Clear All Filters</button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className={`transition-all duration-300 ${sidebarOpen ? 'ml-80' : 'ml-0'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between mb-2">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">Browse Vehicles</h1>
              <p className="text-lg text-gray-600">Discover your perfect ride from our curated collection</p>
            </div>
            <button onClick={() => setSidebarOpen(true)} className="btn-secondary flex items-center space-x-2">
              <span>Filters</span>
              {activeFiltersCount > 0 && <span className="badge badge-primary">{activeFiltersCount}</span>}
            </button>
          </div>

          

          {/* Ownership Cost CTA */}
          <div className="mb-6">
            <div className="bg-white border border-blue-100 rounded-2xl p-4 shadow-soft flex flex-col md:flex-row md:items-center md:justify-between">
              <div className="mb-3 md:mb-0">
                <h3 className="text-lg font-semibold text-gray-900">Estimate Your Ownership Cost</h3>
                <p className="text-gray-600 text-sm">Use our EMI + Fuel & Maintenance calculator (2 years) to plan better.</p>
              </div>
              <Link to="/emi-calculator" className="btn-primary w-full md:w-auto text-center">Open Calculator</Link>
            </div>
          </div>

          {/* Main Search Bar */}
          <div className="mb-8">
            <div className="relative max-w-2xl mx-auto">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input
                type="text"
                name="search"
                value={filters.search}
                onChange={handleFilterChange}
                placeholder="Search by brand, model, variant, fuel, mileage, features..."
                className="w-full pl-10 pr-4 py-4 text-lg border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm"
              />
              {filters.search && (
                <button
                  onClick={() => setFilters({ ...filters, search: '' })}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                >
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>
            {filters.search && (
              <div className="text-center mt-2">
                <span className="text-sm text-gray-600">
                  Showing results for "{filters.search}"
                </span>
              </div>
            )}
          </div>

          {loading ? (
            <div className="flex justify-center items-center py-20">
              <div className="loading-spinner"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {vehicles.map(vehicle => (
                <div key={vehicle._id} className="vehicle-card card-hover">
                  <div className="relative overflow-hidden">
                    <img
                      src={getVehicleImage(vehicle)}
                      alt={`${vehicle.brand} ${vehicle.model}`}
                      className="vehicle-card-image"
                      loading="lazy"
                      onError={(e) => {
                        const target = e.currentTarget as HTMLImageElement;
                        if (target.src !== 'https://via.placeholder.com/600x400?text=No+Image') {
                          target.src = 'https://via.placeholder.com/600x400?text=No+Image';
                        }
                      }}
                    />
                    <div className="absolute top-4 right-4">
                      <button
                        onClick={() => handleAddToCompare(vehicle._id)}
                        className={`compare-btn ${compareList.includes(vehicle._id) ? 'active' : ''}`}
                      >
                        {compareList.includes(vehicle._id) ? '✓ Added' : 'Compare'}
                      </button>
                    </div>
                    <div className="absolute top-4 left-4">
                      <span className="badge badge-secondary">{vehicle.category}</span>
                    </div>
                  </div>

                  <div className="p-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-1">{vehicle.brand} {vehicle.model}</h3>
                    <p className="text-gray-600 mb-2">{vehicle.variant}</p>
                    <div className="flex items-center space-x-2 mb-4">
                      <span className="badge badge-primary">{vehicle.fuel_type}</span>
                      <span className="text-sm text-gray-600">{vehicle.ratings?.average?.toFixed(1) || 'N/A'} ★</span>
                    </div>
                    <div className="mb-6">
                      <div className="price-display mb-1">{vehicle.pricing?.ex_showroom ? formatPrice(vehicle.pricing.ex_showroom) : 'Price N/A'}</div>
                      <p className="text-sm text-gray-500">Ex-showroom price</p>
                    </div>
                    <button onClick={() => navigate(`/vehicle/${vehicle._id}`)} className="flex-1 btn-primary text-center">View Details</button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {!loading && vehicles.length === 0 && (
            <div className="text-center py-20">
              <p className="text-xl text-gray-600">No vehicles found. Try adjusting your filters.</p>
            </div>
          )}
        </div>
      </div>

      {/* Compare Button */}
      {compareList.length > 0 && (
        <div className="fixed bottom-6 right-6 z-50">
          <div className="bg-white rounded-2xl shadow-2xl p-6 border-2 border-orange-200 max-w-sm">
            <div className="flex items-center space-x-4">
              <div className="flex-1">
                <p className="text-sm font-semibold text-gray-900 mb-1">{compareList.length} vehicle{compareList.length > 1 ? 's' : ''} selected</p>
              </div>
              <button onClick={handleCompareNow} disabled={compareList.length < 2} className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed">Compare Now</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BrowsePage;
