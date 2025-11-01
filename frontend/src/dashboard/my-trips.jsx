import React, { useState, useEffect } from "react";
import { Plane, Hotel, ListTodo, Wallet, Users, LayoutList } from "lucide-react";
import { auth, db } from "../firebase";

import { getAuth, signInWithCustomToken, onAuthStateChanged } from "firebase/auth";
import { getFirestore, collection, onSnapshot, addDoc } from "firebase/firestore";

// Your Firebase config here - replace with your real config
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID",
};

const appId = typeof __app_id !== "undefined" ? __app_id : "default-app-id";
const initialAuthToken = typeof __initial_auth_token !== "undefined" ? __initial_auth_token : null;

// Define custom color variables for the new design
// oklch(78.9% 0.154 211.53) is a light cyan color
const primaryColor = "oklch(78.9% 0.154 211.53)";
const secondaryColor = "oklch(60.1% 0.15 211.53)"; // A slightly darker version
const darkBackground = "rgb(15, 15, 15)"; // Very dark black
const cardBackground = "rgba(25, 25, 25, 0.7)"; // Dark semi-transparent for cards
const textColor = "rgb(240, 240, 240)"; // Off-white for text

// Main App component
export default function App() {
  const [selectedTripId, setSelectedTripId] = useState(null);
  const [tripsData, setTripsData] = useState([]);
  const [currentPage, setCurrentPage] = useState("my-trips"); // 'my-trips' or 'create-trip'
  const [userId, setUserId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [firebaseError, setFirebaseError] = useState(false);
  const [formError, setFormError] = useState(null);
  const [formSuccess, setFormSuccess] = useState(null);

  useEffect(() => {
    if (!auth || !db) {
      setFirebaseError(true);
      setLoading(false);
      return;
    }

    const authenticate = async () => {
      try {
        if (initialAuthToken) {
          await signInWithCustomToken(auth, initialAuthToken);
        }
      } catch (error) {
        console.error("Firebase authentication error:", error);
        setFirebaseError(true);
      }
    };
    authenticate();

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserId(user.uid);
        const tripCollectionRef = collection(db, 'artifacts', appId, 'users', user.uid, 'trips');
        
        const unsubscribeSnapshot = onSnapshot(tripCollectionRef, (snapshot) => {
          const trips = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
          setTripsData(trips);
          if (trips.length > 0 && !selectedTripId) {
            setSelectedTripId(trips[0].id);
          }
          setLoading(false);
        }, (error) => {
          console.error("Error fetching trips: ", error);
          setLoading(false);
          setFirebaseError(true);
        });
        return () => unsubscribeSnapshot();
      } else {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const trip = tripsData.find((t) => t.id === selectedTripId);

  // A helper component to render a list of items with a title and an icon.
  const CardSection = ({ title, icon: Icon, children }) => (
    <div style={{ backgroundColor: cardBackground }} className="backdrop-blur-md rounded-xl p-6 shadow-2xl">
      <h2 className="flex items-center text-xl font-bold mb-4" style={{ color: primaryColor }}>
        <Icon className="mr-2" />
        {title}
      </h2>
      {children}
    </div>
  );

  // A component to display the list of trips
  const MyTripsContent = () => (
    <>
      <div className="max-w-xl mx-auto mb-8 sm:mb-12">
        <label htmlFor="trip-select" className="block text-lg font-medium mb-2" style={{ color: primaryColor }}>
          Select Your Trip:
        </label>
        <div className="relative">
          <select
            id="trip-select"
            style={{ backgroundColor: darkBackground, color: primaryColor, borderColor: secondaryColor }}
            className="w-full appearance-none border-2 rounded-lg py-3 pl-4 pr-10 focus:outline-none focus:ring-2 shadow-lg transition-all duration-300"
            value={selectedTripId || ""}
            onChange={(e) => setSelectedTripId(e.target.value)}
          >
            {tripsData.map((t) => (
              <option key={t.id} value={t.id}>
                {t.name}
              </option>
            ))}
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2" style={{ color: primaryColor }}>
            <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
              <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 6.757 7.586 5.343 9l4.95 4.95z" />
            </svg>
          </div>
        </div>
      </div>

      {trip ? (
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8" style={{ color: textColor }}>
          <CardSection title="Trip Overview" icon={LayoutList}>
            <p className="mb-2">
              <strong>Dates:</strong> {trip.dates} <br />
              <strong>Duration:</strong> {trip.duration}
            </p>
            <p className="leading-relaxed">{trip.description}</p>
          </CardSection>

          <CardSection title="Itinerary" icon={ListTodo}>
            <ul className="space-y-3">
              {trip.itinerary &&
                trip.itinerary.map(({ destination, days }, index) => (
                  <li key={index} className="flex items-start">
                    <span className="flex-shrink-0 font-bold mr-2" style={{ color: primaryColor }}>
                      {destination}:
                    </span>
                    <span>{days} days</span>
                  </li>
                ))}
            </ul>
          </CardSection>

          <CardSection title="Booking Details" icon={Plane}>
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-2 flex items-center" style={{ color: primaryColor }}>
                <Plane className="mr-2" />
                Flight
              </h3>
              {trip.bookings && trip.bookings.flight && (
                <p>
                  <strong>Airline:</strong> {trip.bookings.flight.airline} <br />
                  <strong>Flight Number:</strong> {trip.bookings.flight.flightNumber} <br />
                  <strong>Departure:</strong> {trip.bookings.flight.departure} <br />
                  <strong>Arrival:</strong> {trip.bookings.flight.arrival}
                </p>
              )}
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2 flex items-center" style={{ color: primaryColor }}>
                <Hotel className="mr-2" />
                Hotel
              </h3>
              {trip.bookings && trip.bookings.hotel && (
                <p>
                  <strong>Name:</strong> {trip.bookings.hotel.name} <br />
                  <strong>Address:</strong> {trip.bookings.hotel.address} <br />
                  <strong>Check-in:</strong> {trip.bookings.hotel.checkIn} <br />
                  <strong>Check-out:</strong> {trip.bookings.hotel.checkOut}
                </p>
              )}
            </div>
          </CardSection>

          <CardSection title="Packing List" icon={ListTodo}>
            <ul className="grid grid-cols-2 gap-2">
              {trip.packingList &&
                trip.packingList.map((item, idx) => (
                  <li key={idx} className="flex items-center">
                    <span className="h-2 w-2 rounded-full mr-2 flex-shrink-0" style={{ backgroundColor: primaryColor }}></span>
                    {item}
                  </li>
                ))}
            </ul>
          </CardSection>

          <CardSection title="Budget Tracker" icon={Wallet}>
            {trip.budgetTracker && (
              <p>
                <strong>Spent:</strong>{" "}
                <span className="font-semibold text-red-400">
                  ₹{trip.budgetTracker.spent.toLocaleString()}
                </span>
              </p>
            )}
            {trip.budgetTracker && (
              <p>
                <strong>Remaining:</strong>{" "}
                <span className="font-semibold text-green-400">
                  ₹{trip.budgetTracker.remaining.toLocaleString()}
                </span>
              </p>
            )}
          </CardSection>

          <CardSection title="Travel Companions" icon={Users}>
            <ul className="space-y-3">
              {trip.companions &&
                trip.companions.map(({ name, contact }, idx) => (
                  <li key={idx}>
                    <p className="font-medium">{name}</p>
                    <a
                      href={`tel:${contact}`}
                      className="hover:underline"
                      style={{ color: primaryColor }}
                    >
                      {contact}
                    </a>
                  </li>
                ))}
            </ul>
          </CardSection>
        </div>
      ) : (
        <p className="text-center text-xl" style={{ color: textColor }}>No trips available.</p>
      )}
    </>
  );

  // A component to create a new trip
  const CreateTripContent = () => {
    const [newTrip, setNewTrip] = useState({
      name: "",
      dates: "",
      duration: "",
      description: "",
      estimatedBudget: 0,
      itinerary: [],
      packingList: [],
      companions: [],
    });
    const [itineraryInput, setItineraryInput] = useState("");
    const [itineraryDaysInput, setItineraryDaysInput] = useState("");
    const [packingListInput, setPackingListInput] = useState("");
    const [companionsNameInput, setCompanionsNameInput] = useState("");
    const [companionsContactInput, setCompanionsContactInput] = useState("");

    const handleInputChange = (e) => {
      const { name, value } = e.target;
      setNewTrip((prev) => ({ ...prev, [name]: value }));
    };

    const handleAddItinerary = () => {
      if (itineraryInput.trim() !== "" && itineraryDaysInput.trim() !== "") {
        setNewTrip((prev) => ({
          ...prev,
          itinerary: [
            ...prev.itinerary,
            { destination: itineraryInput, days: itineraryDaysInput },
          ],
        }));
        setItineraryInput("");
        setItineraryDaysInput("");
      }
    };

    const handleAddPackingItem = () => {
      if (packingListInput.trim() !== "") {
        setNewTrip((prev) => ({
          ...prev,
          packingList: [...prev.packingList, packingListInput],
        }));
        setPackingListInput("");
      }
    };

    const handleAddCompanion = () => {
      if (companionsNameInput.trim() !== "" && companionsContactInput.trim() !== "") {
        setNewTrip((prev) => ({
          ...prev,
          companions: [
            ...prev.companions,
            { name: companionsNameInput, contact: companionsContactInput },
          ],
        }));
        setCompanionsNameInput("");
        setCompanionsContactInput("");
      }
    };

    const handleSubmit = async (e) => {
      e.preventDefault();
      setFormError(null);
      setFormSuccess(null);

      if (!userId) {
        setFormError("User not authenticated. Please log in and try again.");
        return;
      }
      if (!newTrip.name || !newTrip.dates || !newTrip.duration) {
        setFormError("Please fill in the trip name, dates, and duration.");
        return;
      }

      try {
        const tripCollectionRef = collection(db, 'artifacts', appId, 'users', userId, 'trips');
        const estimatedBudget = typeof newTrip.estimatedBudget === "string" ? parseInt(newTrip.estimatedBudget) : newTrip.estimatedBudget;
        const tripToSave = {
          ...newTrip,
          estimatedBudget: estimatedBudget || 0,
          budgetTracker: { spent: 0, remaining: estimatedBudget || 0 },
          bookings: { flight: {}, hotel: {} },
        };
        await addDoc(tripCollectionRef, tripToSave);
        setFormSuccess("Trip saved successfully!");
        setCurrentPage("my-trips");
      } catch (error) {
        console.error("Error adding document: ", error);
        setFormError("An error occurred while saving the trip.");
      }
    };

    return (
      <form onSubmit={handleSubmit} className="max-w-3xl mx-auto space-y-6">
        <h2 className="text-2xl font-bold drop-shadow-md" style={{ color: primaryColor }}>
          Create a New Trip
        </h2>
        {formError && (
          <div className="bg-red-900 text-red-300 p-3 rounded-md mb-4">{formError}</div>
        )}
        {formSuccess && (
          <div className="bg-green-900 text-green-300 p-3 rounded-md mb-4">{formSuccess}</div>
        )}
        <div style={{ backgroundColor: cardBackground }} className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 rounded-xl shadow-lg">
          <div>
            <label htmlFor="name" className="block mb-1" style={{ color: primaryColor }}>Trip Name</label>
            <input type="text" id="name" name="name" value={newTrip.name} onChange={handleInputChange} style={{ backgroundColor: darkBackground, borderColor: secondaryColor }} className="w-full border rounded-md p-2" required />
          </div>
          <div>
            <label htmlFor="dates" className="block mb-1" style={{ color: primaryColor }}>Dates</label>
            <input type="text" id="dates" name="dates" value={newTrip.dates} onChange={handleInputChange} style={{ backgroundColor: darkBackground, borderColor: secondaryColor }} className="w-full border rounded-md p-2" required />
          </div>
          <div>
            <label htmlFor="duration" className="block mb-1" style={{ color: primaryColor }}>Duration</label>
            <input type="text" id="duration" name="duration" value={newTrip.duration} onChange={handleInputChange} style={{ backgroundColor: darkBackground, borderColor: secondaryColor }} className="w-full border rounded-md p-2" required />
          </div>
          <div>
            <label htmlFor="estimatedBudget" className="block mb-1" style={{ color: primaryColor }}>Estimated Budget (₹)</label>
            <input type="number" id="estimatedBudget" name="estimatedBudget" value={newTrip.estimatedBudget} onChange={handleInputChange} style={{ backgroundColor: darkBackground, borderColor: secondaryColor }} className="w-full border rounded-md p-2" />
          </div>
          <div className="md:col-span-2">
            <label htmlFor="description" className="block mb-1" style={{ color: primaryColor }}>Description</label>
            <textarea id="description" name="description" value={newTrip.description} onChange={handleInputChange} style={{ backgroundColor: darkBackground, borderColor: secondaryColor }} className="w-full border rounded-md p-2" rows="3"></textarea>
          </div>
        </div>

        <div style={{ backgroundColor: cardBackground }} className="p-6 rounded-xl shadow-lg">
          <label htmlFor="itineraryInput" className="block mb-2" style={{ color: primaryColor }}>Itinerary</label>
          <div className="flex flex-col md:flex-row gap-2">
            <input 
              type="text" 
              id="itineraryInput" 
              value={itineraryInput} 
              onChange={(e) => setItineraryInput(e.target.value)} 
              style={{ backgroundColor: darkBackground, borderColor: secondaryColor, color: textColor }} 
              className="w-full border rounded-md p-2" 
              placeholder="e.g., Paris" 
            />
            <input 
              type="number" 
              value={itineraryDaysInput} 
              onChange={(e) => setItineraryDaysInput(e.target.value)} 
              style={{ backgroundColor: darkBackground, borderColor: secondaryColor, color: textColor }} 
              className="w-full md:w-1/4 border rounded-md p-2" 
              placeholder="Days"
            />
            <button type="button" onClick={handleAddItinerary} style={{ backgroundColor: primaryColor, color: darkBackground }} className="px-4 py-2 rounded-md hover:opacity-80 transition-opacity flex-shrink-0">Add Destination</button>
          </div>
          <ul className="mt-4 space-y-2" style={{ color: textColor }}>
            {newTrip.itinerary.map(({ destination, days }, idx) => (
              <li key={idx}>
                {destination} - {days} day(s)
              </li>
            ))}
          </ul>
        </div>

        <div style={{ backgroundColor: cardBackground }} className="p-6 rounded-xl shadow-lg">
          <label htmlFor="packingListInput" className="block mb-2" style={{ color: primaryColor }}>Packing List</label>
          <div className="flex gap-2">
            <input type="text" id="packingListInput" value={packingListInput} onChange={(e) => setPackingListInput(e.target.value)} style={{ backgroundColor: darkBackground, borderColor: secondaryColor, color: textColor }} className="w-full border rounded-md p-2" placeholder="Item" />
            <button type="button" onClick={handleAddPackingItem} style={{ backgroundColor: primaryColor, color: darkBackground }} className="px-4 py-2 rounded-md hover:opacity-80 transition-opacity flex-shrink-0">Add Item</button>
          </div>
          <ul className="mt-4 space-y-2" style={{ color: textColor }}>
            {newTrip.packingList.map((item, idx) => (
              <li key={idx}>{item}</li>
            ))}
          </ul>
        </div>

        <div style={{ backgroundColor: cardBackground }} className="p-6 rounded-xl shadow-lg">
          <label className="block mb-2" style={{ color: primaryColor }}>Travel Companions</label>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
            <input type="text" placeholder="Name" value={companionsNameInput} onChange={(e) => setCompanionsNameInput(e.target.value)} style={{ backgroundColor: darkBackground, borderColor: secondaryColor, color: textColor }} className="border rounded-md p-2" />
            <input type="text" placeholder="Contact" value={companionsContactInput} onChange={(e) => setCompanionsContactInput(e.target.value)} style={{ backgroundColor: darkBackground, borderColor: secondaryColor, color: textColor }} className="border rounded-md p-2" />
            <button type="button" onClick={handleAddCompanion} style={{ backgroundColor: primaryColor, color: darkBackground }} className="px-4 py-2 rounded-md hover:opacity-80 transition-opacity">Add Companion</button>
          </div>
          <ul className="mt-4 space-y-2" style={{ color: textColor }}>
            {newTrip.companions.map(({ name, contact }, idx) => (
              <li key={idx}>
                {name} — <a href={`tel:${contact}`} className="hover:underline" style={{ color: primaryColor }}>{contact}</a>
              </li>
            ))}
          </ul>
        </div>

        <button type="submit" style={{ backgroundColor: primaryColor, color: darkBackground }} className="w-full py-3 font-bold text-lg rounded-xl shadow-xl hover:opacity-80 transition-opacity">
          Save Trip
        </button>
      </form>
    );
  };

  if (loading) {
    return (
      <div style={{ backgroundColor: darkBackground, color: primaryColor }} className="flex justify-center items-center h-screen text-xl">
        Loading...
      </div>
    );
  }

  if (firebaseError) {
    return (
      <div style={{ backgroundColor: darkBackground }} className="flex justify-center items-center h-screen text-red-500 text-xl">
        Error initializing Firebase or authenticating. Please check your config and network.
      </div>
    );
  }

  return (
    <div style={{ backgroundColor: darkBackground, color: textColor }} className="min-h-screen p-4 sm:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-center gap-6 mb-8">
          <button
            onClick={() => setCurrentPage("my-trips")}
            style={{
              backgroundColor: currentPage === "my-trips" ? primaryColor : "transparent",
              color: currentPage === "my-trips" ? darkBackground : primaryColor,
              border: `2px solid ${primaryColor}`,
            }}
            className="px-6 py-3 rounded-full font-semibold transition-all duration-300"
          >
            My Trips
          </button>
          <button
            onClick={() => setCurrentPage("create-trip")}
            style={{
              backgroundColor: currentPage === "create-trip" ? primaryColor : "transparent",
              color: currentPage === "create-trip" ? darkBackground : primaryColor,
              border: `2px solid ${primaryColor}`,
            }}
            className="px-6 py-3 rounded-full font-semibold transition-all duration-300"
          >
            Create Trip
          </button>
        </div>

        {currentPage === "my-trips" ? <MyTripsContent /> : <CreateTripContent />}
      </div>
    </div>
  );
}