// EMI Calculator
export const calculateEMI = (principal, rate, tenure) => {
  const monthlyRate = rate / (12 * 100);
  const emi =
    (principal * monthlyRate * Math.pow(1 + monthlyRate, tenure)) /
    (Math.pow(1 + monthlyRate, tenure) - 1);
  return emi.toFixed(2);
};

// Fuel Cost Calculator
export const calculateFuelCost = (distance, mileage, fuelPrice) => {
  const fuelNeeded = distance / mileage;
  return (fuelNeeded * fuelPrice).toFixed(2);
};
