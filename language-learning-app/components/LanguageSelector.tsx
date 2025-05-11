import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  FlatList,
} from "react-native";
import { ArrowLeftRight } from "lucide-react-native";
import { languages, Language } from "@/constants/languages";
import Colors from "@/constants/colors";
import { useLanguageStore } from "@/store/languageStore";

export default function LanguageSelector() {
  const {
    sourceLanguage,
    targetLanguage,
    setSourceLanguage,
    setTargetLanguage,
    swapLanguages,
  } = useLanguageStore();
  const [modalVisible, setModalVisible] = useState(false);
  const [selectingSource, setSelectingSource] = useState(true);

  const getLanguageName = (code: string) => {
    const language = languages.find((lang) => lang.code === code);
    return language ? `${language.flag} ${language.name}` : code;
  };

  const openLanguageSelector = (isSource: boolean) => {
    setSelectingSource(isSource);
    setModalVisible(true);
  };

  const selectLanguage = (code: string) => {
    if (selectingSource) {
      setSourceLanguage(code);
    } else {
      setTargetLanguage(code);
    }
    setModalVisible(false);
  };

  const renderLanguageItem = ({ item }: { item: Language }) => (
    <TouchableOpacity
      style={[
        styles.languageItem,
        (selectingSource ? sourceLanguage : targetLanguage) === item.code &&
          styles.selectedLanguageItem,
      ]}
      onPress={() => selectLanguage(item.code)}
    >
      <Text style={styles.languageFlag}>{item.flag}</Text>
      <Text style={styles.languageName}>{item.name}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.languageButton}
        onPress={() => openLanguageSelector(true)}
      >
        <Text style={styles.languageButtonText}>
          {getLanguageName(sourceLanguage)}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.swapButton} onPress={swapLanguages}>
        <ArrowLeftRight size={20} color={Colors.primary} />
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.languageButton}
        onPress={() => openLanguageSelector(false)}
      >
        <Text style={styles.languageButtonText}>
          {getLanguageName(targetLanguage)}
        </Text>
      </TouchableOpacity>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>
              Select {selectingSource ? "Source" : "Target"} Language
            </Text>
            <FlatList
              data={languages}
              renderItem={renderLanguageItem}
              keyExtractor={(item) => item.code}
              style={styles.languageList}
            />
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.closeButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 16,
  },
  languageButton: {
    backgroundColor: Colors.card,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    flex: 1,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  languageButtonText: {
    color: Colors.text,
    fontSize: 16,
    textAlign: "center",
  },
  swapButton: {
    backgroundColor: Colors.card,
    padding: 10,
    borderRadius: 20,
    marginHorizontal: 10,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: Colors.background,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    maxHeight: "80%",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 16,
    textAlign: "center",
    color: Colors.text,
  },
  languageList: {
    marginBottom: 16,
  },
  languageItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginVertical: 4,
  },
  selectedLanguageItem: {
    backgroundColor: `${Colors.primary}20`,
  },
  languageFlag: {
    fontSize: 20,
    marginRight: 12,
  },
  languageName: {
    fontSize: 16,
    color: Colors.text,
  },
  closeButton: {
    backgroundColor: Colors.card,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  closeButtonText: {
    color: Colors.primary,
    fontSize: 16,
    fontWeight: "bold",
  },
});
