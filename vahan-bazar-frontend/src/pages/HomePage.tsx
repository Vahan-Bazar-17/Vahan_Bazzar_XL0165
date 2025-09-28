import React from 'react';
import { Link } from 'react-router-dom';
import Footer from '../components/Footer';

// Dummy data for most bought products
const mostBoughtProducts = [
  {
    id: 1,
    name: "Honda Activa 6G",
    category: "Scooter",
    price: 75000,
    image: "https://imgd.aeplcdn.com/664x374/n/cw/ec/1/versions/--connected-obd-2b1737697110094.jpg?q=80",
    rating: 4.5,
    sales: 1250
  },
  {
    id: 2,
    name: "Royal Enfield Classic 350",
    category: "Bike",
    price: 195000,
    image: "https://www.royalenfield.com/content/dam/royal-enfield/motorcycles/new-classic-350/studio-shots/360/emerald/01.png",
    rating: 4.8,
    sales: 890
  },
  {
    id: 3,
    name: "TVS Jupiter",
    category: "Scooter",
    price: 68000,
    image: "https://5.imimg.com/data5/SELLER/Default/2022/1/AQ/HK/WU/3511041/tvs-jupiter-125cc-scooter-1000x1000.jpg",
    rating: 4.3,
    sales: 1100
  },
  {
    id: 4,
    name: "Yamaha R15 V4",
    category: "Bike",
    price: 185000,
    image: "https://imgd.aeplcdn.com/664x374/n/bw/models/colors/yamaha-select-model-yamaha-black-1702635690402.png?q=80",
    rating: 4.7,
    sales: 650
  },
  {
    id: 5,
    name: "Ola S1 Pro",
    category: "Electric",
    price: 130000,
    image: "https://m.media-amazon.com/images/I/51nncnfHU4L._SL1080_.jpg",
    rating: 4.4,
    sales: 420
  },
  {
    id: 6,
    name: "Bajaj Pulsar 150",
    category: "Bike",
    price: 120000,
    image: "https://imgd.aeplcdn.com/664x374/n/cw/ec/1/versions/bajaj-pulsar-150-single-disc-bluetooth1724747031670.jpg?q=80",
    rating: 4.2,
    sales: 980
  }
];

const HomePage: React.FC = () => {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(price);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 via-blue-500/10 to-blue-900/20"></div>
        <div className="absolute inset-0 opacity-30" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%233b82f6' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
        }}></div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="mb-8">
            <div className="inline-flex items-center space-x-3 bg-white/90 backdrop-blur-sm rounded-full px-6 py-3 mb-8 shadow-lg">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-blue-700 rounded-full flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M8 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM15 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
                  <path d="M3 4a1 1 0 00-1 1v10a1 1 0 001 1h1.05a2.5 2.5 0 014.9 0H10a1 1 0 001-1V5a1 1 0 00-1-1H3zM14 7a1 1 0 00-1 1v6.05A2.5 2.5 0 0115.95 14H17a1 1 0 001-1V8a1 1 0 00-1-1h-3z" />
                </svg>
              </div>
              <span className="text-gray-700 font-semibold">India's Premier Vehicle Marketplace</span>
            </div>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-6 leading-tight">
            Find Your
            <span className="block bg-gradient-to-r from-blue-600 to-blue-700 bg-clip-text text-transparent">
              Perfect Ride
            </span>
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-600 mb-12 max-w-3xl mx-auto leading-relaxed">
            Discover premium two-wheelers, sell your vehicle, and experience the ultimate automotive marketplace. 
            From classic cruisers to cutting-edge electric vehicles.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              to="/browse" 
              className="btn-primary text-lg px-8 py-4 shadow-2xl hover:shadow-blue-500/25"
            >
              Browse Vehicles
            </Link>
            <Link 
              to="/sell-vehicle" 
              className="btn-outline text-lg px-8 py-4 hover:bg-blue-50"
            >
              Sell Your Vehicle
            </Link>
          </div>
          </div>

        {/* Floating Elements */}
        <div className="absolute top-20 left-10 w-20 h-20 bg-blue-200/30 rounded-full blur-xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-32 h-32 bg-slate-200/30 rounded-full blur-xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-blue-300/20 rounded-full blur-lg animate-bounce"></div>
      </section>

      {/* About Us Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              About <span className="bg-gradient-to-r from-blue-600 to-blue-700 bg-clip-text text-transparent">Vahan Bazar</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We are India's premier destination for automotive excellence, combining decades of expertise 
              with cutting-edge technology to deliver an unparalleled vehicle buying and selling experience.
                </p>
              </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-8">
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl flex items-center justify-center flex-shrink-0">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
              </div>
              <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">Premium Selection</h3>
                    <p className="text-gray-600">
                      Curated collection of the finest vehicles from leading manufacturers, 
                      ensuring only the highest quality reaches our customers.
                    </p>
              </div>
              </div>

                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-slate-600 to-slate-700 rounded-xl flex items-center justify-center flex-shrink-0">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                </div>
                <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">Quality Assurance</h3>
                    <p className="text-gray-600">
                      Every vehicle undergoes rigorous inspection and certification, 
                      guaranteeing performance, safety, and reliability.
                    </p>
                </div>
              </div>

                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl flex items-center justify-center flex-shrink-0">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
              </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">Customer-Centric</h3>
                    <p className="text-gray-600">
                      Our dedicated team provides personalized service, expert guidance, 
                      and ongoing support throughout your automotive journey.
                    </p>
            </div>
          </div>
        </div>
      </div>

            <div className="relative">
              <div className="aspect-w-4 aspect-h-3 rounded-2xl overflow-hidden shadow-2xl">
                <img 
                  src="https://www.royalenfield.com/content/dam/royal-enfield/motorcycles/new-classic-350/studio-shots/360/emerald/01.png" 
                  alt="Premium motorcycles showcase"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl shadow-xl flex items-center justify-center">
                <span className="text-white text-2xl font-bold">15+</span>
              </div>
              <div className="absolute -top-6 -left-6 w-20 h-20 bg-gradient-to-br from-slate-600 to-slate-700 rounded-2xl shadow-xl flex items-center justify-center">
                <span className="text-white text-lg font-bold">Years</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-20 bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Why Choose <span className="bg-gradient-to-r from-blue-600 to-blue-700 bg-clip-text text-transparent">Vahan Bazar</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Experience the difference with our commitment to excellence, innovation, and customer satisfaction.
                </p>
              </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl flex items-center justify-center mb-6">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Quality Guarantee</h3>
              <p className="text-gray-600 mb-6">
                Every vehicle comes with our comprehensive quality guarantee, ensuring you get the best value for your investment.
              </p>
              <div className="flex items-center text-blue-600 font-semibold">
                <span>Learn More</span>
                <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>

            {/* Feature 2 */}
            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105">
              <div className="w-16 h-16 bg-gradient-to-br from-slate-600 to-slate-700 rounded-2xl flex items-center justify-center mb-6">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">24/7 Support</h3>
              <p className="text-gray-600 mb-6">
                Round-the-clock customer support and roadside assistance to ensure your peace of mind on every journey.
              </p>
              <div className="flex items-center text-slate-600 font-semibold">
                <span>Learn More</span>
                <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>

            {/* Feature 3 */}
            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl flex items-center justify-center mb-6">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Flexible Financing</h3>
              <p className="text-gray-600 mb-6">
                Competitive financing options and flexible payment plans to make your dream vehicle accessible.
              </p>
              <div className="flex items-center text-blue-600 font-semibold">
                <span>Learn More</span>
                <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>

            {/* Feature 4 */}
            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105">
              <div className="w-16 h-16 bg-gradient-to-br from-slate-600 to-slate-700 rounded-2xl flex items-center justify-center mb-6">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Expert Guidance</h3>
              <p className="text-gray-600 mb-6">
                Our experienced team provides personalized recommendations based on your needs, preferences, and budget.
              </p>
              <div className="flex items-center text-slate-600 font-semibold">
                <span>Learn More</span>
                <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>

            {/* Feature 5 */}
            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl flex items-center justify-center mb-6">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Fast Delivery</h3>
              <p className="text-gray-600 mb-6">
                Quick and secure delivery across India with real-time tracking and insurance coverage.
              </p>
              <div className="flex items-center text-blue-600 font-semibold">
                <span>Learn More</span>
                <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
            </div>
          </div>

            {/* Feature 6 */}
            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105">
              <div className="w-16 h-16 bg-gradient-to-br from-slate-600 to-slate-700 rounded-2xl flex items-center justify-center mb-6">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Secure Transactions</h3>
              <p className="text-gray-600 mb-6">
                Bank-grade security for all transactions with multiple payment options and buyer protection.
              </p>
              <div className="flex items-center text-slate-600 font-semibold">
                <span>Learn More</span>
                <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Most Bought Products Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Most Bought <span className="bg-gradient-to-r from-blue-600 to-blue-700 bg-clip-text text-transparent">Products</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Discover our best-selling vehicles that customers love the most.
            </p>
            </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {mostBoughtProducts.map((product) => (
              <div key={product.id} className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105 overflow-hidden border border-gray-100">
                <div className="relative">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-48 object-cover"
                  />
                  <div className="absolute top-4 left-4">
                    <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
                      #{product.sales} sold
                    </span>
                  </div>
                    <div className="absolute top-4 right-4">
                    <span className="bg-white/90 backdrop-blur-sm text-gray-700 px-3 py-1 rounded-full text-sm font-semibold">
                      {product.category}
                      </span>
                    </div>
                  </div>
                  
                  <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    {product.name}
                      </h3>
                  
                  <div className="flex items-center mb-4">
                        <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <svg
                          key={i}
                          className={`w-4 h-4 ${i < Math.floor(product.rating) ? 'text-yellow-400' : 'text-gray-300'}`}
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                    <span className="ml-2 text-sm text-gray-600">
                      {product.rating} ({product.sales} reviews)
                          </span>
                    </div>
                    
                  <div className="text-2xl font-bold text-blue-600 mb-4">
                    {formatPrice(product.price)}
                    </div>
                    
                    <div className="flex space-x-3">
                      <Link
                        to="/browse"
                        className="flex-1 btn-primary text-center"
                      >
                        View Details
                      </Link>
                      <Link
                        to="/compare"
                        className="btn-outline"
                      >
                        Compare
                      </Link>
                    </div>
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

      {/* Stats Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-blue-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
            <div className="text-white">
              <div className="text-4xl md:text-5xl font-bold mb-2">10K+</div>
              <div className="text-blue-100 text-lg">Happy Customers</div>
        </div>
            <div className="text-white">
              <div className="text-4xl md:text-5xl font-bold mb-2">500+</div>
              <div className="text-blue-100 text-lg">Vehicle Models</div>
      </div>
            <div className="text-white">
              <div className="text-4xl md:text-5xl font-bold mb-2">50+</div>
              <div className="text-blue-100 text-lg">Cities Served</div>
              </div>
            <div className="text-white">
              <div className="text-4xl md:text-5xl font-bold mb-2">15+</div>
              <div className="text-blue-100 text-lg">Years Experience</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Ready to Find Your Perfect Ride?
          </h2>
          <p className="text-xl text-gray-600 mb-12">
            Join thousands of satisfied customers who have found their dream vehicle with us.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              to="/browse" 
              className="btn-primary text-lg px-8 py-4 shadow-2xl hover:shadow-blue-500/25"
            >
              Start Shopping
            </Link>
            <Link 
              to="/sell-vehicle" 
              className="btn-outline text-lg px-8 py-4 hover:bg-blue-50"
            >
              Sell Your Vehicle
            </Link>
              </div>
            </div>
      </section>
    </div>
  );
};

export default HomePage;