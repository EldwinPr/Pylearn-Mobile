import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import NavHeader from '../../components/NavHeader';
import { config } from 'src/config/api';
import { FontAwesome } from '@expo/vector-icons';

export default function LatihanScreen() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const window = Dimensions.get('window');
  const isMobile = window.width < 768;

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      setIsLoggedIn(!!token);
    } catch (error) {
      console.error('Error checking auth:', error);
      setIsLoggedIn(false);
    }
  };

  const handleExercisePress = (route: string) => {
    if (!isLoggedIn) {
      router.push('/auth/login');
      return;
    }
    router.push(route as any);
  };

  const exercises = [
    {
      title: 'Fill in The Blanks',
      icon: 'pencil',
      route: '/latihan/fill',
      description: 'Latihan mengisi bagian yang kosong'
    },
    {
      title: 'Drag and Drop',
      icon: 'arrows',
      route: '/latihan/drag',
      description: 'Latihan menyusun kode'
    },
    {
      title: 'Multiple Choice',
      icon: 'list-ul',
      route: '/latihan/multiplechoice',
      description: 'Latihan pilihan ganda'
    },
    {
      title: 'Skor',
      icon: 'star',
      route: '/latihan/score',
      description: 'Lihat pencapaianmu'
    }
  ];

  return (
    <View style={styles.container}>
      <NavHeader />
      <ScrollView style={styles.scrollView}>
        <View style={styles.content}>
          <Text style={styles.title}>Pilih Jenis Latihan</Text>
          <Text style={styles.subtitle}>
            Silakan pilih jenis latihan yang ingin kamu kerjakan
          </Text>

          <View style={styles.exerciseGrid}>
            {exercises.map((exercise, index) => (
              <TouchableOpacity
                key={index}
                style={styles.exerciseButton}
                onPress={() => handleExercisePress(exercise.route)}
              >
                <FontAwesome 
                  name={exercise.icon as any}
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
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f4f4f4',
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#3670a1',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 20,
  },
  exerciseGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 20,
    justifyContent: 'center',
  },
  exerciseButton: {
    backgroundColor: '#3670a1',
    borderRadius: 10,
    padding: 20,
    width: Dimensions.get('window').width > 768 ? 300 : '100%',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 150,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  icon: {
    marginBottom: 12,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
  },
  buttonDescription: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 14,
    textAlign: 'center',
  }
});