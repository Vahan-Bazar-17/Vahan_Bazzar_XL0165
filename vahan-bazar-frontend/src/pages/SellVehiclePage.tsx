import React, { useState, ChangeEvent, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';

interface VehicleFormData {
  brand: string;
  model: string;
  variant: string;
  year: string;
  category: string;
  fuel_type: string;
  mileage: string;
  condition: string;
  price: string;
  description: string;
  location: string;
  contact: string;
  images: File[];
  // Engine details
  engine_capacity: string;
  max_power: string;
  max_torque: string;
  // Performance
  top_speed: string;
  mileage_kmpl: string;
  // Dimensions
  seat_capacity: string;
  kerb_weight: string;
  fuel_tank_capacity: string;
  // Features
  safety_features: string;
  comfort_features: string;
  technology_features: string;
}

const SellVehiclePage: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<VehicleFormData>({
    brand: '',
    model: '',
    variant: '',
    year: '',
    category: '',
    fuel_type: '',
    mileage: '',
    condition: '',
    price: '',
    description: '',
    location: '',
    contact: '',
    images: [],
    // Engine details
    engine_capacity: '',
    max_power: '',
    max_torque: '',
    // Performance
    top_speed: '',
    mileage_kmpl: '',
    // Dimensions
    seat_capacity: '',
    kerb_weight: '',
    fuel_tank_capacity: '',
    // Features
    safety_features: '',
    comfort_features: '',
    technology_features: ''
  });

  const [loading, setLoading] = useState(false);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFormData(prev => ({
        ...prev,
        images: Array.from(e.target.files as FileList)
      }));
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // Validate required fields
      if (!formData.brand || !formData.model || !formData.category || !formData.fuel_type || !formData.price) {
        throw new Error('Please fill in all required fields: Brand, Model, Category, Fuel Type, and Price');
      }
      
      const formDataToSend = new FormData();
      
      // Add all form fields to FormData
      (Object.keys(formData) as Array<keyof VehicleFormData>).forEach((key) => {
        const value = formData[key];
        if (key !== 'images' && value !== undefined && value !== null && value !== '') {
          if (Array.isArray(value)) {
            // Skip arrays (handled separately for images)
            return;
          }
          formDataToSend.append(key, value);
        }
      });
      
      // Debug: Log the form data being sent
      console.log('Form data being sent:', {
        brand: formData.brand,
        model: formData.model,
        category: formData.category,
        fuel_type: formData.fuel_type,
        price: formData.price
      });
      
      // Append images if any
      formData.images.forEach((file) => {
        formDataToSend.append('images', file);
      });
      
      // Get auth token
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Please log in to list a vehicle');
      }
      
      // Send to backend
      const response = await fetch('http://localhost:5000/api/vehicles/user-listing', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formDataToSend
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to list vehicle');
      }
      
      alert('Your vehicle has been listed successfully!');
      navigate('/dashboard');
    } catch (error: any) {
      console.error('Error listing vehicle:', error);
      alert(`Error: ${error.message || 'Failed to list vehicle. Please try again.'}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-blue-50 pb-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Sell Your <span className="bg-gradient-to-r from-blue-600 to-blue-700 bg-clip-text text-transparent">Vehicle</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            List your vehicle on our marketplace and connect with potential buyers. 
            Get the best value for your vehicle with our trusted platform.
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8">
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Basic Information */}
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Basic Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="brand" className="block text-sm font-semibold text-gray-700 mb-2">
                    Brand *
                  </label>
                  <select
                    id="brand"
                    name="brand"
                    value={formData.brand}
                    onChange={handleInputChange}
                    required
                    className="input-field"
                  >
                    <option value="">Select Brand</option>
                    <option value="Honda">Honda</option>
                    <option value="Yamaha">Yamaha</option>
                    <option value="TVS">TVS</option>
                    <option value="Bajaj">Bajaj</option>
                    <option value="Royal Enfield">Royal Enfield</option>
                    <option value="Hero">Hero</option>
                    <option value="Suzuki">Suzuki</option>
                    <option value="KTM">KTM</option>
                    <option value="Ducati">Ducati</option>
                    <option value="Harley Davidson">Harley Davidson</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="model" className="block text-sm font-semibold text-gray-700 mb-2">
                    Model *
                  </label>
                  <input
                    type="text"
                    id="model"
                    name="model"
                    value={formData.model}
                    onChange={handleInputChange}
                    required
                    placeholder="Enter model name"
                    className="input-field"
                  />
                </div>

                <div>
                  <label htmlFor="variant" className="block text-sm font-semibold text-gray-700 mb-2">
                    Variant
                  </label>
                  <input
                    type="text"
                    id="variant"
                    name="variant"
                    value={formData.variant}
                    onChange={handleInputChange}
                    placeholder="Enter variant (e.g., Standard, Deluxe)"
                    className="input-field"
                  />
                </div>

                <div>
                  <label htmlFor="year" className="block text-sm font-semibold text-gray-700 mb-2">
                    Year of Manufacture *
                  </label>
                  <select
                    id="year"
                    name="year"
                    value={formData.year}
                    onChange={handleInputChange}
                    required
                    className="input-field"
                  >
                    <option value="">Select Year</option>
                    {Array.from({ length: 20 }, (_, i) => 2024 - i).map(year => (
                      <option key={year} value={year}>{year}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="category" className="block text-sm font-semibold text-gray-700 mb-2">
                    Category *
                  </label>
                  <select
                    id="category"
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    required
                    className="input-field"
                  >
                    <option value="">Select Category</option>
                    <option value="Bike">Bike</option>
                    <option value="Scooter">Scooter</option>
                    <option value="Electric Vehicle">Electric Vehicle</option>
                    <option value="Cruiser">Cruiser</option>
                    <option value="Sports Bike">Sports Bike</option>
                    <option value="Adventure">Adventure</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="fuel_type" className="block text-sm font-semibold text-gray-700 mb-2">
                    Fuel Type *
                  </label>
                  <select
                    id="fuel_type"
                    name="fuel_type"
                    value={formData.fuel_type}
                    onChange={handleInputChange}
                    required
                    className="input-field"
                  >
                    <option value="">Select Fuel Type</option>
                    <option value="Petrol">Petrol</option>
                    <option value="Electric">Electric</option>
                    <option value="Diesel">Diesel</option>
                    <option value="Hybrid">Hybrid</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Vehicle Details */}
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Vehicle Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="mileage" className="block text-sm font-semibold text-gray-700 mb-2">
                    Mileage (km) *
                  </label>
                  <input
                    type="number"
                    id="mileage"
                    name="mileage"
                    value={formData.mileage}
                    onChange={handleInputChange}
                    required
                    placeholder="Enter odometer reading"
                    className="input-field"
                  />
                </div>

                <div>
                  <label htmlFor="condition" className="block text-sm font-semibold text-gray-700 mb-2">
                    Condition *
                  </label>
                  <select
                    id="condition"
                    name="condition"
                    value={formData.condition}
                    onChange={handleInputChange}
                    required
                    className="input-field"
                  >
                    <option value="">Select Condition</option>
                    <option value="Excellent">Excellent</option>
                    <option value="Very Good">Very Good</option>
                    <option value="Good">Good</option>
                    <option value="Fair">Fair</option>
                    <option value="Needs Repair">Needs Repair</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="price" className="block text-sm font-semibold text-gray-700 mb-2">
                    Expected Price (₹) *
                  </label>
                  <input
                    type="number"
                    id="price"
                    name="price"
                    value={formData.price}
                    onChange={handleInputChange}
                    required
                    placeholder="Enter expected price"
                    className="input-field"
                  />
                </div>

                <div>
                  <label htmlFor="location" className="block text-sm font-semibold text-gray-700 mb-2">
                    Location *
                  </label>
                  <input
                    type="text"
                    id="location"
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    required
                    placeholder="Enter your city"
                    className="input-field"
                  />
                </div>
              </div>
            </div>

            {/* Engine & Performance Details */}
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Engine & Performance</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="engine_capacity" className="block text-sm font-semibold text-gray-700 mb-2">
                    Engine Capacity (cc)
                  </label>
                  <input
                    type="number"
                    id="engine_capacity"
                    name="engine_capacity"
                    value={formData.engine_capacity}
                    onChange={handleInputChange}
                    placeholder="e.g., 150, 300, 500"
                    className="input-field"
                  />
                </div>

                <div>
                  <label htmlFor="max_power" className="block text-sm font-semibold text-gray-700 mb-2">
                    Max Power (bhp)
                  </label>
                  <input
                    type="number"
                    id="max_power"
                    name="max_power"
                    value={formData.max_power}
                    onChange={handleInputChange}
                    placeholder="e.g., 15, 25, 40"
                    className="input-field"
                  />
                </div>

                <div>
                  <label htmlFor="max_torque" className="block text-sm font-semibold text-gray-700 mb-2">
                    Max Torque (Nm)
                  </label>
                  <input
                    type="number"
                    id="max_torque"
                    name="max_torque"
                    value={formData.max_torque}
                    onChange={handleInputChange}
                    placeholder="e.g., 12, 20, 35"
                    className="input-field"
                  />
                </div>

                <div>
                  <label htmlFor="top_speed" className="block text-sm font-semibold text-gray-700 mb-2">
                    Top Speed (kmph)
                  </label>
                  <input
                    type="number"
                    id="top_speed"
                    name="top_speed"
                    value={formData.top_speed}
                    onChange={handleInputChange}
                    placeholder="e.g., 100, 120, 150"
                    className="input-field"
                  />
                </div>

                <div>
                  <label htmlFor="mileage_kmpl" className="block text-sm font-semibold text-gray-700 mb-2">
                    Mileage (kmpl)
                  </label>
                  <input
                    type="number"
                    id="mileage_kmpl"
                    name="mileage_kmpl"
                    value={formData.mileage_kmpl}
                    onChange={handleInputChange}
                    placeholder="e.g., 40, 50, 60"
                    className="input-field"
                  />
                </div>
              </div>
            </div>

            {/* Dimensions & Weight */}
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Dimensions & Weight</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="seat_capacity" className="block text-sm font-semibold text-gray-700 mb-2">
                    Seat Capacity
                  </label>
                  <input
                    type="number"
                    id="seat_capacity"
                    name="seat_capacity"
                    value={formData.seat_capacity}
                    onChange={handleInputChange}
                    placeholder="e.g., 1, 2"
                    className="input-field"
                  />
                </div>

                <div>
                  <label htmlFor="kerb_weight" className="block text-sm font-semibold text-gray-700 mb-2">
                    Kerb Weight (kg)
                  </label>
                  <input
                    type="number"
                    id="kerb_weight"
                    name="kerb_weight"
                    value={formData.kerb_weight}
                    onChange={handleInputChange}
                    placeholder="e.g., 120, 150, 200"
                    className="input-field"
                  />
                </div>

                <div>
                  <label htmlFor="fuel_tank_capacity" className="block text-sm font-semibold text-gray-700 mb-2">
                    Fuel Tank Capacity (liters)
                  </label>
                  <input
                    type="number"
                    id="fuel_tank_capacity"
                    name="fuel_tank_capacity"
                    value={formData.fuel_tank_capacity}
                    onChange={handleInputChange}
                    placeholder="e.g., 10, 12, 15"
                    className="input-field"
                  />
                </div>
              </div>
            </div>

            {/* Features */}
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Features</h3>
              <div className="grid grid-cols-1 gap-6">
                <div>
                  <label htmlFor="safety_features" className="block text-sm font-semibold text-gray-700 mb-2">
                    Safety Features
                  </label>
                  <textarea
                    id="safety_features"
                    name="safety_features"
                    value={formData.safety_features}
                    onChange={handleInputChange}
                    rows={2}
                    placeholder="e.g., ABS, Disc Brakes, LED Headlights, Digital Instrument Cluster"
                    className="input-field"
                  />
                </div>

                <div>
                  <label htmlFor="comfort_features" className="block text-sm font-semibold text-gray-700 mb-2">
                    Comfort Features
                  </label>
                  <textarea
                    id="comfort_features"
                    name="comfort_features"
                    value={formData.comfort_features}
                    onChange={handleInputChange}
                    rows={2}
                    placeholder="e.g., Comfortable Seating, Storage Space, USB Charging"
                    className="input-field"
                  />
                </div>

                <div>
                  <label htmlFor="technology_features" className="block text-sm font-semibold text-gray-700 mb-2">
                    Technology Features
                  </label>
                  <textarea
                    id="technology_features"
                    name="technology_features"
                    value={formData.technology_features}
                    onChange={handleInputChange}
                    rows={2}
                    placeholder="e.g., Mobile App Connectivity, GPS Navigation, Bluetooth"
                    className="input-field"
                  />
                </div>
              </div>
            </div>

            {/* Contact Information */}
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Contact Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="contact" className="block text-sm font-semibold text-gray-700 mb-2">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    id="contact"
                    name="contact"
                    value={formData.contact}
                    onChange={handleInputChange}
                    required
                    placeholder="Enter your phone number"
                    className="input-field"
                  />
                </div>
              </div>
            </div>

            {/* Description */}
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Description</h3>
              <div>
                <label htmlFor="description" className="block text-sm font-semibold text-gray-700 mb-2">
                  Vehicle Description *
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  required
                  rows={4}
                  placeholder="Describe your vehicle, its features, maintenance history, and any additional information that would help buyers..."
                  className="input-field"
                />
              </div>
            </div>

            {/* Images */}
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Vehicle Images</h3>
              <div>
                <label htmlFor="images" className="block text-sm font-semibold text-gray-700 mb-2">
                  Upload Images (Max 10 images) *
                </label>
                <input
                  type="file"
                  id="images"
                  name="images"
                  onChange={handleImageChange}
                  multiple
                  accept="image/*"
                  required
                  className="input-field"
                />
                <p className="text-sm text-gray-500 mt-2">
                  Upload clear, high-quality images of your vehicle from different angles.
                </p>
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-center pt-8">
              <button
                type="submit"
                disabled={loading}
                className="btn-primary text-lg px-12 py-4 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Listing Vehicle...' : 'List My Vehicle'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SellVehiclePage;
