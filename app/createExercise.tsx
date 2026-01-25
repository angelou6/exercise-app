import { ThemedButton, ThemedIcon, ThemedInput, ThemedText } from '@/components/themed';
import { createExercise, deleteExercise, updateExercise } from '@/utils/database';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const App = () => {
  const { exId, exName, exDesc } = useLocalSearchParams();

  const [name, setName] = useState(exName?.toString() || '');
  const [desc, setDesc] = useState(exDesc?.toString() || '');
  const [isEdit, _] = useState(!!exId);

  const handleSubmit = () => {
    if (!isEdit) {
      createExercise(name, desc)
    } else {
      if (!exId) return;
      updateExercise(parseInt(Array.isArray(exId) ? exId[0] : exId), name, desc);
    }
    router.back()
  }

  const handleDelete = () => {
    deleteExercise(parseInt(Array.isArray(exId) ? exId[0] : exId));
    router.back()
  }

  return (
    <SafeAreaView style={styles.container}>
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
            onChangeText={setName}
            style={styles.input} 
            placeholder='Enter exercise name'/>
        </View>
        <View style={styles.formGroup}>
          <ThemedText style={styles.label}>Description</ThemedText>
          <ThemedInput 
            value={desc}
            onChangeText={setDesc}
            style={[styles.input, styles.textArea]} 
            placeholder='Enter exercise description' 
            multiline 
          />
        </View>
        <ThemedButton 
          onPress={() => handleSubmit()} 
        >
          <Text>{isEdit ? "Update Exercise" : "Add Exercise"}</Text>
        </ThemedButton>
        <ThemedButton onPress={() => handleDelete()} style={styles.deleteButton}>
          <ThemedText>Delete Execise</ThemedText>
        </ThemedButton>
      </View>
    </SafeAreaView>
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

  deleteButton: {
    backgroundColor: 'transparent',
  }
})

export default App;