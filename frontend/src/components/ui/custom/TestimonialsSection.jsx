import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import * as THREE from 'three';
import { FaQuoteLeft, FaChevronLeft, FaChevronRight } from "react-icons/fa";

// --- Simulated User Profile ---
const loggedInUserProfile = {
    name: "Diptiranjan",
    img: "http://googleusercontent.com/file_content/1"
};

const initialTestimonialsData = [
    {
        id: 1,
        name: "Ananya Sharma",
        feedback: "I was overwhelmed planning a Europe trip, but Go Vicky Go gave me a ready-made plan in minutes.",
        location: "Mumbai, India",
        img: "https://i.pravatar.cc/100?img=1",
    },
    {
        id: 2,
        name: "Ravi Kumar",
        feedback: "As someone who hates spreadsheets, Go Vicky Go's planner was a blessing. Everything was seamless.",
        location: "Bengaluru, India",
        img: "https://i.pravatar.cc/100?img=2",
    },
    {
        id: 3,
        name: "Diptiranjan",
        feedback: "This travel planner is amazing! It helped me plan my trip to Bhubaneswar perfectly. Highly recommended!",
        location: "Bhubaneswar, India",
        img: "http://googleusercontent.com/file_content/1",
    },
    {
        id: 4,
        name: "Rohit Singh",
        feedback: "Perfect for a last-minute trip! I just selected my preferences and had a personalized itinerary within minutes. Highly recommended.",
        location: "Jaipur, India",
        img: "https://i.pravatar.cc/100?img=4",
    },
    {
        id: 5,
        name: "Meera Joshi",
        feedback: "Made our family vacation stress-free. Even the kids loved the way each day was planned out with fun suggestions!",
        location: "Ahmedabad, India",
        img: "https://i.pravatar.cc/100?img=5",
    },
    {
        id: 6,
        name: "Abhishek Rawat",
        feedback: "From flights to food, everything was covered. The map and budget breakdown were so useful during my Thailand trip.",
        location: "Chandigarh, India",
        img: "https://i.pravatar.cc/100?img=6",
    },
];

const ReviewCard = ({ id, name, location, feedback, img, onRemove }) => {
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
            }, 700);
        }
    };

    const handleDeleteClick = (e) => {
        e.stopPropagation();
        onRemove();
    };

    return (
        <motion.div 
            onClick={handleCardClick} 
            className="relative bg-black/50 backdrop-blur-xl border border-cyan-500/30 p-8 rounded-2xl shadow-2xl shadow-cyan-500/10 w-full cursor-pointer min-h-[300px] flex flex-col hover:border-cyan-400/50 hover:shadow-cyan-400/20 transition-all duration-500 group"
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 300 }}
        >
            {showDelete && (
                <button
                    onClick={handleDeleteClick}
                    className="absolute top-3 right-3 text-gray-500 hover:text-red-400 transition-colors z-10 bg-black/80 rounded-full p-1"
                    aria-label="Remove review"
                >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"></path></svg>
                </button>
            )}
            <div className="text-cyan-400 text-3xl mb-4 group-hover:scale-110 transition-transform duration-300">
                <FaQuoteLeft />
            </div>
            <p className="text-cyan-200/80 text-lg italic mb-6 flex-grow">{`"${feedback}"`}</p>
            <a href={`#/profile/${id}`} onClick={(e) => e.stopPropagation()} className="flex items-center gap-4 mt-auto group text-white no-underline">
                <div className="relative">
                    <img src={img} alt={name} className="w-12 h-12 rounded-full border-2 border-cyan-500 group-hover:border-cyan-300 transition-all duration-300 group-hover:scale-110" />
                    <div className="absolute inset-0 rounded-full border-2 border-cyan-400 opacity-0 group-hover:opacity-100 animate-ping transition-opacity duration-300"></div>
                </div>
                <div>
                    <p className="font-semibold text-cyan-300 group-hover:text-cyan-400 transition-colors duration-300">{name}</p>
                    <p className="text-sm text-cyan-200/70 group-hover:text-cyan-300 transition-colors duration-300">{location}</p>
                </div>
            </a>
        </motion.div>
    );
};

const ReviewForm = ({ onAddReview }) => {
    const [name, setName] = useState('');
    const [location, setLocation] = useState('');
    const [feedback, setFeedback] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!name || !location || !feedback) {
            setError('Please fill out all fields.');
            return;
        }
        onAddReview({ name, location, feedback });
        setName(''); setLocation(''); setFeedback(''); setError('');
    };

    return (
        <motion.div 
            className="mt-16 pt-10 border-t border-cyan-500/20"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
        >
            <h3 className="text-2xl font-bold text-center text-cyan-400 mb-2">Share Your Experience</h3>
            <p className="text-cyan-200/70 text-center mb-8">Help others discover the magic of smart travel planning</p>
            <form onSubmit={handleSubmit} className="mx-auto mt-8 max-w-xl space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <input 
                        type="text" 
                        placeholder="Your Name" 
                        value={name} 
                        onChange={(e) => setName(e.target.value)} 
                        className="w-full rounded-xl border border-cyan-500/30 bg-black/50 backdrop-blur-sm px-4 py-3 text-cyan-200 placeholder-cyan-200/50 focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 transition-all duration-300" 
                    />
                    <input 
                        type="text" 
                        placeholder="City, India" 
                        value={location} 
                        onChange={(e) => setLocation(e.target.value)} 
                        className="w-full rounded-xl border border-cyan-500/30 bg-black/50 backdrop-blur-sm px-4 py-3 text-cyan-200 placeholder-cyan-200/50 focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 transition-all duration-300" 
                    />
                </div>
                <textarea 
                    placeholder="Your feedback..." 
                    value={feedback} 
                    onChange={(e) => setFeedback(e.target.value)} 
                    rows="4" 
                    className="w-full rounded-xl border border-cyan-500/30 bg-black/50 backdrop-blur-sm px-4 py-3 text-cyan-200 placeholder-cyan-200/50 focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 transition-all duration-300"
                ></textarea>
                {error && <p className="text-red-400 text-sm">{error}</p>}
                <motion.button 
                    type="submit" 
                    className="w-full rounded-xl bg-gradient-to-r from-cyan-500 to-cyan-600 px-5 py-4 font-bold text-black transition-all duration-300 transform hover:scale-105 hover:from-cyan-400 hover:to-cyan-500 shadow-lg hover:shadow-cyan-500/30"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                >
                    Submit Review
                </motion.button>
            </form>
        </motion.div>
    );
};

const PasswordModal = ({ onSubmit, onCancel, error }) => {
    const [password, setPassword] = useState('');
    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(password);
    };

    return (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-black/90 border border-cyan-500/30 backdrop-blur-xl p-8 rounded-2xl shadow-2xl shadow-cyan-500/10 w-full max-w-sm">
                <h2 className="text-cyan-400 text-2xl font-bold mb-4">Admin Access Required</h2>
                <p className="text-cyan-200/70 mb-6">Enter password to delete review.</p>
                <form onSubmit={handleSubmit}>
                    <input 
                        type="password" 
                        placeholder="Password" 
                        value={password} 
                        onChange={(e) => setPassword(e.target.value)} 
                        className="w-full rounded-xl border border-cyan-500/30 bg-black/50 backdrop-blur-sm px-4 py-3 text-cyan-200 placeholder-cyan-200/50 focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 transition-all duration-300" 
                    />
                    {error && <p className="text-red-400 text-sm mt-2">{error}</p>}
                    <div className="flex justify-end gap-4 mt-6">
                        <button 
                            type="button" 
                            onClick={onCancel} 
                            className="px-5 py-2 rounded-xl text-cyan-300 hover:bg-cyan-500/10 transition-colors border border-cyan-500/30"
                        >
                            Cancel
                        </button>
                        <button 
                            type="submit" 
                            className="px-5 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-cyan-600 text-black font-semibold hover:from-cyan-400 hover:to-cyan-500 transition-colors"
                        >
                            Confirm
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

const Testimonials = () => {
    const [testimonials, setTestimonials] = useState(() => {
        try {
            const savedReviews = localStorage.getItem('testimonials');
            return savedReviews ? JSON.parse(savedReviews) : initialTestimonialsData;
        } catch (error) {
            console.error("Could not parse testimonials from localStorage", error);
            return initialTestimonialsData;
        }
    });

    const [showModal, setShowModal] = useState(false);
    const [reviewToDelete, setReviewToDelete] = useState(null);
    const [passwordError, setPasswordError] = useState('');
    const [currentIndex, setCurrentIndex] = useState(0);
    const [cardsPerPage, setCardsPerPage] = useState(3);
    const threeContainerRef = useRef(null);

    // 3D Scene Implementation - Same as other pages
    useEffect(() => {
        if (!threeContainerRef.current) return;

        // Scene Setup
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        const renderer = new THREE.WebGLRenderer({ 
            alpha: true,
            antialias: true 
        });

        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setClearColor(0x000000, 0);
        renderer.outputColorSpace = THREE.SRGBColorSpace;
        threeContainerRef.current.appendChild(renderer.domElement);

        // Lighting - Same blue/cyan theme
        const ambientLight = new THREE.AmbientLight(0x22d3ee, 0.3);
        scene.add(ambientLight);

        const directionalLight = new THREE.DirectionalLight(0x22d3ee, 0.8);
        directionalLight.position.set(5, 5, 5);
        scene.add(directionalLight);

        const pointLight = new THREE.PointLight(0x06b6d4, 1, 100);
        pointLight.position.set(0, 0, 10);
        scene.add(pointLight);

        // Floating 3D Objects
        const objects = [];
        const geometries = [
            new THREE.SphereGeometry(0.5, 16, 16),
            new THREE.TorusGeometry(0.4, 0.1, 16, 100),
            new THREE.OctahedronGeometry(0.4, 0),
            new THREE.BoxGeometry(0.6, 0.6, 0.6),
            new THREE.DodecahedronGeometry(0.35, 0)
        ];

        // Create floating objects
        for (let i = 0; i < 12; i++) {
            const geometry = geometries[Math.floor(Math.random() * geometries.length)];
            const material = new THREE.MeshPhysicalMaterial({
                color: new THREE.Color().setHSL(0.55 + Math.random() * 0.1, 0.8, 0.6),
                metalness: 0.7,
                roughness: 0.15,
                transparent: true,
                opacity: 0.7,
                transmission: 0.1,
                clearcoat: 1,
                clearcoatRoughness: 0.1
            });

            const object = new THREE.Mesh(geometry, material);
            
            // Position in a sphere
            const radius = 12 + Math.random() * 8;
            const theta = Math.random() * Math.PI * 2;
            const phi = Math.acos(2 * Math.random() - 1);
            
            object.position.x = radius * Math.sin(phi) * Math.cos(theta);
            object.position.y = radius * Math.sin(phi) * Math.sin(theta);
            object.position.z = radius * Math.cos(phi);

            object.rotation.x = Math.random() * Math.PI;
            object.rotation.y = Math.random() * Math.PI;

            object.userData = {
                speed: 0.1 + Math.random() * 0.2,
                amplitude: 0.3 + Math.random() * 0.7,
                frequency: 0.3 + Math.random() * 0.8
            };

            scene.add(object);
            objects.push(object);
        }

        // Particle System
        const particleCount = 600;
        const particles = new THREE.BufferGeometry();
        const positions = new Float32Array(particleCount * 3);
        const colors = new Float32Array(particleCount * 3);

        for (let i = 0; i < particleCount; i++) {
            const i3 = i * 3;
            const radius = 15 + Math.random() * 25;
            const theta = Math.random() * Math.PI * 2;
            const phi = Math.acos(2 * Math.random() - 1);
            
            positions[i3] = radius * Math.sin(phi) * Math.cos(theta);
            positions[i3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
            positions[i3 + 2] = radius * Math.cos(phi);

            // Same cyan color variations
            colors[i3] = 0.1 + Math.random() * 0.2;
            colors[i3 + 1] = 0.7 + Math.random() * 0.3;
            colors[i3 + 2] = 0.9 + Math.random() * 0.1;
        }

        particles.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        particles.setAttribute('color', new THREE.BufferAttribute(colors, 3));

        const particleMaterial = new THREE.PointsMaterial({
            size: 0.08,
            vertexColors: true,
            transparent: true,
            opacity: 0.5,
            sizeAttenuation: true,
            blending: THREE.AdditiveBlending
        });

        const particleSystem = new THREE.Points(particles, particleMaterial);
        scene.add(particleSystem);

        camera.position.z = 20;

        // Animation
        const clock = new THREE.Clock();
        
        const animate = () => {
            requestAnimationFrame(animate);
            
            const elapsedTime = clock.getElapsedTime();

            // Animate floating objects
            objects.forEach((object, index) => {
                object.rotation.x += object.userData.speed * 0.008;
                object.rotation.y += object.userData.speed * 0.006;
                
                // Subtle floating animation
                object.position.y += Math.sin(elapsedTime * object.userData.frequency + index) * 0.003;
                object.position.x += Math.cos(elapsedTime * object.userData.frequency * 0.5 + index) * 0.002;
            });

            // Slow particle rotation
            particleSystem.rotation.y = elapsedTime * 0.01;
            particleSystem.rotation.x = elapsedTime * 0.005;

            renderer.render(scene, camera);
        };

        animate();

        // Handle resize
        const handleResize = () => {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
        };

        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
            if (threeContainerRef.current && renderer.domElement) {
                threeContainerRef.current.removeChild(renderer.domElement);
            }
            renderer.dispose();
        };
    }, []);

    useEffect(() => {
        localStorage.setItem('testimonials', JSON.stringify(testimonials));
    }, [testimonials]);

    useEffect(() => {
        const calculateCardsPerPage = () => {
            if (window.innerWidth >= 1024) setCardsPerPage(3);
            else if (window.innerWidth >= 768) setCardsPerPage(2);
            else setCardsPerPage(1);
        };
        calculateCardsPerPage();
        window.addEventListener('resize', calculateCardsPerPage);
        return () => window.removeEventListener('resize', calculateCardsPerPage);
    }, []);
    
    const handleAddReview = (newReview) => {
        let finalReview;
        if (newReview.name.toLowerCase() === 'diptiranjan') {
            finalReview = { ...newReview, id: Date.now(), img: loggedInUserProfile.img };
        } else {
            finalReview = { 
                ...newReview, 
                id: Date.now(),
                img: `https://i.pravatar.cc/100?img=${Math.floor(Math.random() * 70) + 1}`
            };
        }
        setTestimonials(prev => [finalReview, ...prev]);
        setCurrentIndex(0);
    };

    const attemptRemoveReview = (id) => {
        setReviewToDelete(id);
        setShowModal(true);
        setPasswordError('');
    };

    const handlePasswordSubmit = (password) => {
        if (password === '@GovickyGo') {
            setTestimonials(prev => {
                const newTestimonials = prev.filter(t => t.id !== reviewToDelete);
                if (currentIndex >= newTestimonials.length - cardsPerPage + 1 && newTestimonials.length > 0) {
                    setCurrentIndex(Math.max(0, newTestimonials.length - cardsPerPage));
                }
                return newTestimonials;
            });
            setShowModal(false);
            setReviewToDelete(null);
        } else {
            setPasswordError('Incorrect password.');
        }
    };

    const nextSlide = () => {
        setCurrentIndex(prev => Math.min(prev + 1, testimonials.length - cardsPerPage));
    };

    const prevSlide = () => {
        setCurrentIndex(prev => Math.max(prev - 1, 0));
    };

    const canSlideNext = testimonials.length > cardsPerPage && currentIndex < testimonials.length - cardsPerPage;
    const canSlidePrev = currentIndex > 0;

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 30 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.6,
                ease: "easeOut"
            }
        }
    };

    return (
        <section className="bg-black min-h-screen py-16 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
            {/* 3D Background Canvas */}
            <div 
                ref={threeContainerRef}
                className="absolute inset-0 z-0 pointer-events-none"
            />
            
            {/* Gradient Overlays - Same as other pages */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-0 left-0 w-full h-1/3 bg-gradient-to-b from-cyan-500/10 to-transparent" />
                <div className="absolute bottom-0 left-0 w-full h-1/3 bg-gradient-to-t from-cyan-500/10 to-transparent" />
            </div>

            {showModal && <PasswordModal onSubmit={handlePasswordSubmit} onCancel={() => setShowModal(false)} error={passwordError} />}
            
            <div className="max-w-7xl mx-auto relative z-10">
                {/* Header with Same Style */}
                <motion.div
                    className="text-center mb-16"
                    initial={{ opacity: 0, y: -50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                >
                    <h2 class="text-4xl md:text-6xl font-bold text-cyan-400 mb-4 drop-shadow-lg">
 What Our Travelers Say
</h2>
                  
                    <div className="inline-flex items-center gap-3 bg-cyan-500/20 border border-cyan-500/30 px-6 py-3 rounded-full backdrop-blur-sm">
                        <div className="flex space-x-1">
                            <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse" />
                            <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse delay-150" />
                            <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse delay-300" />
                        </div>
                        <p className="text-cyan-300 text-sm font-medium">Real Stories, Real Experiences</p>
                    </div>
                </motion.div>

                <motion.div
                    className="relative"
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                >
                    <div className="overflow-hidden">
                        <motion.div
                            className="flex gap-8"
                            animate={{ x: `calc(-${currentIndex * (100 / cardsPerPage)}% - ${currentIndex * (32 / cardsPerPage)}px)` }}
                            transition={{ type: 'spring', stiffness: 200, damping: 25 }}
                        >
                            {testimonials.map((item) => (
                                <motion.div 
                                    key={item.id} 
                                    style={{ flex: `0 0 calc(${100 / cardsPerPage}% - ${(32 * (cardsPerPage - 1)) / cardsPerPage}px)` }}
                                    variants={itemVariants}
                                >
                                    <ReviewCard 
                                        {...item} 
                                        onRemove={() => attemptRemoveReview(item.id)}
                                    />
                                </motion.div>
                            ))}
                        </motion.div>
                    </div>
                    
                    {/* Navigation Buttons */}
                    {canSlidePrev && (
                         <motion.button 
                            onClick={prevSlide} 
                            className="absolute top-1/2 -left-4 md:-left-6 transform -translate-y-1/2 bg-black/50 backdrop-blur-sm border border-cyan-500/30 hover:border-cyan-400 hover:bg-cyan-500/20 text-cyan-400 rounded-full p-3 transition-all duration-300 z-10"
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                        >
                            <FaChevronLeft className="h-6 w-6" />
                        </motion.button>
                    )}
                    {canSlideNext && (
                        <motion.button 
                            onClick={nextSlide} 
                            className="absolute top-1/2 -right-4 md:-right-6 transform -translate-y-1/2 bg-black/50 backdrop-blur-sm border border-cyan-500/30 hover:border-cyan-400 hover:bg-cyan-500/20 text-cyan-400 rounded-full p-3 transition-all duration-300 z-10"
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                        >
                            <FaChevronRight className="h-6 w-6" />
                        </motion.button>
                    )}
                </motion.div>

                <ReviewForm onAddReview={handleAddReview} />

                {/* Floating Icons */}
                <div className="absolute bottom-8 right-8 opacity-20 z-20">
                    <div className="flex space-x-3">
                        <FaQuoteLeft className="text-cyan-400 animate-float" />
                        <FaChevronLeft className="text-cyan-400 animate-float delay-1000" />
                        <FaChevronRight className="text-cyan-400 animate-float delay-2000" />
                    </div>
                </div>
            </div>

            {/* Custom Animations */}
            <style jsx>{`
                @keyframes float {
                    0%, 100% { transform: translateY(0px); }
                    50% { transform: translateY(-10px); }
                }
                .animate-float {
                    animation: float 3s ease-in-out infinite;
                }
            `}</style>
        </section>
    );
};

export default Testimonials;