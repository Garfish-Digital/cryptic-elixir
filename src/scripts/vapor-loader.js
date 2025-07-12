// Mystical Vapor Loading System
// True vapor/smoke effects using volumetric rendering techniques

import * as THREE from 'three';

export class VaporLoader {
  constructor(container) {
    this.container = container;
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    this.renderer = new THREE.WebGLRenderer({ 
      antialias: true, 
      alpha: true,
      powerPreference: "high-performance"
    });
    
    // Performance scaling
    this.performanceLevel = this.detectPerformanceLevel();
    this.vaporResolution = this.getVaporResolution();
    
    // Animation timeline
    this.timeline = {
      vaporPhase: 0,
      formationPhase: 0,
      textPhase: 0,
      dispersalPhase: 0
    };
    
    // Vapor layers for depth
    this.vaporLayers = [];
    this.vaporMaterials = [];
    
    this.init();
  }
  
  detectPerformanceLevel() {
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl2') || canvas.getContext('webgl');
    
    if (!gl) return 'low';
    
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    return isMobile ? 'low' : 'high';
  }
  
  getVaporResolution() {
    return this.performanceLevel === 'high' ? 256 : 128;
  }
  
  init() {
    this.setupRenderer();
    this.setupCamera();
    this.createVaporLayers();
    this.setupLighting();
    this.startAnimation();
  }
  
  setupRenderer() {
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.setClearColor(0x1E1B2E, 1);
    this.container.appendChild(this.renderer.domElement);
  }
  
  setupCamera() {
    this.camera.position.set(0, 0, 5);
    this.camera.lookAt(0, 0, 0);
  }
  
  createVaporLayers() {
    // Create multiple vapor layers for depth and complexity
    for (let i = 0; i < 3; i++) {
      this.createVaporLayer(i);
    }
  }
  
  createVaporLayer(layerIndex) {
    const geometry = new THREE.PlaneGeometry(12, 8, 32, 32);
    
    // Create vapor material with custom shader
    const vaporMaterial = new THREE.ShaderMaterial({
      uniforms: {
        time: { value: 0 },
        formationPhase: { value: 0 },
        textPhase: { value: 0 },
        dispersalPhase: { value: 0 },
        layerOffset: { value: layerIndex * 0.7 },
        vaporDensity: { value: 0.3 - layerIndex * 0.08 },
        vaporColor: { value: new THREE.Color(0xD4A574) },
        noiseScale: { value: 2.0 + layerIndex * 0.5 },
        flowSpeed: { value: 0.1 + layerIndex * 0.05 }
      },
      vertexShader: this.getVaporVertexShader(),
      fragmentShader: this.getVaporFragmentShader(),
      transparent: true,
      side: THREE.DoubleSide,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });
    
    const vaporMesh = new THREE.Mesh(geometry, vaporMaterial);
    vaporMesh.position.z = -layerIndex * 0.5;
    vaporMesh.rotation.z = (layerIndex * Math.PI) / 6;
    
    this.scene.add(vaporMesh);
    this.vaporLayers.push(vaporMesh);
    this.vaporMaterials.push(vaporMaterial);
  }
  
  getVaporVertexShader() {
    return `
      varying vec2 vUv;
      varying vec3 vPosition;
      varying vec3 vNormal;
      
      uniform float time;
      uniform float layerOffset;
      uniform float formationPhase;
      
      // Noise function for vertex displacement
      float noise(vec3 p) {
        return fract(sin(dot(p, vec3(12.9898, 78.233, 45.543))) * 43758.5453);
      }
      
      float fbm(vec3 p) {
        float value = 0.0;
        float amplitude = 0.5;
        float frequency = 1.0;
        
        for (int i = 0; i < 4; i++) {
          value += amplitude * noise(p * frequency);
          amplitude *= 0.5;
          frequency *= 2.0;
        }
        
        return value;
      }
      
      void main() {
        vUv = uv;
        vNormal = normal;
        
        vec3 pos = position;
        
        // Create flowing, wispy vapor movement
        float timeOffset = time * 0.1 + layerOffset;
        
        // Swirling motion
        float swirl = fbm(vec3(pos.xy * 0.5, timeOffset));
        pos.x += sin(timeOffset + pos.y * 2.0) * swirl * 0.3;
        pos.y += cos(timeOffset + pos.x * 1.5) * swirl * 0.2;
        
        // Vertical flow like rising smoke
        pos.y += timeOffset * 0.5;
        pos.y = mod(pos.y + 4.0, 8.0) - 4.0; // Wrap around
        
        // Undulating motion
        float wave = sin(pos.x * 3.0 + timeOffset * 2.0) * 0.1;
        pos.z += wave * (1.0 - formationPhase);
        
        vPosition = pos;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
      }
    `;
  }
  
  getVaporFragmentShader() {
    return `
      varying vec2 vUv;
      varying vec3 vPosition;
      varying vec3 vNormal;
      
      uniform float time;
      uniform float formationPhase;
      uniform float textPhase;
      uniform float dispersalPhase;
      uniform float layerOffset;
      uniform float vaporDensity;
      uniform vec3 vaporColor;
      uniform float noiseScale;
      uniform float flowSpeed;
      
      // Advanced noise functions for vapor
      float noise(vec2 p) {
        return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453);
      }
      
      float fbm(vec2 p) {
        float value = 0.0;
        float amplitude = 0.5;
        float frequency = 1.0;
        
        for (int i = 0; i < 6; i++) {
          value += amplitude * noise(p * frequency);
          amplitude *= 0.5;
          frequency *= 2.0;
        }
        
        return value;
      }
      
      // Turbulence for wispy vapor effects
      float turbulence(vec2 p) {
        float t = 0.0;
        float amplitude = 1.0;
        float frequency = 1.0;
        
        for (int i = 0; i < 4; i++) {
          t += abs(noise(p * frequency)) * amplitude;
          amplitude *= 0.5;
          frequency *= 2.0;
        }
        
        return t;
      }
      
      void main() {
        vec2 uv = vUv;
        
        // Animated noise for vapor movement
        float timeFlow = time * flowSpeed + layerOffset;
        vec2 noiseUv = uv * noiseScale;
        
        // Create multiple octaves of noise for complexity
        float vapor1 = fbm(noiseUv + vec2(timeFlow, timeFlow * 0.7));
        float vapor2 = fbm(noiseUv * 1.5 + vec2(-timeFlow * 0.8, timeFlow * 1.2));
        float vapor3 = turbulence(noiseUv * 0.8 + vec2(timeFlow * 0.5, -timeFlow * 0.9));
        
        // Combine noise layers for complex vapor patterns
        float vaporNoise = (vapor1 + vapor2 * 0.7 + vapor3 * 0.5) / 2.2;
        
        // Add swirling patterns
        float swirl = sin(uv.x * 6.0 + timeFlow * 2.0) * cos(uv.y * 4.0 + timeFlow * 1.5);
        vaporNoise += swirl * 0.3;
        
        // Create wispy edges
        float edgeFade = smoothstep(0.0, 0.3, vaporNoise) * smoothstep(1.0, 0.7, vaporNoise);
        
        // Radial falloff for natural vapor dispersion
        float dist = length(uv - 0.5);
        float radialFade = smoothstep(0.8, 0.2, dist);
        
        // Phase-based opacity
        float baseOpacity = vaporDensity * edgeFade * radialFade;
        
        // Fade during formation phase
        float formationFade = 1.0 - formationPhase * 0.6;
        
        // Fade during dispersal phase
        float dispersalFade = 1.0 - dispersalPhase;
        
        // Text formation area - create letter-shaped gaps
        float textMask = 1.0;
        if (textPhase > 0.0) {
          // Simple letter masking (would be more complex in real implementation)
          vec2 textUv = (uv - 0.5) * 2.0;
          
          // Create rough letter shapes by masking certain areas
          float letterMask = 0.0;
          
          // C shape
          if (textUv.x < -0.8 && textUv.x > -1.2) {
            letterMask = smoothstep(0.6, 0.4, abs(textUv.y));
          }
          
          // Add more letters...
          textMask = mix(1.0, 1.0 - letterMask, textPhase * 0.8);
        }
        
        float finalOpacity = baseOpacity * formationFade * dispersalFade * textMask;
        
        // Color variations based on density
        vec3 color = mix(vaporColor * 0.6, vaporColor, vaporNoise);
        
        // Add golden glow effect
        float glow = pow(edgeFade, 2.0) * 0.3;
        color += glow * vec3(1.0, 0.8, 0.4);
        
        gl_FragColor = vec4(color, finalOpacity);
      }
    `;
  }
  
  setupLighting() {
    // Ambient mystical lighting
    const ambientLight = new THREE.AmbientLight(0x2F3349, 0.4);
    this.scene.add(ambientLight);
    
    // Warm vapor lighting
    const vaporLight = new THREE.PointLight(0xD4A574, 0.8, 20);
    vaporLight.position.set(0, 2, 2);
    this.scene.add(vaporLight);
  }
  
  startAnimation() {
    this.animationId = requestAnimationFrame(() => this.animate());
  }
  
  animate() {
    const elapsed = performance.now() * 0.001;
    
    // Update timeline
    this.updateTimeline(elapsed);
    
    // Update all vapor materials
    this.vaporMaterials.forEach(material => {
      material.uniforms.time.value = elapsed;
      material.uniforms.formationPhase.value = this.timeline.formationPhase;
      material.uniforms.textPhase.value = this.timeline.textPhase;
      material.uniforms.dispersalPhase.value = this.timeline.dispersalPhase;
    });
    
    // Slight rotation for organic movement
    this.vaporLayers.forEach((layer, index) => {
      layer.rotation.z += 0.001 * (index + 1);
    });
    
    this.renderer.render(this.scene, this.camera);
    this.animationId = requestAnimationFrame(() => this.animate());
  }
  
  updateTimeline(elapsed) {
    // Ultra-gradual animation timeline (10 seconds)
    if (elapsed < 4.0) {
      this.timeline.vaporPhase = Math.min(elapsed / 4.0, 1.0);
    } else if (elapsed < 7.5) {
      const progress = (elapsed - 4.0) / 3.5;
      this.timeline.formationPhase = this.easeInOutQuart(progress);
    } else if (elapsed < 8.5) {
      this.timeline.textPhase = Math.min((elapsed - 7.5) / 1.0, 1.0);
    } else if (elapsed < 10.0) {
      this.timeline.dispersalPhase = Math.min((elapsed - 8.5) / 1.5, 1.0);
    } else {
      this.timeline.dispersalPhase = 1.0;
      this.onComplete();
    }
  }
  
  easeInOutQuart(t) {
    return t < 0.5 ? 8 * t * t * t * t : 1 - Math.pow(-2 * t + 2, 4) / 2;
  }
  
  onComplete() {
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
    }
    
    this.container.style.opacity = '0';
    this.container.style.transition = 'opacity 0.5s ease-out';
    
    setTimeout(() => {
      this.cleanup();
    }, 500);
  }
  
  cleanup() {
    if (this.renderer) {
      this.renderer.dispose();
      this.renderer.domElement.remove();
    }
    
    this.vaporMaterials.forEach(material => material.dispose());
    this.vaporLayers.forEach(layer => {
      if (layer.geometry) layer.geometry.dispose();
    });
    
    const event = new CustomEvent('mysticalLoadingComplete');
    document.dispatchEvent(event);
  }
  
  handleResize() {
    if (this.camera && this.renderer) {
      this.camera.aspect = window.innerWidth / window.innerHeight;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(window.innerWidth, window.innerHeight);
    }
  }
}

// Initialize the vapor loader
export function initVaporLoader(container) {
  const loader = new VaporLoader(container);
  
  window.addEventListener('resize', () => loader.handleResize());
  
  return loader;
}