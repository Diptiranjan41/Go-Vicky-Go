import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// --- SVG Icons for Social Media ---
const SocialIcon = ({ href, children }) => (
  <a href={href} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-cyan-400 transition-colors duration-300">
    {children}
  </a>
);

const InstagramIcon = () => (
  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
    <path fillRule="evenodd" d="M12.315 2c-4.02.048-4.48 1.62-4.48 4.48s.46 4.432 4.48 4.48c4.02-.048 4.48-1.62 4.48-4.48S16.335 2.048 12.315 2zm0 7.2c-1.74 0-3.15-1.41-3.15-3.15S10.575 3 12.315 3s3.15 1.41 3.15 3.15-1.41 3.15-3.15 3.15zm5.336-5.46a1.2 1.2 0 100-2.4 1.2 1.2 0 000 2.4z" clipRule="evenodd" />
    <path d="M1.018 10.815A4.48 4.48 0 005.5 15.3c0 2.86.46 4.432 4.48 4.48 4.02-.048 4.48-1.62 4.48-4.48s-.46-4.432-4.48-4.48c-2.86 0-4.432-.46-4.48-4.48A4.48 4.48 0 001.018 10.815zm4.482-.015c0 2.415.42 3.825 3.825 3.825s3.825-1.41 3.825-3.825-1.41-3.825-3.825-3.825-3.825 1.41-3.825 3.825z" />
  </svg>
);

const TwitterIcon = () => (
  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.71v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
  </svg>
);

const FacebookIcon = () => (
    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
    </svg>
);

// --- Testimonials Section ---
const StarIcon = ({ filled, onClick }) => (
    <svg onClick={onClick} className={`w-5 h-5 ${onClick ? 'cursor-pointer' : ''} ${filled ? 'text-cyan-400' : 'text-gray-600'}`} fill="currentColor" viewBox="0 0 20 20">
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
    </svg>
);

const ReviewCard = ({ name, location, rating, review, imageUrl, onRemove }) => {
    const [clicks, setClicks] = useState(0);
    const [showDelete, setShowDelete] = useState(false);
    const clickTimer = useRef(null);

    const handleCardClick = () => {
        const newClicks = clicks + 1;
        setClicks(newClicks);

        if (clickTimer.current) {
            clearTimeout(clickTimer.current);
        }

        if (newClicks === 3) {
            setShowDelete(true);
            setClicks(0);
        } else {
            clickTimer.current = setTimeout(() => {
                setClicks(0);
            }, 700); // 700ms window for triple click
        }
    };

    const handleDeleteClick = (e) => {
        e.stopPropagation(); // Prevent card click handler from firing
        onRemove();
    };

    return (
        <div onClick={handleCardClick} className="relative border border-gray-800 bg-gray-900/50 p-6 rounded-xl backdrop-blur-sm h-full flex flex-col cursor-pointer">
            {showDelete && (
                <button 
                     onClick={handleDeleteClick} 
                     className="absolute top-3 right-3 text-gray-500 hover:text-red-400 transition-colors z-10"
                    aria-label="Remove review"
                >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"></path></svg>
                </button>
            )}
            <div className="flex items-center mb-4">
                {[...Array(5)].map((_, i) => <StarIcon key={i} filled={i < rating} />)}
            </div>
            <p className="text-gray-300 mb-6 flex-grow">"{review}"</p>
            <div className="flex items-center mt-auto">
                <img 
                     className="h-12 w-12 rounded-full object-cover mr-4" 
                     src={imageUrl || 'https://placehold.co/100x100/1F2937/E0E0E0?text=?'} 
                     alt={name} 
                     onError={(e) => { e.target.onerror = null; e.target.src='https://placehold.co/100x100/1F2937/E0E0E0?text=?'; }}
                />
                <div>
                    <p className="font-bold text-white">{name}</p>
                    <p className="text-sm text-gray-500">{location}</p>
                </div>
            </div>
        </div>
    );
};

const ReviewForm = ({ onAddReview }) => {
    const [name, setName] = useState('');
    const [location, setLocation] = useState('');
    const [review, setReview] = useState('');
    const [rating, setRating] = useState(0);
    const [error, setError] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!name || !location || !review || rating === 0) {
            setError('Please fill out all fields and provide a rating.');
            return;
        }
        onAddReview({ name, location, rating, review });
        setName(''); setLocation(''); setReview(''); setRating(0); setError('');
    };

    return (
        <div className="mt-16 pt-10 border-t border-gray-800">
            <h3 className="text-2xl font-bold tracking-tight text-white sm:text-3xl text-center">Leave Your Review</h3>
            <form onSubmit={handleSubmit} className="mx-auto mt-8 max-w-xl space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <input type="text" placeholder="Your Name" value={name} onChange={(e) => setName(e.target.value)} className="w-full rounded-lg border-0 bg-gray-800 px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-400" />
                    <input type="text" placeholder="City, State" value={location} onChange={(e) => setLocation(e.target.value)} className="w-full rounded-lg border-0 bg-gray-800 px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-400" />
                </div>
                <textarea placeholder="Your review..." value={review} onChange={(e) => setReview(e.target.value)} rows="4" className="w-full rounded-lg border-0 bg-gray-800 px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-400"></textarea>
                <div className="flex items-center gap-x-4"><p className="text-gray-400">Your Rating:</p><div className="flex">{[...Array(5)].map((_, i) => <StarIcon key={i} filled={i < rating} onClick={() => setRating(i + 1)} />)}</div></div>
                {error && <p className="text-red-400 text-sm">{error}</p>}
                <button type="submit" className="w-full rounded-lg bg-cyan-400 px-5 py-3 font-semibold text-black transition-colors duration-300 hover:bg-cyan-300">Submit Review</button>
            </form>
        </div>
    );
};

const PasswordModal = ({ onSubmit, onCancel, error }) => {
    const [password, setPassword] = useState('');
    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(password);
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
            <div className="bg-gray-900 border border-cyan-400/20 p-8 rounded-lg shadow-xl w-full max-w-sm">
                <h2 className="text-white text-2xl font-bold mb-4">Admin Access Required</h2>
                <p className="text-gray-400 mb-6">Please enter the admin password to remove this review.</p>
                <form onSubmit={handleSubmit}>
                    <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full rounded-lg border-0 bg-gray-800 px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-400" />
                    {error && <p className="text-red-400 text-sm mt-2">{error}</p>}
                    <div className="flex justify-end gap-4 mt-6">
                        <button type="button" onClick={onCancel} className="px-5 py-2 rounded-lg text-gray-300 hover:bg-gray-700 transition-colors">Cancel</button>
                        <button type="submit" className="px-5 py-2 rounded-lg bg-cyan-400 text-black font-semibold hover:bg-cyan-300 transition-colors">Confirm</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

const Testimonials = () => {
    const [isAdmin, setIsAdmin] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [passwordError, setPasswordError] = useState('');
    const [reviewToDelete, setReviewToDelete] = useState(null);
    const [currentIndex, setCurrentIndex] = useState(0);

    const initialReviews = [
        { id: 1, name: "Priya Sharma", location: "Mumbai, MH", rating: 5, review: "Absolutely phenomenal! The Spicy Mango Tango Sushi was a flavor explosion. GoDine is officially my go-to for special occasions.", imageUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=200&auto=format&fit=crop&ixlib=rb-4.0.3" },
        { id: 2, name: "Arjun Singh", location: "Bengaluru, KA", rating: 5, review: "The delivery was incredibly fast and the Truffle Mushroom Risotto was still hot and creamy. It tasted like it came straight from a five-star kitchen.", imageUrl: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?q=80&w=200&auto=format&fit=crop&ixlib=rb-4.0.3" },
        { id: 3, name: "Ananya Reddy", location: "Hyderabad, TS", rating: 2, review: "The Sizzling Fajita Platter was cold and I wish there was a bit more guacamole. Not the best experience.", imageUrl: "https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=200&auto=format&fit=crop&ixlib=rb-4.0.3" },
        { id: 4, name: "Vikram Chauhan", location: "Delhi, DL", rating: 5, review: "A truly premium dining experience at home. The packaging was elegant and the food quality was impeccable. Highly recommended for a date night.", imageUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=200&auto=format&fit=crop&ixlib=rb-4.0.3" },
        { id: 5, name: "Saanvi Gupta", location: "Pune, MH", rating: 4, review: "The pasta was delicious, though I wish the portion size was a bit larger for the price. Still, a great meal.", imageUrl: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=200&auto=format&fit=crop" },
        { id: 6, name: "Rohan Mehta", location: "Chennai, TN", rating: 5, review: "Mind-blowing biryani! The aroma itself was worth the price. Will definitely order again.", imageUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop" },
    ];
    
    const [reviews, setReviews] = useState(initialReviews);
    const [cardsPerPage, setCardsPerPage] = useState(4);
    const sliderRef = useRef(null);

    useEffect(() => {
        const calculateCardsPerPage = () => {
            if (window.innerWidth >= 1024) setCardsPerPage(4);
            else if (window.innerWidth >= 768) setCardsPerPage(2);
            else setCardsPerPage(1);
        };
        calculateCardsPerPage();
        window.addEventListener('resize', calculateCardsPerPage);
        return () => window.removeEventListener('resize', calculateCardsPerPage);
    }, []);

    const handleAddReview = (newReview) => {
        const reviewWithId = { ...newReview, id: Date.now(), imageUrl: 'https://placehold.co/100x100/1F2937/E0E0E0?text=?' };
        setReviews(prevReviews => [reviewWithId, ...prevReviews]);
        setCurrentIndex(0);
    };

    const attemptRemoveReview = (reviewId) => {
        if (isAdmin) {
            handleRemoveReview(reviewId);
        } else {
            setReviewToDelete(reviewId);
            setShowModal(true);
            setPasswordError('');
        }
    };
    
    const handleRemoveReview = (reviewId) => {
        setReviews(prevReviews => {
            const newReviews = prevReviews.filter(review => review.id !== reviewId);
            if (currentIndex >= newReviews.length - cardsPerPage + 1) {
                setCurrentIndex(Math.max(0, newReviews.length - cardsPerPage));
            }
            return newReviews;
        });
    };

    const handlePasswordSubmit = (password) => {
        if (password === '@GovickyGo') {
            setIsAdmin(true);
            setPasswordError('');
            setShowModal(false);
            if(reviewToDelete) {
                handleRemoveReview(reviewToDelete);
                setReviewToDelete(null);
            }
        } else {
            setPasswordError('Incorrect password. Please try again.');
        }
    };

    const nextSlide = () => {
        setCurrentIndex(prev => Math.min(prev + 1, reviews.length - cardsPerPage));
    };

    const prevSlide = () => {
        setCurrentIndex(prev => Math.max(prev - 1, 0));
    };

    const canSlideNext = currentIndex < reviews.length - cardsPerPage;
    const canSlidePrev = currentIndex > 0;

    return (
        <div className="py-24 sm:py-32" style={{backgroundImage: 'linear-gradient(to bottom right, #000000, #0a192f)'}}>
            {showModal && <PasswordModal onSubmit={handlePasswordSubmit} onCancel={() => setShowModal(false)} error={passwordError} />}
            <div className="mx-auto max-w-7xl px-6 lg:px-8">
                <div className="mx-auto max-w-2xl text-center">
                    <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
                        {isAdmin ? "Admin Reviews" : "User Reviews"}
                    </h2>
                    <p className="mt-2 text-lg leading-8 text-gray-400">
                        {isAdmin ? "You are logged in as Admin. You can remove reviews." : "Here's the real feedback from our happy diners."}
                    </p>
                </div>
                <div className="relative mt-16">
                    <div className="overflow-hidden" ref={sliderRef}>
                        <motion.div
                            className="flex gap-8"
                            animate={{ x: `calc(-${currentIndex * (100 / cardsPerPage)}% - ${currentIndex * (32 / cardsPerPage)}px)` }}
                            transition={{ type: 'spring', stiffness: 200, damping: 25 }}
                        >
                            {reviews.map((item) => (
                                <div key={item.id} style={{ flex: `0 0 calc(${100 / cardsPerPage}% - ${(32 * (cardsPerPage - 1)) / cardsPerPage}px)` }}>
                                    <ReviewCard 
                                        {...item} 
                                        onRemove={() => attemptRemoveReview(item.id)}
                                    />
                                </div>
                            ))}
                        </motion.div>
                    </div>
                    {reviews.length > cardsPerPage && (
                        <>
                            <button onClick={prevSlide} disabled={!canSlidePrev} className="absolute top-1/2 -left-4 md:-left-12 transform -translate-y-1/2 bg-gray-800/50 hover:bg-cyan-400/50 text-white rounded-full p-2 transition-all disabled:opacity-30 disabled:cursor-not-allowed">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
                            </button>
                            <button onClick={nextSlide} disabled={!canSlideNext} className="absolute top-1/2 -right-4 md:-right-12 transform -translate-y-1/2 bg-gray-800/50 hover:bg-cyan-400/50 text-white rounded-full p-2 transition-all disabled:opacity-30 disabled:cursor-not-allowed">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                            </button>
                        </>
                    )}
                </div>
                <ReviewForm onAddReview={handleAddReview} />
            </div>
        </div>
    );
};


const GoDineFooter = () => {
  return (
    <footer className="bg-black border-t border-gray-800">
      <div className="container mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-5 gap-8">
          <div className="col-span-1 md:col-span-4 lg:col-span-2">
            <h2 className="text-2xl font-bold text-white mb-2">GoDine</h2>
            <p className="text-gray-400 mb-6 max-w-sm">Experience the finest flavors, delivered right to your door.</p>
          </div>
          <div className="col-span-1"><h3 className="font-semibold tracking-wider text-white uppercase mb-4">Explore</h3><ul className="space-y-3"><li><a href="#" className="text-gray-400 hover:text-cyan-400 transition-colors">Menu</a></li><li><a href="#" className="text-gray-400 hover:text-cyan-400 transition-colors">Specials</a></li><li><a href="#" className="text-gray-400 hover:text-cyan-400 transition-colors">Order Online</a></li><li><a href="#" className="text-gray-400 hover:text-cyan-400 transition-colors">Catering</a></li></ul></div>
          <div className="col-span-1"><h3 className="font-semibold tracking-wider text-white uppercase mb-4">Company</h3><ul className="space-y-3"><li><a href="#" className="text-gray-400 hover:text-cyan-400 transition-colors">About Us</a></li><li><a href="#" className="text-gray-400 hover:text-cyan-400 transition-colors">Careers</a></li><li><a href="#" className="text-gray-400 hover:text-cyan-400 transition-colors">Contact</a></li></ul></div>
          <div className="col-span-1"><h3 className="font-semibold tracking-wider text-white uppercase mb-4">Legal</h3><ul className="space-y-3"><li><a href="#" className="text-gray-400 hover:text-cyan-400 transition-colors">Privacy Policy</a></li><li><a href="#" className="text-gray-400 hover:text-cyan-400 transition-colors">Terms of Service</a></li></ul></div>
        </div>
        <div className="mt-12 pt-8 border-t border-gray-800 flex flex-col sm:flex-row justify-between items-center">
          <p className="text-gray-500 text-sm mb-4 sm:mb-0">&copy; {new Date().getFullYear()} GoDine. All Rights Reserved.</p>
          <div className="flex space-x-5"><SocialIcon href="#"><InstagramIcon /></SocialIcon><SocialIcon href="#"><TwitterIcon /></SocialIcon><SocialIcon href="#"><FacebookIcon /></SocialIcon></div>
        </div>
      </div>
    </footer>
  );
};


// Wrapper App for demonstration
const App = () => {
  return (
    <div className="bg-black">
      <Testimonials />
      <GoDineFooter />
    </div>
  );
};


export default App;