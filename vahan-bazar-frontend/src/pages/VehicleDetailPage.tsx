import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';

interface Vehicle {
  _id: string;
  brand: string;
  model: string;
  variant: string;
  category: string;
  fuel_type: string;
  year: number;
  pricing?: {
    ex_showroom_inr: number;
    on_road_inr: number;
  };
  images?: {
    thumbnail?: string;
    gallery?: string[];
  };
  ratings?: {
    user_rating?: number;
    expert_rating?: number;
    reviews_count?: number;
  };
  engine?: {
    capacity_cc: number;
    max_power_bhp: number;
    max_torque_nm: number;
  };
  battery?: {
    capacity_kwh: number;
    range_km: number;
    charging_time_hours: number;
  };
  performance?: {
    top_speed_kmph?: number;
    mileage_kmpl?: number;
  };
  features?: {
    safety?: string[];
    comfort?: string[];
    technology?: string[];
  };
  availability?: {
    in_stock?: boolean;
    delivery_time_days?: number;
  };
}

// Placeholders must be declared at the top level, not inside the interface
const PLACEHOLDER_MAIN =
  'data:image/svg+xml;utf8,' +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="450">
      <rect width="100%" height="100%" fill="#e5e7eb"/>
      <text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="#6b7280" font-family="Arial" font-size="24">Image unavailable</text>
    </svg>`
  );
const PLACEHOLDER_THUMB =
  'data:image/svg+xml;utf8,' +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="200" height="150">
      <rect width="100%" height="100%" fill="#e5e7eb"/>
      <text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="#6b7280" font-family="Arial" font-size="14">No image</text>
    </svg>`
  );

const VehicleDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [vehicle, setVehicle] = useState<Vehicle | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [compareList, setCompareList] = useState<string[]>([]);
  const [showCompareModal, setShowCompareModal] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();

  const normalizeVehicle = (raw: any): Vehicle => {
    const v = raw || {};

    // Images
    const imgThumb = v?.images?.thumbnail || v?.thumbnail || v?.image || v?.imageUrl || v?.image_url;
    const imgGalleryRaw = v?.images?.gallery || v?.gallery || (Array.isArray(v?.images) ? v.images : []);
    const imgGallery: string[] = Array.isArray(imgGalleryRaw)
      ? imgGalleryRaw.map((it: any) => (typeof it === 'string' ? it : it?.url)).filter(Boolean)
      : [];

    // Pricing (merge known aliases even if v.pricing exists)
    const pricingObj = v?.pricing || {};
    const pricing = {
      ex_showroom_inr: pricingObj.ex_showroom_inr ?? pricingObj.exShowroom ?? pricingObj.exShowroomInr ?? v?.ex_showroom_inr ?? v?.exShowroom ?? v?.price ?? 0,
      on_road_inr: pricingObj.on_road_inr ?? pricingObj.onRoad ?? pricingObj.onRoadInr ?? v?.on_road_inr ?? v?.onRoad ?? v?.onroadPrice ?? 0,
    };

    // Ratings
    const ratings = v?.ratings || {
      user_rating: v?.user_rating || v?.rating || v?.avg_rating || 0,
      expert_rating: v?.expert_rating || 0,
      reviews_count: v?.reviews_count || v?.reviews || 0,
    };

    // Engine
    const engine = v?.engine
      ? {
          capacity_cc: v.engine.capacity_cc ?? v.engine.capacity ?? v.engine.cc ?? 0,
          max_power_bhp: v.engine.max_power_bhp ?? v.engine.power_bhp ?? v.engine.power ?? 0,
          max_torque_nm: v.engine.max_torque_nm ?? v.engine.torque_nm ?? v.engine.torque ?? 0,
        }
      : undefined;

    // Battery
    const battery = v?.battery
      ? {
          capacity_kwh: v.battery.capacity_kwh ?? v.battery.capacity ?? 0,
          range_km: v.battery.range_km ?? v.battery.range ?? 0,
          charging_time_hours: v.battery.charging_time_hours ?? v.battery.charging_time ?? 0,
        }
      : undefined;

    // Performance
    const performance = v?.performance
      ? {
          top_speed_kmph: v.performance.top_speed_kmph ?? v.performance.top_speed ?? v.performance.topSpeed ?? 0,
          mileage_kmpl: v.performance.mileage_kmpl ?? v.performance.mileage ?? v.performance.kmpl ?? 0,
        }
      : undefined;

    // Features
    const ensureArray = (x: any): string[] => {
      if (Array.isArray(x)) return x.map((s) => String(s)).filter(Boolean);
      if (typeof x === 'string') {
        // split comma-separated strings
        return x
          .split(',')
          .map((s) => s.trim())
          .filter((s) => s.length > 0);
      }
      return x ? [String(x)] : [];
    };
    const features = v?.features
      ? {
          safety: ensureArray(v.features.safety),
          technology: ensureArray(v.features.technology),
        }
      : undefined;

    // Availability
    const availability = v?.availability
      ? {
          in_stock: Boolean(v.availability.in_stock),
          delivery_time_days: v.availability.delivery_time_days ?? v.availability.delivery ?? 0,
        }
      : undefined;

    const vehicle: Vehicle = {
      _id: v._id,
      brand: v.brand,
      model: v.model,
      variant: v.variant,
      category: v.category,
      fuel_type: v.fuel_type,
      year: v.year,
      pricing,
      images: { thumbnail: imgThumb, gallery: imgGallery },
      ratings,
      engine,
      battery,
      performance,
      features,
      availability,
    };

    return vehicle;
  };

  const fetchVehicle = useCallback(async () => {
    try {
      setLoading(true);
      const response = await axios.get(`http://localhost:5000/api/vehicles/${id}`);
      const normalized = normalizeVehicle(response.data);
      setVehicle(normalized);
    } catch (error) {
      console.error('Error fetching vehicle:', error);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchVehicle();
    // Load compare list from localStorage
    const savedCompareList = localStorage.getItem('compareList');
    if (savedCompareList) {
      setCompareList(JSON.parse(savedCompareList));
    }
  }, [fetchVehicle]);


  const getVehicleImage = (v: Vehicle) => {
    const anyV: any = v as any;
    const imgs = Array.isArray(anyV.images) ? anyV.images : undefined;
    const candidates: Array<string | undefined> = [
      v.images?.thumbnail,
      v.images?.gallery?.[0],
      anyV.thumbnail,
      anyV.image,
      anyV.imageUrl,
      anyV.image_url,
      anyV.primaryImage,
      anyV.mainImage,
      imgs?.[0],
    ];
    const url = candidates.find((u) => typeof u === 'string' && u.length > 0);
    return url ? normalizeUrl(url) : 'https://via.placeholder.com/800x450?text=No+Image';
  };

  const normalizeUrl = (url: unknown): string => {
    if (typeof url !== 'string' || url.length === 0) return '';
    const s = url.trim();
    // Allow data URLs as-is
    if (s.startsWith('data:')) return s;
    // If already absolute
    if (/^https?:\/\//i.test(s)) return s;
    // If it's a protocol-relative URL
    if (/^\/\//.test(s)) return `https:${s}`;
    // If it's a relative path on backend
    if (s.startsWith('/')) return `http://localhost:5000${s}`;
    // Otherwise return as-is
    return s;
  };

  const isValidImageSrc = (src: unknown): src is string => {
    if (typeof src !== 'string' || src.length === 0) return false;
    return src.startsWith('http') || src.startsWith('/') || src.startsWith('data:');
  };

  const handleBookTestRide = async () => {
    if (!user) {
      alert('Please login to book a test ride.');
      navigate('/login');
      return;
    }
    if (!vehicle) return;

    const payload = {
      userId: user.id,
      vehicleId: vehicle._id,
      vehicleName: `${vehicle.brand} ${vehicle.model}`.trim(),
      vehicleImage: getVehicleImage(vehicle),
      scheduledDate: new Date().toISOString(),
      status: 'pending',
      location: 'Showroom',
    };

    const endpoints = [
      `http://localhost:5000/api/users/${user.id}/test-rides`,
      'http://localhost:5000/api/test-rides',
      'http://localhost:5000/api/bookings',
    ];

    let lastError: any = null;
    for (const url of endpoints) {
      try {
        await axios.post(url, payload);
        alert('Test ride booked! You can view it in your dashboard.');
        navigate('/dashboard');
        return;
      } catch (err: any) {
        lastError = err;
        if (err?.response?.status === 404) {
          // Try next endpoint
          continue;
        }
        // For non-404 errors, stop early
        break;
      }
    }

    console.error('Error booking test ride:', {
      tried: endpoints,
      status: lastError?.response?.status,
      data: lastError?.response?.data,
    });
    alert(
      lastError?.response?.data?.message ||
      (lastError?.response?.status ? `Failed to book test ride. Server responded with ${lastError.response.status}.` : 'Failed to book test ride. Please try again.')
    );
  };


  const handleAddToCompare = (vehicleId: string) => {
    if (compareList.includes(vehicleId)) {
      // Remove from compare list
      const newCompareList = compareList.filter(id => id !== vehicleId);
      setCompareList(newCompareList);
      localStorage.setItem('compareList', JSON.stringify(newCompareList));
    } else {
      // Add to compare list
      if (compareList.length >= 4) {
        setShowCompareModal(true);
        return;
      }
      const newCompareList = [...compareList, vehicleId];
      setCompareList(newCompareList);
      localStorage.setItem('compareList', JSON.stringify(newCompareList));
    }
  };

  const handleCompareNow = () => {
    if (compareList.length >= 2) {
      navigate('/compare');
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(price);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!vehicle) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Vehicle not found</h2>
        <Link to="/home" className="btn-primary">Back to Browse</Link>
      </div>
    );
  }

  // Safe fallbacks for potentially missing fields
  const rawGallerySchema = vehicle.images?.gallery ?? [];
  const rawImages = (vehicle as any).images;
  const rawGalleryArray = Array.isArray(rawImages) ? rawImages : [];
  // Normalize gallery entries to URL strings (support objects with .url)
  const gallery: string[] = (rawGallerySchema.length ? rawGallerySchema : rawGalleryArray)
    .map((item: any) => (
      typeof item === 'string' ? item : (item && typeof item.url === 'string' ? item.url : '')
    ))
    .filter((s: string) => s && isValidImageSrc(s))
    .map((s: string) => normalizeUrl(s));

  const thumbnailRaw = vehicle.images?.thumbnail ?? getVehicleImage(vehicle);
  const thumbnail = isValidImageSrc(thumbnailRaw) ? normalizeUrl(thumbnailRaw) : '';
  const selectedRaw = gallery[selectedImage];
  const mainCandidate = isValidImageSrc(selectedRaw) ? selectedRaw : thumbnail;
  const mainImage = isValidImageSrc(mainCandidate) ? mainCandidate : normalizeUrl(getVehicleImage(vehicle));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Images */}
        <div>
          <div className="aspect-w-16 aspect-h-9 mb-4 bg-gray-100">
            <img
              src={mainImage}
              alt={`${vehicle.brand || ''} ${vehicle.model || ''}`}
              className="w-full h-96 object-cover rounded-lg"
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).src = PLACEHOLDER_MAIN;
              }}
              onLoad={(e) => {
                const img = e.currentTarget as HTMLImageElement;
                // Log final URL and size for diagnostics
                console.debug('Main image loaded:', { src: img.currentSrc || img.src, w: img.naturalWidth, h: img.naturalHeight });
              }}
            />
          </div>
          
          {gallery.length > 1 && (
            <div className="grid grid-cols-4 gap-2">
              {gallery.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`aspect-w-1 aspect-h-1 rounded-lg overflow-hidden ${
                    selectedImage === index ? 'ring-2 ring-primary-500' : ''
                  }`}
                >
                  <img
                    src={normalizeUrl(image)}
                    alt={`${vehicle.brand || ''} ${vehicle.model || ''} ${index + 1}`}
                    className="w-full h-20 object-cover"
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).src = PLACEHOLDER_THUMB;
                    }}
                    onLoad={(e) => {
                      const img = e.currentTarget as HTMLImageElement;
                      console.debug('Thumb image loaded:', { src: img.currentSrc || img.src, w: img.naturalWidth, h: img.naturalHeight });
                    }}
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Details */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {vehicle.brand} {vehicle.model}
          </h1>
          <p className="text-xl text-gray-600 mb-4">{vehicle.variant}</p>
          
          <div className="flex items-center mb-4">
            <div className="flex items-center">
              <span className="text-yellow-400 text-xl">★</span>
              <span className="ml-1 text-lg font-semibold">
                {vehicle.ratings?.user_rating?.toFixed(1) || 'N/A'}
              </span>
              <span className="ml-2 text-gray-500">
                ({vehicle.ratings?.reviews_count || 0} reviews)
              </span>
            </div>
          </div>

          <div className="bg-gray-50 p-6 rounded-lg mb-6">
            <h3 className="text-xl font-semibold mb-4">Pricing</h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Ex-showroom Price:</span>
                <span className="font-semibold">
                  {vehicle.pricing?.ex_showroom_inr !== undefined && vehicle.pricing?.ex_showroom_inr !== null
                    ? formatPrice(vehicle.pricing.ex_showroom_inr)
                    : 'N/A'
                  }
                </span>
              </div>
              <div className="flex justify-between">
                <span>On-road Price:</span>
                <span className="font-semibold text-primary-600">
                  {vehicle.pricing?.on_road_inr !== undefined && vehicle.pricing?.on_road_inr !== null
                    ? formatPrice(vehicle.pricing.on_road_inr)
                    : 'N/A'
                  }
                </span>
              </div>
            </div>
          </div>

          <div className="space-y-4 mb-6">
            <button className="w-full btn-primary" onClick={handleBookTestRide}>
              Book Test Ride
            </button>
            <button
              onClick={() => handleAddToCompare(vehicle._id)}
              className={`w-full btn-secondary ${
                compareList.includes(vehicle._id)
                  ? 'bg-green-500 text-white hover:bg-green-600'
                  : ''
              }`}
            >
              {compareList.includes(vehicle._id) ? 'Remove from Compare' : 'Add to Compare'}
            </button>
          </div>
          <div className="text-sm text-gray-600">
            <p className="mb-2">
              <span className="font-semibold">Availability:</span>{' '}
              {vehicle.availability?.in_stock ? 'In Stock' : 'Out of Stock'}
            </p>
            {vehicle.availability?.in_stock && (
              <p>
                <span className="font-semibold">Delivery:</span>{' '}
                {vehicle.availability?.delivery_time_days ?? 'N/A'} days
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Specifications */}
      <div className="mt-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Specifications</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="card">
            <h3 className="text-lg font-semibold mb-4">Basic Info</h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Category:</span>
                <span className="font-medium">{vehicle.category}</span>
              </div>
              <div className="flex justify-between">
                <span>Fuel Type:</span>
                <span className="font-medium">{vehicle.fuel_type}</span>
              </div>
              <div className="flex justify-between">
                <span>Year:</span>
                <span className="font-medium">{vehicle.year}</span>
              </div>
            </div>
          </div>

          {vehicle.engine && (
            <div className="card">
              <h3 className="text-lg font-semibold mb-4">Engine</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Capacity:</span>
                  <span className="font-medium">{vehicle.engine.capacity_cc}cc</span>
                </div>
                <div className="flex justify-between">
                  <span>Power:</span>
                  <span className="font-medium">{vehicle.engine.max_power_bhp} bhp</span>
                </div>
                <div className="flex justify-between">
                  <span>Torque:</span>
                  <span className="font-medium">{vehicle.engine.max_torque_nm} Nm</span>
                </div>
              </div>
            </div>
          )}

          {vehicle.battery && (
            <div className="card">
              <h3 className="text-lg font-semibold mb-4">Battery</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Capacity:</span>
                  <span className="font-medium">{vehicle.battery.capacity_kwh} kWh</span>
                </div>
                <div className="flex justify-between">
                  <span>Range:</span>
                  <span className="font-medium">{vehicle.battery.range_km} km</span>
                </div>
                <div className="flex justify-between">
                  <span>Charging Time:</span>
                  <span className="font-medium">{vehicle.battery.charging_time_hours} hrs</span>
                </div>
              </div>
            </div>
          )}

          <div className="card">
            <h3 className="text-lg font-semibold mb-4">Performance</h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Top Speed:</span>
                <span className="font-medium">{vehicle.performance?.top_speed_kmph ?? 'N/A'} kmph</span>
              </div>
              <div className="flex justify-between">
                <span>Mileage:</span>
                <span className="font-medium">{vehicle.performance?.mileage_kmpl ?? 'N/A'} kmpl</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features */}
      <div className="mt-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Features</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="card">
            <h3 className="text-lg font-semibold mb-4">Safety</h3>
            <ul className="space-y-2">
              {(vehicle.features?.safety ?? []).map((feature: string, index: number) => (
                <li key={index} className="flex items-center">
                  <span className="text-green-500 mr-2">✓</span>
                  {feature}
                </li>
              ))}
            </ul>
          </div>

          <div className="card">
            <h3 className="text-lg font-semibold mb-4">Comfort</h3>
            <ul className="space-y-2">
              {(vehicle.features?.comfort ?? []).map((feature: string, index: number) => (
                <li key={index} className="flex items-center">
                  <span className="text-green-500 mr-2">✓</span>
                  {feature}
                </li>
              ))}
            </ul>
          </div>

          <div className="card">
            <h3 className="text-lg font-semibold mb-4">Technology</h3>
            <ul className="space-y-2">
              {(vehicle.features?.technology ?? []).map((feature: string, index: number) => (
                <li key={index} className="flex items-center">
                  <span className="text-green-500 mr-2">✓</span>
                  {feature}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Compare Button */}
      {compareList.length > 0 && (
        <div className="fixed bottom-6 right-6 z-50">
          <div className="bg-white rounded-lg shadow-lg p-4 border-2 border-primary-500">
            <div className="flex items-center space-x-4">
              <div>
                <p className="text-sm font-medium text-gray-900">
                  {compareList.length} vehicle{compareList.length > 1 ? 's' : ''} selected
                </p>
                <p className="text-xs text-gray-500">Max 4 vehicles</p>
              </div>
              <button
                onClick={handleCompareNow}
                disabled={compareList.length < 2}
                className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Compare Now
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Compare Modal */}
      {showCompareModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold mb-4">Maximum 4 vehicles can be compared</h3>
            <p className="text-gray-600 mb-4">
              Please remove a vehicle from your comparison list to add a new one.
            </p>
            <div className="flex space-x-3">
              <button
                onClick={() => setShowCompareModal(false)}
                className="flex-1 btn-secondary"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setShowCompareModal(false);
                  navigate('/compare');
                }}
                className="flex-1 btn-primary"
              >
                Go to Compare
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VehicleDetailPage;
