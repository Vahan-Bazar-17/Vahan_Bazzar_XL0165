import React from 'react';
import { Link } from 'react-router-dom';

const HomePage: React.FC = () => {
  const features = [
    {
      icon: "🚗",
      title: "Wide Selection",
      description: "Browse through thousands of vehicles from top brands"
    },
    {
      icon: "🔍",
      title: "Smart Search",
      description: "Find your perfect vehicle with our advanced search filters"
    },
    {
      icon: "💰",
      title: "Best Prices",
      description: "Compare prices and get the best deals on your dream vehicle"
    },
    {
      icon: "🛡️",
      title: "Trusted Platform",
      description: "Secure transactions with verified sellers and buyers"
    }
  ];

  const whyChooseUs = [
    {
      title: "Verified Listings",
      description: "All vehicles are thoroughly verified for authenticity and condition",
      icon: "✅"
    },
    {
      title: "Expert Support",
      description: "Get help from our automotive experts throughout your journey",
      icon: "👨‍🔧"
    },
    {
      title: "Easy Financing",
      description: "Flexible EMI options and instant loan approvals available",
      icon: "💳"
    },
    {
      title: "Free Test Rides",
      description: "Schedule test rides for any vehicle before making a decision",
      icon: "🏍️"
    }
  ];

  const mostBoughtProducts = [
    {
      id: 1,
      name: "Honda Activa 6G",
      price: "₹75,000",
      image: "https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=400",
      rating: 4.5,
      category: "Scooter"
    },
    {
      id: 2,
      name: "Royal Enfield Classic 350",
      price: "₹1,85,000",
      image: "https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?w=400",
      rating: 4.8,
      category: "Bike"
    },
    {
      id: 3,
      name: "Yamaha R15 V4",
      price: "₹1,95,000",
      image: "https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=400",
      rating: 4.7,
      category: "Sports Bike"
    },
    {
      id: 4,
      name: "TVS Apache RTR 160",
      price: "₹1,25,000",
      image: "https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?w=400",
      rating: 4.6,
      category: "Bike"
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="hero-section relative py-20 lg:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-5xl lg:text-7xl font-bold text-gray-900 mb-6 fade-in">
              Find Your Perfect
              <span className="text-gradient block">Ride</span>
            </h1>
            <p className="text-xl lg:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto slide-up">
              Discover, compare, and buy your dream vehicle from thousands of verified listings. 
              Your next adventure starts here.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center slide-up">
              <Link to="/browse" className="btn-primary text-lg px-8 py-4">
                Browse Vehicles
              </Link>
              <Link to="/sell" className="btn-secondary text-lg px-8 py-4">
                Sell Your Vehicle
              </Link>
            </div>
          </div>
        </div>
        
        {/* Floating Elements */}
        <div className="absolute top-20 left-10 w-20 h-20 bg-blue-200 rounded-full opacity-20 animate-pulse"></div>
        <div className="absolute top-40 right-20 w-16 h-16 bg-purple-200 rounded-full opacity-20 animate-pulse delay-1000"></div>
        <div className="absolute bottom-20 left-1/4 w-12 h-12 bg-green-200 rounded-full opacity-20 animate-pulse delay-2000"></div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Why Choose Vahan Bazar?</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              We make buying and selling vehicles simple, secure, and rewarding
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="feature-card text-center bounce-in" style={{ animationDelay: `${index * 0.1}s` }}>
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About Us Section */}
      <section className="py-20 bg-gradient-to-br from-blue-50 to-purple-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold text-gray-900 mb-6">About Vahan Bazar</h2>
              <p className="text-lg text-gray-600 mb-6">
                We're India's leading automotive marketplace, connecting buyers and sellers 
                with a platform that prioritizes trust, transparency, and exceptional service.
              </p>
              <p className="text-lg text-gray-600 mb-8">
                With over 10,000+ verified vehicles and 50,000+ satisfied customers, 
                we're committed to making your vehicle buying and selling experience seamless.
              </p>
              <div className="grid grid-cols-2 gap-6">
                <div className="stats-card text-center">
                  <div className="stats-number">10K+</div>
                  <div className="stats-label">Vehicles Listed</div>
                </div>
                <div className="stats-card text-center">
                  <div className="stats-number">50K+</div>
                  <div className="stats-label">Happy Customers</div>
                </div>
              </div>
            </div>
            <div className="relative">
              <div className="bg-white rounded-2xl shadow-strong p-8">
                <div className="text-center">
                  <div className="text-6xl mb-4">🏆</div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">Trusted Platform</h3>
                  <p className="text-gray-600 mb-6">
                    Every vehicle is verified by our expert team to ensure quality and authenticity.
                  </p>
                  <div className="flex justify-center space-x-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600">99.9%</div>
                      <div className="text-sm text-gray-600">Success Rate</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600">24/7</div>
                      <div className="text-sm text-gray-600">Support</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Why Choose Us?</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              We go the extra mile to ensure your vehicle buying experience is exceptional
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {whyChooseUs.map((item, index) => (
              <div key={index} className="text-center slide-up" style={{ animationDelay: `${index * 0.1}s` }}>
                <div className="text-5xl mb-4">{item.icon}</div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{item.title}</h3>
                <p className="text-gray-600">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Most Bought Products */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Most Bought Products</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Discover the most popular vehicles that our customers love
            </p>
          </div>
          
          <div className="responsive-grid">
            {mostBoughtProducts.map((product) => (
              <div key={product.id} className="vehicle-card card-hover">
                <div className="relative overflow-hidden">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="vehicle-card-image"
                    loading="lazy"
                  />
                  <div className="absolute top-4 left-4">
                    <span className="badge badge-secondary">{product.category}</span>
                  </div>
                  <div className="absolute top-4 right-4">
                    <div className="bg-white rounded-full px-3 py-1 flex items-center space-x-1">
                      <span className="text-yellow-500">★</span>
                      <span className="text-sm font-semibold">{product.rating}</span>
                    </div>
                  </div>
                </div>
                
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{product.name}</h3>
                  <div className="price-display mb-4">{product.price}</div>
                  <Link to="/browse" className="btn-primary w-full text-center">
                    View Details
                  </Link>
                </div>
              </div>
            ))}
          </div>
          
          <div className="text-center mt-12">
            <Link to="/browse" className="btn-primary text-lg px-8 py-4">
              View All Vehicles
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold mb-6">Ready to Find Your Perfect Vehicle?</h2>
          <p className="text-xl mb-8 opacity-90">
            Join thousands of satisfied customers who found their dream vehicle with us
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/browse" className="bg-white text-blue-600 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-gray-100 transition-colors duration-300">
              Start Browsing
            </Link>
            <Link to="/sell" className="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-white hover:text-blue-600 transition-colors duration-300">
              List Your Vehicle
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
