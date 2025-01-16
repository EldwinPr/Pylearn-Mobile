import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  ScrollView,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import Navbar from '../navbar';
import Footer from '../footer';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import config from '../config';

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

const FillInTheBlanks: React.FC = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');
  const [showResult, setShowResult] = useState(false);
  const [isQuizComplete, setIsQuizComplete] = useState(false);
  const router = useRouter();

  useEffect(() => {
  }, [currentQuestion]);

  const checkAnswer = () => {
    const correctAnswer = questions[currentQuestion].answer;
    if (userAnswer.toLowerCase() === correctAnswer.toLowerCase()) {
      setScore(prevScore => prevScore + 20);
      Alert.alert('Correct!', '+20 points');
    } else {
      Alert.alert('Incorrect', `The correct answer is "${correctAnswer}".`);
    }
    setShowResult(true);
  };

  const nextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(prevQuestion => prevQuestion + 1);
      setUserAnswer('');
      setShowResult(false);
    } else {
      showFinalResult();
    }
  };

  const showFinalResult = async () => {
    setIsQuizComplete(true);
    // await updateProgress('fill', score);
  };

  const restartQuiz = () => {
    setCurrentQuestion(0);
    setScore(0);
    setUserAnswer('');
    setShowResult(false);
    setIsQuizComplete(false);
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

  const renderQuestion = () => {
    const question = questions[currentQuestion];
    return (
      <View>
        <Text style={styles.questionText}>{question.question}</Text>
        <View style={styles.blankContainer}>
          {question.blank.split('[blank]').map((part, index, array) => (
            <React.Fragment key={index}>
              <Text>{part}</Text>
              {index < array.length - 1 && (
                <TextInput
                  style={[styles.input, { width: question.size * 12 }]}
                  value={userAnswer}
                  onChangeText={setUserAnswer}
                  maxLength={question.size + 5}
                />
              )}
            </React.Fragment>
          ))}
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Navbar />
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>Fill in the Blanks - Python Syntax</Text>
        <View style={styles.progressBar}>
          <View style={[styles.progress, { width: `${((currentQuestion + 1) / questions.length) * 100}%` }]} />
        </View>
        {!isQuizComplete ? (
          <>
            {renderQuestion()}
            {!showResult ? (
              <TouchableOpacity style={styles.button} onPress={checkAnswer}>
                <Text style={styles.buttonText}>Submit Answer</Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity style={styles.button} onPress={nextQuestion}>
                <Text style={styles.buttonText}>Next Question</Text>
              </TouchableOpacity>
            )}
          </>
        ) : (
          <View style={styles.finalResult}>
            <Text style={styles.finalScoreText}>Quiz Complete!</Text>
            <Text style={styles.scoreBreakdown}>Your final score: {score} out of 100 points</Text>
            <Text style={styles.scoreBreakdown}>({score/20} correct answers out of 5 questions)</Text>
            <TouchableOpacity style={styles.button} onPress={restartQuiz}>
              <Text style={styles.buttonText}>Try Again</Text>
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
    marginBottom: 20,
    textAlign: 'center',
  },
  progressBar: {
    height: 10,
    backgroundColor: '#e0e0e0',
    borderRadius: 5,
    marginBottom: 20,
  },
  progress: {
    height: '100%',
    backgroundColor: '#4CAF50',
    borderRadius: 5,
  },
  questionText: {
    fontSize: 18,
    marginBottom: 10,
  },
  blankContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    marginBottom: 20,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    paddingHorizontal: 10,
    minWidth: 60,
  },
  button: {
    backgroundColor: '#4CAF50',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
  },
  finalResult: {
    alignItems: 'center',
  },
  finalScoreText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  scoreBreakdown: {
    fontSize: 18,
    marginBottom: 5,
  },
});

export default FillInTheBlanks;

