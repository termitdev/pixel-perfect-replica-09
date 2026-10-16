
"use client";

import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

const vertexShaderGLSL = `
attribute vec2 position;
varying vec2 vUv;

void main() {
  vUv = position * 0.5 + 0.5;
  gl_Position = vec4(position, 0.0, 1.0);
}
`;

const fragmentShaderGLSL = `
precision highp float;

varying vec2 vUv;

uniform vec2 u_resolution;
uniform float u_time;
uniform float u_grain;
uniform vec3 u_colors[4];
uniform vec3 u_bg;

vec3 permute(vec3 x) {
  return mod(((x * 34.0) + 1.0) * x, 289.0);
}

float snoise(vec2 v) {
  const vec4 C = vec4(
    0.211324865405187,
    0.366025403784439,
    -0.577350269189626,
    0.024390243902439
  );

  vec2 i = floor(v + dot(v, C.yy));
  vec2 x0 = v - i + dot(i, C.xx);
  vec2 i1 = x0.x > x0.y
    ? vec2(1.0, 0.0)
    : vec2(0.0, 1.0);

  vec4 x12 = x0.xyxy + C.xxzz;
  x12.xy -= i1;
  i = mod(i, 289.0);

  vec3 p = permute(
    permute(i.y + vec3(0.0, i1.y, 1.0))
    + i.x + vec3(0.0, i1.x, 1.0)
  );

  vec3 m = max(
    0.5 - vec3(
      dot(x0, x0),
      dot(x12.xy, x12.xy),
      dot(x12.zw, x12.zw)
    ),
    0.0
  );

  m = m * m;
  m = m * m;

  vec3 x = 2.0 * fract(p * C.www) - 1.0;
  vec3 h = abs(x) - 0.5;
  vec3 ox = floor(x + 0.5);
  vec3 a0 = x - ox;

  m *= 1.79284291400159
    - 0.85373472095314 * (a0 * a0 + h * h);

  vec3 g;
  g.x = a0.x * x0.x + h.x * x0.y;
  g.yz = a0.yz * x12.xz + h.yz * x12.yw;

  return 130.0 * dot(m, g);
}

void main() {
  vec2 uv = vUv;
  float ratio = u_resolution.x / u_resolution.y;

  vec2 p = uv - 0.5;
  p.x *= ratio;

  float t = u_time * 0.1;

  float n1 = snoise(p * 0.4 + vec2(t * 0.2, -t * 0.3));
  float n2 = snoise(
    p * 0.55 + vec2(-t * 0.15, t * 0.25) + n1 * 0.25
  );
  float n3 = snoise(
    p * 0.75 + vec2(t * 0.1, -t * 0.2) + n2 * 0.2
  );

  vec3 col = u_bg;

  float dist = length(p) * 1.5;
  float vignette = 1.0 - smoothstep(0.3, 1.2, dist);

  col = mix(
    col, u_colors[0],
    smoothstep(-0.2, 0.5, n1) * 0.85
  );

  col = mix(
    col, u_colors[1],
    smoothstep(-0.1, 0.6, n2) * 0.7
  );

  col = mix(
    col, u_colors[2],
    smoothstep(-0.3, 0.4, n3) * 0.6
  );

  col = mix(
    col, u_colors[3],
    smoothstep(0.0, 0.7, n1 * n2) * 0.5
  );

  float glow = smoothstep(0.8, 0.0, dist) * 0.3;
  col += u_colors[1] * glow;

  col = mix(col * 0.2, col, vignette);

  float grain = fract(
    sin(dot(uv, vec2(12.9898, 78.233)))
    * 43758.5453 + u_time
  );

  col += (grain - 0.5) * u_grain * 0.1;

  gl_FragColor = vec4(col, 1.0);
}
`;

export interface VelarisProps {
  bg?: string;
  colors?: string[];
  speed?: number;
  grain?: number;
  height?: string;
  className?: string;
  children?: React.ReactNode;
}

const DEFAULT_COLORS = [
  "#0B182C",
  "#163B59",
  "#256D85",
  "#02060D",
];

const Velaris = ({
  bg = "#050D16",
  colors = DEFAULT_COLORS,
  speed = 1.2,
  grain = 0.15,
  height = "100vh",
  className,
  children,
}: VelarisProps) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;

    if (!canvas || !container) return;

    const gl = canvas.getContext("webgl");
    if (!gl) return;

    const createShader = (type: number, source: string) => {
      const shader = gl.createShader(type);

      if (!shader) {
        throw new Error("Não foi possível criar o shader WebGL.");
      }

      gl.shaderSource(shader, source);
      gl.compileShader(shader);

      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        const message = gl.getShaderInfoLog(shader);
        gl.deleteShader(shader);
        throw new Error(message || "Erro ao compilar shader.");
      }

      return shader;
    };

    const vertexShader = createShader(
      gl.VERTEX_SHADER,
      vertexShaderGLSL
    );

    const fragmentShader = createShader(
      gl.FRAGMENT_SHADER,
      fragmentShaderGLSL
    );

    const program = gl.createProgram();

    if (!program) {
      gl.deleteShader(vertexShader);
      gl.deleteShader(fragmentShader);
      return;
    }

    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.error(gl.getProgramInfoLog(program));
      gl.deleteProgram(program);
      gl.deleteShader(vertexShader);
      gl.deleteShader(fragmentShader);
      return;
    }

    gl.useProgram(program);

    const buffer = gl.createBuffer();

    if (!buffer) {
      gl.deleteProgram(program);
      gl.deleteShader(vertexShader);
      gl.deleteShader(fragmentShader);
      return;
    }

    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);

    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([
        -1, -1,
         1, -1,
        -1,  1,
         1,  1,
      ]),
      gl.STATIC_DRAW
    );

    const position = gl.getAttribLocation(program, "position");

    gl.enableVertexAttribArray(position);
    gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);

    const resolutionLocation = gl.getUniformLocation(
      program,
      "u_resolution"
    );
    const timeLocation = gl.getUniformLocation(program, "u_time");
    const grainLocation = gl.getUniformLocation(program, "u_grain");
    const colorsLocation = gl.getUniformLocation(program, "u_colors");
    const bgLocation = gl.getUniformLocation(program, "u_bg");

    const hexToRgb = (hex: string): [number, number, number] => {
      const value = hex.replace("#", "");

      if (!/^[0-9a-fA-F]{6}$/.test(value)) {
        return [0, 0, 0];
      }

      return [
        parseInt(value.slice(0, 2), 16) / 255,
        parseInt(value.slice(2, 4), 16) / 255,
        parseInt(value.slice(4, 6), 16) / 255,
      ];
    };

    const safeColors = Array.from(
      { length: 4 },
      (_, index) => colors[index] ?? DEFAULT_COLORS[index]
    );

    const flatColors = new Float32Array(
      safeColors.flatMap(hexToRgb)
    );

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const width = container.clientWidth;
      const height = container.clientHeight;

      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);

      gl.viewport(0, 0, canvas.width, canvas.height);
    };

    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(container);
    resize();

    gl.uniform3fv(colorsLocation, flatColors);
    gl.uniform3f(bgLocation, ...hexToRgb(bg));
    gl.uniform1f(grainLocation, grain);

    let animationFrame = 0;

    const render = (time: number) => {
      gl.uniform2f(
        resolutionLocation,
        canvas.width,
        canvas.height
      );

      gl.uniform1f(timeLocation, time * 0.001 * speed);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

      animationFrame = requestAnimationFrame(render);
    };

    animationFrame = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animationFrame);
      resizeObserver.disconnect();
      gl.deleteBuffer(buffer);
      gl.deleteProgram(program);
      gl.deleteShader(vertexShader);
      gl.deleteShader(fragmentShader);
    };
  }, [bg, colors, speed, grain]);

  return (
    <div
      ref={containerRef}
      style={{ height }}
      className={cn(
        "relative isolate w-full overflow-hidden",
        className
      )}
    >
      <canvas
        ref={canvasRef}
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 h-full w-full"
      />

      <div className="relative z-10 h-full w-full">
        {children}
      </div>
    </div>
  );
};

export default Velaris;
