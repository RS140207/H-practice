import React, { useState } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  TextInput, 
  ScrollView, 
  KeyboardAvoidingView, 
  Platform,
  Alert
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { LinearGradient } from 'expo-linear-gradient';
import { MotiView, AnimatePresence } from 'moti';
import { Youtube, Sparkles, FileText } from 'lucide-react-native';
import Markdown from 'react-native-markdown-display';

import { Colors, Spacing } from './src/theme/colors';
import { Button } from './src/components/Button';
import { Card } from './src/components/Card';
import { transcribeVideo, summarizeVideo } from './src/api/client';

export default function App() {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [type, setType] = useState(null); // 'transcript' or 'summary'
  const [error, setError] = useState(null);

  const handleAction = async (action) => {
    if (!url) {
      setError('Please enter a YouTube URL');
      return;
    }

    setLoading(true);
    setResult(null);
    setError(null);
    setType(action === 'transcribe' ? 'transcript' : 'summary');
    
    try {
      let data;
      if (action === 'transcribe') {
        data = await transcribeVideo(url);
        setResult(data.transcript);
      } else {
        data = await summarizeVideo(url);
        setResult(data.summary);
      }
    } catch (err) {
      console.error(err);
      const errorMsg = err.response?.data?.detail || err.message || 'Something went wrong';
      setError(errorMsg);
      setResult(null);
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
            {error && (
              <MotiView
                from={{ opacity: 0, translateY: 20 }}
                animate={{ opacity: 1, translateY: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                style={styles.resultContainer}
              >
                <Card style={[styles.resultCard, styles.errorCard]}>
                  <Text style={styles.errorTitle}>⚠️ Error</Text>
                  <Text style={styles.errorText}>{error}</Text>
                </Card>
              </MotiView>
            )}
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
                  {type === 'summary' ? (
                    <Markdown style={markdownStyles}>{result}</Markdown>
                  ) : (
                    <Text style={styles.resultText}>{result}</Text>
                  )}
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
  errorCard: {
    backgroundColor: '#3F1E1E',
    borderWidth: 1,
    borderColor: '#EF4444',
  },
  errorTitle: {
    color: '#FCA5A5',
    fontSize: 18,
    fontWeight: '700',
    marginBottom: Spacing.sm,
  },
  errorText: {
    color: '#FEE2E2',
    lineHeight: 22,
    fontSize: 14,
  },
});

const markdownStyles = {
  body: {
    color: Colors.text,
    fontSize: 15,
    lineHeight: 24,
  },
  heading1: {
    color: Colors.text,
    fontSize: 24,
    fontWeight: '700',
    marginTop: Spacing.md,
    marginBottom: Spacing.sm,
  },
  heading2: {
    color: Colors.text,
    fontSize: 20,
    fontWeight: '600',
    marginTop: Spacing.md,
    marginBottom: Spacing.sm,
  },
  heading3: {
    color: Colors.text,
    fontSize: 18,
    fontWeight: '600',
    marginTop: Spacing.sm,
    marginBottom: Spacing.xs,
  },
  bullet_list: {
    marginVertical: Spacing.xs,
  },
  ordered_list: {
    marginVertical: Spacing.xs,
  },
  list_item: {
    marginVertical: 4,
  },
  paragraph: {
    marginTop: 0,
    marginBottom: Spacing.sm,
    color: Colors.text,
    lineHeight: 24,
  },
  strong: {
    fontWeight: '700',
    color: Colors.primary,
  },
  em: {
    fontStyle: 'italic',
  },
  code_inline: {
    backgroundColor: '#1E293B',
    color: Colors.secondary,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },
  code_block: {
    backgroundColor: '#1E293B',
    padding: Spacing.sm,
    borderRadius: 8,
    marginVertical: Spacing.sm,
  },
  fence: {
    backgroundColor: '#1E293B',
    padding: Spacing.sm,
    borderRadius: 8,
    marginVertical: Spacing.sm,
  },
  link: {
    color: Colors.accent,
  },
  blockquote: {
    backgroundColor: '#1E293B',
    borderLeftColor: Colors.primary,
    borderLeftWidth: 4,
    paddingLeft: Spacing.md,
    paddingVertical: Spacing.xs,
    marginVertical: Spacing.sm,
  },
};
