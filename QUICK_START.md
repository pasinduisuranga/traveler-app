# 🚀 Quick Start Guide - ETCP Platform

## Step 1: Install MongoDB

### Option A: MongoDB Local (Recommended for Development)
1. Download MongoDB Community Server: https://www.mongodb.com/try/download/community
2. Install with default settings
3. MongoDB will run automatically as a Windows service

### Option B: Use MongoDB Atlas (Cloud - No Installation)
1. Go to: https://www.mongodb.com/cloud/atlas
2. Sign up for free
3. Create a free cluster (M0)
4. Get your connection string
5. Update `backend/.env` with your connection string:
   ```
   MONGODB_URI=your-atlas-connection-string
   ```

---

## Step 2: Verify MongoDB is Running

```powershell
# Check if MongoDB service is running
Get-Service MongoDB

# If not running, start it
Start-Service MongoDB

# Or check if mongod is accessible
mongod --version
```

---

## Step 3: Setup the Application

### Terminal 1 - Backend Server
```powershell
cd "C:\Users\Pasindu Isuranga\Desktop\New folder (2)\backend"

# Seed database with demo users
node seedDatabase.js

# Start backend server
npm start
```

### Terminal 2 - Frontend Server
```powershell
cd "C:\Users\Pasindu Isuranga\Desktop\New folder (2)\frontend"

# Start frontend (should already be running)
yarn start
```

---

## Step 4: Login to the Application

Open browser: **http://localhost:3000**

### Demo Accounts:

**Traveler Account:**
- Email: `traveler@demo.com`
- Password: `demo123`

**Provider Account:**
- Email: `provider@demo.com`
- Password: `demo123`

---

## 🔧 Troubleshooting

### Issue: "MongoDB connection error"

**Solution 1 - Start MongoDB Service:**
```powershell
# Check MongoDB service status
Get-Service MongoDB*

# Start the service
Start-Service MongoDB
```

**Solution 2 - Use MongoDB Atlas (Cloud):**
1. Don't want to install MongoDB locally? Use the free cloud version
2. Visit: https://www.mongodb.com/cloud/atlas
3. Create free account and cluster
4. Get connection string
5. Update `backend/.env`:
   ```
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/etcp
   ```

**Solution 3 - Manual MongoDB Start:**
```powershell
# Navigate to MongoDB bin directory (adjust path if needed)
cd "C:\Program Files\MongoDB\Server\7.0\bin"

# Start MongoDB
mongod --dbpath "C:\data\db"
```

---

### Issue: "Port 5000 already in use"

```powershell
# Find and kill the process
netstat -ano | findstr :5000
taskkill /PID <PID_NUMBER> /F

# Or change port in backend/.env
PORT=5001
```

---

### Issue: Frontend won't compile

```powershell
cd frontend
rm -rf node_modules
yarn install
yarn start
```

---

## ✅ Features Available

### For Travelers:
- 🔍 Browse eco-experiences
- 📅 Make bookings
- 🗺️ Interactive map view
- ⚙️ Manage preferences

### For Providers:
- 📊 Analytics dashboard
- ⭐ Review management
- 💳 Payment tracking
- 💬 Customer messaging
- 📝 Experience management

---

## 🎯 What's Next?

1. **Test the Login System** - Try both traveler and provider accounts
2. **Explore Features** - Navigate through different sections
3. **Create Content** - Add experiences as a provider
4. **Make Bookings** - Book experiences as a traveler

---

## 📞 Need Help?

Common issues:
- **Can't login?** Make sure backend is running and database is seeded
- **Database errors?** Check if MongoDB service is running
- **Compilation errors?** Clear node_modules and reinstall
- **Port conflicts?** Change ports in .env files

---

**Enjoy your Eco-Tourism Platform! 🌿**
