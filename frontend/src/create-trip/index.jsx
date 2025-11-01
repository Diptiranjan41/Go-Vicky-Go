import React, { useState, useEffect } from "react";

// Inline SVG icons to replace react-icons library.
const CashIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
    </svg>
);
const CreditCardIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
    </svg>
);
const StarIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.539 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.784.57-1.838-.196-1.539-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.783-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
    </svg>
);
const UserIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
    </svg>
);
const HeartIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
    </svg>
);
const UsersIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h-2v-2a4 4 0 00-4-4H9a4 4 0 00-4 4v2H3m14 0h3v-3a2 2 0 00-2-2h-3v3zM5 20h3v-3a2 2 0 00-2-2H2v3a2 2 0 002 2zM15 9a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
);
const UserGroupIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h2a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v11a2 2 0 002 2h2v-2.586a1 1 0 01.293-.707l1.414-1.414a1 1 0 01.707-.293H12a1 1 0 01.707.293l1.414 1.414a1 1 0 01.293.707V20z" />
    </svg>
);
const BookOpenIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m5 0h8m-11 0h-2V5a2 2 0 012-2h12a2 2 0 012 2v16m-9-2h5a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
    </svg>
);
const FireIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 18.657A8 8 0 016.343 7.343S7 9 7 9c1.077 3.045 3.195 5.21 5.485 5.485C15 14.5 17 13 17 13l2-1.5s-1.5 1.5-1.5 2zM12 21a9 9 0 008.364-12.875L12 21z" />
    </svg>
);
const GlobeIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 5h12M9 3v2m0 20h10M17 19v2m0-10h4M17 9v2m-14 0H9m-6 4h10m-3-4v4m0 0a3 3 0 01-3 3H3" />
    </svg>
);
const HotelIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m5 0h8m-11 0h2V5a2 2 0 012-2h6a2 2 0 012 2v16m-9-2h5a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
    </svg>
);
const BusIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 13v-2a1 1 0 011-1h16a1 1 0 011 1v2M7 7h10M7 7v2M17 7v2M7 20h.01M17 20h.01" />
    </svg>
);
const TrainIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 2l7 7v6a3 3 0 01-3 3H8a3 3 0 01-3-3V9l7-7zM7 22l1-2h8l1 2" />
    </svg>
);
const UtensilsIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 11.5c-2.485-2.616-6.686-2.274-9.3 0-2.616 2.485-2.274 6.686 0 9.3 2.616-2.485 2.274-6.686 0-9.3z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 2.5a.5.5 0 00-1 0v1a.5.5 0 001 0V2.5zM12 21.5a.5.5 0 00-1 0v1a.5.5 0 001 0v-1zM2.5 12a.5.5 0 000 1h1a.5.5 0 000-1h-1zM21.5 12a.5.5 0 000 1h1a.5.5 0 000-1h-1zM4.686 4.686a.5.5 0 00-.707.707l.707.707a.5.5 0 00.707-.707l-.707-.707zM18.686 18.686a.5.5 0 00-.707.707l.707.707a.5.5 0 00.707-.707l-.707-.707z" />
    </svg>
);
const LandmarkIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 10l-3-3-3 3M12 13v7" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 13a3 3 0 100-6 3 3 0 000 6z" />
    </svg>
);
const PlaneIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M14 6L6 14v4a2 2 0 002 2h4l8-8-8-8z" />
    </svg>
);
const SubwayIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
    </svg>
);

// New icons for market, mall, museum, temple, beach
const MarketIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 9l9-6 9 6M4 10v8a2 2 0 002 2h12a2 2 0 002-2v-8" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 22V12h6v10" />
  </svg>
);
const MallIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 11h18v8a2 2 0 01-2 2H5a2 2 0 01-2-2v-8z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M7 11V7a5 5 0 0110 0v4" />
  </svg>
);
const MuseumIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 11l9-6 9 6M21 11v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M8 11v5M12 11v5M16 11v5" />
  </svg>
);
const TempleIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 2l9 7H3l9-7zM4 10h16v8H4v-8z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 18v2m6-2v2" />
  </svg>
);
const BeachIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M2 20s4-4 10-4 10 4 10 4" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M7 8a5 5 0 0110 0" />
  </svg>
);

/**
 * All the API logic and schemas have been moved into this single file
 * to resolve the "Failed to resolve import" error.
 */

// Define the API key
const apiKey = "AIzaSyDmwvpCyqnoFGZLAlMLjt8mMXHx1MLMiJQ"; 

// JSDoc type definitions to provide type information
/**
 * @typedef {Object} Place
 * @property {string} name - The name of the place or landmark.
 * @property {string} description - A brief, engaging description of the place.
 * @property {string} priceRange - An estimated price range, e.g., '$', '$$', '$$$', or 'Free'.
 * @property {string} location - The specific address or location of the place for mapping.
 */

/**
 * @typedef {Object} ItineraryActivity
 * @property {string} time - Suggested time for the activity (e.g., "9:00 AM", "Afternoon", "Evening").
 * @property {string} description - A detailed, engaging description of the activity or place to visit.
 * @property {'Food'|'Culture'|'Adventure'|'Relaxation'|'Shopping'|'Travel'|'Other'} category - A category for the activity.
 */

/**
 * @typedef {Object} ItineraryDay
 * @property {number} day - The day number, starting from 1.
 * @property {string} title - A short, catchy title for the day's plan.
 * @property {ItineraryActivity[]} activities - A list of activities for the day.
 */

/**
 * @typedef {Object} Itinerary
 * @property {string} tripTitle - A creative and fitting title for the entire trip.
 * @property {number} estimatedTotalCost - The estimated total cost for the entire trip in USD.
 * @property {ItineraryDay[]} itinerary - The day-by-day itinerary.
 */

/**
 * Defines the JSON schema for a single Place object.
 * This is used to guide the Gemini API to return structured data.
 */
const placeSchema = {
    type: "ARRAY",
    items: {
        type: "OBJECT",
        properties: {
            "name": { "type": "STRING" },
            "description": { "type": "STRING" },
            "priceRange": { "type": "STRING" },
            "location": { "type": "STRING" }
        },
        required: ["name", "description", "priceRange", "location"]
    }
};

/**
 * Defines the JSON schema for a full Itinerary object.
 * This is used to guide the Gemini API to return structured data.
 */
const itinerarySchema = {
    type: "OBJECT",
    properties: {
        "tripTitle": { "type": "STRING" },
        "estimatedTotalCost": { "type": "NUMBER" },
        "itinerary": {
            "type": "ARRAY",
            "items": {
                "type": "OBJECT",
                "properties": {
                    "day": { "type": "NUMBER" },
                    "title": { "type": "STRING" },
                    "activities": {
                        "type": "ARRAY",
                        "items": {
                            "type": "OBJECT",
                            "properties": {
                                "time": { "type": "STRING" },
                                "description": { "type": "STRING" },
                                "category": { "type": "STRING", "enum": ["Food", "Culture", "Adventure", "Relaxation", "Shopping", "Travel", "Other"] }
                            },
                            "required": ["time", "description", "category"]
                        }
                    }
                },
                "required": ["day", "title", "activities"]
            }
        }
    },
    required: ["tripTitle", "estimatedTotalCost", "itinerary"]
};


/**
 * Implements exponential backoff for API calls.
 * @param {Function} apiCall - The function to execute.
 * @param {number} retries - The number of retries.
 * @param {number} delay - The initial delay in milliseconds.
 */
const withExponentialBackoff = async (apiCall, retries = 5, delay = 1000) => {
    for (let i = 0; i < retries; i++) {
      try {
        const result = await apiCall();
        // Only return if the result is valid and not an empty object
        if (result) {
          return result;
        }
      } catch (error) {
        if (i < retries - 1) {
          console.warn(`API call failed. Retrying in ${delay}ms...`, error.message);
          await new Promise(resolve => setTimeout(resolve, delay));
          delay *= 2; // Exponential increase
        } else {
          throw error;
        }
      }
    }
};


/**
 * Calls the Gemini API to generate a detailed travel itinerary based on user preferences.
 * @param {string} fromDestination - The starting city for the trip.
 * @param {string} destination - The final travel destination.
 * @param {string} duration - The number of days for the trip.
 * @param {string} interests - A comma-separated list of interests.
 * @param {string} travelWith - The type of travel companion(s).
 * @param {string} budget - The budget level (e.g., "Cheap", "Moderate", "Luxury").
 * @returns {Promise<Object>} - The generated itinerary as a JavaScript object.
 */
const generateItinerary = async (fromDestination, destination, duration, interests, travelWith, budget) => {
    const prompt = `Create a detailed and engaging travel itinerary for a trip from ${fromDestination} to ${destination} for ${duration} days. 
    The traveler(s) will be a ${travelWith} with a ${budget} budget. Their primary interests include ${interests}.
    The response must be in JSON format matching the itinerarySchema.
    Be creative with the daily titles and activity descriptions.
    The estimated total cost should be a reasonable number in USD for the entire trip, excluding flights.`;

    const payload = {
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
            responseMimeType: "application/json",
            responseSchema: itinerarySchema,
        },
    };

    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent?key=${apiKey}`;

    return withExponentialBackoff(async () => {
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
          throw new Error(`API call failed with status: ${response.status}`);
        }

        const result = await response.json();
        
        // Ensure the response structure is as expected before parsing
        if (result.candidates && result.candidates.length > 0 && result.candidates[0].content && result.candidates[0].content.parts) {
            const jsonText = result.candidates[0].content.parts[0].text;
            return JSON.parse(jsonText);
        } else {
            console.error("Unexpected API response structure:", result);
            throw new Error("Failed to parse API response.");
        }
    });
};


/**
 * Calls the Gemini API to find nearby places based on a query.
 * @param {string} query - The search query (e.g., "Hotels in Paris").
 * @returns {Promise<Array>} - A list of places as a JavaScript array.
 */
const findNearbyPlaces = async (query) => {
    const prompt = `Find a list of 6 popular and well-rated places related to "${query}". 
    The response must be a JSON array of objects, with each object matching the placeSchema.
    Provide creative descriptions, a price range ('Free', '$', '$$', '$$$'), and a specific location for each place.`;

    const payload = {
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
            responseMimeType: "application/json",
            responseSchema: placeSchema,
        },
    };

    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent?key=${apiKey}`;

    return withExponentialBackoff(async () => {
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });
        
        if (!response.ok) {
          throw new Error(`API call failed with status: ${response.status}`);
        }

        const result = await response.json();
        
        // Ensure the response structure is as expected before parsing
        if (result.candidates && result.candidates.length > 0 && result.candidates[0].content && result.candidates[0].content.parts) {
            const jsonText = result.candidates[0].content.parts[0].text;
            return JSON.parse(jsonText);
        } else {
            console.error("Unexpected API response structure:", result);
            throw new Error("Failed to parse API response.");
        }
    });
};


// The rest of your React components as they were.

// Budget options
const budgetOptions = [
    { label: "Cheap", icon: <CashIcon />, description: "Stay conscious of costs" },
    { label: "Moderate", icon: <CreditCardIcon />, description: "Balanced and affordable" },
    { label: "Luxury", icon: <StarIcon />, description: "No worries on cost" },
];

// Travel with options
const travelWithOptions = [
    { label: "Just Me", icon: <UserIcon />, description: "Solo and independent" },
    { label: "A Couple", icon: <HeartIcon />, description: "Romantic and shared moments" },
    { label: "Family", icon: <UsersIcon />, description: "Bonding with family" },
    { label: "Friends", icon: <UserGroupIcon />, description: "Fun-packed group trip" },
];

// Interests options
const interestsOptions = [
    { label: "History", icon: <BookOpenIcon />, description: "Explore historical sites" },
    { label: "Food", icon: <FireIcon />, description: "Experience local cuisine" },
    { label: "Local Culture", icon: <GlobeIcon />, description: "Immerse in local life" },
];

const ExplorePage = ({ destination, onBack }) => {
    // State to handle the destination specifically for the explore page
    const [exploreDestination, setExploreDestination] = useState(destination);
    const [loading, setLoading] = useState(false);
    const [exploreResults, setExploreResults] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState("Bus Stops");

    // Updated categories per user request:
    const searchCategories = [
        "Bus Stops",
        "Local Market",
        "Mall",
        "Restaurants",
        "Hotels",
        "Railway Platform",
        "Metro",
        "Flights",
        "Historical Places",
        "Museum",
        "Temple",
        "Sea Beach"
    ];

    // A mapping of categories to their corresponding icons (updated/more categories)
    const categoryIcons = {
        "Hotels": <HotelIcon />,
        "Restaurants": <UtensilsIcon />,
        "Historical Places": <LandmarkIcon />,
        "Bus Stops": <BusIcon />,
        "Railway Platform": <TrainIcon />,
        "Metro": <SubwayIcon />,
        "Flights": <PlaneIcon />,
        "Local Market": <MarketIcon />,
        "Mall": <MallIcon />,
        "Museum": <MuseumIcon />,
        "Temple": <TempleIcon />,
        "Sea Beach": <BeachIcon />
    };

    // Effect to trigger a new search when the exploreDestination changes or category changes
    useEffect(() => {
        if (exploreDestination) {
            handleCategoryClick(selectedCategory);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [exploreDestination, selectedCategory]);

    const handleCategoryClick = async (category) => {
        if (!exploreDestination) return;
        setLoading(true);
        setSelectedCategory(category);
        setExploreResults([]);

        // Use a friendly query text that reflects user's chosen category
        const query = `${category} near ${exploreDestination}`;
        try {
            const results = await findNearbyPlaces(query);
            setExploreResults(results);
        } catch (error) {
            console.error(error.message);
            setExploreResults([]);
        } finally {
            setLoading(false);
        }
    };

    const handlePlaceClick = (location) => {
        // Construct the Google Maps URL and open in a new tab
        const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(location)}`;
        window.open(mapsUrl, '_blank');
    };

    return (
        <div className="mt-10 p-6 bg-[#0f172a] rounded-xl border border-cyan-400/10 text-white">
            <div className="flex justify-between items-center mb-4 flex-wrap gap-4">
                <h3 className="text-2xl font-bold">Explore {exploreDestination}</h3>
                <button onClick={onBack} className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-xl">
                    Back to Planner
                </button>
            </div>

            {/* New destination input for the explore page */}
            <div className="mb-6">
                <label className="block mb-2 text-lg text-white">Enter a new destination to explore:</label>
                <input
                    type="text"
                    value={exploreDestination}
                    onChange={(e) => setExploreDestination(e.target.value)}
                    placeholder="City, beach, market, station..."
                    className="w-full bg-[#111827] text-white placeholder-cyan-300 px-4 py-3 rounded-xl border border-cyan-400/20 focus:outline-none focus:ring-2 focus:ring-cyan-400"
                />
            </div>

            <div className="flex flex-wrap gap-4 mb-6">
                {searchCategories.map((category) => (
                    <button
                        key={category}
                        onClick={() => handleCategoryClick(category)}
                        className={`px-4 py-2 rounded-full font-semibold transition-colors ${
                            selectedCategory === category
                                ? "bg-cyan-400 text-black"
                                : "bg-gray-700 text-white hover:bg-gray-600"
                        }`}
                    >
                        {category}
                    </button>
                ))}
            </div>

            {loading ? (
                <div className="text-center text-lg mt-8">Loading places...</div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
                    {exploreResults.length > 0 ? (
                        exploreResults.map((place, index) => (
                            <div
                                key={index}
                                onClick={() => handlePlaceClick(place.location)}
                                className="p-4 rounded-lg bg-[#111827] flex items-center space-x-4 cursor-pointer hover:bg-[#1a2333] transition-colors"
                            >
                                <div className="text-3xl text-cyan-300">
                                    {/* Use the icon from the new mapping */} 
                                    {categoryIcons[selectedCategory] || <HotelIcon />}
                                </div>
                                <div>
                                    <p className="font-semibold text-lg">{place.name}</p>
                                    <p className="text-sm text-gray-400">Price: {place.priceRange}</p>
                                    <p className="text-xs text-gray-500">{place.description}</p>
                                    <p className="text-xs text-gray-500">{place.location}</p>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="col-span-3 text-center text-lg text-gray-400">No places found for this category.</div>
                    )}
                </div>
            )}
        </div>
    );
};

const TravelPreferences = () => {
    const [selectedBudget, setSelectedBudget] = useState("");
    const [selectedTravelWith, setSelectedTravelWith] = useState("");
    const [selectedInterests, setSelectedInterests] = useState([]);
    const [destination, setDestination] = useState("");
    const [fromDestination, setFromDestination] = useState("");
    const [duration, setDuration] = useState("");
    const [loadingTripPlan, setLoadingTripPlan] = useState(false);
    const [tripPlan, setTripPlan] = useState(null);
    const [view, setView] = useState("planner"); // 'planner', 'explore', 'trip-plan'
    const [showErrorModal, setShowErrorModal] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    const handleInterestToggle = (interestLabel) => {
      setSelectedInterests((prevInterests) =>
        prevInterests.includes(interestLabel)
          ? prevInterests.filter((label) => label !== interestLabel)
          : [...prevInterests, interestLabel]
      );
    };

    const handleGenerateTrip = async () => {
      if (!destination || !duration || !selectedBudget || !selectedTravelWith || !fromDestination) {
        setErrorMessage("Please fill out all fields before generating your trip.");
        setShowErrorModal(true);
        return;
      }

      setLoadingTripPlan(true);
      setTripPlan(null);
      setView("trip-plan"); // Change view to show trip plan

      try {
        const newItinerary = await generateItinerary(
          fromDestination,
          destination,
          duration,
          selectedInterests.join(", "),
          selectedTravelWith,
          selectedBudget
        );
        setTripPlan(newItinerary);
      } catch (err) {
        console.error("Error generating trip:", err);
        setErrorMessage("An error occurred while generating the trip plan. Please try again. The API call may be failing due to a network or key issue.");
        setShowErrorModal(true);
      } finally {
        setLoadingTripPlan(false);
      }
    };

    const handleExploreClick = () => {
      if (destination) {
          setView("explore");
      } else {
          setErrorMessage("Please enter a destination to explore nearby places.");
          setShowErrorModal(true);
      }
    };


    // Custom Alert Modal component
    const AlertModal = ({ message, onClose }) => (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900 bg-opacity-75">
        <div className="bg-white text-gray-900 p-6 rounded-xl shadow-lg max-w-sm w-full mx-4">
          <h3 className="text-xl font-bold mb-4">Error</h3>
          <p className="mb-6">{message}</p>
          <button
            onClick={onClose}
            className="w-full bg-cyan-400 hover:bg-cyan-300 text-black font-semibold px-4 py-2 rounded-xl"
          >
            Close
          </button>
        </div>
      </div>
    );


    if (view === "explore") {
      return (
        <section className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-[#050e18] text-cyan-300 px-4 py-12 font-sans">
          <div className="max-w-5xl mx-auto">
            <ExplorePage destination={destination} onBack={() => setView("planner")} />
          </div>
        </section>
      );
    }

    return (
      <section className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-[#050e18] text-cyan-300 px-4 py-12 font-sans">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-white text-center">
            Tell us your travel preferences 🌏
          </h2>
          <p className="mb-10 text-center text-cyan-400 text-lg">
            We’ll craft a customized itinerary based on your preferences or help you explore nearby places.
          </p>

          {/* Destination & Duration Inputs */}
          <div className="grid md:grid-cols-3 gap-6 mb-6">
            <div>
              <label className="block mb-2 text-lg text-white">Your starting point:</label>
              <input
                type="text"
                value={fromDestination}
                onChange={(e) => setFromDestination(e.target.value)}
                placeholder="Your current city..."
                className="w-full bg-[#111827] text-white placeholder-cyan-300 px-4 py-3 rounded-xl border border-cyan-400/20 focus:outline-none focus:ring-2 focus:ring-cyan-400"
              />
            </div>
            <div>
              <label className="block mb-2 text-lg text-white">Your dream destination:</label>
              <input
                type="text"
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                placeholder="City, country..."
                className="w-full bg-[#111827] text-white placeholder-cyan-300 px-4 py-3 rounded-xl border border-cyan-400/20 focus:outline-none focus:ring-2 focus:ring-cyan-400"
              />
            </div>
            <div>
              <label className="block mb-2 text-lg text-white">Trip duration (days):</label>
              <input
                type="number"
                min="1"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                placeholder="Ex: 5"
                className="w-full bg-[#111827] text-white placeholder-cyan-300 px-4 py-3 rounded-xl border border-cyan-400/20 focus:outline-none focus:ring-2 focus:ring-cyan-400"
              />
            </div>
          </div>

          {/* Budget */}
          <div className="mb-10">
            <label className="block mb-4 text-lg text-white">Choose your budget range:</label>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
              {budgetOptions.map(({ label, icon, description }) => (
                <div
                  key={label}
                  onClick={() => setSelectedBudget(label)}
                  className={`cursor-pointer p-6 rounded-xl bg-[#0f172a] border border-cyan-400/10 hover:border-cyan-400 transition transform hover:scale-105 text-center ${
                    selectedBudget === label ? "ring-2 ring-cyan-400" : ""
                  }`}
                >
                  <div className="text-3xl mb-2 text-cyan-300">{icon}</div>
                  <p className="text-white font-semibold text-lg">{label}</p>
                  <p className="text-sm text-gray-400">{description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Travel With */}
          <div className="mb-10">
            <label className="block mb-4 text-lg text-white">Who are you traveling with?</label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {travelWithOptions.map(({ label, icon, description }) => (
                <div
                  key={label}
                  onClick={() => setSelectedTravelWith(label)}
                  className={`cursor-pointer p-6 rounded-xl bg-[#0f172a] border border-cyan-400/10 hover:border-cyan-400 transition transform hover:scale-105 text-center ${
                    selectedTravelWith === label ? "ring-2 ring-cyan-400" : ""
                  }`}
                >
                  <div className="text-3xl mb-2 text-cyan-300">{icon}</div>
                  <p className="text-white font-semibold text-lg">{label}</p>
                  <p className="text-sm text-gray-400">{description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Interests */}
          <div className="mb-10">
            <label className="block mb-4 text-lg text-white">What are your interests?</label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              {interestsOptions.map(({ label, icon, description }) => (
                <div
                  key={label}
                  onClick={() => handleInterestToggle(label)}
                  className={`cursor-pointer p-6 rounded-xl bg-[#0f172a] border border-cyan-400/10 hover:border-cyan-400 transition transform hover:scale-105 text-center ${
                    selectedInterests.includes(label) ? "ring-2 ring-cyan-400" : ""
                  }`}
                >
                  <div className="text-3xl mb-2 text-cyan-300">{icon}</div>
                  <p className="text-white font-semibold text-lg">{label}</p>
                  <p className="text-sm text-gray-400">{description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="text-center flex justify-center space-x-6 mt-12">
            <button
              onClick={handleGenerateTrip}
              className="bg-cyan-400 hover:bg-cyan-300 text-black font-semibold px-8 py-3 rounded-xl shadow-md transition duration-300"
              disabled={loadingTripPlan}
            >
              {loadingTripPlan ? "Crafting Plan..." : "Generate Trip ✈️"}
            </button>
            <button
              onClick={handleExploreClick}
              className="bg-gray-700 hover:bg-gray-600 text-white font-semibold px-8 py-3 rounded-xl shadow-md transition duration-300"
            >
              Explore Nearby 📍
            </button>
          </div>

          {/* Estimated Budget & Trip Plan Output */}
          {view === "trip-plan" && tripPlan && (
            <>
              <div className="text-center mt-6 p-4 rounded-xl bg-[#0f172a] border border-cyan-400/10 text-white">
                <h3 className="text-xl font-bold">Estimated Total Cost</h3>
                <p className="text-2xl mt-2">{`$${tripPlan.estimatedTotalCost.toLocaleString()}`}</p>
              </div>
              <div className="mt-10 p-6 bg-[#0f172a] rounded-xl border border-cyan-400/10 text-white">
                  <h3 className="text-2xl font-bold mb-4">{tripPlan.tripTitle}</h3>
                  {tripPlan.itinerary.map((dayPlan) => (
                      <div key={dayPlan.day} className="mb-6">
                          <h4 className="text-xl font-bold text-cyan-300 mb-2">Day {dayPlan.day}: {dayPlan.title}</h4>
                          <ul className="list-disc pl-5 space-y-2 text-gray-300">
                              {dayPlan.activities.map((activity, index) => (
                                  <li key={index}>
                                      <span className="font-semibold">{activity.time}:</span> {activity.description} ({activity.category})
                                  </li>
                              ))}
                          </ul>
                      </div>
                  ))}
              </div>
            </>
          )}

          {/* Render custom alert modal */}
          {showErrorModal && (
            <AlertModal message={errorMessage} onClose={() => setShowErrorModal(false)} />
          )}
        </div>
      </section>
    );
};

export default TravelPreferences;
