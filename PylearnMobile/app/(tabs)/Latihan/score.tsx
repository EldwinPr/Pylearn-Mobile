import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert } from 'react-native';
import { Button } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import NavHeader from '../../../components/NavHeader';
import { config } from 'src/config/api';
import { Platform } from 'react-native';

interface Score {
 exercise: string;
 score: number;
 date: string;
 completed: boolean;
 type: 'drag' | 'fill' | 'mult';
 color: string;
}

export default function ScoreScreen() {
 const [scores, setScores] = useState<Score[]>([]);
 const [loading, setLoading] = useState(true);
 const [error, setError] = useState<string | null>(null);

 useEffect(() => {
   fetchScores();
 }, []);

 const fetchScores = async () => {
   try {
     const userEmail = await AsyncStorage.getItem('userEmail');
     if (!userEmail) {
       router.replace('/auth/login');
       return;
     }

     const token = await AsyncStorage.getItem('token');
     const response = await fetch(`${config.API_URL}/progress?email=${encodeURIComponent(userEmail)}`, {
       headers: {
         'Authorization': `Bearer ${token}`,
         'Content-Type': 'application/json'
       }
     });

     if (!response.ok) throw new Error('Failed to fetch progress');
     const progress = await response.json();

     const today = new Date().toISOString().split('T')[0];
     const scoreData: Score[] = [
       {
         exercise: "Drag and Drop",
         score: progress.DragScore || 0,
         date: progress.Drag ? today : '-',
         completed: progress.Drag,
         type: "drag",
         color: '#2196F3'
       },
       {
         exercise: "Fill in The Blanks",
         score: progress.FillScore || 0,
         date: progress.Fill ? today : '-',
         completed: progress.Fill,
         type: "fill",
         color: '#4CAF50'
       },
       {
         exercise: "Multiple Choice",
         score: progress.MultScore || 0,
         date: progress.Mult ? today : '-',
         completed: progress.Mult,
         type: "mult",
         color: '#9C27B0'
       }
     ];

     setScores(scoreData);
   } catch (err) {
     setError('Failed to load progress');
   } finally {
     setLoading(false);
   }
 };
  const [isResetting, setIsResetting] = useState(false);

  const handleReset = async () => {
    if (Platform.OS === 'web') {
      const confirmed = window.confirm("Apakah anda yakin ingin reset semua progress?");
      if (confirmed) {
        try {
          setIsResetting(true);
          const token = await AsyncStorage.getItem('token');
          
          const response = await fetch(`${config.API_URL}/progress/reset`, {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          });
   
          if (!response.ok) throw new Error();
          await fetchScores();
          window.alert("Progress berhasil direset");
        } catch {
          window.alert("Gagal reset progress"); 
        } finally {
          setIsResetting(false);
        }
      }
    } else {
      Alert.alert(
        "Reset Progress",
        "Apakah anda yakin ingin reset semua progress?", 
        [
          { text: "Batal", style: "cancel" },
          {
            text: "Reset",
            style: "destructive",
            onPress: async () => {
              try {
                setIsResetting(true);
                const token = await AsyncStorage.getItem('token');
                
                const response = await fetch(`${config.API_URL}/progress/reset`, {
                  method: 'POST',
                  headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                  }
                });
   
                if (!response.ok) throw new Error();
                await fetchScores();
                Alert.alert("Berhasil", "Progress telah direset");
              } catch {
                Alert.alert("Error", "Gagal reset progress");
              } finally {
                setIsResetting(false);
              }
            }
          }
        ]
      );
    }
   };

 const completedExercises = scores.filter(score => score.completed).length;
 const totalScore = scores.reduce((sum, score) => sum + (score.completed ? score.score : 0), 0);
 const averageScore = completedExercises > 0 ? Math.round(totalScore / completedExercises) : 0;
 const progressPercent = Math.round((completedExercises / scores.length) * 100);

 return (
   <ScrollView style={styles.container}>
     <NavHeader />
     <View style={styles.content}>
       <View style={styles.card}>
         <Text style={styles.title}>Progress Latihan</Text>

         <View style={styles.progressSection}>
           <View style={styles.progressCircle}>
             <Text style={styles.progressValue}>{progressPercent}%</Text>
             <Text style={styles.progressLabel}>Selesai</Text>
           </View>
           <Text style={styles.averageScore}>
             Rata-rata: {averageScore}/100
           </Text>
         </View>

         <View style={styles.exercises}>
           {scores.map((score, index) => (
             <View key={index} style={styles.exerciseCard}>
               <View style={[styles.exerciseHeader, { backgroundColor: score.color }]}>
                 <Text style={styles.exerciseName}>{score.exercise}</Text>
                 <Text style={styles.scoreValue}>
                   {score.completed ? `${score.score}/100` : '-'}
                 </Text>
               </View>
               <View style={styles.exerciseBody}>
                 <Text style={styles.dateText}>
                   {score.completed ? `Selesai: ${score.date}` : 'Belum selesai'}
                 </Text>
                 <Button
                  mode={score.completed ? "outlined" : "contained"}
                  onPress={() => router.push(score.type === "mult" ? "/latihan/multiplechoice" : `/latihan/${score.type}`)}
                  style={[styles.exerciseButton, { borderColor: score.color }]}
                  labelStyle={{ color: score.completed ? score.color : 'white' }}
                >
                  {score.completed ? 'Ulangi' : 'Mulai'}
                </Button>
               </View>
             </View>
           ))}
         </View>

         <Button
          mode="contained"
          onPress={() => {
            console.log("Button pressed"); // Debug log
            handleReset();
          }}
          style={styles.resetButton}
          labelStyle={{ color: 'white' }}
        >
          Reset Progress
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
   marginBottom: 24,
   textAlign: 'center',
 },
 progressSection: {
   alignItems: 'center',
   marginBottom: 32,
 },
 progressCircle: {
   width: 120,
   height: 120,
   borderRadius: 60,
   backgroundColor: '#3670a1',
   justifyContent: 'center',
   alignItems: 'center',
   marginBottom: 16,
 },
 progressValue: {
   fontSize: 32,
   fontWeight: 'bold',
   color: 'white',
 },
 progressLabel: {
   fontSize: 16,
   color: 'white',
 },
 averageScore: {
   fontSize: 18,
   color: '#666',
 },
 exercises: {
   gap: 16,
 },
 exerciseCard: {
   backgroundColor: 'white',
   borderRadius: 8,
   overflow: 'hidden',
   borderWidth: 1,
   borderColor: '#eee',
 },
 exerciseHeader: {
   flexDirection: 'row',
   justifyContent: 'space-between',
   padding: 16,
 },
 exerciseName: {
   fontSize: 16,
   fontWeight: 'bold',
   color: 'white',
 },
 scoreValue: {
   fontSize: 16,
   fontWeight: 'bold',
   color: 'white',
 },
 exerciseBody: {
   padding: 16,
   flexDirection: 'row',
   justifyContent: 'space-between',
   alignItems: 'center',
 },
 dateText: {
   color: '#666',
 },
 exerciseButton: {
   minWidth: 100,
 },
 resetButton: {
   backgroundColor: '#f44336',
   marginTop: 32,
 },
});