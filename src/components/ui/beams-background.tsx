'use client';

import React, { useEffect, useRef } from 'react';

interface BeamsBackgroundProps {
  beamCount?: number;
  beamColor?: string;
  speed?: number;
  className?: string;
  opacity?: number;
}

/**
 * A canvas-based animated background of drifting light beams.
 *
 * Subtle, full-screen, pointer-safe: beams drift diagonally at low opacity
 * behind the page content. Defaults to PitchPulse's emerald accent to match
 * the dark design language. Respects `prefers-reduced-motion`.
 */
export function BeamsBackground({
  beamCount = 10,
  beamColor = '16, 185, 129',
  speed = 0.6,
  className = '',
  opacity = 1,
}: BeamsBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);
    let animationId = 0;

    interface Beam {
      x: number;
      y: number;
      length: number;
      speedX: number;
      speedY: number;
      thickness: number;
      phase: number;
    }

    const beams: Beam[] = Array.from({ length: beamCount }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      length: 120 + Math.random() * 240,
      speedX: (Math.random() - 0.5) * speed,
      speedY: (Math.random() - 0.5) * speed,
      thickness: 2 + Math.random() * 2.5,
      phase: Math.random() * Math.PI * 2,
    }));

    const draw = () => {
      ctx.clearRect(0, 0, width, height);
      ctx.globalCompositeOperation = 'lighter';

      for (const beam of beams) {
        beam.x += beam.speedX;
        beam.y += beam.speedY;
        beam.phase += 0.01;

        // Wrap around edges
        if (beam.x < -beam.length) beam.x = width + beam.length;
        if (beam.x > width + beam.length) beam.x = -beam.length;
        if (beam.y < -beam.length) beam.y = height + beam.length;
        if (beam.y > height + beam.length) beam.y = -beam.length;

        const alpha = (0.7 + 0.3 * Math.sin(beam.phase)) * opacity;
        const color = `rgba(${beamColor}, ${alpha})`;

        ctx.shadowColor = color;
        ctx.shadowBlur = 40;
        ctx.strokeStyle = color;
        ctx.lineWidth = beam.thickness;
        ctx.beginPath();
        ctx.moveTo(beam.x, beam.y);
        ctx.lineTo(beam.x + beam.length, beam.y + beam.length);
        ctx.stroke();
      }

      ctx.globalCompositeOperation = 'source-over';
      ctx.shadowBlur = 0;

      animationId = requestAnimationFrame(draw);
    };

    draw();

    const onResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', onResize);

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', onResize);
    };
  }, [beamCount, beamColor, speed, opacity]);

  return (
    <canvas
      ref={canvasRef}
      className={`pointer-events-none fixed inset-0 z-0 ${className}`}
      aria-hidden="true"
    />
  );
}

export default BeamsBackground;