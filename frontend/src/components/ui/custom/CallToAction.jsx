import React, { useRef, useEffect } from "react";
import { motion } from "framer-motion";
import * as THREE from 'three';
import { FaRocket, FaCompass, FaMapMarkerAlt } from "react-icons/fa";

const CallToAction = () => {
  const threeContainerRef = useRef(null);

  // 3D Scene Implementation - Same as Newsletter
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

    // Floating 3D Objects - Travel Themed
    const objects = [];
    const geometries = [
      new THREE.OctahedronGeometry(0.8, 0),  // Crystal
      new THREE.SphereGeometry(0.6, 32, 32),  // Globe
      new THREE.TorusGeometry(0.5, 0.15, 16, 100),  // Ring
      new THREE.ConeGeometry(0.4, 0.8, 8),  // Mountain
      new THREE.BoxGeometry(0.7, 0.7, 0.7),  // Cube
      new THREE.DodecahedronGeometry(0.6, 0)  // Complex shape
    ];

    // Create floating objects
    for (let i = 0; i < 10; i++) {
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
      
      {/* Gradient Overlays - Same as Newsletter */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-1/3 bg-gradient-to-b from-cyan-500/10 to-transparent" />
        <div className="absolute bottom-0 left-0 w-full h-1/3 bg-gradient-to-t from-cyan-500/10 to-transparent" />
      </div>

      <div className="max-w-4xl mx-auto relative z-10">
        {/* Header with Same Style */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
                                    <h2 class="text-4xl md:text-6xl font-bold text-cyan-400 mb-4 drop-shadow-lg">
  Ready to plan your next trip?
</h2>
         
          <div className="inline-flex items-center gap-3 bg-cyan-500/20 border border-cyan-500/30 px-6 py-3 rounded-full backdrop-blur-sm">
            <div className="flex space-x-1">
              <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse" />
              <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse delay-150" />
              <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse delay-300" />
            </div>
            <p className="text-cyan-300 text-sm font-medium">AI-Powered Travel Planning</p>
          </div>
        </motion.div>

        <motion.div
          className="grid grid-cols-1 lg:grid-cols-2 gap-8"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Left Side - Features */}
          <div className="space-y-6">
            <motion.div variants={itemVariants}>
              <div className="bg-black/50 backdrop-blur-lg border border-cyan-500/30 rounded-2xl p-8 hover:border-cyan-400/50 transition-all duration-500 group hover:shadow-2xl hover:shadow-cyan-500/10">
                <h3 className="text-2xl font-bold text-cyan-400 mb-6 flex items-center gap-3">
                  <FaRocket className="text-cyan-400 group-hover:scale-110 transition-transform duration-300" />
                  Why Choose Us?
                </h3>
                <p className="text-cyan-200/80 text-lg leading-relaxed mb-6">
                  Let Go Vicky Go help you discover unforgettable destinations with smart, AI-powered planning.
                </p>
                
                {/* Features List */}
                <div className="space-y-4">
                  {[
                    { icon: FaRocket, text: "AI-Powered Planning" },
                    { icon: FaCompass, text: "Smart Destination Finder" },
                    { icon: FaMapMarkerAlt, text: "Personalized Itineraries" },
                    { icon: FaRocket, text: "Fast & Free Service" }
                  ].map((feature, index) => (
                    <div key={index} className="flex items-center gap-4 group/item hover:transform hover:scale-105 transition-all duration-300">
                      <div className="w-12 h-12 bg-cyan-500/10 border border-cyan-500/30 rounded-xl flex items-center justify-center group-hover/item:scale-110 transition-all duration-300 group-hover/item:border-cyan-400/50">
                        <feature.icon className="text-cyan-400 text-lg" />
                      </div>
                      <div>
                        <p className="text-cyan-300 font-semibold">{feature.text}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Stats */}
            <motion.div variants={itemVariants}>
              <div className="bg-black/50 backdrop-blur-lg border border-cyan-500/30 rounded-2xl p-6">
                <h4 className="text-cyan-400 font-semibold mb-4">Travel Success</h4>
                <div className="space-y-3">
                  {[
                    { label: "Happy Travelers", value: "10K+" },
                    { label: "Destinations", value: "50+" },
                    { label: "Success Rate", value: "98%" },
                    { label: "Support", value: "24/7" }
                  ].map((stat, index) => (
                    <div key={index} className="flex justify-between items-center">
                      <span className="text-cyan-200/70">{stat.label}</span>
                      <span className="text-cyan-400 font-bold">{stat.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>

          {/* Right Side - CTA Buttons */}
          <motion.div variants={itemVariants} className="lg:col-span-1">
            <div className="bg-black/50 backdrop-blur-xl border border-cyan-500/30 rounded-3xl p-8 shadow-2xl shadow-cyan-500/10 hover:border-cyan-400/50 hover:shadow-cyan-500/20 transition-all duration-500">
              {/* Header */}
              <div className="flex items-center gap-3 mb-8">
                <FaRocket className="text-cyan-400 text-2xl" />
                <h3 className="text-2xl font-bold text-cyan-400">Start Your Journey</h3>
              </div>

              {/* Description */}
              <motion.div
                className="mb-8 group"
                variants={itemVariants}
              >
                <div className="bg-cyan-500/5 border border-cyan-500/20 rounded-2xl p-6 hover:border-cyan-400/40 transition-all duration-500">
                  <p className="text-cyan-200/90 text-lg leading-relaxed">
                    It's fast, free, and personalized just for you! Start planning your next adventure today.
                  </p>
                </div>
              </motion.div>

              {/* CTA Buttons */}
              <div className="space-y-4">
                <motion.a
                  href="/create-trip"
                  className="w-full bg-gradient-to-r from-cyan-500 to-cyan-600 text-black font-bold py-4 rounded-xl hover:from-cyan-400 hover:to-cyan-500 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-cyan-500/30 flex items-center justify-center gap-3 backdrop-blur-sm group"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <FaRocket className="text-lg group-hover:scale-110 transition-transform duration-300" />
                  Start Planning Now
                </motion.a>

                <motion.a
                  href="/explore"
                  className="w-full border-2 border-cyan-500/30 text-cyan-400 font-bold py-4 rounded-xl hover:border-cyan-400 hover:bg-cyan-500/10 transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-3 backdrop-blur-sm group"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <FaCompass className="text-lg group-hover:scale-110 transition-transform duration-300" />
                  Explore Destinations
                </motion.a>
              </div>

              {/* Additional Info */}
              <motion.div
                className="mt-6 pt-6 border-t border-cyan-500/20"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                <p className="text-cyan-300/70 text-sm text-center">
                  🚀 No credit card required • Free forever • Instant setup
                </p>
              </motion.div>
            </div>
          </motion.div>
        </motion.div>

        {/* Floating Icons */}
        <div className="absolute bottom-8 right-8 opacity-20 z-20">
          <div className="flex space-x-3">
            <FaRocket className="text-cyan-400 animate-float" />
            <FaCompass className="text-cyan-400 animate-float delay-1000" />
            <FaMapMarkerAlt className="text-cyan-400 animate-float delay-2000" />
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

export default CallToAction;