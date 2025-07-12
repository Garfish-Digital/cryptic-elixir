// Subtle Mystical Vapor Loading System
// Elegant, realistic vapor effects - no flashy 80s effects

import * as THREE from 'three';

export class SubtleVaporLoader {
  constructor(container) {
    this.container = container;
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    this.renderer = new THREE.WebGLRenderer({ 
      antialias: true, 
      alpha: true,
      powerPreference: "high-performance"
    });
    
    // Simple timeline
    this.timeline = {
      vaporPhase: 0,
      formationPhase: 0,
      textPhase: 0,
      dispersalPhase: 0
    };
    
    // Single vapor plane
    this.vaporPlane = null;
    this.vaporMaterial = null;
    
    this.init();
  }
  
  init() {
    this.setupRenderer();
    this.setupCamera();
    this.createVapor();
    this.startAnimation();
  }
  
  setupRenderer() {
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.setClearColor(0x1E1B2E, 1);
    this.container.appendChild(this.renderer.domElement);
  }
  
  setupCamera() {
    this.camera.position.set(0, 0, 3);
    this.camera.lookAt(0, 0, 0);
  }
  
  createVapor() {
    // Simple plane geometry
    const geometry = new THREE.PlaneGeometry(8, 6);
    
    // Subtle vapor material
    this.vaporMaterial = new THREE.ShaderMaterial({
      uniforms: {
        time: { value: 0 },
        formationPhase: { value: 0 },
        textPhase: { value: 0 },
        dispersalPhase: { value: 0 }
      },
      vertexShader: this.getVertexShader(),
      fragmentShader: this.getFragmentShader(),
      transparent: true,
      blending: THREE.NormalBlending,
      depthWrite: false
    });
    
    this.vaporPlane = new THREE.Mesh(geometry, this.vaporMaterial);
    this.scene.add(this.vaporPlane);
  }
  
  getVertexShader() {
    return `
      varying vec2 vUv;
      
      void main() {
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `;
  }
  
  getFragmentShader() {
    return `
      varying vec2 vUv;
      
      uniform float time;
      uniform float formationPhase;
      uniform float textPhase;
      uniform float dispersalPhase;
      
      // Simple noise function
      float noise(vec2 p) {
        return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453);
      }
      
      // Fractal noise for vapor
      float fbm(vec2 p) {
        float value = 0.0;
        float amplitude = 0.5;
        
        for (int i = 0; i < 3; i++) {
          value += amplitude * noise(p);
          p *= 2.0;
          amplitude *= 0.5;
        }
        
        return value;
      }
      
      void main() {
        vec2 uv = vUv;
        
        // Very gentle movement - barely perceptible
        float slowTime = time * 0.02;
        vec2 offset = vec2(slowTime * 0.1, slowTime * 0.05);
        
        // Subtle noise pattern
        float vapor = fbm(uv * 2.0 + offset);
        vapor += fbm(uv * 4.0 - offset * 0.5) * 0.5;
        
        // Soft, diffuse edges
        float mask = smoothstep(0.0, 0.4, vapor) * smoothstep(1.0, 0.6, vapor);
        
        // Radial fade from center
        float dist = length(uv - 0.5);
        float radialFade = smoothstep(0.7, 0.1, dist);
        
        // Very subtle opacity
        float baseOpacity = 0.08 * mask * radialFade;
        
        // Phase transitions
        float vaporOpacity = baseOpacity * (1.0 - formationPhase * 0.5);
        vaporOpacity *= (1.0 - dispersalPhase);
        
        // Extremely subtle golden tint
        vec3 color = vec3(0.85, 0.82, 0.75); // Very pale warm white
        
        // Add barely visible text formation
        if (textPhase > 0.0) {
          // Simple letter shapes as darker areas
          vec2 textUv = (uv - 0.5) * 1.5;
          
          // Basic letter outlines
          float letters = 0.0;
          
          // C
          if (abs(textUv.x + 0.4) < 0.1 && abs(textUv.y) < 0.15) {
            letters = 1.0;
          }
          // R
          if (abs(textUv.x + 0.1) < 0.1 && abs(textUv.y) < 0.15) {
            letters = 1.0;
          }
          // Y
          if (abs(textUv.x + 0.2) < 0.1 && abs(textUv.y) < 0.15) {
            letters = 1.0;
          }
          
          // Fade vapor in letter areas
          vaporOpacity *= mix(1.0, 0.3, letters * textPhase);
        }
        
        gl_FragColor = vec4(color, vaporOpacity);
      }
    `;
  }
  
  startAnimation() {
    this.animationId = requestAnimationFrame(() => this.animate());
  }
  
  animate() {
    const elapsed = performance.now() * 0.001;
    
    this.updateTimeline(elapsed);
    
    if (this.vaporMaterial) {
      this.vaporMaterial.uniforms.time.value = elapsed;
      this.vaporMaterial.uniforms.formationPhase.value = this.timeline.formationPhase;
      this.vaporMaterial.uniforms.textPhase.value = this.timeline.textPhase;
      this.vaporMaterial.uniforms.dispersalPhase.value = this.timeline.dispersalPhase;
    }
    
    this.renderer.render(this.scene, this.camera);
    this.animationId = requestAnimationFrame(() => this.animate());
  }
  
  updateTimeline(elapsed) {
    // Same timeline as before
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
    
    if (this.vaporMaterial) {
      this.vaporMaterial.dispose();
    }
    
    if (this.vaporPlane && this.vaporPlane.geometry) {
      this.vaporPlane.geometry.dispose();
    }
    
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

// Initialize the subtle vapor loader
export function initSubtleVaporLoader(container) {
  const loader = new SubtleVaporLoader(container);
  
  window.addEventListener('resize', () => loader.handleResize());
  
  return loader;
}