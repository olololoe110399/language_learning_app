import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { RefreshCw } from "lucide-react-native";
import Colors from "@/constants/colors";
import LanguageSelector from "@/components/LanguageSelector";
import PurposeSelector from "@/components/PurposeSelector";
import { useLanguageStore } from "@/store/languageStore";
import { getGrammarLesson } from "@/services/api";
import { GrammarResponse } from "@/types/api";
import LoadingIndicator from "@/components/LoadingIndicator";
import ErrorView from "@/components/ErrorView";

export default function GrammarLessonScreen() {
  const { sourceLanguage, targetLanguage } = useLanguageStore();
  const [purpose, setPurpose] = useState("Travel");
  const [lesson, setLesson] = useState<GrammarResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchLesson = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getGrammarLesson(
        sourceLanguage,
        targetLanguage,
        purpose
      );
      setLesson(data);
    } catch (err) {
      setError("Failed to load grammar lesson. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLesson();
  }, [sourceLanguage, targetLanguage, purpose]);

  if (loading) {
    return <LoadingIndicator message="Generating grammar lesson..." />;
  }

  if (error) {
    return <ErrorView message={error} onRetry={fetchLesson} />;
  }

  return (
    <View style={styles.container}>
      <LanguageSelector />
      <PurposeSelector selectedPurpose={purpose} onSelectPurpose={setPurpose} />

      <View style={styles.header}>
        <Text style={styles.title}>Grammar Lesson</Text>
        <TouchableOpacity style={styles.refreshButton} onPress={fetchLesson}>
          <RefreshCw size={20} color={Colors.primary} />
        </TouchableOpacity>
      </View>

      {lesson && (
        <ScrollView style={styles.lessonContainer}>
          {lesson.relevantGrammar.map((topic, topicIndex) => (
            <View key={topicIndex} style={styles.topicContainer}>
              <Text style={styles.topicTitle}>{topic.topic}</Text>
              <Text style={styles.topicDescription}>{topic.description}</Text>

              <View style={styles.examplesContainer}>
                <Text style={styles.examplesTitle}>Examples:</Text>
                {topic.examples.map((example, exampleIndex) => (
                  <View key={exampleIndex} style={styles.exampleContainer}>
                    <Text style={styles.exampleSentence}>
                      {example.sentence}
                    </Text>
                    <Text style={styles.exampleExplanation}>
                      {example.explanation}
                    </Text>
                  </View>
                ))}
              </View>
            </View>
          ))}
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    padding: 20,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: Colors.text,
  },
  refreshButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: `${Colors.primary}20`,
  },
  lessonContainer: {
    flex: 1,
  },
  topicContainer: {
    backgroundColor: Colors.card,
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  topicTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: Colors.text,
    marginBottom: 8,
  },
  topicDescription: {
    fontSize: 16,
    color: Colors.text,
    lineHeight: 22,
    marginBottom: 16,
  },
  examplesContainer: {
    backgroundColor: `${Colors.primary}10`,
    padding: 12,
    borderRadius: 8,
  },
  examplesTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: Colors.text,
    marginBottom: 8,
  },
  exampleContainer: {
    marginBottom: 12,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: `${Colors.border}80`,
  },
  exampleSentence: {
    fontSize: 16,
    fontWeight: "bold",
    color: Colors.text,
    marginBottom: 4,
  },
  exampleExplanation: {
    fontSize: 14,
    color: Colors.textLight,
    fontStyle: "italic",
  },
});
