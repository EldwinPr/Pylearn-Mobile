import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Dimensions } from 'react-native';
import { Text, TextInput, Button, Card, ProgressBar, IconButton } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { config } from 'src/config/api';
import NavHeader from '../../components/NavHeader';
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

const { width } = Dimensions.get('window');

export default function FillScreen() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answer, setAnswer] = useState('');
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [progress, setProgress] = useState(0);

  const checkAnswer = async () => {
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
    }
  };

  const updateProgress = async (finalScore: number) => {
    try {
      const userEmail = await AsyncStorage.getItem('userEmail');
      if (!userEmail) return;

      const response = await fetch(`${config.API_URL}/progress/update`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_email: userEmail,
          score: finalScore,
          fill: true
        })
      });

      if (!response.ok) {
        throw new Error('Failed to update progress');
      }
    } catch (error) {
      console.error('Error updating progress:', error);
    }
  };

  const restartQuiz = () => {
    setCurrentQuestion(0);
    setScore(0);
    setAnswer('');
    setShowResult(false);
    setIsCorrect(null);
    setProgress(0);
  };

  if (showResult) {
    return (
      <ScrollView style={styles.container}>
        <Card style={styles.card}>
          <Card.Content>
            <Text style={styles.title}>Quiz Complete!</Text>
            <FontAwesome5 name="trophy" size={64} color="#FFD700" style={styles.icon} />
            <Text style={styles.scoreText}>Your final score: {score} out of 100 points</Text>
            <Text style={styles.scoreSubtext}>({score/20} correct answers out of 5 questions)</Text>
            <Button
              mode="contained"
              onPress={restartQuiz}
              style={styles.button}
              labelStyle={styles.buttonLabel}
            >
              Try Again
            </Button>
          </Card.Content>
        </Card>
      </ScrollView>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <NavHeader />
      <Card style={styles.card}>
        <Card.Content style={{ padding: 16 }}>
          <Text style={styles.title}>Fill in the Blanks - Python Syntax</Text>
          <ProgressBar progress={progress} color="#3670a1" style={styles.progressBar} />
          
          <View style={styles.questionContainer}>
            <Text style={styles.questionText}>{questions[currentQuestion].question}</Text>
            <View style={styles.blankContainer}>
              <Text style={styles.codeText}>
                {questions[currentQuestion].blank.split('[blank]')[0]}
              </Text>
              <TextInput
                value={answer}
                onChangeText={setAnswer}
                style={[
                  styles.input,
                  { width: questions[currentQuestion].size * 12 }
                ]}
                mode="outlined"
                disabled={isCorrect !== null}
              />
              <Text style={styles.codeText}>
                {questions[currentQuestion].blank.split('[blank]')[1]}
              </Text>
            </View>
          </View>

          {isCorrect !== null && (
            <View style={[styles.feedbackContainer, isCorrect ? styles.correct : styles.incorrect]}>
              <IconButton
                icon={isCorrect ? "check-circle" : "close-circle"}
                size={24}
                iconColor={isCorrect ? "#4caf50" : "#f44336"}
              />
              <Text style={styles.feedbackText}>
                {isCorrect ? 'Correct! +20 points' : `Incorrect. The correct answer is "${questions[currentQuestion].answer}".`}
              </Text>
            </View>
          )}

          <Button
            mode="contained"
            onPress={isCorrect !== null ? nextQuestion : checkAnswer}
            style={styles.button}
            labelStyle={styles.buttonLabel}
          >
            {isCorrect !== null ? 'Next Question' : 'Submit Answer'}
          </Button>
        </Card.Content>
      </Card>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  card: {
    margin: 16,
    borderRadius: 12,
    elevation: 4,
    maxWidth: 600,
    alignSelf: 'center',
    width: '90%',
  },
  progressBar: {
    marginBottom: 8, // Reduced from 12
    height: 8,
    borderRadius: 4,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 12, // Reduced from 20
    textAlign: 'center',
  },
  questionContainer: {
    marginBottom: 20,
  },
  questionText: {
    fontSize: 18,
    marginBottom: 16,
    color: '#34495e',
  },
  blankContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 8,
  },
  codeText: {
    fontFamily: 'monospace',
    fontSize: 16,
    color: '#2c3e50',
  },
  input: {
    backgroundColor: 'white',
    minWidth: 60,
  },
  feedbackContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 15,
    padding: 10,
    borderRadius: 8,
  },
  feedbackText: {
    fontSize: 16,
    fontWeight: 'bold',
    flex: 1,
  },
  correct: {
    backgroundColor: '#e8f5e9',
  },
  incorrect: {
    backgroundColor: '#ffebee',
  },
  button: {
    marginTop: 20,
    backgroundColor: '#3670a1',
    borderRadius: 8,
    paddingVertical: 8,
  },
  buttonLabel: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  icon: {
    alignSelf: 'center',
    marginBottom: 20,
  },
  scoreText: {
    fontSize: 22,
    textAlign: 'center',
    marginVertical: 10,
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  scoreSubtext: {
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 20,
    color: '#7f8c8d',
  },
});

