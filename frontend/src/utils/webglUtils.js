export const checkWebGLAvailability = () => {
  try {
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    
    if (!gl) {
      return false;
    }
    
    // Additional WebGL capability checks
    const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
    if (debugInfo) {
      const vendor = gl.getParameter(debugInfo.UNMASKED_VENDOR_WEBGL);
      const renderer = gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL);
      console.log('WebGL Vendor:', vendor);
      console.log('WebGL Renderer:', renderer);
    }
    
    return true;
  } catch (error) {
    console.warn('WebGL not available:', error);
    return false;
  }
};

export const createWebGLRenderer = (options = {}) => {
  try {
    const defaultOptions = {
      alpha: true,
      antialias: true,
      powerPreference: "high-performance",
      ...options
    };

    const renderer = new THREE.WebGLRenderer(defaultOptions);
    
    // Verify context was created
    const context = renderer.getContext();
    if (!context) {
      throw new Error('WebGL context creation failed');
    }
    
    // Check for critical WebGL features
    if (!context.getShaderPrecisionFormat) {
      throw new Error('WebGL shader precision not supported');
    }
    
    return renderer;
  } catch (error) {
    console.error('WebGL renderer creation failed:', error);
    return null;
  }
};

export const safeDispose = (object) => {
  if (!object) return;
  
  if (object.dispose && typeof object.dispose === 'function') {
    object.dispose();
  }
  
  if (object.geometry) {
    object.geometry.dispose();
  }
  
  if (object.material) {
    if (Array.isArray(object.material)) {
      object.material.forEach(material => material.dispose());
    } else {
      object.material.dispose();
    }
  }
};

export const cleanupThreeScene = (scene, renderer, animationId) => {
  if (animationId) {
    cancelAnimationFrame(animationId);
  }
  
  if (scene) {
    scene.traverse(safeDispose);
  }
  
  if (renderer) {
    safeDispose(renderer);
  }
};