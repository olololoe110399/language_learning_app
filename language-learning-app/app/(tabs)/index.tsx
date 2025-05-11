import React from "react";
import { StyleSheet, Text, View, ScrollView } from "react-native";
import { Book, BookOpen, MessageSquare, Camera } from "lucide-react-native";
import Colors from "@/constants/colors";
import LanguageSelector from "@/components/LanguageSelector";
import FeatureCard from "@/components/FeatureCard";

export default function LearnScreen() {
  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
    >
      <View style={styles.header}>
        <Text style={styles.title}>Little Language Lessons</Text>
        <Text style={styles.subtitle}>Learn language in context</Text>
      </View>

      <LanguageSelector />

      <View style={styles.featuresContainer}>
        <FeatureCard
          title="Tiny Lesson"
          description="Learn vocabulary and phrases for specific situations"
          icon={<Book size={24} color={Colors.primary} />}
          route="/tiny-lesson"
          color={Colors.primary}
        />

        <FeatureCard
          title="Grammar Lesson"
          description="Master grammar rules with contextual examples"
          icon={<BookOpen size={24} color="#6C5CE7" />}
          route="/grammar-lesson"
          color="#6C5CE7"
        />

        <FeatureCard
          title="Slang Hang"
          description="Practice with realistic conversations and slang"
          icon={<MessageSquare size={24} color="#00B894" />}
          route="/slang-hang"
          color="#00B894"
        />

        <FeatureCard
          title="Word Cam"
          description="Learn vocabulary by taking photos of objects"
          icon={<Camera size={24} color={Colors.secondary} />}
          route="/word-cam"
          color={Colors.secondary}
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  contentContainer: {
    padding: 20,
  },
  header: {
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: Colors.text,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: Colors.textLight,
  },
  featuresContainer: {
    marginTop: 8,
  },
});
