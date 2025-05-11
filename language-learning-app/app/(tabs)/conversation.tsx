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
import { useLanguageStore } from "@/store/languageStore";
import { getConversation } from "@/services/api";
import { ConversationResponse } from "@/types/api";
import LoadingIndicator from "@/components/LoadingIndicator";
import ErrorView from "@/components/ErrorView";

export default function ConversationScreen() {
  const { sourceLanguage, targetLanguage } = useLanguageStore();
  const [conversation, setConversation] = useState<ConversationResponse | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchConversation = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getConversation(sourceLanguage, targetLanguage);
      setConversation(data);
    } catch (err) {
      setError("Failed to load conversation. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchConversation();
  }, [sourceLanguage, targetLanguage]);

  if (loading) {
    return <LoadingIndicator message="Generating conversation..." />;
  }

  if (error) {
    return <ErrorView message={error} onRetry={fetchConversation} />;
  }

  return (
    <View style={styles.container}>
      <LanguageSelector />

      <View style={styles.header}>
        <Text style={styles.title}>Slang Hang</Text>
        <TouchableOpacity
          style={styles.refreshButton}
          onPress={fetchConversation}
        >
          <RefreshCw size={20} color={Colors.primary} />
        </TouchableOpacity>
      </View>

      {conversation && (
        <>
          <View style={styles.contextContainer}>
            <Text style={styles.contextLabel}>Context:</Text>
            <Text style={styles.contextText}>{conversation.context}</Text>
          </View>

          <ScrollView style={styles.conversationContainer}>
            {conversation.dialogue.map((message, index) => (
              <View
                key={index}
                style={[
                  styles.messageContainer,
                  index % 2 === 0 ? styles.leftMessage : styles.rightMessage,
                ]}
              >
                <View style={styles.messageHeader}>
                  <Text style={styles.speakerName}>{message.speaker}</Text>
                </View>
                <View style={styles.messageBubble}>
                  <Text style={styles.messageText}>{message.message}</Text>
                </View>
                {message.notes && (
                  <View style={styles.notesContainer}>
                    <Text style={styles.notesText}>{message.notes}</Text>
                  </View>
                )}
              </View>
            ))}
          </ScrollView>
        </>
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
  contextContainer: {
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
  contextLabel: {
    fontSize: 16,
    fontWeight: "bold",
    color: Colors.text,
    marginBottom: 4,
  },
  contextText: {
    fontSize: 14,
    color: Colors.text,
    lineHeight: 20,
  },
  conversationContainer: {
    flex: 1,
  },
  messageContainer: {
    marginBottom: 16,
    maxWidth: "80%",
  },
  leftMessage: {
    alignSelf: "flex-start",
  },
  rightMessage: {
    alignSelf: "flex-end",
  },
  messageHeader: {
    marginBottom: 4,
  },
  speakerName: {
    fontSize: 14,
    fontWeight: "bold",
    color: Colors.textLight,
  },
  messageBubble: {
    backgroundColor: Colors.card,
    padding: 12,
    borderRadius: 16,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  messageText: {
    fontSize: 16,
    color: Colors.text,
  },
  notesContainer: {
    marginTop: 4,
    padding: 8,
    backgroundColor: `${Colors.primary}10`,
    borderRadius: 8,
  },
  notesText: {
    fontSize: 12,
    color: Colors.textLight,
    fontStyle: "italic",
  },
});
