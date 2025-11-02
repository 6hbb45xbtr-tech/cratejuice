/**
 * Wrapper for SoundTouch WASM initialization and AudioWorklet management
 * Provides a simple API for pitch shift and tempo control
 */

class PitchTempoController {
  constructor() {
    this.audioContext = null;
    this.workletNode = null;
    this.isSupported = false;
    this.isInitialized = false;
  }
  
  /**
   * Check if AudioWorklet and required features are supported
   */
  static isSupported() {
    return typeof AudioContext !== 'undefined' && 
           typeof AudioWorkletNode !== 'undefined';
  }
  
  /**
   * Initialize the WASM module and register the AudioWorklet
   * @param {AudioContext} audioContext - The Web Audio API context
   */
  async init(audioContext) {
    if (!PitchTempoController.isSupported()) {
      console.warn('AudioWorklet not supported, falling back to playbackRate');
      this.isSupported = false;
      return false;
    }
    
    this.audioContext = audioContext;
    this.isSupported = true;
    
    try {
      // Register the AudioWorklet processor
      await audioContext.audioWorklet.addModule('/src/worklets/soundtouch-processor.js');
      
      // Create the worklet node
      this.workletNode = new AudioWorkletNode(audioContext, 'soundtouch-processor');
      
      // Wait for initialization confirmation
      await new Promise((resolve) => {
        this.workletNode.port.onmessage = (event) => {
          if (event.data.type === 'initialized') {
            resolve();
          }
        };
        
        // Send init message
        this.workletNode.port.postMessage({ type: 'init', value: {} });
      });
      
      this.isInitialized = true;
      console.log('SoundTouch AudioWorklet initialized successfully');
      return true;
      
    } catch (error) {
      console.error('Failed to initialize AudioWorklet:', error);
      this.isSupported = false;
      this.isInitialized = false;
      return false;
    }
  }
  
  /**
   * Get the AudioWorklet node to insert into the audio graph
   */
  getNode() {
    return this.workletNode;
  }
  
  /**
   * Set pitch shift in semitones
   * @param {number} semitones - Pitch shift in semitones (-12 to +12)
   */
  setSemitones(semitones) {
    if (!this.isInitialized) {
      console.warn('PitchTempoController not initialized');
      return;
    }
    
    this.workletNode.port.postMessage({
      type: 'setPitch',
      value: semitones
    });
  }
  
  /**
   * Set tempo ratio
   * @param {number} ratio - Tempo ratio (0.5 to 2.0, where 1.0 is original tempo)
   */
  setTempo(ratio) {
    if (!this.isInitialized) {
      console.warn('PitchTempoController not initialized');
      return;
    }
    
    this.workletNode.port.postMessage({
      type: 'setTempo',
      value: ratio
    });
  }
  
  /**
   * Disconnect and cleanup
   */
  disconnect() {
    if (this.workletNode) {
      this.workletNode.disconnect();
      this.workletNode = null;
    }
    this.isInitialized = false;
  }
}

export default PitchTempoController;
