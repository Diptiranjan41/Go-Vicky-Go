import React, { useState, useEffect, useRef, Suspense } from 'react';
import {
    Send, Bot, User, MapPin, Calendar, Plane, Briefcase, Luggage, Globe, ImageIcon, Loader2, ShieldCheck, Star, CreditCard, Volume2, MoreVertical
} from 'lucide-react';
import i18n from 'i18next';
import { useTranslation, initReactI18next, I18nextProvider } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// --- I18N CONFIGURATION ---
const resources = {
  en: {
    translation: {
      // General
      "searching": "Searching...",
      "goVickyGoIsTyping": "GoVickyGo is typing",
      "typeYourMessage": "Type your message...",
      // Booking Form
      "hotelBookingTitle": "Hotel Booking",
      "flightBookingTitle": "Flight Booking",
      "destinationPlaceholder": "Destination",
      "departureCityPlaceholder": "Departure City",
      "destinationCityPlaceholder": "Destination City",
      "searchHotels": "Search Hotels",
      "searchFlights": "Search Flights",
      "bookingSuccessMessage": "Your {{type}} booking request for {{details}} has been received!",
      "hotel": "hotel",
      "flight": "flight",
      "unknownDestination": "Unknown destination",
      "unknownOrigin": "Unknown origin",
      "unknownDate": "unknown date",
      // Dashboard
      "dashboardTitle": "Your Travel Dashboard",
      "myBookings": "My Bookings",
      "preferences": "Preferences",
      "account": "Account",
      "viewDetails": "View Details",
      "travelPreferences": "Travel Preferences",
      "prefSeat": "✈️ Preferred seat: Window",
      "prefRoom": "🏨 Room type: Non-smoking",
      "prefDiet": "🍽️ Dietary: Vegetarian",
      "prefAccess": "♿ Accessibility needs: None",
      "paymentMethods": "Payment Methods",
      "visaEndingIn": "💳 Visa ending in 4242",
      "mastercardEndingIn": "💳 Mastercard ending in 5555",
      "accountInfo": "Account Information",
      "name": "Name",
      "email": "Email",
      "memberSince": "Member since",
      "subscription": "Subscription",
      "premiumMembership": "Premium Membership",
      // AI Planner
      "aiPlannerTitle": "AI Trip Planner",
      "aiPlannerPrompt": "Tell me your destination, travel dates, budget, and interests, and I'll create a custom itinerary for you!",
      "aiPlannerInterestsPlaceholder": "What are your interests? (e.g., museums, food, hiking)",
      "createMyItinerary": "Create My Itinerary",
      // Chat Input & Quick Actions
      "packingList": "Packing List",
      "localPhrases": "Local Phrases",
      // Bot Initial & Common Responses
      "botWelcome": "✨ Hello! I'm your GoVickyGo AI travel assistant. How can I help with your travel plans today? ✈️",
      "aboutUs": `Welcome to GoVickyGo - Your Ultimate Travel Companion! ✈️\n\n• All-in-one travel platform\n• AI-powered trip planning\n• Real-time bookings for flights, hotels, and more\n• Personalized recommendations\n• 24/7 virtual assistant\n\nStart exploring at [GoVickyGo website]`,
      "weatherChecking": "Checking weather for {{location}}... Looks perfect for adventure! ☀️",
      "bookHotelPrompt": "Let's find you a great hotel! 🏨 Please share your destination and dates.",
      "bookFlightPrompt": "Ready for takeoff? ✈️ Share your departure, destination, and travel dates.",
      "planTripPrompt": "I'll create your perfect itinerary! ✨ Tell me your budget and travel preferences.",
      "dashboardAccess": "Accessing your travel dashboard...",
      "loginRequired": "Please log in to view your dashboard. 🔐",
      "loginSuccess": "Welcome back! Your travel adventures await. 💫",
      "technicalDifficulties": "I'm having technical difficulties. Please try again later. ⚡",
      "processingError": "Sorry, I couldn't process that. Let's try something else! 🤖",
    }
  },
  'en-US': {
    translation: {
      "hotelBookingTitle": "Hotel Reservation",
      "dashboardTitle": "Your Travel Dashboard",
      "myBookings": "My Reservations",
    }
  },
  hi: {
    translation: {
      "searching": "खोज रहा है...",
      "goVickyGoIsTyping": "गोविकीगो टाइप कर रहा है",
      "typeYourMessage": "अपना संदेश टाइप करें...",
      "hotelBookingTitle": "होटल बुकिंग",
      "flightBookingTitle": "उड़ान बुकिंग",
      "destinationPlaceholder": "गंतव्य",
      "departureCityPlaceholder": "प्रस्थान शहर",
      "destinationCityPlaceholder": "गंतव्य शहर",
      "searchHotels": "होटल खोजें",
      "searchFlights": "उड़ानें खोजें",
      "bookingSuccessMessage": "{{details}} के लिए आपका {{type}} बुकिंग अनुरोध प्राप्त हो गया है!",
      "hotel": "होटल",
      "flight": "उड़ान",
      "dashboardTitle": "आपका यात्रा डैशबोर्ड",
      "myBookings": "मेरी बुकिंग",
      "preferences": "वरीयताएँ",
      "account": "खाता",
      "viewDetails": "विवरण देखें",
      "travelPreferences": "यात्रा वरीयताएँ",
      "paymentMethods": "भुगतान विधियाँ",
      "accountInfo": "खाता जानकारी",
      "name": "नाम",
      "email": "ईमेल",
      "memberSince": "सदस्य जबसे",
      "subscription": "सदस्यता",
      "premiumMembership": "प्रीमियम सदस्यता",
      "aiPlannerTitle": "एआई यात्रा योजनाकार",
      "createMyItinerary": "मेरी यात्रा कार्यक्रम बनाएँ",
      "packingList": "पैकिंग सूची",
      "localPhrases": "स्थानीय वाक्यांश",
      "botWelcome": "✨ नमस्ते! मैं आपका गोविकीगो एआई यात्रा सहायक हूँ। आज मैं आपकी यात्रा योजनाओं में कैसे मदद कर सकता हूँ? ✈️"
    }
  },
  th: {
    translation: {
      "searching": "กำลังค้นหา...",
      "goVickyGoIsTyping": "GoVickyGo กำลังพิมพ์",
      "typeYourMessage": "พิมพ์ข้อความของคุณ...",
      "hotelBookingTitle": "การจองโรงแรม",
      "flightBookingTitle": "การจองเที่ยวบิน",
      "destinationPlaceholder": "จุดหมายปลายทาง",
      "departureCityPlaceholder": "เมืองต้นทาง",
      "destinationCityPlaceholder": "เมืองปลายทาง",
      "searchHotels": "ค้นหาโรงแรม",
      "searchFlights": "ค้นหาเที่ยวบิน",
      "bookingSuccessMessage": "ได้รับคำขอจอง {{type}} ของคุณสำหรับ {{details}} แล้ว!",
      "hotel": "โรงแรม",
      "flight": "เที่ยวบิน",
      "dashboardTitle": "แดชบอร์ดการเดินทางของคุณ",
      "myBookings": "การจองของฉัน",
      "preferences": "ค่าที่ตั้งไว้",
      "account": "บัญชี",
      "viewDetails": "ดูรายละเอียด",
      "travelPreferences": "ค่าที่ตั้งการเดินทาง",
      "paymentMethods": "วิธีการชำระเงิน",
      "accountInfo": "ข้อมูลบัญชี",
      "name": "ชื่อ",
      "email": "อีเมล",
      "memberSince": "สมาชิกตั้งแต่",
      "subscription": "การสมัครสมาชิก",
      "premiumMembership": "สมาชิกระดับพรีเมียม",
      "aiPlannerTitle": "ผู้วางแผนการเดินทาง AI",
      "createMyItinerary": "สร้างแผนการเดินทางของฉัน",
      "packingList": "รายการแพ็คของ",
      "localPhrases": "วลีท้องถิ่น",
      "botWelcome": "✨ สวัสดี! ฉันคือผู้ช่วยเดินทาง AI ของ GoVickyGo วันนี้ฉันจะช่วยวางแผนการเดินทางของคุณได้อย่างไร? ✈️"
    }
  },
  or: {
    translation: {
      "searching": "ସନ୍ଧାନ କରୁଛି...",
      "goVickyGoIsTyping": "ଗୋଭିକିଗୋ ଟାଇପ୍ କରୁଛି",
      "typeYourMessage": "ଆପଣଙ୍କ ସନ୍ଦେଶ ଟାଇପ୍ କରନ୍ତୁ...",
      "hotelBookingTitle": "ହୋଟେଲ ବୁକିଂ",
      "flightBookingTitle": "ବିମାନ ବୁକିଂ",
      "destinationPlaceholder": "ଗନ୍ତବ୍ୟସ୍ଥଳ",
      "departureCityPlaceholder": "ପ୍ରସ୍ଥାନ ସହର",
      "destinationCityPlaceholder": "ଗନ୍ତବ୍ୟ ସହର",
      "searchHotels": "ହୋଟେଲ ଖୋଜନ୍ତୁ",
      "searchFlights": "ବିମାନ ଖୋଜନ୍ତୁ",
      "bookingSuccessMessage": "{{details}} ପାଇଁ ଆପଣଙ୍କର {{type}} ବୁକିଂ ଅନୁରୋଧ ଗ୍ରହଣ କରାଯାଇଛି!",
      "hotel": "ହୋଟେଲ",
      "flight": "ବିମାନ",
      "dashboardTitle": "ଆପଣଙ୍କ ଯାତ୍ରା ଡ୍ୟାସବୋର୍ଡ",
      "myBookings": "ମୋର ବୁକିଂ",
      "preferences": "ପସନ୍ଦ",
      "account": "ଖାତା",
      "viewDetails": "ବିବରଣୀ ଦେଖନ୍ତୁ",
      "travelPreferences": "ଯାତ୍ରା ପସନ୍ଦ",
      "paymentMethods": "ଦେୟ ପଦ୍ଧତି",
      "accountInfo": "ଖାତା ସୂଚନା",
      "name": "ନାମ",
      "email": "ଇମେଲ୍",
      "memberSince": "ସଦସ୍ୟତା ଆରମ୍ଭ",
      "subscription": "ଚଳନ୍ତି ଯୋଜନା",
      "premiumMembership": "ପ୍ରିମିୟମ୍ ସଦସ୍ୟତା",
      "aiPlannerTitle": "AI ଯାତ୍ରା ଯୋଜନାକାରୀ",
      "createMyItinerary": "ମୋର ଯାତ୍ରା ଯୋଜନା ପ୍ରସ୍ତୁତ କରନ୍ତୁ",
      "packingList": "ପ୍ୟାକିଂ ତାଲିକା",
      "localPhrases": "ସ୍ଥାନୀୟ ଶବ୍ଦ",
      "botWelcome": "✨ ନମସ୍କାର! ମୁଁ ଆପଣଙ୍କ ଗୋଭିକିଗୋ AI ଯାତ୍ରା ସହାୟକ। ଆଜି ମୁଁ ଆପଣଙ୍କ ଯାତ୍ରା ଯୋଜନାରେ କିପରି ସାହାଯ୍ୟ କରିପାରେ? ✈️"
    }
  }
};

i18n
  .use(initReactI18next)
  .use(LanguageDetector)
  .init({
    resources,
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false,
    },
  });

const apiKey = typeof __api_key !== 'undefined' ? __api_key : 'AIzaSyCGSaYmZuKOeJGldUgl-4HM2CXbG74Qh64';

const BookingForm = ({ type }) => {
    const { t } = useTranslation();
    const [formData, setFormData] = useState({
        destination: '',
        checkInDate: '',
        checkOutDate: '',
        origin: '',
        departureDate: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [bookingStatus, setBookingStatus] = useState('');

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        
        setTimeout(() => {
            const details = type === 'hotel'
                ? `${formData.destination || t('unknownDestination')} from ${formData.checkInDate || t('unknownDate')} to ${formData.checkOutDate || t('unknownDate')}`
                : `${formData.origin || t('unknownOrigin')} to ${formData.destination || t('unknownDestination')} on ${formData.departureDate || t('unknownDate')}`;
            
            setBookingStatus(t('bookingSuccessMessage', { type: t(type), details }));
            setIsSubmitting(false);
        }, 1500);
    };

    return (
        <div className="p-6 bg-gray-800 rounded-xl m-4">
            <h2 className="text-2xl font-bold text-[oklch(78.9%_0.154_211.53)] mb-6">
                {type === 'hotel' ? t('hotelBookingTitle') : t('flightBookingTitle')}
            </h2>
            
            <form onSubmit={handleSubmit} className="space-y-4">
                {type === 'hotel' ? (
                    <>
                        <div className="relative">
                            <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[oklch(78.9%_0.154_211.53)]" />
                            <input
                                type="text"
                                name="destination"
                                value={formData.destination}
                                onChange={handleInputChange}
                                placeholder={t('destinationPlaceholder')}
                                className="w-full pl-10 p-3 rounded-full bg-gray-900 text-white placeholder-gray-500 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-[oklch(78.9%_0.154_211.53)]"
                                required
                            />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="relative">
                                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[oklch(78.9%_0.154_211.53)]" />
                                <input
                                    type="date"
                                    name="checkInDate"
                                    value={formData.checkInDate}
                                    onChange={handleInputChange}
                                    className="w-full pl-10 p-3 rounded-full bg-gray-900 text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-[oklch(78.9%_0.154_211.53)]"
                                    required
                                />
                            </div>
                            <div className="relative">
                                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[oklch(78.9%_0.154_211.53)]" />
                                <input
                                    type="date"
                                    name="checkOutDate"
                                    value={formData.checkOutDate}
                                    onChange={handleInputChange}
                                    className="w-full pl-10 p-3 rounded-full bg-gray-900 text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-[oklch(78.9%_0.154_211.53)]"
                                    required
                                />
                            </div>
                        </div>
                    </>
                ) : (
                    <>
                        <div className="relative">
                            <Plane className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[oklch(78.9%_0.154_211.53)]" />
                            <input
                                type="text"
                                name="origin"
                                value={formData.origin}
                                onChange={handleInputChange}
                                placeholder={t('departureCityPlaceholder')}
                                className="w-full pl-10 p-3 rounded-full bg-gray-900 text-white placeholder-gray-500 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-[oklch(78.9%_0.154_211.53)]"
                                required
                            />
                        </div>
                        <div className="relative">
                            <Plane className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[oklch(78.9%_0.154_211.53)] rotate-90" />
                            <input
                                type="text"
                                name="destination"
                                value={formData.destination}
                                onChange={handleInputChange}
                                placeholder={t('destinationCityPlaceholder')}
                                className="w-full pl-10 p-3 rounded-full bg-gray-900 text-white placeholder-gray-500 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-[oklch(78.9%_0.154_211.53)]"
                                required
                            />
                        </div>
                        <div className="relative">
                            <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[oklch(78.9%_0.154_211.53)]" />
                            <input
                                type="date"
                                name="departureDate"
                                value={formData.departureDate}
                                onChange={handleInputChange}
                                className="w-full pl-10 p-3 rounded-full bg-gray-900 text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-[oklch(78.9%_0.154_211.53)]"
                                required
                            />
                        </div>
                    </>
                )}
                
                <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`w-full p-3 rounded-full font-medium transition-colors ${
                        isSubmitting
                            ? 'bg-gray-700 cursor-not-allowed'
                            : 'bg-[oklch(78.9%_0.154_211.53)] hover:bg-[oklch(78.9%_0.154_211.53)]/90'
                    }`}
                >
                    {isSubmitting ? (
                        <span className="flex items-center justify-center gap-2">
                            <Loader2 className="animate-spin" size={18} />
                            {t('searching')}
                        </span>
                    ) : (
                        type === 'hotel' ? t('searchHotels') : t('searchFlights')
                    )}
                </button>
            </form>
            
            {bookingStatus && (
                <div className="mt-6 p-4 bg-[oklch(78.9%_0.154_211.53)]/20 rounded-lg flex items-center gap-2">
                    <ShieldCheck className="text-[oklch(78.9%_0.154_211.53)]" />
                    <span>{bookingStatus}</span>
                </div>
            )}
        </div>
    );
};

const Dashboard = () => {
    const { t } = useTranslation();
    const [activeTab, setActiveTab] = useState('bookings');

    return (
        <div className="p-6 bg-gray-800 rounded-xl m-4">
            <h2 className="text-2xl font-bold text-[oklch(78.9%_0.154_211.53)] mb-6">{t('dashboardTitle')}</h2>
            
            <div className="flex border-b border-gray-700 mb-6">
                <button
                    onClick={() => setActiveTab('bookings')}
                    className={`px-4 py-2 font-medium ${activeTab === 'bookings' ? 'text-[oklch(78.9%_0.154_211.53)] border-b-2 border-[oklch(78.9%_0.154_211.53)]' : 'text-gray-400 hover:text-white'}`}
                >
                    {t('myBookings')}
                </button>
                <button
                    onClick={() => setActiveTab('preferences')}
                    className={`px-4 py-2 font-medium ${activeTab === 'preferences' ? 'text-[oklch(78.9%_0.154_211.53)] border-b-2 border-[oklch(78.9%_0.154_211.53)]' : 'text-gray-400 hover:text-white'}`}
                >
                    {t('preferences')}
                </button>
                <button
                    onClick={() => setActiveTab('account')}
                    className={`px-4 py-2 font-medium ${activeTab === 'account' ? 'text-[oklch(78.9%_0.154_211.53)] border-b-2 border-[oklch(78.9%_0.154_211.53)]' : 'text-gray-400 hover:text-white'}`}
                >
                    {t('account')}
                </button>
            </div>
            
            {activeTab === 'bookings' && (
                <div className="space-y-4">
                    <div className="p-4 bg-gray-900 rounded-lg border border-gray-700">
                        <div className="flex items-center justify-between mb-2">
                            <h3 className="font-medium flex items-center gap-2">
                                <Briefcase className="text-[oklch(78.9%_0.154_211.53)]" /> Paris Trip
                            </h3>
                            <span className="text-sm text-gray-400">Oct 25-28, 2023</span>
                        </div>
                        <button className="mt-4 text-[oklch(78.9%_0.154_211.53)] hover:underline text-sm">{t('viewDetails')}</button>
                    </div>
                </div>
            )}
            
            {activeTab === 'preferences' && (
                <div className="space-y-6">
                    <div>
                        <h3 className="font-medium mb-2 flex items-center gap-2">
                            <Star className="text-[oklch(78.9%_0.154_211.53)]" /> {t('travelPreferences')}
                        </h3>
                        <div className="p-4 bg-gray-900 rounded-lg border border-gray-700">
                            <p className="mb-2">{t('prefSeat')}</p>
                            <p className="mb-2">{t('prefRoom')}</p>
                            <p className="mb-2">{t('prefDiet')}</p>
                            <p>{t('prefAccess')}</p>
                        </div>
                    </div>
                    <div>
                        <h3 className="font-medium mb-2 flex items-center gap-2">
                            <CreditCard className="text-[oklch(78.9%_0.154_211.53)]" /> {t('paymentMethods')}
                        </h3>
                        <div className="p-4 bg-gray-900 rounded-lg border border-gray-700">
                            <p className="mb-2">{t('visaEndingIn')}</p>
                            <p>{t('mastercardEndingIn')}</p>
                        </div>
                    </div>
                </div>
            )}
            
            {activeTab === 'account' && (
                <div className="space-y-6">
                    <div>
                        <h3 className="font-medium mb-2 flex items-center gap-2">
                            <User className="text-[oklch(78.9%_0.154_211.53)]" /> {t('accountInfo')}
                        </h3>
                        <div className="p-4 bg-gray-900 rounded-lg border border-gray-700 space-y-3">
                            <div><p className="text-gray-400 text-sm">{t('name')}</p><p>Travel Enthusiast</p></div>
                            <div><p className="text-gray-400 text-sm">{t('email')}</p><p>traveler@example.com</p></div>
                            <div><p className="text-gray-400 text-sm">{t('memberSince')}</p><p>January 2022</p></div>
                        </div>
                    </div>
                    <div>
                        <h3 className="font-medium mb-2 flex items-center gap-2">
                            <ShieldCheck className="text-[oklch(78.9%_0.154_211.53)]" /> {t('subscription')}
                        </h3>
                        <div className="p-4 bg-gray-900 rounded-lg border border-gray-700">
                            <p>{t('premiumMembership')}</p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

const AIPlanner = () => {
    const { t } = useTranslation();
    return (
        <div className="p-6 bg-gray-800 rounded-xl m-4">
            <h2 className="text-2xl font-bold text-[oklch(78.9%_0.154_211.53)] mb-6">{t('aiPlannerTitle')}</h2>
            <div className="space-y-4">
                <p className="text-gray-300">{t('aiPlannerPrompt')}</p>
                <form className="space-y-4">
                    <div className="relative">
                        <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[oklch(78.9%_0.154_211.53)]" />
                        <input type="text" placeholder={t('destinationPlaceholder')} className="w-full pl-10 p-3 rounded-full bg-gray-900 text-white placeholder-gray-500 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-[oklch(78.9%_0.154_211.53)]" />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="relative">
                            <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[oklch(78.9%_0.154_211.53)]" />
                            <input type="date" className="w-full pl-10 p-3 rounded-full bg-gray-900 text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-[oklch(78.9%_0.154_211.53)]" />
                        </div>
                        <div className="relative">
                            <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[oklch(78.9%_0.154_211.53)]" />
                            <input type="date" className="w-full pl-10 p-3 rounded-full bg-gray-900 text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-[oklch(78.9%_0.154_211.53)]" />
                        </div>
                    </div>
                    <textarea placeholder={t('aiPlannerInterestsPlaceholder')} rows="3" className="w-full p-3 rounded-lg bg-gray-900 text-white placeholder-gray-500 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-[oklch(78.9%_0.154_211.53)]" />
                    <button type="submit" className="w-full p-3 rounded-full font-medium transition-colors bg-[oklch(78.9%_0.154_211.53)] hover:bg-[oklch(78.9%_0.154_211.53)]/90">
                        {t('createMyItinerary')}
                    </button>
                </form>
            </div>
        </div>
    );
};

const Message = ({ text, sender, image, onPlayAudio, isAudioLoading }) => (
    <div className={`flex ${sender === 'user' ? 'justify-end' : 'justify-start'} px-4 py-2`}>
        <div className={`max-w-[85%] p-4 rounded-xl ${sender === 'user' ? 'bg-[oklch(78.9%_0.154_211.53)]/20 border border-[oklch(78.9%_0.154_211.53)]/40 rounded-br-none' : 'bg-gray-800 border border-gray-700 rounded-bl-none'}`}>
            <div className="flex items-start gap-3">
                <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${sender === 'user' ? 'bg-[oklch(78.9%_0.154_211.53)]' : 'bg-gray-700'}`}>
                    {sender === 'user' ? <User size={18} className="text-white" /> : <Bot size={18} className="text-[oklch(78.9%_0.154_211.53)]" />}
                </div>
                <div className="flex-1 min-w-0">
                    {image && <img src={image} alt="Uploaded content" className="w-full max-h-64 object-contain rounded-lg mb-3 border border-gray-700" />}
                    <p className="whitespace-pre-wrap break-words text-gray-100 leading-relaxed">{text}</p>
                </div>
                {sender === 'bot' && onPlayAudio && (
                    <button 
                        onClick={() => onPlayAudio(text)} 
                        disabled={isAudioLoading}
                        className="ml-2 p-2 rounded-full bg-gray-700 hover:bg-gray-600 text-[oklch(78.9%_0.154_211.53)] transition-colors disabled:cursor-not-allowed disabled:opacity-50" 
                        aria-label="Play message"
                    >
                        {isAudioLoading ? <Loader2 size={18} className="animate-spin" /> : <Volume2 size={18} />}
                    </button>
                )}
            </div>
        </div>
    </div>
);

const TypingIndicator = () => {
    const { t } = useTranslation();
    return (
        <div className="flex items-center gap-3 bg-gray-800 p-4 rounded-xl rounded-bl-none max-w-xs border border-gray-700">
            <div className="flex space-x-1">
                <div className="w-2 h-2 rounded-full bg-[oklch(78.9%_0.154_211.53)] animate-bounce" style={{ animationDelay: '0ms' }} />
                <div className="w-2 h-2 rounded-full bg-[oklch(78.9%_0.154_211.53)] animate-bounce" style={{ animationDelay: '150ms' }} />
                <div className="w-2 h-2 rounded-full bg-[oklch(78.9%_0.154_211.53)] animate-bounce" style={{ animationDelay: '300ms' }} />
            </div>
            <span className="text-gray-400 text-sm">{t('goVickyGoIsTyping')}</span>
        </div>
    );
};

const ChatInput = ({ input, setInput, handleSendMessage, isTyping, setImageFile, showMenu, setShowMenu, menuRef, getBotResponse }) => {
    const { t } = useTranslation();
    const fileInputRef = useRef(null);

    const handleImageClick = () => fileInputRef.current?.click();

    const handleFileChange = (e) => {
        const file = e.target.files?.[0];
        if (file) setImageFile(file);
    };

    const handleQuickAction = (action) => {
        setShowMenu(false);
        getBotResponse(action);
    };

    return (
        <form onSubmit={handleSendMessage} className="p-4 bg-black border-t border-[oklch(78.9%_0.154_211.53)]/20">
            <div className="flex items-center gap-3">
                <div className="relative" ref={menuRef}>
                    <button type="button" onClick={() => setShowMenu(!showMenu)} className="p-3 rounded-full bg-gray-900 hover:bg-gray-800 text-[oklch(78.9%_0.154_211.53)] transition-colors" aria-label="Quick actions">
                        <MoreVertical size={20} />
                    </button>
                    {showMenu && (
                        <div className="absolute bottom-full left-0 mb-2 w-48 bg-gray-900 rounded-lg shadow-xl border border-[oklch(78.9%_0.154_211.53)]/30 z-10">
                            <button type="button" onClick={() => handleQuickAction('packing list for a trip')} className="w-full text-left flex items-center gap-2 p-3 hover:bg-gray-800 transition-colors">
                                <Luggage size={18} className="text-[oklch(78.9%_0.154_211.53)]" />
                                <span>{t('packingList')}</span>
                            </button>
                            <button type="button" onClick={() => handleQuickAction('local phrases for a new place')} className="w-full text-left flex items-center gap-2 p-3 hover:bg-gray-800 transition-colors">
                                <Globe size={18} className="text-[oklch(78.9%_0.154_211.53)]" />
                                <span>{t('localPhrases')}</span>
                            </button>
                        </div>
                    )}
                </div>
                
                <button type="button" onClick={handleImageClick} className="p-3 rounded-full bg-gray-900 hover:bg-gray-800 text-[oklch(78.9%_0.154_211.53)] transition-colors" aria-label="Upload image">
                    <ImageIcon size={20} />
                </button>
                
                <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" className="hidden" />
                
                <input 
                    type="text" 
                    value={input} 
                    onChange={(e) => setInput(e.target.value)} 
                    placeholder={isTyping ? t('goVickyGoIsTyping') : t('typeYourMessage')} 
                    disabled={isTyping} 
                    className="flex-1 p-3 rounded-full bg-gray-900 text-white placeholder-gray-500 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-[oklch(78.9%_0.154_211.53)]" 
                />
                
                <button 
                    type="submit" 
                    disabled={isTyping || (!input.trim() && !fileInputRef.current?.files?.length)} 
                    className={`p-3 rounded-full transition-colors ${isTyping || (!input.trim() && !fileInputRef.current?.files?.length) ? 'bg-gray-800 cursor-not-allowed' : 'bg-[oklch(78.9%_0.154_211.53)] hover:bg-[oklch(78.9%_0.154_211.53)]/90'}`} 
                    aria-label="Send message"
                >
                    <Send size={20} className="text-white" />
                </button>
            </div>
        </form>
    );
};

const LanguageSwitcher = () => {
    const { i18n } = useTranslation();

    const changeLanguage = (lng) => {
        i18n.changeLanguage(lng);
    };

    const languages = [
        { code: 'en', name: 'English' },
        { code: 'en-US', name: 'USA' },
        { code: 'hi', name: 'हिन्दी' },
        { code: 'th', name: 'ไทย' },
        { code: 'or', name: 'ଓଡ଼ିଆ' }
    ];

    return (
        <div className="absolute top-4 right-4 z-20 flex gap-2">
            {languages.map(lang => (
                <button 
                    key={lang.code}
                    onClick={() => changeLanguage(lang.code)}
                    className={`px-3 py-1 text-sm rounded-full transition-colors ${i18n.resolvedLanguage === lang.code ? 'bg-[oklch(78.9%_0.154_211.53)] text-white' : 'bg-gray-700 hover:bg-gray-600'}`}
                >
                    {lang.name}
                </button>
            ))}
        </div>
    );
}

const AppCore = () => {
    const { t, i18n } = useTranslation();
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [currentView, setCurrentView] = useState('chat');
    const [userIsAuthenticated, setUserIsAuthenticated] = useState(false);
    const [isTyping, setIsTyping] = useState(false);
    const [imageFile, setImageFile] = useState(null);
    const [audioContext, setAudioContext] = useState(null);
    const [showMenu, setShowMenu] = useState(false);
    const [isAudioLoading, setIsAudioLoading] = useState(false);

    const messagesEndRef = useRef(null);
    const audioRef = useRef(null);
    const menuRef = useRef(null);
    
    useEffect(() => {
        setMessages([{ text: t('botWelcome'), sender: 'bot' }]);
    }, [t]);

    useEffect(() => { scrollToBottom(); }, [messages]);

    useEffect(() => {
        const context = new (window.AudioContext || window.webkitAudioContext)();
        setAudioContext(context);
        return () => { if (context.state !== 'closed') context.close(); };
    }, []);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) setShowMenu(false);
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const base64ToArrayBuffer = (base64) => {
        const binaryString = atob(base64);
        const bytes = new Uint8Array(binaryString.length);
        for (let i = 0; i < binaryString.length; i++) {
            bytes[i] = binaryString.charCodeAt(i);
        }
        return bytes.buffer;
    };

    const pcmToWav = (pcmData, sampleRate) => {
        const buffer = new ArrayBuffer(44 + pcmData.length * 2);
        const view = new DataView(buffer);
        let offset = 0;

        view.setUint32(offset, 0x52494646, false); offset += 4;
        view.setUint32(offset, 36 + pcmData.length * 2, true); offset += 4;
        view.setUint32(offset, 0x57415645, false); offset += 4;
        view.setUint32(offset, 0x666d7420, false); offset += 4;
        view.setUint32(offset, 16, true); offset += 4;
        view.setUint16(offset, 1, true); offset += 2;
        view.setUint16(offset, 1, true); offset += 2;
        view.setUint32(offset, sampleRate, true); offset += 4;
        view.setUint32(offset, sampleRate * 2, true); offset += 4;
        view.setUint16(offset, 2, true); offset += 2;
        view.setUint16(offset, 16, true); offset += 2;
        view.setUint32(offset, 0x64617461, false); offset += 4;
        view.setUint32(offset, pcmData.length * 2, true); offset += 4;

        for (let i = 0; i < pcmData.length; i++, offset += 2) {
            view.setInt16(offset, pcmData[i], true);
        }

        return new Blob([view], { type: 'audio/wav' });
    };

    const playTextToSpeech = async (text) => {
        if (isAudioLoading) {
            console.log("Audio request already in progress.");
            return;
        }
        if (!audioContext || !audioRef.current) {
            console.error("Audio not initialized");
            return;
        }

        setIsAudioLoading(true);
        try {
            const payload = {
                contents: [{ parts: [{ text }] }],
                generationConfig: {
                    responseModalities: ["AUDIO"],
                    speechConfig: {
                        voiceConfig: { prebuiltVoiceConfig: { voiceName: "Puck" } }
                    }
                },
                model: "gemini-2.5-flash-preview-tts"
            };

            const response = await fetch(
                `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-tts:generateContent?key=${apiKey}`,
                {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload)
                }
            );

            if (!response.ok) throw new Error(await response.text());

            const result = await response.json();
            const audioData = result?.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
            const mimeType = result?.candidates?.[0]?.content?.parts?.[0]?.inlineData?.mimeType;

            if (audioData && mimeType?.startsWith("audio/")) {
                const sampleRate = mimeType.match(/rate=(\d+)/)?.[1] || 16000;
                const pcmBuffer = base64ToArrayBuffer(audioData);
                const pcm16 = new Int16Array(pcmBuffer);
                const wavBlob = pcmToWav(pcm16, sampleRate);
                audioRef.current.src = URL.createObjectURL(wavBlob);
                await audioRef.current.play();
            }
        } catch (error) {
            console.error("TTS error:", error);
        } finally {
            setIsAudioLoading(false);
        }
    };

    const scrollToBottom = () => { messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }); };
    
    const convertImageToBase64 = (file) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result.split(',')[1]);
            reader.onerror = reject;
            reader.readAsDataURL(file);
        });
    };

    const getBotResponse = async (userMessage, uploadedImageBase64) => {
        setIsTyping(true);
        let responseText = '';
        let newView = 'chat';
        let data = null;
        let geminiPrompt = '';
        const currentLanguage = i18n.language;

        const lowerCaseMessage = userMessage.toLowerCase();

        if (!apiKey) {
            responseText = t('technicalDifficulties');
            setIsTyping(false);
            setMessages(prev => [...prev, { text: responseText, sender: 'bot', view: newView, data }]);
            return;
        }

        if (lowerCaseMessage.includes('packing list')) {
            const destination = lowerCaseMessage.match(/packing list for (.+)/i)?.[1]?.trim() || 'a trip';
            geminiPrompt = `Generate a detailed packing list for ${destination}. Include categories for clothing, toiletries, electronics, and documents. Respond in ${currentLanguage}.`;
        } else if (lowerCaseMessage.includes('local phrases') || lowerCaseMessage.includes('basic phrases')) {
            const language = lowerCaseMessage.match(/(local|basic) phrases for (.+)/i)?.[2]?.trim() || 'a new place';
            geminiPrompt = `List 10 essential phrases for tourists in ${language} with English translations. Include greetings, questions, and polite expressions. Respond in ${currentLanguage}.`;
        } else if (uploadedImageBase64) {
            geminiPrompt = `Analyze this travel photo and suggest similar destinations with key attractions. Respond in ${currentLanguage}.`;
        } else if (/hello|hi/.test(lowerCaseMessage)) {
            responseText = t('botWelcome');
        } else if (/go vicky go|about your website|website features/.test(lowerCaseMessage)) {
            responseText = t('aboutUs');
        } else if (lowerCaseMessage.includes('weather')) {
            const location = userMessage.match(/weather in ([\w\s]+)/i)?.[1]?.trim() || 'your location';
            responseText = t('weatherChecking', { location });
        } else if (lowerCaseMessage.includes('book hotel')) {
            responseText = t('bookHotelPrompt');
            newView = 'booking';
            data = { type: 'hotel' };
        } else if (lowerCaseMessage.includes('book flight')) {
            responseText = t('bookFlightPrompt');
            newView = 'booking';
            data = { type: 'flight' };
        } else if (lowerCaseMessage.includes('plan a trip')) {
            responseText = t('planTripPrompt');
            newView = 'ai-planner';
        } else if (/my dashboard|my bookings/.test(lowerCaseMessage)) {
            responseText = userIsAuthenticated ? t('dashboardAccess') : t('loginRequired');
            newView = userIsAuthenticated ? 'dashboard' : 'chat';
        } else if (/login|register/.test(lowerCaseMessage)) {
            setUserIsAuthenticated(true);
            responseText = t('loginSuccess');
        } else {
            geminiPrompt = `As a friendly AI travel assistant for GoVickyGo, respond to this travel query with helpful advice and emojis. Respond in ${currentLanguage}. Query: ${userMessage}`;
        }

        if (geminiPrompt) {
            try {
                 const contents = uploadedImageBase64
                    ? [{ role: "user", parts: [{ text: geminiPrompt }, { inlineData: { mimeType: "image/png", data: uploadedImageBase64 } }]}]
                    : [{ role: "user", parts: [{ text: geminiPrompt }] }];
                const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent?key=${apiKey}`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ contents }) });
                if (!response.ok) throw new Error(await response.text());
                const result = await response.json();
                responseText = result.candidates?.[0]?.content?.parts?.[0]?.text || t('processingError');
            } catch (error) {
                console.error("AI error:", error);
                responseText = t('technicalDifficulties');
            }
        }

        setTimeout(() => {
            setMessages(prev => [...prev, { text: responseText, sender: 'bot', view: newView, data }]);
            setCurrentView(newView);
            setIsTyping(false);
        }, 1500);
    };

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!input.trim() && !imageFile) return;

        const userMessage = input.trim();
        let uploadedImageBase64 = null;

        if (imageFile) {
            try {
                uploadedImageBase64 = await convertImageToBase64(imageFile);
                setMessages(prev => [...prev, { 
                    text: 'Image uploaded', 
                    sender: 'user', 
                    image: URL.createObjectURL(imageFile) 
                }]);
                setImageFile(null);
            } catch (error) {
                console.error("Image upload error:", error);
            }
        }

        if (userMessage) {
            setMessages(prev => [...prev, { text: userMessage, sender: 'user' }]);
            setInput('');
        }

        if (userMessage || uploadedImageBase64) {
            await getBotResponse(userMessage, uploadedImageBase64);
        }
    };

    const renderContent = () => {
        const lastMessage = messages[messages.length - 1];
        switch (lastMessage?.view || 'chat') {
            case 'booking': return <BookingForm type={lastMessage.data?.type} />;
            case 'dashboard': return <Dashboard />;
            case 'ai-planner': return <AIPlanner />;
            default:
                return (
                    <div className="flex flex-col h-full">
                        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-900/30">
                            {messages.map((msg, i) => (
                                <Message 
                                    key={i} 
                                    text={msg.text} 
                                    sender={msg.sender} 
                                    image={msg.image} 
                                    onPlayAudio={msg.sender === 'bot' ? playTextToSpeech : null}
                                    isAudioLoading={isAudioLoading}
                                />
                            ))}
                            {isTyping && <TypingIndicator />}
                            <div ref={messagesEndRef} />
                        </div>
                        <ChatInput {...{ input, setInput, handleSendMessage, isTyping, setImageFile, showMenu, setShowMenu, menuRef, getBotResponse }} />
                    </div>
                );
        }
    };

    return (
        <div className="flex flex-col h-screen bg-black text-white relative">
            <LanguageSwitcher />
            <main className="flex-1 flex flex-col overflow-hidden">
                <div className="flex-1 flex flex-col bg-black rounded-xl border border-[oklch(78.9%_0.154_211.53)]/30 overflow-hidden">
                    {renderContent()}
                </div>
            </main>
            <audio ref={audioRef} className="hidden" />
        </div>
    );
};

const App = () => (
    <Suspense fallback="Loading...">
      <I18nextProvider i18n={i18n}>
        <AppCore />
      </I18nextProvider>
    </Suspense>
);

export default App;