import FontAwesome from "@expo/vector-icons/FontAwesome";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";

import { ErrorBoundary } from "./error-boundary";
import Colors from "@/constants/colors";

export const unstable_settings = {
  initialRouteName: "(tabs)",
};

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    ...FontAwesome.font,
  });

  useEffect(() => {
    if (error) {
      console.error(error);
      throw error;
    }
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <ErrorBoundary>
      <RootLayoutNav />
    </ErrorBoundary>
  );
}

function RootLayoutNav() {
  return (
    <Stack
      screenOptions={{
        headerBackTitle: "Back",
        headerStyle: {
          backgroundColor: Colors.background,
        },
        headerShadowVisible: false,
        headerTintColor: Colors.primary,
        headerTitleStyle: {
          fontWeight: "bold",
        },
        contentStyle: {
          backgroundColor: Colors.background,
        },
      }}
    >
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen
        name="tiny-lesson"
        options={{
          title: "Tiny Lesson",
          presentation: "card",
        }}
      />
      <Stack.Screen
        name="grammar-lesson"
        options={{
          title: "Grammar Lesson",
          presentation: "card",
        }}
      />
      <Stack.Screen
        name="slang-hang"
        options={{
          title: "Slang Hang",
          presentation: "card",
        }}
      />
      <Stack.Screen
        name="word-cam"
        options={{
          title: "Word Cam",
          presentation: "card",
        }}
      />
      <Stack.Screen
        name="object-details"
        options={{
          title: "Object Details",
          presentation: "card",
        }}
      />
    </Stack>
  );
}
