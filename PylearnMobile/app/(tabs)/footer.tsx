import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function Footer() {
  return (
    <View style={styles.footer}>
      <Text style={styles.footerText}>
        &copy; 2024 PyLearn | Belajar Python dengan mudah
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
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
