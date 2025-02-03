import { useEffect, useRef } from "react";

const RaindropBackground = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const raindrops = Array.from({ length: 80 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      speed: Math.random() * 3 + 2,
      length: Math.random() * 15 + 10,
    }));
    
    const ripples: { x: number; y: number; radius: number; }[] = [];

    const hexToRgba = (hex: string, alpha: number = 0.5) => {
      hex = hex.replace(/^#/, '');
      let r = parseInt(hex.substring(0, 2), 16);
      let g = parseInt(hex.substring(2, 4), 16);
      let b = parseInt(hex.substring(4, 6), 16);
      return `rgba(${r}, ${g}, ${b}, ${alpha})`;
    };

    const getColors = () => {
      let colorVar = getComputedStyle(document.documentElement).getPropertyValue('--primary').trim();
      return colorVar.startsWith('#') ? hexToRgba(colorVar) : colorVar || 'rgba(173, 216, 230, 0.5)';
    };

    const animate = () => {
      ctx.fillStyle = "rgba(0, 0, 0, 0.05)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const rainColor = getColors();
      ctx.strokeStyle = rainColor;
      ctx.lineWidth = 1;
      
      raindrops.forEach((drop) => {
        ctx.beginPath();
        ctx.moveTo(drop.x, drop.y);
        ctx.lineTo(drop.x + drop.speed * 0.2, drop.y + drop.length); // Szélhatás
        ctx.stroke();
        drop.y += drop.speed;
        drop.x += drop.speed * 0.2;

        if (drop.y > canvas.height) {
          drop.y = -drop.length;
          drop.x = Math.random() * canvas.width;
          ripples.push({ x: drop.x, y: canvas.height, radius: 2 });
        }
      });
      
      ripples.forEach((ripple, index) => {
        ctx.beginPath();
        ctx.arc(ripple.x, ripple.y, ripple.radius, 0, Math.PI * 2);
        ctx.strokeStyle = "rgba(255, 255, 255, 0.2)";
        ctx.lineWidth = 0.8;
        ctx.stroke();
        ripple.radius += 0.5;
        if (ripple.radius > 10) ripples.splice(index, 1);
      });
      
      if (Math.random() < 0.005) {
        canvas.style.filter = "brightness(1.5)";
        setTimeout(() => canvas.style.filter = "brightness(1)", 100);
      }
      
      requestAnimationFrame(animate);
    };
    
    animate();

    const handleResize = () => {
      if (!canvas) return;
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        zIndex: -1,
      }}
    />
  );
};

export default RaindropBackground;
