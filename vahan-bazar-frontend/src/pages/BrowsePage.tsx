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

  // Fetch vehicles from API
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

  // Normalize potentially relative URLs
  const normalizeUrl = (url: string | undefined) => {
    if (!url) return url;
    if (/^https?:\/\//i.test(url)) return url;
    if (/^\/\//.test(url)) return `https:${url}`;
    if (url.startsWith('/')) return `http://localhost:5000${url}`;
    return url;
  };

  // Helper to get image URL safely
  const getVehicleImage = (vehicle: Vehicle) => {
    const anyV: any = vehicle as any;
    const imgsArr = Array.isArray(anyV.images) ? anyV.images : undefined;
    const firstObjImage = Array.isArray(anyV.images) && typeof anyV.images[0] === 'object' ? anyV.images[0]?.url : undefined;
    const candidates: Array<string | undefined> = [
      vehicle.images?.thumbnail,
      vehicle.images?.gallery?.[0],
      (vehicle as any).thumbnail,
      (vehicle as any).image,
      (vehicle as any).imageUrl,
      (vehicle as any).image_url,
      (vehicle as any).primaryImage,
      (vehicle as any).mainImage,
      imgsArr?.[0],
      firstObjImage,
      (vehicle as any).images?.thumbnail?.url,
      (vehicle as any).images?.gallery?.[0]?.url,
    ];
    const raw = candidates.find((u) => typeof u === 'string' && u.length > 0);
    const url = normalizeUrl(raw);
    return url || 'https://via.placeholder.com/400x300?text=No+Image';
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
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">Browse Vehicles</h1>
              <p className="text-lg text-gray-600">Discover your perfect ride from our curated collection</p>
            </div>
            <button onClick={() => setSidebarOpen(true)} className="btn-secondary flex items-center space-x-2">
              <span>Filters</span>
              {activeFiltersCount > 0 && <span className="badge badge-primary">{activeFiltersCount}</span>}
            </button>
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
                        (e.currentTarget as HTMLImageElement).src = 'https://via.placeholder.com/400x300?text=No+Image';
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
                      <span className="text-sm text-gray-600">{vehicle.ratings?.user_rating?.toFixed(1) || 'N/A'} ★</span>
                    </div>
                    <div className="mb-6">
                      <div className="price-display mb-1">{vehicle.pricing?.ex_showroom_inr ? formatPrice(vehicle.pricing.ex_showroom_inr) : 'Price N/A'}</div>
                      <p className="text-sm text-gray-500">Ex-showroom price</p>
                    </div>
                    <Link to={`/vehicle/${vehicle._id}`} className="flex-1 btn-primary text-center">View Details</Link>
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
