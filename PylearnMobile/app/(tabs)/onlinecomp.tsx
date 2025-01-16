import React, { useState } from 'react';
import { View, ScrollView, StyleSheet, useWindowDimensions } from 'react-native';
import { Text, TextInput, Button } from 'react-native-paper';
import NavHeader from '../../components/NavHeader';

export default function OnlineCompilerScreen() {
  const [code, setCode] = useState<string>('print("Hello, World!")');
  const [output, setOutput] = useState<string>('Keluaran kode akan muncul di sini...');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { width } = useWindowDimensions();

  const runCode = async () => {
    setIsLoading(true);
    setOutput('Running code...');

    const data = {
      language: "python",
      version: "3.10.0",
      files: [{ content: code }]
    };

    try {
      const response = await fetch('https://emkc.org/api/v2/piston/execute', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
      });

      const result = await response.json();
      setOutput(result.run?.output || result.message || 'An unexpected error occurred.');
    } catch (error) {
      setOutput('Failed to run code. ' + (error instanceof Error ? error.message : String(error)));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <NavHeader />
      <View style={styles.contentContainer}>
        <View style={styles.content}>
          <Text style={styles.title}>Tuliskan kode python mu di bawah!</Text>
          
          <TextInput
            value={code}
            onChangeText={setCode}
            mode="outlined"
            multiline
            numberOfLines={10}
            style={styles.codeInput}
            placeholder="Write your Python code here..."
            textColor="#000000"
            placeholderTextColor="#666666"
          />
          
          <Button
            mode="contained"
            onPress={runCode}
            loading={isLoading}
            disabled={isLoading}
            style={styles.runButton}
            labelStyle={{ color: '#fff' }}
          >
            Jalankan Kode
          </Button>

          <View style={styles.outputSection}>
            <Text style={styles.outputTitle}>Output</Text>
            <View style={styles.outputContainer}>
              <Text style={styles.outputText}>{output}</Text>
            </View>
          </View>
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
  contentContainer: {
    padding: 20,
    alignItems: 'center',
  },
  content: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    width: '100%',
    maxWidth: 800,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#3670a1',
    marginBottom: 20,
    textAlign: 'center',
  },
  codeInput: {
    backgroundColor: 'white',
    marginBottom: 20,
    fontSize: 16,
    minHeight: 200,
    color: '#000000',
    outlineColor: '#000000',
  },
  runButton: {
    backgroundColor: '#3670a1',
    marginBottom: 20,
  },
  outputSection: {
    marginTop: 20,
  },
  outputTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#000',
  },
  outputContainer: {
    backgroundColor: '#f8f8f8',
    padding: 15,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  outputText: {
    fontFamily: 'monospace',
    fontSize: 14,
    color: '#000000',
   },
});