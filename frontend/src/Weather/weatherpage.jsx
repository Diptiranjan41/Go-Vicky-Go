import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  MapPin,
  Umbrella,
  Shirt,
  Snowflake,
  Loader2,
  AlertTriangle,
  Search,
  Compass,
  Sunrise,
  Sunset,
  Wind,
  Sun,
  CloudSun,
  CloudRain,
  CloudSnow,
  Thermometer,
} from "lucide-react";

// The main App component for our weather application.
const App = () => {
  // State variables to hold application data.
  const [city, setCity] = useState("");
  const [currentWeather, setCurrentWeather] = useState(null);
  const [hourlyForecast, setHourlyForecast] = useState([]);
  const [fiveDayForecast, setFiveDayForecast] = useState([]);
  const [packingSuggestions, setPackingSuggestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // API key provided by the user.
  const API_KEY = "3ecf410aad27fd90d71cc261c221967e";

  // Helper function to get the current date and time.
  const getFormattedDate = (timestamp) => {
    return new Date(timestamp * 1000).toLocaleDateString("en-US", { weekday: 'long', month: 'long', day: 'numeric' });
  };

  // Helper function to get the hour from a timestamp.
  const getHour = (timestamp) => {
    return new Date(timestamp * 1000).toLocaleTimeString("en-US", { hour: 'numeric' });
  };

  // Helper function to convert a date string to a day of the week.
  const getDayName = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", { weekday: "long" });
  };

  // Helper function to get a formatted time from a Unix timestamp.
  const getFormattedTime = (timestamp) => {
    return new Date(timestamp * 1000).toLocaleTimeString("en-US", { hour: 'numeric', minute: '2-digit' });
  };

  // Helper function to group the forecast data by day.
  const groupForecastByDay = (list) => {
    const dailyForecast = {};
    list.forEach((item) => {
      const date = item.dt_txt.split(" ")[0];
      if (!dailyForecast[date]) {
        dailyForecast[date] = {
          day: getDayName(date),
          temps: [],
          weather: item.weather[0].main,
          icon: item.weather[0].icon,
        };
      }
      dailyForecast[date].temps.push(item.main.temp);
    });

    // We take only the next 5 days of forecast.
    const groupedData = Object.values(dailyForecast).slice(0, 5);
    return groupedData.map((day) => ({
      ...day,
      minTemp: Math.min(...day.temps),
      maxTemp: Math.max(...day.temps),
    }));
  };

  // Function to determine packing suggestions based on weather and forecast.
  const getPackingSuggestions = (current, dailyForecast) => {
    const suggestions = new Set();
    const allWeather = [current.weather[0].main, ...dailyForecast.map(d => d.weather)];
    const temps = [current.main.temp, ...dailyForecast.flatMap(d => d.temps)];
    const maxTemp = Math.max(...temps);
    const minTemp = Math.min(...temps);

    // Rain and moisture suggestions
    if (allWeather.some(w => w.toLowerCase().includes("rain") || w.toLowerCase().includes("drizzle"))) {
      suggestions.add("Pack a waterproof jacket or umbrella");
      suggestions.add("Waterproof footwear");
    }

    // Snow and extreme cold suggestions
    if (allWeather.some(w => w.toLowerCase().includes("snow") || w.toLowerCase().includes("sleet"))) {
      suggestions.add("Bring a heavy coat, gloves, and a hat");
      suggestions.add("Thermal clothing and layers");
    }

    // Hot weather suggestions
    if (maxTemp > 30) {
      suggestions.add("Wear light and breathable clothing");
      suggestions.add("Don't forget sunscreen, sunglasses, and a hat");
    } else if (maxTemp > 25) {
      suggestions.add("Don't forget sunscreen and light clothing");
    }

    // Cold weather suggestions
    if (minTemp < 10) {
      suggestions.add("A warm sweater or jacket will be useful");
    }
    if (minTemp < 0) {
      suggestions.add("Consider thermals and a warm scarf");
    }

    // Windy weather suggestion
    if (current.wind.speed > 10) {
      suggestions.add("A windbreaker jacket is recommended");
    }

    return Array.from(suggestions);
  };

  // Main function to fetch weather data from the OpenWeatherMap API.
  const fetchWeatherData = async (query) => {
    setLoading(true);
    setError("");
    try {
      if (!API_KEY) {
        throw new Error("API key is not set.");
      }

      const weatherRes = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?q=${query}&appid=${API_KEY}&units=metric`
      );
      const forecastRes = await axios.get(
        `https://api.openweathermap.org/data/2.5/forecast?q=${query}&appid=${API_KEY}&units=metric`
      );

      // Set the weather and forecast data in state.
      setCurrentWeather(weatherRes.data);
      setHourlyForecast(forecastRes.data.list.slice(0, 8)); // First 8 entries for 24-hour forecast
      const groupedForecast = groupForecastByDay(forecastRes.data.list);
      setFiveDayForecast(groupedForecast);
      setPackingSuggestions(getPackingSuggestions(weatherRes.data, groupedForecast));

      setLoading(false);
    } catch (err) {
      setLoading(false);
      setCurrentWeather(null);
      setHourlyForecast([]);
      setFiveDayForecast([]);
      setPackingSuggestions([]);
      if (err.message === "API key is not set.") {
        setError("🔒 Please provide a valid API key in the code.");
      } else if (err.response?.status === 404) {
        setError("❌ City not found. Please check your spelling.");
      } else if (err.response?.status === 401) {
        setError("🔒 Invalid API key. Please check your key.");
      } else {
        setError("⚠️ Something went wrong. Please try again later.");
      }
    }
  };

  // Effect hook to get the user's location on component mount.
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          // Fetch weather based on coordinates.
          fetchWeatherData(`lat=${latitude}&lon=${longitude}`);
        },
        () => {
          // If geolocation fails, default to a major city.
          fetchWeatherData("New York");
        }
      );
    } else {
      // If geolocation is not supported, default to a major city.
      fetchWeatherData("New York");
    }
  }, []);

  // Handle form submission for a new city search.
  const handleSearch = (e) => {
    e.preventDefault();
    if (city.trim()) {
      fetchWeatherData(city);
    } else {
      setError("❗ Please enter a city name.");
    }
  };

  return (
    <div className={`min-h-screen bg-gradient-to-b from-black via-black to-[#083344] text-white font-sans flex flex-col`}>
      {/* Navbar with embedded search bar */}
      <nav className="bg-black bg-opacity-80 px-6 py-4 flex flex-col md:flex-row items-center justify-between">
        <div className="text-cyan-400 text-xl font-bold select-none mb-4 md:mb-0">GoVickyGo</div>
        <form onSubmit={handleSearch} className="relative w-full md:w-auto md:max-w-xs">
          <input
            type="text"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            placeholder="Enter city name..."
            className="w-full py-2 px-4 rounded-full bg-slate-900 border-2 border-cyan-500 focus:outline-none focus:border-cyan-400 text-cyan-200 placeholder-cyan-600 pr-12"
          />
          <button type="submit" className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-full bg-cyan-600 hover:bg-cyan-500 transition-colors">
            <Search className="h-5 w-5 text-white" />
          </button>
        </form>
      </nav>

      {/* Main Content */}
      <main className="flex-grow container mx-auto px-4 md:px-8 max-w-2xl flex flex-col justify-center">
        {/* Conditional rendering for loading, error, and weather data */}
        {loading && (
          <div className="flex flex-col items-center justify-center h-64 text-cyan-300">
            <Loader2 className="animate-spin mb-2" size={32} />
            <p className="text-xl">Fetching weather data...</p>
          </div>
        )}

        {error && (
          <div className="flex flex-col items-center justify-center h-64 text-red-400 text-lg text-center">
            <AlertTriangle className="mb-2" />
            <p>{error}</p>
          </div>
        )}

        {currentWeather && (
          <>
            {/* Current Weather Card */}
            <div className="bg-slate-900 p-6 rounded-3xl shadow-2xl backdrop-blur-sm bg-opacity-70 border-2 border-cyan-800">
              <div className="text-center mb-6">
                <h2 className="text-4xl font-bold text-cyan-200 flex flex-col sm:flex-row items-center justify-center">
                  <MapPin className="mr-2 h-8 w-8" /> {currentWeather.name}, {currentWeather.sys.country}
                </h2>
                <p className="text-cyan-400">
                  {getFormattedDate(currentWeather.dt)}
                </p>
              </div>

              <div className="flex flex-col items-center mb-8">
                <img
                  src={`https://openweathermap.org/img/wn/${currentWeather.weather[0].icon}@4x.png`}
                  alt={currentWeather.weather[0].description}
                  className="w-32 h-32 mb-2"
                />
                <h1 className="text-5xl sm:text-7xl font-light text-cyan-100">{Math.round(currentWeather.main.temp)}°C</h1>
                <p className="text-lg sm:text-xl font-semibold text-cyan-400 capitalize">{currentWeather.weather[0].description}</p>
              </div>

              <div className="grid grid-cols-2 gap-4 text-center text-cyan-300">
                <div className="bg-black/30 p-4 rounded-xl border border-cyan-900">
                  <p className="text-base sm:text-lg">Humidity</p>
                  <p className="text-xl sm:text-2xl font-bold">{currentWeather.main.humidity}%</p>
                </div>
                <div className="bg-black/30 p-4 rounded-xl border border-cyan-900">
                  <p className="text-base sm:text-lg">Wind Speed</p>
                  <p className="text-xl sm:text-2xl font-bold">{currentWeather.wind.speed} m/s</p>
                </div>
                <div className="bg-black/30 p-4 rounded-xl border border-cyan-900">
                  <p className="text-base sm:text-lg">Feels Like</p>
                  <p className="text-xl sm:text-2xl font-bold">{Math.round(currentWeather.main.feels_like)}°C</p>
                </div>
                <div className="bg-black/30 p-4 rounded-xl border border-cyan-900">
                  <p className="text-base sm:text-lg">Cloudiness</p>
                  <p className="text-xl sm:text-2xl font-bold">{currentWeather.clouds.all}%</p>
                </div>
                {/* Sunrise and Sunset times */}
                <div className="bg-black/30 p-4 rounded-xl border border-cyan-900">
                  <p className="text-base sm:text-lg flex items-center justify-center"><Sunrise className="mr-2 h-4 w-4 sm:h-5 sm:w-5" /> Sunrise</p>
                  <p className="text-xl sm:text-2xl font-bold">{getFormattedTime(currentWeather.sys.sunrise)}</p>
                </div>
                <div className="bg-black/30 p-4 rounded-xl border border-cyan-900">
                  <p className="text-base sm:text-lg flex items-center justify-center"><Sunset className="mr-2 h-4 w-4 sm:h-5 sm:w-5" /> Sunset</p>
                  <p className="text-xl sm:text-2xl font-bold">{getFormattedTime(currentWeather.sys.sunset)}</p>
                </div>
              </div>
            </div>

            {/* 24-Hour Forecast */}
            <div className="mt-8">
              <h3 className="text-xl font-bold text-cyan-300 mb-4 text-center flex items-center justify-center">
                <Compass className="mr-2" /> 24-Hour Forecast
              </h3>
              <div className="flex overflow-x-auto gap-4 py-2 scroll-smooth scrollbar-thin scrollbar-thumb-cyan-500 scrollbar-track-transparent">
                {hourlyForecast.map((hour, index) => (
                  <div
                    key={index}
                    className="flex-shrink-0 w-32 bg-slate-900 p-4 rounded-3xl shadow-xl text-center transition-all hover:shadow-2xl hover:scale-105 backdrop-blur-sm bg-opacity-70 border-2 border-cyan-800"
                  >
                    <p className="text-lg font-semibold text-cyan-400 mb-2">
                      {getHour(hour.dt)}
                    </p>
                    <img
                      src={`https://openweathermap.org/img/wn/${hour.weather[0].icon}@2x.png`}
                      alt={hour.weather[0].description}
                      className="w-16 h-16 mx-auto"
                    />
                    <p className="text-2xl font-bold text-cyan-100">
                      {Math.round(hour.main.temp)}°C
                    </p>
                    <p className="text-md capitalize text-gray-400">
                      {hour.weather[0].main}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Packing Suggestions */}
            {packingSuggestions.length > 0 && (
              <div className="mt-8 bg-slate-900 p-6 rounded-3xl shadow-xl backdrop-blur-sm bg-opacity-70 border-2 border-cyan-800">
                <h3 className="text-xl font-bold text-cyan-200 mb-4 text-center">
                  🎒 What to Pack
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {packingSuggestions.map((suggestion, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-center bg-black/30 p-4 rounded-xl text-sm transition-all hover:scale-105 border border-cyan-900"
                    >
                      {suggestion.includes("umbrella") && <Umbrella className="mr-2 text-gray-500" />}
                      {suggestion.includes("coat") && <Snowflake className="mr-2 text-cyan-400" />}
                      {suggestion.includes("clothing") && <Shirt className="mr-2 text-yellow-400" />}
                      {suggestion.includes("thermals") && <Thermometer className="mr-2 text-cyan-300" />}
                      {suggestion.includes("sunscreen") && <Sun className="mr-2 text-yellow-500" />}
                      {suggestion.includes("windbreaker") && <Wind className="mr-2 text-gray-500" />}
                      <span>{suggestion}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 5-Day Forecast */}
            <div className="mt-8">
              <h3 className="text-xl font-bold text-cyan-300 mb-4 text-center">
                🗓️ 5-Day Forecast
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                {fiveDayForecast.map((day, index) => (
                  <div
                    key={index}
                    className="bg-slate-900 p-4 rounded-3xl shadow-xl text-center transition-all hover:shadow-2xl hover:scale-105 backdrop-blur-sm bg-opacity-70 border-2 border-cyan-800"
                  >
                    <p className="text-lg font-semibold text-cyan-400 mb-2">
                      {day.day}
                    </p>
                    <img
                      src={`https://openweathermap.org/img/wn/${day.icon}@2x.png`}
                      alt={day.weather}
                      className="w-16 h-16 mx-auto"
                    />
                    <p className="text-2xl font-bold text-cyan-100">
                      {Math.round(day.maxTemp)}°C
                    </p>
                    <p className="text-lg text-cyan-300">
                      {Math.round(day.minTemp)}°C
                    </p>
                    <p className="text-md capitalize text-gray-400">
                      {day.weather}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-black bg-opacity-80 py-4 text-center text-cyan-500 text-sm select-none">
        &copy; 2025 GoVickyGo Weather App. All rights reserved.
      </footer>
    </div>
  );
};

export default App;
