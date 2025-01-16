import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function FillScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Fill in The Blanks</Text>
      <Text style={styles.description}>
        Di halaman ini, pengguna akan mengisi bagian kosong sesuai dengan materi.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  description: {
    fontSize: 16,
    textAlign: 'center',
  },
});
