import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  PanResponder,
  Animated,
  Dimensions,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import Navbar from '../navbar';
import Footer from '../footer';

const { width } = Dimensions.get('window');

export default function DragAndDrop() {
  const [dropzones, setDropzones] = useState<{ [key: string]: string | null }>({
    dropzone1: null,
    dropzone2: null,
  });
  const [positions, setPositions] = useState({
    draggable1: new Animated.ValueXY(),
    draggable2: new Animated.ValueXY(),
    draggable3: new Animated.ValueXY(),
  });

  const resetDraggable = (key: string) => {
    setDropzones((prev) => {
      const newState = { ...prev };
      Object.keys(prev).forEach((zoneKey) => {
        if (prev[zoneKey] === key) {
          newState[zoneKey] = null;
        }
      });
      return newState;
    });
    positions[key].setValue({ x: 0, y: 0 });
  };

  const checkAnswers = () => {
    const correctAnswers = {
      dropzone1: 'draggable1',
      dropzone2: 'draggable2',
    };

    const isCorrect = Object.entries(correctAnswers).every(
      ([zone, correctAnswer]) => dropzones[zone] === correctAnswer
    );

    if (isCorrect) {
      alert('Perfect! You scored 100 points!');
    } else {
      alert('Some answers are incorrect. Please try again!');
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      resetAnswers();
    }, [])
  );

  const resetAnswers = () => {
    setDropzones({ dropzone1: null, dropzone2: null });
    setPositions({
      draggable1: new Animated.ValueXY(),
      draggable2: new Animated.ValueXY(),
      draggable3: new Animated.ValueXY(),
    });
  };

  const createPanResponder = (key: string) =>
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderMove: (e, gestureState) => {
        positions[key].setValue({
          x: gestureState.dx,
          y: gestureState.dy,
        });
      },
      onPanResponderRelease: (e, gestureState) => {
        const dropzoneBounds = [
          { x: 50, y: 300, width: 100, height: 100, key: 'dropzone1' },
          { x: 200, y: 300, width: 100, height: 100, key: 'dropzone2' },
        ];

        let dropped = false;
        dropzoneBounds.forEach((zone) => {
          if (
            gestureState.moveX >= zone.x &&
            gestureState.moveX <= zone.x + zone.width &&
            gestureState.moveY >= zone.y &&
            gestureState.moveY <= zone.y + zone.height
          ) {
            setDropzones((prev) => ({ ...prev, [zone.key]: key }));
            positions[key].setValue({ x: 0, y: 0 });
            dropped = true;
          }
        });

        if (!dropped) {
          positions[key].setValue({ x: 0, y: 0 });
        }
      },
    });

  return (
    <View style={styles.container}>
      <Navbar />
      <View style={styles.content}>
        <Text style={styles.title}>Drag and Drop</Text>
        <Text style={styles.subtitle}>Output: Hello World</Text>
        <Text style={styles.subtitle}>Letakkan blok di tempat yang sesuai:</Text>

        {/* Drop Zones */}
        <View style={styles.dropzoneContainer}>
          {['dropzone1', 'dropzone2'].map((zone) => (
            <TouchableOpacity
              key={zone}
              style={[styles.dropzone, dropzones[zone] && styles.filled]}
              onPress={() => {
                if (dropzones[zone]) resetDraggable(dropzones[zone]!);
              }}
            >
              {dropzones[zone] && (
                <Text style={styles.draggableText}>
                  {dropzones[zone] === 'draggable1'
                    ? 'print'
                    : dropzones[zone] === 'draggable2'
                    ? '("Hello World")'
                    : 'System.out.println'}
                </Text>
              )}
            </TouchableOpacity>
          ))}
        </View>

        {/* Draggable Items */}
        <View style={styles.draggablesContainer}>
          {Object.keys(positions).map((key) => {
            const isDropped = Object.values(dropzones).includes(key);
            return (
              <Animated.View
                key={key}
                style={[
                  styles.draggable,
                  isDropped ? styles.hidden : positions[key].getLayout(),
                ]}
                {...createPanResponder(key).panHandlers}
              >
                <Text style={styles.draggableText}>
                  {key === 'draggable1'
                    ? 'print'
                    : key === 'draggable2'
                    ? '("Hello World")'
                    : 'System.out.println'}
                </Text>
              </Animated.View>
            );
          })}
        </View>

        {/* Reset and Submit */}
        <TouchableOpacity style={styles.resetButton} onPress={resetAnswers}>
          <Text style={styles.resetButtonText}>Reset</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.submitButton} onPress={checkAnswers}>
          <Text style={styles.submitButtonText}>Submit</Text>
        </TouchableOpacity>
      </View>
      <Footer />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f4f4f4',
  },
  content: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#333',
    textAlign: 'center',
    marginBottom: 20,
  },
  dropzoneContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  dropzone: {
    width: 100,
    height: 100,
    borderWidth: 2,
    borderColor: '#3670a1',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  filled: {
    backgroundColor: '#ffc107',
  },
  draggablesContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  draggable: {
    width: 120,
    height: 50,
    backgroundColor: '#3670a1',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  draggableText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  hidden: {
    display: 'none',
  },
  resetButton: {
    backgroundColor: '#ffc107',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 10,
  },
  resetButtonText: {
    color: '#333',
    fontWeight: 'bold',
  },
  submitButton: {
    backgroundColor: '#3670a1',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  submitButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});
