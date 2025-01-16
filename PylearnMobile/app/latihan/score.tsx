import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { Button, Card } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import NavHeader from '../../components/NavHeader';
import { config } from 'src/config/api';

interface Score {
  exercise: string;
  score: number;
  date: string;
  completed: boolean;
  type: 'drag' | 'fill' | 'mult';
}

export default function ScoreScreen() {
  const [scores, setScores] = useState<Score[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchScores();
  }, []);

  const getAuthHeaders = async () => {
    const token = await AsyncStorage.getItem('token');
    return {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    };
  };

  const fetchScores = async () => {
    try {
      const userEmail = await AsyncStorage.getItem('userEmail');
      if (!userEmail) {
        router.replace('/auth/login');
        return;
      }

      const headers = await getAuthHeaders();
      const response = await fetch(`${config.API_URL}/progress?email=${encodeURIComponent(userEmail)}`, {
        headers
      });

      if (!response.ok) throw new Error('Failed to fetch progress');

      const progress = await response.json();
      console.log('Progress data:', progress); // For debugging

      const today = new Date().toISOString().split('T')[0];

      const scoreData: Score[] = [
        {
          exercise: "Drag and Drop",
          score: progress.DragScore || 0,  // Changed from drag_score
          date: progress.Drag ? today : '-',
          completed: progress.Drag,
          type: "drag"
        },
        {
          exercise: "Fill in The Blanks",
          score: progress.FillScore || 0,  // Changed from fill_score
          date: progress.Fill ? today : '-',
          completed: progress.Fill,
          type: "fill"
        },
        {
          exercise: "Multiple Choice",
          score: progress.MultScore || 0,  // Changed from mult_score
          date: progress.Mult ? today : '-',
          completed: progress.Mult,
          type: "mult"
        }
      ];

      setScores(scoreData);
    } catch (err) {
      setError('Failed to load progress');
      console.error('Error fetching scores:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = async () => {
    Alert.alert(
      "Reset Progress",
      "Apakah anda yakin ingin reset semua progress? Ini akan menghapus semua skor anda.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Reset",
          style: "destructive",
          onPress: async () => {
            try {
              const headers = await getAuthHeaders();
              const response = await fetch(`${config.API_URL}/progress/reset`, {
                method: 'POST',
                headers
              });

              if (!response.ok) throw new Error('Failed to reset progress');

              Alert.alert("Success", "Progress berhasil direset");
              fetchScores();
            } catch (err) {
              Alert.alert("Error", "Gagal reset progress. Silakan coba lagi.");
              console.error(err);
            }
          }
        }
      ]
    );
  };

  const getExerciseUrl = (type: Score['type']) => {
    const routes = {
      drag: '/latihan/drag',
      fill: '/latihan/fill',
      mult: '/latihan/multiple-choice'
    };
    return routes[type];
  };

  const completedExercises = scores.filter(score => score.completed).length;
  const totalScore = scores.reduce((sum, score) => sum + (score.completed ? score.score : 0), 0);
  const averageScore = completedExercises > 0 ? Math.round(totalScore / completedExercises) : 0;
  const progressPercent = Math.round((completedExercises / scores.length) * 100);

  return (
    <View style={styles.container}>
      <NavHeader />
      <ScrollView style={styles.scrollView}>
        <View style={styles.content}>
          <Text style={styles.title}>Progress Latihan</Text>

          <Card style={styles.progressCard}>
            <Card.Content>
              <Text style={styles.progressValue}>{progressPercent}%</Text>
              <Text style={styles.progressText}>
                {completedExercises}/{scores.length} Latihan Selesai
              </Text>
            </Card.Content>
          </Card>

          <View style={styles.tableContainer}>
            {scores.map((score, index) => (
              <View key={index} style={styles.tableRow}>
                <View style={styles.exerciseInfo}>
                  <Text style={styles.exerciseName}>{score.exercise}</Text>
                  <Text style={styles.scoreText}>
                    {score.completed ? `${score.score}/100` : '-'}
                  </Text>
                </View>
                <View style={styles.dateStatus}>
                  <Text style={styles.dateText}>{score.date}</Text>
                  {score.completed ? (
                    <View style={styles.completedBadge}>
                      <Text style={styles.completedText}>Selesai</Text>
                    </View>
                  ) : (
                    <Button
                      mode="contained"
                      onPress={() => router.push(getExerciseUrl(score.type) as any)}
                      style={styles.startButton}
                    >
                      Mulai Latihan
                    </Button>
                  )}
                </View>
              </View>
            ))}

            <View style={styles.totalRow}>
              <Text style={styles.totalText}>Skor Rata-rata: {averageScore}/100</Text>
              <Text style={styles.totalText}>
                {completedExercises}/{scores.length} Latihan Selesai
              </Text>
            </View>
          </View>

          <Button
            mode="contained"
            onPress={handleReset}
            style={styles.resetButton}
            textColor="white"
          >
            Reset Progress
          </Button>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f4f4f4',
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#3670a1',
    marginBottom: 20,
    textAlign: 'center',
  },
  progressCard: {
    backgroundColor: '#3670a1',
    marginBottom: 20,
    elevation: 4,
  },
  progressValue: {
    fontSize: 36,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
  },
  progressText: {
    fontSize: 18,
    color: 'white',
    textAlign: 'center',
    marginTop: 8,
  },
  tableContainer: {
    backgroundColor: 'white',
    borderRadius: 10,
    elevation: 2,
    marginBottom: 20,
  },
  tableRow: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  exerciseInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  exerciseName: {
    fontSize: 16,
    fontWeight: '500',
  },
  scoreText: {
    fontSize: 16,
    color: '#666',
  },
  dateStatus: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dateText: {
    color: '#666',
  },
  completedBadge: {
    backgroundColor: '#4caf50',
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: 20,
  },
  completedText: {
    color: 'white',
    fontSize: 14,
  },
  startButton: {
    backgroundColor: '#3670a1',
  },
  totalRow: {
    padding: 16,
    borderTopWidth: 2,
    borderTopColor: '#3670a1',
    backgroundColor: 'rgba(54, 112, 161, 0.05)',
  },
  totalText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#3670a1',
    marginBottom: 4,
  },
  resetButton: {
    backgroundColor: '#f44336',
    marginTop: 20,
  },
});