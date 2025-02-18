import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

class VirtualTourService {
  constructor() {
    this.scene = null;
    this.camera = null;
    this.renderer = null;
    this.controls = null;
    this.panorama = null;
  }

  initialize(container) {
    // Create scene
    this.scene = new THREE.Scene();

    // Setup camera
    this.camera = new THREE.PerspectiveCamera(
      75,
      container.clientWidth / container.clientHeight,
      0.1,
      1000
    );
    this.camera.position.set(0, 0, 0.1);

    // Setup renderer
    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.renderer.setSize(container.clientWidth, container.clientHeight);
    container.appendChild(this.renderer.domElement);

    // Setup controls
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enableZoom = false;
    this.controls.enablePan = false;
    this.controls.rotateSpeed = -0.5;

    // Handle window resize
    window.addEventListener('resize', () => this.handleResize(container));
  }

  loadPanorama(imageUrl) {
    return new Promise((resolve, reject) => {
      // Load panoramic image
      new THREE.TextureLoader().load(
        imageUrl,
        (texture) => {
          // Create sphere geometry
          const geometry = new THREE.SphereGeometry(500, 60, 40);
          geometry.scale(-1, 1, 1);

          // Create material with loaded texture
          const material = new THREE.MeshBasicMaterial({
            map: texture
          });

          // Create and add panorama mesh
          this.panorama = new THREE.Mesh(geometry, material);
          this.scene.add(this.panorama);

          resolve();
        },
        undefined,
        (error) => reject(error)
      );
    });
  }

  handleResize(container) {
    if (!this.camera || !this.renderer) return;

    this.camera.aspect = container.clientWidth / container.clientHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(container.clientWidth, container.clientHeight);
  }

  animate() {
    if (!this.renderer || !this.scene || !this.camera) return;

    requestAnimationFrame(() => this.animate());
    this.controls.update();
    this.renderer.render(this.scene, this.camera);
  }

  dispose() {
    if (this.scene) {
      this.scene.traverse((object) => {
        if (object.geometry) object.geometry.dispose();
        if (object.material) {
          if (object.material.map) object.material.map.dispose();
          object.material.dispose();
        }
      });
    }

    if (this.renderer) {
      this.renderer.dispose();
      this.renderer.domElement.remove();
    }

    window.removeEventListener('resize', this.handleResize);
  }
}

export default new VirtualTourService();