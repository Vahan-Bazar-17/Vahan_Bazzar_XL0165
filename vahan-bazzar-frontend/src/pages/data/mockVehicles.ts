// 30 mock vehicles for the Browse and Compare pages
// Keep IDs stable for compare/localStorage
// Fixed-size mock dataset for Browse (30 items)
export const mockVehicles = Array.from({ length: 30 }).map((_, i) => {
  const brands = ['Honda', 'Yamaha', 'TVS', 'Royal Enfield', 'KTM', 'Hero', 'Bajaj', 'Suzuki', 'Ducati', 'Harley Davidson'];
  const categories = ['Bike', 'Scooter', 'EV', 'Sports Bike', 'Cruiser'];
  const fuels = ['Petrol', 'Electric', 'Diesel', 'Hybrid'];
  const brand = brands[i % brands.length];
  const category = categories[i % categories.length];
  const fuel = fuels[i % fuels.length];
  const price = 60000 + (i * 15000);

  return {
    _id: `mock_${i + 1}`,
    brand,
    model: `Model ${i + 1}`,
    variant: i % 3 === 0 ? 'Standard' : i % 3 === 1 ? 'Deluxe' : 'Pro',
    category: category,
    fuel_type: fuel,
    pricing: {
      ex_showroom_inr: price,
      on_road_inr: Math.round(price * 1.12)
    },
    images: {
      thumbnail: `https://picsum.photos/seed/vehicle_${i + 1}/600/400`,
      gallery: [
        `https://picsum.photos/seed/vehicle_g1_${i + 1}/800/500`,
        `https://picsum.photos/seed/vehicle_g2_${i + 1}/800/500`
      ]
    },
    ratings: {
      user_rating: Math.round((3 + Math.random() * 2) * 10) / 10,
      reviews_count: 100 + i * 5
    },
    performance: {
      mileage_kmpl: 30 + (i % 15),
      top_speed_kmph: 90 + (i % 60)
    },
    tags: ['ABS', 'LED', 'Bluetooth'].slice(0, (i % 3) + 1)
  };
});
