import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
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
  },
  {
    question: "Manakah dari berikut ini yang digunakan untuk menangani pengecualian di Python?",
    options: ["if-else", "for-in", "try-except", "switch-case"],
    correctAnswer: 2
  },
  {
    question: "Apa output dari print(len('Python'))?",
    options: ["5", "6", "7", "Error"],
    correctAnswer: 1
  },
  {
    question: "Metode mana yang digunakan untuk menambahkan elemen ke akhir list di Python?",
    options: ["append()", "add()", "insert()", "extend()"],
    correctAnswer: 0
  },
  {
    question: "Apa cara yang benar untuk mengimpor modul bernama 'math' di Python?",
    options: ["import math", "include math", "using math", "#include <math>"],
    correctAnswer: 0
  },
  {
    question: "Manakah dari berikut ini yang digunakan untuk mendefinisikan kelas di Python?",
    options: ["def", "class", "struct", "object"],
    correctAnswer: 1
  }
];

export default function MultipleChoiceScreen() {
  const [questions, setQuestions] = useState<Question[]>(quizData);
  const [showResults, setShowResults] = useState(false);
  const [score, setScore] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const getAuthHeaders = async () => {
    const token = await AsyncStorage.getItem('token');
    return {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    };
  };

  const selectOption = (questionIndex: number, optionIndex: number) => {
    if (isLoading) return;
    
    setQuestions(prevQuestions => 
      prevQuestions.map((question, index) => 
        index === questionIndex 
          ? { ...question, userAnswer: optionIndex }
          : question
      )
    );
  };

  const updateProgress = async (newScore: number) => {
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
          score: newScore,
          mult: true
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update progress');
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : 'An error occurred');
      console.error('Progress update error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const checkAnswers = async () => {
    const unanswered = questions.some(q => q.userAnswer === undefined);
    if (unanswered) {
      setError('Please answer all questions before submitting!');
      return;
    }

    try {
      const newScore = questions.reduce((total, question) => 
        question.userAnswer === question.correctAnswer ? total + 10 : total, 0);
      
      setScore(newScore);
      await updateProgress(newScore);
      setShowResults(true);
      setError(null);
    } catch (error) {
      setError('Failed to submit answers. Please try again.');
    }
  };

  const restartQuiz = () => {
    setQuestions(quizData.map(q => ({ ...q, userAnswer: undefined })));
    setShowResults(false);
    setScore(0);
    setError(null);
  };

  if (showResults) {
    return (
      <View style={styles.container}>
        <NavHeader />
        <View style={styles.content}>
          <Text style={styles.title}>Quiz Results</Text>
          <Text style={styles.score}>You scored {score} out of 100 points!</Text>
          <Button 
            mode="contained" 
            onPress={restartQuiz} 
            style={styles.button}
            disabled={isLoading}
          >
            Restart Quiz
          </Button>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <NavHeader />
      <ScrollView style={styles.scrollView}>
        <View style={styles.content}>
          <Text style={styles.title}>Multiple Choice Quiz</Text>
          
          {error && <Text style={styles.errorText}>{error}</Text>}
          
          {questions.map((question, questionIndex) => (
            <View key={questionIndex} style={styles.questionContainer}>
              <Text style={styles.questionText}>
                {questionIndex + 1}. {question.question}
              </Text>
              <View style={styles.optionsContainer}>
                {question.options.map((option, optionIndex) => (
                  <TouchableOpacity
                    key={optionIndex}
                    style={[
                      styles.option,
                      question.userAnswer === optionIndex && styles.selectedOption
                    ]}
                    onPress={() => selectOption(questionIndex, optionIndex)}
                    disabled={isLoading}
                  >
                    <Text style={[
                      styles.optionText,
                      question.userAnswer === optionIndex && styles.selectedOptionText
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
            onPress={checkAnswers}
            style={styles.button}
            loading={isLoading}
            disabled={isLoading}
          >
            Submit Answers
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
  },
  errorText: {
    color: '#f44336',
    textAlign: 'center',
    marginBottom: 16,
    fontSize: 16,
  },
  questionContainer: {
    marginBottom: 24,
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
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
    padding: 12,
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
  button: {
    marginTop: 20,
    backgroundColor: '#3670a1',
  },
  score: {
    fontSize: 20,
    textAlign: 'center',
    marginBottom: 20,
  },
});