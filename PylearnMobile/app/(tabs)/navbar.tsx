import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

export default function Navbar() {
  const router = useRouter();

  return (
    <View style={styles.navbar}>
      {/* Logo */}
      <TouchableOpacity style={styles.logo} onPress={() => router.push('/(tabs)')}>
        <Ionicons name="logo-python" size={32} color="#ffc107" />
        <Text style={styles.logoText}>
          <Text style={styles.highlight}>Py</Text>learn
        </Text>
      </TouchableOpacity>

      {/* Menu Links */}
      {width > 768 ? (
        <View style={styles.navLinks}>
          {/* <TouchableOpacity onPress={() => router.push('/(tabs)/materi')}>
            <Text style={styles.navLink}>Materi</Text>
          </TouchableOpacity> */}
          <TouchableOpacity onPress={() => router.push('/(tabs)/Latihan/latihan')}>
            <Text style={styles.navLink}>Latihan</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => router.push('/(tabs)/onlinecomp')}>
            <Text style={styles.navLink}>Online Compiler</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => router.push('/auth/login')}>
            <Text style={styles.navLink}>Login</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <TouchableOpacity style={styles.mobileMenuBtn} onPress={() => router.push('/(tabs)')}>
          <Ionicons name="menu" size={32} color="#ffffff" />
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  navbar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#3670a1',
    padding: 15,
  },
  logo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoText: {
    color: '#ffffff',
    fontSize: 20,
    fontWeight: 'bold',
    marginLeft: 5,
  },
  highlight: {
    color: '#ffc107',
  },
  navLinks: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  navLink: {
    color: '#ffffff',
    marginHorizontal: 10,
    fontSize: 16,
  },
  mobileMenuBtn: {
    backgroundColor: 'transparent',
  },
});
