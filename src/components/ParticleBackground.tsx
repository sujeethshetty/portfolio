import React, { useEffect, useRef } from 'react';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  opacity: number;
  baseOpacity: number;
  hue: number;
}

const ParticleBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: 0, y: 0 });
  const particlesRef = useRef<Particle[]>([]);
  const animationRef = useRef<number>();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Detect theme - improved detection
    const getIsDarkMode = () => {
      return document.documentElement.classList.contains('dark') || 
             (!document.documentElement.classList.contains('light') && 
              window.matchMedia('(prefers-color-scheme: dark)').matches);
    };
    
    let isDarkMode = getIsDarkMode();

    // Initialize particles
    const initParticles = () => {
      const particles: Particle[] = [];
      // Mobile optimization: reduce particle count significantly on mobile devices
      const isMobile = window.innerWidth < 768 || /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
      const densityFactor = isMobile ? 20000 : 8000; // Much fewer particles on mobile
      const numParticles = Math.floor((canvas.width * canvas.height) / densityFactor);

      for (let i = 0; i < numParticles; i++) {
        const baseOpacity = Math.random() * 0.4 + 0.2; // More visible
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          vx: (Math.random() - 0.5) * 0.2,
          vy: (Math.random() - 0.5) * 0.2,
          size: Math.random() * 1.5 + 0.5, // Slightly larger for visibility
          opacity: baseOpacity,
          baseOpacity,
          hue: 0, // White/gray particles only
        });
      }
      particlesRef.current = particles;
    };

    initParticles();

    // Mouse move handler
    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current = {
        x: e.clientX,
        y: e.clientY,
      };
    };

    // Touch move handler with passive listener for better performance
    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        mouseRef.current = {
          x: e.touches[0].clientX,
          y: e.touches[0].clientY,
        };
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('touchmove', handleTouchMove, { passive: true });

    // Animation loop with mobile optimization
    let lastTime = 0;
    const targetFPS = window.innerWidth < 768 ? 30 : 60; // Lower FPS on mobile
    const frameInterval = 1000 / targetFPS;
    
    const animate = (currentTime: number = 0) => {
      // Throttle animation on mobile devices
      if (currentTime - lastTime < frameInterval) {
        animationRef.current = requestAnimationFrame(animate);
        return;
      }
      lastTime = currentTime;
      
      // Update theme detection on each frame
      isDarkMode = getIsDarkMode();
      
      // Clear canvas completely to let CSS background show through
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particlesRef.current.forEach((particle) => {
        // Calculate distance from mouse
        const dx = mouseRef.current.x - particle.x;
        const dy = mouseRef.current.y - particle.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const maxDistance = 120;

        // Mouse interaction - attract particles
        if (distance < maxDistance && distance > 0) {
          const force = (maxDistance - distance) / maxDistance * 0.01;
          const angle = Math.atan2(dy, dx);
          particle.vx += Math.cos(angle) * force;
          particle.vy += Math.sin(angle) * force;
          
          // Opacity increase when near mouse
          particle.opacity = Math.min(particle.baseOpacity * 1.8, 0.8);
        } else {
          // Return to base opacity
          particle.opacity = particle.baseOpacity;
        }

        // Continuous floating motion
        particle.vx += (Math.random() - 0.5) * 0.002;
        particle.vy += (Math.random() - 0.5) * 0.002;

        // Apply gentle friction
        particle.vx *= 0.995;
        particle.vy *= 0.995;

        // Update position with wrapping
        particle.x += particle.vx;
        particle.y += particle.vy;

        // Wrap around edges for continuous flow
        if (particle.x < 0) particle.x = canvas.width;
        if (particle.x > canvas.width) particle.x = 0;
        if (particle.y < 0) particle.y = canvas.height;
        if (particle.y > canvas.height) particle.y = 0;

        // Simple elegant particles - no glow, just subtle dots
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        
        // Theme-adaptive simple colors - more visible
        if (isDarkMode) {
          ctx.fillStyle = `rgba(255, 255, 255, ${particle.opacity})`;
        } else {
          ctx.fillStyle = `rgba(60, 60, 60, ${particle.opacity})`;
        }
        ctx.fill();
      });

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    // Cleanup
    return () => {
      window.removeEventListener('resize', resizeCanvas);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('touchmove', handleTouchMove);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 pointer-events-none"
      style={{ zIndex: 2, background: 'transparent' }}
    />
  );
};

export default ParticleBackground;