import React, { useRef, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/all';

gsap.registerPlugin(ScrollTrigger);

const ScrollAnimation = () => {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const imagesRef = useRef([]); // Cache images in memory to avoid React state re-renders
  const lastDrawnFrameRef = useRef(-1); // Prevent unnecessary redraws
  const frameCount = 300;

  // 1. Preload all images using Promise.all and img.decode()
  useEffect(() => {
    const preloadImages = async () => {
      const promises = [];
      const loadedImages = [];

      for (let i = 1; i <= frameCount; i++) {
        const index = i.toString().padStart(3, '0');
        const img = new Image();
        img.src = `/frames/ezgif-frame-${index}.jpg`;

        // img.decode() forces the browser to decode the image in the background.
        // This prevents main-thread blocking (jank) when drawing the image for the first time.
        const promise = img.decode().then(() => {
          loadedImages[i - 1] = img; // Ensure strict ordering
        }).catch(err => {
          console.warn(`Could not decode image ${i}:`, err);
        });

        promises.push(promise);
      }

      // Wait until ALL images are fully loaded and decoded into memory
      await Promise.all(promises);
      imagesRef.current = loadedImages.filter(Boolean); // Filter out any failed loads
      setIsLoaded(true); // Now we can safely initialize GSAP
    };

    preloadImages();
  }, []);

  // 2. Set up Canvas & GSAP ScrollTrigger ONLY after fully loading
  useEffect(() => {
    if (!isLoaded || imagesRef.current.length === 0) return;

    const canvas = canvasRef.current;

    // Allow transparency so the background image shows through
    const ctx = canvas.getContext('2d', { alpha: true });

    let lastWidth = window.innerWidth;

    // Handle high DPI displays for sharper rendering
    const resizeCanvas = () => {
      const isMobile = window.innerWidth < 768;

      // On mobile, avoid resizing when just scrolling up/down (which changes innerHeight due to address bar)
      // Only resize if the width changes (orientation change) or if it's the first time
      if (isMobile && window.innerWidth === lastWidth && canvas.width !== 0) {
        // Just update height if needed, but avoiding full canvas reset makes scrolling smoother
        // We will allow it to reset, but if it causes issues we would skip. For now, let's reset to ensure it's full screen.
      }
      lastWidth = window.innerWidth;

      const dpr = window.devicePixelRatio || 1;

      // Set actual canvas size (logical size) using modern viewport units (dvh)
      // This prevents UI jumps on mobile when the address bar hides/shows
      canvas.style.width = '100vw';
      canvas.style.height = '100dvh';
      
      const logicalWidth = canvas.clientWidth || window.innerWidth;
      const logicalHeight = canvas.clientHeight || window.innerHeight;
      
      // Set internal rendering buffer size scaled by DPR
      canvas.width = logicalWidth * dpr;
      canvas.height = logicalHeight * dpr;

      // Scale context so we don't have to multiply by DPR in the draw function
      ctx.scale(dpr, dpr);

      // Force redraw on resize to prevent stretching/blanking
      lastDrawnFrameRef.current = -1;
      drawFrame(playhead.frame);
    };

    const drawFrame = (frameIndex) => {
      // Round to the nearest whole integer
      const currentFrame = Math.round(frameIndex);

      // Only execute expensive canvas redraw operations if the frame actually changed
      if (currentFrame === lastDrawnFrameRef.current) return;

      const safeIndex = Math.max(0, Math.min(imagesRef.current.length - 1, currentFrame - 1));
      const img = imagesRef.current[safeIndex];

      if (img) {
        // Read actual dimensions calculated from 100dvh to prevent gaps
        const logicalWidth = canvas.clientWidth || window.innerWidth;
        const logicalHeight = canvas.clientHeight || window.innerHeight;
        const isMobile = logicalWidth < 768;

        // Maintain aspect ratio
        const hRatio = logicalWidth / img.naturalWidth;
        const vRatio = logicalHeight / img.naturalHeight;

        // On mobile, use Math.min to show the full video without cropping (object-fit: contain)
        // On desktop, use Math.max to fill the screen (object-fit: cover)
        const ratio = isMobile ? Math.min(hRatio, vRatio) : Math.max(hRatio, vRatio);

        const drawWidth = img.naturalWidth * ratio;
        const drawHeight = img.naturalHeight * ratio;

        const centerShift_x = (logicalWidth - drawWidth) / 2;
        const centerShift_y = (logicalHeight - drawHeight) / 2;

        // Clear canvas to show the background image behind the video frames
        ctx.clearRect(0, 0, logicalWidth, logicalHeight);

        ctx.drawImage(
          img,
          0, 0, img.naturalWidth, img.naturalHeight, // Source
          centerShift_x, centerShift_y, drawWidth, drawHeight // Destination
        );

        // Fade top and bottom edges to blend seamlessly with the CSS background image
        const fadeHeight = Math.min(150, drawHeight * 0.25);
        
        ctx.globalCompositeOperation = 'destination-out';
        
        // Top fade
        const gradientTop = ctx.createLinearGradient(0, centerShift_y, 0, centerShift_y + fadeHeight);
        gradientTop.addColorStop(0, 'rgba(0,0,0,1)');
        gradientTop.addColorStop(1, 'rgba(0,0,0,0)');
        ctx.fillStyle = gradientTop;
        ctx.fillRect(0, centerShift_y - 1, logicalWidth, fadeHeight + 1); // -1/+1 prevents thin artifacts
        
        // Bottom fade
        const gradientBottom = ctx.createLinearGradient(0, centerShift_y + drawHeight - fadeHeight, 0, centerShift_y + drawHeight);
        gradientBottom.addColorStop(0, 'rgba(0,0,0,0)');
        gradientBottom.addColorStop(1, 'rgba(0,0,0,1)');
        ctx.fillStyle = gradientBottom;
        ctx.fillRect(0, centerShift_y + drawHeight - fadeHeight, logicalWidth, fadeHeight + 1);
        
        // Reset composite operation
        ctx.globalCompositeOperation = 'source-over';

        lastDrawnFrameRef.current = currentFrame; // Cache the drawn frame
      }
    };

    const playhead = { frame: 1 };

    // Set size and paint the first frame
    resizeCanvas();

    const ctx_gsap = gsap.context(() => {
      // 3D slide-in effect from bottom to top
      gsap.fromTo('.hero-title',
        { opacity: 0, y: 100, rotationX: -50, transformPerspective: 800 },
        { opacity: 1, y: 0, rotationX: 0, duration: 1.2, delay: 0.2, ease: "power3.out" }
      );
      gsap.fromTo('.hero-subtitle',
        { opacity: 0, y: 100, rotationX: -50, transformPerspective: 800 },
        { opacity: 1, y: 0, rotationX: 0, duration: 1.2, delay: 0.4, ease: "power3.out" }
      );
      gsap.fromTo('.btn-book',
        { opacity: 0, y: 100, rotationX: -50, transformPerspective: 800 },
        { opacity: 1, y: 0, rotationX: 0, duration: 1.2, delay: 0.6, ease: "power3.out" }
      );

      ScrollTrigger.create({
        trigger: containerRef.current,
        start: 'top top',
        end: `+=${imagesRef.current.length * 20}`, // Dynamic height based on actual frames
        pin: true,
        invalidateOnRefresh: true, // Recalculates start/end values accurately when screen resizes
        animation: gsap.to(playhead, {
          frame: imagesRef.current.length,
          ease: 'none', // Critical: linear easing so scrolling directly maps to frames
          onUpdate: () => {
            // GSAP's ticker is already synced with requestAnimationFrame!
            // Wrapping this in another rAF delays drawing by 1 tick, causing judder. 
            // We call it synchronously here.
            drawFrame(playhead.frame);
          }
        }),
        scrub: 1.2 // High inertia for a buttery smooth scrolling experience
      });

      window.addEventListener('resize', resizeCanvas);
    }, containerRef);

    return () => {
      ctx_gsap.revert();
      window.removeEventListener('resize', resizeCanvas);
    };
  }, [isLoaded]);



  return (
    <div ref={containerRef} className="hero-container w-full overflow-x-hidden relative bg-transparent" id="home">
      <div className="canvas-container">
        {/* Fade canvas in only after fully loaded to prevent UI pop-in */}
        <canvas
          ref={canvasRef}
          className="canvas-element"
          style={{ opacity: isLoaded ? 1 : 0, transition: 'opacity 1s ease' }}
        />
      </div>

      {/* Overlay Content */}
      <div className="absolute inset-0 flex flex-col items-center justify-end pb-[30vh] md:justify-center md:pb-0 pointer-events-none z-10" style={{ opacity: isLoaded ? 1 : 0, transition: 'opacity 1.5s ease 0.5s' }}>
        <div className="hero-content flex flex-col items-center text-center px-6 w-full" style={{ perspective: '1000px' }}>

          {/* Title */}
          <h1 className="hero-title text-4xl md:text-6xl lg:text-7xl font-semibold text-white uppercase tracking-[0.15em] mb-3 opacity-0 pointer-events-auto" style={{ textShadow: '0 10px 30px rgba(0,0,0,0.5)' }}>
            Riya Sarees
          </h1>

          {/* Subtitle */}
          <h2 className="hero-subtitle text-xs sm:text-sm md:text-base text-white/95 uppercase tracking-[0.3em] font-light mb-5 opacity-0 pointer-events-auto drop-shadow-lg">
            Silk | Cotton | Designing Sarees
          </h2>

          {/* Contact Info (Glassmorphism Pill) */}
          <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-8 mb-6 text-[10px] sm:text-xs md:text-sm text-white/95 font-medium opacity-0 pointer-events-auto tracking-widest backdrop-blur-md bg-[#2d241c]/60 px-6 py-3 rounded-full border border-white/20 shadow-[0_10px_30px_rgba(0,0,0,0.3)]">
            <span className="flex items-center gap-3">
              <svg className="w-4 h-4 text-[#c5a070]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path></svg>
              +91 9363008505
            </span>
            <span className="hidden sm:block w-px h-4 bg-white/20"></span>
            <span className="flex items-center gap-3">
              <svg className="w-4 h-4 text-[#c5a070]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.243-4.243a8 8 0 1111.314 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
              ELAMPILLAI, SALEM
            </span>
          </div>

          {/* Premium Button */}
          <Link to="/shopping" className="inline-block btn-book opacity-0 pointer-events-auto">
            <button className="bg-[#c5a070]/90 backdrop-blur-md text-white px-12 py-4 md:py-5 font-semibold uppercase tracking-[0.2em] text-[10px] sm:text-xs md:text-sm rounded-full hover:bg-[#b08d60] hover:scale-105 hover:shadow-[0_0_40px_rgba(197,160,112,0.5)] transition-all duration-500 shadow-[0_10px_30px_rgba(0,0,0,0.3)] border border-white/20">
              Order Now
            </button>
          </Link>

        </div>
      </div>
    </div>
  );
};

export default ScrollAnimation;
