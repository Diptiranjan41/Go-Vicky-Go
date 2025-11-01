export const createFallbackAnimation = (container) => {
  if (!container) return;
  
  // Create CSS-based fallback animation
  const fallbackHTML = `
    <div class="fallback-animation">
      <div class="floating-shapes">
        ${Array.from({ length: 12 }, (_, i) => `
          <div class="shape shape-${i}" style="
            --delay: ${i * 0.2}s;
            --duration: ${3 + Math.random() * 2}s;
            --size: ${20 + Math.random() * 30}px;
            --color-hue: ${200 + Math.random() * 60};
          "></div>
        `).join('')}
      </div>
    </div>
  `;
  
  container.innerHTML = fallbackHTML;
  
  // Add CSS styles
  const style = document.createElement('style');
  style.textContent = `
    .fallback-animation {
      position: absolute;
      inset: 0;
      overflow: hidden;
      pointer-events: none;
    }
    
    .floating-shapes {
      position: relative;
      width: 100%;
      height: 100%;
    }
    
    .shape {
      position: absolute;
      border-radius: 50%;
      background: linear-gradient(45deg, 
        hsl(var(--color-hue), 70%, 60%), 
        hsl(calc(var(--color-hue) + 30), 80%, 50%)
      );
      opacity: 0.3;
      animation: floatFallback var(--duration) ease-in-out var(--delay) infinite;
    }
    
    @keyframes floatFallback {
      0%, 100% {
        transform: 
          translate(calc(var(--x, 0) * 1vw), calc(var(--y, 0) * 1vh)) 
          scale(1) 
          rotate(0deg);
        opacity: 0.2;
      }
      25% {
        transform: 
          translate(calc(var(--x, 0) * 1.2vw), calc(var(--y, 0) * 1.1vh)) 
          scale(1.2) 
          rotate(90deg);
        opacity: 0.4;
      }
      50% {
        transform: 
          translate(calc(var(--x, 0) * 0.8vw), calc(var(--y, 0) * 1.3vh)) 
          scale(0.8) 
          rotate(180deg);
        opacity: 0.6;
      }
      75% {
        transform: 
          translate(calc(var(--x, 0) * 1.1vw), calc(var(--y, 0) * 0.9vh)) 
          scale(1.1) 
          rotate(270deg);
        opacity: 0.4;
      }
    }
  `;
  
  document.head.appendChild(style);
  
  // Position shapes randomly
  setTimeout(() => {
    const shapes = container.querySelectorAll('.shape');
    shapes.forEach(shape => {
      const x = Math.random() * 100 - 50;
      const y = Math.random() * 100 - 50;
      shape.style.setProperty('--x', x);
      shape.style.setProperty('--y', y);
      shape.style.width = `var(--size)`;
      shape.style.height = `var(--size)`;
    });
  }, 100);
  
  return () => {
    // Cleanup function
    if (style.parentNode) {
      style.parentNode.removeChild(style);
    }
  };
};