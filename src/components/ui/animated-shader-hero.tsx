import React, { useEffect, useRef, useState, useCallback } from 'react';
import { cn } from '@/lib/utils';

interface TrustBadgeProps {
  text: string;
  icons?: string[];
}

interface HeadlineProps {
  line1: string;
  line2: string;
}

interface ButtonProps {
  text: string;
  onClick: () => void;
}

interface ButtonsProps {
  primary: ButtonProps;
  secondary: ButtonProps;
}

interface AnimatedShaderHeroProps {
  trustBadge?: TrustBadgeProps;
  headline: HeadlineProps;
  subtitle: string;
  buttons: ButtonsProps;
  className?: string;
}

// Agricultural-themed shader source
const agroviaShaderSource = `#version 300 es
precision highp float;
out vec4 O;
uniform vec2 resolution;
uniform float time;

#define FC gl_FragCoord.xy
#define T time
#define R resolution
#define MN min(R.x,R.y)

float rnd(vec2 p) {
  p=fract(p*vec2(12.9898,78.233));
  p+=dot(p,p+34.56);
  return fract(p.x*p.y);
}

float noise(in vec2 p) {
  vec2 i=floor(p), f=fract(p), u=f*f*(3.-2.*f);
  float a=rnd(i), b=rnd(i+vec2(1,0)), c=rnd(i+vec2(0,1)), d=rnd(i+1.);
  return mix(mix(a,b,u.x),mix(c,d,u.x),u.y);
}

float fbm(vec2 p) {
  float t=.0, a=1.;
  mat2 m=mat2(1.,-.5,.2,1.2);
  for (int i=0; i<5; i++) {
    t+=a*noise(p);
    p*=2.*m;
    a*=.5;
  }
  return t;
}

// Organic field-like pattern
float fields(vec2 p) {
  float d=1., t=.0;
  for (float i=.0; i<3.; i++) {
    float a=d*fbm(i*8.+p.x*.15+.15*(1.+i)*p.y+d+i*i+p);
    t=mix(t,d,a);
    d=a;
    p*=1.8/(i+1.);
  }
  return t;
}

void main(void) {
  vec2 uv=(FC-.5*R)/MN,st=uv*vec2(2,1);
  vec3 col=vec3(0);
  
  // Create flowing field pattern
  float bg=fields(vec2(st.x+T*.3,-st.y+T*.1));
  
  uv*=1.-.2*(sin(T*.15)*.5+.5);
  
  for (float i=1.; i<10.; i++) {
    uv+=.08*cos(i*vec2(.08+.008*i, .6)+i*i+T*.4+.08*uv.x);
    vec2 p=uv;
    float d=length(p);
    
    // Green to golden gradient (agricultural colors)
    vec3 green=vec3(0.13, 0.77, 0.37);    // Fresh green
    vec3 gold=vec3(0.96, 0.62, 0.05);     // Harvest gold
    vec3 earth=vec3(0.45, 0.35, 0.25);    // Earth brown
    
    vec3 baseColor=mix(green, gold, sin(i*.5)*.5+.5);
    baseColor=mix(baseColor, earth, d*.3);
    
    col+=.0015/d*baseColor;
    
    float b=noise(i+p+bg*1.5);
    col+=.0025*b/length(max(p,vec2(b*p.x*.015,p.y)));
    col=mix(col,vec3(bg*.15,bg*.25,bg*.08),d*.8);
  }
  
  // Warm, earthy tone
  col=pow(col, vec3(1.1));
  col*=1.05;
  
  O=vec4(col,1);
}`;

// WebGL utility functions
const createShader = (gl: WebGL2RenderingContext, type: number, source: string): WebGLShader | null => {
  const shader = gl.createShader(type);
  if (!shader) return null;
  
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    console.error('Shader compilation error:', gl.getShaderInfoLog(shader));
    gl.deleteShader(shader);
    return null;
  }
  
  return shader;
};

const createProgram = (gl: WebGL2RenderingContext, vertexShader: WebGLShader, fragmentShader: WebGLShader): WebGLProgram | null => {
  const program = gl.createProgram();
  if (!program) return null;
  
  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);
  gl.linkProgram(program);
  
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    console.error('Program linking error:', gl.getProgramInfoLog(program));
    gl.deleteProgram(program);
    return null;
  }
  
  return program;
};

// Hook for WebGL with fallback detection
const useWebGLWithFallback = () => {
  const [supportsWebGL, setSupportsWebGL] = useState(true);
  const [isSlowNetwork, setIsSlowNetwork] = useState(false);

  useEffect(() => {
    // Check network speed
    const connection = (navigator as any).connection;
    if (connection) {
      const effectiveType = connection.effectiveType;
      setIsSlowNetwork(effectiveType === '2g' || effectiveType === 'slow-2g');
    }

    // Check WebGL support
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl2');
    setSupportsWebGL(!!gl);
  }, []);

  // Return simple gradient for slow networks or no WebGL
  if (isSlowNetwork || !supportsWebGL) {
    return {
      shouldUseShader: false,
      fallbackClass: "bg-gradient-to-br from-green-50 via-primary/5 to-amber-50"
    };
  }

  return { shouldUseShader: true };
};

const AnimatedShaderHero: React.FC<AnimatedShaderHeroProps> = ({
  trustBadge,
  headline,
  subtitle,
  buttons,
  className
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();
  const programRef = useRef<WebGLProgram | null>(null);
  const { shouldUseShader, fallbackClass } = useWebGLWithFallback();

  const initWebGL = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas || !shouldUseShader) return;

    const gl = canvas.getContext('webgl2');
    if (!gl) return;

    // Vertex shader (simple fullscreen quad)
    const vertexShaderSource = `#version 300 es
      in vec4 position;
      void main() {
        gl_Position = position;
      }
    `;

    const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
    const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, agroviaShaderSource);

    if (!vertexShader || !fragmentShader) return;

    const program = createProgram(gl, vertexShader, fragmentShader);
    if (!program) return;

    programRef.current = program;

    // Create fullscreen quad
    const positions = new Float32Array([
      -1, -1,
       1, -1,
      -1,  1,
       1,  1,
    ]);

    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, positions, gl.STATIC_DRAW);

    const positionLocation = gl.getAttribLocation(program, 'position');
    gl.enableVertexAttribArray(positionLocation);
    gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

    gl.useProgram(program);
  }, [shouldUseShader]);

  const render = useCallback((time: number) => {
    const canvas = canvasRef.current;
    const program = programRef.current;
    if (!canvas || !program || !shouldUseShader) return;

    const gl = canvas.getContext('webgl2');
    if (!gl) return;

    // Set canvas size
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * window.devicePixelRatio;
    canvas.height = rect.height * window.devicePixelRatio;
    gl.viewport(0, 0, canvas.width, canvas.height);

    // Set uniforms
    const resolutionLocation = gl.getUniformLocation(program, 'resolution');
    const timeLocation = gl.getUniformLocation(program, 'time');

    gl.uniform2f(resolutionLocation, canvas.width, canvas.height);
    gl.uniform1f(timeLocation, time * 0.001);

    // Draw
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

    animationRef.current = requestAnimationFrame(render);
  }, [shouldUseShader]);

  useEffect(() => {
    if (shouldUseShader) {
      initWebGL();
      animationRef.current = requestAnimationFrame(render);
    }

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [initWebGL, render, shouldUseShader]);

  return (
    <div className={cn("relative min-h-screen overflow-hidden", className)}>
      {/* Shader Canvas or Fallback Background */}
      {shouldUseShader ? (
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full object-cover"
          style={{ filter: 'blur(0.5px)' }}
        />
      ) : (
        <div className={cn("absolute inset-0 w-full h-full", fallbackClass)} />
      )}

      {/* Overlay for better text readability */}
      <div className="absolute inset-0 bg-black/20" />

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 py-20 text-center">
        {/* Trust Badge */}
        {trustBadge && (
          <div className="inline-flex flex-wrap items-center gap-2 px-4 py-2 mb-6 rounded-full bg-white/10 backdrop-blur-sm border border-white/20">
            {trustBadge.icons && (
              <div className="flex items-center gap-1">
                {trustBadge.icons.map((icon, idx) => (
                  <span key={idx} className="text-yellow-400 text-lg">{icon}</span>
                ))}
              </div>
            )}
            <span className="text-white font-medium text-sm md:text-base">
              {trustBadge.text}
            </span>
          </div>
        )}

        {/* Headline */}
        <h1 className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-white mb-6 max-w-4xl leading-tight">
          {headline.line1}
          <br />
          <span className="text-gradient-fresh bg-gradient-to-r from-green-300 via-green-200 to-yellow-200 bg-clip-text text-transparent">
            {headline.line2}
          </span>
        </h1>

        {/* Subtitle */}
        <p className="text-lg md:text-xl lg:text-2xl text-white/90 mb-8 max-w-3xl leading-relaxed">
          {subtitle}
        </p>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 w-full max-w-md">
          <button
            onClick={buttons.primary.onClick}
            className="flex-1 py-4 px-8 bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 active:scale-95"
          >
            {buttons.primary.text}
          </button>
          <button
            onClick={buttons.secondary.onClick}
            className="flex-1 py-4 px-8 border-2 border-white/30 text-white rounded-xl font-semibold hover:bg-white/10 transition-all duration-300 hover:scale-105 active:scale-95 backdrop-blur-sm"
          >
            {buttons.secondary.text}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AnimatedShaderHero;