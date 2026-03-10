import { useEffect, useRef } from 'react';
import * as THREE from 'three';

const VERTEX_SHADER = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = vec4(position, 1.0);
  }
`;

const FRAGMENT_SHADER = `
  uniform float uTime;
  uniform vec2 uResolution;
  uniform vec2 uMouse;
  uniform float uScroll;
  varying vec2 vUv;

  float hash(vec2 p) {
    p = fract(p * vec2(123.34, 456.21));
    p += dot(p, p + 45.32);
    return fract(p.x * p.y);
  }

  void main() {
    vec2 uv = gl_FragCoord.xy / uResolution.xy;

    // High-key AI White Aesthetic
    vec3 color = vec3(1.0, 1.0, 1.0); // Pure white

    // Subtle noise for texture
    float n = hash(uv * 10.0 + uTime * 0.1);
    color -= n * 0.015;

    // Extremely faint grid
    float grid_line = step(0.98, fract(uv.x * 20.0)) + step(0.98, fract(uv.y * 20.0 * uResolution.y/uResolution.x));
    color -= grid_line * 0.01;

    gl_FragColor = vec4(color, 1.0);
  }
`;

export function useWebGLBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: false });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(window.innerWidth, window.innerHeight);

    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
    const geometry = new THREE.PlaneGeometry(2, 2);

    const uniforms = {
      uTime: { value: 0 },
      uResolution: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) },
      uMouse: { value: new THREE.Vector2(-10, -10) },
      uScroll: { value: 0 },
    };

    const material = new THREE.ShaderMaterial({
      uniforms,
      vertexShader: VERTEX_SHADER,
      fragmentShader: FRAGMENT_SHADER,
    });

    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    const targetMouse = new THREE.Vector2(-10, -10);
    const currentMouse = new THREE.Vector2(-10, -10);
    let targetScroll = 0;
    let currentScroll = 0;

    const onResize = () => {
      renderer.setSize(window.innerWidth, window.innerHeight);
      uniforms.uResolution.value.set(window.innerWidth, window.innerHeight);
    };
    const onMouseMove = (e: MouseEvent) => {
      targetMouse.x = e.clientX / window.innerWidth;
      targetMouse.y = 1.0 - e.clientY / window.innerHeight;
    };
    const onMouseLeave = () => {
      targetMouse.set(-10, -10);
    };
    const onScroll = () => {
      targetScroll = Math.min(window.scrollY / window.innerHeight, 1.0);
    };

    window.addEventListener('resize', onResize);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseleave', onMouseLeave);
    window.addEventListener('scroll', onScroll);

    const clock = new THREE.Clock();
    let animationId: number;

    const animate = () => {
      animationId = requestAnimationFrame(animate);
      uniforms.uTime.value = clock.getElapsedTime();
      currentMouse.lerp(targetMouse, 0.08);
      uniforms.uMouse.value.copy(currentMouse);
      currentScroll += (targetScroll - currentScroll) * 0.05;
      uniforms.uScroll.value = currentScroll;
      renderer.render(scene, camera);
    };
    animate();

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', onResize);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseleave', onMouseLeave);
      window.removeEventListener('scroll', onScroll);
      renderer.dispose();
      material.dispose();
      geometry.dispose();
    };
  }, []);

  return canvasRef;
}
