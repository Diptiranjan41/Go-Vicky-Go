import React, { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn, FaMountain, FaHiking, FaCompass, FaPaperPlane, FaMapMarkerAlt, FaPhone, FaEnvelope, FaClock } from "react-icons/fa";
import * as THREE from 'three';

const Footer = () => {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const threeContainerRef = useRef(null);

  // 3D Scene Implementation for Footer
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

    // Subtle Lighting for Footer
    const ambientLight = new THREE.AmbientLight(0x22d3ee, 0.1);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0x22d3ee, 0.3);
    directionalLight.position.set(0, 5, 5);
    scene.add(directionalLight);

    // Minimal Floating Particles
    const particleCount = 500;
    const particles = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3;
      const radius = 15 + Math.random() * 20;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      
      positions[i3] = radius * Math.sin(phi) * Math.cos(theta);
      positions[i3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      positions[i3 + 2] = radius * Math.cos(phi);

      // Subtle cyan colors
      colors[i3] = 0.1 + Math.random() * 0.1;
      colors[i3 + 1] = 0.4 + Math.random() * 0.2;
      colors[i3 + 2] = 0.6 + Math.random() * 0.2;
    }

    particles.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    particles.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const particleMaterial = new THREE.PointsMaterial({
      size: 0.05,
      vertexColors: true,
      transparent: true,
      opacity: 0.3,
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

      // Slow rotation
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

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setEmail("");
      setTimeout(() => setSubscribed(false), 3000);
    }
  };

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
    hidden: { opacity: 0, y: 20 },
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
    <footer className="bg-black text-cyan-300 relative overflow-hidden min-h-screen">
      {/* 3D Background Canvas */}
      <div 
        ref={threeContainerRef}
        className="absolute inset-0 z-0 pointer-events-none"
      />
      
      {/* Gradient Overlays */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-1/3 bg-gradient-to-b from-cyan-500/5 to-transparent" />
        <div className="absolute bottom-0 left-0 w-full h-1/3 bg-gradient-to-t from-cyan-500/5 to-transparent" />
      </div>

      <div className="relative z-10 px-6 py-16">
        <div className="max-w-7xl mx-auto">
          {/* Contact Section in Footer - Matching Contact Page Design */}
          <motion.div
            className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {/* Contact Info - 3D Cards */}
            <motion.div variants={itemVariants}>
              <div className="bg-black/50 backdrop-blur-lg border border-cyan-500/30 rounded-2xl p-8 hover:border-cyan-400/50 transition-all duration-500 group hover:shadow-2xl hover:shadow-cyan-500/10">
                <h3 className="text-2xl font-bold text-cyan-400 mb-6 flex items-center gap-3">
                  <FaMountain className="text-cyan-400 group-hover:scale-110 transition-transform duration-300" />
                  Get in Touch
                </h3>
                <p className="text-cyan-200/80 text-lg leading-relaxed mb-6">
                  Ready for your next adventure? Contact us and let's create unforgettable memories together!
                </p>
                
                {/* Contact Details */}
                <div className="space-y-4">
                  <div className="flex items-center gap-4 group/item hover:transform hover:scale-105 transition-all duration-300">
                    <div className="w-12 h-12 bg-cyan-500/10 border border-cyan-500/30 rounded-xl flex items-center justify-center group-hover/item:scale-110 transition-all duration-300 group-hover/item:border-cyan-400/50">
                      <FaMapMarkerAlt className="text-cyan-400 text-lg" />
                    </div>
                    <div>
                      <h4 className="text-cyan-300 font-semibold">Adventure Headquarters</h4>
                      <p className="text-cyan-200/70">123 Travel Lane, Wanderlust City</p>
                      <p className="text-cyan-200/70">Dreamland, 98765</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 group/item hover:transform hover:scale-105 transition-all duration-300">
                    <div className="w-12 h-12 bg-cyan-500/10 border border-cyan-500/30 rounded-xl flex items-center justify-center group-hover/item:scale-110 transition-all duration-300 group-hover/item:border-cyan-400/50">
                      <FaEnvelope className="text-cyan-400 text-lg" />
                    </div>
                    <div>
                      <h4 className="text-cyan-300 font-semibold">Email Us</h4>
                      <p className="text-cyan-200/70">info@govickygo.com</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 group/item hover:transform hover:scale-105 transition-all duration-300">
                    <div className="w-12 h-12 bg-cyan-500/10 border border-cyan-500/30 rounded-xl flex items-center justify-center group-hover/item:scale-110 transition-all duration-300 group-hover/item:border-cyan-400/50">
                      <FaPhone className="text-cyan-400 text-lg" />
                    </div>
                    <div>
                      <h4 className="text-cyan-300 font-semibold">Call Us</h4>
                      <p className="text-cyan-200/70">+91-9876543210</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 group/item hover:transform hover:scale-105 transition-all duration-300">
                    <div className="w-12 h-12 bg-cyan-500/10 border border-cyan-500/30 rounded-xl flex items-center justify-center group-hover/item:scale-110 transition-all duration-300 group-hover/item:border-cyan-400/50">
                      <FaClock className="text-cyan-400 text-lg" />
                    </div>
                    <div>
                      <h4 className="text-cyan-300 font-semibold">Adventure Hours</h4>
                      <p className="text-cyan-200/70">Mon-Fri: 9:00 AM - 6:00 PM</p>
                      <p className="text-cyan-200/70">Sat: 10:00 AM - 4:00 PM</p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Newsletter Section - 3D Design */}
            <motion.div variants={itemVariants}>
              <div className="bg-black/50 backdrop-blur-xl border border-cyan-500/30 rounded-3xl p-8 shadow-2xl shadow-cyan-500/10 hover:border-cyan-400/50 hover:shadow-cyan-500/20 transition-all duration-500">
                <div className="flex items-center gap-3 mb-6">
                  <FaPaperPlane className="text-cyan-400 text-xl" />
                  <h3 className="text-2xl font-bold text-cyan-400">Stay Adventurous</h3>
                </div>

                <form onSubmit={handleSubscribe} className="space-y-6">
                  <div className="group">
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your email address"
                      className="w-full px-5 py-4 rounded-xl bg-black/30 text-cyan-200 placeholder-cyan-200/50 outline-none border-2 border-cyan-500/30 focus:border-cyan-400 transition-all duration-300 backdrop-blur-sm hover:border-cyan-400/50 focus:bg-black/40"
                      required
                    />
                  </div>

                  <motion.button
                    type="submit"
                    className="w-full bg-gradient-to-r from-cyan-500 to-cyan-600 text-black font-bold py-4 rounded-xl hover:from-cyan-400 hover:to-cyan-500 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-cyan-500/30 flex items-center justify-center gap-3 backdrop-blur-sm"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <FaPaperPlane className="text-lg" />
                    Start Your Adventure
                  </motion.button>

                  <p className="text-cyan-200/60 text-sm text-center">
                    No spam, just pure travel inspiration. Unsubscribe anytime.
                  </p>

                  {subscribed && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-green-500/20 border border-green-500/30 rounded-xl p-4 text-green-400 text-center backdrop-blur-sm"
                    >
                      🎉 Welcome to the adventure! Check your email for travel inspiration.
                    </motion.div>
                  )}
                </form>
              </div>
            </motion.div>
          </motion.div>

          {/* Main Footer Content */}
          <motion.div
            className="grid grid-cols-1 lg:grid-cols-4 gap-8 mb-12"
            variants={containerVariants}
          >
            {/* Company Info - 3D Card */}
            <motion.div variants={itemVariants}>
              <div className="bg-black/50 backdrop-blur-lg border border-cyan-500/30 rounded-2xl p-6 hover:border-cyan-400/50 transition-all duration-500 hover:shadow-2xl hover:shadow-cyan-500/20">
                <div className="flex items-center gap-3 mb-4">
                  <div className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-cyan-500">
                    GoVickyGo
                  </div>
                  <FaCompass className="text-cyan-400 text-xl animate-spin-slow" />
                </div>
                <p className="text-sm text-cyan-200/80 leading-relaxed mb-4">
                  Turning your travel dreams into effortless journeys. Explore the world, one perfect plan at a time.
                </p>
                <div className="flex items-center gap-2 text-cyan-400 text-xs">
                  <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse" />
                  <span>Adventure Awaits</span>
                </div>
              </div>
            </motion.div>

            {/* Quick Links - 3D Hover Effects */}
            <motion.div variants={itemVariants}>
              <div className="bg-black/50 backdrop-blur-lg border border-cyan-500/30 rounded-2xl p-6 hover:border-cyan-400/50 transition-all duration-500">
                <h4 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                  <FaHiking className="text-cyan-400" />
                  Quick Links
                </h4>
                <ul className="space-y-3">
                  {['Home', 'Destinations', 'Travel Gear', 'Adventure Tours'].map((item) => (
                    <li key={item}>
                      <a 
                        href="#" 
                        className="group/link flex items-center gap-2 text-cyan-200 hover:text-white transition-all duration-300 hover:translate-x-1"
                      >
                        <div className="w-1.5 h-1.5 bg-cyan-400 rounded-full opacity-0 group-hover/link:opacity-100 transition-opacity duration-300" />
                        <span>{item}</span>
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>

            {/* Support - 3D Cards */}
            <motion.div variants={itemVariants}>
              <div className="bg-black/50 backdrop-blur-lg border border-cyan-500/30 rounded-2xl p-6 hover:border-cyan-400/50 transition-all duration-500">
                <h4 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                  <FaMountain className="text-cyan-400" />
                  Support
                </h4>
                <ul className="space-y-3">
                  {['Contact Us', 'Shipping Info', 'Returns', 'Size Guide'].map((item) => (
                    <li key={item}>
                      <a 
                        href="#" 
                        className="group/link flex items-center gap-2 text-cyan-200 hover:text-white transition-all duration-300 hover:translate-x-1"
                      >
                        <div className="w-1.5 h-1.5 bg-cyan-400 rounded-full opacity-0 group-hover/link:opacity-100 transition-opacity duration-300" />
                        <span>{item}</span>
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>

            {/* Social Media - 3D Icons */}
            <motion.div variants={itemVariants}>
              <div className="bg-black/50 backdrop-blur-lg border border-cyan-500/30 rounded-2xl p-6 hover:border-cyan-400/50 transition-all duration-500">
                <h4 className="text-xl font-semibold text-white mb-4">Join the Adventure</h4>
                <p className="text-cyan-200/80 text-sm mb-6">
                  Follow us for travel tips, gear reviews, and adventure inspiration.
                </p>
                
                {/* Social Icons with 3D Effects */}
                <div className="flex space-x-3 mb-6">
                  {[
                    { icon: FaFacebookF, color: 'hover:bg-blue-500' },
                    { icon: FaTwitter, color: 'hover:bg-sky-500' },
                    { icon: FaInstagram, color: 'hover:bg-pink-500' },
                    { icon: FaLinkedinIn, color: 'hover:bg-blue-600' }
                  ].map(({ icon: Icon, color }, index) => (
                    <motion.a 
                      key={index}
                      href="#" 
                      className={`w-12 h-12 bg-cyan-500/10 border border-cyan-500/30 rounded-xl flex items-center justify-center text-cyan-400 transition-all duration-300 hover:scale-110 hover:text-white ${color} hover:border-transparent backdrop-blur-sm`}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Icon className="text-lg" />
                    </motion.a>
                  ))}
                </div>
              </div>
            </motion.div>
          </motion.div>

          {/* Bottom Section - 3D Separator */}
          <motion.div 
            className="border-t border-cyan-500/20 pt-8"
            variants={itemVariants}
          >
            <div className="flex flex-col lg:flex-row justify-between items-center gap-4">
              {/* Copyright */}
              <div className="text-cyan-400/70 text-sm flex items-center gap-2">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse" />
                  <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse delay-150" />
                  <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse delay-300" />
                </div>
                © {new Date().getFullYear()} GoVickyGo. All rights reserved.
              </div>

              {/* Additional Links */}
              <div className="flex flex-wrap gap-6 text-sm">
                {['Privacy Policy', 'Terms of Service', 'Cookie Policy', 'Sitemap'].map((item) => (
                  <a 
                    key={item}
                    href="#" 
                    className="text-cyan-400/70 hover:text-cyan-300 transition-colors duration-300 hover:underline"
                  >
                    {item}
                  </a>
                ))}
              </div>

              {/* Trust Badges */}
              <div className="flex items-center gap-4 text-xs text-cyan-400/60">
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                  <span>Secure Payment</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse" />
                  <span>24/7 Support</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Floating Adventure Icons */}
        <div className="absolute bottom-4 right-4 opacity-20 z-20">
          <div className="flex space-x-3">
            <FaMountain className="text-cyan-400 animate-float" />
            <FaHiking className="text-cyan-400 animate-float delay-1000" />
            <FaCompass className="text-cyan-400 animate-float delay-2000" />
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
        .animate-spin-slow {
          animation: spin 3s linear infinite;
        }
      `}</style>
    </footer>
  );
};

export default Footer;