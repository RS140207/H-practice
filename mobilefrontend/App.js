import React, { useState } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  TextInput, 
  ScrollView, 
  SafeAreaView, 
  KeyboardAvoidingView, 
  Platform,
  Alert
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { LinearGradient } from 'expo-linear-gradient';
import { MotiView, AnimatePresence } from 'moti';
import { Youtube, Sparkles, FileText } from 'lucide-react-native';

import { Colors, Spacing } from './src/theme/colors';
import { Button } from './src/components/Button';
import { Card } from './src/components/Card';
import { transcribeVideo, summarizeVideo } from './src/api/client';

export default function App() {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [type, setType] = useState(null); // 'transcript' or 'summary'

  const handleAction = async (action) => {
    if (!url) {
      Alert.alert('Error', 'Please enter a YouTube URL');
      return;
    }

    setLoading(true);
    setResult(null);
    try {
      let data;
      if (action === 'transcribe') {
        data = await transcribeVideo(url);
        setResult(data.transcript);
        setType('transcript');
      } else {
        data = await summarizeVideo(url);
        setResult(data.summary);
        setType('summary');
      }
    } catch (error) {
      console.error(error);
      const errorMsg = error.response?.data?.detail || error.message || 'Something went wrong';
      Alert.alert('Error', errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />
      <LinearGradient
        colors={[Colors.background, '#1E1B4B']}
        style={StyleSheet.absoluteFill}
      />
      
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <MotiView 
            from={{ opacity: 0, translateY: -20 }}
            animate={{ opacity: 1, translateY: 0 }}
            transition={{ type: 'timing', duration: 1000 }}
            style={styles.header}
          >
            <Sparkles size={32} color={Colors.secondary} />
            <Text style={styles.title}>AuraSense</Text>
            <Text style={styles.subtitle}>AI YouTube Intelligence</Text>
          </MotiView>

          <MotiView
            from={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 300, type: 'spring' }}
          >
            <Card style={styles.inputCard}>
              <View style={styles.inputWrapper}>
                <Youtube size={20} color={Colors.textMuted} style={styles.inputIcon} />
                <TextInput
                  placeholder="Paste YouTube URL here..."
                  placeholderTextColor={Colors.textMuted}
                  style={styles.input}
                  value={url}
                  onChangeText={setUrl}
                  autoCapitalize="none"
                  autoCorrect={false}
                />
              </View>

              <View style={styles.buttonRow}>
                <Button 
                  title="Transcribe" 
                  onPress={() => handleAction('transcribe')}
                  loading={loading && type === 'transcript'}
                  style={{ flex: 1, marginRight: Spacing.sm }}
                  variant="secondary"
                />
                <Button 
                  title="Summarize" 
                  onPress={() => handleAction('summarize')}
                  loading={loading && type === 'summary'}
                  style={{ flex: 1 }}
                />
              </View>
            </Card>
          </MotiView>

          <AnimatePresence>
            {result && (
              <MotiView
                from={{ opacity: 0, translateY: 20 }}
                animate={{ opacity: 1, translateY: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                style={styles.resultContainer}
              >
                <View style={styles.resultHeader}>
                  {type === 'summary' ? (
                    <Sparkles size={20} color={Colors.primary} />
                  ) : (
                    <FileText size={20} color={Colors.accent} />
                  )}
                  <Text style={styles.resultTitle}>
                    {type === 'summary' ? 'AI Summary' : 'Transcript'}
                  </Text>
                </View>
                <Card style={styles.resultCard}>
                  <Text style={styles.resultText}>{result}</Text>
                </Card>
              </MotiView>
            )}
          </AnimatePresence>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollContent: {
    padding: Spacing.lg,
    paddingTop: 60,
  },
  header: {
    alignItems: 'center',
    marginBottom: Spacing.xl,
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
    color: Colors.text,
    marginTop: Spacing.sm,
  },
  subtitle: {
    fontSize: 16,
    color: Colors.textMuted,
    letterSpacing: 1,
  },
  inputCard: {
    marginBottom: Spacing.lg,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0F172A',
    borderRadius: 12,
    paddingHorizontal: Spacing.md,
    marginBottom: Spacing.md,
    borderWidth: 1,
    borderColor: '#334155',
  },
  inputIcon: {
    marginRight: Spacing.sm,
  },
  input: {
    flex: 1,
    height: 50,
    color: Colors.text,
    fontSize: 14,
  },
  buttonRow: {
    flexDirection: 'row',
  },
  resultContainer: {
    marginTop: Spacing.md,
  },
  resultHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.sm,
    paddingLeft: Spacing.xs,
  },
  resultTitle: {
    color: Colors.text,
    fontSize: 18,
    fontWeight: '600',
    marginLeft: Spacing.sm,
  },
  resultCard: {
    padding: Spacing.lg,
  },
  resultText: {
    color: Colors.text,
    lineHeight: 24,
    fontSize: 15,
  },
});
