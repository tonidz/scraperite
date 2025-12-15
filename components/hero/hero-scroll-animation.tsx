"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import {
  useScroll,
  useTransform,
  useMotionValueEvent,
  AnimatePresence,
  motion,
} from "framer-motion";

const FRAME_COUNT = 20;

export function HeroScrollAnimation({
  children,
}: {
  children: React.ReactNode;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [images, setImages] = useState<HTMLImageElement[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  const currentIndex = useTransform(
    scrollYProgress,
    [0, 1],
    [0, FRAME_COUNT - 1]
  );

  // Check if mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    const loadImages = async () => {
      const loadedImages: HTMLImageElement[] = [];
      let loadedCount = 0;

      for (let i = 0; i < FRAME_COUNT; i++) {
        const img = new Image();
        const indexStr = i.toString().padStart(2, "0");
        img.src = `https://dubqixvkcewpezhvsrln.supabase.co/storage/v1/object/public/project_images/scraper-frame-${indexStr}-nobg.png`;

        await new Promise<void>((resolve) => {
          img.onload = () => {
            loadedCount++;
            setLoadingProgress((loadedCount / FRAME_COUNT) * 100);
            resolve();
          };
          img.onerror = () => resolve();
        });
        loadedImages.push(img);
      }

      setImages(loadedImages);
      setIsLoaded(true);
    };

    loadImages();
  }, []);

  const renderFrame = useCallback(
    (index: number) => {
      const canvas = canvasRef.current;
      if (!canvas || !images[index]) return;

      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      const img = images[index];

      // Get device pixel ratio for sharp rendering
      const dpr =
        typeof window !== "undefined" ? window.devicePixelRatio || 1 : 1;

      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Calculate scaling to contain the image with proper aspect ratio
      const canvasDisplayWidth = canvas.width / dpr;
      const canvasDisplayHeight = canvas.height / dpr;

      // Use 'contain' logic so image doesn't overflow
      const hRatio = canvasDisplayWidth / img.width;
      const vRatio = canvasDisplayHeight / img.height;
      const ratio = Math.min(hRatio, vRatio);

      const newWidth = img.width * ratio;
      const newHeight = img.height * ratio;

      // Center the image horizontally, position at top on mobile, center on desktop
      const centerX = (canvasDisplayWidth - newWidth) / 2;
      const centerY = isMobile ? 0 : (canvasDisplayHeight - newHeight) / 2;

      // Scale context for retina displays
      ctx.save();
      ctx.scale(dpr, dpr);
      ctx.drawImage(img, centerX, centerY, newWidth, newHeight);
      ctx.restore();
    },
    [images, isMobile]
  );

  // Handle canvas resizing
  useEffect(() => {
    const handleResize = () => {
      const canvas = canvasRef.current;
      if (canvas) {
        const dpr = window.devicePixelRatio || 1;
        const navbarHeight = 64;
        const mobile = window.innerWidth < 768;

        // Set display size
        const displayWidth = window.innerWidth;
        // On mobile, canvas takes upper portion; on desktop, full height minus navbar
        const displayHeight = mobile
          ? (window.innerHeight - navbarHeight) * 0.55 // 55% of available height on mobile
          : window.innerHeight - navbarHeight;

        // Set actual size in memory (scaled for retina)
        canvas.width = displayWidth * dpr;
        canvas.height = displayHeight * dpr;

        // Set CSS size
        canvas.style.width = `${displayWidth}px`;
        canvas.style.height = `${displayHeight}px`;

        setIsMobile(mobile);

        // Re-render current frame after resize
        if (images.length > 0) {
          const currentProgress = scrollYProgress.get();
          const frameIndex = Math.min(
            FRAME_COUNT - 1,
            Math.max(0, Math.round(currentProgress * (FRAME_COUNT - 1)))
          );
          renderFrame(frameIndex);
        }
      }
    };

    window.addEventListener("resize", handleResize);
    handleResize();

    return () => window.removeEventListener("resize", handleResize);
  }, [images, scrollYProgress, renderFrame]);

  useMotionValueEvent(currentIndex, "change", (latest) => {
    if (!isLoaded) return;
    const frameIndex = Math.min(
      FRAME_COUNT - 1,
      Math.max(0, Math.round(latest))
    );
    renderFrame(frameIndex);
  });

  // Initial render when loaded
  useEffect(() => {
    if (isLoaded) {
      const canvas = canvasRef.current;
      if (canvas) {
        const dpr = window.devicePixelRatio || 1;
        const navbarHeight = 64;
        const mobile = window.innerWidth < 768;
        const displayWidth = window.innerWidth;
        const displayHeight = mobile
          ? (window.innerHeight - navbarHeight) * 0.55
          : window.innerHeight - navbarHeight;

        canvas.width = displayWidth * dpr;
        canvas.height = displayHeight * dpr;
        canvas.style.width = `${displayWidth}px`;
        canvas.style.height = `${displayHeight}px`;
      }
      renderFrame(0);
    }
  }, [isLoaded, renderFrame]);

  return (
    <>
      <AnimatePresence>
        {!isLoaded && (
          <motion.div
            className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#FFE566] text-black"
            exit={{
              opacity: 0,
              transition: { duration: 0.8, ease: "easeInOut" },
            }}
          >
            <div className="w-64 h-1 bg-black/10 rounded-full overflow-hidden mb-4">
              <motion.div
                className="h-full bg-black"
                initial={{ width: 0 }}
                animate={{ width: `${loadingProgress}%` }}
              />
            </div>
            <p className="text-sm uppercase tracking-widest text-black/60">
              Loading Experience
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      <div ref={containerRef} className="h-[400vh] w-full relative">
        <div className="fixed top-16 left-0 w-full h-[calc(100vh-4rem)] overflow-hidden z-0">
          {/* On mobile: flex column with image on top, content below */}
          {/* On desktop: absolute positioning with canvas as background */}
          <div className="relative w-full h-full flex flex-col md:block">
            {/* Canvas container - on mobile it's positioned at top */}
            <div
              className="relative md:absolute md:inset-0 flex-shrink-0"
              style={{ height: isMobile ? "55%" : "100%" }}
            >
              <canvas ref={canvasRef} className="w-full h-full" />
            </div>

            {/* Content container - on mobile it's below canvas, on desktop overlaid */}
            <motion.div
              className="relative z-10 flex-1 md:absolute md:inset-0 md:h-full w-full"
              initial={{ opacity: 0 }}
              animate={{ opacity: isLoaded ? 1 : 0 }}
              transition={{ duration: 1, delay: 0.5 }}
            >
              {children}
            </motion.div>
          </div>
        </div>
      </div>
    </>
  );
}
