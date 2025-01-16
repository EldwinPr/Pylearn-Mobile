import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
// import AsyncStorage from '@react-native-async-storage/async-storage';
import Navbar from '../navbar';
import Footer from '../footer';
// import config from '../config';

interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswer: number;
  userAnswer?: number;
}

const quizData: QuizQuestion[] = [
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

const MultipleChoiceQuiz: React.FC = () => {
  const [questions, setQuestions] = useState<QuizQuestion[]>(quizData);
  const [showResults, setShowResults] = useState(false);
  const [score, setScore] = useState(0);
  const router = useRouter();

  const selectOption = (questionIndex: number, optionIndex: number) => {
    setQuestions(prevQuestions => {
      const newQuestions = [...prevQuestions];
      newQuestions[questionIndex].userAnswer = optionIndex;
      return newQuestions;
    });
  };

  const checkAnswers = () => {
    const unansweredQuestions = questions.some(q => q.userAnswer === undefined);
    if (unansweredQuestions) {
      Alert.alert('Error', 'Please answer all questions before submitting!');
      return;
    }

    const newScore = questions.reduce((acc, question) => {
      return question.userAnswer === question.correctAnswer ? acc + 10 : acc;
    }, 0);

    setScore(newScore);
    // updateProgress('mult', newScore);
    setShowResults(true);
  };

  const restartQuiz = () => {
    setQuestions(quizData.map(q => ({ ...q, userAnswer: undefined })));
    setShowResults(false);
    setScore(0);
  };

  // const updateProgress = async (exerciseType: string, newScore: number) => {
  //   try {
  //     const userEmail = await AsyncStorage.getItem('userEmail');
  //     if (!userEmail) return;

  //     const response = await fetch(`${config.API_URL}/progress?email=${encodeURIComponent(userEmail)}`);
  //     const currentProgress = await response.json();

  //     const updateData = {
  //       user_email: userEmail,
  //       score: newScore,
  //       [exerciseType]: true
  //     };

  //     if (currentProgress && currentProgress.score >= newScore) {
  //       return;
  //     }

  //     const updateResponse = await fetch(`${config.API_URL}/progress/update`, {
  //       method: 'POST',
  //       headers: {
  //         'Content-Type': 'application/json',
  //       },
  //       body: JSON.stringify(updateData)
  //     });

  //     if (!updateResponse.ok) {
  //       throw new Error('Failed to update progress');
  //     }
  //   } catch (error) {
  //     console.error('Error updating progress:', error);
  //   }
  // };

  return (
    <View style={styles.container}>
      <Navbar />
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>Multiple Choice Quiz</Text>
        {!showResults ? (
          <>
            {questions.map((question, questionIndex) => (
              <View key={questionIndex} style={styles.questionContainer}>
                <Text style={styles.questionText}>{`${questionIndex + 1}. ${question.question}`}</Text>
                {question.options.map((option, optionIndex) => (
                  <TouchableOpacity
                    key={optionIndex}
                    style={[
                      styles.option,
                      question.userAnswer === optionIndex && styles.selectedOption
                    ]}
                    onPress={() => selectOption(questionIndex, optionIndex)}
                  >
                    
                    <Text
                      style={[
                        styles.optionText,
                        question.userAnswer === optionIndex && styles.selectedOptionText,
                      ]}
                    >{option}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            ))}
            <TouchableOpacity style={styles.submitButton} onPress={checkAnswers}>
              <Text style={styles.submitButtonText}>Submit Answers</Text>
            </TouchableOpacity>
          </>
        ) : (
          <View style={styles.resultContainer}>
            <Text style={styles.resultText}>Quiz Results</Text>
            <Text style={styles.scoreText}>{`You scored ${score} out of 100 points!`}</Text>
            {questions.map((question, index) => (
              <View key={index} style={styles.answerContainer}>
                <Text style={styles.questionText}>{`${index + 1}. ${question.question}`}</Text>
                <Text style={styles.answerText}>
                  {`Your answer: ${question.options[question.userAnswer ?? -1]}`}
                </Text>
                <Text style={[
                  styles.answerText,
                  question.userAnswer === question.correctAnswer ? styles.correctAnswer : styles.incorrectAnswer
                ]}>
                  {`Correct answer: ${question.options[question.correctAnswer]}`}
                </Text>
              </View>
            ))}
            <TouchableOpacity style={styles.restartButton} onPress={restartQuiz}>
              <Text style={styles.restartButtonText}>Restart Quiz</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
      <Footer />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f0f0',
  },
  content: {
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  questionContainer: {
    marginBottom: 20,
  },
  questionText: {
    fontSize: 18,
    marginBottom: 10,
  },
  option: {
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 5,
    marginBottom: 5,
  },
    optionText: {
    fontSize: 16,
  },
  selectedOption: {
    backgroundColor: '#3670A1',
  },
  selectedOptionText: {
    color: '#fff',
  },

  submitButton: {
    backgroundColor: '#4CAF50',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  resultContainer: {
    alignItems: 'center',
  },
  resultText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  scoreText: {
    fontSize: 20,
    marginBottom: 20,
  },
  answerContainer: {
    marginBottom: 15,
  },
  answerText: {
    fontSize: 16,
  },
  correctAnswer: {
    color: 'green',
  },
  incorrectAnswer: {
    color: 'red',
  },
  restartButton: {
    backgroundColor: '#2196F3',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 20,
  },
  restartButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default MultipleChoiceQuiz;
