import * as THREE from "three"

export class SampleUpdater{

    getBufferStartLine() {
      
        const fa = new Float32Array(6);
        fa[0] = this.sampleNumber;
        fa[1] = -40;
        fa[2] = 0;
        fa[3] = this.sampleNumber;
        fa[4] = 40;
        fa[5] = 0;

        return fa;


    }

    sampleNumber: number = 0;

    lastBufferSample: number = 0;

    getNextVerticies(sampleBuffer: number[]){

        const waveform = [];
        for (let i = 0; i < sampleBuffer.length; i += 1) {
        const x = (i + this.sampleNumber);
        const y = sampleBuffer[i];
        waveform.push(new THREE.Vector3(x,y,0));
        }

        waveform.unshift(new THREE.Vector3(this.sampleNumber - 1,this.lastBufferSample,0));

        this.sampleNumber += sampleBuffer.length;
        this.lastBufferSample = sampleBuffer[sampleBuffer.length-1];

        return waveform;

    }

}