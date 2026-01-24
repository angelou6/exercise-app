import { ThemedButton, ThemedIcon, ThemedInput, ThemedText, ThemedView } from '@/components/themed';
import { createExercise } from '@/utils/database';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { Pressable, StyleSheet, TextInputChangeEvent, View } from 'react-native';

const App = () => {
  const [name, setName] = useState('');
  const [desc, setDesc] = useState('');

  const handleChange = (
      e: TextInputChangeEvent, 
      setState: React.Dispatch<React.SetStateAction<string>>) => {
    setState(e.nativeEvent.text);
  }

  return (
    <ThemedView style={styles.container}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()}>
          <ThemedIcon name='ArrowLeft' />
        </Pressable>
        <ThemedText type='title'>Create Exercise</ThemedText>
      </View>
      <View style={styles.form}>
        <View style={styles.formGroup}>
          <ThemedText style={styles.label}>Exercise Name</ThemedText>
          <ThemedInput 
            value={name}
            onChange={(e) => handleChange(e, setName)}
            style={styles.input} 
            placeholder='Enter exercise name'/>
        </View>
        <View style={styles.formGroup}>
          <ThemedText style={styles.label}>Description</ThemedText>
          <ThemedInput 
            value={desc}
            onChange={(e) => handleChange(e, setDesc)}
            style={[styles.input, styles.textArea]} 
            placeholder='Enter exercise description' 
            multiline 
          />
        </View>
      </View>
      <ThemedButton 
        icon='Check'
        onPress={() => {
          createExercise(name, desc);
          router.back();
        }} 
        style={styles.addButton}
      />
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    marginBottom: 20,
    gap: 20,
  },

  form: {
    paddingHorizontal: 20,
    gap: 24,
  },

  formGroup: {
    gap: 8,
  },

  label: {
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 4,
  },

  input: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
  },

  textArea: {
    minHeight: 100,
    paddingTop: 12,
    textAlignVertical: 'top',
  },

  addButton: {
    position: 'absolute',
    borderRadius: 50,
    padding: 20,
    bottom: 50,
    right: 30,
  }
})

export default App;