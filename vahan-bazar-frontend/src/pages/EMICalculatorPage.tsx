import React, { useState } from 'react';
import axios from 'axios';

const EMICalculatorPage: React.FC = () => {
  const [formData, setFormData] = useState({
    principal: '',
    rate: '',
    tenure: '',
  });
  const [emi, setEmi] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const calculateEMI = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.principal || !formData.rate || !formData.tenure) return;

    try {
      setLoading(true);
      const response = await axios.post('http://localhost:5000/api/vehicles/emi', {
        principal: Number(formData.principal),
        rate: Number(formData.rate),
        tenure: Number(formData.tenure),
      });
      setEmi(Number(response.data.emi));
    } catch (error) {
      console.error('Error calculating EMI:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">EMI Calculator</h1>
        <p className="text-gray-600">
          Calculate your monthly EMI payments for vehicle financing.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Calculator Form */}
        <div className="card">
          <h2 className="text-xl font-semibold mb-6">Enter Details</h2>
          <form onSubmit={calculateEMI} className="space-y-6">
            <div>
              <label htmlFor="principal" className="block text-sm font-medium text-gray-700 mb-2">
                Loan Amount (Principal)
              </label>
              <input
                type="number"
                id="principal"
                name="principal"
                value={formData.principal}
                onChange={handleChange}
                placeholder="Enter loan amount"
                className="input-field"
                required
              />
            </div>

            <div>
              <label htmlFor="rate" className="block text-sm font-medium text-gray-700 mb-2">
                Interest Rate (% per annum)
              </label>
              <input
                type="number"
                id="rate"
                name="rate"
                value={formData.rate}
                onChange={handleChange}
                placeholder="Enter interest rate"
                step="0.1"
                className="input-field"
                required
              />
            </div>

            <div>
              <label htmlFor="tenure" className="block text-sm font-medium text-gray-700 mb-2">
                Loan Tenure (months)
              </label>
              <input
                type="number"
                id="tenure"
                name="tenure"
                value={formData.tenure}
                onChange={handleChange}
                placeholder="Enter tenure in months"
                className="input-field"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full btn-primary"
            >
              {loading ? 'Calculating...' : 'Calculate EMI'}
            </button>
          </form>
        </div>

        {/* Results */}
        <div className="card">
          <h2 className="text-xl font-semibold mb-6">EMI Details</h2>
          
          {emi ? (
            <div className="space-y-4">
              <div className="bg-primary-50 p-6 rounded-lg">
                <div className="text-center">
                  <p className="text-sm text-gray-600 mb-2">Monthly EMI</p>
                  <p className="text-3xl font-bold text-primary-600">
                    {formatCurrency(emi)}
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Loan Amount:</span>
                  <span className="font-semibold">{formatCurrency(Number(formData.principal))}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Interest Rate:</span>
                  <span className="font-semibold">{formData.rate}% p.a.</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Tenure:</span>
                  <span className="font-semibold">{formData.tenure} months</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Interest:</span>
                  <span className="font-semibold">
                    {formatCurrency((emi * Number(formData.tenure)) - Number(formData.principal))}
                  </span>
                </div>
                <div className="flex justify-between border-t pt-3">
                  <span className="text-gray-600 font-semibold">Total Amount:</span>
                  <span className="font-bold text-lg">
                    {formatCurrency(emi * Number(formData.tenure))}
                  </span>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <div className="text-gray-400 mb-4">
                <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
              </div>
              <p className="text-gray-500">Enter the details above to calculate your EMI</p>
            </div>
          )}
        </div>
      </div>

      {/* EMI Tips */}
      <div className="mt-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">EMI Tips</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="card">
            <h3 className="text-lg font-semibold mb-3">Lower Interest Rates</h3>
            <p className="text-gray-600 text-sm">
              Shop around for the best interest rates. Even a 0.5% difference can save you thousands over the loan tenure.
            </p>
          </div>
          
          <div className="card">
            <h3 className="text-lg font-semibold mb-3">Shorter Tenure</h3>
            <p className="text-gray-600 text-sm">
              Opt for a shorter loan tenure if you can afford higher EMIs. This reduces the total interest paid.
            </p>
          </div>
          
          <div className="card">
            <h3 className="text-lg font-semibold mb-3">Down Payment</h3>
            <p className="text-gray-600 text-sm">
              Make a larger down payment to reduce the loan amount and lower your EMI burden.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EMICalculatorPage;
