import React, { useState } from 'react';

// EMI + Fuel & Maintenance Calculator (up to 2 years)
// This page provides:
// 1) Standard EMI calculator
// 2) Fuel cost calculator (based on distance, mileage and fuel price)
// 3) Maintenance estimator (annual maintenance cost with escalation)
// All calculations are client-side and purely informational.

const EMICalculatorPage: React.FC = () => {
  // EMI inputs
  const [principal, setPrincipal] = useState<string>('200000');
  const [rate, setRate] = useState<string>('9'); // annual interest in %
  const [tenure, setTenure] = useState<string>('36'); // months

  // Fuel inputs
  const [monthlyDistanceKm, setMonthlyDistanceKm] = useState<string>('800');
  const [mileageKmpl, setMileageKmpl] = useState<string>('40');
  const [fuelPricePerLitre, setFuelPricePerLitre] = useState<string>('110');

  // Maintenance inputs
  const [annualMaintenanceInr, setAnnualMaintenanceInr] = useState<string>('5000');
  const [maintenanceEscalationPct, setMaintenanceEscalationPct] = useState<string>('5'); // yearly escalation

  // outputs
  const [emi, setEmi] = useState<number | null>(null);
  const [fuelCost2Years, setFuelCost2Years] = useState<number | null>(null);
  const [maintenance2Years, setMaintenance2Years] = useState<number | null>(null);

  const formatInr = (value: number) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(value);

  const calculateEMI = () => {
    const P = Number(principal);
    const annualRate = Number(rate) / 100;
    const R = annualRate / 12; // monthly rate
    const N = Number(tenure);
    if (P <= 0 || R <= 0 || N <= 0) {
      setEmi(null);
      return;
    }
    const numerator = P * R * Math.pow(1 + R, N);
    const denominator = Math.pow(1 + R, N) - 1;
    setEmi(Math.round(numerator / denominator));
  };

  const calculateFuelCost = () => {
    const dist = Number(monthlyDistanceKm);
    const mileage = Number(mileageKmpl);
    const price = Number(fuelPricePerLitre);
    if (dist <= 0 || mileage <= 0 || price <= 0) {
      setFuelCost2Years(null);
      return;
    }
    // 24 months
    const monthlyLitres = dist / mileage;
    const monthlyCost = monthlyLitres * price;
    setFuelCost2Years(Math.round(monthlyCost * 24));
  };

  const calculateMaintenance = () => {
    const base = Number(annualMaintenanceInr);
    const esc = Number(maintenanceEscalationPct) / 100;
    if (base <= 0) {
      setMaintenance2Years(null);
      return;
    }
    const year1 = base;
    const year2 = Math.round(base * (1 + esc));
    setMaintenance2Years(year1 + year2);
  };

  const handleCalculateAll = () => {
    calculateEMI();
    calculateFuelCost();
    calculateMaintenance();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-blue-50 py-12">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">EMI, Fuel & Maintenance Calculator</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* EMI Card */}
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">EMI Calculator</h2>
            <div className="space-y-4">
              <div>
                <label className="form-label">Loan Amount (₹)</label>
                <input className="input-field" type="number" value={principal} onChange={(e) => setPrincipal(e.target.value)} />
              </div>
              <div>
                <label className="form-label">Interest Rate (% p.a.)</label>
                <input className="input-field" type="number" value={rate} onChange={(e) => setRate(e.target.value)} />
              </div>
              <div>
                <label className="form-label">Tenure (months)</label>
                <input className="input-field" type="number" value={tenure} onChange={(e) => setTenure(e.target.value)} />
              </div>
            </div>
            <button className="mt-6 btn-primary" onClick={calculateEMI}>Calculate EMI</button>
            {emi !== null && (
              <div className="mt-4">
                <p className="text-gray-700">Estimated Monthly EMI</p>
                <div className="text-2xl font-bold">{formatInr(emi)}</div>
              </div>
            )}
          </div>

          {/* Fuel & Maintenance Card */}
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">Fuel & Maintenance (2 Years)</h2>
            <div className="space-y-4">
              <div>
                <label className="form-label">Monthly Distance (km)</label>
                <input className="input-field" type="number" value={monthlyDistanceKm} onChange={(e) => setMonthlyDistanceKm(e.target.value)} />
              </div>
              <div>
                <label className="form-label">Mileage (kmpl)</label>
                <input className="input-field" type="number" value={mileageKmpl} onChange={(e) => setMileageKmpl(e.target.value)} />
              </div>
              <div>
                <label className="form-label">Fuel Price (₹/L)</label>
                <input className="input-field" type="number" value={fuelPricePerLitre} onChange={(e) => setFuelPricePerLitre(e.target.value)} />
              </div>
              <div>
                <label className="form-label">Annual Maintenance (₹)</label>
                <input className="input-field" type="number" value={annualMaintenanceInr} onChange={(e) => setAnnualMaintenanceInr(e.target.value)} />
              </div>
              <div>
                <label className="form-label">Yearly Escalation (%)</label>
                <input className="input-field" type="number" value={maintenanceEscalationPct} onChange={(e) => setMaintenanceEscalationPct(e.target.value)} />
              </div>
            </div>
            <button className="mt-6 btn-primary" onClick={() => { calculateFuelCost(); calculateMaintenance(); }}>Calculate</button>
            {(fuelCost2Years !== null || maintenance2Years !== null) && (
              <div className="mt-4 space-y-2">
                {fuelCost2Years !== null && (
                  <div>
                    <p className="text-gray-700">Estimated Fuel Cost (24 months)</p>
                    <div className="text-xl font-bold">{formatInr(fuelCost2Years)}</div>
                  </div>
                )}
                {maintenance2Years !== null && (
                  <div>
                    <p className="text-gray-700">Estimated Maintenance (24 months)</p>
                    <div className="text-xl font-bold">{formatInr(maintenance2Years)}</div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Combined quick action */}
        <div className="mt-8 text-center">
          <button className="btn-secondary" onClick={handleCalculateAll}>Calculate All</button>
        </div>
      </div>
    </div>
  );
};

export default EMICalculatorPage;
