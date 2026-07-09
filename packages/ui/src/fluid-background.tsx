'use client';

import { useEffect, useRef } from 'react';

const vertex = `#version 300 es
in vec2 a_position;
void main() {
  gl_Position = vec4(a_position, 0.0, 1.0);
}`;

const fragment = `#version 300 es
precision highp float;

uniform vec2  u_resolution;
uniform vec2  u_mouse;
uniform float u_time;
uniform vec3  u_color1;
uniform vec3  u_color2;
uniform vec3  u_color3;
uniform float u_speed;
uniform float u_density;
uniform float u_noiseScale;
uniform float u_grainFilm;
uniform float u_opacity;
uniform float u_pointerEffect;

out vec4 fragColor;

float random(vec2 st) {
  return fract(sin(dot(st.xy, vec2(12.9898, 78.233))) * 43758.5453123);
}

float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(
    mix(random(i + vec2(0.0, 0.0)), random(i + vec2(1.0, 0.0)), u.x),
    mix(random(i + vec2(0.0, 1.0)), random(i + vec2(1.0, 1.0)), u.x),
    u.y
  );
}

float fbm(vec2 p) {
  float v = 0.0;
  float a = 0.5;
  mat2 rot = mat2(cos(0.5), sin(0.5), -sin(0.5), cos(0.5));
  for (int i = 0; i < 5; i++) {
    v += a * noise(p);
    p = rot * p * 2.0;
    a *= 0.5;
  }
  return v;
}

void main() {
  vec2 uv = gl_FragCoord.xy / u_resolution;
  float aspect = u_resolution.x / u_resolution.y;
  vec2 p = (uv - 0.5) * 2.0;
  p.x *= aspect;

  vec2 mouse = (u_mouse - 0.5) * 2.0;
  mouse.x *= aspect;

  float t = u_time * u_speed;

  vec2 sp = p * u_noiseScale;

  vec2 mouseInfluence = (p - mouse) * 0.15 * u_pointerEffect;
  vec2 drift = mouseInfluence * (sin(t * 0.3) * 0.5 + 0.5);

  vec2 q = vec2(
    fbm(sp + drift + t * 0.5),
    fbm(sp + vec2(5.2, 1.3) + drift + t * 0.35)
  );

  vec2 r = vec2(
    fbm(sp + 3.0 * q + vec2(1.7, 9.2) + t * 0.25),
    fbm(sp + 3.0 * q + vec2(8.3, 2.8) + t * 0.35)
  );

  float f = fbm(sp + u_density * r);

  float plasma = sin(sp.x * 2.0 + sp.y * 1.5 + t * 0.7) * 0.2 + 0.5;
  f = mix(f, plasma, 0.1);

  vec3 col = mix(u_color1, u_color2, f * 0.6);
  col = mix(col, u_color3, smoothstep(0.4, 0.8, f) * 0.25);
  col = mix(col, u_color1, smoothstep(0.0, 0.3, f) * 0.4);

  float grain = (random(uv + u_time * 0.01) - 0.5) * u_grainFilm * 2.0;
  col += grain;

  vec2 pointUv = uv * 6.0 * u_noiseScale;
  vec2 pointId = floor(pointUv);
  vec2 pointFrac = fract(pointUv) - 0.5;

  float pointHash = random(pointId + floor(u_time * 0.05));
  float pointDist = length(pointFrac);
  float pointRadius = 0.03 + pointHash * 0.05;
  float pointVal = smoothstep(pointRadius, 0.0, pointDist);
  pointVal *= smoothstep(0.1, 0.9, pointHash) * pointHash;

  vec3 pointCol = u_color3 * 0.6 + vec3(0.1, 0.2, 0.1);
  col = mix(col, pointCol, pointVal * 0.2 * u_opacity);

  fragColor = vec4(col, u_opacity);
}`;

function compileShader(
  gl: WebGL2RenderingContext,
  source: string,
  type: number,
): WebGLShader {
  const shader = gl.createShader(type)!;
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    console.error(gl.getShaderInfoLog(shader));
    gl.deleteShader(shader);
    throw new Error('shader compile error');
  }
  return shader;
}

function createProgram(
  gl: WebGL2RenderingContext,
  vs: string,
  fs: string,
): WebGLProgram {
  const prog = gl.createProgram()!;
  gl.attachShader(prog, compileShader(gl, vs, gl.VERTEX_SHADER));
  gl.attachShader(prog, compileShader(gl, fs, gl.FRAGMENT_SHADER));
  gl.linkProgram(prog);
  if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
    console.error(gl.getProgramInfoLog(prog));
    gl.deleteProgram(prog);
    throw new Error('program link error');
  }
  return prog;
}

function hexToRgb(hex: string): [number, number, number] {
  const v = parseInt(hex.replace('#', ''), 16);
  return [(v >> 16) & 0xff, (v >> 8) & 0xff, v & 0xff].map(
    (n) => n / 255,
  ) as [number, number, number];
}

function parseColor(color: string): [number, number, number] {
  if (color.startsWith('#')) return hexToRgb(color);
  if (color.startsWith('oklch')) {
    const m = color.match(/oklch\(([\d.]+)%\s+([\d.]+)\s+([\d.]+)\)/);
    if (m) {
      const L = parseFloat(m[1]) / 100;
      const C = parseFloat(m[2]);
      const H = (parseFloat(m[3]) * Math.PI) / 180;
      const a = C * Math.cos(H);
      const b = C * Math.sin(H);

      const l_ = L + 0.3963377774 * a + 0.2158037573 * b;
      const m_ = L - 0.1055613458 * a - 0.0638541728 * b;
      const s_ = L - 0.0894841775 * a - 1.2914855480 * b;

      let r =
        4.0767416621 * l_ - 3.3077115913 * m_ + 0.2309699292 * s_;
      let g =
        -1.2684380046 * l_ + 2.6097574011 * m_ - 0.3413193965 * s_;
      let bl =
        -0.0041960863 * l_ - 0.7034186147 * m_ + 1.7076147010 * s_;

      const gamma = (c: number) =>
        c <= 0.0031308 ? 12.92 * c : 1.055 * Math.pow(c, 1 / 2.4) - 0.055;
      return [
        Math.max(0, Math.min(1, gamma(r))),
        Math.max(0, Math.min(1, gamma(g))),
        Math.max(0, Math.min(1, gamma(bl))),
      ];
    }
  }
  return [0, 0, 0];
}

export interface FluidBackgroundProps {
  opacity?: number;
  color1?: string;
  color2?: string;
  color3?: string;
  speed?: number;
  density?: number;
  noiseScale?: number;
  grainFilm?: number;
  pointerEffect?: boolean;
}

export function FluidBackground({
  opacity = 0.5,
  color1 = '#202920',
  color2 = '#123329',
  color3 = '#1D5336',
  speed = 0.1,
  density = 4,
  noiseScale = 1.4,
  grainFilm = 0.071,
  pointerEffect = true,
}: FluidBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = canvas.getContext('webgl2', { alpha: true });
    if (!gl) {
      console.warn('WebGL2 not supported');
      return;
    }

    const prog = createProgram(gl, vertex, fragment);
    gl.useProgram(prog);

    const posLoc = gl.getAttribLocation(prog, 'a_position');
    const posBuf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, posBuf);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]),
      gl.STATIC_DRAW,
    );
    gl.enableVertexAttribArray(posLoc);
    gl.vertexAttribPointer(posLoc, 2, gl.FLOAT, false, 0, 0);

    const resLoc = gl.getUniformLocation(prog, 'u_resolution');
    const mouseLoc = gl.getUniformLocation(prog, 'u_mouse');
    const timeLoc = gl.getUniformLocation(prog, 'u_time');
    const c1Loc = gl.getUniformLocation(prog, 'u_color1');
    const c2Loc = gl.getUniformLocation(prog, 'u_color2');
    const c3Loc = gl.getUniformLocation(prog, 'u_color3');
    const speedLoc = gl.getUniformLocation(prog, 'u_speed');
    const densityLoc = gl.getUniformLocation(prog, 'u_density');
    const opacityLoc = gl.getUniformLocation(prog, 'u_opacity');
    const noiseScaleLoc = gl.getUniformLocation(prog, 'u_noiseScale');
    const grainFilmLoc = gl.getUniformLocation(prog, 'u_grainFilm');
    const pointerEffectLoc = gl.getUniformLocation(prog, 'u_pointerEffect');

    const c1 = parseColor(color1);
    const c2 = parseColor(color2);
    const c3 = parseColor(color3);

    const prefersReduced = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches;

    const mouse = { x: 0.5, y: 0.5 };

    function onMouse(e: MouseEvent) {
      mouse.x = e.clientX / window.innerWidth;
      mouse.y = 1.0 - e.clientY / window.innerHeight;
    }
    function onTouch(e: TouchEvent) {
      const t = e.touches[0];
      if (t) {
        mouse.x = t.clientX / window.innerWidth;
        mouse.y = 1.0 - t.clientY / window.innerHeight;
      }
    }

    if (pointerEffect) {
      window.addEventListener('mousemove', onMouse);
      window.addEventListener('touchmove', onTouch);
    }

    function resize() {
      const dpr = window.devicePixelRatio || 1;
      const w = window.innerWidth;
      const h = window.innerHeight;
      canvas!.width = w * dpr;
      canvas!.height = h * dpr;
      gl!.viewport(0, 0, canvas!.width, canvas!.height);
      gl!.uniform2f(resLoc, canvas!.width, canvas!.height);
    }

    resize();
    window.addEventListener('resize', resize);

    gl.uniform3fv(c1Loc, c1);
    gl.uniform3fv(c2Loc, c2);
    gl.uniform3fv(c3Loc, c3);
    gl.uniform1f(speedLoc, prefersReduced ? 0 : speed);
    gl.uniform1f(densityLoc, density);
    gl.uniform1f(opacityLoc, opacity);
    gl.uniform1f(noiseScaleLoc, noiseScale);
    gl.uniform1f(grainFilmLoc, grainFilm);
    gl.uniform1f(pointerEffectLoc, pointerEffect ? 1.0 : 0.0);

    let animId = 0;
    const start = performance.now();

    function frame() {
      const elapsed = (performance.now() - start) / 1000;
      gl!.uniform1f(timeLoc, elapsed);
      gl!.uniform2f(mouseLoc, mouse.x, mouse.y);
      gl!.drawArrays(gl!.TRIANGLE_STRIP, 0, 4);
      animId = requestAnimationFrame(frame);
    }

    if (!prefersReduced) {
      frame();
    } else {
      gl.uniform1f(timeLoc, 0);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    }

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resize);
      if (pointerEffect) {
        window.removeEventListener('mousemove', onMouse);
        window.removeEventListener('touchmove', onTouch);
      }
      gl.deleteProgram(prog);
    };
  }, [opacity, color1, color2, color3, speed, density, noiseScale, grainFilm, pointerEffect]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full pointer-events-none"
      style={{ zIndex: 0 }}
      aria-hidden="true"
    />
  );
}
