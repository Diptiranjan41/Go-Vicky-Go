import React, { useState, useContext, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { NotificationContext } from "../../../context/NotificationContext";
import { CurrencyContext } from "../../../context/CurrencyContext";
import * as THREE from 'three';

const navItems = [
  { name: "Home", path: "/" },
  { name: "Explore", path: "/explore" },
  { name: "Booking", path: "/booking" },
  { name: "Product", path: "/product" },
  { name: "Weather", path: "/weather" },
  { name: "Chatbot", path: "/chatbot" },
  { name: "Contact", path: "/contact" },
];

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const threeContainerRef = useRef(null);

  const { selectedCurrency, setSelectedCurrency, exchangeRates } = useContext(CurrencyContext);
  const { notifications, clearNotifications } = useContext(NotificationContext);

  // 3D Background Effect - Same as other pages
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
      new THREE.OctahedronGeometry(0.1, 0),
      new THREE.IcosahedronGeometry(0.08, 0),
      new THREE.TetrahedronGeometry(0.12, 0),
      new THREE.SphereGeometry(0.06, 16, 16)
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
      
      // Position in a horizontal band
      const radius = 8 + Math.random() * 4;
      const theta = Math.random() * Math.PI * 2;
      const y = (Math.random() - 0.5) * 1;
      
      object.position.x = Math.cos(theta) * radius;
      object.position.y = y;
      object.position.z = Math.sin(theta) * radius;

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
    const particleCount = 100;
    const particles = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3;
      const radius = 10 + Math.random() * 15;
      const theta = Math.random() * Math.PI * 2;
      const y = (Math.random() - 0.5) * 2;
      
      positions[i3] = Math.cos(theta) * radius;
      positions[i3 + 1] = y;
      positions[i3 + 2] = Math.sin(theta) * radius;

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
      });

      // Slow particle rotation
      particleSystem.rotation.y = elapsedTime * 0.01;

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
    hidden: { opacity: 0, y: -20 },
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
    <header className="bg-black text-white shadow-lg z-50 relative overflow-hidden">
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

      {/* Aqua Color Line */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent opacity-80 animate-pulse" />

      <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center relative z-10">
        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Link 
            to="/" 
            className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-cyan-500 group"
          >
            Go Vicky Go
          </Link>
        </motion.div>

        {/* Desktop Navigation */}
        <motion.nav 
          className="hidden md:flex gap-6"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {navItems.map((item) => (
            <motion.div key={item.name} variants={itemVariants}>
              <Link
                to={item.path}
                className="text-cyan-200/80 hover:text-cyan-400 transition-all duration-300 group py-2 px-3 rounded-xl hover:bg-cyan-500/10 relative"
              >
                <span className="font-medium">{item.name}</span>
                {/* Aqua underline on hover */}
                <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-0 h-0.5 bg-cyan-400 group-hover:w-3/4 transition-all duration-300" />
              </Link>
            </motion.div>
          ))}
        </motion.nav>

        {/* Desktop Controls */}
        <motion.div 
          className="hidden md:flex items-center gap-4"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Currency Selector */}
          <div className="relative group">
            <select
              value={selectedCurrency}
              onChange={(e) => setSelectedCurrency(e.target.value)}
              className="bg-black/50 backdrop-blur-lg border border-cyan-500/30 text-cyan-200 p-2 text-sm rounded-xl cursor-pointer transition-all duration-300 hover:border-cyan-400/50 focus:outline-none focus:border-cyan-400"
            >
              {Object.keys(exchangeRates).map((code) => (
                <option key={code} value={code}>
                  {code}
                </option>
              ))}
            </select>
          </div>

          {/* Notification Button */}
          <div className="relative">
            <motion.button
              onClick={() => setShowDropdown(!showDropdown)}
              className="p-3 bg-black/50 backdrop-blur-lg border border-cyan-500/30 rounded-xl hover:border-cyan-400/50 transition-all duration-300 relative group"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <span className="text-cyan-400 group-hover:scale-110 transition-transform duration-300">🔔</span>
              
              {notifications.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full px-1.5 py-0.5 min-w-[20px] transform group-hover:scale-110 transition-transform duration-300">
                  {notifications.length}
                </span>
              )}
            </motion.button>

            {/* Notification Dropdown */}
            <AnimatePresence>
              {showDropdown && (
                <motion.div 
                  className="absolute right-0 mt-3 w-80 bg-black/50 backdrop-blur-xl border border-cyan-500/30 rounded-2xl shadow-2xl shadow-cyan-500/10 p-4 z-50"
                  initial={{ opacity: 0, y: -10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10, scale: 0.95 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="flex justify-between items-center mb-3 pb-2 border-b border-cyan-500/20">
                    <h3 className="text-cyan-400 font-semibold">Notifications</h3>
                    <button
                      onClick={() => {
                        clearNotifications();
                        setShowDropdown(false);
                      }}
                      className="text-xs text-cyan-300 hover:text-cyan-100 transition-colors"
                    >
                      Clear All
                    </button>
                  </div>
                  
                  {notifications.length === 0 ? (
                    <p className="text-sm text-cyan-300/70 text-center py-4">No notifications</p>
                  ) : (
                    <div className="space-y-2 max-h-60 overflow-y-auto">
                      {notifications.map((n) => (
                        <div 
                          key={n.id} 
                          className="p-3 rounded-xl bg-cyan-500/5 border border-cyan-500/20 hover:border-cyan-400/50 transition-all duration-300"
                        >
                          <p className="text-sm text-cyan-200/80">{n.message}</p>
                          <span className="text-xs text-cyan-400/70 mt-1 block">
                            {new Date(n.timestamp).toLocaleTimeString()}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Sign In Button */}
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Link
              to="/signin"
              className="bg-gradient-to-r from-cyan-500 to-cyan-600 text-black font-semibold py-2 px-6 rounded-xl hover:from-cyan-400 hover:to-cyan-500 transition-all duration-300 shadow-lg hover:shadow-cyan-500/30"
            >
              Sign In
            </Link>
          </motion.div>
        </motion.div>

        {/* Mobile Menu Button */}
        <motion.button
          className="md:hidden p-3 bg-black/50 backdrop-blur-lg border border-cyan-500/30 rounded-xl text-cyan-400 hover:border-cyan-400/50 transition-all duration-300"
          onClick={() => setMenuOpen(!menuOpen)}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {menuOpen ? "✕" : "☰"}
        </motion.button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div 
            className="md:hidden bg-black/50 backdrop-blur-xl border-t border-cyan-500/30 px-4 pt-6 pb-8 space-y-4 z-40 relative"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            {/* Mobile Currency Selector */}
            <div className="relative">
              <select
                value={selectedCurrency}
                onChange={(e) => setSelectedCurrency(e.target.value)}
                className="w-full bg-black/50 backdrop-blur-lg border border-cyan-500/30 text-cyan-200 p-3 text-sm rounded-xl focus:border-cyan-400 transition-all duration-300"
              >
                {Object.keys(exchangeRates).map((code) => (
                  <option key={code} value={code}>
                    {code}
                  </option>
                ))}
              </select>
            </div>

            {/* Mobile Navigation Links */}
            <nav className="space-y-3">
              {navItems.map((item) => (
                <motion.div
                  key={item.name}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <Link
                    to={item.path}
                    onClick={() => setMenuOpen(false)}
                    className="block p-3 text-cyan-200/80 hover:text-cyan-400 rounded-xl hover:bg-cyan-500/10 border border-transparent hover:border-cyan-500/30 transition-all duration-300 group"
                  >
                    <span className="font-medium">{item.name}</span>
                    {/* Aqua line for mobile items */}
                    <div className="w-0 h-0.5 bg-cyan-400 mt-1 group-hover:w-full transition-all duration-300" />
                  </Link>
                </motion.div>
              ))}
            </nav>

            {/* Mobile Sign In Button */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.2 }}
            >
              <Link
                to="/signin"
                onClick={() => setMenuOpen(false)}
                className="block w-full text-center py-3 bg-gradient-to-r from-cyan-500 to-cyan-600 text-black font-semibold rounded-xl hover:from-cyan-400 hover:to-cyan-500 transition-all duration-300"
              >
                Sign In
              </Link>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Header;