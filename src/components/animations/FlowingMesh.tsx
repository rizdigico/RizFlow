import { useEffect, useRef } from "react";

/**
 * A beautiful, dynamic flowing mesh geometry utilizing an HTML Canvas.
 * Instead of importing heavy libraries, we use raw Canvas API for max performance
 * and pure aesthetic control!
 */
export function FlowingMesh({
  opacity = 0.5,
  parallax = false,
}: {
  opacity?: number;
  parallax?: boolean;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let time = 0;

    const resize = () => {
      if (!canvas.parentElement) return;
      canvas.width = window.innerWidth;
      canvas.height = canvas.parentElement.clientHeight;
    };

    window.addEventListener("resize", resize);

    // Use ResizeObserver to detect changes in parent container height
    const resizeObserver = new ResizeObserver(() => {
      resize();
    });
    if (canvas.parentElement) {
      resizeObserver.observe(canvas.parentElement);
    }

    resize();

    const draw = () => {
      time += 0.002;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const width = canvas.width;
      const height = canvas.height;

      ctx.lineWidth = 1;

      // Distribute waves evenly across the entire vertical space
      const waveSpacing = 150; // Space between individual waves
      const numWaves = Math.ceil(height / waveSpacing) + 4; // Add a few extra to cover top/bottom edges

      for (let j = 0; j < numWaves; j++) {
        ctx.beginPath();
        // Start a bit above the top to ensure smooth coverage
        const centerY = (j - 2) * waveSpacing;

        for (let i = 0; i <= width; i += 20) {
          const x = i;
          // Complex sine wave combination
          const dy =
            Math.sin(x * 0.003 + time + j) * 80 +
            Math.sin(x * 0.005 - time * 1.5 + j * 0.5) * 50 +
            Math.sin(x * 0.001 + time * 0.5 + j * 2) * 120;

          const y = centerY + dy;

          if (i === 0) {
            ctx.moveTo(x, y);
          } else {
            // Cubic bezier smoothing
            const prevX = x - 20;
            const prevDy =
              Math.sin(prevX * 0.003 + time + j) * 80 +
              Math.sin(prevX * 0.005 - time * 1.5 + j * 0.5) * 50 +
              Math.sin(prevX * 0.001 + time * 0.5 + j * 2) * 120;
            const prevY = centerY + prevDy;

            const cpX = (x + prevX) / 2;
            ctx.quadraticCurveTo(cpX, prevY, x, y);
          }
        }

        // Apply gradient to stroke
        const gradient = ctx.createLinearGradient(0, 0, width, 0);
        // Alternate opacity slightly based on wave index for depth
        const currentOpacity = opacity * (j % 2 === 0 ? 0.8 : 0.4);

        gradient.addColorStop(0, `rgba(0, 229, 255, ${currentOpacity * 0.1})`);
        gradient.addColorStop(0.5, `rgba(0, 229, 255, ${currentOpacity})`);
        gradient.addColorStop(1, `rgba(212, 175, 55, ${currentOpacity * 0.3})`);

        ctx.strokeStyle = gradient;
        ctx.stroke();
      }

      animationFrameId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [opacity]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
    />
  );
}
