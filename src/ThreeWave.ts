import { html, css, LitElement, PropertyValueMap } from 'lit';
import { property } from 'lit/decorators.js';
import * as THREE from "three"

export class ThreeWave extends LitElement {
  static styles = css`
    :host {
      display: block;
      padding: 25px;
      color: var(--three-wave-text-color, #000);
    }
  `;

  @property({ type: String }) title = 'Hey there';

  @property({ type: Number }) counter = 5;

  __increment() {
    this.counter += 1;
  }

  firstUpdated(){ 
    
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

    const renderer = new THREE.WebGLRenderer();
    renderer.setSize( window.innerWidth, window.innerHeight );
    document.body.appendChild( renderer.domElement );

    // Create the waveform geometry
    const waveform = new Float32Array(1024);
    for (let i = 0; i < waveform.length; i += 2) {
      waveform[i] = i - 10;
      waveform[i+1] = Math.sin(i/100);
    }

    console.log(JSON.stringify(waveform));

    const geometry = new THREE.BufferGeometry()
    // .setFromPoints(waveform);
    geometry.setAttribute( 'position', new THREE.BufferAttribute( waveform, 2 ) );

    // Create the waveform material
    const material = new THREE.LineBasicMaterial( { color: 0xff0000 } );

    // Create the waveform line
    const line = new THREE.Line( geometry, material );
    scene.add( line );

    camera.position.z = 5;

    // Render the scene
    function animate() {
    requestAnimationFrame( animate );
    renderer.render( scene, camera );
    }
    animate();

}

  render() {
    return html`
      <h2>${this.title} Nr. ${this.counter}!</h2>
      <button @click=${this.__increment}>increment</button>
    `;
  }
}
