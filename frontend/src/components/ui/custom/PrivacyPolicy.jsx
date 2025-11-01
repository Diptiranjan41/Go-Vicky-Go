import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import * as THREE from 'three';
import { 
  FaLock, 
  FaEye, 
  FaDatabase, 
  FaUserCheck, 
  FaGlobe, 
  FaCertificate,
  FaShieldAlt,
  FaUserShield,
  FaKey,
  FaCode
} from "react-icons/fa";

const PrivacyPolicy = () => {
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

    // Security-themed 3D Objects
    const objects = [];
    const geometries = [
      new THREE.OctahedronGeometry(1, 0),
      new THREE.BoxGeometry(1, 1.5, 0.3),
      new THREE.CylinderGeometry(0.8, 0.8, 0.2, 32),
      new THREE.TorusGeometry(0.6, 0.1, 16, 100),
      new THREE.SphereGeometry(0.7, 32, 32)
    ];

    // Create floating security objects
    for (let i = 0; i < 12; i++) {
      const geometry = geometries[Math.floor(Math.random() * geometries.length)];
      const material = new THREE.MeshPhysicalMaterial({
        color: new THREE.Color().setHSL(Math.random() * 0.3 + 0.5, 0.8, 0.6),
        metalness: 0.8,
        roughness: 0.1,
        transparent: true,
        opacity: 0.7,
        transmission: 0.1,
        clearcoat: 1,
        clearcoatRoughness: 0.05
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

    // Particle System
    const particleCount = 800;
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

      // Blue/Cyan color variations
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

  const policySections = [
    {
      icon: FaDatabase,
      title: "1. Information We Collect",
      content: "We may collect personal information such as your name, email address, contact number, and location when you register or use our services. This helps us provide personalized travel recommendations and services."
    },
    {
      icon: FaGlobe,
      title: "2. How We Use Your Information", 
      content: "Your information is used to improve our services, process bookings, personalize content, send updates, and respond to your queries. We analyze travel preferences to enhance your adventure planning experience."
    },
    {
      icon: FaShieldAlt,
      title: "3. Data Protection & Security",
      content: "We implement industry-standard security measures to safeguard your data from unauthorized access, misuse, or disclosure. Your travel data and personal information are encrypted and stored securely."
    },
    {
      icon: FaEye,
      title: "4. Cookies & Tracking",
      content: "Our website may use cookies to enhance user experience. You can choose to disable cookies through your browser settings. We use analytics to improve our travel services and user interface."
    },
    {
      icon: FaUserCheck,
      title: "5. Your Rights & Control",
      content: "You can request access to, correction, or deletion of your personal data at any time by contacting us. We respect your right to control your travel data and personal information."
    },
    {
      icon: FaLock,
      title: "6. Information Sharing",
      content: "We do not sell or rent your personal data. We may share data with trusted third parties who help us operate the website and provide services, under strict confidentiality agreements."
    }
  ];

  const securityFeatures = [
    { icon: FaLock, text: "End-to-End Encryption" },
    { icon: FaCertificate, text: "GDPR Compliant" },
    { icon: FaUserShield, text: "User Control" },
    { icon: FaKey, text: "Secure Authentication" }
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
 Privacy Policy
</h2>
         
          <div className="inline-flex items-center gap-3 bg-cyan-500/20 border border-cyan-500/30 px-6 py-3 rounded-full backdrop-blur-sm">
            <div className="flex space-x-1">
              <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse" />
              <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse delay-150" />
              <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse delay-300" />
            </div>
            <p className="text-cyan-300 text-sm font-medium">Your Data, Your Control</p>
          </div>
        </motion.div>

        <motion.div
          className="grid grid-cols-1 lg:grid-cols-3 gap-8"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Left Side - Security Features */}
          <div className="lg:col-span-1 space-y-6">
            <motion.div variants={itemVariants}>
              <div className="bg-black/50 backdrop-blur-lg border border-cyan-500/30 rounded-2xl p-8 hover:border-cyan-400/50 transition-all duration-500 group hover:shadow-2xl hover:shadow-cyan-500/10">
                <h3 className="text-2xl font-bold text-cyan-400 mb-6 flex items-center gap-3">
                  <FaShieldAlt className="text-cyan-400 group-hover:scale-110 transition-transform duration-300" />
                  Our Commitment
                </h3>
                <p className="text-cyan-200/80 text-lg leading-relaxed mb-6">
                  We are committed to protecting your privacy and ensuring the security 
                  of your personal data. Your trust is our priority.
                </p>
                
                {/* Security Features */}
                <div className="space-y-4">
                  {securityFeatures.map((feature, index) => (
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

            {/* Quick Stats */}
            <motion.div variants={itemVariants}>
              <div className="bg-black/50 backdrop-blur-lg border border-cyan-500/30 rounded-2xl p-6">
                <h4 className="text-cyan-400 font-semibold mb-4">Data Protection</h4>
                <div className="space-y-3">
                  {[
                    { label: "Data Encryption", value: "100%" },
                    { label: "Privacy Compliance", value: "GDPR" },
                    { label: "User Control", value: "Full" },
                    { label: "Transparency", value: "Complete" }
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

          {/* Right Side - Policy Content */}
          <motion.div variants={cardVariants} className="lg:col-span-2">
            <div className="bg-black/50 backdrop-blur-xl border border-cyan-500/30 rounded-3xl p-8 shadow-2xl shadow-cyan-500/10 hover:border-cyan-400/50 hover:shadow-cyan-500/20 transition-all duration-500">
              {/* Header */}
              <div className="flex items-center gap-3 mb-8">
                <FaShieldAlt className="text-cyan-400 text-2xl" />
                <h3 className="text-2xl font-bold text-cyan-400">Privacy Policy Document</h3>
              </div>

              {/* Policy Sections */}
              <motion.div
                className="space-y-6 max-h-[70vh] overflow-y-auto pr-4"
                variants={containerVariants}
              >
                {policySections.map((section, index) => (
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

              {/* Policy Footer */}
              <motion.div
                className="mt-8 pt-6 border-t border-cyan-500/20"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1 }}
              >
                <div className="flex flex-col sm:flex-row justify-between items-center gap-4 text-cyan-300/70">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                    <span>Last Updated: {new Date().getFullYear()}</span>
                  </div>
                  <div className="flex items-center gap-4 text-sm">
                    <span className="flex items-center gap-1">
                      <FaLock className="text-green-400" />
                      Secure Document
                    </span>
                    <span className="flex items-center gap-1">
                      <FaCertificate className="text-cyan-400" />
                      GDPR Compliant
                    </span>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </motion.div>

        {/* Floating Security Icons */}
        <div className="absolute bottom-8 right-8 opacity-20 z-20">
          <div className="flex space-x-3">
            <FaShieldAlt className="text-cyan-400 animate-float" />
            <FaLock className="text-cyan-400 animate-float delay-1000" />
            <FaCertificate className="text-cyan-400 animate-float delay-2000" />
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

export default PrivacyPolicy;