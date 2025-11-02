/**
 * Audio player with integrated pitch shift and tempo control
 * Uses AudioWorklet for real-time processing when available, falls back to playbackRate
 */

import PitchTempoController from './pitch-tempo.js';

class AudioPlayer {
  constructor() {
    this.audioContext = null;
    this.audioElement = null;
    this.sourceNode = null;
    this.pitchTempoController = null;
    this.gainNode = null;
    this.isWorkletSupported = false;
    this.currentPitchShift = 0;
    this.currentTempo = 1.0;
  }
  
  /**
   * Initialize the audio player
   * @param {HTMLAudioElement} audioElement - The audio element to control
   */
  async init(audioElement) {
    this.audioElement = audioElement;
    
    // Create audio context
    this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
    
    // Create source node from audio element
    this.sourceNode = this.audioContext.createMediaElementSource(audioElement);
    
    // Create gain node for volume control
    this.gainNode = this.audioContext.createGain();
    
    // Try to initialize AudioWorklet for pitch/tempo control
    this.pitchTempoController = new PitchTempoController();
    this.isWorkletSupported = await this.pitchTempoController.init(this.audioContext);
    
    // Connect audio graph
    if (this.isWorkletSupported) {
      // Source -> PitchTempo -> Gain -> Destination
      this.sourceNode.connect(this.pitchTempoController.getNode());
      this.pitchTempoController.getNode().connect(this.gainNode);
      this.gainNode.connect(this.audioContext.destination);
      console.log('Using AudioWorklet for pitch/tempo control');
    } else {
      // Fallback: Source -> Gain -> Destination
      this.sourceNode.connect(this.gainNode);
      this.gainNode.connect(this.audioContext.destination);
      console.log('Using playbackRate fallback (no pitch control available)');
    }
    
    return this.isWorkletSupported;
  }
  
  /**
   * Set pitch shift in semitones
   * @param {number} semitones - Pitch shift (-12 to +12)
   */
  setPitchShift(semitones) {
    this.currentPitchShift = semitones;
    
    if (this.isWorkletSupported && this.pitchTempoController) {
      this.pitchTempoController.setSemitones(semitones);
    } else {
      console.warn('Pitch shift not available without AudioWorklet support');
    }
  }
  
  /**
   * Set tempo ratio
   * @param {number} ratio - Tempo ratio (0.5 to 2.0)
   */
  setTempo(ratio) {
    this.currentTempo = ratio;
    
    if (this.isWorkletSupported && this.pitchTempoController) {
      this.pitchTempoController.setTempo(ratio);
    } else {
      // Fallback: use playbackRate (affects both pitch and tempo)
      if (this.audioElement) {
        this.audioElement.playbackRate = ratio;
      }
    }
  }
  
  /**
   * Set volume (0.0 to 1.0)
   * @param {number} volume - Volume level
   */
  setVolume(volume) {
    if (this.gainNode) {
      this.gainNode.gain.value = volume;
    }
  }
  
  /**
   * Play audio
   */
  play() {
    if (this.audioElement) {
      // Resume audio context if suspended (required by some browsers)
      if (this.audioContext && this.audioContext.state === 'suspended') {
        this.audioContext.resume();
      }
      return this.audioElement.play();
    }
  }
  
  /**
   * Pause audio
   */
  pause() {
    if (this.audioElement) {
      this.audioElement.pause();
    }
  }
  
  /**
   * Get current playback time
   */
  getCurrentTime() {
    return this.audioElement ? this.audioElement.currentTime : 0;
  }
  
  /**
   * Set playback time
   * @param {number} time - Time in seconds
   */
  setCurrentTime(time) {
    if (this.audioElement) {
      this.audioElement.currentTime = time;
    }
  }
  
  /**
   * Get duration
   */
  getDuration() {
    return this.audioElement ? this.audioElement.duration : 0;
  }
  
  /**
   * Load a new audio source
   * @param {string} url - URL of the audio file
   */
  load(url) {
    if (this.audioElement) {
      this.audioElement.src = url;
    }
  }
  
  /**
   * Cleanup and disconnect
   */
  destroy() {
    if (this.pitchTempoController) {
      this.pitchTempoController.disconnect();
    }
    if (this.sourceNode) {
      this.sourceNode.disconnect();
    }
    if (this.gainNode) {
      this.gainNode.disconnect();
    }
    if (this.audioContext) {
      this.audioContext.close();
    }
  }
}

export default AudioPlayer;
