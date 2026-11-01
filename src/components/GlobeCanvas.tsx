"use client";

import { useEffect, useRef } from "react";
import {
  AmbientLight,
  CanvasTexture,
  Color,
  DirectionalLight,
  Group,
  Mesh,
  MeshStandardMaterial,
  PerspectiveCamera,
  Scene,
  SphereGeometry,
  SRGBColorSpace,
  WebGLRenderer,
} from "three";

type Props = {
  longitude: number;
  latitude: number;
  onReady: () => void;
  onFailure: () => void;
};

const land: number[][][] = [
  [
    [-168, 71],
    [-145, 70],
    [-135, 59],
    [-125, 51],
    [-123, 40],
    [-114, 29],
    [-106, 23],
    [-97, 16],
    [-87, 20],
    [-82, 25],
    [-81, 31],
    [-75, 36],
    [-66, 46],
    [-53, 51],
    [-62, 59],
    [-77, 61],
    [-81, 70],
    [-105, 73],
    [-128, 71],
    [-151, 72],
  ],
  [
    [-81, 12],
    [-71, 12],
    [-60, 7],
    [-49, -1],
    [-35, -6],
    [-39, -20],
    [-50, -30],
    [-62, -41],
    [-68, -55],
    [-74, -45],
    [-73, -22],
    [-80, -6],
  ],
  [
    [-57, 60],
    [-46, 62],
    [-20, 75],
    [-25, 82],
    [-46, 84],
    [-61, 77],
  ],
  [
    [-17, 36],
    [-5, 35],
    [10, 37],
    [21, 32],
    [33, 30],
    [35, 23],
    [43, 12],
    [51, 12],
    [43, -12],
    [35, -25],
    [18, -35],
    [12, -24],
    [8, -4],
    [-4, 5],
    [-14, 11],
    [-17, 24],
  ],
  [
    [-10, 36],
    [-9, 43],
    [0, 44],
    [2, 51],
    [9, 54],
    [8, 58],
    [18, 70],
    [29, 71],
    [30, 61],
    [38, 56],
    [56, 61],
    [67, 69],
    [95, 75],
    [123, 72],
    [147, 62],
    [169, 65],
    [179, 55],
    [158, 51],
    [144, 45],
    [137, 35],
    [121, 30],
    [111, 21],
    [107, 9],
    [98, 8],
    [93, 20],
    [88, 21],
    [80, 8],
    [73, 19],
    [67, 24],
    [57, 25],
    [50, 30],
    [43, 12],
    [36, 20],
    [34, 30],
    [27, 36],
    [20, 39],
    [15, 37],
    [12, 45],
    [7, 44],
    [0, 37],
  ],
  [
    [112, -11],
    [125, -13],
    [136, -11],
    [145, -17],
    [153, -28],
    [146, -39],
    [130, -33],
    [114, -34],
    [112, -23],
  ],
  [
    [47, -13],
    [50, -16],
    [48, -24],
    [44, -25],
    [44, -20],
  ],
  [
    [139, 35],
    [142, 39],
    [145, 45],
    [141, 43],
    [138, 37],
    [131, 32],
    [133, 34],
  ],
  [
    [96, 5],
    [105, -2],
    [111, -7],
    [119, -8],
    [127, -4],
    [138, -5],
    [145, -7],
    [139, -9],
    [123, -10],
    [108, -8],
    [101, -3],
  ],
  [
    [-9, 50],
    [-6, 58],
    [-2, 59],
    [1, 51],
  ],
  [
    [-25, 63],
    [-20, 67],
    [-14, 65],
    [-16, 63],
  ],
  [
    [166, -35],
    [174, -40],
    [178, -43],
    [171, -46],
    [166, -44],
    [171, -40],
  ],
  [
    [-180, -72],
    [-145, -70],
    [-120, -73],
    [-90, -71],
    [-60, -65],
    [-40, -74],
    [0, -71],
    [40, -68],
    [75, -70],
    [120, -66],
    [155, -70],
    [180, -73],
    [180, -90],
    [-180, -90],
  ],
];

function createAtlas() {
  const canvas = document.createElement("canvas");
  canvas.width = 1024;
  canvas.height = 512;
  const context = canvas.getContext("2d");
  if (!context) throw new Error("Canvas unavailable");
  context.fillStyle = "#a9cbbf";
  context.fillRect(0, 0, canvas.width, canvas.height);
  context.lineWidth = 0.75;
  context.strokeStyle = "#8eb2a5";
  for (let x = 0; x <= 1024; x += 1024 / 24) {
    context.beginPath();
    context.moveTo(x, 0);
    context.lineTo(x, 512);
    context.stroke();
  }
  for (let y = 0; y <= 512; y += 512 / 12) {
    context.beginPath();
    context.moveTo(0, y);
    context.lineTo(1024, y);
    context.stroke();
  }
  context.fillStyle = "#e8e3c8";
  context.strokeStyle = "#c9ceb1";
  context.lineWidth = 1.1;
  for (const polygon of land) {
    context.beginPath();
    polygon.forEach(([longitude, latitude], index) => {
      const x = ((longitude + 180) / 360) * 1024;
      const y = ((90 - latitude) / 180) * 512;
      if (index === 0) context.moveTo(x, y);
      else context.lineTo(x, y);
    });
    context.closePath();
    context.fill();
    context.stroke();
  }
  // Fine deterministic paper texture avoids an external image and repeat downloads.
  let seed = 1987;
  for (let i = 0; i < 28000; i += 1) {
    seed = (seed * 16807) % 2147483647;
    const x = seed % 1024;
    seed = (seed * 16807) % 2147483647;
    const y = seed % 512;
    context.fillStyle =
      i % 2 ? "rgba(255,255,240,.045)" : "rgba(50,70,55,.035)";
    context.fillRect(x, y, 1, 1);
  }
  const texture = new CanvasTexture(canvas);
  texture.colorSpace = SRGBColorSpace;
  return texture;
}

export default function GlobeCanvas({
  longitude,
  latitude,
  onReady,
  onFailure,
}: Props) {
  const mount = useRef<HTMLDivElement>(null);
  const target = useRef({ longitude, latitude });
  const callbacks = useRef({ onReady, onFailure });
  const wakeRenderer = useRef<() => void>(() => {});
  useEffect(() => {
    target.current = { longitude, latitude };
    wakeRenderer.current();
  }, [longitude, latitude]);
  useEffect(() => {
    callbacks.current = { onReady, onFailure };
  }, [onReady, onFailure]);

  useEffect(() => {
    const element = mount.current;
    if (!element) return;
    let renderer: WebGLRenderer;
    try {
      renderer = new WebGLRenderer({
        alpha: true,
        antialias: true,
        powerPreference: "low-power",
      });
    } catch {
      callbacks.current.onFailure();
      return;
    }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
    renderer.outputColorSpace = SRGBColorSpace;
    renderer.setClearColor(new Color("#f7f2ea"), 0);
    renderer.domElement.setAttribute("aria-hidden", "true");
    element.appendChild(renderer.domElement);

    const scene = new Scene();
    const camera = new PerspectiveCamera(42, 1, 0.1, 20);
    camera.position.z = 5;
    const world = new Group();
    scene.add(world);
    const atlas = createAtlas();
    const geometry = new SphereGeometry(1.5, 64, 48);
    const material = new MeshStandardMaterial({
      map: atlas,
      roughness: 0.93,
      metalness: 0,
    });
    const sphere = new Mesh(geometry, material);
    world.add(sphere);
    world.rotation.x = (target.current.latitude * Math.PI) / 180;
    world.rotation.y = ((-target.current.longitude - 90) * Math.PI) / 180;
    scene.add(new AmbientLight("#fff6e7", 2.1));
    const sun = new DirectionalLight("#fff3d5", 2.8);
    sun.position.set(-4, 5, 6);
    scene.add(sun);
    const fill = new DirectionalLight("#7aaea3", 0.6);
    fill.position.set(4, -2, 2);
    scene.add(fill);

    let visible = true;
    let frame = 0;
    let previous = 0;
    let ready = false;
    let disposed = false;
    const size = () => {
      const width = element.clientWidth;
      const height = element.clientHeight;
      if (!width || !height) return;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
      resume();
    };
    const resize = new ResizeObserver(size);
    resize.observe(element);
    size();

    function draw(time: number) {
      frame = 0;
      if (disposed || !visible || document.hidden) return;
      const delta = previous ? Math.min((time - previous) / 16.67, 3) : 1;
      previous = time;
      const ease = 1 - Math.pow(0.94, delta);
      const wantedY = ((-target.current.longitude - 90) * Math.PI) / 180;
      const wantedX = (target.current.latitude * Math.PI) / 180;
      world.rotation.y += (wantedY - world.rotation.y) * ease;
      world.rotation.x += (wantedX - world.rotation.x) * ease;
      renderer.render(scene, camera);
      if (!ready) {
        ready = true;
        callbacks.current.onReady();
      }
      // Animation is demand-driven: stop once the selected view settles.
      if (
        Math.abs(wantedY - world.rotation.y) +
          Math.abs(wantedX - world.rotation.x) >
        0.0001
      )
        frame = requestAnimationFrame(draw);
    }
    function resume() {
      if (!frame && !disposed && visible && !document.hidden) {
        previous = 0;
        frame = requestAnimationFrame(draw);
      }
    }
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible) resume();
      else {
        cancelAnimationFrame(frame);
        frame = 0;
      }
    });
    observer.observe(element);
    const handleVisibility = () => {
      if (document.hidden) {
        cancelAnimationFrame(frame);
        frame = 0;
      } else resume();
    };
    const handleContextLoss = (event: Event) => {
      event.preventDefault();
      callbacks.current.onFailure();
    };
    document.addEventListener("visibilitychange", handleVisibility);
    renderer.domElement.addEventListener("webglcontextlost", handleContextLoss);
    // React wakes this demand-driven renderer when a dial changes; no idle timer.
    wakeRenderer.current = resume;
    resume();
    return () => {
      disposed = true;
      wakeRenderer.current = () => {};
      cancelAnimationFrame(frame);
      observer.disconnect();
      resize.disconnect();
      document.removeEventListener("visibilitychange", handleVisibility);
      renderer.domElement.removeEventListener(
        "webglcontextlost",
        handleContextLoss,
      );
      geometry.dispose();
      material.dispose();
      atlas.dispose();
      renderer.dispose();
      renderer.domElement.remove();
    };
  }, []);

  return <div className="globe-webgl" ref={mount} aria-hidden="true" />;
}
