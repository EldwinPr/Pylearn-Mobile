import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, useWindowDimensions } from 'react-native';
import { router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import NavHeader from '../../../components/NavHeader';
import { FontAwesome5 } from '@expo/vector-icons';

export default function LatihanScreen() {
  const { width } = useWindowDimensions();

  const handleExercisePress = (route: string) => {
    router.push(route as any);
  };

  const exercises = [
    {
      title: 'Fill in The Blanks',
      icon: 'pencil-alt',
      route: '/latihan/fill',
      description: 'Latihan mengisi bagian yang kosong',
      color: '#4CAF50'
    },
    {
      title: 'Drag and Drop',
      icon: 'arrows-alt',
      route: '/latihan/drag',
      description: 'Latihan menyusun kode',
      color: '#2196F3'
    },
    {
      title: 'Multiple Choice',
      icon: 'list',
      route: '/latihan/multiplechoice',
      description: 'Latihan pilihan ganda',
      color: '#9C27B0'
    },
    {
      title: 'Skor',
      icon: 'star',
      route: '/latihan/score',
      description: 'Lihat pencapaianmu',
      color: '#FF9800'
    }
  ];

  return (
    <ScrollView style={styles.container}>
      <NavHeader />
      <View style={styles.content}>
        <View style={styles.card}>
          <Text style={styles.title}>Pilih Jenis Latihan</Text>
          <Text style={styles.subtitle}>
            Silakan pilih jenis latihan yang ingin kamu kerjakan
          </Text>

          <View style={styles.exerciseGrid}>
            {exercises.map((exercise, index) => (
              <TouchableOpacity
                key={index}
                style={[styles.exerciseButton, { backgroundColor: exercise.color }]}
                onPress={() => handleExercisePress(exercise.route)}
              >
                <FontAwesome5 
                  name={exercise.icon}
                  size={32}
                  color="white"
                  style={styles.icon}
                />
                <Text style={styles.buttonText}>{exercise.title}</Text>
                <Text style={styles.buttonDescription}>{exercise.description}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f2f5',
  },
  content: {
    padding: 20,
    alignItems: 'center',
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    width: '100%',
    maxWidth: 1000,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#3670a1',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 20,
    textAlign: 'center',
  },
  exerciseGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 20,
    justifyContent: 'center',
  },
  exerciseButton: {
    borderRadius: 12,
    padding: 24,
    width: 280,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 180,
  },
  icon: {
    marginBottom: 16,
  },
  buttonText: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
  },
  buttonDescription: {
    color: 'rgba(255, 255, 255, 0.9)',
    fontSize: 15,
    textAlign: 'center',
    lineHeight: 20,
  }
});