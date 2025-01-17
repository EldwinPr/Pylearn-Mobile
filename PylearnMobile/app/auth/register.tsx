import React, { useState } from 'react';
import { View, StyleSheet, Image } from 'react-native';
import { TextInput, Button, Text, Card } from 'react-native-paper';
import { router } from 'expo-router';
import { config } from 'src/config/api';

interface RegisterForm {
  email: string;
  username: string;
  password: string;
  confirmPassword: string;
}

interface RegisterResponse {
  status: string;
  message: string;
}

export default function RegisterScreen() {
  const [form, setForm] = useState<RegisterForm>({
    email: '',
    username: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  const handleRegister = async () => {
    if (form.username.length < 3) {
      setError('Username must be at least 3 characters long.');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(form.email)) {
      setError('Please enter a valid email address.');
      return;
    }

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;
    if (!passwordRegex.test(form.password)) {
      setError('Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, and one number.');
      return;
    }

    if (form.password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch(`${config.API_URL}/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: form.email,
          username: form.username,
          password: form.password,
        }),
      });

      const data: RegisterResponse = await response.json();

      if (response.ok) {
        router.replace('/auth/login');
      } else {
        setError(data.message || 'Registration failed. Please try again.');
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
          label="Username"
          value={form.username}
          onChangeText={(text) => setForm({ ...form, username: text })}
          mode="outlined"
          style={styles.input}
          autoCapitalize="none"
          theme={{ 
            colors: { 
              text: 'black',
              placeholder: 'black',
              primary: '#3670a1',
              onSurfaceVariant: 'black',
            } 
          }}
          outlineColor="black"
          activeOutlineColor="#3670a1"
        />

        <TextInput
          label="Email"
          value={form.email}
          onChangeText={(text) => setForm({ ...form, email: text })}
          mode="outlined"
          style={styles.input}
          keyboardType="email-address"
          autoCapitalize="none"
          theme={{ 
            colors: { 
              text: 'black',
              placeholder: 'black',
              primary: '#3670a1',
              onSurfaceVariant: 'black',
            } 
          }}
          outlineColor="black"
          activeOutlineColor="#3670a1"
        />

        <TextInput
          label="Password"
          value={form.password}
          onChangeText={(text) => setForm({ ...form, password: text })}
          mode="outlined"
          style={styles.input}
          secureTextEntry
          theme={{ 
            colors: { 
              text: 'black',
              placeholder: 'black',
              primary: '#3670a1',
              onSurfaceVariant: 'black',
            } 
          }}
          outlineColor="black"
          activeOutlineColor="#3670a1"
        />

        <TextInput
          label="Confirm Password"
          value={form.confirmPassword}
          onChangeText={(text) => setForm({ ...form, confirmPassword: text })}
          mode="outlined"
          style={styles.input}
          secureTextEntry
          theme={{ 
            colors: { 
              text: 'black',
              placeholder: 'black',
              primary: '#3670a1',
              onSurfaceVariant: 'black',
            } 
          }}
          outlineColor="black"
          activeOutlineColor="#3670a1"
        />

        {error ? (
          <Card style={styles.errorCard}>
            <Card.Content>
              <Text style={styles.error}>{error}</Text>
            </Card.Content>
          </Card>
        ) : null}

        <Button
          mode="contained"
          onPress={handleRegister}
          style={[styles.button, { backgroundColor: '#3670a1' }]}
          labelStyle={{ color: 'white' }}
          loading={loading}
          disabled={loading}
        >
          Register
        </Button>

        <Button
          mode="contained"
          onPress={() => router.push('/auth/login')}
          style={[styles.button, { backgroundColor: '#ffc107' }]}
          labelStyle={{ color: 'black' }}
        >
          Back to Login
        </Button>

        <Button
          mode="text"
          onPress={() => router.push('/')}
          style={styles.backLink}
          labelStyle={{ color: '#3670a1' }}
        >
          Back to Home
        </Button>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#2c3e50',
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
  },
  error: {
    color: 'red',
    textAlign: 'center',
    fontWeight: 'bold',
    marginBottom: 16,
  },
  errorCard: {
    marginBottom: 16,
    backgroundColor: '#FFEBEE',
  },
  backLink: {
    marginTop: 16,
    alignSelf: 'center',
  },
});

