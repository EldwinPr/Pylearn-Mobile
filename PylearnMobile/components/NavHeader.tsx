import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Dimensions } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { Menu } from 'react-native-paper';
import { LinearGradient } from 'expo-linear-gradient';

interface NavigationItem {
  label: string;
  path: string;
}

export default function NavHeader() {
  const [menuVisible, setMenuVisible] = useState(false);
  const { width } = Dimensions.get('window');
  const isMobile = width < 768;

  const handleLogout = async () => {
    await AsyncStorage.removeItem('token');
    await AsyncStorage.removeItem('userEmail');
    router.replace('/');
  };

  const navigationItems: NavigationItem[] = [
    { label: 'Materi', path: '/' as const },
    { label: 'Latihan', path: '/latihan/latihan' as const },
    { label: 'Online Compiler', path: '/onlinecomp' as const },
  ];

  const handleNavigation = (path: string) => {
    router.push(path as any);
    setMenuVisible(false);
  };

  const renderMobileMenu = () => (
    <Menu
      visible={menuVisible}
      onDismiss={() => setMenuVisible(false)}
      anchor={
        <TouchableOpacity 
          onPress={() => setMenuVisible(true)}
          style={styles.menuButton}
        >
          <MaterialIcons name="menu" size={24} color="white" />
        </TouchableOpacity>
      }
      contentStyle={styles.menuContent}
    >
      {navigationItems.map((item, index) => (
        <Menu.Item
          key={index}
          onPress={() => handleNavigation(item.path)}
          title={item.label}
          titleStyle={styles.menuItemText}
        />
      ))}
      <Menu.Item
        onPress={handleLogout}
        title="Login"
        titleStyle={styles.menuItemText}
      />
    </Menu>
  );

  const renderDesktopNav = () => (
    <View style={styles.navLinks}>
      {navigationItems.map((item, index) => (
        <TouchableOpacity
          key={index}
          style={styles.navItem}
          onPress={() => handleNavigation(item.path)}
        >
          <Text style={styles.navText}>{item.label}</Text>
        </TouchableOpacity>
      ))}
      <TouchableOpacity 
        style={styles.loginButton}
        onPress={handleLogout}
      >
        <Text style={styles.loginButtonText}>Login</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <LinearGradient 
      colors={['#3670a1', '#3670a1']} 
      style={styles.navbarWrapper}
    >
      <View style={styles.navbar}>
        <TouchableOpacity 
          style={styles.logo}
          onPress={() => router.push('/')}
        >
          <Image
            source={{ uri: 'https://upload.wikimedia.org/wikipedia/commons/c/c3/Python-logo-notext.svg' }}
            style={styles.logoImage}
          />
          <Text style={styles.logoText}>
            <Text style={styles.pyText}>Py</Text>
            learn
          </Text>
        </TouchableOpacity>

        {isMobile ? renderMobileMenu() : renderDesktopNav()}
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  navbarWrapper: {
    width: '100%',
  },
  navbar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    height: 60,
  },
  logo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoImage: {
    width: 32,
    height: 32,
    marginRight: 8,
  },
  logoText: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },
  pyText: {
    color: '#ffc107',
  },
  navLinks: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 24,
  },
  navItem: {
    paddingVertical: 8,
  },
  navText: {
    color: 'white',
    fontSize: 16,
  },
  loginButton: {
    backgroundColor: '#ffc107',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 4,
  },
  loginButtonText: {
    color: '#333',
    fontSize: 16,
    fontWeight: 'bold',
  },
  menuButton: {
    padding: 8,
  },
  menuContent: {
    backgroundColor: '#3670a1',
    marginTop: 40,
  },
  menuItemText: {
    color: 'white',
  },
});