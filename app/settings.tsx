import { ThemedIcon, ThemedText, ThemedView } from '@/components/themed';
import RadioSelect from '@/components/ui/radio-select';
import { router } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';

const App = () => {
  const [theme, setTheme] = useState(0);

  return (
    <ThemedView>
      <View style={style.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <ThemedIcon name="ArrowLeft" />
        </TouchableOpacity>
        <ThemedText type='title'>Ajustes</ThemedText>
      </View>
      <View style={style.picker}>
        <ThemedText>Tema</ThemedText>
        <RadioSelect options={["System", "light", "dark"]} active={theme} setActive={setTheme} />
      </View>
    </ThemedView>
  );
};

const style = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 20,
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  picker: {
    padding: 10
  }
})

export default App;
