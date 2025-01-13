import React from 'react';
import { ScrollView, View, Text, TouchableOpacity, StyleSheet, Image, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

const App = () => {
  const handleStartLearning = () => {
    // Implement scrolling to yellow section
    console.log('Start learning clicked');
  };

  const handleLogin = () => {
    // Implement login logic
    console.log('Login clicked');
  };

  const handleCardPress = (section: string) => {
    console.log(`${section} card pressed`);
  };

  return (
    <ScrollView style={styles.container}>
      <LinearGradient
        colors={['#1e1e1e', '#3670a1']}
        style={styles.gradientSection}
      >
        <TouchableOpacity style={styles.loginBtn} onPress={handleLogin}>
          <Text style={styles.loginBtnText}>Login</Text>
        </TouchableOpacity>
        <View style={styles.header}>
          <Image
            source={{ uri: 'https://cdn.iconscout.com/icon/free/png-256/free-python-logo-icon-download-in-svg-png-gif-file-formats--technology-social-media-vol-5-pack-logos-icons-2945099.png?f=webp&w=256' }}
            style={styles.titleImage}
          />
          <View style={styles.headerText}>
            <Text style={styles.title}>
              <Text style={styles.yellowText}>Py</Text>learn
            </Text>
            <Text style={styles.subtitle}>
              Belajar Python dengan cara yang interaktif dan menyenangkan
            </Text>
            <TouchableOpacity style={styles.startBtn} onPress={handleStartLearning}>
              <Text style={styles.startBtnText}>Mulai Belajar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </LinearGradient>

      <View style={styles.yellowSection}>
        <View style={styles.content}>
          {['Materi', 'Latihan', 'Online Compiler'].map((item, index) => (
            <TouchableOpacity
              key={index}
              style={styles.card}
              onPress={() => handleCardPress(item)}
            >
              <Image
                source={{ uri: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-ALNq4uLXrMRsvRPI5CIjRGtruWlupw.png' }}
                style={styles.cardImage}
              />
              <Text style={styles.cardTitle}>{item}</Text>
              <Text style={styles.cardDescription}>
                {index === 0 && 'Pelajari dasar-dasar Python hingga konsep lanjutan dengan materi yang terstruktur.'}
                {index === 1 && 'Uji pemahaman Anda dengan latihan interaktif dan proyek-proyek menarik.'}
                {index === 2 && 'Tulis dan jalankan kode Python Anda secara langsung di browser.'}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>
          © 2024 Pylearn | Belajar Python dengan mudah dan menyenangkan
        </Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f4f4f4',
  },
  gradientSection: {
    minHeight: 600,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loginBtn: {
    position: 'absolute',
    top: 40,
    right: 20,
    backgroundColor: '#ffc107',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 25,
  },
  loginBtnText: {
    color: '#333',
    fontSize: 16,
  },
  header: {
    alignItems: 'center',
  },
  titleImage: {
    width: 150,
    height: 150,
    marginBottom: 20,
  },
  headerText: {
    alignItems: 'center',
  },
  title: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 10,
  },
  yellowText: {
    color: '#ffc107',
  },
  subtitle: {
    fontSize: 18,
    color: '#ffffff',
    textAlign: 'center',
    marginBottom: 20,
  },
  startBtn: {
    backgroundColor: '#ffc107',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 25,
  },
  startBtnText: {
    color: '#333',
    fontSize: 18,
    fontWeight: 'bold',
  },
  yellowSection: {
    backgroundColor: '#ffc107',
    padding: 20,
  },
  content: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 15,
    padding: 20,
    width: width > 768 ? 300 : width - 40,
    alignItems: 'center',
    marginBottom: 20,
    marginHorizontal: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardImage: {
    width: 80,
    height: 80,
    marginBottom: 20,
    resizeMode: 'contain',
  },
  cardTitle: {
    color: '#3670a1',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  cardDescription: {
    textAlign: 'center',
    color: '#333',
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

export default App;

