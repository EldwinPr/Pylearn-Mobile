import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { Button } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import NavHeader from '../../components/NavHeader';
import { config } from 'src/config/api';

interface Question {
  question: string;
  options: string[];
  correctAnswer: number;
  userAnswer?: number;
}

const quizData: Question[] = [
  {
    question: "Apa cara yang benar untuk mendeklarasikan variabel di Python?",
    options: ["var x = 5", "let x = 5", "x = 5", "int x = 5"],
    correctAnswer: 2
  },
  {
    question: "Manakah dari berikut ini yang digunakan untuk memberikan komentar satu baris di Python?",
    options: ["//", "/* */", "#", "--"],
    correctAnswer: 2
  },
  {
    question: "Apa output dari print(2 ** 3)?",
    options: ["6", "8", "5", "Error"],
    correctAnswer: 1
  },
  {
    question: "Manakah dari berikut ini yang BUKAN tipe data yang valid di Python?",
    options: ["int", "float", "boolean", "char"],
    correctAnswer: 3
  },
  {
    question: "Apa cara yang benar untuk membuat fungsi di Python?",
    options: ["function myFunc():", "def myFunc():", "create myFunc():", "func myFunc():"],
    correctAnswer: 1
  }
];

export default function MultipleChoiceScreen() {
  const [questions, setQuestions] = useState<Question[]>(quizData);
  const [showResults, setShowResults] = useState(false);
  const [score, setScore] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSelect = (questionIndex: number, optionIndex: number) => {
    if (isLoading) return;
    setQuestions(prev => prev.map((q, idx) => 
      idx === questionIndex ? { ...q, userAnswer: optionIndex } : q
    ));
  };

  const updateProgress = async (newScore: number) => {
    try {
      setIsLoading(true);
      const token = await AsyncStorage.getItem('token');
      const userEmail = await AsyncStorage.getItem('userEmail');
      
      if (!userEmail) throw new Error('Not authenticated');

      const response = await fetch(`${config.API_URL}/progress/update`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          user_email: userEmail,
          score: newScore,
          mult: true
        })
      });

      if (!response.ok) throw new Error('Failed to update progress');
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (questions.some(q => q.userAnswer === undefined)) {
      setError('Please answer all questions');
      return;
    }

    const newScore = questions.reduce((total, q) => 
      q.userAnswer === q.correctAnswer ? total + 20 : total, 0);
    
    await updateProgress(newScore);
    setScore(newScore);
    setShowResults(true);
    setError(null);
  };

  const handleReset = () => {
    setQuestions(quizData.map(q => ({ ...q, userAnswer: undefined })));
    setShowResults(false);
    setScore(0);
    setError(null);
  };

  return (
    <ScrollView style={styles.container}>
      <NavHeader />
      <View style={styles.content}>
        <Text style={styles.title}>Multiple Choice Quiz</Text>
        
        {error && <Text style={styles.errorText}>{error}</Text>}
        
        {!showResults ? (
          <>
            {questions.map((question, qIndex) => (
              <View key={qIndex} style={styles.questionCard}>
                <Text style={styles.questionText}>
                  {qIndex + 1}. {question.question}
                </Text>
                <View style={styles.optionsContainer}>
                  {question.options.map((option, oIndex) => (
                    <TouchableOpacity
                      key={oIndex}
                      style={[
                        styles.option,
                        question.userAnswer === oIndex && styles.selectedOption
                      ]}
                      onPress={() => handleSelect(qIndex, oIndex)}
                      disabled={isLoading}
                    >
                      <Text style={[
                        styles.optionText,
                        question.userAnswer === oIndex && styles.selectedOptionText
                      ]}>
                        {option}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            ))}
            <Button 
              mode="contained"
              onPress={handleSubmit}
              style={styles.submitButton}
              loading={isLoading}
              disabled={isLoading}
              labelStyle={{ color: '#fff' }}
            >
              Submit Answers
            </Button>
          </>
        ) : (
          <View style={styles.resultsContainer}>
            <Text style={styles.scoreText}>Your Score: {score} out of 100</Text>
            <Button 
              mode="contained"
              onPress={handleReset}
              style={styles.resetButton}
              labelStyle={{ color: '#000000' }}
            >
              Try Again
            </Button>
          </View>
        )}
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
    backgroundColor: 'white',
    borderRadius: 12,
    margin: 16,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
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
    marginBottom: 20,
    textAlign: 'center',
  },
  errorText: {
    color: '#f44336',
    textAlign: 'center',
    marginBottom: 16,
    fontSize: 16,
  },
  questionCard: {
    marginBottom: 16,
    backgroundColor: '#f8f9fa',
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  questionText: {
    fontSize: 16,
    marginBottom: 12,
    color: '#333',
  },
  optionsContainer: {
    gap: 8,
  },
  option: {
    padding: 10,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#ddd',
    backgroundColor: '#fff',
  },
  selectedOption: {
    backgroundColor: '#3670a1',
    borderColor: '#3670a1',
  },
  optionText: {
    fontSize: 16,
    color: '#333',
  },
  selectedOptionText: {
    color: 'white',
  },
  submitButton: {
    marginTop: 20,
    backgroundColor: '#3670a1',
  },
  resetButton: {
    marginTop: 20,
    backgroundColor: '#ffc107',
  },
  resultsContainer: {
    alignItems: 'center',
    padding: 20,
  },
  scoreText: {
    fontSize: 24,
    color: '#3670a1',
    marginBottom: 20,
    fontWeight: 'bold',
  },
});