import * as Haptics from 'expo-haptics';
import { Audio } from 'expo-audio';

/**
 * Audio Service
 * Handles audio and haptic feedback for cost milestone alerts
 */
class AudioService {
  constructor() {
    this.audioContext = null;
    this.isInitialized = false;
  }

  /**
   * Initialize audio session
   */
  async initialize() {
    if (this.isInitialized) return;

    try {
      // Configure audio mode for alert sounds
      await Audio.setAudioModeAsync({
        playsInSilentModeIOS: true,
        staysActiveInBackground: false,
      });
      this.isInitialized = true;
    } catch (error) {
      console.warn('Audio initialization failed:', error);
    }
  }

  /**
   * Play milestone alert using haptic feedback + audio beep
   * Creates a distinctive pattern with sound and vibration
   */
  async playMilestoneAlert() {
    try {
      // Play audio beep sequence first
      await this.playBeepSequence();

      // Play a distinctive haptic pattern
      // Heavy impact for $100 milestone reached
      await Haptics.notificationAsync(
        Haptics.NotificationFeedbackType.Warning
      );

      // Brief pause
      await new Promise(resolve => setTimeout(resolve, 100));

      // Second lighter pulse
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

      // Brief pause
      await new Promise(resolve => setTimeout(resolve, 100));

      // Final heavy impact
      await Haptics.notificationAsync(
        Haptics.NotificationFeedbackType.Warning
      );
    } catch (error) {
      console.warn('Failed to play alert:', error);
      // Fail silently - don't disrupt the meeting
    }
  }

  /**
   * Play klaxon warning sound
   */
  async playBeepSequence() {
    try {
      await this.initialize();

      // Play single klaxon warning sound
      await this.playBeep();
    } catch (error) {
      console.warn('Failed to play klaxon:', error);
    }
  }

  /**
   * Play klaxon warning sound
   */
  async playBeep(frequency, duration) {
    try {
      // Play the klaxon sound file
      const { sound } = await Audio.Sound.createAsync(
        require('../../assets/sounds/klaxon.mp3')
      );
      await sound.playAsync();

      // Unload after playing to free memory
      await sound.unloadAsync();
    } catch (error) {
      console.warn('Klaxon sound not available, using haptic fallback:', error);
      // Fallback to haptic if sound file missing
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    }
  }

  /**
   * Cleanup (no-op for haptics only)
   */
  async cleanup() {
    // Haptics don't require cleanup
  }
}

export default new AudioService();
