# Eco-Tourism Cloud Platform (ETCP)

An innovative cloud-based platform designed to revolutionize the way eco-conscious travelers discover, plan, and engage with eco-tourism experiences worldwide.

## Features

### 🔍 Eco-Discovery Hub
- Community-driven feature for eco-tourism providers
- Dynamic search and discovery tool
- Filter by location, activity type, sustainability rating
- Book experiences and subscribe to eco-passes

### 🗺️ Eco-Journeys
- Personalized dashboard for managing bookings and subscriptions
- View and sort experiences by date, location, sustainability rating
- Wishlist functionality and experience sharing
- "Discover Similar" recommendations

### 🌍 ETCP Voyager
- Interactive map and itinerary planner
- Visual map interface with booked and potential experiences
- Route planning and sustainability impact estimation
- Integration with Eco-Discovery Hub

### ⚙️ Settings & Personalization
- Visual themes inspired by different ecosystems
- Language preferences and accessibility options
- Notification and privacy settings
- Payment and subscription management

## Tech Stack

- **Frontend**: React 18, React Router, Leaflet Maps
- **Backend**: Node.js, Express, MongoDB
- **Styling**: CSS3 with custom themes
- **Security**: Helmet, CORS, Rate limiting

## Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd etcp
   ```

2. **Install Backend Dependencies**
   ```bash
   cd backend
   npm install
   ```

3. **Install Frontend Dependencies**
   ```bash
   cd ../frontend
   npm install
   ```

### Running the Application

1. **Start the Backend Server**
   ```bash
   cd backend
   npm start
   # or for development with auto-reload
   npm run dev
   ```
   The backend server will run on http://localhost:5000

2. **Start the Frontend Application**
   ```bash
   cd frontend
   npm start
   ```
   The frontend will run on http://localhost:3000

### Building for Production

```bash
# Build frontend
cd frontend
npm run build

# The build files will be in the build/ directory
```

## Project Structure

```
etcp/
├── backend/
│   ├── server.js          # Express server setup
│   ├── package.json       # Backend dependencies
│   └── .env              # Environment variables
├── frontend/
│   ├── public/
│   │   └── index.html     # HTML template
│   ├── src/
│   │   ├── components/    # React components
│   │   │   ├── EcoDiscoveryHub.js
│   │   │   ├── EcoJourneys.js
│   │   │   ├── EtcpVoyager.js
│   │   │   ├── Settings.js
│   │   │   └── components.css
│   │   ├── App.js         # Main App component
│   │   ├── App.css        # App styles
│   │   ├── index.js       # React entry point
│   │   └── index.css      # Global styles
│   └── package.json       # Frontend dependencies
└── README.md
```

## API Endpoints

### Experiences
- `GET /api/experiences` - Get all experiences
- `GET /api/experiences/:id` - Get experience by ID

### Bookings
- `GET /api/bookings` - Get user bookings
- `POST /api/bookings` - Create new booking

### Users
- `GET /api/users/profile` - Get user profile

### Providers
- `GET /api/providers` - Get all providers

## Environment Variables

Create a `.env` file in the backend directory:

```env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/etcp
JWT_SECRET=your-secret-key-here
JWT_EXPIRES_IN=7d
```

## Features in Development

- [ ] Authentication system
- [ ] Database integration
- [ ] Payment processing
- [ ] Real-time notifications
- [ ] Mobile app
- [ ] Advanced analytics

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Contact

Project developed by a visionary start-up in Sri Lanka, committed to sustainable tourism and environmental conservation.

---

**Made with 🌿 for sustainable travel**