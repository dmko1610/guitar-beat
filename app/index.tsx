import { Button, StyleSheet, Text, View } from "react-native";
import { observer } from "mobx-react-lite";
import { metronomeStore } from "./stores/metronomeStore";
import Slider from "@react-native-community/slider";

const MetronomeScreen = observer(() => {
  return (
    <View style={styles.container}>
      <Text style={styles.bpmLabel}>BPM: {metronomeStore.bpm}</Text>
      <Slider
        style={{ width: 250, height: 40 }}
        minimumValue={40}
        maximumValue={240}
        value={metronomeStore.bpm}
        onValueChange={(value) => metronomeStore.setBpm(Math.round(value))}
        minimumTrackTintColor="#1FB28A"
        maximumTrackTintColor="#D3D3D3"
      />

      <View style={styles.beatDisplay}>
        {Array.from({ length: metronomeStore.totalBeats }).map((_, idx) => (
          <View
            key={idx}
            style={[
              styles.dot,
              idx === metronomeStore.beat ? styles.dotActive : {}
            ]}
          />
        ))}
      </View>
      <View style={styles.buttonRow}>
        {metronomeStore.isRunning ? (
          <Button title="Stop" onPress={() => metronomeStore.stop()} />
        ) : (
          <Button title="Start" onPress={() => metronomeStore.start()} />
        )}
      </View>
    </View>
  );
});

export default MetronomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#f8f8f8"
  },
  bpmLabel: {
    fontSize: 24,
    marginBottom: 20
  },
  beatDisplay: {
    flexDirection: "row",
    marginVertical: 40,
    gap: 16
  },
  dot: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "#CCC"
  },
  dotActive: {
    backgroundColor: "#1FB28A"
  },
  buttonRow: {
    flexDirection: "row",
    gap: 20
  }
});
