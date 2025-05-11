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
import { getTinyLesson } from "@/services/api";
import { TinyLessonResponse } from "@/types/api";
import LoadingIndicator from "@/components/LoadingIndicator";
import ErrorView from "@/components/ErrorView";

export default function TinyLessonScreen() {
  const { sourceLanguage, targetLanguage } = useLanguageStore();
  const [purpose, setPurpose] = useState("Travel");
  const [lesson, setLesson] = useState<TinyLessonResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchLesson = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getTinyLesson(sourceLanguage, targetLanguage, purpose);
      setLesson(data);
    } catch (err) {
      setError("Failed to load lesson. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLesson();
  }, [sourceLanguage, targetLanguage, purpose]);

  if (loading) {
    return <LoadingIndicator message="Generating your lesson..." />;
  }

  if (error) {
    return <ErrorView message={error} onRetry={fetchLesson} />;
  }

  return (
    <View style={styles.container}>
      <LanguageSelector />
      <PurposeSelector selectedPurpose={purpose} onSelectPurpose={setPurpose} />

      <View style={styles.header}>
        <Text style={styles.title}>Tiny Lesson</Text>
        <TouchableOpacity style={styles.refreshButton} onPress={fetchLesson}>
          <RefreshCw size={20} color={Colors.primary} />
        </TouchableOpacity>
      </View>

      {lesson && (
        <ScrollView style={styles.lessonContainer}>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Vocabulary</Text>
            {lesson.vocabulary.map((item, index) => (
              <View key={index} style={styles.termContainer}>
                <Text style={styles.term}>{item.term}</Text>
                {item.transliteration && (
                  <Text style={styles.transliteration}>
                    [{item.transliteration}]
                  </Text>
                )}
                <Text style={styles.translation}>{item.translation}</Text>
              </View>
            ))}
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Useful Phrases</Text>
            {lesson.phrases.map((item, index) => (
              <View key={index} style={styles.phraseContainer}>
                <Text style={styles.phrase}>{item.phrase}</Text>
                {item.transliteration && (
                  <Text style={styles.transliteration}>
                    [{item.transliteration}]
                  </Text>
                )}
                <Text style={styles.translation}>{item.translation}</Text>
              </View>
            ))}
          </View>
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
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: Colors.text,
    marginBottom: 12,
  },
  termContainer: {
    backgroundColor: Colors.card,
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  term: {
    fontSize: 18,
    fontWeight: "bold",
    color: Colors.text,
    marginBottom: 4,
  },
  transliteration: {
    fontSize: 14,
    color: Colors.textLight,
    marginBottom: 4,
    fontStyle: "italic",
  },
  translation: {
    fontSize: 16,
    color: Colors.text,
  },
  phraseContainer: {
    backgroundColor: Colors.card,
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  phrase: {
    fontSize: 16,
    fontWeight: "bold",
    color: Colors.text,
    marginBottom: 4,
  },
});
