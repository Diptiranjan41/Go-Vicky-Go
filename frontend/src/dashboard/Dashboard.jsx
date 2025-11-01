import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FaUser,
  FaPlane,
  FaSignOutAlt,
  FaChartBar,
  FaRupeeSign,
  FaCalendarCheck,
  FaMapMarkerAlt,
  FaSuitcaseRolling,
  FaHome,
  FaCog,
} from "react-icons/fa";

// Hardcoded exchange rates relative to INR. In a production app, this would be fetched from an API.
const exchangeRates = {
  INR: 1,
  USD: 0.012,
  EUR: 0.011,
  GBP: 0.0094,
  JPY: 1.94,
  AUD: 0.018
};

// Default trips data for new users
const defaultTrips = [
  { title: "Goa", date: "2025-07-10", cost: 15000, status: "upcoming" },
  { title: "Kashmir", date: "2025-08-15", cost: 25000, status: "upcoming" },
  { title: "Leh-Ladakh", date: "2025-09-20", cost: 30000, status: "upcoming" },
  { title: "Manali", date: "2024-12-15", cost: 12000, status: "completed" },
  { title: "Rishikesh", date: "2024-10-20", cost: 8000, status: "completed" }
];

const Dashboard = () => {
  const navigate = useNavigate();

  // State to manage user data and dynamic dashboard metrics
  const [user, setUser] = useState({ name: "Guest" });
  const [userTrips, setUserTrips] = useState([]);
  const [totalTrips, setTotalTrips] = useState(0);
  const [upcomingTrips, setUpcomingTrips] = useState(0);
  const [completedTrips, setCompletedTrips] = useState(0);
  const [totalSpent, setTotalSpent] = useState("0");
  const [uniqueDestinations, setUniqueDestinations] = useState(0);
  const [selectedCurrency, setSelectedCurrency] = useState("INR");
  const [isLoading, setIsLoading] = useState(true);

  // Effect to load user data and trips from localStorage on component mount
  useEffect(() => {
    const loadUserData = () => {
      try {
        setIsLoading(true);
        
        // Check if user is authenticated
        const authToken = localStorage.getItem("authToken");
        const currentUser = localStorage.getItem("currentUser");
        const userDetails = localStorage.getItem("userDetails");

        if (!authToken && !currentUser && !userDetails) {
          navigate("/signin");
          return;
        }

        // Try to get user data from different sources
        let userData = { name: "Traveler" };
        
        if (currentUser) {
          userData = JSON.parse(currentUser);
        } else if (userDetails) {
          userData = JSON.parse(userDetails);
        }

        setUser(userData);

        // Load trips data
        let tripsData = [];
        const savedTrips = localStorage.getItem("userTrips");
        
        if (savedTrips) {
          tripsData = JSON.parse(savedTrips);
        } else {
          // If no trips found, use default trips and save them
          tripsData = defaultTrips;
          localStorage.setItem("userTrips", JSON.stringify(tripsData));
        }

        setUserTrips(tripsData);

      } catch (error) {
        console.error("Error loading user data:", error);
        // Set default data on error
        setUserTrips(defaultTrips);
        localStorage.setItem("userTrips", JSON.stringify(defaultTrips));
      } finally {
        setIsLoading(false);
      }
    };

    loadUserData();
  }, [navigate]);

  // Effect to recalculate dashboard metrics whenever userTrips or selectedCurrency changes
  useEffect(() => {
    if (userTrips.length === 0) return;

    // 1. Calculate Total Trips
    setTotalTrips(userTrips.length);

    // 2. Calculate Upcoming Trips
    const now = new Date();
    const upcoming = userTrips.filter(trip => {
      const tripDate = new Date(trip.date);
      return tripDate > now && trip.status !== "completed";
    });
    setUpcomingTrips(upcoming.length);

    // 3. Calculate Completed Trips
    const completed = userTrips.filter(trip => trip.status === "completed");
    setCompletedTrips(completed.length);

    // 4. Calculate Total Spent and convert to the selected currency
    const spentInINR = userTrips.reduce((sum, trip) => {
      const cost = trip.cost || 0;
      return trip.status === "completed" ? sum + cost : sum;
    }, 0);
    
    const convertedSpent = spentInINR * (exchangeRates[selectedCurrency] || 1);

    // Format currency based on selected currency
    let formattedSpent;
    if (selectedCurrency === 'INR') {
      formattedSpent = `₹${convertedSpent.toLocaleString('en-IN')}`;
    } else if (selectedCurrency === 'USD') {
      formattedSpent = `$${convertedSpent.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
    } else if (selectedCurrency === 'EUR') {
      formattedSpent = `€${convertedSpent.toLocaleString('en-EU', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
    } else {
      formattedSpent = convertedSpent.toLocaleString('en-IN', {
        style: 'currency',
        currency: selectedCurrency,
        minimumFractionDigits: 0
      });
    }

    setTotalSpent(formattedSpent);

    // 5. Calculate Unique Destinations
    const destinations = new Set(userTrips.map(trip => trip.title));
    setUniqueDestinations(destinations.size);

  }, [userTrips, selectedCurrency]);

  const handleLogout = () => {
    // Clear all authentication data
    localStorage.removeItem("authToken");
    localStorage.removeItem("currentUser");
    
    // Update user status to logged out
    const userDetails = localStorage.getItem("userDetails");
    if (userDetails) {
      const userData = JSON.parse(userDetails);
      const updatedUser = { ...userData, isLoggedIn: false };
      localStorage.setItem("userDetails", JSON.stringify(updatedUser));
    }
    
    navigate("/signin");
  };

  const handleCurrencyChange = (e) => {
    setSelectedCurrency(e.target.value);
  };

  // Recent trips for quick view
  const recentTrips = userTrips
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 3);

  const dashboardCards = [
    { 
      title: "Total Trips", 
      value: totalTrips, 
      icon: <FaPlane className="text-3xl text-cyan-400" />,
      description: "All your planned adventures"
    },
    { 
      title: "Upcoming", 
      value: upcomingTrips, 
      icon: <FaCalendarCheck className="text-3xl text-cyan-400" />,
      description: "Trips waiting for you"
    },
    { 
      title: "Completed", 
      value: completedTrips, 
      icon: <FaChartBar className="text-3xl text-cyan-400" />,
      description: "Memories created"
    },
    { 
      title: "Total Spent", 
      value: totalSpent, 
      icon: <FaRupeeSign className="text-3xl text-cyan-400" />,
      description: `in ${selectedCurrency}`
    },
    { 
      title: "Destinations", 
      value: uniqueDestinations, 
      icon: <FaMapMarkerAlt className="text-3xl text-cyan-400" />,
      description: "Unique places visited"
    },
    { 
      title: "Packages", 
      value: "5", 
      icon: <FaSuitcaseRolling className="text-3xl text-cyan-400" />,
      description: "Available packages"
    },
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0a0a0a]">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-cyan-400 text-lg">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex bg-[#0a0a0a] text-white font-sans relative overflow-hidden">

      {/* Glow Effect Background Circles */}
      <div className="absolute top-[-100px] left-[-100px] w-[300px] h-[300px] bg-cyan-500 rounded-full blur-3xl opacity-20 animate-pulse z-0"></div>
      <div className="absolute bottom-[-150px] right-[-150px] w-[400px] h-[400px] bg-cyan-700 rounded-full blur-3xl opacity-20 animate-ping z-0"></div>
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-purple-700 rounded-full blur-3xl opacity-10 z-0"></div>

      {/* Sidebar */}
      <aside className="relative z-10 w-64 bg-gray-900/80 backdrop-blur-xl border-r border-cyan-700/50 shadow-2xl p-6 flex flex-col justify-between">
        <div>
          <h1 className="text-3xl font-extrabold mb-10 text-cyan-200 tracking-wide drop-shadow-md text-center">
            🌍 Go Vicky Go
          </h1>

          <nav className="flex flex-col gap-3">
            <Link
              to="/dashboard"
              className="flex items-center gap-3 px-4 py-3 rounded-xl bg-cyan-500/20 border border-cyan-500/30 text-cyan-300 hover:bg-cyan-500 hover:text-black shadow-inner transition-all duration-300"
            >
              <FaHome className="text-lg" />
              <span className="text-sm font-medium">Dashboard</span>
            </Link>

            <Link
              to="/profile"
              className="flex items-center gap-3 px-4 py-3 rounded-xl bg-gray-800/50 hover:bg-cyan-400 hover:text-black border border-gray-700 hover:border-cyan-400 shadow-inner transition-all duration-300"
            >
              <FaUser className="text-lg" />
              <span className="text-sm font-medium">Profile</span>
            </Link>

            <Link
              to="/my-trips"
              className="flex items-center gap-3 px-4 py-3 rounded-xl bg-gray-800/50 hover:bg-cyan-400 hover:text-black border border-gray-700 hover:border-cyan-400 shadow-inner transition-all duration-300"
            >
              <FaPlane className="text-lg" />
              <span className="text-sm font-medium">My Trips</span>
            </Link>

            <Link
              to="/statistics"
              className="flex items-center gap-3 px-4 py-3 rounded-xl bg-gray-800/50 hover:bg-cyan-400 hover:text-black border border-gray-700 hover:border-cyan-400 shadow-inner transition-all duration-300"
            >
              <FaChartBar className="text-lg" />
              <span className="text-sm font-medium">Statistics</span>
            </Link>

            <Link
              to="/settings"
              className="flex items-center gap-3 px-4 py-3 rounded-xl bg-gray-800/50 hover:bg-cyan-400 hover:text-black border border-gray-700 hover:border-cyan-400 shadow-inner transition-all duration-300"
            >
              <FaCog className="text-lg" />
              <span className="text-sm font-medium">Settings</span>
            </Link>
          </nav>
        </div>

        {/* User Info and Logout */}
        <div className="space-y-4">
          <div className="flex items-center gap-3 p-3 bg-gray-800/50 rounded-xl border border-gray-700">
            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 flex items-center justify-center text-white font-bold">
              {user.name ? user.name.charAt(0).toUpperCase() : "T"}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">{user.name || "Traveler"}</p>
              <p className="text-xs text-gray-400 truncate">{user.email || "Welcome!"}</p>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-3 px-4 py-3 rounded-xl bg-cyan-500 hover:bg-cyan-600 text-black transition-all duration-300 text-sm font-semibold shadow-lg hover:shadow-cyan-300/50 border border-cyan-400"
          >
            <FaSignOutAlt className="text-lg" /> 
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Dashboard Content */}
      <main className="relative z-10 flex-1 p-8 overflow-y-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-4xl font-extrabold mb-2 text-cyan-400 tracking-wide drop-shadow-lg">
                Welcome Back, {user.name || "Traveler"}! 👋
              </h2>
              <p className="text-cyan-200 text-lg">
                Here's your travel overview
              </p>
              <p className="text-gray-400 mt-2 text-sm">
                Track your travel stats, upcoming trips, and bookings all in one place.
              </p>
            </div>

            {/* Currency Converter */}
            <div className="flex items-center gap-3 bg-gray-900/80 backdrop-blur-sm border border-cyan-700/30 rounded-xl px-4 py-3">
              <label htmlFor="currency-select" className="text-cyan-200 text-sm font-medium whitespace-nowrap">
                Currency:
              </label>
              <select
                id="currency-select"
                value={selectedCurrency}
                onChange={handleCurrencyChange}
                className="rounded-lg bg-[#121212] border border-cyan-700 text-white p-2 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500 min-w-20"
              >
                {Object.keys(exchangeRates).map((currencyCode) => (
                  <option key={currencyCode} value={currencyCode}>
                    {currencyCode}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Dashboard Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {dashboardCards.map((card, index) => (
            <div
              key={index}
              className="bg-gray-900/80 backdrop-blur-xl border border-cyan-700/30 rounded-2xl p-6 shadow-2xl transform transition-all duration-300 hover:-translate-y-1 hover:shadow-cyan-500/20 hover:border-cyan-500/50 group"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-cyan-300 group-hover:text-cyan-400 transition-colors">
                  {card.title}
                </h3>
                <div className="transform group-hover:scale-110 transition-transform duration-300">
                  {card.icon}
                </div>
              </div>
              <p className="text-3xl font-extrabold text-white mb-2">{card.value}</p>
              <p className="text-sm text-gray-400">{card.description}</p>
            </div>
          ))}
        </div>

        {/* Recent Trips Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Trips */}
          <div className="bg-gray-900/80 backdrop-blur-xl border border-cyan-700/30 rounded-2xl p-6">
            <h3 className="text-xl font-semibold text-cyan-300 mb-4 flex items-center gap-2">
              <FaPlane className="text-cyan-400" />
              Recent Trips
            </h3>
            <div className="space-y-4">
              {recentTrips.length > 0 ? (
                recentTrips.map((trip, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-4 bg-gray-800/50 rounded-xl border border-gray-700 hover:border-cyan-500/50 transition-all duration-300"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-cyan-500/20 flex items-center justify-center">
                        <FaMapMarkerAlt className="text-cyan-400" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-white">{trip.title}</h4>
                        <p className="text-sm text-gray-400">
                          {new Date(trip.date).toLocaleDateString('en-US', { 
                            year: 'numeric', 
                            month: 'short', 
                            day: 'numeric' 
                          })}
                        </p>
                      </div>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      trip.status === 'completed' 
                        ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                        : 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30'
                    }`}>
                      {trip.status}
                    </span>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-gray-400">
                  <FaPlane className="text-4xl mx-auto mb-3 opacity-50" />
                  <p>No trips planned yet</p>
                  <button 
                    onClick={() => navigate("/my-trips")}
                    className="mt-3 text-cyan-400 hover:text-cyan-300 text-sm"
                  >
                    Plan your first trip →
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Quick Stats */}
          <div className="bg-gray-900/80 backdrop-blur-xl border border-cyan-700/30 rounded-2xl p-6">
            <h3 className="text-xl font-semibold text-cyan-300 mb-4 flex items-center gap-2">
              <FaChartBar className="text-cyan-400" />
              Quick Stats
            </h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center p-3 bg-gray-800/50 rounded-lg">
                <span className="text-gray-400">Travel Score</span>
                <span className="text-cyan-400 font-bold">85%</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-gray-800/50 rounded-lg">
                <span className="text-gray-400">Favorite Destination</span>
                <span className="text-cyan-400 font-bold">{user.favoriteDestination || "Not set"}</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-gray-800/50 rounded-lg">
                <span className="text-gray-400">Travel Type</span>
                <span className="text-cyan-400 font-bold">{user.travelType || "Not set"}</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-gray-800/50 rounded-lg">
                <span className="text-gray-400">Member Since</span>
                <span className="text-cyan-400 font-bold">2024</span>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;