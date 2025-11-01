import React, { useState, useEffect } from 'react';
import { Train, Calendar, Users, Armchair, Search, ArrowRight } from 'lucide-react';

// --- SVG Icon Components ---
// (No changes here, SVG components remain the same)
const TrainIcon = ({ className }) => (
  <svg
    className={className}
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    aria-hidden="true"
  >
    <path d="M12 2c-5.52 0-10 .89-10 2v11.5c0 1.93 1.57 3.5 3.5 3.5h13c1.93 0 3.5-1.57 3.5-3.5V4c0-1.11-4.48-2-10-2zm0 2c4.42 0 8 .89 8 2H4c0-1.11 3.58-2 8-2zM4 15.5V8h16v7.5c0 .83-.67 1.5-1.5 1.5h-13C4.67 17 4 16.33 4 15.5z" />
    <path d="M6 20c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm12 0c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z" />
    <rect x="11" y="9" width="2" height="4" rx="1" />
  </svg>
);


// --- Mock API Data ---
// Added a "Waitlisted" train to demonstrate the new neon effect on all button types
const mockTrainResults = [
  {
    trainName: "Vande Bharat Express",
    trainNumber: "22436",
    departureStation: "Mumbai",
    arrivalStation: "Delhi",
    departureTime: "06:00 AM",
    arrivalTime: "01:45 PM",
    duration: "7h 45m",
    price: 2180,
    availability: "Available",
  },
  {
    trainName: "Rajdhani Express",
    trainNumber: "12951",
    departureStation: "Mumbai",
    arrivalStation: "Delhi",
    departureTime: "05:00 PM",
    arrivalTime: "08:35 AM",
    duration: "15h 35m",
    price: 2870,
    availability: "Available",
  },
  {
    trainName: "Duronto Express",
    trainNumber: "12260",
    departureStation: "Mumbai",
    arrivalStation: "Delhi",
    departureTime: "11:00 PM",
    arrivalTime: "04:00 PM",
    duration: "17h 0m",
    price: 2550,
    availability: "Waitlisted",
  },
];

// --- Main App Component ---
export default function App() {
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(true);
  const [searchCriteria, setSearchCriteria] = useState(null);

  const handleSearch = (formData) => {
    setSearchCriteria(formData);
    setSearchResults(mockTrainResults);
    setIsSearching(false);
  };

  const handleNewSearch = () => {
    setIsSearching(true);
    setSearchResults([]);
    setSearchCriteria(null);
  }

  return (
    <>
      <div className="min-h-screen w-full bg-black text-white">
        {isSearching ? (
          <HeroSection onSearch={handleSearch} />
        ) : (
          <TrainResultsPage 
            trains={searchResults} 
            searchCriteria={searchCriteria}
            onNewSearch={handleNewSearch}
          />
        )}
      </div>
      <GlobalStyles />
    </>
  );
}

// --- Hero Section Component ---
const HeroSection = ({ onSearch }) => {
  return (
    <div 
      className="relative w-full min-h-screen p-4 sm:p-8 flex flex-col items-center justify-center bg-black" 
    >
      <div className="w-full max-w-5xl text-center mb-8 pt-20">
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-cyan-400 animate-pulse">
          GoVicky Trains
        </h1>
        <p className="mt-4 text-gray-300 text-lg sm:text-xl">
          Your Journey, Your Way. Book Indian Railways tickets swiftly.
        </p>
      </div>
      <div className="w-full max-w-5xl p-4 sm:p-8 rounded-2xl shadow-2xl border-2 border-cyan-400 bg-gray-950/50 backdrop-blur-md">
        <TrainSearchForm onSearch={onSearch} />
      </div>
    </div>
  );
};

// --- Train Search Results Page ---
const TrainResultsPage = ({ trains, searchCriteria, onNewSearch }) => {
    const [filteredTrains, setFilteredTrains] = useState(trains);
    const [sortType, setSortType] = useState('departureTime');

    useEffect(() => {
        let processedTrains = [...trains];
        processedTrains.sort((a, b) => {
            switch (sortType) {
                case 'price': return a.price - b.price;
                case 'duration': return a.duration.localeCompare(b.duration);
                default: return a.departureTime.localeCompare(b.departureTime);
            }
        });
        setFilteredTrains(processedTrains);
    }, [trains, sortType]);

    return (
        <div className="w-full min-h-screen p-4 sm:p-8 flex flex-col items-center bg-black pt-24">
            <div className="w-full max-w-6xl">
                <div className="bg-gray-800 p-4 rounded-xl mb-8 flex flex-col md:flex-row justify-between items-center gap-4">
                    <div>
                        <h2 className="text-2xl font-bold text-cyan-400">{searchCriteria.from} → {searchCriteria.to}</h2>
                        <p className="text-gray-400">{new Date(searchCriteria.date).toDateString()} | {searchCriteria.class}</p>
                    </div>
                    {/* Updated this button with a stronger neon effect */}
                    <button 
                        onClick={onNewSearch} 
                        className="bg-cyan-500 text-black font-bold py-2 px-4 rounded-lg hover:bg-cyan-400 transition-all shadow-lg shadow-cyan-500/50 hover:shadow-xl hover:shadow-cyan-400/60 transform hover:-translate-y-0.5"
                    >
                        Modify Search
                    </button>
                </div>
                <div className="space-y-6">
                    {filteredTrains.map((train, index) => <TrainCard key={index} train={train} />)}
                </div>
            </div>
        </div>
    );
};

const TrainCard = ({ train }) => {
    // Logic to determine button style based on availability
    const isAvailable = train.availability === 'Available';
    const buttonClasses = isAvailable 
        ? 'bg-cyan-500 text-black hover:bg-cyan-400 shadow-lg shadow-cyan-500/50 hover:shadow-xl hover:shadow-cyan-400/60'
        : 'bg-yellow-500 text-black cursor-not-allowed shadow-lg shadow-yellow-500/50 hover:shadow-xl hover:shadow-yellow-400/60';

    return (
        <div className="bg-gray-800 rounded-2xl p-4 sm:p-6 shadow-lg border border-cyan-400/30 transition-all transform hover:-translate-y-1 hover:border-cyan-400">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
                <div className="md:col-span-1">
                    <h3 className="text-xl font-bold text-cyan-400">{train.trainName}</h3>
                    <p className="text-gray-400 font-mono text-sm">#{train.trainNumber}</p>
                </div>
                <div className="md:col-span-2 flex items-center justify-between md:justify-center gap-4">
                    <div className="text-center">
                        <p className="text-lg font-semibold">{train.departureTime}</p>
                        <p className="text-xs text-gray-500">{train.departureStation}</p>
                    </div>
                    <div className="flex flex-col items-center text-cyan-400">
                        <span className="text-xs">{train.duration}</span>
                        <ArrowRight size={20} />
                    </div>
                    <div className="text-center">
                        <p className="text-lg font-semibold">{train.arrivalTime}</p>
                        <p className="text-xs text-gray-500">{train.arrivalStation}</p>
                    </div>
                </div>
                <div className="md:col-span-1 flex flex-col items-center md:items-end gap-2">
                    <p className="text-2xl font-extrabold text-cyan-400">₹{train.price}</p>
                    {/* The className is now constructed with the logic above to apply neon to ALL buttons */}
                    <button className={`w-full md:w-auto px-6 py-2 rounded-lg font-bold transition-all transform hover:-translate-y-0.5 ${buttonClasses}`}>
                        {train.availability}
                    </button>
                </div>
            </div>
        </div>
    );
};

// --- Search Form Component ---
const TrainSearchForm = ({ onSearch }) => {
    const [formData, setFormData] = useState({
        from: 'Mumbai', to: 'Delhi',
        date: new Date(new Date().setDate(new Date().getDate() + 1)).toISOString().split('T')[0],
        adults: 1, children: 0,
        class: 'Sleeper (SL)'
    });

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });
    const handleSubmit = (e) => {
        e.preventDefault();
        onSearch(formData);
    };

    return (
        <form onSubmit={handleSubmit} className="w-full space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                {/* Inputs are unchanged */}
                <div className="w-full">
                    <label htmlFor="from" className="block text-gray-300 mb-2 font-semibold text-sm">From</label>
                    <div className="relative"><Train className="absolute left-3 top-1/2 -translate-y-1/2 text-cyan-400" size={20} /><input type="text" id="from" name="from" value={formData.from} onChange={handleChange} className="w-full bg-gray-800 p-3 pl-10 rounded-xl border border-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-400/50" /></div>
                </div>
                <div className="w-full">
                    <label htmlFor="to" className="block text-gray-300 mb-2 font-semibold text-sm">To</label>
                    <div className="relative"><Train className="absolute left-3 top-1/2 -translate-y-1/2 text-cyan-400" size={20} /><input type="text" id="to" name="to" value={formData.to} onChange={handleChange} className="w-full bg-gray-800 p-3 pl-10 rounded-xl border border-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-400/50" /></div>
                </div>
                <div className="w-full">
                    <label htmlFor="date" className="block text-gray-300 mb-2 font-semibold text-sm">Date</label>
                    <div className="relative"><Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-cyan-400" size={20} /><input type="date" id="date" name="date" value={formData.date} onChange={handleChange} className="w-full bg-gray-800 p-3 pl-10 rounded-xl border border-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-400/50 appearance-none" /></div>
                </div>
                <div className="w-full">
                    <label htmlFor="passengers" className="block text-gray-300 mb-2 font-semibold text-sm">Passengers</label>
                    <div className="relative"><Users className="absolute left-3 top-1/2 -translate-y-1/2 text-cyan-400" size={20} /><input type="text" id="passengers" name="passengers" value={`${formData.adults} Adult${formData.adults > 1 ? 's' : ''}`} readOnly className="w-full bg-gray-800 p-3 pl-10 rounded-xl border border-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-400/50" /></div>
                </div>
                <div className="w-full">
                    <label htmlFor="class" className="block text-gray-300 mb-2 font-semibold text-sm">Class</label>
                    <div className="relative"><Armchair className="absolute left-3 top-1/2 -translate-y-1/2 text-cyan-400" size={20} /><select id="class" name="class" value={formData.class} onChange={handleChange} className="w-full bg-gray-800 p-3 pl-10 rounded-xl border border-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-400/50 appearance-none"><option>Sleeper (SL)</option><option>AC 3 Tier (3A)</option><option>AC 2 Tier (2A)</option><option>First Class (1A)</option></select></div>
                </div>
            </div>
            {/* Updated this button with a stronger neon effect */}
            <button type="submit" className="w-full mt-6 p-3 sm:p-4 text-black font-extrabold text-base sm:text-lg bg-cyan-400 rounded-xl transition-all transform hover:scale-105 flex items-center justify-center gap-2 shadow-lg shadow-cyan-400/50 hover:shadow-xl hover:shadow-cyan-300/60">
                <Search size={20} /> Find Trains
            </button>
        </form>
    );
};

const GlobalStyles = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700;800&display=swap');
    html, body {
      background-color: #000000; /* Pure Black */
    }
    body {
      font-family: 'Poppins', sans-serif;
    }
    input[type="date"]::-webkit-calendar-picker-indicator {
      filter: invert(1);
      cursor: pointer;
    }
    input[type="date"] {
      color-scheme: dark;
    }
  `}</style>
);