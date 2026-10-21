"use client";

import { useEffect, useRef } from "react";
import { prefersReducedMotion } from "@/hooks/useGsapContext";
import styles from "./NeuralNet.module.css";

type Node = {
  x: number;
  y: number;
  layer: number;
  phase: number;
  energy: number;
};

type Edge = {
  from: number;
  to: number;
  weight: number;
  accent: 0 | 1;
};

type Pulse = {
  edge: number;
  t: number;
  speed: number;
};

function layerCounts(width: number) {
  if (width < 220) return [3, 5, 4, 3];
  if (width < 320) return [4, 6, 5, 3];
  return [4, 6, 8, 5, 3];
}

function seedRng(seed: number) {
  let s = seed >>> 0;
  return () => {
    s += 0x6d2b79f5;
    let t = s;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function readToken(name: string) {
  return getComputedStyle(document.documentElement).getPropertyValue(name).trim();
}

/**
 * Layered neural-net field for the hero. Neurons sit in irregular columns;
 * activation pulses travel left-to-right along weighted synapses. Not a
 * particle-connection field — the topology is a feed-forward net.
 */
export function NeuralNet() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    const reduced = prefersReducedMotion();
    const rng = seedRng(20261021);

    let nodes: Node[] = [];
    let edges: Edge[] = [];
    let pulses: Pulse[] = [];
    let width = 0;
    let height = 0;
    let dpr = 1;
    let raf = 0;
    let last = performance.now();

    const startLoop = () => {
      if (reduced) return;
      running = true;
      last = performance.now();
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(tick);
    };
    let spawnAcc = 0;
    let running = true;
    let lastLayer = 0;
    let pointer = { x: -9999, y: -9999 };
    let colors = {
      copper: "#c45c26",
      verd: "#3d8f7a",
      ink: "#e8e4dc",
      line: "rgba(232,228,220,0.12)",
    };

    const refreshColors = () => {
      colors = {
        copper: readToken("--copper") || colors.copper,
        verd: readToken("--verdigris") || colors.verd,
        ink: readToken("--parchment") || colors.ink,
        line: readToken("--line") || colors.line,
      };
    };

    const build = () => {
      const rect = canvas.getBoundingClientRect();
      width = Math.max(1, Math.round(rect.width));
      height = Math.max(1, Math.round(rect.height));
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const layers = layerCounts(width);
      const padX = width * 0.1;
      const padY = height * 0.1;
      const innerW = width - padX * 2;
      const innerH = height - padY * 2;
      const layerCount = layers.length;
      lastLayer = layerCount - 1;
      const bowScale = Math.min(12, innerH * 0.04);

      nodes = [];
      for (let l = 0; l < layerCount; l++) {
        const count = layers[l];
        const x = padX + (innerW * l) / (layerCount - 1);
        for (let i = 0; i < count; i++) {
          const t = count === 1 ? 0.5 : i / (count - 1);
          const jitter = (rng() - 0.5) * Math.min(18, innerH * 0.035);
          const bow = Math.sin(t * Math.PI) * (l % 2 === 0 ? bowScale : -bowScale);
          nodes.push({
            x,
            y: padY + t * innerH + jitter + bow,
            layer: l,
            phase: rng() * Math.PI * 2,
            energy: 0,
          });
        }
      }

      edges = [];
      const byLayer: number[][] = Array.from({ length: layerCount }, () => []);
      nodes.forEach((n, i) => byLayer[n.layer].push(i));

      for (let l = 0; l < layerCount - 1; l++) {
        const src = byLayer[l];
        const dst = byLayer[l + 1];
        for (const a of src) {
          const ranked = [...dst].sort(
            (i, j) => Math.abs(nodes[a].y - nodes[i].y) - Math.abs(nodes[a].y - nodes[j].y),
          );
          const keep = ranked.slice(0, 2 + (rng() > 0.65 ? 1 : 0));
          for (const b of keep) {
            edges.push({
              from: a,
              to: b,
              weight: 0.35 + rng() * 0.65,
              accent: rng() > 0.62 ? 1 : 0,
            });
          }
        }
      }

      pulses = [];
    };

    const spawn = () => {
      const inputs = nodes
        .map((n, i) => (n.layer === 0 ? i : -1))
        .filter((i) => i >= 0);
      const origin = inputs[Math.floor(rng() * inputs.length)];
      if (origin < 0) return;
      nodes[origin].energy = 1;
      for (let e = 0; e < edges.length; e++) {
        if (edges[e].from === origin && rng() > 0.25) {
          pulses.push({ edge: e, t: 0, speed: 0.55 + rng() * 0.7 });
        }
      }
    };

    const drawStatic = () => {
      ctx.clearRect(0, 0, width, height);
      for (const edge of edges) {
        const a = nodes[edge.from];
        const b = nodes[edge.to];
        ctx.beginPath();
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(b.x, b.y);
        ctx.strokeStyle = edge.accent ? colors.verd : colors.copper;
        ctx.globalAlpha = 0.12 + edge.weight * 0.12;
        ctx.lineWidth = 0.55 + edge.weight * 0.45;
        ctx.stroke();
      }
      ctx.globalAlpha = 1;
      for (const node of nodes) {
        ctx.beginPath();
        ctx.arc(node.x, node.y, 1.8, 0, Math.PI * 2);
        ctx.fillStyle = colors.ink;
        ctx.globalAlpha = 0.42;
        ctx.fill();
      }
      ctx.globalAlpha = 1;
    };

    const tick = (now: number) => {
      if (!running) return;
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      spawnAcc += dt;
      if (spawnAcc > 0.85) {
        spawnAcc = 0;
        spawn();
      }

      for (const node of nodes) {
        node.energy = Math.max(0, node.energy - dt * 1.35);
        const dx = node.x - pointer.x;
        const dy = node.y - pointer.y;
        if (dx * dx + dy * dy < 90 * 90) {
          node.energy = Math.min(1, node.energy + dt * 1.8);
        }
      }

      const next: Pulse[] = [];
      for (const pulse of pulses) {
        pulse.t += dt * pulse.speed;
        if (pulse.t >= 1) {
          const target = edges[pulse.edge].to;
          nodes[target].energy = 1;
          for (let e = 0; e < edges.length; e++) {
            if (edges[e].from === target && rng() > 0.4) {
              next.push({ edge: e, t: 0, speed: 0.6 + rng() * 0.75 });
            }
          }
        } else {
          next.push(pulse);
        }
      }
      pulses = next.slice(-70);

      ctx.clearRect(0, 0, width, height);

      for (const edge of edges) {
        const a = nodes[edge.from];
        const b = nodes[edge.to];
        const live = Math.max(a.energy, b.energy);
        ctx.beginPath();
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(b.x, b.y);
        ctx.strokeStyle = edge.accent ? colors.verd : colors.copper;
        ctx.globalAlpha = 0.07 + edge.weight * 0.12 + live * 0.18;
        ctx.lineWidth = 0.5 + edge.weight * 0.5 + live * 0.35;
        ctx.stroke();
      }

      for (const pulse of pulses) {
        const edge = edges[pulse.edge];
        const a = nodes[edge.from];
        const b = nodes[edge.to];
        const x = a.x + (b.x - a.x) * pulse.t;
        const y = a.y + (b.y - a.y) * pulse.t;
        ctx.beginPath();
        ctx.arc(x, y, 1.3 + edge.weight * 0.6, 0, Math.PI * 2);
        ctx.fillStyle = edge.accent ? colors.verd : colors.copper;
        ctx.globalAlpha = 0.85;
        ctx.fill();
        ctx.beginPath();
        ctx.arc(x, y, 5, 0, Math.PI * 2);
        ctx.fillStyle = edge.accent ? colors.verd : colors.copper;
        ctx.globalAlpha = 0.12;
        ctx.fill();
      }

      for (const node of nodes) {
        const breathe = 0.5 + 0.5 * Math.sin(now / 1400 + node.phase);
        const r = 1.6 + node.energy * 1.6 + breathe * 0.3;
        if (node.energy > 0.05) {
          ctx.beginPath();
          ctx.arc(node.x, node.y, 6 + node.energy * 6, 0, Math.PI * 2);
          ctx.fillStyle = node.layer === 0 || node.layer === lastLayer ? colors.copper : colors.verd;
          ctx.globalAlpha = 0.06 + node.energy * 0.12;
          ctx.fill();
        }
        ctx.beginPath();
        ctx.arc(node.x, node.y, r, 0, Math.PI * 2);
        ctx.fillStyle = colors.ink;
        ctx.globalAlpha = 0.35 + node.energy * 0.55;
        ctx.fill();
        ctx.beginPath();
        ctx.arc(node.x, node.y, r + 1.2, 0, Math.PI * 2);
        ctx.strokeStyle = node.energy > 0.2 ? colors.copper : colors.line;
        ctx.globalAlpha = 0.35 + node.energy * 0.45;
        ctx.lineWidth = 1;
        ctx.stroke();
      }
      ctx.globalAlpha = 1;
      raf = requestAnimationFrame(tick);
    };

    refreshColors();
    build();
    if (reduced) {
      drawStatic();
    } else {
      spawn();
      startLoop();
    }

    const ro = new ResizeObserver(() => {
      const prev = pulses.slice();
      build();
      if (reduced) drawStatic();
      else pulses = prev;
    });
    ro.observe(canvas);

    const themeObs = new MutationObserver(() => {
      refreshColors();
      if (reduced) drawStatic();
    });
    themeObs.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });

    const onMove = (e: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      pointer.x = e.clientX - rect.left;
      pointer.y = e.clientY - rect.top;
    };
    const onLeave = () => {
      pointer.x = -9999;
      pointer.y = -9999;
    };
    const hero = canvas.closest("header");
    hero?.addEventListener("pointermove", onMove);
    hero?.addEventListener("pointerleave", onLeave);

    const vis = () => {
      if (document.hidden) running = false;
      else startLoop();
    };
    document.addEventListener("visibilitychange", vis);

    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry) return;
        if (!entry.isIntersecting) running = false;
        else if (!document.hidden) startLoop();
      },
      { threshold: 0.05 },
    );
    io.observe(canvas);

    return () => {
      running = false;
      cancelAnimationFrame(raf);
      ro.disconnect();
      themeObs.disconnect();
      io.disconnect();
      hero?.removeEventListener("pointermove", onMove);
      hero?.removeEventListener("pointerleave", onLeave);
      document.removeEventListener("visibilitychange", vis);
    };
  }, []);

  return (
    <div className={styles.stage} data-net aria-hidden="true">
      <canvas ref={canvasRef} className={styles.net} />
    </div>
  );
}
