import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import * as THREE from 'three';
import { 
  FaFileContract,
  FaUserCheck,
  FaShieldAlt,
  FaBalanceScale,
  FaGavel,
  FaHandshake,
  FaExclamationTriangle,
  FaCheckCircle,
  FaBook,
  FaGlobeAmericas
} from "react-icons/fa";

const TermsAndConditions = () => {
  const threeContainerRef = useRef(null);

  // 3D Scene Implementation - Contact page style
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

    // Lighting - Blue/Cyan theme
    const ambientLight = new THREE.AmbientLight(0x22d3ee, 0.3);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0x22d3ee, 0.8);
    directionalLight.position.set(5, 5, 5);
    scene.add(directionalLight);

    const pointLight = new THREE.PointLight(0x06b6d4, 1, 100);
    pointLight.position.set(0, 0, 10);
    scene.add(pointLight);

    // Legal-themed 3D Objects (Documents, Scales, Shields)
    const objects = [];
    const geometries = [
      new THREE.BoxGeometry(1.2, 1.6, 0.2), // Document shape
      new THREE.CylinderGeometry(0.3, 0.3, 1.5, 32), // Scale pillar
      new THREE.SphereGeometry(0.8, 32, 32), // Balance sphere
      new THREE.TorusGeometry(0.6, 0.1, 16, 100), // Agreement ring
      new THREE.OctahedronGeometry(1, 0) // Legal diamond
    ];

    // Create floating legal objects
    for (let i = 0; i < 10; i++) {
      const geometry = geometries[Math.floor(Math.random() * geometries.length)];
      const material = new THREE.MeshPhysicalMaterial({
        color: new THREE.Color().setHSL(Math.random() * 0.3 + 0.5, 0.8, 0.6),
        metalness: 0.7,
        roughness: 0.15,
        transparent: true,
        opacity: 0.7,
        transmission: 0.1,
        clearcoat: 1,
        clearcoatRoughness: 0.1
      });

      const object = new THREE.Mesh(geometry, material);
      
      // Random position in a sphere
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

    // Particle System - Legal dots
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

      // Blue/Cyan color variations for legal theme
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

      // Animate floating objects - formal, steady movement
      objects.forEach((object, index) => {
        object.rotation.x += object.userData.speed * 0.006;
        object.rotation.y += object.userData.speed * 0.004;
        
        // Subtle floating animation for legal feel
        object.position.y += Math.sin(elapsedTime * object.userData.frequency + index) * 0.002;
        object.position.x += Math.cos(elapsedTime * object.userData.frequency * 0.3 + index) * 0.001;
      });

      // Slow particle rotation
      particleSystem.rotation.y = elapsedTime * 0.008;
      particleSystem.rotation.x = elapsedTime * 0.004;

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

  const cardVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.8,
        ease: "easeOut"
      }
    }
  };

  const termsSections = [
    {
      icon: FaFileContract,
      title: "1. Use of the Website & Services",
      content: "You must be at least 18 years old to use this website and book travel services. You agree to use our services for lawful purposes only and not for any illegal or unauthorized activity. All travel bookings are subject to availability and verification."
    },
    {
      icon: FaBalanceScale,
      title: "2. Intellectual Property", 
      content: "All content, including text, images, logos, designs, and travel itineraries are the property of GoVickyGo. Unauthorized reproduction, distribution, or use of our travel content and services is strictly prohibited."
    },
    {
      icon: FaUserCheck,
      title: "3. User Accounts & Responsibilities",
      content: "If you create an account, you are responsible for maintaining the confidentiality of your credentials and for all activities that occur under your account. Keep your travel preferences and personal information updated for better service."
    },
    {
      icon: FaExclamationTriangle,
      title: "4. Booking & Cancellation Policies",
      content: "All travel bookings are subject to our booking policies. Cancellation terms vary by service provider. Please review specific cancellation policies before confirming your adventure bookings."
    },
    {
      icon: FaShieldAlt,
      title: "5. Limitation of Liability",
      content: "GoVickyGo acts as a booking agent and is not liable for any direct, indirect, incidental, or consequential damages resulting from your use of the website, travel services, or adventures booked through our platform."
    },
    {
      icon: FaGavel,
      title: "6. Changes to Terms & Governing Law",
      content: "We reserve the right to update these terms at any time. Continued use after changes constitutes acceptance. These terms shall be governed by the laws of our establishment jurisdiction."
    }
  ];

  const legalFeatures = [
    { icon: FaFileContract, text: "Legal Compliance" },
    { icon: FaUserCheck, text: "User Protection" },
    { icon: FaBalanceScale, text: "Fair Practices" },
    { icon: FaHandshake, text: "Trusted Service" }
  ];

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
  Terms & Conditions
</h2>
          
          <div className="inline-flex items-center gap-3 bg-cyan-500/20 border border-cyan-500/30 px-6 py-3 rounded-full backdrop-blur-sm">
            <div className="flex space-x-1">
              <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse" />
              <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse delay-150" />
              <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse delay-300" />
            </div>
            <p className="text-cyan-300 text-sm font-medium">Adventure Guidelines</p>
          </div>
        </motion.div>

        <motion.div
          className="grid grid-cols-1 lg:grid-cols-3 gap-8"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Left Side - Legal Features */}
          <div className="lg:col-span-1 space-y-6">
            <motion.div variants={itemVariants}>
              <div className="bg-black/50 backdrop-blur-lg border border-cyan-500/30 rounded-2xl p-8 hover:border-cyan-400/50 transition-all duration-500 group hover:shadow-2xl hover:shadow-cyan-500/10">
                <h3 className="text-2xl font-bold text-cyan-400 mb-6 flex items-center gap-3">
                  <FaFileContract className="text-cyan-400 group-hover:scale-110 transition-transform duration-300" />
                  Legal Framework
                </h3>
                <p className="text-cyan-200/80 text-lg leading-relaxed mb-6">
                  Our terms ensure fair and transparent adventures for all travelers. 
                  Your safety and satisfaction are our legal commitment.
                </p>
                
                {/* Legal Features */}
                <div className="space-y-4">
                  {legalFeatures.map((feature, index) => (
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

            {/* Quick Legal Stats */}
            <motion.div variants={itemVariants}>
              <div className="bg-black/50 backdrop-blur-lg border border-cyan-500/30 rounded-2xl p-6">
                <h4 className="text-cyan-400 font-semibold mb-4">Legal Assurance</h4>
                <div className="space-y-3">
                  {[
                    { label: "User Protection", value: "100%" },
                    { label: "Legal Compliance", value: "Full" },
                    { label: "Transparency", value: "Complete" },
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

            {/* Acceptance Note */}
            <motion.div variants={itemVariants}>
              <div className="bg-gradient-to-r from-cyan-500/10 to-cyan-600/10 border border-cyan-500/30 rounded-2xl p-6 text-center">
                <FaCheckCircle className="text-cyan-400 text-2xl mx-auto mb-3" />
                <p className="text-cyan-300 text-sm">
                  By using our services, you agree to these terms and conditions for safe adventures.
                </p>
              </div>
            </motion.div>
          </div>

          {/* Right Side - Terms Content */}
          <motion.div variants={cardVariants} className="lg:col-span-2">
            <div className="bg-black/50 backdrop-blur-xl border border-cyan-500/30 rounded-3xl p-8 shadow-2xl shadow-cyan-500/10 hover:border-cyan-400/50 hover:shadow-cyan-500/20 transition-all duration-500">
              {/* Header */}
              <div className="flex items-center gap-3 mb-8">
                <FaFileContract className="text-cyan-400 text-2xl" />
                <h3 className="text-2xl font-bold text-cyan-400">Terms & Conditions Document</h3>
              </div>

              {/* Introduction */}
              <motion.div
                className="mb-8 group"
                variants={itemVariants}
              >
                <div className="bg-cyan-500/5 border border-cyan-500/20 rounded-2xl p-6 hover:border-cyan-400/40 transition-all duration-500">
                  <p className="text-cyan-200/90 text-lg leading-relaxed">
                    Welcome to GoVickyGo. By accessing or using our travel services, 
                    you agree to be bound by these Terms and Conditions. Please read 
                    them carefully before embarking on your adventure with us.
                  </p>
                </div>
              </motion.div>

              {/* Terms Sections */}
              <motion.div
                className="space-y-6 max-h-[60vh] overflow-y-auto pr-4"
                variants={containerVariants}
              >
                {termsSections.map((section, index) => (
                  <motion.div
                    key={index}
                    className="group"
                    variants={itemVariants}
                  >
                    <div className="bg-black/40 backdrop-blur-lg border border-cyan-500/20 rounded-2xl p-6 hover:border-cyan-400/40 hover:bg-cyan-500/5 transition-all duration-500">
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 bg-cyan-500/10 border border-cyan-500/30 rounded-xl flex items-center justify-center group-hover:scale-110 transition-all duration-300 group-hover:border-cyan-400/50 flex-shrink-0">
                          <section.icon className="text-cyan-400 text-lg" />
                        </div>
                        <div className="flex-1">
                          <h3 className="text-xl font-bold text-cyan-400 mb-3 group-hover:translate-x-2 transition-transform duration-300">
                            {section.title}
                          </h3>
                          <p className="text-cyan-200/80 leading-relaxed">
                            {section.content}
                          </p>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>

              {/* Terms Footer */}
              <motion.div
                className="mt-8 pt-6 border-t border-cyan-500/20"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1 }}
              >
                <div className="flex flex-col sm:flex-row justify-between items-center gap-4 text-cyan-300/70">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                    <span>Last Updated: {new Date().toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center gap-4 text-sm">
                    <span className="flex items-center gap-1">
                      <FaCheckCircle className="text-green-400" />
                      Legal Document
                    </span>
                    <span className="flex items-center gap-1">
                      <FaGlobeAmericas className="text-cyan-400" />
                      Global Compliance
                    </span>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </motion.div>

        {/* Additional Info Cards */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          {[
            {
              title: "Safe Adventures",
              desc: "Your safety is our priority in all travel experiences",
              icon: FaShieldAlt
            },
            {
              title: "Clear Policies",
              desc: "Transparent terms for worry-free adventures",
              icon: FaBook
            },
            {
              title: "24/7 Support",
              desc: "Round-the-clock assistance for your journeys",
              icon: FaGlobeAmericas
            }
          ].map((card, index) => (
            <motion.div
              key={index}
              className="bg-black/40 backdrop-blur-lg border border-cyan-500/20 rounded-2xl p-6 text-center hover:border-cyan-400/40 hover:scale-105 transition-all duration-500 group"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <card.icon className="text-cyan-400 text-3xl mx-auto mb-3 group-hover:scale-110 transition-transform duration-300" />
              <h4 className="text-cyan-400 font-semibold mb-2">{card.title}</h4>
              <p className="text-cyan-200/70 text-sm">{card.desc}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* Floating Legal Icons */}
        <div className="absolute bottom-8 right-8 opacity-20 z-20">
          <div className="flex space-x-3">
            <FaFileContract className="text-cyan-400 animate-float" />
            <FaBalanceScale className="text-cyan-400 animate-float delay-1000" />
            <FaGavel className="text-cyan-400 animate-float delay-2000" />
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

export default TermsAndConditions;