import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { TextInput, Button, Text } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import NavHeader from '../../components/NavHeader';
import { config } from 'src/config/api';

interface UserData {
 username: string;
 email: string;
}

export default function AccountScreen() {
 const [userData, setUserData] = useState<UserData>({ username: '', email: '' });
 const [formData, setFormData] = useState({
   username: '',
   currentPassword: '',
   newPassword: '',
   confirmPassword: '',
 });
 const [loading, setLoading] = useState(false);
 const [error, setError] = useState('');
 const [success, setSuccess] = useState('');

 useEffect(() => {
   loadUserData();
 }, []);

 const getAuthHeaders = async () => {
   const token = await AsyncStorage.getItem('token');
   return {
     'Authorization': `Bearer ${token}`,
     'Content-Type': 'application/json'
   };
 };

 const loadUserData = async () => {
   try {
     const email = await AsyncStorage.getItem('userEmail');
     if (!email) {
       router.replace('/auth/login');
       return;
     }

     const headers = await getAuthHeaders();
     const response = await fetch(`${config.API_URL}/getUserData?email=${encodeURIComponent(email)}`, {
       headers
     });
     const data = await response.json();

     if (response.ok) {
       setUserData({ username: data.username, email: email });
       setFormData(prev => ({ ...prev, username: data.username }));
     } else {
       setError(data.message || 'Failed to load user data');
     }
   } catch (err) {
     setError('Connection error');
   }
 };

 const handleSubmit = async () => {
   setError('');
   setSuccess('');

   if (formData.username.length < 3) {
     setError('Username must be at least 3 characters');
     return;
   }

   if (formData.currentPassword.length < 6) {
     setError('Current password must be at least 6 characters');
     return;
   }

   if (formData.newPassword && formData.newPassword.length < 6) {
     setError('New password must be at least 6 characters');
     return;
   }

   if (formData.newPassword !== formData.confirmPassword) {
     setError('New passwords do not match');
     return;
   }

   try {
     setLoading(true);
     const headers = await getAuthHeaders();
     const response = await fetch(`${config.API_URL}/updateAccount?email=${encodeURIComponent(userData.email)}`, {
       method: 'POST',
       headers,
       body: JSON.stringify({
         username: formData.username,
         currentPassword: formData.currentPassword,
         newPassword: formData.newPassword || undefined,
       }),
     });

     const data = await response.json();

     if (response.ok) {
       setSuccess('Account updated successfully!');
       setFormData(prev => ({
         ...prev,
         currentPassword: '',
         newPassword: '',
         confirmPassword: '',
       }));
     } else {
       setError(data.message || 'Update failed');
     }
   } catch (err) {
     setError('Connection error');
   } finally {
     setLoading(false);
   }
 };

 return (
   <ScrollView style={styles.container}>
     <NavHeader />
     <View style={styles.content}>
       <View style={styles.card}>
         <Text style={styles.title}>Pengaturan Akun</Text>

         {error && <Text style={styles.errorText}>{error}</Text>}
         {success && <Text style={styles.successText}>{success}</Text>}

         <TextInput
           label="Username"
           value={formData.username}
           onChangeText={text => setFormData(prev => ({ ...prev, username: text }))}
           style={styles.input}
           mode="outlined"
           textColor="#000000"
         />

         <TextInput
           label="Email"
           value={userData.email}
           disabled
           style={styles.input}
           mode="outlined"
           textColor="#000000"
         />

         <TextInput
           label="Current Password"
           value={formData.currentPassword}
           onChangeText={text => setFormData(prev => ({ ...prev, currentPassword: text }))}
           secureTextEntry
           style={styles.input}
           mode="outlined"
           textColor="#000000"
         />

         <TextInput
           label="New Password (optional)"
           value={formData.newPassword}
           onChangeText={text => setFormData(prev => ({ ...prev, newPassword: text }))}
           secureTextEntry
           style={styles.input}
           mode="outlined"
           textColor="#000000"
         />

         <TextInput
           label="Confirm New Password"
           value={formData.confirmPassword}
           onChangeText={text => setFormData(prev => ({ ...prev, confirmPassword: text }))}
           secureTextEntry
           style={styles.input}
           mode="outlined"
           textColor="#000000"
         />

         <Button
           mode="contained"
           onPress={handleSubmit}
           loading={loading}
           style={styles.button}
           disabled={loading}
           labelStyle={{ color: '#fff' }}
         >
           Save Changes
         </Button>
       </View>
     </View>
   </ScrollView>
 );
}

const styles = StyleSheet.create({
 container: {
   flex: 1,
   backgroundColor: '#f0f2f5',
 },
 content: {
   padding: 20,
   alignItems: 'center',
 },
 card: {
   backgroundColor: 'white',
   borderRadius: 12,
   padding: 20,
   width: '100%',
   maxWidth: 800,
   shadowColor: "#000",
   shadowOffset: { width: 0, height: 2 },
   shadowOpacity: 0.1,
   shadowRadius: 4,
   elevation: 3,
 },
 title: {
   fontSize: 24,
   fontWeight: 'bold',
   color: '#3670a1',
   marginBottom: 20,
   textAlign: 'center',
 },
 input: {
   marginBottom: 16,
   backgroundColor: 'white',
 },
 button: {
   marginTop: 20,
   backgroundColor: '#3670a1',
 },
 errorText: {
   color: '#f44336',
   marginBottom: 16,
   textAlign: 'center',
 },
 successText: {
   color: '#4caf50',  
   marginBottom: 16,
   textAlign: 'center',
 },
});