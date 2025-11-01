import React, { useRef, useEffect } from "react";
import { motion } from "framer-motion";
import * as THREE from 'three';
import { 
  FaCompass, 
  FaLightbulb, 
  FaHeart, 
  FaRoute, 
  FaGlobe, 
  FaBriefcase,
  FaRocket,
  FaUsers
} from "react-icons/fa";

const About = () => {
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
      new THREE.OctahedronGeometry(1, 0),
      new THREE.SphereGeometry(0.8, 32, 32),
      new THREE.TorusGeometry(0.6, 0.2, 16, 100),
      new THREE.ConeGeometry(0.5, 1, 8),
      new THREE.BoxGeometry(0.8, 0.8, 0.8),
      new THREE.DodecahedronGeometry(0.7, 0)
    ];

    // Create floating objects
    for (let i = 0; i < 15; i++) {
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

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Header with Same Style */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
                              <h2 class="text-4xl md:text-6xl font-bold text-cyan-400 mb-4 drop-shadow-lg">
  About Us
</h2>
       
          <div className="inline-flex items-center gap-3 bg-cyan-500/20 border border-cyan-500/30 px-6 py-3 rounded-full backdrop-blur-sm">
            <div className="flex space-x-1">
              <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse" />
              <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse delay-150" />
              <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse delay-300" />
            </div>
            <p className="text-cyan-300 text-sm font-medium">Your AI Travel Companion</p>
          </div>
        </motion.div>

        <motion.div
          className="space-y-8"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Intro Section */}
          <motion.div variants={itemVariants}>
            <div className="bg-black/50 backdrop-blur-lg border border-cyan-500/30 rounded-2xl p-8 hover:border-cyan-400/50 transition-all duration-500 group hover:shadow-2xl hover:shadow-cyan-500/10">
              <p className="text-cyan-200/80 text-lg leading-relaxed">
                Welcome to <span className="text-cyan-400 font-semibold">Go Vicky Go</span> – your intelligent travel companion. We specialize in AI-powered trip planning and smart destination recommendations to make your journey smoother and memorable.
              </p>
            </div>
          </motion.div>

          {/* Mission & Vision Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Mission Section */}
            <motion.div variants={cardVariants}>
              <div className="bg-black/50 backdrop-blur-xl border border-cyan-500/30 rounded-3xl p-8 hover:border-cyan-400/50 hover:shadow-cyan-500/20 transition-all duration-500 h-full">
                <div className="flex items-center gap-3 mb-6">
                  <FaRocket className="text-cyan-400 text-2xl" />
                  <h3 className="text-2xl font-bold text-cyan-400">Our Mission</h3>
                </div>
                <p className="text-cyan-200/80 leading-relaxed">
                  At Go Vicky Go, our mission is to revolutionize the way people travel by harnessing the power of artificial intelligence and data-driven insights. We aim to make trip planning not just easier, but smarter helping every traveler design personalized, affordable, and seamless journeys with just a few clicks.
                </p>
              </div>
            </motion.div>

            {/* Vision Section */}
            <motion.div variants={cardVariants}>
              <div className="bg-black/50 backdrop-blur-xl border border-cyan-500/30 rounded-3xl p-8 hover:border-cyan-400/50 hover:shadow-cyan-500/20 transition-all duration-500 h-full">
                <div className="flex items-center gap-3 mb-6">
                  <FaLightbulb className="text-cyan-400 text-2xl" />
                  <h3 className="text-2xl font-bold text-cyan-400">Our Vision</h3>
                </div>
                <p className="text-cyan-200/80 leading-relaxed">
                  Our vision is to become the world's most trusted and innovative platform for travel, empowering adventurers to explore new horizons with confidence and ease. We envision a future where travel is not a luxury but an accessible and enriching experience for all.
                </p>
              </div>
            </motion.div>
          </div>

          {/* What We Offer Section */}
          <motion.div variants={itemVariants}>
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-cyan-400 mb-4">What We Offer</h2>
              <p className="text-cyan-200/70">Discover our comprehensive travel solutions</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { icon: FaRoute, title: "AI-Powered Trip Planning", desc: "Create custom itineraries with our smart algorithms" },
                { icon: FaGlobe, title: "Smart Recommendations", desc: "Discover hidden gems based on your interests" },
                { icon: FaBriefcase, title: "Seamless Booking", desc: "Book flights, hotels, and activities in one place" }
              ].map((service, index) => (
                <motion.div
                  key={index}
                  className="bg-black/40 backdrop-blur-lg border border-cyan-500/20 rounded-2xl p-6 text-center hover:border-cyan-400/40 hover:bg-cyan-500/5 transition-all duration-500 group"
                  whileHover={{ scale: 1.05 }}
                >
                  <div className="w-16 h-16 bg-cyan-500/10 border border-cyan-500/30 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 group-hover:border-cyan-400/50 transition-all duration-300">
                    <service.icon className="text-cyan-400 text-2xl" />
                  </div>
                  <h3 className="text-cyan-400 font-semibold text-lg mb-3">{service.title}</h3>
                  <p className="text-cyan-200/70 text-sm leading-relaxed">{service.desc}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Core Values Section */}
          <motion.div variants={itemVariants}>
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-cyan-400 mb-4">Our Core Values</h2>
              <p className="text-cyan-200/70">The principles that guide our journey</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { icon: FaCompass, title: "Innovation", desc: "Constantly improving travel through technology" },
                { icon: FaUsers, title: "Customer-Centric", desc: "Your satisfaction is our top priority" },
                { icon: FaHeart, title: "Sustainability", desc: "Promoting responsible tourism practices" }
              ].map((value, index) => (
                <motion.div
                  key={index}
                  className="bg-black/40 backdrop-blur-lg border border-cyan-500/20 rounded-2xl p-6 text-center hover:border-cyan-400/40 hover:bg-cyan-500/5 transition-all duration-500 group"
                  whileHover={{ scale: 1.05 }}
                >
                  <div className="w-16 h-16 bg-cyan-500/10 border border-cyan-500/30 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 group-hover:border-cyan-400/50 transition-all duration-300">
                    <value.icon className="text-cyan-400 text-2xl" />
                  </div>
                  <h3 className="text-cyan-400 font-semibold text-lg mb-3">{value.title}</h3>
                  <p className="text-cyan-200/70 text-sm leading-relaxed">{value.desc}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Team Section */}
          <motion.div variants={itemVariants}>
            <div className="bg-black/50 backdrop-blur-xl border border-cyan-500/30 rounded-3xl p-8 hover:border-cyan-400/50 hover:shadow-cyan-500/20 transition-all duration-500">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-cyan-400 mb-4">Our Team</h2>
                <p className="text-cyan-200/70">The passionate minds behind Go Vicky Go</p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {[
                  { name: "Diptiranjan Mahapatra", role: "Founder & Developer", emoji: "👨‍💻" },
                  { name: "Diptiranjan Mahapatra", role: "UI/UX Designer", emoji: "🎨" },
                  { name: "Manoranjan Mahapatra", role: "Co-Founder", emoji: "🤝" }
                ].map((member, index) => (
                  <motion.div
                    key={index}
                    className="bg-black/40 backdrop-blur-lg border border-cyan-500/20 rounded-2xl p-6 text-center hover:border-cyan-400/40 hover:bg-cyan-500/5 transition-all duration-500 group"
                    whileHover={{ scale: 1.05 }}
                  >
                    <div className="w-20 h-20 bg-cyan-500/10 border border-cyan-500/30 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 group-hover:border-cyan-400/50 transition-all duration-300">
                      <div className="text-cyan-400 text-2xl">
                        {member.emoji}
                      </div>
                    </div>
                    <h3 className="text-cyan-400 font-semibold text-lg mb-2">{member.name}</h3>
                    <p className="text-cyan-200/70 text-sm">{member.role}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* Floating Icons */}
        <div className="absolute bottom-8 right-8 opacity-20 z-20">
          <div className="flex space-x-3">
            <FaCompass className="text-cyan-400 animate-float" />
            <FaRocket className="text-cyan-400 animate-float delay-1000" />
            <FaGlobe className="text-cyan-400 animate-float delay-2000" />
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

export default About;