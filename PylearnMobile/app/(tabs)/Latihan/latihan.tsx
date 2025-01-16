import React, { useState } from 'react';
import {
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Navbar from '../navbar'; // Pastikan path Navbar benar
import { useRouter } from 'expo-router';

const { width } = Dimensions.get('window');

export default function LatihanScreen() {
  const router = useRouter();
  const [pressedButton, setPressedButton] = useState<string | null>(null); // Menyimpan tombol yang ditekan

  const handleNavigate = (page: string) => {
    router.push(`/(tabs)/Latihan/${page}`);
  };

  return (
    <View style={styles.container}>
      {/* Navbar */}
      <Navbar />

      {/* Main Content */}
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.content}>
          <Text style={styles.title}>Pilih Jenis Latihan</Text>
          <Text style={styles.subtitle}>
            Silakan pilih jenis latihan yang ingin kamu kerjakan.
          </Text>
          <View style={styles.exerciseGrid}>
            {[
              { icon: 'pencil', title: 'Fill in The Blanks', page: 'fill' },
              { icon: 'move', title: 'Drag and Drop', page: 'drag' },
              { icon: 'list', title: 'Multiple Choice', page: 'multiple-choice' },
              { icon: 'star', title: 'Skor', page: 'score' },
            ].map((exercise, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.exerciseButton,
                  pressedButton === exercise.page && styles.pressedButton,
                ]}
                onPressIn={() => setPressedButton(exercise.page)}
                onPressOut={() => setPressedButton(null)}
                onPress={() => handleNavigate(exercise.page)}
              >
                <Ionicons
                  name={exercise.icon} // Dinamis: ikon diambil dari array data
                  size={50}
                  color={pressedButton === exercise.page ? '#333' : '#ffffff'} // Warna ikon berubah saat ditekan
                />
                <Text
                  style={[
                    styles.buttonText,
                    pressedButton === exercise.page && styles.pressedButtonText,
                  ]}
                >
                  {exercise.title}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>

      {/* Footer */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>
          &copy; 2024 PyLearn | Belajar Python dengan mudah
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f4f4f4',
  },
  scrollContent: {
    flexGrow: 1,
  },
  content: {
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#333',
    textAlign: 'center',
    marginBottom: 20,
  },
  exerciseGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
  },
  exerciseButton: {
    backgroundColor: '#3670a1',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    width: width > 600 ? 180 : width * 0.4,
  },
  pressedButton: {
    backgroundColor: '#ffc107', // Kuning saat ditekan
  },
  buttonText: {
    marginTop: 10,
    color: '#ffffff',
    fontSize: 16,
    textAlign: 'center',
  },
  pressedButtonText: {
    color: '#333', // Warna teks berubah saat tombol ditekan
  },
  footer: {
    backgroundColor: '#3670a1',
    padding: 20,
    alignItems: 'center',
  },
  footerText: {
    color: '#ffffff',
    textAlign: 'center',
  },
});
