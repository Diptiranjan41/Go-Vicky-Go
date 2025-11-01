import React, { useRef, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { FaCompass, FaMapMarkerAlt, FaSearch, FaGlobe } from 'react-icons/fa';

const PremiumTravelHero = () => {
  const mountRef = useRef(null);
  const sceneRef = useRef(null);
  const rendererRef = useRef(null);
  const cameraRef = useRef(null);
  const controlsRef = useRef(null);
  const frameRef = useRef(null);
  const globeRef = useRef(null);
  const orbitingIconsRef = useRef([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [destinationResults, setDestinationResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // Use environment variable for API key
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

  // Function to fetch destination recommendations from Gemini API
  const fetchDestinationRecommendations = async (query) => {
    if (!query.trim()) return;
    
    setIsLoading(true);
    try {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;
      
      const prompt = `Provide 3 travel destination recommendations for "${query}" with the following format for each destination:
      - Destination Name
      - Best Time to Visit: [season/months]
      - Highlights: [3 key attractions or activities]
      - Travel Tip: [brief practical tip]
      
      Format each destination exactly like this example:
      Paris, France
      Best Time to Visit: April-June, September-October
      Highlights: Eiffel Tower, Louvre Museum, Seine River Cruise
      Travel Tip: Buy museum passes online to skip queues
      
      Keep responses concise and focused on practical travel information.`;
      
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: prompt
            }]
          }]
        })
      });

      if (!response.ok) {
        throw new Error('API request failed');
      }

      const data = await response.json();
      const text = data.candidates[0].content.parts[0].text;
      
      // Parse the response into structured data
      const destinations = parseDestinationResponse(text);
      setDestinationResults(destinations);
      
    } catch (error) {
      console.error('Error fetching destination recommendations:', error);
      setDestinationResults([{
        name: 'Error loading recommendations',
        bestTime: 'Please try again',
        highlights: ['Check your connection', 'Verify API key'],
        tip: 'Contact support if issue persists'
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  // Parse the API response into structured destination objects
  const parseDestinationResponse = (text) => {
    const destinations = [];
    const lines = text.split('\n').filter(line => line.trim());
    
    for (let i = 0; i < lines.length; i += 4) {
      if (i + 3 < lines.length) {
        const name = lines[i].replace(/^\d+\.\s*/, '').trim();
        const bestTime = lines[i + 1].replace('Best Time to Visit:', '').trim();
        const highlights = lines[i + 2].replace('Highlights:', '').split(',').map(h => h.trim());
        const tip = lines[i + 3].replace('Travel Tip:', '').trim();
        
        if (name && bestTime && highlights.length > 0 && tip) {
          destinations.push({
            name,
            bestTime,
            highlights,
            tip
          });
        }
      }
    }
    
    return destinations.length > 0 ? destinations : [{
      name: 'Popular Destinations',
      bestTime: 'Year-round',
      highlights: ['Beaches', 'Mountains', 'Cities'],
      tip: 'Research local customs before traveling'
    }];
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      fetchDestinationRecommendations(searchQuery);
    }
  };

  useEffect(() => {
    if (!mountRef.current) return;

    // Scene setup
    const scene = new THREE.Scene();
    sceneRef.current = scene;
    scene.background = new THREE.Color(0x000000);

    // Camera
    const camera = new THREE.PerspectiveCamera(75, mountRef.current.clientWidth / mountRef.current.clientHeight, 0.1, 1000);
    camera.position.set(0, 0, 8);
    cameraRef.current = camera;

    // Renderer
    const renderer = new THREE.WebGLRenderer({ 
      antialias: true, 
      alpha: true,
    });
    
    renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
    renderer.setClearColor(0x000000, 0);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    
    const canvas = renderer.domElement;
    canvas.style.position = 'absolute';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    canvas.style.zIndex = '1';
    canvas.style.pointerEvents = 'auto';
    
    mountRef.current.appendChild(canvas);
    rendererRef.current = renderer;

    // OrbitControls
    const controls = new OrbitControls(camera, canvas);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.rotateSpeed = 0.8;
    controls.enableZoom = true;
    controls.enablePan = false;
    controls.autoRotate = true;
    controls.autoRotateSpeed = 0.5;
    controls.maxPolarAngle = Math.PI;
    controls.minPolarAngle = 0;
    controls.enabled = true;
    controls.update();
    
    controlsRef.current = controls;

    // Lighting - Same blue/cyan theme
    const ambientLight = new THREE.AmbientLight(0x22d3ee, 0.3);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0x22d3ee, 0.8);
    directionalLight.position.set(5, 5, 5);
    directionalLight.castShadow = true;
    scene.add(directionalLight);

    const pointLight = new THREE.PointLight(0x06b6d4, 1, 100);
    pointLight.position.set(0, 0, 10);
    scene.add(pointLight);

    // Create Accurate Earth-like Globe with Realistic Textures
    const createAccurateGlobe = () => {
      const globeGroup = new THREE.Group();
      
      // Main globe sphere with high resolution
      const globeGeometry = new THREE.SphereGeometry(2, 128, 128);
      
      // Create realistic Earth material with blue oceans and green continents
      const globeMaterial = new THREE.MeshPhongMaterial({
        color: 0x1e40af, // Deep blue for oceans
        specular: 0x222222,
        shininess: 5,
        transparent: true,
        opacity: 0.95,
      });
      
      const globeMesh = new THREE.Mesh(globeGeometry, globeMaterial);
      globeMesh.castShadow = true;
      globeMesh.receiveShadow = true;
      globeGroup.add(globeMesh);

      // Add detailed continent shapes with proper positioning
      const createContinent = (lat, lon, size, color, name) => {
        const continentGroup = new THREE.Group();
        
        // Main landmass with more detail
        const continentGeometry = new THREE.SphereGeometry(size, 64, 64);
        const continentMaterial = new THREE.MeshPhongMaterial({
          color: color,
          specular: 0x111111,
          shininess: 10,
          transparent: true,
          opacity: 0.9
        });
        
        const continent = new THREE.Mesh(continentGeometry, continentMaterial);
        continent.castShadow = true;
        
        // Convert latitude/longitude to 3D position
        const phi = (90 - lat) * (Math.PI / 180);
        const theta = (lon + 180) * (Math.PI / 180);
        
        const x = 2.1 * Math.sin(phi) * Math.cos(theta);
        const y = 2.1 * Math.cos(phi);
        const z = 2.1 * Math.sin(phi) * Math.sin(theta);
        
        continent.position.set(x, y, z);
        
        // Make the continent face outward from the sphere
        continent.lookAt(0, 0, 0);
        continent.rotateX(Math.PI / 2);
        
        continentGroup.add(continent);
        globeGroup.add(continentGroup);
        return continentGroup;
      };

      // Add realistic continents with proper geographical positions
      createContinent(40, -100, 0.4, 0x10b981, "North America");  // Green
      createContinent(0, 20, 0.35, 0x059669, "Africa");          // Dark Green
      createContinent(50, 100, 0.45, 0x047857, "Asia");          // Forest Green
      createContinent(-25, 135, 0.3, 0x065f46, "Australia");     // Deep Green
      createContinent(-20, -60, 0.35, 0x064e3b, "South America"); // Emerald
      createContinent(50, 10, 0.25, 0x134e4a, "Europe");         // Teal Green
      createContinent(75, -40, 0.2, 0x0f766e, "Greenland");      // Blue Green

      // Add atmospheric glow with multiple layers
      const atmosphereGeometry = new THREE.SphereGeometry(2.15, 64, 64);
      const atmosphereMaterial = new THREE.MeshBasicMaterial({
        color: 0x22d3ee,
        transparent: true,
        opacity: 0.1,
        side: THREE.BackSide
      });
      const atmosphere = new THREE.Mesh(atmosphereGeometry, atmosphereMaterial);
      globeGroup.add(atmosphere);

      // Outer glow layer
      const outerGlowGeometry = new THREE.SphereGeometry(2.3, 64, 64);
      const outerGlowMaterial = new THREE.MeshBasicMaterial({
        color: 0x06b6d4,
        transparent: true,
        opacity: 0.05,
        side: THREE.BackSide
      });
      const outerGlow = new THREE.Mesh(outerGlowGeometry, outerGlowMaterial);
      globeGroup.add(outerGlow);

      // Add detailed grid lines for longitude and latitude
      const createGridLines = () => {
        const gridGroup = new THREE.Group();
        const gridMaterial = new THREE.LineBasicMaterial({
          color: 0x22d3ee,
          transparent: true,
          opacity: 0.15
        });

        // Longitude lines (meridians)
        for (let i = 0; i < 12; i++) {
          const longitudeGeometry = new THREE.BufferGeometry();
          const longitudePoints = [];
          const theta = (i / 12) * Math.PI * 2;
          
          for (let j = 0; j <= 32; j++) {
            const phi = (j / 32) * Math.PI;
            const x = 2.05 * Math.sin(phi) * Math.cos(theta);
            const y = 2.05 * Math.cos(phi);
            const z = 2.05 * Math.sin(phi) * Math.sin(theta);
            longitudePoints.push(x, y, z);
          }
          
          longitudeGeometry.setAttribute('position', new THREE.Float32BufferAttribute(longitudePoints, 3));
          const longitudeLine = new THREE.Line(longitudeGeometry, gridMaterial);
          gridGroup.add(longitudeLine);
        }

        // Latitude lines (parallels)
        for (let i = 1; i < 8; i++) {
          const latitudeGeometry = new THREE.BufferGeometry();
          const latitudePoints = [];
          const phi = (i / 8) * Math.PI;
          
          for (let j = 0; j <= 32; j++) {
            const theta = (j / 32) * Math.PI * 2;
            const x = 2.05 * Math.sin(phi) * Math.cos(theta);
            const y = 2.05 * Math.cos(phi);
            const z = 2.05 * Math.sin(phi) * Math.sin(theta);
            latitudePoints.push(x, y, z);
          }
          
          latitudeGeometry.setAttribute('position', new THREE.Float32BufferAttribute(latitudePoints, 3));
          const latitudeLine = new THREE.Line(latitudeGeometry, gridMaterial);
          gridGroup.add(latitudeLine);
        }

        // Equator highlight
        const equatorGeometry = new THREE.BufferGeometry();
        const equatorPoints = [];
        const equatorPhi = Math.PI / 2;
        
        for (let j = 0; j <= 64; j++) {
          const theta = (j / 64) * Math.PI * 2;
          const x = 2.08 * Math.sin(equatorPhi) * Math.cos(theta);
          const y = 2.08 * Math.cos(equatorPhi);
          const z = 2.08 * Math.sin(equatorPhi) * Math.sin(theta);
          equatorPoints.push(x, y, z);
        }
        
        equatorGeometry.setAttribute('position', new THREE.Float32BufferAttribute(equatorPoints, 3));
        const equatorMaterial = new THREE.LineBasicMaterial({
          color: 0x06b6d4,
          transparent: true,
          opacity: 0.3
        });
        const equatorLine = new THREE.Line(equatorGeometry, equatorMaterial);
        gridGroup.add(equatorLine);

        globeGroup.add(gridGroup);
      };

      createGridLines();

      // Add star-like points for major cities
      const addCityPoints = () => {
        const cities = [
          { lat: 40.7128, lon: -74.0060, name: "New York" },   // NYC
          { lat: 51.5074, lon: -0.1278, name: "London" },      // London
          { lat: 35.6762, lon: 139.6503, name: "Tokyo" },      // Tokyo
          { lat: 48.8566, lon: 2.3522, name: "Paris" },        // Paris
          { lat: 28.6139, lon: 77.2090, name: "Delhi" },       // Delhi
          { lat: -33.8688, lon: 151.2093, name: "Sydney" },    // Sydney
        ];

        cities.forEach(city => {
          const pointGeometry = new THREE.SphereGeometry(0.03, 16, 16);
          const pointMaterial = new THREE.MeshBasicMaterial({
            color: 0x22d3ee,
            emissive: 0x06b6d4,
            emissiveIntensity: 0.5
          });
          const point = new THREE.Mesh(pointGeometry, pointMaterial);

          const phi = (90 - city.lat) * (Math.PI / 180);
          const theta = (city.lon + 180) * (Math.PI / 180);
          
          const x = 2.02 * Math.sin(phi) * Math.cos(theta);
          const y = 2.02 * Math.cos(phi);
          const z = 2.02 * Math.sin(phi) * Math.sin(theta);
          
          point.position.set(x, y, z);
          globeGroup.add(point);
        });
      };

      addCityPoints();

      scene.add(globeGroup);
      globeRef.current = globeGroup;
      return globeGroup;
    };

    // Create orbiting travel icons
    const createOrbitingIcon = (geometry, orbitRadius, speed, size = 0.3) => {
      const material = new THREE.MeshPhysicalMaterial({
        color: 0x22d3ee,
        metalness: 0.8,
        roughness: 0.2,
        transparent: true,
        opacity: 0.8,
        clearcoat: 1,
        clearcoatRoughness: 0.1,
        emissive: 0x164e63,
        emissiveIntensity: 0.3
      });
      
      const mesh = new THREE.Mesh(geometry, material);
      mesh.scale.set(size, size, size);
      mesh.castShadow = true;
      
      mesh.userData = {
        orbitRadius,
        speed,
        angle: Math.random() * Math.PI * 2,
        orbitOffset: Math.random() * Math.PI * 2,
        floatHeight: 0.2
      };
      
      scene.add(mesh);
      orbitingIconsRef.current.push(mesh);
      return mesh;
    };

    // Create accurate globe
    createAccurateGlobe();

    // Create orbiting travel icons
    const icons = [
      { geometry: new THREE.ConeGeometry(0.1, 0.3, 4), radius: 3.2, speed: 1.2 }, // Airplane
      { geometry: new THREE.BoxGeometry(0.2, 0.15, 0.1), radius: 3.5, speed: 1.0 }, // Camera
      { geometry: new THREE.OctahedronGeometry(0.15, 0), radius: 2.8, speed: 1.4 }, // Diamond
      { geometry: new THREE.TorusGeometry(0.1, 0.03, 16, 100), radius: 3.8, speed: 0.8 }, // Ring
    ];

    icons.forEach(icon => {
      createOrbitingIcon(icon.geometry, icon.radius, icon.speed);
    });

    // Particle System - Same as other pages
    const particleCount = 800;
    const particles = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3;
      const radius = 12 + Math.random() * 20;
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
      size: 0.05,
      vertexColors: true,
      transparent: true,
      opacity: 0.6,
      sizeAttenuation: true,
      blending: THREE.AdditiveBlending
    });

    const particleSystem = new THREE.Points(particles, particleMaterial);
    scene.add(particleSystem);

    // Animation loop
    const clock = new THREE.Clock();

    const animate = () => {
      frameRef.current = requestAnimationFrame(animate);
      
      const elapsedTime = clock.getElapsedTime();
      const deltaTime = clock.getDelta();

      // Rotate globe smoothly
      if (globeRef.current) {
        globeRef.current.rotation.y += deltaTime * 0.1;
      }

      // Animate orbiting icons
      orbitingIconsRef.current.forEach((icon, index) => {
        const { orbitRadius, speed, angle, orbitOffset, floatHeight } = icon.userData;
        
        const newAngle = angle + deltaTime * speed;
        icon.userData.angle = newAngle;
        
        const x = Math.cos(newAngle + orbitOffset) * orbitRadius;
        const z = Math.sin(newAngle + orbitOffset) * orbitRadius;
        const y = Math.sin(newAngle * 2 + index) * floatHeight;
        
        icon.position.set(x, y, z);
        icon.rotation.y += deltaTime * speed * 2;
        icon.rotation.x = Math.sin(newAngle) * 0.3;
      });

      // Animate particles
      particleSystem.rotation.y = elapsedTime * 0.02;
      particleSystem.rotation.x = Math.sin(elapsedTime * 0.01) * 0.1;

      controls.update();
      renderer.render(scene, camera);
    };

    animate();

    // Handle resize
    const handleResize = () => {
      if (!mountRef.current) return;
      
      const width = mountRef.current.clientWidth;
      const height = mountRef.current.clientHeight;
      
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };

    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current);
      }
      if (mountRef.current && rendererRef.current?.domElement) {
        mountRef.current.removeChild(rendererRef.current.domElement);
      }
      
      if (sceneRef.current) {
        sceneRef.current.traverse((object) => {
          if (object.geometry) object.geometry.dispose();
          if (object.material) {
            if (Array.isArray(object.material)) {
              object.material.forEach(material => material.dispose());
            } else {
              object.material.dispose();
            }
          }
        });
      }
      
      if (controlsRef.current) controlsRef.current.dispose();
      if (rendererRef.current) rendererRef.current.dispose();
      
      orbitingIconsRef.current = [];
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
    <section className="bg-black min-h-screen relative overflow-hidden">
      {/* Three.js Canvas Container */}
      <div 
        ref={mountRef} 
        className="absolute inset-0 w-full h-full z-0"
      />

      {/* Gradient Overlays - Same as other pages */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-1/3 bg-gradient-to-b from-cyan-500/10 to-transparent" />
        <div className="absolute bottom-0 left-0 w-full h-1/3 bg-gradient-to-t from-cyan-500/10 to-transparent" />
      </div>

      {/* Main Content */}
      <div className="relative z-10 min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 pointer-events-none">
        <div className="max-w-6xl w-full">
          <motion.div
            className="grid lg:grid-cols-2 gap-12 items-center"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {/* Left Content */}
            <motion.div className="text-center lg:text-left" variants={itemVariants}>
              <h1 className="text-4xl md:text-6xl font-black text-white mb-6 leading-tight">
                Explore The{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-cyan-500">
                  World
                </span>
              </h1>
              
              <p className="text-xl md:text-2xl text-cyan-200/80 mb-8 leading-relaxed">
                Discover amazing destinations with our interactive globe
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start pointer-events-auto">
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Link
                    to="/getstarted"
                    className="group bg-gradient-to-r from-cyan-500 to-cyan-600 text-black font-bold text-lg px-8 py-4 rounded-2xl transition-all duration-300 hover:from-cyan-400 hover:to-cyan-500 shadow-lg hover:shadow-cyan-500/30 flex items-center justify-center gap-3"
                  >
                    <FaGlobe className="text-lg" />
                    Start Exploring
                  </Link>
                </motion.div>
                
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Link
                    to="/destinations"
                    className="group border-2 border-cyan-500/30 text-cyan-400 hover:border-cyan-400/50 hover:bg-cyan-500/10 font-semibold text-lg px-8 py-4 rounded-2xl transition-all duration-300 backdrop-blur-sm flex items-center justify-center gap-3"
                  >
                    <FaMapMarkerAlt className="text-lg" />
                    View Destinations
                  </Link>
                </motion.div>
              </div>
            </motion.div>

            {/* Right Side - Glassmorphism Panels */}
            <motion.div className="space-y-6 pointer-events-auto" variants={itemVariants}>
              {/* Search Bar */}
              <form onSubmit={handleSearch} className="bg-black/50 backdrop-blur-xl border border-cyan-500/30 rounded-2xl p-6 shadow-2xl shadow-cyan-500/10 hover:border-cyan-400/50 transition-all duration-500">
                <div className="flex items-center space-x-4">
                  <div className="flex-1">
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search destinations, activities..."
                      className="w-full bg-transparent border-none text-cyan-200 placeholder-cyan-200/50 focus:outline-none focus:ring-0 text-lg"
                    />
                  </div>
                  <motion.button 
                    type="submit"
                    disabled={isLoading}
                    className="bg-gradient-to-r from-cyan-500 to-cyan-600 hover:from-cyan-400 hover:to-cyan-500 text-black p-3 rounded-xl transition-all duration-300 disabled:opacity-50"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {isLoading ? (
                      <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <FaSearch className="w-5 h-5" />
                    )}
                  </motion.button>
                </div>
              </form>

              {/* Destination Results */}
              {destinationResults.length > 0 && (
                <motion.div 
                  className="bg-black/50 backdrop-blur-xl border border-cyan-500/30 rounded-2xl p-6 shadow-2xl shadow-cyan-500/10"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <h3 className="text-cyan-400 font-semibold mb-4">Destination Recommendations</h3>
                  <div className="space-y-4">
                    {destinationResults.map((destination, index) => (
                      <div key={index} className="border-b border-cyan-500/20 pb-4 last:border-b-0">
                        <h4 className="text-cyan-300 font-medium mb-2">{destination.name}</h4>
                        <p className="text-cyan-200/80 text-sm mb-1">
                          <span className="text-cyan-400">Best Time:</span> {destination.bestTime}
                        </p>
                        <p className="text-cyan-200/80 text-sm mb-1">
                          <span className="text-cyan-400">Highlights:</span> {destination.highlights.join(', ')}
                        </p>
                        <p className="text-cyan-200/80 text-sm">
                          <span className="text-cyan-400">Tip:</span> {destination.tip}
                        </p>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Stats Panel */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-black/50 backdrop-blur-xl border border-cyan-500/30 rounded-2xl p-4 text-center hover:border-cyan-400/50 transition-all duration-300">
                  <div className="text-2xl font-bold text-cyan-400">195</div>
                  <div className="text-cyan-300/70 text-sm">Countries</div>
                </div>
                <div className="bg-black/50 backdrop-blur-xl border border-cyan-500/30 rounded-2xl p-4 text-center hover:border-cyan-400/50 transition-all duration-300">
                  <div className="text-2xl font-bold text-cyan-400">1K+</div>
                  <div className="text-cyan-300/70 text-sm">Cities</div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Floating Icons */}
      <div className="absolute bottom-8 right-8 opacity-20 z-20">
        <div className="flex space-x-3">
          <FaGlobe className="text-cyan-400 animate-float" />
          <FaCompass className="text-cyan-400 animate-float delay-1000" />
          <FaMapMarkerAlt className="text-cyan-400 animate-float delay-2000" />
        </div>
      </div>

      {/* Interactive Instructions */}
      <motion.div 
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20 pointer-events-none"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1 }}
      >
        <div className="flex items-center gap-3 bg-black/50 backdrop-blur-sm px-4 py-2 rounded-full border border-cyan-500/30">
          <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse" />
          <p className="text-cyan-300 text-sm font-medium">
            Drag to rotate • Scroll to zoom
          </p>
        </div>
      </motion.div>

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

export default PremiumTravelHero;