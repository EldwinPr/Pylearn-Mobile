import React, { useState } from 'react';
import { View, StyleSheet, Image } from 'react-native';
import { TextInput, Button, Text } from 'react-native-paper';
import { Link, router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { config } from 'src/config/api';

interface LoginForm {
  email: string;
  password: string;
}

interface AuthResponse {
  status: string;
  message: string;
  token?: string;
}

export default function LoginScreen() {
  const [form, setForm] = useState<LoginForm>({
    email: '',
    password: '',
  });
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  const handleLogin = async () => {
    if (!form.email.includes('@') || form.email.length < 5) {
      setError('Please enter a valid email address.');
      return;
    }

    if (form.password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch(`${config.API_URL}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(form),
      });

      const data: AuthResponse = await response.json();

      if (response.ok && data.token) {
        await AsyncStorage.setItem('userEmail', form.email);
        await AsyncStorage.setItem('token', data.token);
        router.replace('/(tabs)');
      } else {
        setError(data.message || 'Login failed. Please try again.');
      }
    } catch (error) {
      setError('Error: Unable to connect to server.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View style={styles.header}>
          <Image 
            source={{ uri: 'https://upload.wikimedia.org/wikipedia/commons/c/c3/Python-logo-notext.svg' }}
            style={styles.logo}
          />
          <Text style={styles.title}>
            <Text style={styles.py}>Py</Text>learn
          </Text>
        </View>

        <TextInput
          label="Email"
          value={form.email}
          onChangeText={(text) => setForm({ ...form, email: text })}
          mode="outlined"
          style={styles.input}
          keyboardType="email-address"
          autoCapitalize="none"
        />

        <TextInput
          label="Password"
          value={form.password}
          onChangeText={(text) => setForm({ ...form, password: text })}
          mode="outlined"
          style={styles.input}
          secureTextEntry
        />

        {error ? <Text style={styles.error}>{error}</Text> : null}

        <Button
          mode="contained"
          onPress={handleLogin}
          style={styles.button}
          loading={loading}
          disabled={loading}
        >
          Login
        </Button>

        <Button
          mode="outlined"
        //   onPress={() => router.push('/auth/register')}
          style={styles.button}
        >
          Register
        </Button>

        <Link href="/" style={styles.backLink}>
          <Text>Back to Home</Text>
        </Link>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1e1e1e',
    padding: 20,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    maxWidth: 400,
    width: '100%',
    alignSelf: 'center',
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 32,
  },
  logo: {
    width: 100,
    height: 100,
    marginBottom: 16,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#3670a1',
  },
  py: {
    color: '#ffc107',
  },
  input: {
    marginBottom: 16,
    backgroundColor: 'white',
  },
  button: {
    marginTop: 8,
    paddingVertical: 8,
    backgroundColor: '#ffc107',
  },
  error: {
    color: 'red',
    textAlign: 'center',
    marginBottom: 16,
  },
  backLink: {
    marginTop: 16,
    alignSelf: 'center',
  },
});