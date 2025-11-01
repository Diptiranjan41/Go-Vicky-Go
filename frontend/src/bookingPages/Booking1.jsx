// src/bookingPages/Booking1.jsx
import React from "react";
import { Link } from "react-router-dom";
import {
  FaHotel,
  FaPlaneDeparture,
  FaCarAlt,
  FaMotorcycle,
  FaHamburger,
  FaBus,
  FaTrain,
  FaFacebook,
  FaInstagram,
  FaTwitter,
} from "react-icons/fa";

const pages = [
  { name: "Hotels", path: "/hotels", icon: <FaHotel /> },
  { name: "Flights", path: "/flights", icon: <FaPlaneDeparture /> },
  { name: "Car Rentals", path: "/carrent", icon: <FaCarAlt /> },
  { name: "Bike Rentals", path: "/bikes", icon: <FaMotorcycle /> },
  { name: "Food Delivery", path: "/food", icon: <FaHamburger /> },
  { name: "Trains", path: "/train", icon: <FaTrain /> },
  { name: "Bus", path: "/bus", icon: <FaBus /> },
];

const BookingPages = () => {
  return (
    <div className="min-h-screen bg-black text-white px-6 py-12 font-sans">
      <h1 className="text-4xl font-bold text-center mb-14 text-gray-200">
        Book Smarter. Travel Better.
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10 max-w-6xl mx-auto">
        {pages.map((page) => (
          <Link
            key={page.name}
            to={page.path}
            className="bg-black/40 border border-cyan-400 backdrop-blur-md shadow-lg 
                       hover:shadow-cyan-400/40 hover:bg-cyan-500/10 
                       text-cyan-300 hover:text-white transition-all duration-300 
                       rounded-2xl p-6 flex flex-col items-center text-center"
          >
            <div className="text-5xl mb-4">{page.icon}</div>
            <span className="text-xl font-semibold">{page.name}</span>
          </Link>
        ))}
      </div>

      <section className="max-w-4xl mx-auto mt-20 bg-black/30 border border-cyan-400 p-8 rounded-2xl backdrop-blur-md shadow-lg">
        <h2 className="text-3xl font-bold text-cyan-400 mb-6">Latest Travel Blogs</h2>
        <div className="space-y-4">
          <article>
            <h3 className="text-xl font-semibold text-white">🏔 Exploring the Hidden Gems of Himachal</h3>
            <p className="text-cyan-200 text-sm">
              Discover offbeat villages, serene trails, and local cuisines away from the tourist crowds.
            </p>
          </article>
          <article>
            <h3 className="text-xl font-semibold text-white">🏝 Top 10 Affordable Beach Destinations in India</h3>
            <p className="text-cyan-200 text-sm">
              From Gokarna to Puri, find budget-friendly getaways by the sea with unmatched beauty.
            </p>
          </article>
          <article>
            <h3 className="text-xl font-semibold text-white">🚞 Train Journeys That Redefine Romance</h3>
            <p className="text-cyan-200 text-sm">
              A look into India's scenic train routes that offer a touch of nostalgia and adventure.
            </p>
          </article>
        </div>
      </section>

      <footer className="mt-24 border-t border-cyan-800 pt-10 pb-6 text-center text-cyan-300">
        <p className="text-lg font-bold mb-4">🌍 Go Vicky Go</p>
        <div className="flex justify-center gap-6 mb-4">
          <Link to="/about" className="hover:text-white">About</Link>
          <Link to="/contact" className="hover:text-white">Contact</Link>
          <Link to="/privacy" className="hover:text-white">Privacy Policy</Link>
        </div>
        <div className="flex justify-center gap-5 text-2xl mb-3">
          <a href="#" className="hover:text-white"><FaFacebook /></a>
          <a href="#" className="hover:text-white"><FaInstagram /></a>
          <a href="#" className="hover:text-white"><FaTwitter /></a>
        </div>
        <p className="text-xs">&copy; {new Date().getFullYear()} Go Vicky Go. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default BookingPages;
