import React, { useState, useRef, useEffect } from "react";
import { FaChevronDown } from "react-icons/fa";
import * as THREE from 'three';

const faqs = [
  {
    question: "What is Go Vicky Go?",
    answer:
      "Go Vicky Go is an AI-powered travel planner that helps you plan smart, affordable, and personalized trips across the world in minutes.",
  },
  {
    question: "Is it free to use?",
    answer:
      "Yes! Our basic features are completely free. Premium options may be added in the future for advanced planning tools.",
  },
  {
    question: "How do I start planning my trip?",
    answer:
      "Just click on the 'Start Planning' button, enter your destination, budget, and preferences — and our AI will do the rest.",
  },
  {
    question: "Can I share my itinerary?",
    answer:
      "Absolutely. You can download, print, or share your custom itineraries with friends or family via a unique link.",
  },
  {
    question: "Do I need to create an account to plan a trip?",
    answer:
      "No account is required for basic planning. However, creating an account lets you save, edit, and revisit your trips anytime.",
  },
  {
    question: "Does Go Vicky Go book hotels or flights?",
    answer:
      "Currently, we do not book travel directly. We provide the best suggestions and links to booking partners for convenience.",
  },
  {
    question: "Is my travel data safe?",
    answer:
      "Yes. We prioritize privacy. Your itinerary and preferences are securely stored and never shared without your consent.",
  },
  {
    question: "Can I plan a group trip with friends?",
    answer:
      "Yes, you can plan trips for groups. Simply add the number of travelers and preferences, and we'll generate a custom plan.",
  },
  {
    question: "Does it work for international destinations?",
    answer:
      "Yes, Go Vicky Go supports destinations all over the world including domestic and international travel.",
  },
  {
    question: "How can I contact support?",
    answer:
      "You can reach our support team at support@govickygo.com or through the chat icon on the website.",
  },
];

const FAQSection = () => {
  const [openIndex, setOpenIndex] = useState(null);
  const threeContainerRef = useRef(null);

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

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

    const directionalLight = new THREE.DirectionalLight(0x22d3ee, 0.6);
    directionalLight.position.set(5, 5, 5);
    scene.add(directionalLight);

    const pointLight = new THREE.PointLight(0x06b6d4, 0.8, 100);
    pointLight.position.set(0, 0, 10);
    scene.add(pointLight);

    // Floating 3D Objects - Question Mark Inspired
    const objects = [];
    const geometries = [
      new THREE.TorusGeometry(0.4, 0.1, 16, 100),  // Ring for question mark
      new THREE.SphereGeometry(0.3, 16, 16),       // Dot for question mark
      new THREE.ConeGeometry(0.3, 0.8, 8),         // Arrow-like shape
      new THREE.BoxGeometry(0.5, 0.5, 0.5),        // Info box
      new THREE.OctahedronGeometry(0.4, 0),        // Crystal
      new THREE.DodecahedronGeometry(0.35, 0)      // Complex shape
    ];

    // Create floating objects
    for (let i = 0; i < 15; i++) {
      const geometry = geometries[Math.floor(Math.random() * geometries.length)];
      const material = new THREE.MeshPhysicalMaterial({
        color: new THREE.Color().setHSL(0.55 + Math.random() * 0.1, 0.8, 0.6),
        metalness: 0.7,
        roughness: 0.2,
        transparent: true,
        opacity: 0.5,
        transmission: 0.2,
        clearcoat: 1,
        clearcoatRoughness: 0.1,
        emissive: new THREE.Color(0x22d3ee).multiplyScalar(0.1)
      });

      const object = new THREE.Mesh(geometry, material);
      
      // Position in a wide sphere
      const radius = 20 + Math.random() * 20;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      
      object.position.x = radius * Math.sin(phi) * Math.cos(theta);
      object.position.y = radius * Math.sin(phi) * Math.sin(theta);
      object.position.z = radius * Math.cos(phi);

      object.rotation.x = Math.random() * Math.PI;
      object.rotation.y = Math.random() * Math.PI;

      object.userData = {
        speed: 0.08 + Math.random() * 0.12,
        amplitude: 0.2 + Math.random() * 0.4,
        frequency: 0.3 + Math.random() * 0.5,
        spinSpeed: 0.005 + Math.random() * 0.01,
        originalY: object.position.y
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
      const radius = 25 + Math.random() * 30;
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
      size: 0.05,
      vertexColors: true,
      transparent: true,
      opacity: 0.4,
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
        object.rotation.x += object.userData.spinSpeed;
        object.rotation.y += object.userData.spinSpeed * 0.8;
        
        // Floating animation
        object.position.y = object.userData.originalY + Math.sin(elapsedTime * object.userData.frequency + index) * object.userData.amplitude;
        
        // Gentle movement
        object.position.x += Math.cos(elapsedTime * object.userData.speed * 0.5 + index) * 0.001;
        object.position.z += Math.sin(elapsedTime * object.userData.speed * 0.3 + index) * 0.001;

        // Subtle pulsing
        const scale = 1 + Math.sin(elapsedTime * object.userData.speed * 1.5 + index) * 0.05;
        object.scale.set(scale, scale, scale);
      });

      // Rotate particle system slowly
      particleSystem.rotation.y = elapsedTime * 0.008;

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

  return (
    <section className="bg-black text-white py-20 px-6 relative overflow-hidden">
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

      <div className="max-w-4xl mx-auto relative z-10">
        {/* Header with 3D Effect */}
        <div className="text-center mb-16">
                                              <h2 class="text-4xl md:text-6xl font-bold text-cyan-400 mb-4 drop-shadow-lg">
  Frequently Asked Questions
</h2>
          
          <div className="inline-flex items-center gap-3 bg-cyan-500/20 border border-cyan-500/30 px-6 py-3 rounded-full backdrop-blur-sm">
            <div className="flex space-x-1">
              <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse" />
              <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse delay-150" />
              <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse delay-300" />
            </div>
            <p className="text-cyan-300 text-sm font-medium">Got Questions? We've Got Answers!</p>
          </div>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="group bg-black/50 backdrop-blur-lg border border-cyan-500/30 rounded-2xl p-6 transition-all duration-500 hover:border-cyan-400/50 hover:shadow-2xl hover:shadow-cyan-500/10 overflow-hidden"
            >
              <button
                onClick={() => toggleFAQ(index)}
                className="flex justify-between items-center w-full text-left group"
              >
                <div className="flex items-center gap-4">
                  <div className="w-8 h-8 bg-cyan-500/20 border border-cyan-500/30 rounded-lg flex items-center justify-center group-hover:scale-110 group-hover:border-cyan-400/50 transition-all duration-300">
                    <span className="text-cyan-400 font-bold text-sm">?</span>
                  </div>
                  <span className="text-lg font-semibold text-cyan-300 group-hover:text-cyan-200 transition-colors duration-300">
                    {faq.question}
                  </span>
                </div>
                <FaChevronDown
                  className={`text-cyan-400 transition-all duration-500 flex-shrink-0 ${
                    openIndex === index 
                      ? "rotate-180 scale-110" 
                      : "group-hover:scale-110"
                  }`}
                />
              </button>
              
              {openIndex === index && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  transition={{ duration: 0.3 }}
                  className="mt-4"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-1 h-auto bg-gradient-to-b from-cyan-400 to-cyan-600 rounded-full mt-2" />
                    <p className="text-gray-300 text-lg leading-relaxed flex-1">
                      {faq.answer}
                    </p>
                  </div>
                </motion.div>
              )}
            </div>
          ))}
        </div>

        {/* Additional Help Section */}
        <div className="mt-12 text-center">
          <div className="bg-black/50 backdrop-blur-lg border border-cyan-500/30 rounded-2xl p-8 hover:border-cyan-400/50 transition-all duration-500">
            <h3 className="text-2xl font-bold text-cyan-400 mb-4">
              Still have questions?
            </h3>
            <p className="text-gray-300 mb-6">
              Can't find the answer you're looking for? Please reach out to our friendly team.
            </p>
            <a
              href="/contact"
              className="inline-flex items-center gap-2 bg-cyan-500 hover:bg-cyan-400 text-black font-bold py-3 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-cyan-500/30"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              Contact Support
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

// Add motion component for animations
const motion = {
  div: ({ children, initial, animate, transition, className }) => (
    <div className={className} style={{ 
      opacity: initial?.opacity || 1,
      height: initial?.height || 'auto',
      transition: `all ${transition?.duration || 0.3}s ease-in-out`
    }}>
      {children}
    </div>
  )
};

export default FAQSection;