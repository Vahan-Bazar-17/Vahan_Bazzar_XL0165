import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';

type AnyRecord = Record<string, any>;

const SAMPLE_IMAGES: string[] = [
  'https://images.unsplash.com/photo-1502877338535-766e1452684a?q=80&w=1200&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1495539406979-bf61750d38ad?q=80&w=1200&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1531816458010-fb7685eec5e1?q=80&w=1200&auto=format&fit=crop'
];

const pickImage = (seed: string | undefined) => {
  const base = (seed || 'x').split('').reduce((a, c) => a + c.charCodeAt(0), 0);
  return SAMPLE_IMAGES[base % SAMPLE_IMAGES.length];
};

const VehicleDetailPage: React.FC = () => {
  const { id } = useParams();
  const API_BASE = (import.meta as any)?.env?.VITE_API_BASE_URL || 'http://localhost:5000';
  const [vehicle, setVehicle] = useState<AnyRecord | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await axios.get(`${API_BASE}/api/vehicles/${id}`);
        if (!mounted) return;
        setVehicle(res.data || null);
      } catch (e: any) {
        if (!mounted) return;
        setError(e?.message || 'Failed to load vehicle');
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, [API_BASE, id]);

  const getTitle = () => {
    if (!vehicle) return '';
    return [vehicle.brand, vehicle.model, vehicle.variant].filter(Boolean).join(' ');
  };

  const formatINR = (n?: number) => n == null ? null : new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(Number(n));

  const getPrice = () => {
    const p = vehicle?.pricing || {};
    const ex = p.ex_showroom;
    return formatINR(ex) || 'Price N/A';
  };

  const getPerformance = () => {
    if (!vehicle || !vehicle.performance) {
      return { topSpeed: '—', mileage: '—' };
    }
    const perf = vehicle.performance;
    const top = perf.top_speed;
    const mil = perf.mileage;
    return { topSpeed: top ?? '—', mileage: mil ?? '—' };
  };

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-16">
        <div className="loading-spinner"></div>
      </div>
    );
  }

  if (error || !vehicle) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-16 text-center">
        <p className="text-lg text-gray-700 mb-6">{error || 'Vehicle not found'}</p>
        <Link to="/browse" className="btn-primary">Back to Browse</Link>
      </div>
    );
  }

  const perf = getPerformance();
  const imageUrl = pickImage(vehicle?._id || String(id));

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white rounded-2xl shadow-strong overflow-hidden">
          <img
            src={imageUrl}
            alt={getTitle()}
            className="w-full h-80 object-cover"
            onError={(e) => {
              const t = e.currentTarget as HTMLImageElement;
              if (t.src !== 'https://via.placeholder.com/800x500?text=No+Image') {
                t.src = 'https://via.placeholder.com/800x500?text=No+Image';
              }
            }}
          />
        </div>

        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{getTitle()}</h1>
          <div className="text-xl text-gray-700 mb-6">{getPrice()}</div>

          <div className="grid grid-cols-2 gap-4 mb-8">
            <div className="stats-card">
              <div className="text-sm text-gray-500">Top Speed</div>
              <div className="text-lg font-semibold">{String(perf.topSpeed)}</div>
            </div>
            <div className="stats-card">
              <div className="text-sm text-gray-500">Mileage</div>
              <div className="text-lg font-semibold">{String(perf.mileage)}</div>
            </div>
          </div>

          <div className="space-y-2 text-gray-700">
            <div><span className="font-semibold">Category:</span> {vehicle.category || '—'}</div>
            <div><span className="font-semibold">Fuel Type:</span> {vehicle.fuel_type || '—'}</div>
            <div><span className="font-semibold">Year:</span> {vehicle.year || '—'}</div>
          </div>

          <div className="mt-8 flex gap-3">
            <Link to="/browse" className="btn-secondary">Back</Link>
            <Link to="/compare" className="btn-primary">Compare</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VehicleDetailPage;


