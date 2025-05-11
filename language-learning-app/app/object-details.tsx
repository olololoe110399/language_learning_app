import ErrorView from "@/components/ErrorView";
import LoadingIndicator from "@/components/LoadingIndicator";
import Colors from "@/constants/colors";
import { getObjectDescriptors } from "@/services/api";
import { useLanguageStore } from "@/store/languageStore";
import { ObjectDescriptorsResponse } from "@/types/api";
import { useLocalSearchParams } from "expo-router";
import { RefreshCw } from "lucide-react-native";
import React, { useEffect, useState } from "react";
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function ObjectDetailsScreen() {
  const { objectName, imageBase64, mimeType } = useLocalSearchParams<{
    objectName: string;
    imageBase64: string;
    mimeType: string;
  }>();
  const { sourceLanguage, targetLanguage } = useLanguageStore();
  const [descriptors, setDescriptors] =
    useState<ObjectDescriptorsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const decodedImageBase64 = decodeURIComponent(imageBase64 || "");

  const fetchDescriptors = async () => {
    if (!objectName || !decodedImageBase64 || !mimeType) {
      setError("Missing object information. Please try again.");
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const data = await getObjectDescriptors(
        sourceLanguage,
        targetLanguage,
        objectName,
        decodedImageBase64,
        mimeType
      );
      setDescriptors(data);
    } catch (err) {
      setError("Failed to load object descriptors. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDescriptors();
  }, [objectName, decodedImageBase64, sourceLanguage, targetLanguage]);

  if (loading) {
    return <LoadingIndicator message="Loading object details..." />;
  }

  if (error) {
    return <ErrorView message={error} onRetry={fetchDescriptors} />;
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{objectName}</Text>
        <TouchableOpacity
          style={styles.refreshButton}
          onPress={fetchDescriptors}
        >
          <RefreshCw size={20} color={Colors.primary} />
        </TouchableOpacity>
      </View>

      {decodedImageBase64 && (
        <View style={styles.imageContainer}>
          <Image
            source={{ uri: decodedImageBase64 }}
            style={styles.image}
            resizeMode="contain"
          />
        </View>
      )}

      {descriptors && (
        <ScrollView style={styles.descriptorsContainer}>
          <Text style={styles.descriptorsTitle}>Descriptive Words</Text>
          {descriptors.descriptors.map((descriptor, index) => (
            <View key={index} style={styles.descriptorItem}>
              <Text style={styles.descriptorWord}>{descriptor.descriptor}</Text>
              <Text style={styles.descriptorSentence}>
                {descriptor.exampleSentence}
              </Text>
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
  imageContainer: {
    width: "100%",
    height: 200,
    backgroundColor: Colors.card,
    borderRadius: 12,
    overflow: "hidden",
    marginBottom: 16,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  image: {
    width: "100%",
    height: "100%",
  },
  descriptorsContainer: {
    flex: 1,
  },
  descriptorsTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: Colors.text,
    marginBottom: 12,
  },
  descriptorItem: {
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
  descriptorWord: {
    fontSize: 18,
    fontWeight: "bold",
    color: Colors.text,
    marginBottom: 4,
  },
  descriptorSentence: {
    fontSize: 16,
    color: Colors.textLight,
    fontStyle: "italic",
  },
});
