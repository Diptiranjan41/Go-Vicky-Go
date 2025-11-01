import React, { useState, useEffect } from 'react';
import { Plane, Calendar, Users, CheckCircle, ArrowRight } from 'lucide-react';
import { initializeApp } from 'firebase/app';
import { getAuth, signInAnonymously, signInWithCustomToken, onAuthStateChanged } from 'firebase/auth';
import { getFirestore, doc, setDoc, collection, onSnapshot, serverTimestamp, query } from 'firebase/firestore';

// --- Main App Component ---
// This component orchestrates the entire application's state and views.
export default function App() {
    // State for managing UI flow and data
    const [searchResults, setSearchResults] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [selectedFlight, setSelectedFlight] = useState(null);
    const [bookedFlight, setBookedFlight] = useState(null);
    const [searchPerformed, setSearchPerformed] = useState(false);

    // State for Firebase services and user data
    const [db, setDb] = useState(null);
    const [auth, setAuth] = useState(null);
    const [userId, setUserId] = useState(null);
    const [myBookings, setMyBookings] = useState([]);

    // Effect for initializing Firebase and setting up authentication
    useEffect(() => {
        const initializeFirebase = async () => {
            try {
                // Firebase config is injected by the environment for security
                const firebaseConfig = typeof __firebase_config !== 'undefined' ? JSON.parse(__firebase_config) : {};
                const app = initializeApp(firebaseConfig);
                const authInstance = getAuth(app);
                const dbInstance = getFirestore(app);
                setDb(dbInstance);
                setAuth(authInstance);

                // Listener for authentication state changes
                const authStateListener = onAuthStateChanged(authInstance, async (user) => {
                    if (user) {
                        setUserId(user.uid);
                        // Once authenticated, set up a real-time listener for user's bookings
                        const bookingsQuery = query(collection(dbInstance, 'artifacts', 'flight-booking-app', 'users', user.uid, 'bookings'));
                        const unsubscribe = onSnapshot(bookingsQuery, (snapshot) => {
                            const bookings = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                            setMyBookings(bookings);
                        });
                        return () => unsubscribe(); // Cleanup listener on component unmount
                    } else {
                        // If no user, attempt to sign in (custom token or anonymously)
                        try {
                            const token = typeof __initial_auth_token !== 'undefined' ? __initial_auth_token : '';
                            if (token) {
                                await signInWithCustomToken(authInstance, token);
                            } else {
                                await signInAnonymously(authInstance);
                            }
                        } catch (error) {
                            console.error("Firebase Authentication Error:", error);
                        }
                    }
                });
                return () => authStateListener(); // Cleanup listener
            } catch (error) {
                console.error("Firebase initialization failed:", error);
            }
        };
        initializeFirebase();
    }, []);

    // --- API Call Handlers ---

    // Function to handle the flight search API call
    const handleSearch = async (searchData) => {
        setIsLoading(true);
        setSearchPerformed(true);
        setSelectedFlight(null);
        setBookedFlight(null);
        setSearchResults([]);

        const prompt = `Generate a JSON array of 3 realistic flight offers from ${searchData.origin} to ${searchData.destination} on ${searchData.departureDate} for ${searchData.passengers} passengers. JSON structure: [{ "id": "string", "airline": "string", "departure": "string", "arrival": "string", "price": "number" }]. Ensure flight IDs are unique strings (e.g., "UA245", "DL887").`;

        try {
            const payload = {
                contents: [{ role: "user", parts: [{ text: prompt }] }],
                generationConfig: {
                    responseMimeType: "application/json",
                    responseSchema: {
                        type: "ARRAY",
                        items: {
                            type: "OBJECT",
                            properties: {
                                "id": { "type": "STRING" },
                                "airline": { "type": "STRING" },
                                "departure": { "type": "STRING" },
                                "arrival": { "type": "STRING" },
                                "price": { "type": "NUMBER" }
                            }
                        }
                    }
                }
            };

            const apiKey = "JOOP0YailBrmqKJ5CCHbDgEjGfuA9JPX"; // API key is handled by the environment
            const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent?key=${apiKey}`;
            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (!response.ok) throw new Error(`API call failed: ${response.status}`);

            const result = await response.json();
            const text = result?.candidates?.[0]?.content?.parts?.[0]?.text;

            if (text) {
                setSearchResults(JSON.parse(text));
            } else {
                console.error("No content in API response:", result);
                setSearchResults([]); // Ensure it's an empty array on failure
            }
        } catch (error) {
            console.error("Error fetching flight data:", error);
            setSearchResults([]); // Reset results on error
        } finally {
            setIsLoading(false);
        }
    };

    // Function to handle the booking confirmation API call and save to Firestore
    const handleBooking = async (bookingData) => {
        if (!db || !userId) {
            console.error("Firestore not initialized or user not authenticated.");
            return;
        }
        setIsLoading(true);

        const prompt = `Generate a JSON response for a flight booking confirmation for ${bookingData.fullName} on ${selectedFlight.airline}. JSON structure: { "confirmationNumber": "string", "message": "string" }. The confirmation number should be a realistic alphanumeric string.`;

        try {
            const payload = {
                contents: [{ role: "user", parts: [{ text: prompt }] }],
                generationConfig: {
                    responseMimeType: "application/json",
                    responseSchema: {
                        type: "OBJECT",
                        properties: {
                            "confirmationNumber": { "type": "STRING" },
                            "message": { "type": "STRING" }
                        }
                    }
                }
            };

            const apiKey = "JOOP0YailBrmqKJ5CCHbDgEjGfuA9JPX"; // API key is handled by the environment
            const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent?key=${apiKey}`;
            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            const result = await response.json();
            const text = result?.candidates?.[0]?.content?.parts?.[0]?.text;

            if (text) {
                const bookingConfirmation = JSON.parse(text);
                const finalBookingData = {
                    ...selectedFlight,
                    ...bookingData,
                    ...bookingConfirmation,
                    bookingDate: serverTimestamp()
                };

                // Save the complete booking record to Firestore
                const newBookingDocRef = doc(collection(db, 'artifacts', 'flight-booking-app', 'users', userId, 'bookings'));
                await setDoc(newBookingDocRef, finalBookingData);

                setBookedFlight(finalBookingData);
                setSelectedFlight(null);
            } else {
                console.error("No content in booking API response:", result);
            }
        } catch (error) {
            console.error("Error booking flight:", error);
        } finally {
            setIsLoading(false);
        }
    };

    // --- UI Render Logic ---
    return (
        <div className="min-h-screen w-full bg-black text-white font-sans antialiased" style={{ backgroundImage: 'linear-gradient(to bottom right, #000000, #0a192f)' }}>
            <header className="text-center py-16 px-4">
                <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight">
                    Discover Your Next <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">Journey</span>
                </h1>
                <p className="mt-4 text-xl text-gray-400 max-w-2xl mx-auto">
                    Search, compare, and book flights with confidence and style.
                </p>
                {userId && (
                    <div className="mt-6 p-2 bg-gray-800/50 rounded-full max-w-xs mx-auto text-xs text-center border border-gray-700">
                        <span className="font-semibold text-cyan-400">User ID:</span> <span className="font-mono text-gray-300">{userId}</span>
                    </div>
                )}
            </header>

            <main className="container mx-auto p-4 md:p-8">
                {!selectedFlight && !bookedFlight && (
                    <FlightSearchForm onSearch={handleSearch} isLoading={isLoading} />
                )}

                {isLoading && (
                    <div className="text-center mt-16 text-2xl text-cyan-400 animate-pulse">Searching for flights...</div>
                )}

                {!isLoading && (
                    <>
                        {!selectedFlight && !bookedFlight && searchPerformed && (
                            <FlightResults flights={searchResults} onSelectFlight={setSelectedFlight} />
                        )}
                        
                        {selectedFlight && (
                            <BookingForm flight={selectedFlight} onBook={handleBooking} isLoading={isLoading} onBack={() => setSelectedFlight(null)} />
                        )}

                        {bookedFlight && (
                            <BookingConfirmation booking={bookedFlight} onNewSearch={() => { setBookedFlight(null); setSearchPerformed(false); }} />
                        )}

                        {!selectedFlight && !bookedFlight && myBookings.length > 0 && (
                            <MyBookings bookings={myBookings} />
                        )}
                    </>
                )}
            </main>
        </div>
    );
}

// --- Child Components ---

function FlightSearchForm({ onSearch, isLoading }) {
    const [formData, setFormData] = useState({
        origin: 'New York',
        destination: 'London',
        departureDate: new Date().toISOString().split('T')[0], // Default to today
        passengers: 1
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSearch(formData);
    };

    return (
        <div className="max-w-4xl mx-auto bg-gray-900/50 rounded-3xl p-6 md:p-8 shadow-2xl backdrop-blur-sm border border-white/10">
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
                <div className="relative">
                    <label className="text-xs text-cyan-400 ml-4">From</label>
                    <Plane className="absolute left-4 top-1/2 mt-1 transform -translate-y-1/2 text-gray-400" size={20} />
                    <input type="text" name="origin" value={formData.origin} onChange={handleInputChange} placeholder="Origin" className="w-full rounded-full bg-gray-800/60 border border-gray-700 py-3 pl-12 pr-6 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500" required />
                </div>
                <div className="relative">
                    <label className="text-xs text-cyan-400 ml-4">To</label>
                    <Plane className="absolute left-4 top-1/2 mt-1 transform -translate-y-1/2 text-gray-400" size={20} />
                    <input type="text" name="destination" value={formData.destination} onChange={handleInputChange} placeholder="Destination" className="w-full rounded-full bg-gray-800/60 border border-gray-700 py-3 pl-12 pr-6 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500" required />
                </div>
                <div className="relative">
                    <label className="text-xs text-cyan-400 ml-4">Departure</label>
                    <Calendar className="absolute left-4 top-1/2 mt-1 transform -translate-y-1/2 text-gray-400" size={20} />
                    <input type="date" name="departureDate" value={formData.departureDate} onChange={handleInputChange} className="w-full rounded-full bg-gray-800/60 border border-gray-700 py-3 pl-12 pr-6 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500" required />
                </div>
                <div className="relative">
                    <label className="text-xs text-cyan-400 ml-4">Passengers</label>
                    <Users className="absolute left-4 top-1/2 mt-1 transform -translate-y-1/2 text-gray-400" size={20} />
                    <input type="number" name="passengers" value={formData.passengers} onChange={handleInputChange} min="1" className="w-full rounded-full bg-gray-800/60 border border-gray-700 py-3 pl-12 pr-6 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500" required />
                </div>
                <div className="col-span-full text-center mt-4">
                    <button type="submit" disabled={isLoading} className="w-full md:w-auto rounded-full bg-cyan-500 hover:bg-cyan-600 text-black font-bold py-3 px-12 transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:scale-100">
                        {isLoading ? 'Searching...' : 'Search Flights'}
                    </button>
                </div>
            </form>
        </div>
    );
}

function FlightResults({ flights, onSelectFlight }) {
    if (flights.length === 0) {
        return (
            <div className="text-center mt-12 p-8 bg-gray-900/50 rounded-2xl border border-white/10">
                <h3 className="text-2xl font-bold text-yellow-400">No Flights Found</h3>
                <p className="text-gray-400 mt-2">We couldn't find any flights for your search. Please try different criteria.</p>
            </div>
        );
    }

    return (
        <div className="mt-12">
            <h2 className="text-3xl font-bold text-cyan-400 mb-8 text-center">Available Flights</h2>
            <div className="space-y-6">
                {flights.map(flight => (
                    <FlightCard key={flight.id} flight={flight} onSelect={onSelectFlight} />
                ))}
            </div>
        </div>
    );
}

function FlightCard({ flight, onSelect }) {
    return (
        <div className="group relative block w-full overflow-hidden rounded-2xl border border-white/10 bg-gray-900/50 p-6 shadow-lg backdrop-blur-sm transition-all duration-300 ease-in-out hover:-translate-y-1 hover:border-cyan-400/50 hover:shadow-2xl hover:shadow-cyan-400/10">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="flex items-center gap-4">
                    <div className="bg-cyan-400/10 p-3 rounded-full border border-cyan-400/20">
                        <Plane className="text-cyan-400" size={24} />
                    </div>
                    <div>
                        <p className="text-xl font-bold text-white">{flight.airline}</p>
                        <p className="text-sm text-gray-400 font-mono">Flight {flight.id}</p>
                    </div>
                </div>
                <div className="flex items-center gap-4 text-center md:text-left">
                    <div>
                        <p className="text-lg font-semibold">{flight.departure}</p>
                        <p className="text-xs text-gray-500">Departure</p>
                    </div>
                    <ArrowRight className="text-gray-600" />
                    <div>
                        <p className="text-lg font-semibold">{flight.arrival}</p>
                        <p className="text-xs text-gray-500">Arrival</p>
                    </div>
                </div>
                <div className="flex items-center gap-6">
                     <p className="text-3xl font-extrabold text-cyan-400">${flight.price}</p>
                     <button onClick={() => onSelect(flight)} className="px-6 py-3 bg-cyan-500 text-black rounded-full font-semibold hover:bg-white transition-colors duration-300 transform group-hover:scale-105">
                        Book Now
                    </button>
                </div>
            </div>
        </div>
    );
}

function BookingForm({ flight, onBook, isLoading, onBack }) {
    const [formData, setFormData] = useState({ fullName: '', email: '' });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onBook({ ...formData, ...flight });
    };

    return (
        <div className="max-w-xl mx-auto bg-gray-900/50 rounded-3xl p-6 md:p-8 shadow-2xl border border-white/10 backdrop-blur-sm">
            <h2 className="text-3xl font-bold text-cyan-400 mb-6 text-center">Confirm Your Booking</h2>
            <div className="bg-gray-800/60 rounded-xl p-4 mb-6 border border-gray-700">
                <div className="flex justify-between items-center">
                    <p className="text-xl font-bold">{flight.airline} ({flight.id})</p>
                    <p className="text-2xl font-bold text-cyan-400">${flight.price}</p>
                </div>
                <p className="text-gray-400 mt-1">{flight.departure} to {flight.arrival}</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-gray-300 mb-1 ml-4 text-sm">Full Name</label>
                    <input type="text" name="fullName" value={formData.fullName} onChange={handleInputChange} className="w-full rounded-full bg-gray-800/60 border border-gray-700 p-3 px-5 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500" required />
                </div>
                <div>
                    <label className="block text-gray-300 mb-1 ml-4 text-sm">Email Address</label>
                    <input type="email" name="email" value={formData.email} onChange={handleInputChange} className="w-full rounded-full bg-gray-800/60 border border-gray-700 p-3 px-5 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500" required />
                </div>
                <div className="pt-4 flex flex-col sm:flex-row gap-4">
                    <button type="button" onClick={onBack} className="w-full rounded-full bg-gray-700 hover:bg-gray-600 text-white font-bold py-3 px-8 transition-colors duration-300">
                        Back to Results
                    </button>
                    <button type="submit" disabled={isLoading} className="w-full rounded-full bg-cyan-500 hover:bg-cyan-600 text-black font-bold py-3 px-8 transition-colors duration-300 disabled:opacity-50">
                        {isLoading ? 'Processing...' : 'Confirm Booking'}
                    </button>
                </div>
            </form>
        </div>
    );
}

function BookingConfirmation({ booking, onNewSearch }) {
    return (
        <div className="max-w-xl mx-auto bg-gray-900/50 rounded-3xl p-8 md:p-10 shadow-2xl border border-green-500/50 text-center backdrop-blur-sm">
            <CheckCircle className="mx-auto h-16 w-16 text-green-400" />
            <h2 className="mt-4 text-3xl font-bold text-green-400">Booking Confirmed!</h2>
            <p className="mt-2 text-lg text-gray-300">{booking.message}</p>
            <div className="mt-6 text-left space-y-2 p-4 bg-gray-800/60 rounded-xl border border-gray-700">
                <p><strong>Confirmation Number:</strong> <span className="font-mono text-cyan-400">{booking.confirmationNumber}</span></p>
                <p><strong>Flight:</strong> {booking.airline} ({booking.id})</p>
                <p><strong>Route:</strong> {booking.departure} - {booking.arrival}</p>
                <p><strong>Price:</strong> ${booking.price}</p>
                <p><strong>Passenger:</strong> {booking.fullName}</p>
            </div>
             <button onClick={onNewSearch} className="mt-8 w-full rounded-full bg-cyan-500 hover:bg-cyan-600 text-black font-bold py-3 px-8 transition-colors duration-300">
                Book Another Flight
            </button>
        </div>
    );
}

function MyBookings({ bookings }) {
    return (
        <div className="mt-16">
            <h2 className="text-3xl font-bold text-cyan-400 mb-8 text-center">My Previous Bookings</h2>
            <div className="max-w-3xl mx-auto space-y-6">
                {bookings.sort((a, b) => b.bookingDate.seconds - a.bookingDate.seconds).map(booking => (
                    <div key={booking.id} className="bg-gray-900/50 rounded-xl p-6 shadow-lg border-l-4 border-green-500/70 backdrop-blur-sm">
                        <div className="flex justify-between items-start">
                            <div>
                                <h3 className="text-xl font-bold text-white">{booking.airline} ({booking.id})</h3>
                                <p className="text-sm text-gray-400">Confirmation: <span className="font-mono">{booking.confirmationNumber}</span></p>
                            </div>
                            <div className="text-right">
                                <p className="font-bold text-lg text-cyan-400">${booking.price}</p>
                                <p className="text-xs text-gray-500">{new Date(booking.bookingDate.seconds * 1000).toLocaleDateString()}</p>
                            </div>
                        </div>
                        <div className="mt-4 pt-4 border-t border-gray-700 text-sm">
                            <p><strong>Route:</strong> {booking.departure} to {booking.arrival}</p>
                            <p><strong>Passenger:</strong> {booking.fullName}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}