import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { config } from 'src/config/api';
import NavHeader from '../../components/NavHeader';

const { width } = Dimensions.get('window');

interface DropSlot {
  id: string;
  content: string | null;
  isCorrect?: boolean;
}

export default function DragScreen() {
  const [dropSlots, setDropSlots] = useState<DropSlot[]>([
    { id: 'slot1', content: null },
    { id: 'slot2', content: null }
  ]);

  const dragItems = [
    { id: '1', text: 'print' },
    { id: '2', text: '("Hello World")' },
    { id: '3', text: 'System.out.println' }
  ];

  const [selectedItem, setSelectedItem] = useState<string | null>(null);
  const correctAnswers = ['print', '("Hello World")'];

  const handleItemPress = (itemText: string) => {
    if (selectedItem === itemText) {
      setSelectedItem(null);
    } else {
      setSelectedItem(itemText);
    }
  };

  const handleSlotPress = (slotId: string) => {
    if (selectedItem) {
      setDropSlots(currentSlots =>
        currentSlots.map(slot => {
          if (slot.id === slotId) {
            // Check if this answer is correct for this position
            const index = currentSlots.findIndex(s => s.id === slotId);
            const isCorrect = selectedItem === correctAnswers[index];
            return {
              ...slot,
              content: selectedItem,
              isCorrect
            };
          }
          return slot;
        })
      );
      setSelectedItem(null);

      // After updating the slots, check all answers
      setTimeout(checkAnswers, 100);
    }
  };

  const checkAnswers = async () => {
    const allFilled = dropSlots.every(slot => slot.content !== null);
    if (!allFilled) return;

    let correctCount = dropSlots.reduce((count, slot, index) => {
      return slot.content === correctAnswers[index] ? count + 1 : count;
    }, 0);

    if (correctCount > 0) {
      const score = correctCount * 50; // 50 points per correct answer
      if (correctCount === correctAnswers.length) {
        try {
          await updateProgress(score);
          alert(`Perfect! You scored ${score} points!`);
        } catch (error) {
          console.error('Error updating progress:', error);
        }
      }
    }
  };

  const updateProgress = async (score: number) => {
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
          score: score,
          drag: true
        })
      });

      if (!response.ok) {
        throw new Error('Failed to update progress');
      }
    } catch (error) {
      console.error('Error updating progress:', error);
    }
  };

  const handleReset = () => {
    setDropSlots(slots => slots.map(slot => ({ 
      ...slot, 
      content: null,
      isCorrect: undefined 
    })));
    setSelectedItem(null);
  };

  return (
    <View style={styles.container}>
      <View style={styles.contentSection}>
        <NavHeader />
        <Text style={styles.title}>Drag and Drop</Text>
        <Text style={styles.subtitle}>Letakan Blok di tempat yang sesuai:</Text>

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
            >
              <Text style={styles.dragItemText}>{item.text}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity 
          style={styles.resetButton}
          onPress={handleReset}
        >
          <Text style={styles.resetButtonText}>Reset</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f4f4f4',
    padding: 20,
  },
  contentSection: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#3670a1',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 20,
  },
  outputDisplay: {
    backgroundColor: '#f8f8f8',
    padding: 15,
    borderRadius: 5,
    marginBottom: 20,
  },
  outputText: {
    fontSize: 16,
    textAlign: 'center',
  },
  dropZoneContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 10,
    marginBottom: 20,
  },
  dropSlot: {
    width: width > 600 ? 180 : 150,
    height: 50,
    backgroundColor: '#f4f4f4',
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
  },
  dropSlotFilled: {
    backgroundColor: '#e8f4ff',
    borderColor: '#3670a1',
  },
  dropSlotActive: {
    borderColor: '#ffc107',
    borderWidth: 2,
    borderStyle: 'dashed',
  },
  slotText: {
    color: '#666',
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
    padding: 10,
    borderRadius: 5,
    minWidth: 100,
  },
  dragItemSelected: {
    backgroundColor: '#ffc107',
    transform: [{ scale: 1.05 }],
  },
  dragItemText: {
    color: 'white',
    textAlign: 'center',
  },
  resetButton: {
    backgroundColor: '#3670a1',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
  },
  resetButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
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