'use client';

import { useEffect, useRef } from 'react';
import styles from './CanvasBg.module.css';

type TechNodeKind = 'code' | 'neural' | 'mcu' | 'signal';

interface TechNode {
  x: number;
  y: number;
  vx: number;
  vy: number;
  phase: number;
  size: number;
  kind: TechNodeKind;
  accent: 'blue' | 'orange';
  energy: number;
}

export default function CanvasBg() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const reducedMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    let prefersReducedMotion = reducedMotionQuery.matches;

    let width = window.innerWidth;
    let height = window.innerHeight;
    let dpr = Math.min(window.devicePixelRatio || 1, 2);
    let animationFrameId = 0;

    let nodes: TechNode[] = [];

    const pointer = {
      x: -9999,
      y: -9999,
      active: false,
    };

    const initScene = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const isMobile = width < 768;

      // Minimal set of Coding, AI & IoT motifs with smooth drifting velocities
      const seeds: Array<{
        rx: number;
        ry: number;
        vx: number;
        vy: number;
        kind: TechNodeKind;
        size: number;
        accent: 'blue' | 'orange';
      }> = isMobile
        ? [
            { rx: 0.16, ry: 0.18, vx: 0.28, vy: 0.16, kind: 'code', size: 22, accent: 'blue' },
            { rx: 0.82, ry: 0.24, vx: -0.24, vy: 0.22, kind: 'neural', size: 24, accent: 'orange' },
            { rx: 0.22, ry: 0.56, vx: 0.22, vy: -0.2, kind: 'mcu', size: 22, accent: 'blue' },
            { rx: 0.78, ry: 0.72, vx: -0.26, vy: -0.18, kind: 'signal', size: 22, accent: 'blue' },
            { rx: 0.5, ry: 0.88, vx: 0.2, vy: -0.24, kind: 'neural', size: 22, accent: 'orange' },
          ]
        : [
            { rx: 0.1, ry: 0.18, vx: 0.34, vy: 0.18, kind: 'code', size: 24, accent: 'blue' },
            { rx: 0.36, ry: 0.12, vx: -0.26, vy: 0.28, kind: 'neural', size: 26, accent: 'orange' },
            { rx: 0.74, ry: 0.16, vx: 0.28, vy: 0.24, kind: 'mcu', size: 24, accent: 'blue' },
            { rx: 0.9, ry: 0.42, vx: -0.32, vy: 0.16, kind: 'signal', size: 24, accent: 'blue' },
            { rx: 0.08, ry: 0.58, vx: 0.3, vy: -0.22, kind: 'signal', size: 24, accent: 'blue' },
            { rx: 0.3, ry: 0.82, vx: 0.24, vy: -0.3, kind: 'mcu', size: 24, accent: 'orange' },
            { rx: 0.66, ry: 0.78, vx: -0.3, vy: -0.2, kind: 'code', size: 24, accent: 'blue' },
            { rx: 0.88, ry: 0.86, vx: -0.22, vy: -0.28, kind: 'neural', size: 26, accent: 'orange' },
          ];

      nodes = seeds.map((s, idx) => ({
        x: s.rx * width,
        y: s.ry * height,
        vx: s.vx,
        vy: s.vy,
        phase: idx * 1.3,
        size: s.size,
        kind: s.kind,
        accent: s.accent,
        energy: 0,
      }));
    };

    /** Minimalist Coding: </> */
    const drawCode = (n: TechNode, stroke: string) => {
      const s = n.size * 0.38;
      ctx.strokeStyle = stroke;
      ctx.lineWidth = 1.3;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';

      ctx.beginPath();
      ctx.moveTo(n.x - s * 0.65, n.y - s * 0.65);
      ctx.lineTo(n.x - s * 1.3, n.y);
      ctx.lineTo(n.x - s * 0.65, n.y + s * 0.65);
      ctx.moveTo(n.x + s * 0.65, n.y - s * 0.65);
      ctx.lineTo(n.x + s * 1.3, n.y);
      ctx.lineTo(n.x + s * 0.65, n.y + s * 0.65);
      ctx.moveTo(n.x + s * 0.24, n.y - s * 0.85);
      ctx.lineTo(n.x - s * 0.24, n.y + s * 0.85);
      ctx.stroke();
    };

    /** Minimalist AI: 2-2-1 micro neural motif */
    const drawNeural = (n: TechNode, stroke: string, accentRgb: string, time: number) => {
      const s = n.size;
      const pulse = prefersReducedMotion ? 0.5 : (Math.sin(time * 0.0025 + n.phase) + 1) * 0.5;
      const pts: Array<[number, number]> = [
        [n.x - s * 0.48, n.y - s * 0.28],
        [n.x - s * 0.48, n.y + s * 0.28],
        [n.x, n.y - s * 0.36],
        [n.x, n.y + s * 0.36],
        [n.x + s * 0.48, n.y],
      ];

      const edges: Array<[number, number]> = [
        [0, 2],
        [0, 3],
        [1, 2],
        [1, 3],
        [2, 4],
        [3, 4],
      ];

      ctx.strokeStyle = stroke;
      ctx.lineWidth = 1;
      ctx.beginPath();
      for (const [a, b] of edges) {
        ctx.moveTo(pts[a][0], pts[a][1]);
        ctx.lineTo(pts[b][0], pts[b][1]);
      }
      ctx.stroke();

      for (let i = 0; i < pts.length; i++) {
        ctx.beginPath();
        ctx.arc(pts[i][0], pts[i][1], i === 4 ? 2.5 : 2, 0, Math.PI * 2);
        ctx.fillStyle =
          i === 4
            ? `rgba(${accentRgb}, ${0.42 + n.energy * 0.4 + pulse * 0.16})`
            : stroke;
        ctx.fill();
      }
    };

    /** Minimalist IoT: MCU Chip */
    const drawMCU = (n: TechNode, stroke: string) => {
      const s = n.size;
      const half = s * 0.5;
      ctx.strokeStyle = stroke;
      ctx.lineWidth = 1.25;
      ctx.strokeRect(n.x - half, n.y - half, s, s);

      const pin = 4.2;
      const o = s * 0.24;
      ctx.beginPath();
      for (const d of [-o, o]) {
        ctx.moveTo(n.x + d, n.y - half);
        ctx.lineTo(n.x + d, n.y - half - pin);
        ctx.moveTo(n.x + d, n.y + half);
        ctx.lineTo(n.x + d, n.y + half + pin);
        ctx.moveTo(n.x - half, n.y + d);
        ctx.lineTo(n.x - half - pin, n.y + d);
        ctx.moveTo(n.x + half, n.y + d);
        ctx.lineTo(n.x + half + pin, n.y + d);
      }
      ctx.stroke();
    };

    /** Minimalist IoT: RF Signal */
    const drawSignal = (n: TechNode, stroke: string, accentRgb: string, time: number) => {
      const pulse = prefersReducedMotion ? 0.5 : (Math.sin(time * 0.0028 + n.phase) + 1) * 0.5;

      ctx.strokeStyle = stroke;
      ctx.lineWidth = 1.25;
      ctx.beginPath();
      ctx.arc(n.x, n.y + 5, n.size * 0.36, -Math.PI * 0.8, -Math.PI * 0.2);
      ctx.stroke();

      ctx.strokeStyle = `rgba(${accentRgb}, ${0.2 + n.energy * 0.38 + pulse * 0.15})`;
      ctx.beginPath();
      ctx.arc(n.x, n.y + 5, n.size * 0.64, -Math.PI * 0.8, -Math.PI * 0.2);
      ctx.stroke();

      ctx.fillStyle = stroke;
      ctx.beginPath();
      ctx.arc(n.x, n.y + 5, 1.9, 0, Math.PI * 2);
      ctx.fill();
    };

    const render = (time: number) => {
      ctx.clearRect(0, 0, width, height);

      const spacing = 40;
      const offsetX = (width % spacing) * 0.5;
      const offsetY = (height % spacing) * 0.5;
      const hoverRadius = 160;

      // 1. Subtle architectural dot-matrix grid
      for (let gx = offsetX; gx < width; gx += spacing) {
        for (let gy = offsetY; gy < height; gy += spacing) {
          const wave = prefersReducedMotion
            ? 0
            : Math.sin(gx * 0.014 + gy * 0.014 + time * 0.0008) * 0.025;

          let alpha = 0.09 + wave;
          let radius = 1;
          let highlighted = false;

          if (pointer.active) {
            const dist = Math.hypot(gx - pointer.x, gy - pointer.y);
            if (dist < hoverRadius) {
              const factor = 1 - dist / hoverRadius;
              alpha += factor * 0.25;
              radius += factor * 0.55;
              highlighted = factor > 0.35;
            }
          }

          if (highlighted) {
            ctx.fillStyle = `rgba(43, 130, 217, ${Math.min(0.45, alpha)})`;
            ctx.beginPath();
            ctx.arc(gx, gy, radius, 0, Math.PI * 2);
            ctx.fill();
          } else {
            ctx.fillStyle = `rgba(156, 163, 175, ${Math.max(0.04, alpha)})`;
            ctx.fillRect(gx - 0.75, gy - 0.75, 1.5, 1.5);
          }
        }
      }

      // 2. Smooth continuous drift & edge wrap-around
      const pad = 42;
      for (const n of nodes) {
        if (!prefersReducedMotion) {
          n.x += n.vx;
          n.y += n.vy;

          if (n.x < -pad) n.x = width + pad;
          if (n.x > width + pad) n.x = -pad;
          if (n.y < -pad) n.y = height + pad;
          if (n.y > height + pad) n.y = -pad;
        }

        let targetEnergy = 0;
        if (pointer.active) {
          const dist = Math.hypot(n.x - pointer.x, n.y - pointer.y);
          if (dist < 210) {
            targetEnergy = 1 - dist / 210;
          }
        }
        n.energy += (targetEnergy - n.energy) * 0.08;
      }

      // 3. Dynamic proximity links when drifting nodes pass near each other
      const linkDist = width < 768 ? 190 : 280;
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const a = nodes[i];
          const b = nodes[j];
          const d = Math.hypot(a.x - b.x, a.y - b.y);
          if (d < linkDist) {
            const proximity = 1 - d / linkDist;
            const linkEnergy = Math.max(a.energy, b.energy);
            const alpha = proximity * (0.14 + linkEnergy * 0.24);

            ctx.strokeStyle = `rgba(43, 130, 217, ${alpha})`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();

            if (!prefersReducedMotion) {
              const t = (time * 0.00025 + (i + j) * 0.17) % 1;
              const px = a.x + (b.x - a.x) * t;
              const py = a.y + (b.y - a.y) * t;
              ctx.fillStyle = `rgba(43, 130, 217, ${proximity * (0.55 + linkEnergy * 0.35)})`;
              ctx.beginPath();
              ctx.arc(px, py, 1.7, 0, Math.PI * 2);
              ctx.fill();
            }
          }
        }
      }

      // 4. Draw moving Coding, AI & IoT motifs
      for (const n of nodes) {
        const accentRgb = n.accent === 'orange' ? '217, 114, 36' : '43, 130, 217';
        const strokeAlpha = 0.24 + n.energy * 0.4;
        const stroke =
          n.energy > 0.15
            ? `rgba(${accentRgb}, ${strokeAlpha})`
            : `rgba(156, 163, 175, ${strokeAlpha})`;

        if (n.kind === 'code') {
          drawCode(n, stroke);
        } else if (n.kind === 'neural') {
          drawNeural(n, stroke, accentRgb, time);
        } else if (n.kind === 'mcu') {
          drawMCU(n, stroke);
        } else {
          drawSignal(n, stroke, accentRgb, time);
        }
      }

      if (!prefersReducedMotion) {
        animationFrameId = requestAnimationFrame(render);
      }
    };

    const handleMouseMove = (e: MouseEvent) => {
      pointer.x = e.clientX;
      pointer.y = e.clientY;
      pointer.active = true;
    };

    const handleMouseLeave = () => {
      pointer.active = false;
    };

    const handleResize = () => {
      initScene();
      if (prefersReducedMotion) {
        render(0);
      }
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden') {
        cancelAnimationFrame(animationFrameId);
      } else if (!prefersReducedMotion) {
        animationFrameId = requestAnimationFrame(render);
      }
    };

    const handleMotionChange = (e: MediaQueryListEvent) => {
      prefersReducedMotion = e.matches;
      cancelAnimationFrame(animationFrameId);
      if (prefersReducedMotion) {
        render(0);
      } else {
        animationFrameId = requestAnimationFrame(render);
      }
    };

    initScene();
    if (prefersReducedMotion) {
      render(0);
    } else {
      animationFrameId = requestAnimationFrame(render);
    }

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    document.addEventListener('mouseleave', handleMouseLeave);
    window.addEventListener('resize', handleResize);
    document.addEventListener('visibilitychange', handleVisibilityChange);
    reducedMotionQuery.addEventListener('change', handleMotionChange);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
      window.removeEventListener('resize', handleResize);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      reducedMotionQuery.removeEventListener('change', handleMotionChange);
    };
  }, []);

  return (
    <canvas
      id="tech-bg"
      ref={canvasRef}
      className={styles.canvas}
      aria-hidden="true"
    />
  );
}
