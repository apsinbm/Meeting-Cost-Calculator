import React, { useEffect, useRef, useState } from 'react';
import { StyleSheet, Animated } from 'react-native';
import { Colors } from '../constants';

/**
 * Full-screen flash animation for $100 cost milestones
 * Animates: white -> red -> white -> red -> white (5 flashes, slightly shorter)
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
    const flashDuration = 150;
    const gapDuration = 50;

    const performFlash = (flashNumber) => {
      if (flashNumber >= 5) {
        if (onComplete) {
          onComplete();
        }
        return;
      }

      setColorIndex(flashNumber);

      Animated.timing(opacity, {
        toValue: 1,
        duration: 50,
        useNativeDriver: true,
      }).start(() => {
        setTimeout(() => {
          Animated.timing(opacity, {
            toValue: 0,
            duration: 50,
            useNativeDriver: true,
          }).start(() => {
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
