import React, { useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, TextInput, Button, Card, ProgressBar, IconButton } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { config } from 'src/config/api';
import NavHeader from '../../../components/NavHeader';
import { FontAwesome5 } from '@expo/vector-icons';

interface Question {
  question: string;
  blank: string;
  answer: string;
  size: number;
}

const questions: Question[] = [
  {
    question: "Untuk mencetak \"Hello World\" di Python:",
    blank: "[blank](\"Hello World\")",
    answer: "print",
    size: 8
  },
  {
    question: "Untuk mendeklarasikan variabel bernama 'x' dengan nilai 5:",
    blank: "x [blank] 5",
    answer: "=",
    size: 4
  },
  {
    question: "Untuk membuat fungsi bernama 'greet':",
    blank: "[blank] greet():",
    answer: "def",
    size: 6
  },
  {
    question: "Untuk mengimpor modul 'random':",
    blank: "[blank] random",
    answer: "import",
    size: 8
  },
  {
    question: "Untuk membuat list bernama 'fruits' dengan item 'apple' dan 'banana':",
    blank: "fruits = [blank]",
    answer: "[\"apple\", \"banana\"]",
    size: 25
  }
];

export default function FillScreen() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answer, setAnswer] = useState('');
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [progress, setProgress] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getAuthHeaders = async () => {
    const token = await AsyncStorage.getItem('token');
    return {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    };
  };

  const updateProgress = async (finalScore: number) => {
    try {
      setIsLoading(true);
      const headers = await getAuthHeaders();
      const userEmail = await AsyncStorage.getItem('userEmail');
      
      if (!userEmail) throw new Error('User not authenticated');

      const response = await fetch(`${config.API_URL}/progress/update`, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          user_email: userEmail,
          score: finalScore,
          fill: true
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update progress');
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const checkAnswer = async () => {
    if (!answer.trim()) {
      setError('Please enter an answer');
      return;
    }

    const correct = answer.toLowerCase() === questions[currentQuestion].answer.toLowerCase();
    setIsCorrect(correct);
    
    if (correct) {
      setScore(prevScore => prevScore + 20);
    }

    if (currentQuestion === questions.length - 1) {
      const finalScore = correct ? score + 20 : score;
      try {
        await updateProgress(finalScore);
      } catch (error) {
        console.error('Error updating progress:', error);
      }
      setShowResult(true);
    }
    setProgress((currentQuestion + 1) / questions.length);
  };

  const nextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
      setAnswer('');
      setIsCorrect(null);
      setError(null);
    }
  };

  const restartQuiz = () => {
    setCurrentQuestion(0);
    setScore(0);
    setAnswer('');
    setShowResult(false);
    setIsCorrect(null);
    setProgress(0);
    setError(null);
  };

  if (showResult) {
    return (
      <ScrollView style={styles.container}>
        <NavHeader />
        <Card style={styles.contentSection}>
          <Card.Content>
            <View style={styles.resultContainer}>
              <Text style={styles.title}>Quiz Complete!</Text>
              <FontAwesome5 name="trophy" size={64} color="#FFD700" style={styles.icon} />
              <Text style={styles.scoreText}>Your final score: {score} out of 100 points</Text>
              <Text style={styles.scoreSubtext}>({score/20} correct answers out of 5 questions)</Text>
              <Button
                mode="contained"
                onPress={restartQuiz}
                style={styles.submitButton}
                labelStyle={{ color: '#ffff' }}
                disabled={isLoading}
              >
                Try Again
              </Button>
            </View>
          </Card.Content>
        </Card>
      </ScrollView>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <NavHeader />
      <Card style={styles.contentSection}>
        <Card.Content style={styles.cardContent}>
          <View style={styles.header}>
            <Text style={styles.title}>Fill in the Blanks</Text>
            <Text style={styles.subtitle}>Complete the Python syntax:</Text>
            <ProgressBar 
              progress={progress} 
              color="#4A90E2" 
              style={styles.progressBar} 
            />
          </View>
          
          {error && (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>{error}</Text>
            </View>
          )}

          <View style={styles.questionContainer}>
            <Text style={styles.questionText}>{questions[currentQuestion].question}</Text>
            <View style={styles.codeContainer}>
              <Text style={styles.codeText}>
                {questions[currentQuestion].blank.split('[blank]')[0]}
              </Text>
              <TextInput
                value={answer}
                onChangeText={text => {
                  setAnswer(text);
                  setError(null);
                }}
                style={[
                  styles.input,
                  { width: questions[currentQuestion].size * 12 }
                ]}
                mode="outlined"
                disabled={isCorrect !== null || isLoading}
                theme={{ colors: { primary: 'black'} }}
              />
              <Text style={styles.codeText}>
                {questions[currentQuestion].blank.split('[blank]')[1]}
              </Text>
            </View>
          </View>

          {isCorrect !== null && (
            <View style={[
              styles.feedbackContainer,
              isCorrect ? styles.correct : styles.incorrect
            ]}>
              <IconButton
                icon={isCorrect ? "check-circle" : "close-circle"}
                size={24}
                iconColor={isCorrect ? "#4CAF50" : "#F44336"}
              />
              <Text style={[
                styles.feedbackText,
                { color: isCorrect ? "#2E7D32" : "#C62828" }
              ]}>
                {isCorrect ? 'Correct! +20 points' : `Incorrect. The correct answer is "${questions[currentQuestion].answer}".`}
              </Text>
            </View>
          )}

          <View style={styles.buttonContainer}>
            <Button
              mode="contained"
              onPress={isCorrect !== null ? nextQuestion : checkAnswer}
              style={styles.submitButton}
              labelStyle={{ color: '#ffff' }}
              loading={isLoading}
              disabled={isLoading}
            >
              {isCorrect !== null ? 'Next Question' : 'Submit'}
            </Button>
            {isCorrect === null && (
              <Button
                mode="outlined"
                onPress={() => setAnswer('')}
                style={styles.resetButton}
                labelStyle={{ color: 'black' }}
                disabled={!answer || isLoading}
              >
                Clear
              </Button>
            )}
          </View>
        </Card.Content>
      </Card>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f2f5',
  },
  cardContent: {
    padding: 16,
  },
  contentSection: {
    backgroundColor: 'white',
    borderRadius: 12,
    margin: 16,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    maxWidth: 800,
    alignSelf: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#3670a1',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 20,
    textAlign: 'center',
  },
  header: {
    marginBottom: 24,
  },
  progressBar: {
    marginTop: 12,
    height: 6,
    borderRadius: 3,
  },
  questionContainer: {
    marginBottom: 24,
  },
  questionText: {
    fontSize: 18,
    lineHeight: 28,
    color: '#333',
    marginBottom: 16,
  },
  codeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 8,
    backgroundColor: '#f8f9fa',
    padding: 16,
    borderRadius: 8,
  },
  codeText: {
    fontFamily: 'monospace',
    fontSize: 16,
    color: '#333',
  },
  input: {
    backgroundColor: 'white',
    minWidth: 60,
    borderRadius: 4,
  },
  feedbackContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 20,
    padding: 16,
    borderRadius: 8,
  },
  feedbackText: {
    fontSize: 16,
    fontWeight: '600',
    flex: 1,
    marginLeft: 8,
  },
  correct: {
    backgroundColor: '#E8F5E9',
  },
  incorrect: {
    backgroundColor: '#FFEBEE',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 12,
    marginTop: 20,
  },
  submitButton: {
    backgroundColor: '#3670a1',
    borderRadius: 8,
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  resetButton: {
    flex: 1,
    maxWidth: 100,
    borderRadius: 8,
    backgroundColor: '#ffc107',
  },
  resultContainer: {
    alignItems: 'center',
    padding: 24,
  },
  icon: {
    marginVertical: 24,
  },
  scoreText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 8,
    textAlign: 'center',
  },
  scoreSubtext: {
    fontSize: 18,
    color: '#666',
    marginBottom: 24,
    textAlign: 'center',
  },
  errorContainer: {
    backgroundColor: '#FFEBEE',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  errorText: {
    color: '#C62828',
    textAlign: 'center',
    fontSize: 16,
  },
});

