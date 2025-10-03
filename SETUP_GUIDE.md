# ETCP - Eco-Tourism Cloud Platform
## Complete Setup Guide with Authentication & Database

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (v4.4 or higher)
- Yarn package manager

---

## 🚀 Quick Start

### 1. Install MongoDB

**Option A: MongoDB Community Server (Local)**
1. Download from: https://www.mongodb.com/try/download/community
2. Install and start MongoDB service
3. MongoDB will run on: `mongodb://localhost:27017`

**Option B: MongoDB Atlas (Cloud - Free)**
1. Create account at: https://www.mongodb.com/cloud/atlas
2. Create a free cluster
3. Get connection string (replace <password> with your password):
   ```
   mongodb+srv://username:<password>@cluster.mongodb.net/etcp?retryWrites=true&w=majority
   ```
4. Update `backend/.env` with your connection string

---

### 2. Backend Setup

```powershell
# Navigate to backend directory
cd "C:\Users\Pasindu Isuranga\Desktop\New folder (2)\backend"

# Install dependencies (if not already installed)
npm install

# Make sure bcryptjs is installed
npm install bcryptjs

# Start MongoDB (if using local installation)
# Windows: MongoDB should start automatically as a service
# Mac/Linux: mongod --dbpath /path/to/data/directory

# Seed the database with demo users
node seedDatabase.js

# Start the backend server
npm start
```

Backend will run on: **http://localhost:5000**

---

### 3. Frontend Setup

```powershell
# Navigate to frontend directory
cd "C:\Users\Pasindu Isuranga\Desktop\New folder (2)\frontend"

# Install dependencies (if not already installed)
yarn install

# Start the development server
yarn start
```

Frontend will run on: **http://localhost:3000**

---

## 🔐 Demo Accounts

### Traveler Account
- **Email:** `traveler@demo.com`
- **Password:** `demo123`
- Access to: Discovery Hub, Journeys, Voyager, Settings

### Provider Account
- **Email:** `provider@demo.com`
- **Password:** `demo123`
- Access to: Dashboard, Analytics, Reviews, Payments, Messages

---

## 📁 Project Structure

```
New folder (2)/
├── backend/
│   ├── models/
│   │   ├── User.js              # User authentication model
│   │   ├── Provider.js          # Provider profile model
│   │   ├── Experience.js        # Experience/tour model
│   │   └── Booking.js           # Booking model
│   ├── routes/
│   │   └── auth.js              # Authentication routes
│   ├── middleware/
│   │   └── auth.js              # JWT authentication middleware
│   ├── server.js                # Main server file
│   ├── seedDatabase.js          # Database seeding script
│   ├── .env                     # Environment variables
│   └── package.json
│
└── frontend/
    ├── src/
    │   ├── components/
    │   │   ├── auth/
    │   │   │   ├── Login.js           # Login page
    │   │   │   ├── Register.js        # Registration page
    │   │   │   └── auth.css           # Auth styling
    │   │   ├── provider/
    │   │   │   ├── ProviderDashboard.js
    │   │   │   ├── ReviewsManagement.js
    │   │   │   ├── AdvancedAnalytics.js
    │   │   │   ├── PaymentManagement.js
    │   │   │   ├── MessagingCenter.js
    │   │   │   └── provider.css
    │   │   ├── EcoDiscoveryHub.js
    │   │   ├── EcoJourneys.js
    │   │   ├── EtcpVoyager.js
    │   │   └── Settings.js
    │   ├── App.js                     # Main app with routing
    │   └── index.js
    └── package.json

```

---

## 🔑 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user
- `POST /api/auth/logout` - Logout user

### Experiences
- `GET /api/experiences` - Get all experiences
- `POST /api/experiences` - Create experience (Provider only)
- `GET /api/experiences/:id` - Get single experience
- `PUT /api/experiences/:id` - Update experience
- `DELETE /api/experiences/:id` - Delete experience

### Bookings
- `GET /api/bookings` - Get user bookings
- `POST /api/bookings` - Create booking
- `GET /api/bookings/:id` - Get single booking
- `PUT /api/bookings/:id` - Update booking

### Provider Routes
- `GET /api/providers/:id/dashboard` - Provider analytics
- `GET /api/providers/:id/reviews` - Provider reviews
- `POST /api/providers/:id/reviews/:reviewId/reply` - Reply to review
- `GET /api/providers/:id/payments` - Payment history
- `GET /api/providers/:id/conversations` - Messages

---

## 🌐 Environment Variables

### Backend (.env)
```
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/etcp
JWT_SECRET=your-secret-key-here
JWT_EXPIRES_IN=7d
```

**Important:** Change `JWT_SECRET` to a strong random string in production!

---

## 🔄 Database Schema

### User Model
- name, email, password (hashed)
- userType: 'traveler' | 'provider'
- phone, country, avatar
- isVerified, createdAt

### Provider Model
- userId (ref: User)
- businessName, businessType, description
- location, sustainabilityScore
- certifications, verified
- rating, totalReviews
- bankDetails, payoutSchedule

### Experience Model
- providerId (ref: Provider)
- title, description, category
- location, price, duration
- groupSize, difficulty
- sustainabilityFeatures, carbonOffset
- images, availability
- rating, totalReviews

### Booking Model
- experienceId, userId, providerId
- bookingDate, numberOfPeople, totalPrice
- status: 'pending' | 'confirmed' | 'cancelled' | 'completed'
- paymentStatus, carbonOffset

---

## 🎨 Features

### Traveler Features
- ✅ User registration and login
- ✅ Browse eco-experiences
- ✅ Book experiences
- ✅ Interactive map view
- ✅ Booking management
- ✅ User preferences

### Provider Features
- ✅ Provider registration
- ✅ Dashboard with analytics
- ✅ Experience management
- ✅ Review management & replies
- ✅ Advanced analytics with charts
- ✅ Payment tracking & payouts
- ✅ Customer messaging

### Security Features
- ✅ Password hashing with bcrypt
- ✅ JWT token authentication
- ✅ Protected routes
- ✅ Rate limiting
- ✅ CORS enabled
- ✅ Helmet security headers

---

## 🧪 Testing the Application

1. **Start MongoDB** (if using local)
2. **Seed the database**: `cd backend && node seedDatabase.js`
3. **Start backend**: `cd backend && npm start`
4. **Start frontend**: `cd frontend && yarn start`
5. **Open browser**: http://localhost:3000
6. **Login** with demo credentials
7. **Test features** based on account type

---

## 🐛 Troubleshooting

### MongoDB Connection Issues
```
Error: MongoDB Connection Error
```
**Solution:** 
- Make sure MongoDB is running
- Check connection string in `.env`
- For Atlas: Whitelist your IP address

### Port Already in Use
```
Error: Port 5000 is already in use
```
**Solution:**
```powershell
# Windows - Kill process on port 5000
netstat -ano | findstr :5000
taskkill /PID <PID> /F
```

### JWT Error
```
Error: jwt must be provided
```
**Solution:** 
- Clear browser localStorage
- Login again to get new token

### Compilation Error
```
Module not found
```
**Solution:**
```powershell
# Reinstall dependencies
cd frontend
rm -rf node_modules
yarn install
```

---

## 📝 Next Steps

1. ✅ **Test Authentication** - Login/Register for both user types
2. ✅ **Create Experiences** - Add tours as a provider
3. ✅ **Make Bookings** - Book experiences as a traveler
4. ⏳ **Add Payment Gateway** - Integrate Stripe/PayPal
5. ⏳ **Email Notifications** - Add email service
6. ⏳ **Image Upload** - Integrate Cloudinary/AWS S3
7. ⏳ **Real-time Chat** - Implement Socket.io
8. ⏳ **Production Deploy** - Deploy to Heroku/AWS

---

## 📚 Documentation

- React: https://react.dev/
- Node.js/Express: https://expressjs.com/
- MongoDB: https://docs.mongodb.com/
- JWT: https://jwt.io/
- React Router: https://reactrouter.com/

---

## 🆘 Support

For issues or questions:
1. Check the console for error messages
2. Verify all environment variables are set
3. Ensure MongoDB is running
4. Check that all dependencies are installed

---

**Happy Coding! 🌿**
