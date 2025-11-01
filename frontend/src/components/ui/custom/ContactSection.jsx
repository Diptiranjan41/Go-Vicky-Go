import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import emailjs from "emailjs-com";
import * as THREE from 'three';
import { FaMapMarkerAlt, FaPhone, FaEnvelope, FaClock, FaPaperPlane, FaMountain, FaHiking } from "react-icons/fa";

const Contact = () => {
  const [messageSent, setMessageSent] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const threeContainerRef = useRef(null);

  // Initialize EmailJS with your Public Key
  useEffect(() => {
    emailjs.init("XWN51ydIMC0U54XSb"); 
  }, []);

  // 3D Scene Implementation
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

    // Lighting
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
      new THREE.OctahedronGeometry(1, 0),
      new THREE.DodecahedronGeometry(0.8, 0),
      new THREE.IcosahedronGeometry(0.7, 0),
      new THREE.TorusGeometry(0.6, 0.2, 16, 100),
      new THREE.ConeGeometry(0.5, 1, 8)
    ];

    // Create floating objects
    for (let i = 0; i < 15; i++) {
      const geometry = geometries[Math.floor(Math.random() * geometries.length)];
      const material = new THREE.MeshPhysicalMaterial({
        color: new THREE.Color().setHSL(Math.random() * 0.3 + 0.5, 0.8, 0.6),
        metalness: 0.7,
        roughness: 0.2,
        transparent: true,
        opacity: 0.6,
        transmission: 0.2,
        clearcoat: 1,
        clearcoatRoughness: 0.1
      });

      const object = new THREE.Mesh(geometry, material);
      
      // Random position in a sphere
      const radius = 15 + Math.random() * 10;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      
      object.position.x = radius * Math.sin(phi) * Math.cos(theta);
      object.position.y = radius * Math.sin(phi) * Math.sin(theta);
      object.position.z = radius * Math.cos(phi);

      object.rotation.x = Math.random() * Math.PI;
      object.rotation.y = Math.random() * Math.PI;

      object.userData = {
        speed: 0.2 + Math.random() * 0.3,
        amplitude: 0.5 + Math.random() * 1,
        frequency: 0.5 + Math.random() * 1
      };

      scene.add(object);
      objects.push(object);
    }

    // Particle System
    const particleCount = 1000;
    const particles = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3;
      const radius = 20 + Math.random() * 30;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      
      positions[i3] = radius * Math.sin(phi) * Math.cos(theta);
      positions[i3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      positions[i3 + 2] = radius * Math.cos(phi);

      // Cyan color variations
      colors[i3] = 0.1 + Math.random() * 0.2;
      colors[i3 + 1] = 0.6 + Math.random() * 0.4;
      colors[i3 + 2] = 0.8 + Math.random() * 0.2;
    }

    particles.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    particles.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const particleMaterial = new THREE.PointsMaterial({
      size: 0.1,
      vertexColors: true,
      transparent: true,
      opacity: 0.6,
      sizeAttenuation: true,
      blending: THREE.AdditiveBlending
    });

    const particleSystem = new THREE.Points(particles, particleMaterial);
    scene.add(particleSystem);

    camera.position.z = 25;

    // Animation
    const clock = new THREE.Clock();
    
    const animate = () => {
      requestAnimationFrame(animate);
      
      const elapsedTime = clock.getElapsedTime();

      // Animate floating objects
      objects.forEach((object, index) => {
        object.rotation.x += object.userData.speed * 0.01;
        object.rotation.y += object.userData.speed * 0.008;
        
        // Floating animation
        object.position.y += Math.sin(elapsedTime * object.userData.frequency + index) * 0.005;
        object.position.x += Math.cos(elapsedTime * object.userData.frequency * 0.7 + index) * 0.003;
      });

      // Rotate particle system slowly
      particleSystem.rotation.y = elapsedTime * 0.02;

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

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessageSent(false);
    setErrorMessage("");

    const serviceId = "service_seuqjf6";
    const templateId = "template_iqlv4xr";

    emailjs
      .sendForm(serviceId, templateId, e.target)
      .then(
        (result) => {
          setMessageSent(true);
          setIsLoading(false);
          setTimeout(() => setMessageSent(false), 5000);
          e.target.reset();
        },
        (error) => {
          setErrorMessage("❌ Failed to send message. Please try again later.");
          setIsLoading(false);
          console.error("EmailJS Error:", error);
        }
      );
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
      
      {/* Gradient Overlays */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-1/3 bg-gradient-to-b from-cyan-500/10 to-transparent" />
        <div className="absolute bottom-0 left-0 w-full h-1/3 bg-gradient-to-t from-cyan-500/10 to-transparent" />
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Header with 3D Effect */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
                                                                    <h2 class="text-4xl md:text-6xl font-bold text-cyan-400 mb-4 drop-shadow-lg">
 Start Your Adventure
</h2>
        
          <div className="inline-flex items-center gap-3 bg-cyan-500/20 border border-cyan-500/30 px-6 py-3 rounded-full backdrop-blur-sm">
            <div className="flex space-x-1">
              <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse" />
              <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse delay-150" />
              <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse delay-300" />
            </div>
            <p className="text-cyan-300 text-sm font-medium">Let's Plan Your Journey</p>
          </div>
        </motion.div>

        <motion.div
          className="grid grid-cols-1 lg:grid-cols-2 gap-12"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Contact Info - 3D Cards */}
          <div className="space-y-6">
            <motion.div variants={itemVariants}>
              <div className="bg-black/50 backdrop-blur-lg border border-cyan-500/30 rounded-2xl p-8 hover:border-cyan-400/50 transition-all duration-500 group hover:shadow-2xl hover:shadow-cyan-500/10">
                <h3 className="text-2xl font-bold text-cyan-400 mb-6 flex items-center gap-3">
                  <FaMountain className="text-cyan-400 group-hover:scale-110 transition-transform duration-300" />
                  Get in Touch
                </h3>
                <p className="text-cyan-200/80 text-lg leading-relaxed mb-6">
                  Have questions or need assistance planning your next adventure? 
                  Our travel experts are here to help you create unforgettable experiences!
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

            {/* Newsletter Section - Matching Design */}
            <motion.div variants={itemVariants}>
              <div className="bg-black/50 backdrop-blur-lg border border-cyan-500/30 rounded-2xl p-8 hover:border-cyan-400/50 transition-all duration-500 group hover:shadow-2xl hover:shadow-cyan-500/10">
                <h3 className="text-2xl font-bold text-cyan-400 mb-4 flex items-center gap-3">
                  <FaPaperPlane className="text-cyan-400 group-hover:scale-110 transition-transform duration-300" />
                  Stay Updated
                </h3>
                <p className="text-cyan-200/80 text-lg leading-relaxed mb-6">
                  Get exclusive travel deals and adventure inspiration delivered to your inbox.
                </p>
                
                <div className="space-y-4">
                  <div className="group">
                    <input
                      type="email"
                      placeholder="Enter your email address"
                      className="w-full px-5 py-4 rounded-xl bg-black/30 text-cyan-200 placeholder-cyan-200/50 outline-none border-2 border-cyan-500/30 focus:border-cyan-400 transition-all duration-300 backdrop-blur-sm hover:border-cyan-400/50 focus:bg-black/40"
                    />
                  </div>
                  
                  <motion.button
                    className="w-full bg-gradient-to-r from-cyan-500 to-cyan-600 text-black font-bold py-4 rounded-xl hover:from-cyan-400 hover:to-cyan-500 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-cyan-500/30 flex items-center justify-center gap-3 backdrop-blur-sm"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <FaPaperPlane className="text-lg" />
                    Subscribe to Newsletter
                  </motion.button>
                  
                  <p className="text-cyan-200/60 text-sm text-center">
                    No spam, just pure travel inspiration. Unsubscribe anytime.
                  </p>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Contact Form - 3D Design */}
          <motion.div variants={itemVariants}>
            <div className="bg-black/50 backdrop-blur-xl border border-cyan-500/30 rounded-3xl p-8 shadow-2xl shadow-cyan-500/10 hover:border-cyan-400/50 hover:shadow-cyan-500/20 transition-all duration-500">
              <div className="flex items-center gap-3 mb-6">
                <FaHiking className="text-cyan-400 text-xl" />
                <h3 className="text-2xl font-bold text-cyan-400">Send Message</h3>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="group">
                  <input
                    type="text"
                    name="user_name"
                    placeholder="Your Adventurer Name"
                    className="w-full px-5 py-4 rounded-xl bg-black/30 text-cyan-200 placeholder-cyan-200/50 outline-none border-2 border-cyan-500/30 focus:border-cyan-400 transition-all duration-300 backdrop-blur-sm hover:border-cyan-400/50 focus:bg-black/40"
                    required
                  />
                </div>

                <div className="group">
                  <input
                    type="email"
                    name="user_email"
                    placeholder="Your Email Address"
                    className="w-full px-5 py-4 rounded-xl bg-black/30 text-cyan-200 placeholder-cyan-200/50 outline-none border-2 border-cyan-500/30 focus:border-cyan-400 transition-all duration-300 backdrop-blur-sm hover:border-cyan-400/50 focus:bg-black/40"
                    required
                  />
                </div>

                <div className="group">
                  <textarea
                    name="message"
                    placeholder="Tell us about your dream adventure..."
                    rows="5"
                    className="w-full px-5 py-4 rounded-xl bg-black/30 text-cyan-200 placeholder-cyan-200/50 outline-none border-2 border-cyan-500/30 focus:border-cyan-400 transition-all duration-300 backdrop-blur-sm hover:border-cyan-400/50 focus:bg-black/40 resize-none"
                    required
                  ></textarea>
                </div>

                <motion.button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-cyan-500 to-cyan-600 text-black font-bold py-4 rounded-xl hover:from-cyan-400 hover:to-cyan-500 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-cyan-500/30 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 backdrop-blur-sm"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {isLoading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <FaPaperPlane className="text-lg" />
                      Launch Message
                    </>
                  )}
                </motion.button>

                {/* Status Messages */}
                {messageSent && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-green-500/20 border border-green-500/30 rounded-xl p-4 text-green-400 text-center backdrop-blur-sm"
                  >
                    🎉 Thank you! Your adventure request has been sent!
                  </motion.div>
                )}

                {errorMessage && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-red-500/20 border border-red-500/30 rounded-xl p-4 text-red-400 text-center backdrop-blur-sm"
                  >
                    {errorMessage}
                  </motion.div>
                )}
              </form>
            </div>
          </motion.div>
        </motion.div>

        {/* Floating Adventure Icons */}
        <div className="absolute bottom-4 right-4 opacity-20 z-20">
          <div className="flex space-x-3">
            <FaMountain className="text-cyan-400 animate-float" />
            <FaHiking className="text-cyan-400 animate-float delay-1000" />
            <FaPaperPlane className="text-cyan-400 animate-float delay-2000" />
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

export default Contact;