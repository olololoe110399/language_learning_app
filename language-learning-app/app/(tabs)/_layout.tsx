import React from "react";
import { Tabs } from "expo-router";
import { Book, MessageSquare, Camera, Settings } from "lucide-react-native";
import Colors from "@/constants/colors";

function TabBarIcon(props: { name: React.ReactNode; color: string }) {
  return props.name;
}

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors.primary,
        tabBarInactiveTintColor: Colors.textLight,
        tabBarStyle: {
          backgroundColor: Colors.card,
          borderTopColor: Colors.border,
        },
        headerStyle: {
          backgroundColor: Colors.background,
        },
        headerShadowVisible: false,
        headerTitleStyle: {
          fontWeight: "bold",
          color: Colors.text,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Learn",
          tabBarIcon: ({ color }) => (
            <TabBarIcon name={<Book size={24} color={color} />} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="conversation"
        options={{
          title: "Conversation",
          tabBarIcon: ({ color }) => (
            <TabBarIcon
              name={<MessageSquare size={24} color={color} />}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="camera"
        options={{
          title: "Camera",
          tabBarIcon: ({ color }) => (
            <TabBarIcon
              name={<Camera size={24} color={color} />}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: "Settings",
          tabBarIcon: ({ color }) => (
            <TabBarIcon
              name={<Settings size={24} color={color} />}
              color={color}
            />
          ),
        }}
      />
    </Tabs>
  );
}
