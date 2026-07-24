import React, { useRef, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/all';

gsap.registerPlugin(ScrollTrigger);

const ScrollAnimation = () => {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const heroContentRef = useRef(null);
  
  const [isLoaded, setIsLoaded] = useState(false);
  const [loadProgress, setLoadProgress] = useState(0);
  
  const imagesRef = useRef([]); 
  const lastDrawnFrameRef = useRef(-1); 
  const frameCount = 300;

  // Magnetic Mouse Effect (Phase 3)
  useEffect(() => {
    if (!heroContentRef.current || !isLoaded) return;
    
    // Using quickTo for butter-smooth animation
    const xTo = gsap.quickTo(heroContentRef.current, "x", { duration: 0.8, ease: "power3" });
    const yTo = gsap.quickTo(heroContentRef.current, "y", { duration: 0.8, ease: "power3" });
    
    const handleMouseMove = (e) => {
      const { innerWidth, innerHeight } = window;
      // Calculate mouse offset from center of screen (-15px to 15px max)
      const x = (e.clientX / innerWidth - 0.5) * 30; 
      const y = (e.clientY / innerHeight - 0.5) * 30;
      
      // Move content in opposite direction
      xTo(-x);
      yTo(-y);
    };
    
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [isLoaded]);

  // Preload Images with Progress (Phase 1)
  useEffect(() => {
    const preloadImages = async () => {
      const promises = [];
      const loadedImages = [];
      const isMobile = window.innerWidth < 768;
      const frameFolder = isMobile ? 'frames2' : 'frames';
      
      let loadedCount = 0;

      for (let i = 1; i <= frameCount; i++) {
        const index = i.toString().padStart(3, '0');
        const img = new Image();
        img.src = `/${frameFolder}/ezgif-frame-${index}.jpg`;

        const promise = img.decode().then(() => {
          loadedImages[i - 1] = img; 
          loadedCount++;
          setLoadProgress(Math.floor((loadedCount / frameCount) * 100));
        }).catch(err => {
          console.warn(`Could not decode image ${i}:`, err);
          loadedCount++; 
          setLoadProgress(Math.floor((loadedCount / frameCount) * 100));
        });

        promises.push(promise);
      }

      await Promise.all(promises);
      imagesRef.current = loadedImages.filter(Boolean); 
      
      // Small delay before revealing to ensure 100% is seen smoothly
      setTimeout(() => {
        setIsLoaded(true); 
      }, 500);
    };

    preloadImages();
  }, []);

  // GSAP Scroll Animations (Phases 2, 4, 5)
  useEffect(() => {
    if (!isLoaded || imagesRef.current.length === 0) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d', { alpha: true });
    let lastWidth = window.innerWidth;

    const resizeCanvas = () => {
      const isMobile = window.innerWidth < 768;
      if (isMobile && window.innerWidth === lastWidth && canvas.width !== 0) {
        // Skip resize on mobile scroll
      }
      lastWidth = window.innerWidth;
      const dpr = window.devicePixelRatio || 1;
      canvas.style.width = '100vw';
      canvas.style.height = '100dvh';
      
      const logicalWidth = canvas.clientWidth || window.innerWidth;
      const logicalHeight = canvas.clientHeight || window.innerHeight;
      
      canvas.width = logicalWidth * dpr;
      canvas.height = logicalHeight * dpr;
      ctx.scale(dpr, dpr);

      lastDrawnFrameRef.current = -1;
      drawFrame(playhead.frame);
    };

    const drawFrame = (frameIndex) => {
      const currentFrame = Math.round(frameIndex);
      if (currentFrame === lastDrawnFrameRef.current) return;

      const safeIndex = Math.max(0, Math.min(imagesRef.current.length - 1, currentFrame - 1));
      const img = imagesRef.current[safeIndex];

      if (img) {
        const logicalWidth = canvas.clientWidth || window.innerWidth;
        const logicalHeight = canvas.clientHeight || window.innerHeight;
        
        const hRatio = logicalWidth / img.naturalWidth;
        const vRatio = logicalHeight / img.naturalHeight;
        const ratio = Math.max(hRatio, vRatio);

        const drawWidth = img.naturalWidth * ratio;
        const drawHeight = img.naturalHeight * ratio;

        const centerShift_x = (logicalWidth - drawWidth) / 2;
        const centerShift_y = (logicalHeight - drawHeight) / 2;

        ctx.clearRect(0, 0, logicalWidth, logicalHeight);
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';

        ctx.drawImage(
          img,
          0, 0, img.naturalWidth, img.naturalHeight, 
          centerShift_x, centerShift_y, drawWidth, drawHeight 
        );
        ctx.globalCompositeOperation = 'source-over';
        lastDrawnFrameRef.current = currentFrame; 
      }
    };

    const playhead = { frame: 1 };
    resizeCanvas();

    const ctx_gsap = gsap.context(() => {
      // Intro fade in for initial elements
      gsap.fromTo('.text-seq-1',
        { opacity: 0, y: 50 },
        { opacity: 1, y: 0, duration: 1.2, delay: 0.2, ease: "power3.out" }
      );
      gsap.fromTo('.contact-pill',
        { opacity: 0, y: 50 },
        { opacity: 1, y: 0, duration: 1.2, delay: 0.4, ease: "power3.out" }
      );
      gsap.fromTo('.scroll-indicator',
        { opacity: 0 },
        { opacity: 1, duration: 1, delay: 1, ease: "power2.inOut" }
      );

      // Scroll-Tied Master Timeline
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top top',
          end: `+=${imagesRef.current.length * 20}`, 
          pin: true,
          scrub: 1.2,
          invalidateOnRefresh: true, 
        }
      });

      // 1. Play Video Frames over the entire duration (duration: 1)
      tl.to(playhead, {
        frame: imagesRef.current.length,
        ease: 'none',
        duration: 1,
        onUpdate: () => drawFrame(playhead.frame)
      }, 0);

      // 2. Parallax Canvas Scale (Phase 5)
      tl.to(canvas, { scale: 1.15, ease: "none", duration: 1 }, 0);

      // 3. Fade out scroll indicator immediately (Phase 4)
      tl.to('.scroll-indicator', { opacity: 0, y: -20, duration: 0.05 }, 0);

      // 4. Text Sequence Transitions (Phase 2)
      // Fade out Sequence 1
      tl.to('.text-seq-1', { opacity: 0, y: -50, scale: 0.95, duration: 0.1 }, 0.1);
      tl.to('.contact-pill', { opacity: 0, scale: 0.9, duration: 0.1 }, 0.1);

      // Fade in & out Sequence 2
      tl.fromTo('.text-seq-2', 
        { opacity: 0, y: 50, scale: 1.05 },
        { opacity: 1, y: 0, scale: 1, duration: 0.1 }, 0.25
      );
      tl.to('.text-seq-2', { opacity: 0, y: -50, scale: 0.95, duration: 0.1 }, 0.5);

      // Fade in Sequence 3
      tl.fromTo('.text-seq-3', 
        { opacity: 0, y: 50, scale: 1.05 },
        { opacity: 1, y: 0, scale: 1, duration: 0.1 }, 0.7
      );

      window.addEventListener('resize', resizeCanvas);
    }, containerRef);

    return () => {
      ctx_gsap.revert();
      window.removeEventListener('resize', resizeCanvas);
    };
  }, [isLoaded]);


  return (
    <div ref={containerRef} className="hero-container w-full overflow-x-hidden relative bg-transparent" id="home">
      
      {/* Loading Screen (Phase 1) */}
      {!isLoaded && (
        <div className="absolute inset-0 z-[60] flex flex-col items-center justify-center bg-[#2d241c] text-white">
          <div className="w-64 h-1 bg-white/20 rounded-full overflow-hidden mb-4 relative">
            <div 
              className="h-full bg-[#c5a070] transition-all duration-300 ease-out"
              style={{ width: `${loadProgress}%` }}
            />
          </div>
          <p className="text-xs tracking-[0.2em] uppercase font-light text-[#c5a070]">Loading Experience... {loadProgress}%</p>
        </div>
      )}

      {/* Canvas */}
      <div className="canvas-container overflow-hidden">
        <canvas
          ref={canvasRef}
          className="canvas-element block"
          style={{ opacity: isLoaded ? 1 : 0, transition: 'opacity 1s ease', filter: 'contrast(1.05) saturate(1.1)' }}
        />
        {/* Subtle dark overlay for better text readability */}
        <div className="absolute inset-0 bg-black/20 pointer-events-none z-0" />
      </div>

      {/* Overlay Content */}
      <div className="absolute inset-0 flex flex-col justify-center items-center pointer-events-none z-10" style={{ opacity: isLoaded ? 1 : 0, transition: 'opacity 1.5s ease 0.5s' }}>
        
        {/* Magnetic Text Container */}
        <div ref={heroContentRef} className="relative w-full h-[300px]" style={{ perspective: '1000px' }}>
          
          {/* Text Sequence 1: Initial */}
          <div className="text-seq-1 absolute inset-0 flex flex-col items-center justify-center text-center px-6 pointer-events-none">
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-semibold text-white uppercase tracking-[0.15em] mb-3 pointer-events-auto" style={{ textShadow: '0 10px 30px rgba(0,0,0,0.5)' }}>
              Riya Sarees
            </h1>
            <h2 className="text-xs sm:text-sm md:text-base text-white/95 uppercase tracking-[0.3em] font-light mb-5 pointer-events-auto drop-shadow-lg">
              Silk | Cotton | Designing Sarees
            </h2>
          </div>

          {/* Text Sequence 2: Scrolling */}
          <div className="text-seq-2 absolute inset-0 flex flex-col items-center justify-center text-center px-6 pointer-events-none opacity-0">
            <h2 className="text-3xl md:text-5xl lg:text-6xl font-semibold text-white uppercase tracking-[0.15em] mb-3" style={{ textShadow: '0 10px 30px rgba(0,0,0,0.5)' }}>
              Handwoven Perfection
            </h2>
            <h3 className="text-xs sm:text-sm md:text-base text-[#c5a070] uppercase tracking-[0.3em] font-light drop-shadow-lg">
              Authentic Silk & Cotton
            </h3>
          </div>

          {/* Text Sequence 3: Final Call to Action */}
          <div className="text-seq-3 absolute inset-0 flex flex-col items-center justify-center text-center px-6 pointer-events-none opacity-0">
            <h2 className="text-3xl md:text-5xl lg:text-6xl font-semibold text-white uppercase tracking-[0.15em] mb-8 pointer-events-auto" style={{ textShadow: '0 10px 30px rgba(0,0,0,0.5)' }}>
              Explore the Collection
            </h2>
            <Link to="/shopping" className="inline-block pointer-events-auto">
              <button className="bg-[#c5a070]/90 backdrop-blur-md text-white px-12 py-4 md:py-5 font-semibold uppercase tracking-[0.2em] text-[10px] sm:text-xs md:text-sm rounded-full hover:bg-[#b08d60] hover:scale-105 hover:shadow-[0_0_40px_rgba(197,160,112,0.5)] transition-all duration-500 shadow-[0_10px_30px_rgba(0,0,0,0.3)] border border-white/20">
                Order Now
              </button>
            </Link>
          </div>
          
        </div>
        
        {/* Contact Info (Glassmorphism Pill) */}
        <div className="contact-pill absolute bottom-32 sm:bottom-12 flex flex-col sm:flex-row items-center gap-3 sm:gap-8 text-[10px] sm:text-xs md:text-sm text-white/95 font-medium pointer-events-auto tracking-widest px-6 py-3 rounded-full border border-white/20 shadow-[0_10px_30px_rgba(0,0,0,0.3)] backdrop-blur-sm bg-black/20">
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
        
        {/* Scroll Indicator */}
        <div className="scroll-indicator absolute bottom-[10vh] sm:bottom-24 flex flex-col items-center gap-2 pointer-events-none opacity-0">
          <span className="text-[10px] text-white/70 uppercase tracking-[0.2em]">Scroll</span>
          <div className="w-4 h-7 border border-white/40 rounded-full flex justify-center p-[2px]">
            <div className="w-1 h-2 bg-[#c5a070] rounded-full animate-bounce" />
          </div>
        </div>
        
      </div>
    </div>
  );
};

export default ScrollAnimation;
