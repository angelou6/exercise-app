import { ThemedIcon, ThemedText, ThemedView } from '@/components/themed';
import { router } from 'expo-router';
import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';

const App = () => {
  return (
    <ThemedView>
      <View style={style.header}>
        <ThemedText type='title'>Exercise App</ThemedText>
        <TouchableOpacity onPress={() => {router.push('/settings')}}>
          <ThemedText>
            <ThemedIcon name='Settings' />
          </ThemedText>
        </TouchableOpacity>
      </View>
    </ThemedView>
  );
};


const style = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
  }
})

export default App;
