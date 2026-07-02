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

    const BASE_FRAME_MS = 1000 / 60;
    const reduce = !!window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    let visible = true;
    let lastTime = 0;
    let lastW = 0;
    let lastH = 0;
    let retuneTimeout: number | undefined;

    // Mobile optimization: fewer particles and lower FPS on mobile devices
    const getIsMobile = () =>
      window.innerWidth < 768 ||
      /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

    let frameInterval = 1000 / (getIsMobile() ? 30 : 60);

    const getTargetCount = () => {
      const densityFactor = getIsMobile() ? 20000 : 8000; // Much fewer particles on mobile
      return Math.floor((window.innerWidth * window.innerHeight) / densityFactor);
    };

    const makeParticle = (): Particle => {
      const baseOpacity = Math.random() * 0.4 + 0.2; // More visible
      return {
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        vx: (Math.random() - 0.5) * 0.2,
        vy: (Math.random() - 0.5) * 0.2,
        size: Math.random() * 1.5 + 0.5, // Slightly larger for visibility
        opacity: baseOpacity,
        baseOpacity,
        hue: 0, // White/gray particles only
      };
    };

    // Initialize particles
    const initParticles = () => {
      const particles: Particle[] = [];
      const numParticles = getTargetCount();
      for (let i = 0; i < numParticles; i++) particles.push(makeParticle());
      particlesRef.current = particles;
    };

    // Recompute tuning for the new window size; top up or trim, never re-init
    const retune = () => {
      frameInterval = 1000 / (getIsMobile() ? 30 : 60);
      const particles = particlesRef.current;
      const target = getTargetCount();
      for (let i = particles.length; i < target; i++) particles.push(makeParticle());
      if (particles.length > target) particles.length = target;
      if (reduce) drawParticles(); // no loop runs in reduce mode - refresh the static frame
    };

    // Detect theme - improved detection
    const getIsDarkMode = () => {
      return document.documentElement.classList.contains('dark') ||
             (!document.documentElement.classList.contains('light') &&
              window.matchMedia('(prefers-color-scheme: dark)').matches);
    };

    let isDarkMode = getIsDarkMode();

    // Physics step, scaled by dt so speed is frame-rate independent
    const stepParticle = (particle: Particle, dt: number) => {
      // Calculate distance from mouse
      const dx = mouseRef.current.x - particle.x;
      const dy = mouseRef.current.y - particle.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      const maxDistance = 120;

      // Mouse interaction - attract particles
      if (distance < maxDistance && distance > 0) {
        const force = (maxDistance - distance) / maxDistance * 0.01;
        const angle = Math.atan2(dy, dx);
        particle.vx += Math.cos(angle) * force * dt;
        particle.vy += Math.sin(angle) * force * dt;

        // Opacity increase when near mouse
        particle.opacity = Math.min(particle.baseOpacity * 1.8, 0.8);
      } else {
        // Return to base opacity
        particle.opacity = particle.baseOpacity;
      }

      // Continuous floating motion
      particle.vx += (Math.random() - 0.5) * 0.002 * dt;
      particle.vy += (Math.random() - 0.5) * 0.002 * dt;

      // Apply gentle friction
      const fr = Math.pow(0.995, dt);
      particle.vx *= fr;
      particle.vy *= fr;

      // Update position with wrapping
      particle.x += particle.vx * dt;
      particle.y += particle.vy * dt;

      // Wrap around edges for continuous flow
      if (particle.x < 0) particle.x = window.innerWidth;
      if (particle.x > window.innerWidth) particle.x = 0;
      if (particle.y < 0) particle.y = window.innerHeight;
      if (particle.y > window.innerHeight) particle.y = 0;
    };

    // Draw pass only - no physics, so a static frame can be rendered alone
    const drawParticles = () => {
      // Update theme detection on each frame
      isDarkMode = getIsDarkMode();

      // Clear canvas completely to let CSS background show through
      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

      particlesRef.current.forEach((particle) => {
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
    };

    // Set canvas size (HiDPI backing store; logic units stay CSS pixels)
    const resizeCanvas = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      if (w === lastW && h === lastH) return;
      lastW = w;
      lastH = h;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = w + 'px';
      canvas.style.height = h + 'px';
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      drawParticles(); // the width/height assignment blanked the bitmap - repaint now
      if (retuneTimeout !== undefined) window.clearTimeout(retuneTimeout);
      retuneTimeout = window.setTimeout(retune, 150);
    };

    const animate = (currentTime = 0) => {
      animationRef.current = visible && !reduce ? requestAnimationFrame(animate) : undefined;
      const elapsed = currentTime - lastTime;
      if (elapsed < frameInterval - 1) return; // -1 tolerance absorbs vsync jitter
      lastTime = currentTime - (elapsed % frameInterval);
      const dt = Math.min(elapsed / BASE_FRAME_MS, 3); // clamp tab-restore jumps
      particlesRef.current.forEach((particle) => stepParticle(particle, dt));
      drawParticles();
    };

    const start = () => {
      if (!reduce && visible && !animationRef.current) {
        animationRef.current = requestAnimationFrame(animate);
      }
    };

    const stop = () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
        animationRef.current = undefined;
      }
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

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

    // Pause the loop while the canvas is offscreen
    const io = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting;
        if (visible) start();
        else stop();
      },
      { threshold: 0 }
    );
    io.observe(canvas);

    if (reduce) {
      drawParticles(); // one static frame - a blank hero would be worse
    } else {
      start();
    }

    // Cleanup
    return () => {
      window.removeEventListener('resize', resizeCanvas);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('touchmove', handleTouchMove);
      io.disconnect();
      if (retuneTimeout !== undefined) window.clearTimeout(retuneTimeout);
      stop();
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
