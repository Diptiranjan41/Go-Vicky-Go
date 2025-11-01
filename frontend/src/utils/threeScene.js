import { createWebGLRenderer, safeDispose, cleanupThreeScene } from './webglUtils';

export const createBasicScene = (container) => {
  if (!container) return null;
  
  try {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 1000);
    camera.position.z = 20;

    const renderer = createWebGLRenderer();
    if (!renderer) {
      throw new Error('Renderer creation failed');
    }

    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setClearColor(0x000000, 0);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    container.appendChild(renderer.domElement);

    // Basic lighting
    const ambientLight = new THREE.AmbientLight(0x22d3ee, 0.3);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0x22d3ee, 0.6);
    directionalLight.position.set(5, 5, 5);
    scene.add(directionalLight);

    return { scene, camera, renderer };
  } catch (error) {
    console.error('Scene creation failed:', error);
    return null;
  }
};

export const createFloatingObjects = (scene, count = 8) => {
  const objects = [];
  const geometries = [
    new THREE.SphereGeometry(0.4, 16, 16),
    new THREE.BoxGeometry(0.6, 0.6, 0.6),
    new THREE.OctahedronGeometry(0.4, 0),
    new THREE.TorusGeometry(0.5, 0.1, 16, 100)
  ];

  for (let i = 0; i < count; i++) {
    try {
      const geometry = geometries[Math.floor(Math.random() * geometries.length)];
      const material = new THREE.MeshBasicMaterial({
        color: new THREE.Color().setHSL(0.55 + Math.random() * 0.1, 0.8, 0.6),
        transparent: true,
        opacity: 0.6
      });

      const object = new THREE.Mesh(geometry, material);
      
      const radius = 15 + Math.random() * 12;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      
      object.position.set(
        radius * Math.sin(phi) * Math.cos(theta),
        radius * Math.sin(phi) * Math.sin(theta),
        radius * Math.cos(phi)
      );

      object.userData = {
        originalY: object.position.y,
        floatSpeed: 0.1 + Math.random() * 0.15,
        timeOffset: Math.random() * Math.PI * 2
      };

      scene.add(object);
      objects.push(object);
    } catch (error) {
      console.warn('Failed to create floating object:', error);
    }
  }

  return objects;
};

export const createParticleSystem = (scene, count = 300) => {
  try {
    const particles = new THREE.BufferGeometry();
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      const radius = 20 + Math.random() * 25;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      
      positions[i3] = radius * Math.sin(phi) * Math.cos(theta);
      positions[i3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      positions[i3 + 2] = radius * Math.cos(phi);

      colors[i3] = 0.1 + Math.random() * 0.2;
      colors[i3 + 1] = 0.6 + Math.random() * 0.4;
      colors[i3 + 2] = 0.8 + Math.random() * 0.2;
    }

    particles.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    particles.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const particleMaterial = new THREE.PointsMaterial({
      size: 0.06,
      vertexColors: true,
      transparent: true,
      opacity: 0.5,
      sizeAttenuation: true
    });

    const particleSystem = new THREE.Points(particles, particleMaterial);
    scene.add(particleSystem);
    
    return particleSystem;
  } catch (error) {
    console.warn('Particle system creation failed:', error);
    return null;
  }
};