import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import NavHeader from '@/components/NavHeader';

export default function MateriScreen() {
  return (
    <View style={styles.container}>
      <NavHeader />
      <View style={styles.content}>
        <Image
          source={{ uri: 'https://upload.wikimedia.org/wikipedia/commons/c/c3/Python-logo-notext.svg' }}
          style={styles.logo}
        />
        <Text style={styles.title}>Punten, bahanna teu acan siap!</Text>
        <Text style={styles.text}>
          Mohon maaf, materi pembelajaran masih dalam pengembangan.
        </Text>
        <Text style={styles.text}>
          Terima kasih atas kesabarannya.
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
  content: {
    flex: 1,
    backgroundColor: 'white',
    margin: 20,
    padding: 24,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  logo: {
    width: 100,
    height: 100,
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#3670a1',
    marginBottom: 16,
    textAlign: 'center',
  },
  text: {
    fontSize: 16,
    color: '#333',
    marginBottom: 12,
    textAlign: 'center',
  },
});