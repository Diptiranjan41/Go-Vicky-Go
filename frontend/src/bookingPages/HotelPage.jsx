import React, { useState, useEffect } from 'react';
import { initializeApp } from 'firebase/app';
import { getAuth, signInWithCustomToken, signInAnonymously, onAuthStateChanged } from 'firebase/auth';
import { getFirestore, doc, setDoc } from 'firebase/firestore';
import { Search, Hotel, Calendar, User2, DollarSign, CheckCircle, XCircle, Phone, FileText } from 'lucide-react';
// import jsPDF from 'jspdf'; // This is removed as we will load it from a CDN
import { v4 as uuidv4 } from 'uuid';

// Main Component for the Hotel Booking Page
export default function HotelPage() {
  // Global variables provided by the Canvas environment
  const appId = typeof __app_id !== 'undefined' ? __app_id : 'default-app-id';
  const firebaseConfig = typeof __firebase_config !== 'undefined' ? JSON.parse(__firebase_config) : {};
  const initialAuthToken = typeof __initial_auth_token !== 'undefined' ? __initial_auth_token : undefined;

  // State for Firebase services
  const [db, setDb] = useState(null);
  const [auth, setAuth] = useState(null);
  const [userId, setUserId] = useState('');

  // State for the booking form inputs
  const [formData, setFormData] = useState({
    destination: '',
    checkInDate: '',
    checkOutDate: '',
    guests: 1,
    priceRange: 'any'
  });

  // State for search results, loading, and errors
  const [hotels, setHotels] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchPerformed, setSearchPerformed] = useState(false);

  // State for the booking modal and the selected hotel
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [selectedHotel, setSelectedHotel] = useState(null);

  // State for the booking form within the modal
  const [bookingDetails, setBookingDetails] = useState({
    fullName: '',
    email: '',
    phoneNumber: '',
    specialRequests: '',
  });

  // State for the payment success screen
  const [isPaymentSuccess, setIsPaymentSuccess] = useState(false);
  const [bookingConfirmation, setBookingConfirmation] = useState(null);

  // State for the custom alert modal
  const [isAlertModalOpen, setIsAlertModalOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');

  // Currency conversion state
  const [selectedCurrency, setSelectedCurrency] = useState('USD');
  const currencyRates = { 'USD': 1.0, 'EUR': 0.92, 'JPY': 158.0, 'GBP': 0.79, 'INR': 83.5 };
  const currencySymbols = { 'USD': '$', 'EUR': '€', 'JPY': '¥', 'GBP': '£', 'INR': '₹' };

  // --- Firebase Initialization and Auth ---
  useEffect(() => {
    // Load jsPDF script dynamically
    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js';
    script.async = true;
    document.body.appendChild(script);

    if (Object.keys(firebaseConfig).length > 0) {
      const app = initializeApp(firebaseConfig);
      const authInstance = getAuth(app);
      setAuth(authInstance);
      setDb(getFirestore(app));

      const authStateListener = onAuthStateChanged(authInstance, async (user) => {
        if (user) {
          setUserId(user.uid);
        } else {
          try {
            if (initialAuthToken) {
              await signInWithCustomToken(authInstance, initialAuthToken);
            } else {
              await signInAnonymously(authInstance);
            }
            setUserId(authInstance.currentUser?.uid || uuidv4());
          } catch (error) {
            console.error("Firebase Auth error:", error);
            setUserId(uuidv4());
          }
        }
      });
      return () => {
        authStateListener();
        document.body.removeChild(script);
      }
    }
  }, [firebaseConfig, initialAuthToken]);

  // --- Form and Modal Handlers ---
  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const showAlert = (message) => {
    setAlertMessage(message);
    setIsAlertModalOpen(true);
  };

  const hideAlert = () => {
    setIsAlertModalOpen(false);
    setAlertMessage('');
  };

  // --- API Call to Fetch Hotels ---
  const handleSearch = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setHotels([]);
    setIsPaymentSuccess(false);
    setSearchPerformed(true);

    if (!formData.destination || !formData.checkInDate || !formData.checkOutDate) {
      showAlert('Please fill in destination, check-in, and check-out dates.');
      setIsLoading(false);
      return;
    }

    try {
        let priceRangeText;
        switch (formData.priceRange) {
            case '$': priceRangeText = 'budget-friendly, around $100-200 per night'; break;
            case '$$': priceRangeText = 'mid-range, around $200-400 per night'; break;
            case '$$$': priceRangeText = 'luxury, over $400 per night'; break;
            default: priceRangeText = 'with a mix of price points'; break;
        }
        const prompt = `Generate a JSON array of 5 popular, high-rated hotels in "${formData.destination}" available from ${formData.checkInDate} to ${formData.checkOutDate} for ${formData.guests} guest(s), with prices that are ${priceRangeText}. Each object must have: "name" (string), "description" (string, 2 sentences), "pricePerNight" (number), "rating" (number between 4 and 5), and "image" (a placeholder URL like https://placehold.co/600x400/0a192f/22d3ee?text=Hotel+View). Respond with only the JSON array.`;

      const payload = {
        contents: [{ role: "user", parts: [{ text: prompt }] }],
        generationConfig: {
          responseMimeType: "application/json",
          responseSchema: {
            type: "ARRAY",
            items: {
              type: "OBJECT",
              properties: {
                "name": { "type": "STRING" }, "description": { "type": "STRING" },
                "pricePerNight": { "type": "NUMBER" }, "rating": { "type": "NUMBER" },
                "image": { "type": "STRING" }
              }
            }
          }
        }
      };

      const apiKey = ""; // Handled by environment
      const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent?key=${apiKey}`;
      
      const response = await fetch(apiUrl, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
      if (!response.ok) throw new Error(`API error: ${response.statusText}`);
      
      const result = await response.json();
      const jsonText = result?.candidates?.[0]?.content?.parts?.[0]?.text;

      if (jsonText) {
        setHotels(JSON.parse(jsonText));
      } else {
        setError('No hotels found. Please try a different destination.');
      }
    } catch (err) {
      console.error('Failed to fetch hotels:', err);
      setError('An error occurred while fetching hotels. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // --- Booking Process Handlers ---
  const handleBookNow = (hotel) => {
    setSelectedHotel(hotel);
    setIsBookingModalOpen(true);
  };

  const handleCloseBookingModal = () => {
    setIsBookingModalOpen(false);
    setSelectedHotel(null);
    setBookingDetails({ fullName: '', email: '', phoneNumber: '', specialRequests: '' });
  };

  const handleBookingFormChange = (e) => {
    const { name, value } = e.target;
    setBookingDetails((prev) => ({ ...prev, [name]: value }));
  };

  const handleBookingSubmit = async (e) => {
    e.preventDefault();
    if (!bookingDetails.fullName || !bookingDetails.email) {
      showAlert("Please fill in your full name and email.");
      return;
    }

    setIsLoading(true);
    const oneDay = 24 * 60 * 60 * 1000;
    const nights = Math.round(Math.abs((new Date(formData.checkOutDate) - new Date(formData.checkInDate)) / oneDay));
    const totalAmount = selectedHotel.pricePerNight * nights;
    const uniqueBookingId = uuidv4();

    const booking = {
      bookingId: uniqueBookingId,
      hotelName: selectedHotel.name,
      guestName: bookingDetails.fullName,
      email: bookingDetails.email,
      phoneNumber: bookingDetails.phoneNumber,
      specialRequests: bookingDetails.specialRequests,
      pricePerNight: selectedHotel.pricePerNight,
      nights: nights,
      totalAmount: totalAmount,
      checkIn: formData.checkInDate,
      checkOut: formData.checkOutDate,
      timestamp: new Date().toISOString()
    };

    try {
      const bookingDocRef = doc(db, `/artifacts/${appId}/users/${userId}/bookings/${uniqueBookingId}`);
      await setDoc(bookingDocRef, booking);
      setBookingConfirmation(booking);
      setIsPaymentSuccess(true);
      handleCloseBookingModal();
    } catch (e) {
      console.error("Error adding document: ", e);
      showAlert("Your booking could not be saved. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // --- PDF Generation ---
  const generatePDF = () => {
    if (!bookingConfirmation || !window.jspdf) {
        showAlert("PDF library is not loaded yet. Please try again in a moment.");
        return;
    }
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    
    doc.setFont('helvetica');
    doc.setFontSize(22);
    doc.setTextColor(44, 62, 80);
    doc.text('Booking Confirmation', 105, 20, null, null, 'center');

    doc.setDrawColor(22, 199, 154);
    doc.setLineWidth(1);
    doc.line(20, 25, 190, 25);

    doc.setFontSize(14);
    doc.setTextColor(52, 73, 94);
    let y = 40;
    const addField = (label, value) => {
      doc.text(`${label}:`, 20, y);
      doc.setFont('helvetica', 'bold');
      doc.text(value, 60, y);
      doc.setFont('helvetica', 'normal');
      y += 10;
    };

    addField('Booking ID', bookingConfirmation.bookingId);
    addField('Hotel Name', bookingConfirmation.hotelName);
    addField('Guest Name', bookingConfirmation.guestName);
    addField('Email', bookingConfirmation.email);
    addField('Check-in Date', bookingConfirmation.checkIn);
    addField('Check-out Date', bookingConfirmation.checkOut);
    addField('Nights', String(bookingConfirmation.nights));
    addField('Total Amount', `${currencySymbols[selectedCurrency]}${(bookingConfirmation.totalAmount * currencyRates[selectedCurrency]).toFixed(2)}`);

    if (bookingConfirmation.specialRequests) {
      y += 10;
      doc.text('Special Requests:', 20, y);
      y += 5;
      doc.setFont('helvetica', 'italic');
      doc.text(bookingConfirmation.specialRequests, 25, y, { maxWidth: 160 });
    }
    
    doc.save(`LuxStay_Booking_${bookingConfirmation.bookingId}.pdf`);
  };

  // --- UI Components ---
  const StarRating = ({ rating }) => (
    <div className="flex text-yellow-400">
      {[...Array(Math.floor(rating))].map((_, i) => <span key={i}>★</span>)}
      {[...Array(5 - Math.floor(rating))].map((_, i) => <span key={i} className="text-gray-600">★</span>)}
    </div>
  );

  return (
    <>
      <div className="min-h-screen bg-gray-950 text-white font-['Poppins'] p-4 sm:p-8 flex flex-col items-center">
        {!isPaymentSuccess && (
          <div className="w-full max-w-5xl p-4 sm:p-8 rounded-2xl shadow-2xl border-2 border-cyan-400 bg-gray-900/50 backdrop-blur-md">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-center text-cyan-400 mb-4 sm:mb-6 animate-pulse">LuxStay</h1>
            <p className="text-center text-gray-400 mb-6 sm:mb-8 max-w-xl mx-auto text-base sm:text-lg">Find and book your next premium getaway with ease.</p>
            {userId && <p className="text-center text-xs sm:text-sm text-gray-500 mb-6">User ID: <span className="font-mono text-cyan-200 break-all">{userId}</span></p>}
            
            <form onSubmit={handleSearch} className="w-full">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4">
                <div className="sm:col-span-2 lg:col-span-2">
                  <label htmlFor="destination" className="block text-gray-300 mb-2 font-semibold text-sm">Destination</label>
                  <div className="relative"><Hotel className="absolute left-3 top-1/2 -translate-y-1/2 text-cyan-400" size={20} /><input type="text" id="destination" name="destination" value={formData.destination} onChange={handleFormChange} placeholder="e.g., Paris, Tokyo" className="w-full bg-gray-800 text-white p-3 pl-10 rounded-xl border border-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-400/50 transition-all" /></div>
                </div>
                <div className="sm:col-span-1 lg:col-span-1">
                  <label htmlFor="checkInDate" className="block text-gray-300 mb-2 font-semibold text-sm">Check-in</label>
                  <div className="relative"><Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-cyan-400" size={20} /><input type="date" id="checkInDate" name="checkInDate" value={formData.checkInDate} onChange={handleFormChange} className="w-full bg-gray-800 text-white p-3 pl-10 rounded-xl border border-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-400/50 transition-all appearance-none" /></div>
                </div>
                <div className="sm:col-span-1 lg:col-span-1">
                  <label htmlFor="checkOutDate" className="block text-gray-300 mb-2 font-semibold text-sm">Check-out</label>
                  <div className="relative"><Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-cyan-400" size={20} /><input type="date" id="checkOutDate" name="checkOutDate" value={formData.checkOutDate} onChange={handleFormChange} className="w-full bg-gray-800 text-white p-3 pl-10 rounded-xl border border-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-400/50 transition-all appearance-none" /></div>
                </div>
                <div className="sm:col-span-1 lg:col-span-1">
                  <label htmlFor="priceRange" className="block text-gray-300 mb-2 font-semibold text-sm">Price</label>
                  <div className="relative"><DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 text-cyan-400" size={20} /><select id="priceRange" name="priceRange" value={formData.priceRange} onChange={handleFormChange} className="w-full bg-gray-800 text-white p-3 pl-10 rounded-xl border border-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-400/50 transition-all appearance-none"><option value="any">Any</option><option value="$">$</option><option value="$$">$$</option><option value="$$$">$$$</option></select></div>
                </div>
                <div className="sm:col-span-1 lg:col-span-1">
                  <label htmlFor="guests" className="block text-gray-300 mb-2 font-semibold text-sm">Guests</label>
                  <div className="relative"><User2 className="absolute left-3 top-1/2 -translate-y-1/2 text-cyan-400" size={20} /><input type="number" id="guests" name="guests" value={formData.guests} onChange={handleFormChange} min="1" className="w-full bg-gray-800 text-white p-3 pl-10 rounded-xl border border-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-400/50 transition-all" /></div>
                </div>
              </div>
              <button type="submit" disabled={isLoading} className="w-full mt-6 p-3 sm:p-4 text-black font-extrabold text-base sm:text-lg bg-cyan-400 rounded-xl shadow-lg hover:shadow-cyan-400/50 transition-all transform hover:scale-105 flex items-center justify-center gap-2 disabled:opacity-50">
                <Search className="text-xl" /> {isLoading ? 'Searching...' : 'Search Hotels'}
              </button>
            </form>
          </div>
        )}

        {isLoading && (
          <div className="mt-12 text-cyan-400 text-center flex justify-center items-center gap-4">
            <svg className="animate-spin h-8 w-8 text-cyan-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
            <span className="text-xl">Searching for hotels...</span>
          </div>
        )}

        {error && <div className="mt-8 p-4 text-center text-red-400 bg-red-900/50 rounded-xl max-w-md mx-auto">{error}</div>}

        {searchPerformed && !isLoading && hotels.length > 0 && (
          <div className="w-full max-w-5xl mt-12">
            <h2 className="text-3xl font-bold text-center text-cyan-400 mb-8">Available Hotels</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {hotels.map((hotel, index) => (
                <div key={index} className="bg-gray-800 rounded-2xl overflow-hidden shadow-xl border border-cyan-400/50 hover:shadow-cyan-400/50 transition-all transform hover:-translate-y-2 flex flex-col">
                  <img src={hotel.image} alt={hotel.name} className="w-full h-48 object-cover" onError={(e) => { e.target.onerror = null; e.target.src='https://placehold.co/600x400/0a192f/22d3ee?text=Image+Error'; }}/>
                  <div className="p-6 flex flex-col flex-grow">
                    <h3 className="text-2xl font-bold text-cyan-400 mb-2">{hotel.name}</h3>
                    <p className="text-gray-300 mb-4 text-sm flex-grow min-h-[5rem]">{hotel.description}</p>
                    <StarRating rating={hotel.rating} />
                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center sm:justify-between mt-4 gap-4 sm:gap-2">
                      <span className="text-2xl font-extrabold text-cyan-400 text-center sm:text-left">${hotel.pricePerNight}<span className="text-gray-400 font-normal text-base">/n</span></span>
                      <button onClick={() => handleBookNow(hotel)} className="bg-cyan-400 text-black px-5 py-2.5 rounded-lg font-bold text-lg hover:bg-cyan-300 transition-colors shadow-lg hover:shadow-cyan-400/50">Book</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {searchPerformed && !isLoading && hotels.length === 0 && !error && (
             <div className="mt-8 p-4 text-center text-yellow-400 bg-yellow-900/50 rounded-xl max-w-md mx-auto">No hotels found for your search criteria.</div>
        )}

        {isPaymentSuccess && bookingConfirmation && (
          <div className="w-full max-w-2xl mt-12 p-8 rounded-2xl shadow-2xl border-2 border-green-400 bg-gray-900/50 backdrop-blur-md text-center animate-zoom-in">
            <CheckCircle size={80} className="text-green-400 mx-auto mb-6" />
            <h2 className="text-4xl font-extrabold text-green-400 mb-2">Booking Confirmed!</h2>
            <p className="text-lg text-gray-300 mb-8">Thank you for your reservation. Your trip is all set!</p>
            <div className="text-left bg-gray-800 rounded-xl p-6 mb-6">
              <p className="text-gray-400">Booking ID: <span className="font-mono text-green-200 break-all">{bookingConfirmation.bookingId}</span></p>
              <p className="text-gray-400 mt-2">Hotel: <span className="text-white font-semibold">{bookingConfirmation.hotelName}</span></p>
              <p className="text-gray-400">Total: <span className="text-green-400 font-bold">{currencySymbols[selectedCurrency]}{(bookingConfirmation.totalAmount * currencyRates[selectedCurrency]).toFixed(2)}</span></p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button onClick={() => { setIsPaymentSuccess(false); setSearchPerformed(false); setHotels([]); }} className="flex items-center justify-center gap-2 p-4 text-black font-bold bg-cyan-400 rounded-xl shadow-lg hover:shadow-cyan-400/50 transition-all transform hover:scale-105">New Search</button>
              <button onClick={generatePDF} className="flex items-center justify-center gap-2 p-4 text-cyan-400 font-bold bg-gray-800 rounded-xl shadow-lg border border-cyan-400 hover:bg-gray-700 transition-colors"><FileText /> Download</button>
            </div>
          </div>
        )}

        {isBookingModalOpen && selectedHotel && (
          <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center p-4 z-50">
            <div className="bg-gray-900/90 backdrop-blur-xl rounded-2xl p-6 sm:p-8 w-full max-w-lg relative shadow-2xl border-2 border-cyan-400 animate-zoom-in">
              <button onClick={handleCloseBookingModal} className="absolute top-4 right-4 text-cyan-400 text-3xl font-bold hover:text-cyan-300">&times;</button>
              <h3 className="text-2xl sm:text-3xl font-bold text-cyan-400 mb-4 text-center">Book {selectedHotel.name}</h3>
              <div className="flex items-center justify-center mb-4 space-x-2">
                <p className="text-gray-400">Price in</p>
                <select onChange={(e) => setSelectedCurrency(e.target.value)} value={selectedCurrency} className="bg-gray-800 text-cyan-400 p-1 rounded-md">
                  {Object.keys(currencyRates).map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <p className="text-gray-400 text-center mb-6 sm:mb-8"><span className="text-cyan-400 font-bold text-xl sm:text-2xl">{currencySymbols[selectedCurrency]}{(selectedHotel.pricePerNight * currencyRates[selectedCurrency]).toFixed(2)}</span> / night</p>
              <form onSubmit={handleBookingSubmit} className="space-y-4 sm:space-y-6">
                <div>
                  <label htmlFor="fullName" className="block text-gray-300 mb-2">Full Name</label>
                  <input type="text" id="fullName" name="fullName" value={bookingDetails.fullName} onChange={handleBookingFormChange} className="w-full bg-gray-800 text-white p-3 rounded-xl border border-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-400/50" required />
                </div>
                <div>
                  <label htmlFor="email" className="block text-gray-300 mb-2">Email</label>
                  <input type="email" id="email" name="email" value={bookingDetails.email} onChange={handleBookingFormChange} className="w-full bg-gray-800 text-white p-3 rounded-xl border border-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-400/50" required />
                </div>
                <div>
                  <label htmlFor="phoneNumber" className="block text-gray-300 mb-2">Phone (Optional)</label>
                  <input type="tel" id="phoneNumber" name="phoneNumber" value={bookingDetails.phoneNumber} onChange={handleBookingFormChange} className="w-full bg-gray-800 text-white p-3 rounded-xl border border-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-400/50" />
                </div>
                <div>
                  <label htmlFor="specialRequests" className="block text-gray-300 mb-2">Special Requests (Optional)</label>
                  <textarea id="specialRequests" name="specialRequests" value={bookingDetails.specialRequests} onChange={handleBookingFormChange} className="w-full bg-gray-800 text-white p-3 rounded-xl border border-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-400/50 resize-none" rows="3"></textarea>
                </div>
                <button type="submit" className="w-full mt-6 p-4 text-black font-bold text-lg bg-cyan-400 rounded-xl shadow-lg hover:shadow-cyan-400/50 transition-all transform hover:scale-105" disabled={isLoading}>
                  {isLoading ? "Processing..." : "Confirm & Book"}
                </button>
              </form>
            </div>
          </div>
        )}

        {isAlertModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-50">
            <div className="bg-gray-900/90 backdrop-blur-xl rounded-2xl p-8 w-full max-w-sm relative shadow-2xl border-2 border-red-400 animate-zoom-in">
              <button onClick={hideAlert} className="absolute top-4 right-4 text-red-400 text-3xl font-bold hover:text-red-300">&times;</button>
              <div className="flex flex-col items-center">
                <XCircle className="text-red-400 text-7xl mb-4" />
                <h3 className="text-2xl font-bold text-red-400 mb-4">Error</h3>
                <p className="text-gray-300 text-center mb-6">{alertMessage}</p>
                <button onClick={hideAlert} className="w-full p-3 text-white font-bold text-lg bg-red-600 rounded-xl shadow-lg hover:bg-red-500 transition-colors">Close</button>
              </div>
            </div>
          </div>
        )}
      </div>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700;800&display=swap');
        @keyframes zoom-in { from { opacity: 0; transform: scale(0.9); } to { opacity: 1; transform: scale(1); } }
        .animate-zoom-in { animation: zoom-in 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards; }
        body { font-family: 'Poppins', sans-serif; }
        input[type="date"]::-webkit-calendar-picker-indicator { filter: invert(1); }
        input[type="date"] { color-scheme: dark; }
      `}</style>
    </>
  );
}
