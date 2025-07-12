// src/scripts/vapor-webgl.js
// WebGL vapor effect with medium density mist and subtle upward drift

export class VaporWebGL {
  constructor(canvas) {
    this.canvas = canvas;
    this.gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    
    if (!this.gl) {
      console.warn('WebGL not supported, falling back to canvas');
      return null;
    }
    
    this.time = 0;
    this.animationId = null;
    
    this.init();
  }
  
  init() {
    this.setupGL();
    this.createShaders();
    this.setupQuad();
  }
  
  setupGL() {
    this.gl.viewport(0, 0, this.canvas.width, this.canvas.height);
    this.gl.clearColor(0.0, 0.0, 0.0, 0.0);
    this.gl.enable(this.gl.BLEND);
    this.gl.blendFunc(this.gl.SRC_ALPHA, this.gl.ONE_MINUS_SRC_ALPHA);
  }
  
  createShaders() {
    const vertexShaderSource = `
      precision mediump float;
      
      attribute vec2 a_position;
      
      uniform vec2 u_resolution;
      
      varying vec2 v_uv;
      
      void main() {
        // Full screen quad
        gl_Position = vec4(a_position, 0.0, 1.0);
        
        // UV coordinates for fragment shader
        v_uv = (a_position + 1.0) * 0.5;
        v_uv.y = 1.0 - v_uv.y; // Flip Y
      }
    `;
    
    const fragmentShaderSource = `
      precision mediump float;
      
      uniform float u_time;
      uniform vec2 u_resolution;
      
      varying vec2 v_uv;
      
      // Simple noise function
      float hash(vec2 p) {
        return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
      }
      
      float noise(vec2 p) {
        vec2 i = floor(p);
        vec2 f = fract(p);
        vec2 u = f * f * (3.0 - 2.0 * f);
        
        return mix(
          mix(hash(i + vec2(0.0, 0.0)), hash(i + vec2(1.0, 0.0)), u.x),
          mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x),
          u.y
        );
      }
      
      float fbm(vec2 p) {
        float value = 0.0;
        float amplitude = 0.5;
        float frequency = 1.0;
        
        for(int i = 0; i < 4; i++) {
          value += amplitude * noise(p * frequency);
          amplitude *= 0.5;
          frequency *= 2.0;
        }
        
        return value;
      }
      
      void main() {
        vec2 uv = v_uv;
        vec2 scaledUV = uv * 7.0; // Scale for finer detail
        
        // Time-based animation
        float time = u_time * 0.002;
        
        // Create flowing mist with multiple noise layers
        vec2 flow1 = vec2(time * 0.1, time * 0.05);
        vec2 flow2 = vec2(time * 0.06, -time * 0.03);
        
        float mist1 = fbm(scaledUV + flow1);
        float mist2 = fbm(scaledUV * 1.5 + flow2);
        float mist3 = fbm(scaledUV * 0.5 + flow1 * 0.5);
        
        // Combine noise layers for complex mist pattern
        float mist = mist1 * 0.5 + mist2 * 0.3 + mist3 * 0.2;
        
        // Add upward drift by modifying noise based on Y position
        float drift = sin((uv.y + time) * 7.0) * 0.1;
        mist += drift;
        
        // Create soft, flowing edges
        mist = smoothstep(0.4, 0.8, mist);
        
        // Fade at edges for seamless look
        // float edgeFade = smoothstep(0.0, 0.1, uv.x) * 
        //                 smoothstep(1.0, 0.9, uv.x) * 
        //                 smoothstep(0.0, 0.2, uv.y) * 
        //                 smoothstep(1.0, 0.7, uv.y);
        
        // mist *= edgeFade;
        
        // Monochromatic gray with subtle variation
        float gray = 0.4 + sin(time * 5.0) * 0.1;
        
        gl_FragColor = vec4(gray, gray, gray, mist * 0.3);
      }
    `;
    
    this.program = this.createProgram(vertexShaderSource, fragmentShaderSource);
    
    if (!this.program) {
      console.error('Failed to create shader program');
      return;
    }
    
    this.gl.useProgram(this.program);
    
    // Get uniform locations
    this.locations = {
      position: this.gl.getAttribLocation(this.program, 'a_position'),
      resolution: this.gl.getUniformLocation(this.program, 'u_resolution'),
      time: this.gl.getUniformLocation(this.program, 'u_time')
    };
  }
  
  createProgram(vertexSource, fragmentSource) {
    const vertexShader = this.createShader(this.gl.VERTEX_SHADER, vertexSource);
    const fragmentShader = this.createShader(this.gl.FRAGMENT_SHADER, fragmentSource);
    
    if (!vertexShader || !fragmentShader) {
      console.error('Failed to create shaders');
      return null;
    }
    
    const program = this.gl.createProgram();
    this.gl.attachShader(program, vertexShader);
    this.gl.attachShader(program, fragmentShader);
    this.gl.linkProgram(program);
    
    if (!this.gl.getProgramParameter(program, this.gl.LINK_STATUS)) {
      console.error('Program link error:', this.gl.getProgramInfoLog(program));
      this.gl.deleteProgram(program);
      return null;
    }
    
    // Clean up shaders
    this.gl.deleteShader(vertexShader);
    this.gl.deleteShader(fragmentShader);
    
    return program;
  }
  
  createShader(type, source) {
    const shader = this.gl.createShader(type);
    this.gl.shaderSource(shader, source);
    this.gl.compileShader(shader);
    
    if (!this.gl.getShaderParameter(shader, this.gl.COMPILE_STATUS)) {
      console.error('Shader compile error:', this.gl.getShaderInfoLog(shader));
      return null;
    }
    
    return shader;
  }
  
  setupQuad() {
    // Create a full-screen quad for mist rendering
    const positions = new Float32Array([
      -1.0, -1.0,  // Bottom left
       1.0, -1.0,  // Bottom right
      -1.0,  1.0,  // Top left
       1.0,  1.0   // Top right
    ]);
    
    this.positionBuffer = this.gl.createBuffer();
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.positionBuffer);
    this.gl.bufferData(this.gl.ARRAY_BUFFER, positions, this.gl.STATIC_DRAW);
  }
  
  render() {
    this.time++;
    
    // Clear canvas
    this.gl.clear(this.gl.COLOR_BUFFER_BIT);
    
    // Set uniforms
    this.gl.uniform2f(this.locations.resolution, this.canvas.width, this.canvas.height);
    this.gl.uniform1f(this.locations.time, this.time);
    
    // Bind position attribute for full-screen quad
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.positionBuffer);
    this.gl.enableVertexAttribArray(this.locations.position);
    this.gl.vertexAttribPointer(this.locations.position, 2, this.gl.FLOAT, false, 0, 0);
    
    // Draw full-screen quad as triangle strip
    this.gl.drawArrays(this.gl.TRIANGLE_STRIP, 0, 4);
  }
  
  start() {
    const animate = () => {
      this.render();
      this.animationId = requestAnimationFrame(animate);
    };
    animate();
  }
  
  stop() {
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
      this.animationId = null;
    }
  }
  
  resize(width, height) {
    this.canvas.width = width;
    this.canvas.height = height;
    this.gl.viewport(0, 0, width, height);
  }
}