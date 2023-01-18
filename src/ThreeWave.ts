import { html, css, LitElement, PropertyValueMap } from 'lit';
import { property } from 'lit/decorators.js';
import * as THREE from "three"
import { SampleUpdater } from './samples/SampleUpdater';

function getSine(sampleNumber: number, sampleRate: number, sineRate: number){
  return Math.sin(2*Math.PI*sineRate/sampleRate*sampleNumber);
};

function logCameraMetrics(camera: THREE.PerspectiveCamera, 
        cameraZpos: number, 
        samplesPerBuffer: number,
        bufferDuration: number){
  const aspectRatio = camera.aspect;
  console.log(`The aspect ratio of the camera is ${aspectRatio}`);

  const verticalFov = camera.fov * Math.PI /180;
  console.log(`The cameras fov is ${ verticalFov } while camera fov property is ${camera.fov}`);

  const horizontalFov = 2 * Math.atan(Math.tan(verticalFov / 2) * aspectRatio);
  console.log(`The horizontal fov is ${horizontalFov}.`);

  const distance = cameraZpos;
  const width = 2 * distance * Math.tan(horizontalFov / 2);
  const height = 2 * distance * Math.tan(verticalFov / 2);

  console.log(`The camera FOV allows ${width} pixels in width and ${height} pixels in height`)
  
  const numberOfBuffersDisplayed = width / samplesPerBuffer;
  
  console.log(`When buffer start lines are active, that's approx ${numberOfBuffersDisplayed} lines.`)

  const totalTimeInViewForSampleRate = numberOfBuffersDisplayed * bufferDuration;

  console.log(`As there are ${numberOfBuffersDisplayed} lines, that's a total time of ${totalTimeInViewForSampleRate / 1000} seconds.`)

  const scrollRateInPixels = width / (totalTimeInViewForSampleRate / 1000);

  console.log(`Therefor scroll rate is ${scrollRateInPixels} pixels per second.`);

}

export class ThreeWave extends LitElement {
  static styles = css`
    :host {
      display: flex;
      height: 100px;
      width: 100%;
      color: var(--three-wave-text-color, #000);
      max-width: 500px;
      max-height: 300px;
      box-shadow: 1px 2px 15px -9px;
      border-radius: 3px;
      border: #28231d 1px solid;
    }
  `;

  @property({type: Number}) 
  backgroundColour: number = 0xFFFFFF;

  sampleUpdater: SampleUpdater = new SampleUpdater();

  scene?: THREE.Scene;

  updateBuffer(samples: number[]){
    
      // Create the waveform geometry
    const waveform = this.sampleUpdater.getNextVerticies(samples);

    const geometry = new THREE.BufferGeometry()
          .setFromPoints(waveform);
    
    // Create the waveform material
    const material = new THREE.LineBasicMaterial( { color: 0xff0000 } );

    // Create the waveform line
    const line = new THREE.Line( geometry, material );
    
    const bsl = this.sampleUpdater.getBufferStartLine();
    const startLineGeo = new THREE.BufferGeometry();
      startLineGeo.setAttribute("position", new THREE.BufferAttribute(bsl, 3));
    const bufferStartLine = new THREE.Line(startLineGeo, material );

    this.scene!.add( line, bufferStartLine );

  };

  @property()
  cameraZpos: number = 50;

  firstUpdated(){ 

    const bitDepth = 4; // 16 values
    const sampleRate = 200 // samples per second (need to get this update 44.1k)
    const intervalPeriodms = 100;
    const bufferSize = sampleRate*intervalPeriodms/1000;
    const sineFrequency = 1;
    
    let packetNumber = 0;

    console.log(`For a ${  intervalPeriodms  } ms period at a sample rate of ${  sampleRate
        }, ${  bufferSize  } samples are needed for each buffer.`)

    setInterval(()=>{

        const samples = [];
        for(let i = 0; i < bufferSize; i+=1){
            const value = getSine(i + packetNumber*bufferSize, sampleRate, sineFrequency);
            const scaledByBitDepth = bitDepth**2 * value;
            samples.push(scaledByBitDepth);
        }
        packetNumber += 1;

        this.updateBuffer(samples);

    }, intervalPeriodms);
    
    const width = this.shadowRoot?.host.getBoundingClientRect().width ?? 400;
    const height = this.shadowRoot?.host.getBoundingClientRect().height ?? 100;

    const scene = new THREE.Scene();
    this.scene = scene;
    const camera = new THREE.PerspectiveCamera( 75, width / height, 0.1, 1000 );

    logCameraMetrics(camera, this.cameraZpos, bufferSize, intervalPeriodms);

    const renderer = new THREE.WebGLRenderer();
    renderer.setSize( width, height );
    this.shadowRoot?.appendChild( renderer.domElement );

    const bgColor = new THREE.Color(this.backgroundColour);
    renderer.setClearColor(bgColor);
 
    camera.position.z = this.cameraZpos;
    camera.position.x = -330;  // needs to be a function of display

    let previousTime = 0;
    // Render the scene
    function animate( time: number ) {
      const delta = time - previousTime;
      previousTime = time;
      // - screen size 
      camera.position.x+= sampleRate / 1000 * delta;
      requestAnimationFrame( animate );
      renderer.render(scene, camera );
    }
    requestAnimationFrame( animate );

}

  render() {
    return html`
    
    `;
  }
}
