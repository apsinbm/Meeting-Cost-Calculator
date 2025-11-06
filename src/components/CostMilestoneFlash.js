import React, { useEffect, useRef, useState } from 'react';
import { View, StyleSheet, Animated } from 'react-native';
import { Colors } from '../constants';

/**
 * Full-screen flash animation for $1000 cost milestones
 * Animates: white -> red -> white -> red in quick succession
 */
const CostMilestoneFlash = ({ visible, onComplete }) => {
  const opacity = useRef(new Animated.Value(0)).current;
  const [colorIndex, setColorIndex] = useState(0);

  useEffect(() => {
    if (visible) {
      setColorIndex(0);
      startFlashSequence();
    }
  }, [visible]);

  const startFlashSequence = () => {
    // Total sequence: 7 flashes (white, red, white, red, white, red, white)
    // Each flash: 150ms visible, 50ms gap = 200ms per flash
    // Total duration: ~1400ms

    const flashDuration = 150;
    const gapDuration = 50;

    const performFlash = (flashNumber) => {
      if (flashNumber >= 7) {
        // Sequence complete
        if (onComplete) {
          onComplete();
        }
        return;
      }

      setColorIndex(flashNumber);

      // Fade in
      Animated.timing(opacity, {
        toValue: 1,
        duration: 50,
        useNativeDriver: true,
      }).start(() => {
        // Hold briefly
        setTimeout(() => {
          // Fade out
          Animated.timing(opacity, {
            toValue: 0,
            duration: 50,
            useNativeDriver: true,
          }).start(() => {
            // Gap before next flash
            setTimeout(() => {
              performFlash(flashNumber + 1);
            }, gapDuration);
          });
        }, flashDuration - 100);
      });
    };

    performFlash(0);
  };

  if (!visible) {
    return null;
  }

  // Alternate between white and red
  const backgroundColor = colorIndex % 2 === 0 ? Colors.white : Colors.error;

  return (
    <Animated.View
      style={[
        styles.overlay,
        {
          backgroundColor,
          opacity,
        },
      ]}
      pointerEvents="none"
    />
  );
};

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 9999,
  },
});

export default CostMilestoneFlash;
