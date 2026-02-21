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
   * Configures iOS audio session to allow alarm/alert sounds to play even in silent mode
   */
  async initialize() {
    if (this.isInitialized) return;

    try {
      // Configure audio mode for alert sounds
      // CRITICAL: audioSessionCategory must be set to 'Alarm' for iOS silent mode override to work
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: false,
        interruptionHandlerIOS: null,
        playsInSilentModeIOS: true,
        staysActiveInBackground: false,
        shouldDuckAndroid: true,
      });

      // Set audio session category for iOS (required for playsInSilentModeIOS to work)
      // 'Alarm' category allows sound to play even when device is in silent mode
      try {
        await Audio.setAudioSessionCategoryAsync(
          Audio.AudioSessionCategory.Alarm,
          Audio.AudioSessionCategoryOptions.DuckOthers
        );
      } catch (error) {
        // Fallback: try Playback category if Alarm is not available
        console.warn('Could not set Alarm category, trying Playback:', error);
        await Audio.setAudioSessionCategoryAsync(
          Audio.AudioSessionCategory.Playback,
          Audio.AudioSessionCategoryOptions.None
        );
      }

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
      // Initialize audio first to ensure proper setup
      await this.initialize();

      // Play audio beep - this should be loud and clear
      await this.playBeep();

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
   * Ensures the sound is loud and plays even if device is in silent mode
   */
  async playBeep() {
    let sound = null;
    try {
      // Initialize audio to ensure proper session setup
      await this.initialize();

      // Create sound from asset file
      sound = new Audio.Sound();
      await sound.loadAsync(require('../../assets/sounds/klaxon.mp3'));

      // Set volume to maximum (1.0 = 100%)
      await sound.setVolumeAsync(1.0);

      // Play the sound
      const playback = await sound.playAsync();

      // Wait for the sound to finish playing
      if (playback) {
        const status = await sound.getStatusAsync();
        const durationToWait = status.durationMillis
          ? Math.min(status.durationMillis + 200, 5000)
          : 2000;

        await new Promise(resolve => setTimeout(resolve, durationToWait));
      } else {
        // Fallback: wait a reasonable time
        await new Promise(resolve => setTimeout(resolve, 2000));
      }

      // Unload after playing to free memory
      if (sound) {
        await sound.unloadAsync();
      }
    } catch (error) {
      console.error('Error playing klaxon sound:', error);
      // Fallback to haptic if sound file missing or error occurs
      try {
        await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
      } catch (hapticError) {
        console.warn('Haptic feedback also failed:', hapticError);
      }
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
