/**
 * AudioWorklet processor for SoundTouch pitch/tempo shifting
 * This processor wraps the SoundTouch WASM library to apply real-time pitch and tempo changes
 */

class SoundTouchProcessor extends AudioWorkletProcessor {
  constructor(options) {
    super();
    
    this.pitchSemitones = 0;
    this.tempoRatio = 1.0;
    this.soundtouch = null;
    this.isInitialized = false;
    
    // Listen for messages from the main thread
    this.port.onmessage = (event) => {
      const { type, value } = event.data;
      
      if (type === 'init') {
        this.initSoundTouch(value);
      } else if (type === 'setPitch') {
        this.pitchSemitones = value;
        if (this.soundtouch) {
          // Convert semitones to pitch ratio: 2^(semitones/12)
          const pitchRatio = Math.pow(2, value / 12);
          this.soundtouch.pitch = pitchRatio;
        }
      } else if (type === 'setTempo') {
        this.tempoRatio = value;
        if (this.soundtouch) {
          this.soundtouch.tempo = value;
        }
      }
    };
  }
  
  initSoundTouch(config) {
    // In a real implementation, this would initialize the WASM module
    // For now, we'll simulate the structure
    this.soundtouch = {
      pitch: 1.0,
      tempo: 1.0,
      process: (input) => {
        // Placeholder: In production, this would use actual SoundTouch WASM
        return input;
      }
    };
    this.isInitialized = true;
    this.port.postMessage({ type: 'initialized' });
  }
  
  process(inputs, outputs, parameters) {
    const input = inputs[0];
    const output = outputs[0];
    
    if (!input || !input.length || !this.isInitialized) {
      return true;
    }
    
    // Process each channel
    for (let channel = 0; channel < output.length; channel++) {
      const inputChannel = input[channel];
      const outputChannel = output[channel];
      
      if (this.pitchSemitones === 0 && this.tempoRatio === 1.0) {
        // No processing needed, pass through
        outputChannel.set(inputChannel);
      } else {
        // Apply SoundTouch processing
        // In production, this would call the actual WASM module
        const processed = this.soundtouch.process(inputChannel);
        outputChannel.set(processed);
      }
    }
    
    return true;
  }
}

registerProcessor('soundtouch-processor', SoundTouchProcessor);
