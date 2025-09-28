import React, { useEffect, useState } from 'react';
import { mockVehicles } from './data/mockVehicles';

// Simple Compare Page using local mock dataset and IDs from localStorage
const ComparePage: React.FC = () => {
  const [ids, setIds] = useState<string[]>([]);
  const [items, setItems] = useState<any[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem('compareList');
    const list = saved ? JSON.parse(saved) : [];
    setIds(list);
    const records = mockVehicles.filter(v => list.includes(v._id));
    setItems(records);
  }, []);

  if (items.length < 2) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-blue-50 py-12">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Compare Vehicles</h1>
          <p className="text-gray-600">Please add at least 2 vehicles to compare from the Browse page.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-blue-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Compare Vehicles</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((v) => (
            <div key={v._id} className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
              <div className="mb-4">
                <img src={v.images?.thumbnail || v.images?.gallery?.[0] || 'https://via.placeholder.com/400x300?text=No+Image'} alt={`${v.brand} ${v.model}`} className="w-full h-40 object-cover rounded-lg" />
              </div>
              <h2 className="text-xl font-bold text-gray-900">{v.brand} {v.model}</h2>
              <p className="text-gray-600">{v.variant} • {v.fuel_type}</p>
              <div className="mt-4 grid grid-cols-2 gap-3 text-sm text-gray-700">
                <div>
                  <div className="font-semibold">Category</div>
                  <div>{v.category}</div>
                </div>
                <div>
                  <div className="font-semibold">Mileage</div>
                  <div>{v.performance?.mileage_kmpl ?? 'N/A'} kmpl</div>
                </div>
                <div>
                  <div className="font-semibold">Top Speed</div>
                  <div>{v.performance?.top_speed_kmph ?? 'N/A'} km/h</div>
                </div>
                <div>
                  <div className="font-semibold">Price</div>
                  <div>{v.pricing?.ex_showroom_inr?.toLocaleString('en-IN') ?? 'N/A'}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ComparePage;
