import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions, Platform, StatusBar } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width } = Dimensions.get('window');

export default function Navbar() {
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    checkLoginStatus();
  }, []);

  const checkLoginStatus = async () => {
    const token = await AsyncStorage.getItem('token');
    setIsLoggedIn(!!token);
  };

  const handleLogout = async () => {
    await AsyncStorage.removeItem('token');
    setIsLoggedIn(false);
    router.push('/(tabs)');
  };

  const NavLink = ({ to, children }: { to: string; children: React.ReactNode }) => (
    <TouchableOpacity onPress={() => { router.push(to); setIsMenuOpen(false); }}>
      <Text style={styles.navLink}>{children}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content"/ >
      <LinearGradient
        colors={['#1e1e1e', '#3670a1']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.navbar}
      >
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
            <NavLink to="/(tabs)/materi">Materi</NavLink>
            <NavLink to="/(tabs)/Latihan/latihan">Latihan</NavLink>
            <NavLink to="/(tabs)/onlinecomp">Online Compiler</NavLink>
            {isLoggedIn ? (
              <>
                <NavLink to="/(tabs)/account/Account">Akun</NavLink>
                <TouchableOpacity onPress={handleLogout}>
                  <Text style={[styles.navLink, styles.logoutBtn]}>Log Out</Text>
                </TouchableOpacity>
              </>
            ) : (
              <NavLink to="/auth/login">Login</NavLink>
            )}
          </View>
        ) : (
          <TouchableOpacity style={styles.mobileMenuBtn} onPress={() => setIsMenuOpen(!isMenuOpen)}>
            <Ionicons name="menu" size={32} color="#ffffff" />
          </TouchableOpacity>
        )}
      </LinearGradient>

      {/* Mobile Menu Dropdown */}
      {width <= 768 && isMenuOpen && (
        <View style={styles.mobileMenu}>
          <NavLink to="/(tabs)/materi">Materi</NavLink>
          <NavLink to="/(tabs)/Latihan/latihan">Latihan</NavLink>
          <NavLink to="/(tabs)/onlinecomp">Online Compiler</NavLink>
          {isLoggedIn ? (
            <>
              <NavLink to="/(tabs)/account/Account">Akun</NavLink>
              <TouchableOpacity onPress={handleLogout}>
                <Text style={[styles.navLink, styles.logoutBtn]}>Log Out</Text>
              </TouchableOpacity>
            </>
          ) : (
            <NavLink to="/auth/login">Login</NavLink>
          )}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    
  },
  navbar: {
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    // paddingTop: Platform.OS === 'android' ? 25 + (StatusBar.currentHeight || 0) : 25,
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
  mobileMenu: {
    position: 'absolute',
    top: Platform.OS === 'android' ? (80 + (StatusBar.currentHeight || 0)) : 80,
    left: 0,
    right: 0,
    backgroundColor: '#3670a1',
    padding: 15,
    zIndex: 1000,
  },
  logoutBtn: {
    backgroundColor: '#ffc107',
    color: '#333',
    padding: 8,
    borderRadius: 5,
    overflow: 'hidden',
  },
});
