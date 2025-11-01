import React, { useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

const TravelGearHero3D = () => {
  const mountRef = useRef(null);
  const sceneRef = useRef(null);
  const rendererRef = useRef(null);
  const cameraRef = useRef(null);
  const controlsRef = useRef(null);
  const frameRef = useRef(null);
  const backpackRef = useRef(null);
  const objectsRef = useRef([]);

  useEffect(() => {
    if (!mountRef.current) {
      console.log('Mount ref not available');
      return;
    }

    console.log('Initializing Three.js scene...');

    // Handle resize function - moved outside try block
    const handleResize = () => {
      if (!mountRef.current || !cameraRef.current || !rendererRef.current) return;
      
      const width = mountRef.current.clientWidth;
      const height = mountRef.current.clientHeight;
      
      cameraRef.current.aspect = width / height;
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(width, height);
      
      console.log('Canvas resized:', width, 'x', height);
    };

    try {
      // Scene setup
      const scene = new THREE.Scene();
      sceneRef.current = scene;
      scene.background = new THREE.Color(0x000000);
      scene.fog = new THREE.Fog(0x000000, 10, 25);

      // Camera
      const camera = new THREE.PerspectiveCamera(50, mountRef.current.clientWidth / mountRef.current.clientHeight, 0.1, 1000);
      camera.position.set(0, 0, 15);
      cameraRef.current = camera;

      // Renderer
      const renderer = new THREE.WebGLRenderer({ 
        antialias: true, 
        alpha: true,
        powerPreference: "high-performance"
      });
      
      renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
      renderer.setClearColor(0x000000, 0);
      renderer.shadowMap.enabled = true;
      renderer.shadowMap.type = THREE.PCFSoftShadowMap;
      renderer.outputColorSpace = THREE.SRGBColorSpace;
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1.2;
      
      const canvas = renderer.domElement;
      canvas.style.position = 'absolute';
      canvas.style.top = '0';
      canvas.style.left = '0';
      canvas.style.width = '100%';
      canvas.style.height = '100%';
      canvas.style.zIndex = '0';
      canvas.style.pointerEvents = 'auto';
      
      // Clear any existing canvas
      while (mountRef.current.firstChild) {
        mountRef.current.removeChild(mountRef.current.firstChild);
      }
      mountRef.current.appendChild(canvas);
      rendererRef.current = renderer;

      console.log('Renderer created and attached');

      // Enhanced OrbitControls
      const controls = new OrbitControls(camera, canvas);
      controls.enableDamping = true;
      controls.dampingFactor = 0.05;
      controls.rotateSpeed = 0.8;
      controls.enableZoom = false;
      controls.enablePan = false;
      controls.autoRotate = true;
      controls.autoRotateSpeed = 0.5;
      controls.maxPolarAngle = Math.PI / 1.8;
      controls.minPolarAngle = Math.PI / 3;
      
      controls.enabled = true;
      controls.update();
      controlsRef.current = controls;

      console.log('Controls initialized');

      // Premium Lighting Setup - Increased intensity
      const ambientLight = new THREE.AmbientLight(0x22d3ee, 0.4);
      scene.add(ambientLight);

      const directionalLight = new THREE.DirectionalLight(0x22d3ee, 2.0);
      directionalLight.position.set(8, 10, 5);
      directionalLight.castShadow = true;
      directionalLight.shadow.mapSize.width = 1024;
      directionalLight.shadow.mapSize.height = 1024;
      scene.add(directionalLight);

      const rimLight = new THREE.DirectionalLight(0x06b6d4, 1.2);
      rimLight.position.set(-6, 4, -5);
      scene.add(rimLight);

      const pointLight = new THREE.PointLight(0x0891b2, 2.0, 30);
      pointLight.position.set(0, 3, 10);
      scene.add(pointLight);

      console.log('Lights added to scene');

      // Premium material creator - Increased emissive for better visibility
      const createPremiumMaterial = (color, metalness = 0.9, roughness = 0.1, opacity = 1) => {
        return new THREE.MeshPhysicalMaterial({
          color,
          metalness,
          roughness,
          transparent: opacity < 1,
          opacity,
          transmission: 0.1,
          clearcoat: 1,
          clearcoatRoughness: 0.05,
          emissive: new THREE.Color(color).multiplyScalar(0.3), // Increased emissive
          emissiveIntensity: 0.5 // Increased intensity
        });
      };

      // Create detailed backpack - Simplified for better visibility
      const createPremiumBackpack = () => {
        const backpackGroup = new THREE.Group();
        
        // Main backpack body - Larger and more visible
        const bodyGeometry = new THREE.BoxGeometry(4, 5, 2);
        const body = new THREE.Mesh(bodyGeometry, createPremiumMaterial(0x155e75));
        body.position.y = 0.5;
        backpackGroup.add(body);

        // Curved front panel
        const frontGeometry = new THREE.SphereGeometry(2.2, 32, 32, 0, Math.PI, 0, Math.PI);
        const front = new THREE.Mesh(frontGeometry, createPremiumMaterial(0x0e7490));
        front.rotation.x = Math.PI;
        front.position.z = 1.2;
        front.position.y = 0.5;
        backpackGroup.add(front);

        // Top lid
        const lidGeometry = new THREE.BoxGeometry(3.5, 0.4, 2.2);
        const lid = new THREE.Mesh(lidGeometry, createPremiumMaterial(0x22d3ee)); // Brighter color
        lid.position.y = 3.2;
        lid.position.z = -0.3;
        backpackGroup.add(lid);

        // Shoulder straps - More visible
        const createStrap = (side) => {
          const strapGroup = new THREE.Group();
          
          // Main strap
          const strapGeometry = new THREE.CylinderGeometry(0.2, 0.2, 4, 16);
          const strap = new THREE.Mesh(strapGeometry, createPremiumMaterial(0x22d3ee, 0.5, 0.3)); // Brighter
          strap.rotation.z = Math.PI / 2;
          strap.position.x = side * 2.2;
          strap.position.y = 1.5;
          
          // Padding
          const paddingGeometry = new THREE.SphereGeometry(0.4, 16, 16);
          const padding = new THREE.Mesh(paddingGeometry, createPremiumMaterial(0x22d3ee, 0.3, 0.2));
          padding.position.x = side * 2.2;
          padding.position.y = 0.5;
          
          strapGroup.add(strap);
          strapGroup.add(padding);
          return strapGroup;
        };

        backpackGroup.add(createStrap(-1));
        backpackGroup.add(createStrap(1));

        // Front pockets - More visible
        const pocketGeometry = new THREE.BoxGeometry(1.5, 1.2, 0.4);
        const leftPocket = new THREE.Mesh(pocketGeometry, createPremiumMaterial(0x06b6d4, 0.7, 0.2));
        leftPocket.position.set(-1.2, 1, 1.5);
        backpackGroup.add(leftPocket);

        const rightPocket = new THREE.Mesh(pocketGeometry, createPremiumMaterial(0x06b6d4, 0.7, 0.2));
        rightPocket.position.set(1.2, 1, 1.5);
        backpackGroup.add(rightPocket);

        // Add animation properties
        backpackGroup.userData = {
          floatSpeed: 0.8,
          rotationSpeed: 0.3,
          floatHeight: 0.2,
          timeOffset: 0
        };

        scene.add(backpackGroup);
        backpackRef.current = backpackGroup;
        objectsRef.current.push(backpackGroup);
        
        console.log('Backpack created and added to scene');
        return backpackGroup;
      };

      // Create floating travel icons - Brighter and larger
      const createTravelIcons = () => {
        const iconsGroup = new THREE.Group();
        
        // Mountain icon
        const createMountain = (x, y, z, size = 0.6) => {
          const mountainGroup = new THREE.Group();
          
          const geometry = new THREE.ConeGeometry(size, size * 1.8, 4);
          const material = createPremiumMaterial(0x22d3ee, 0.8, 0.1);
          const mountain = new THREE.Mesh(geometry, material);
          
          mountainGroup.add(mountain);
          mountainGroup.position.set(x, y, z);
          
          mountainGroup.userData = {
            originalY: y,
            floatSpeed: 0.6 + Math.random() * 0.4,
            rotationSpeed: 0.3 + Math.random() * 0.3,
            floatHeight: 0.4,
            timeOffset: Math.random() * Math.PI * 2
          };
          
          iconsGroup.add(mountainGroup);
          objectsRef.current.push(mountainGroup);
        };

        // Tent icon
        const createTent = (x, y, z, size = 0.5) => {
          const tentGroup = new THREE.Group();
          
          const geometry = new THREE.ConeGeometry(size, size * 1.5, 3);
          const material = createPremiumMaterial(0x06b6d4, 0.7, 0.2);
          const tent = new THREE.Mesh(geometry, material);
          
          tentGroup.add(tent);
          tentGroup.position.set(x, y, z);
          
          tentGroup.userData = {
            originalY: y,
            floatSpeed: 0.5 + Math.random() * 0.5,
            rotationSpeed: 0.4 + Math.random() * 0.4,
            floatHeight: 0.3,
            timeOffset: Math.random() * Math.PI * 2
          };
          
          tentGroup.add(tentGroup);
          objectsRef.current.push(tentGroup);
        };

        // Create multiple travel icons around the backpack
        createMountain(-5, 3, -2, 0.7);
        createTent(4, -2, -3, 0.6);
        createMountain(-4, -3, 2, 0.65);
        createTent(5, 2, 3, 0.55);
        createMountain(3, 4, -2, 0.6);
        
        scene.add(iconsGroup);
        console.log('Travel icons created and added to scene');
        return iconsGroup;
      };

      // Create floating compass waves - More visible
      const createCompassWaves = () => {
        const wavesGroup = new THREE.Group();
        
        for (let i = 0; i < 5; i++) {
          const waveGeometry = new THREE.RingGeometry(4 + i * 1, 4.3 + i * 1, 64);
          const waveMaterial = new THREE.MeshBasicMaterial({
            color: new THREE.Color(0x22d3ee).multiplyScalar(0.8 + i * 0.1),
            transparent: true,
            opacity: 0.2 - i * 0.03, // Increased opacity
            side: THREE.DoubleSide
          });
          
          const wave = new THREE.Mesh(waveGeometry, waveMaterial);
          wave.rotation.x = Math.PI / 2;
          wave.position.y = 0.5;
          
          wave.userData = {
            originalScale: 1,
            pulseSpeed: 0.5 + i * 0.2,
            timeOffset: i * 0.5
          };
          
          wavesGroup.add(wave);
          objectsRef.current.push(wave);
        }
        
        scene.add(wavesGroup);
        console.log('Compass waves created and added to scene');
        return wavesGroup;
      };

      // Create particle system for background
      const createParticleField = () => {
        const particleCount = 800; // Reduced for performance
        const particles = new THREE.BufferGeometry();
        const positions = new Float32Array(particleCount * 3);
        const colors = new Float32Array(particleCount * 3);

        for (let i = 0; i < particleCount; i++) {
          const i3 = i * 3;
          const radius = 8 + Math.random() * 6;
          const theta = Math.random() * Math.PI * 2;
          const phi = Math.acos(2 * Math.random() - 1);
          
          positions[i3] = radius * Math.sin(phi) * Math.cos(theta);
          positions[i3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
          positions[i3 + 2] = radius * Math.cos(phi);

          // Cyan color variations - Brighter
          colors[i3] = 0.2 + Math.random() * 0.3;
          colors[i3 + 1] = 0.7 + Math.random() * 0.3;
          colors[i3 + 2] = 0.8 + Math.random() * 0.2;
        }

        particles.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        particles.setAttribute('color', new THREE.BufferAttribute(colors, 3));

        const particleMaterial = new THREE.PointsMaterial({
          size: 0.08, // Larger particles
          vertexColors: true,
          transparent: true,
          opacity: 0.8, // More visible
          sizeAttenuation: true,
          blending: THREE.AdditiveBlending
        });

        const particleSystem = new THREE.Points(particles, particleMaterial);
        scene.add(particleSystem);
        console.log('Particle system created and added to scene');
        return particleSystem;
      };

      // Create all elements
      createPremiumBackpack();
      createCompassWaves();
      createTravelIcons();
      const particleSystem = createParticleField();

      console.log('All 3D elements created');

      // Animation loop
      const clock = new THREE.Clock();

      const animate = () => {
        frameRef.current = requestAnimationFrame(animate);
        
        const elapsedTime = clock.getElapsedTime();
        const deltaTime = clock.getDelta();

        // Animate backpack and floating objects
        objectsRef.current.forEach((object) => {
          const { originalY, floatSpeed, rotationSpeed, floatHeight, timeOffset, originalScale, pulseSpeed } = object.userData;
          
          if (originalY !== undefined) {
            // Floating animation
            object.position.y = originalY + Math.sin(elapsedTime * floatSpeed + timeOffset) * floatHeight;
          }
          
          if (originalScale !== undefined) {
            // Pulsing animation for waves
            const scale = originalScale + Math.sin(elapsedTime * pulseSpeed + timeOffset) * 0.1;
            object.scale.set(scale, scale, scale);
          }
          
          // Gentle rotation
          object.rotation.y += deltaTime * (rotationSpeed || 0.2);
          object.rotation.x = Math.sin(elapsedTime * (floatSpeed || 1) * 0.5) * 0.05;
        });

        // Particle system animation
        particleSystem.rotation.y = elapsedTime * 0.02;
        particleSystem.rotation.x = Math.sin(elapsedTime * 0.03) * 0.1;

        // Subtle camera movement
        camera.position.x = Math.sin(elapsedTime * 0.08) * 0.5;
        camera.position.y = Math.cos(elapsedTime * 0.05) * 0.3;

        controls.update();
        renderer.render(scene, camera);
      };

      animate();
      console.log('Animation loop started');

      // Add resize event listener
      window.addEventListener('resize', handleResize);

      // Initial render
      renderer.render(scene, camera);

    } catch (error) {
      console.error('Error initializing Three.js:', error);
    }

    // Cleanup
    return () => {
      console.log('Cleaning up Three.js scene');
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
      
      objectsRef.current = [];
    };
  }, []);

  return (
    <section className="bg-black text-white min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 py-10 relative overflow-hidden">
      {/* Three.js Canvas Container */}
      <div 
        ref={mountRef} 
        className="absolute inset-0 w-full h-full z-0"
        style={{ minHeight: '600px' }}
      />

      {/* Main Content */}
      <div className="relative z-10 max-w-7xl w-full flex flex-col-reverse lg:flex-row items-center justify-between gap-12">
        {/* Text Content */}
        <div className="flex-1 text-center lg:text-left pointer-events-none">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-3 bg-cyan-500/20 border border-cyan-500/30 px-4 py-2 rounded-full mb-4">
              <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse" />
              <span className="text-cyan-300 text-sm font-medium">Adventure Ready</span>
            </div>
            
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-black text-white leading-tight">
              Explore The{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-cyan-500">
                Great Outdoors
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-cyan-200/80 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
              Gear up for your next adventure with our premium travel equipment. 
              Durable, lightweight, and designed for the modern explorer.
            </p>
          </div>
          
          <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center lg:justify-start pointer-events-auto">
            <Link
              to="/products"
              className="group bg-gradient-to-r from-cyan-500 to-cyan-600 hover:from-cyan-400 hover:to-cyan-500 text-white font-bold px-8 py-4 rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-2xl hover:shadow-cyan-500/30 text-lg"
            >
              <span className="flex items-center justify-center gap-3">
                Shop Gear
                <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </span>
            </Link>
            
            <Link
              to="/collections"
              className="group border-2 border-cyan-500 text-cyan-400 hover:bg-cyan-500/10 px-8 py-4 rounded-xl transition-all duration-300 transform hover:scale-105 backdrop-blur-sm text-lg"
            >
              View Collections
            </Link>
          </div>

          {/* Features Grid */}
          <div className="mt-12 grid grid-cols-2 md:grid-cols-3 gap-6 max-w-2xl">
            <div className="text-center lg:text-left">
              <div className="text-cyan-400 font-semibold">Weather Resistant</div>
              <div className="text-cyan-200/70 text-sm">Built for all conditions</div>
            </div>
            <div className="text-center lg:text-left">
              <div className="text-cyan-400 font-semibold">Lightweight</div>
              <div className="text-cyan-200/70 text-sm">Easy to carry</div>
            </div>
            <div className="text-center lg:text-left">
              <div className="text-cyan-400 font-semibold">Durable Build</div>
              <div className="text-cyan-200/70 text-sm">Made to last</div>
            </div>
          </div>
        </div>

        {/* Visual spacer for balance */}
        <div className="flex-1" />
      </div>

      {/* Background Glow Effects */}
      <div className="absolute inset-0 overflow-hidden z-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/3 right-1/4 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>

      {/* Interactive Instructions */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-10 pointer-events-none">
        <div className="flex items-center gap-3 bg-black/40 backdrop-blur-sm px-4 py-2 rounded-full border border-cyan-500/30">
          <div className="w-2 h-2 bg-cyan-400 rounded-full animate-ping" />
          <p className="text-cyan-300 text-sm font-medium">
            Drag to explore the 3D backpack
          </p>
        </div>
      </div>
    </section>
  );
};

export default TravelGearHero3D;