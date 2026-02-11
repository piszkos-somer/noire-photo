import React, { useEffect, useMemo, useRef } from "react";

export default function AnimatedWavesBackground({
  lines = 34,
  amplitude = 120,
  frequency = 0.0105,
  speed = 0.000004,
  lineWidth = 1,
  alpha = 0.22,
  margin = 140,
}) {
  const canvasRef = useRef(null);
  const rafRef = useRef(0);
  const tRef = useRef(0);
  const seedRef = useRef(Math.random() * 1000);

  const phases = useMemo(() => {
    const arr = [];
    for (let i = 0; i < lines; i++) {
      arr.push({
        p1: Math.random() * Math.PI * 2,
        p2: Math.random() * Math.PI * 2,
        p3: Math.random() * Math.PI * 2,
      });
    }
    return arr;
  }, [lines]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d", { alpha: true });

    const resize = () => {
      const dpr = Math.max(1, Math.min(2, window.devicePixelRatio || 1));
      const w = window.innerWidth;
      const h = window.innerHeight;
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.lineWidth = lineWidth;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
    };

    resize();
    window.addEventListener("resize", resize);

    const draw = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;

      tRef.current += speed * 16.6667;
      const t = tRef.current;
      const seed = seedRef.current;

      ctx.clearRect(0, 0, w, h);

      const topBandY = Math.min(h * 0.28, 260);
      const bottomBandY = Math.max(h * 0.72, h - 260);

      const yStarts = [];
      for (let i = 0; i < lines; i++) {
        const r = i / (lines - 1);
        const zone = i % 2 === 0 ? "top" : "bottom";
        const yBase =
          zone === "top"
            ? topBandY + (r * 0.22 - 0.11) * h
            : bottomBandY + (r * 0.22 - 0.11) * h;

        yStarts.push(yBase);
      }

      for (let i = 0; i < lines; i++) {
        const r = lines === 1 ? 0 : i / (lines - 1);
        const ph = phases[i];

        const a =
          amplitude *
          (0.35 + 0.9 * (1 - Math.abs(0.5 - r) * 2)) *
          (0.85 + 0.15 * Math.sin(t * 2 + ph.p1));

        const f = frequency * (0.8 + 0.55 * Math.sin(seed + r * 4.0 + t * 1.2));
        const drift = (r - 0.5) * 0.9;

        const y0 = yStarts[i] + (Math.sin(t * 1.4 + ph.p2) * 24 + Math.sin(t * 0.7 + ph.p3) * 12) * (0.25 + 0.75 * (1 - Math.abs(0.5 - r) * 2));

        const shade = 0;
        ctx.strokeStyle = `rgba(${shade}, ${shade}, ${shade}, ${alpha})`;

        ctx.beginPath();

        const x0 = -margin;
        const x1 = w + margin;
        const step = 10;

        for (let x = x0; x <= x1; x += step) {
          const nx = x - w * 0.5;
          const wave1 = Math.sin((nx + t * 2200) * f + ph.p1 + drift);
          const wave2 = Math.sin((nx + t * 1400) * (f * 0.55) + ph.p2 - drift * 0.6);
          const wave3 = Math.sin((nx - t * 1800) * (f * 0.33) + ph.p3 + drift * 0.35);

          const envelope = 0.35 + 0.65 * Math.pow(1 - Math.min(1, Math.abs(nx) / (w * 0.62)), 1.35);
          const y = y0 + (wave1 * 0.62 + wave2 * 0.28 + wave3 * 0.18) * a * envelope;

          if (x === x0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }

        ctx.stroke();
      }

      rafRef.current = requestAnimationFrame(draw);
    };

    rafRef.current = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener("resize", resize);
    };
  }, [alpha, amplitude, frequency, lineWidth, lines, margin, phases, speed]);

  return (
    <div className="animated-waves-bg" aria-hidden="true">
      <canvas ref={canvasRef} />
      <div className="animated-waves-vignette" />
    </div>
  );
}
