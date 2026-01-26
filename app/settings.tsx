import { ThemedIcon, ThemedText } from "@/components/themed";
import RadioSelect from "@/components/ui/radio-select";
import { router } from "expo-router";
import { useState } from "react";
import { Pressable, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const App = () => {
  const [theme, setTheme] = useState(0);

  return (
    <SafeAreaView>
      <View style={style.header}>
        <Pressable onPress={() => router.back()}>
          <ThemedIcon name="ArrowLeft" />
        </Pressable>
        <ThemedText type="title">Ajustes</ThemedText>
      </View>
      <View style={style.picker}>
        <ThemedText>Tema</ThemedText>
        <RadioSelect
          options={["System", "light", "dark"]}
          active={theme}
          setActive={setTheme}
        />
      </View>
    </SafeAreaView>
  );
};

const style = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 20,
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  picker: {
    padding: 10,
  },
});

export default App;
