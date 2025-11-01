// src/App.jsx
import React from "react";
import { Routes, Route, useLocation } from "react-router-dom";

// --- Context Providers ---
import { CartProvider } from "./context/CartContext";
import { WishlistProvider } from "./context/WishlistContext";
import { CurrencyProvider } from "./context/CurrencyContext";
import { NotificationProvider } from "./context/NotificationContext";
import { SearchProvider } from "./context/SearchContext";

// --- UI Sections ---
import Header from "./components/ui/custom/Header";
import Hero from "./components/ui/custom/Hero";
import FeaturesSection from "./components/ui/custom/FeaturesSection";
import ExploreSection from "./components/ui/custom/ExploreSection";
import TestimonialsSection from "./components/ui/custom/TestimonialsSection";
import About from "./components/ui/custom/AboutSection";
import CallToAction from "./components/ui/custom/CallToAction";
import FAQSection from "./components/ui/custom/FAQSection";
import NewsletterSection from "./components/ui/custom/NewsletterSection";
import ContactSection from "./components/ui/custom/ContactSection";
import TermsAndConditions from "./components/ui/custom/TermsAndConditions";
import PrivacyPolicy from "./components/ui/custom/PrivacyPolicy";
import Footer3D from "./components/ui/custom/Footer3D";

// --- Pages ---
import DestinationDetails from "./pages/DestinationDetails";
import CreateTrip from "./create-trip";
import SignIn from "./SignIn/SignIn";
import Dashboard from "./dashboard/Dashboard";
import Profile from "./profile/Profile";
import Statistics from "./Statistic/Statistics";
import SubscriptionPage from "./getstarted/SubscriptionPage";
import Product from "./pages/product/product";
import AnnualPage from "./pages/annual/AnnualPage";
import BookingPages from "./bookingPages/Booking1";
import HotelPage from "./bookingPages/HotelPage";
import Train from "./bookingPages/Trainpages/Train";
import Carrent from "./bookingPages/carrent";
import PaymentPage1 from "./pages/PaymentPage";
import Flights from "./bookingPages/flights";
import WeatherPage from "./Weather/weatherpage";
import Chatbot from "./pages/chatbot/chatbot";
import MyTrips from "./dashboard/my-trips";

// --- Food Pages ---
import Food from "./bookingPages/Foodpage/Food";
import AddressForm from "./bookingPages/Foodpage/AddressForm";
import PaymentPage from "./pages/PaymentPage";

// --- Placeholder Component ---
const Placeholder = ({ pageName }) => (
  <div className="text-center p-8 text-2xl font-bold text-gray-500">
    {pageName} Page - Coming Soon
  </div>
);

// --- Home Page Layout ---
const Home = () => (
  <>
    <Hero />
    <FeaturesSection />
    <ExploreSection />
    <TestimonialsSection />
    <About />
    <CallToAction />
    <FAQSection />
    <NewsletterSection />
    <ContactSection />
    <TermsAndConditions />
    <PrivacyPolicy />
    <Footer3D />
  </>
);

// --- App Content ---
const AppContent = () => {
  const location = useLocation();
  const showHeader = location.pathname === "/"; // Show header only on home

  return (
    <>
      {showHeader && <Header />}
      <main className="bg-black text-white min-h-screen">
        <Routes>
          {/* Home */}
          <Route path="/" element={<Home />} />

          {/* Sections */}
          <Route path="/explore" element={<ExploreSection />} />

          {/* Booking & Travel */}
          <Route path="/booking" element={<BookingPages />} />
          <Route path="/hotels" element={<HotelPage />} />
          <Route path="/flights" element={<Flights />} />
          <Route path="/train" element={<Train />} />
          <Route path="/carrent" element={<Carrent />} />
          <Route path="/bikes" element={<Placeholder pageName="Bikes" />} />
          <Route path="/food" element={<Food />} />
          <Route path="/food/address" element={<AddressForm />} />
          <Route path="/food/payment" element={<PaymentPage />} />
          <Route path="/guides" element={<Placeholder pageName="Guides" />} />
          <Route path="/taxi" element={<Placeholder pageName="Taxi" />} />
          <Route path="/weather" element={<WeatherPage />} />

          {/* Chatbot */}
          <Route path="/chatbot" element={<Chatbot />} />

          {/* Other Pages */}
          <Route path="/create-trip" element={<CreateTrip />} />
          <Route path="/signin" element={<SignIn />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/my-trips" element={<MyTrips />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/statistics" element={<Statistics />} />
          <Route path="/getstarted" element={<SubscriptionPage />} />
          <Route path="/annual" element={<AnnualPage />} />
          <Route path="/product" element={<Product />} />
          <Route path="/payment" element={<PaymentPage1 />} />

          {/* Placeholder Pages */}
          <Route path="/about" element={<Placeholder pageName="About" />} />
          <Route path="/contact" element={<Placeholder pageName="Contact" />} />
          <Route path="/destination/:id" element={<DestinationDetails />} />

          {/* Fallback */}
          <Route path="*" element={<Placeholder pageName="404 Not Found" />} />
        </Routes>
      </main>
    </>
  );
};

// --- Main App Wrapper ---
const App = () => {
  return (
    <CurrencyProvider>
      <NotificationProvider>
        <SearchProvider>
          <WishlistProvider>
            <CartProvider>
              <AppContent />
            </CartProvider>
          </WishlistProvider>
        </SearchProvider>
      </NotificationProvider>
    </CurrencyProvider>
  );
};

export default App;
