import React from "react";
import { View, ActivityIndicator, Text, StyleSheet } from "react-native";
import Colors from "@/constants/colors";

interface LoadingIndicatorProps {
  message?: string;
}

export default function LoadingIndicator({
  message = "Loading...",
}: LoadingIndicatorProps) {
  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color={Colors.primary} />
      <Text style={styles.message}>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  message: {
    marginTop: 12,
    fontSize: 16,
    color: Colors.textLight,
    textAlign: "center",
  },
});
