import React from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Switch,
} from "react-native";
import {
  Globe,
  Info,
  Heart,
  ExternalLink,
} from "lucide-react-native";
import Colors from "@/constants/colors";
import LanguageSelector from "@/components/LanguageSelector";

export default function SettingsScreen() {
  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
    >
      <View style={styles.header}>
        <Text style={styles.title}>Settings</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Languages</Text>
        <LanguageSelector />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>App Settings</Text>

        <View style={styles.settingItem}>
          <View style={styles.settingInfo}>
            <Globe size={20} color={Colors.text} />
            <Text style={styles.settingText}>Auto-detect language</Text>
          </View>
          <Switch
            value={false}
            onValueChange={() => {}}
            trackColor={{ false: Colors.border, true: `${Colors.primary}80` }}
            thumbColor={Colors.primary}
          />
        </View>

        <View style={styles.settingItem}>
          <View style={styles.settingInfo}>
            <Info size={20} color={Colors.text} />
            <Text style={styles.settingText}>Show pronunciation guides</Text>
          </View>
          <Switch
            value={true}
            onValueChange={() => {}}
            trackColor={{ false: Colors.border, true: `${Colors.primary}80` }}
            thumbColor={Colors.primary}
          />
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>About</Text>

        <TouchableOpacity style={styles.aboutItem} onPress={() => {}}>
          <View style={styles.aboutInfo}>
            <Heart size={20} color={Colors.text} />
            <Text style={styles.aboutText}>Rate the App</Text>
          </View>
          <ExternalLink size={16} color={Colors.textLight} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.aboutItem} onPress={() => {}}>
          <View style={styles.aboutInfo}>
            <Info size={20} color={Colors.text} />
            <Text style={styles.aboutText}>Privacy Policy</Text>
          </View>
          <ExternalLink size={16} color={Colors.textLight} />
        </TouchableOpacity>
      </View>

      <View style={styles.footer}>
        <Text style={styles.versionText}>Little Language Lessons v1.0.0</Text>
        <Text style={styles.copyrightText}>© 2023 Little Language Lessons</Text>
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
  settingItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
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
  settingInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  settingText: {
    fontSize: 16,
    color: Colors.text,
    marginLeft: 12,
  },
  aboutItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
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
  aboutInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  aboutText: {
    fontSize: 16,
    color: Colors.text,
    marginLeft: 12,
  },
  footer: {
    marginTop: 24,
    alignItems: "center",
  },
  versionText: {
    fontSize: 14,
    color: Colors.textLight,
    marginBottom: 4,
  },
  copyrightText: {
    fontSize: 12,
    color: Colors.textLight,
  },
});
