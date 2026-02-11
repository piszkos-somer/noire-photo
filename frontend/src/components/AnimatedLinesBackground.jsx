import React, { useEffect, useRef } from "react";

export default function AnimatedLinesBackground({
  lineCount = 34,
  speed = 0.55,
  amplitude = 0.22,
  thickness = 1,
  alpha = 0.22,
  color = "#111",
}) {
  const canvasRef = useRef(null);
  const rafRef = useRef(null);
  const tRef = useRef(0);
  const dprRef = useRef(1);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d", { alpha: true });
    const prefersReduced = window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches;

    const resize = () => {
      const dpr = Math.max(1, window.devicePixelRatio || 1);
      dprRef.current = dpr;

      const { innerWidth: w, innerHeight: h } = window;
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const draw = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;

      ctx.clearRect(0, 0, w, h);

      const coverage = 0.75; 
const span = h * coverage;

const startY = (h - span) / 2;
const endY = startY + span;

const baseAmp = span * amplitude;
const slope = span * 0.3;



      const leftPad = -w * 0.05;
      const rightPad = w * 1.05;

      ctx.lineWidth = thickness;
      ctx.strokeStyle = color;
      ctx.globalAlpha = alpha;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";

      const phase = tRef.current * speed;

      for (let i = 0; i < lineCount; i++) {
        const k = i / (lineCount - 1);
        const y0 = startY + k * span;



        const lineAmp = baseAmp * (0.55 + 0.65 * Math.sin(k * Math.PI));
        const f1 = 1.25 + 0.85 * k;
        const f2 = 0.55 + 0.4 * (1 - k);
        const wobble = 0.55 + 0.55 * Math.sin(phase * 0.35 + k * 8.0);

        ctx.beginPath();

        const steps = Math.max(140, Math.floor(w / 10));
        for (let s = 0; s <= steps; s++) {
          const x = leftPad + (s / steps) * (rightPad - leftPad);
          const nx = x / w;

          const a =
            Math.sin((nx * Math.PI * 2.0 * f1) + phase + k * 4.0) * 0.72 +
            Math.sin((nx * Math.PI * 2.0 * f2) - phase * 0.7 + k * 7.0) * 0.28;

          const envelope = 0.25 + 0.75 * Math.sin(nx * Math.PI);
          const diagonalOffset = (x / w) * slope;
          const y = y0 + diagonalOffset + a * lineAmp * envelope * wobble;


          if (s === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }

        ctx.stroke();
      }

      ctx.globalAlpha = 1;

      const g = ctx.createRadialGradient(w * 0.22, h * 0.18, 0, w * 0.22, h * 0.18, Math.max(w, h) * 0.85);
      g.addColorStop(0, "rgba(255,255,255,0.55)");
      g.addColorStop(1, "rgba(255,255,255,0)");
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, w, h);

      if (!prefersReduced) {
        tRef.current += 0.016 * (0.9 + 0.25 / dprRef.current);
        rafRef.current = requestAnimationFrame(draw);
      }
    };

    const onResize = () => {
      resize();
      if (prefersReduced) draw();
    };

    resize();
    if (prefersReduced) draw();
    else rafRef.current = requestAnimationFrame(draw);

    window.addEventListener("resize", onResize);
    return () => {
      window.removeEventListener("resize", onResize);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [lineCount, speed, amplitude, thickness, alpha, color]);

  return (
    <div className="animated-lines-bg" aria-hidden="true">
      <canvas ref={canvasRef} />
    </div>
  );
}
