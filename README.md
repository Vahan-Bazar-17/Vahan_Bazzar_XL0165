# Vahan Bazar - Two-Wheeler Marketplace

A complete MERN stack prototype for a two-wheeler marketplace application.

## 🚀 Quick Start

### Backend Setup
```bash
cd vahan-bazzar-backend
npm install
npm run dev
```

### Frontend Setup
```bash
cd vahan-bazar-frontend
npm install
npm start
```

### Database Setup
```bash
cd vahan-bazzar-backend
npm run seed
```

## 📋 Features

### ✅ Completed Features
- **Authentication System** (JWT-based)
- **Vehicle Management** (CRUD operations)
- **Advanced Filtering** (brand, price, fuel type, category)
- **Vehicle Comparison** (side-by-side comparison)
- **EMI Calculator** (loan calculations)
- **Responsive Design** (Tailwind CSS)
- **Sample Data** (5 vehicles with complete specs)

### 🔧 Backend API Endpoints

#### Authentication
- `POST /api/auth/signup` - User registration
- `POST /api/auth/login` - User login

#### Vehicles
- `GET /api/vehicles` - Get all vehicles with filters
- `GET /api/vehicles/:id` - Get single vehicle
- `POST /api/vehicles/compare` - Compare vehicles
- `POST /api/vehicles/emi` - Calculate EMI
- `POST /api/vehicles/fuel-cost` - Calculate fuel cost

#### Bookings
- `POST /api/bookings` - Create booking
- `GET /api/bookings/my-bookings` - Get user bookings

### 🎨 Frontend Pages
- **Landing Page** - Hero section with loader animation
- **Authentication** - Login/Signup forms
- **Home Page** - Vehicle listing with filters
- **Vehicle Details** - Complete specifications
- **Comparison** - Side-by-side vehicle comparison
- **EMI Calculator** - Loan payment calculator

## 🗄️ Database Schema

### Vehicle Model
- Basic Info: brand, model, variant, year, category
- Engine/Battery: capacity, power, torque, range
- Performance: top speed, mileage
- Features: safety, comfort, technology
- Pricing: ex-showroom, on-road prices
- Images: thumbnail and gallery
- Ratings: user and expert ratings

### User Model
- Authentication: email, password (hashed)
- Profile: name, phone, role (user/dealer)

## 🧪 Test Accounts

**Regular User:**
- Email: `john@example.com`
- Password: `password123`

**Dealer:**
- Email: `dealer@vahanbazar.com`
- Password: `dealer123`

## 🌐 Access URLs

- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:5000
- **API Health:** http://localhost:5000/api/health

## 📱 Sample Data

The database includes **18 comprehensive vehicles** across all categories:

**🏍️ BIKES (7 vehicles):**
1. **Yamaha R15 V4** - Sports Bike (₹1,82,500)
2. **Honda Shine 100** - Commuter Bike (₹75,000)
3. **Royal Enfield Himalayan 450** - Adventure Bike (₹2,85,000)
4. **Royal Enfield Meteor 350** - Cruiser Bike (₹2,40,000)
5. **KTM Duke 390** - Sports Bike (₹3,20,000)
6. **Bajaj Pulsar 150** - Commuter Bike (₹1,20,000)
7. **Revolt RV 400** - Electric Bike (₹1,25,000)

**🛵 SCOOTERS (5 vehicles):**
8. **Ola S1 Pro** - Electric Scooter (₹1,39,999)
9. **TVS iQube** - Electric Scooter (₹1,10,000)
10. **Honda Activa 6G** - Petrol Scooter (₹72,000)
11. **TVS Jupiter 125** - Petrol Scooter (₹85,000)
12. **Ather 450X** - Electric Scooter (₹1,45,000)

**🚗 CARS (4 vehicles):**
13. **Toyota Fortuner** - SUV (₹42,00,000)
14. **Tata Nexon EV** - Electric Car (₹14,50,000)
15. **Honda City** - Sedan (₹16,50,000)
16. **Maruti Swift** - Hatchback (₹7,50,000)

## 🛠️ Tech Stack

### Backend
- Node.js + Express
- MongoDB + Mongoose
- JWT Authentication
- CORS enabled

### Frontend
- React + TypeScript
- Tailwind CSS
- React Router
- Axios for API calls

## 🎯 Hackathon Ready

This prototype demonstrates all core flows:
- ✅ User registration and authentication
- ✅ Vehicle browsing with advanced filters
- ✅ Detailed vehicle specifications
- ✅ Vehicle comparison functionality
- ✅ EMI calculation for financing
- ✅ Responsive mobile-friendly design
- ✅ Complete backend API with sample data

Perfect for hackathon demonstrations and further development!
