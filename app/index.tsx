import { observer } from "mobx-react-lite";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { breathingStore } from "./stores/breathingStore";
import BreathingAnimation from "./BreathingAnimation";

const MainScreen = observer(() => {
  const handlePress = () => {
    if (breathingStore.isRunning) {
      breathingStore.stop();
    } else {
      breathingStore.start();
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Just Breathe</Text>
      <BreathingAnimation />
      <Pressable
        style={[
          styles.button,
          { backgroundColor: breathingStore.isRunning ? "#E57373" : "#81C784" }
        ]}
        onPress={handlePress}
      >
        <Text style={styles.buttonText}>
          {breathingStore.isRunning ? "Stop" : "Start"}
        </Text>
      </Pressable>
    </View>
  );
});

export default MainScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#E8F5E9"
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    marginBottom: 40,
    color: "#2E7D32"
  },
  button: {
    marginTop: 40,
    marginBottom: 60,
    paddingVertical: 14,
    paddingHorizontal: 40,
    borderRadius: 30,
    elevation: 2
  },
  buttonText: { fontSize: 20, fontWeight: "600", color: "#FFF" }
});
