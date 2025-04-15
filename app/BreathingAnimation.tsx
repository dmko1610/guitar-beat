import { observer } from "mobx-react-lite";
import {
  Animated,
  Dimensions,
  Easing,
  StyleSheet,
  Text,
  View
} from "react-native";
import { breathingStore, Phase } from "./stores/breathingStore";
import { useEffect, useRef } from "react";
import * as Haptics from 'expo-haptics'

const { width } = Dimensions.get("window");

const BreathingAnimation = observer(() => {
  const scale = useRef(new Animated.Value(0.5)).current;

  const pulseScale = useRef(new Animated.Value(1.5)).current;
  const pulseOpacity = useRef(new Animated.Value(0.4)).current;

  const isStopping = useRef(false);

  const animatePhase = (phase: Phase) => {
    let toValue = 0.5;
    let duration =
      breathingStore.duration[phase as Exclude<Phase, "ready">] * 1000;

    if (phase === "inhale") toValue = 1.5;
    else if (phase === "hold") toValue = 1.5;
    else if (phase === "exhale") toValue = 0.5;

    Animated.timing(scale, {
      toValue,
      duration,
      easing: phase === "hold" ? Easing.linear : Easing.inOut(Easing.ease),
      useNativeDriver: true
    }).start();
  };

  useEffect(() => {
    const pulse = Animated.loop(
      Animated.parallel([
        Animated.sequence([
          Animated.timing(pulseScale, {
            toValue: 1.8,
            duration: 2000,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true
          }),
          Animated.timing(pulseScale, {
            toValue: 1,
            duration: 2000,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true
          })
        ]),
        Animated.sequence([
          Animated.timing(pulseOpacity, {
            toValue: 0,
            duration: 2000,
            useNativeDriver: true
          }),
          Animated.timing(pulseOpacity, {
            toValue: 0.4,
            duration: 2000,
            useNativeDriver: true
          })
        ])
      ])
    );

    pulse.start();

    return () => pulse.stop();
  }, []);

  useEffect(() => {
    if (breathingStore.phase === "ready") {
      isStopping.current = false;
      scale.setValue(0.5);
      return;
    }
    if (!breathingStore.isRunning && !isStopping.current) {
      isStopping.current = true;

      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);

      Animated.timing(scale, {
        toValue: 0.5,
        duration: 500,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true
      }).start(() => {
        breathingStore.resetPhase();
      });

      return;
    }

    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    animatePhase(breathingStore.phase);
  }, [breathingStore.phase, breathingStore.isRunning]);

  return (
    <View style={styles.container}>
      <Animated.View
        style={[
          styles.pulseCircle,
          { transform: [{ scale: pulseScale }], opacity: pulseOpacity }
        ]}
      />
      <Animated.View style={[styles.animation, { transform: [{ scale }] }]} />
      <Text style={styles.text}>
        {breathingStore.phase === "ready"
          ? "Get Ready"
          : breathingStore.phase.toUpperCase()}
      </Text>
    </View>
  );
});

export default BreathingAnimation;

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    flex: 1
  },
  animation: {
    position: "absolute",
    width: width * 0.6,
    height: width * 0.6,
    backgroundColor: "#66BB6A",
    borderRadius: 999,
    shadowColor: "#66BB6A",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10
  },
  text: {
    position: "absolute",
    fontSize: 28,
    fontWeight: "600",
    color: "#2E7D32",
    letterSpacing: 2,
    marginTop: 80
  },
  pulseCircle: {
    position: "absolute",
    width: width * 0.7,
    height: width * 0.7,
    borderRadius: 999,
    backgroundColor: "#66BB6A",
    opacity: 0.4
  }
});
