import React, { useState, useEffect } from 'react';
import { ScrollView, View, Text, TouchableOpacity, StyleSheet, Image, Dimensions, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { router, useFocusEffect } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { config } from 'src/config/api';

const { width } = Dimensions.get('window');

export default function HomeScreen() {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const checkLoginStatus = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      setIsLoggedIn(!!token);
    } catch (error) {
      console.error('Error checking login status:', error);
      setIsLoggedIn(false);
    }
  };

  useEffect(() => {
    checkLoginStatus();
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      checkLoginStatus();
    }, [])
  );

  const handleLogin = () => {
    router.push('/auth/login');
  };

  const handleLogout = async () => {
    try {
      setIsLoading(true);
      const token = await AsyncStorage.getItem('token');

      if (token) {
        try {
          await fetch(`${config.API_URL}/logout`, {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          });
        } catch (error) {
          console.error('API logout error:', error);
        }
      }

      await AsyncStorage.removeItem('token');
      await AsyncStorage.removeItem('userEmail');
      setIsLoggedIn(false);
      router.replace('/');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCardPress = (section: string) => {
    switch (section) {
      case 'Materi':
        // router.push('/materi');
        break;
      case 'Latihan':
        router.push('../latihan/latihan');
        break;
      case 'Online Compiler':
        router.push('/onlinecomp');
        break;
    }
  };

  const handleStartLearning = () => {
    // router.push('/materi');
  };

  return (
    <ScrollView style={styles.container}>
      <LinearGradient
        colors={['#1e1e1e', '#3670a1']}
        style={styles.gradientSection}
      >
        <TouchableOpacity 
          style={[styles.loginBtn, isLoggedIn && styles.logoutBtn]} 
          onPress={isLoggedIn ? handleLogout : handleLogin}
          disabled={isLoading}
        >
          <Text style={[styles.loginBtnText, isLoggedIn && styles.logoutBtnText]}>
            {isLoading ? 'Loading...' : isLoggedIn ? 'Logout' : 'Login'}
          </Text>
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
              <Ionicons 
                name={
                  index === 0 ? 'book' : 
                  index === 1 ? 'code-working' : 
                  'terminal'
                } 
                size={80} 
                color="#3670a1" 
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
}


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
  logoutBtn: {
    backgroundColor: '#ff5252',
  },
  loginBtnText: {
    color: '#333',
    fontSize: 16,
    fontWeight: 'bold',
  },
  logoutBtnText: {
    color: '#fff',
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