"use client";

import { useEffect, useRef } from "react";
import { prefersReducedMotion } from "@/hooks/useGsapContext";
import styles from "./Transformer.module.css";

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

type LayerSpec = {
  counts: number[];
  labels: string[];
};

type SpecTier = 0 | 1 | 2 | 3;

function specTier(width: number, height: number): SpecTier {
  const short = Math.min(width, height);
  if (short < 188 || width < 188) return 0;
  if (width < 292 || height < 252) return 1;
  if (width < 372) return 2;
  return 3;
}

const LIFECYCLE_SPECS: LayerSpec[] = [
  { counts: [3, 4, 3], labels: ["Brief", "Build", "Impact"] },
  { counts: [3, 5, 5, 3], labels: ["Brief", "Explore", "Ship", "Impact"] },
  { counts: [4, 5, 6, 4, 3], labels: ["Brief", "Scope", "Build", "Deploy", "Impact"] },
  { counts: [4, 6, 8, 6, 4, 3], labels: ["Brief", "Scope", "Explore", "Build", "Ship", "Impact"] },
];

function lifecycleSpec(width: number, height: number, prev?: SpecTier): { spec: LayerSpec; tier: SpecTier } {
  const next = specTier(width, height);
  let tier = next;
  if (prev !== undefined && prev !== next) {
    tier = (next > prev ? Math.min(prev + 1, next) : Math.max(prev - 1, next)) as SpecTier;
  }
  return { spec: LIFECYCLE_SPECS[tier], tier };
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
 * Feed-forward net for the hero: each column is a stage in the AI
 * engineer lifecycle; activations propagate left → right (brief → impact).
 */
export function Transformer() {
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
    let layerLabels: { x: number; y: number; text: string }[] = [];
    let width = 0;
    let height = 0;
    let dpr = 1;
    let raf = 0;
    let last = performance.now();
    let spawnAcc = 0;
    let running = true;
    let lastLayer = 0;
    let labelBand = 0;
    let specTierCurrent: SpecTier | undefined;
    let pointer = { x: -9999, y: -9999 };
    let colors = {
      copper: "#c45c26",
      verd: "#3d8f7a",
      ink: "#15171a",
      line: "rgba(21, 23, 26, 0.12)",
    };

    const startLoop = () => {
      if (reduced) return;
      running = true;
      last = performance.now();
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(tick);
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

      const { spec, tier } = lifecycleSpec(width, height, specTierCurrent);
      specTierCurrent = tier;
      const { counts, labels } = spec;
      const layerCount = counts.length;
      lastLayer = layerCount - 1;

      labelBand = Math.max(18, Math.min(24, height * 0.16));
      const padX = Math.max(6, width * 0.06);
      const padY = Math.max(4, height * 0.05);
      const innerW = width - padX * 2;
      const innerH = height - padY * 2 - labelBand;
      const bowScale = Math.min(14, innerH * 0.045);

      nodes = [];
      layerLabels = [];

      for (let l = 0; l < layerCount; l++) {
        const count = counts[l];
        const x = padX + (innerW * l) / Math.max(1, layerCount - 1);
        layerLabels.push({ x, y: height - Math.max(8, labelBand * 0.28), text: labels[l] ?? "" });

        for (let i = 0; i < count; i++) {
          const t = count === 1 ? 0.5 : i / (count - 1);
          const jitter = (rng() - 0.5) * Math.min(16, innerH * 0.032);
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
          const keep = ranked.slice(0, 2 + (rng() > 0.55 ? 1 : 0));
          for (const b of keep) {
            edges.push({
              from: a,
              to: b,
              weight: 0.35 + rng() * 0.65,
              accent: rng() > 0.58 ? 1 : 0,
            });
          }
        }
      }

      pulses = [];
      for (const node of nodes) node.energy = 0;
    };

    const spawn = () => {
      const inputs = nodes.map((n, i) => (n.layer === 0 ? i : -1)).filter((i) => i >= 0);
      const origin = inputs[Math.floor(rng() * inputs.length)];
      if (origin === undefined || origin < 0) return;
      nodes[origin].energy = 1;
      for (let e = 0; e < edges.length; e++) {
        if (edges[e].from === origin && rng() > 0.22) {
          pulses.push({ edge: e, t: 0, speed: 0.5 + rng() * 0.65 });
        }
      }
    };

    const drawLabels = () => {
      const fs = Math.max(9.5, Math.min(12, width / 24));
      ctx.font = `600 ${fs}px 'IBM Plex Mono', ui-monospace, monospace`;
      ctx.textAlign = "center";
      ctx.textBaseline = "alphabetic";
      ctx.fillStyle = colors.ink;
      ctx.globalAlpha = 1;
      for (const label of layerLabels) {
        ctx.fillText(label.text, Math.round(label.x), Math.round(label.y));
      }
      ctx.textAlign = "left";
    };

    const drawGraph = (live: boolean, now = 0) => {
      ctx.clearRect(0, 0, width, height);

      for (const edge of edges) {
        const a = nodes[edge.from];
        const b = nodes[edge.to];
        const liveE = live ? Math.max(a.energy, b.energy) : 0;
        ctx.beginPath();
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(b.x, b.y);
        ctx.strokeStyle = edge.accent ? colors.verd : colors.copper;
        ctx.globalAlpha = 0.1 + edge.weight * 0.14 + liveE * 0.22;
        ctx.lineWidth = 0.55 + edge.weight * 0.5 + liveE * 0.4;
        ctx.stroke();
      }

      if (live) {
        for (const pulse of pulses) {
          const edge = edges[pulse.edge];
          if (!edge) continue;
          const a = nodes[edge.from];
          const b = nodes[edge.to];
          if (!a || !b) continue;
          const x = a.x + (b.x - a.x) * pulse.t;
          const y = a.y + (b.y - a.y) * pulse.t;
          ctx.beginPath();
          ctx.arc(x, y, 1.5 + edge.weight * 0.5, 0, Math.PI * 2);
          ctx.fillStyle = edge.accent ? colors.verd : colors.copper;
          ctx.globalAlpha = 0.9;
          ctx.fill();
          ctx.beginPath();
          ctx.arc(x, y, 6, 0, Math.PI * 2);
          ctx.globalAlpha = 0.14;
          ctx.fill();
        }
      }

      for (const node of nodes) {
        const breathe = live ? 0.5 + 0.5 * Math.sin(now / 1400 + node.phase) : 0.5;
        const r = 2.35 + node.energy * 2 + breathe * 0.4;
        if (node.energy > 0.05) {
          ctx.beginPath();
          ctx.arc(node.x, node.y, 7 + node.energy * 7, 0, Math.PI * 2);
          ctx.fillStyle = node.layer === 0 || node.layer === lastLayer ? colors.copper : colors.verd;
          ctx.globalAlpha = 0.08 + node.energy * 0.16;
          ctx.fill();
        }
        ctx.beginPath();
        ctx.arc(node.x, node.y, r, 0, Math.PI * 2);
        ctx.fillStyle = colors.ink;
        ctx.globalAlpha = 0.48 + node.energy * 0.5;
        ctx.fill();
        ctx.beginPath();
        ctx.arc(node.x, node.y, r + 1.4, 0, Math.PI * 2);
        ctx.strokeStyle = node.energy > 0.2 ? colors.copper : colors.line;
        ctx.globalAlpha = 0.45 + node.energy * 0.45;
        ctx.lineWidth = 1;
        ctx.stroke();
      }

      drawLabels();
      ctx.globalAlpha = 1;
    };

    const tick = (now: number) => {
      if (!running) return;
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      spawnAcc += dt;
      if (spawnAcc > 0.8) {
        spawnAcc = 0;
        spawn();
      }

      for (const node of nodes) {
        node.energy = Math.max(0, node.energy - dt * 1.25);
        const dx = node.x - pointer.x;
        const dy = node.y - pointer.y;
        if (dx * dx + dy * dy < 85 * 85) {
          node.energy = Math.min(1, node.energy + dt * 1.7);
        }
      }

      const next: Pulse[] = [];
      for (const pulse of pulses) {
        pulse.t += dt * pulse.speed;
        const edge = edges[pulse.edge];
        if (!edge) continue;
        if (pulse.t >= 1) {
          const target = edge.to;
          if (nodes[target]) nodes[target].energy = 1;
          for (let e = 0; e < edges.length; e++) {
            if (edges[e].from === target && rng() > 0.38) {
              next.push({ edge: e, t: 0, speed: 0.55 + rng() * 0.7 });
            }
          }
        } else {
          next.push(pulse);
        }
      }
      pulses = next.slice(-72);

      drawGraph(true, now);
      raf = requestAnimationFrame(tick);
    };

    refreshColors();
    build();
    if (reduced) drawGraph(false);
    else {
      spawn();
      startLoop();
    }

    let resizeRaf = 0;
    const scheduleRebuild = () => {
      cancelAnimationFrame(resizeRaf);
      resizeRaf = requestAnimationFrame(() => {
        build();
        if (reduced) drawGraph(false);
        else if (running) drawGraph(true, performance.now());
      });
    };

    const ro = new ResizeObserver(scheduleRebuild);
    const stageEl = canvas.parentElement;
    if (stageEl) ro.observe(stageEl);
    else ro.observe(canvas);

    const themeObs = new MutationObserver(() => {
      refreshColors();
      if (reduced) drawGraph(false);
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

    const stage = canvas.parentElement;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry) return;
        if (!entry.isIntersecting) running = false;
        else if (!document.hidden) startLoop();
      },
      { threshold: 0, rootMargin: "0px 0px 15% 0px" },
    );
    io.observe(stage ?? canvas);

    return () => {
      running = false;
      cancelAnimationFrame(raf);
      ro.disconnect();
      themeObs.disconnect();
      io.disconnect();
      hero?.removeEventListener("pointermove", onMove);
      hero?.removeEventListener("pointerleave", onLeave);
      document.removeEventListener("visibilitychange", vis);
      cancelAnimationFrame(resizeRaf);
    };
  }, []);

  return (
    <div className={styles.stage} data-net aria-hidden="true">
      <p className={styles.caption}>AI engineer lifecycle</p>
      <canvas ref={canvasRef} className={styles.net} />
    </div>
  );
}
