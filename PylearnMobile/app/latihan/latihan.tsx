import React from 'react';
import { View, ScrollView, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { Text, Card } from 'react-native-paper';
import { router } from 'expo-router';
import { FontAwesome5 } from '@expo/vector-icons';
import NavHeader from '../../components/NavHeader';

const { width } = Dimensions.get('window');

const exercises = [
  {
    title: 'Fill in The Blanks',
    icon: 'pencil-alt',
    route: '/latihan/fill',
    description: 'Latihan mengisi bagian yang kosong'
  },
  {
    title: 'Drag and Drop',
    icon: 'arrows-alt',
    route: '/latihan/drag',
    description: 'Latihan menyusun kode'
  },
  {
    title: 'Multiple Choice',
    icon: 'tasks',
    route: 'multiple-choice',
    description: 'Latihan pilihan ganda'
  },
  {
    title: 'Skor',
    icon: 'star',
    route: 'score',
    description: 'Lihat pencapaianmu'
  }
];

export default function LatihanScreen() {
  const handleExercisePress = (route: string) => {
    router.push(route as any);
  };

  return (
    <ScrollView style={styles.container}>
      <NavHeader />
      <View style={styles.content}>
        <Card style={styles.header}>
          <Card.Content>
            <Text style={styles.title}>Pilih Jenis Latihan</Text>
            <Text style={styles.subtitle}>Silakan pilih jenis latihan yang ingin kamu kerjakan.</Text>
          </Card.Content>
        </Card>

        <View style={styles.exerciseGrid}>
          {exercises.map((exercise, index) => (
            <TouchableOpacity
              key={index}
              style={styles.exerciseButton}
              onPress={() => handleExercisePress(exercise.route)}
              activeOpacity={0.8}
            >
              <View style={styles.iconContainer}>
                <FontAwesome5
                  name={exercise.icon}
                  size={24}
                  color="#3670a1"
                />
              </View>
              <Text style={styles.buttonTitle}>{exercise.title}</Text>
              <Text style={styles.buttonDescription}>{exercise.description}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  content: {
    padding: 16,
    flex: 1,
  },
  header: {
    marginBottom: 24,
    elevation: 4,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#7f8c8d',
  },
  exerciseGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 16,
  },
  exerciseButton: {
    backgroundColor: '#ffffff',
    width: width > 600 ? (width - 48) / 2 : width - 32,
    borderRadius: 12,
    padding: 20,
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  iconContainer: {
    backgroundColor: '#ecf0f1',
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
  },
  buttonTitle: {
    color: '#2c3e50',
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
  },
  buttonDescription: {
    color: '#7f8c8d',
    fontSize: 14,
  },
});

