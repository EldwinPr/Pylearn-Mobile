import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions, ScrollView } from 'react-native';
import { Button } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { config } from 'src/config/api';
import NavHeader from '../../../components/NavHeader';

const { width } = Dimensions.get('window');

interface DropSlot {
  id: string;
  content: string | null;
  isCorrect?: boolean;
}

interface DragItem {
  id: string;
  text: string;
}

export default function DragScreen() {
  const [dropSlots, setDropSlots] = useState<DropSlot[]>([
    { id: 'slot1', content: null },
    { id: 'slot2', content: null }
  ]);
  const [selectedItem, setSelectedItem] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const dragItems: DragItem[] = [
    { id: '1', text: 'print' },
    { id: '2', text: '("Hello World")' },
    { id: '3', text: 'System.out.println' }
  ];

  const correctAnswers = ['print', '("Hello World")'];

  const getAuthHeaders = async () => {
    const token = await AsyncStorage.getItem('token');
    return {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    };
  };

  const handleItemPress = (itemText: string) => {
    if (isLoading) return;
    setSelectedItem(selectedItem === itemText ? null : itemText);
  };

  const handleSlotPress = (slotId: string) => {
    if (!selectedItem || isLoading) return;

    setDropSlots(currentSlots =>
      currentSlots.map(slot => {
        if (slot.id === slotId) {
          const index = currentSlots.findIndex(s => s.id === slotId);
          return {
            ...slot,
            content: selectedItem,
            isCorrect: selectedItem === correctAnswers[index]
          };
        }
        return slot;
      })
    );
    setSelectedItem(null);
  };

  const updateProgress = async (score: number) => {
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
          score,
          drag: true
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

  const handleSubmit = async () => {
    const allFilled = dropSlots.every(slot => slot.content !== null);
    if (!allFilled) {
      setError('Please fill all slots before submitting');
      return;
    }

    const correctCount = dropSlots.reduce((count, slot, index) => 
      slot.content === correctAnswers[index] ? count + 1 : count, 0);

    if (correctCount > 0) {
      const score = correctCount * 50;
      try {
        await updateProgress(score);
        alert(`Score: ${score} points!`);
      } catch (error) {
        console.error('Error updating progress:', error);
      }
    }
  };

  const handleReset = () => {
    setDropSlots(slots => slots.map(slot => ({ 
      ...slot, 
      content: null,
      isCorrect: undefined 
    })));
    setSelectedItem(null);
    setError(null);
  };

  return (
    <ScrollView style={styles.container}>
      <NavHeader />
      <View style={styles.contentSection}>
        <Text style={styles.title}>Drag and Drop</Text>
        <Text style={styles.subtitle}>Place the blocks in the correct order:</Text>

        {error && <Text style={styles.errorText}>{error}</Text>}

        <View style={styles.outputDisplay}>
          <Text style={styles.outputText}>Output: Hello World</Text>
        </View>

        <View style={styles.dropZoneContainer}>
          {dropSlots.map((slot) => (
            <TouchableOpacity
              key={slot.id}
              style={[
                styles.dropSlot,
                slot.content && (slot.isCorrect ? styles.slotCorrect : styles.slotIncorrect),
                !slot.content && selectedItem && styles.dropSlotActive
              ]}
              onPress={() => handleSlotPress(slot.id)}
              disabled={isLoading}
            >
              <Text style={[
                styles.slotText,
                slot.content && slot.isCorrect && styles.textCorrect,
                slot.content && !slot.isCorrect && styles.textIncorrect
              ]}>
                {slot.content || 'Drop Here'}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.itemsContainer}>
          {dragItems.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={[
                styles.dragItem,
                selectedItem === item.text && styles.dragItemSelected
              ]}
              onPress={() => handleItemPress(item.text)}
              disabled={isLoading}
            >
              <Text style={styles.dragItemText}>{item.text}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.buttonContainer}>
        <Button 
          mode="contained" 
          onPress={handleSubmit}
          style={styles.submitButton}
          labelStyle={{ color: '#ffff' }}
        >
          Submit
        </Button>
        <Button 
          mode="outlined" 
          onPress={handleReset}
          style={styles.resetButton}
          labelStyle={{ color: '#000000' }}
        >
          Reset
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
  errorText: {
    color: '#f44336',
    textAlign: 'center',
    marginBottom: 16,
    fontSize: 16,
  },
  outputDisplay: {
    backgroundColor: '#f8f8f8',
    padding: 15,
    borderRadius: 8,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  outputText: {
    fontSize: 16,
    textAlign: 'center',
    fontWeight: '500',
  },
  dropZoneContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 12,
    marginBottom: 20,
  },
  dropSlot: {
    width: width > 600 ? 160 : 140,
    height: 50,
    backgroundColor: '#f4f4f4',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#ddd',
  },
  dropSlotActive: {
    borderColor: '#ffc107',
    borderStyle: 'dashed',
  },
  slotText: {
    color: '#666',
    fontSize: 16,
  },
  itemsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 10,
    marginBottom: 20,
  },
  dragItem: {
    backgroundColor: '#3670a1',
    padding: 12,
    borderRadius: 8,
    minWidth: 100,
  },
  dragItemSelected: {
    backgroundColor: '#ffc107',
    transform: [{ scale: 1.05 }],
  },
  dragItemText: {
    color: 'white',
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '500',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 12,
    marginTop: 20,
  },
  submitButton: {
    backgroundColor: '#3670a1',
    flex: 2,
    maxWidth: 200,
    borderRadius: 8,
  },
  resetButton: {
    flex: 1,
    maxWidth: 100,
    borderRadius: 8,
    backgroundColor: '#ffc107',
  },
  slotCorrect: {
    backgroundColor: '#e8f8e8',
    borderColor: '#4caf50',
  },
  slotIncorrect: {
    backgroundColor: '#ffe8e8',
    borderColor: '#f44336',
  },
  textCorrect: {
    color: '#4caf50',
  },
  textIncorrect: {
    color: '#f44336',
  },
});