import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  FlatList,
} from "react-native";
import { ChevronDown } from "lucide-react-native";
import Colors from "@/constants/colors";
import { purposes } from "@/constants/purposes";

interface PurposeSelectorProps {
  selectedPurpose: string;
  onSelectPurpose: (purpose: string) => void;
}

export default function PurposeSelector({
  selectedPurpose,
  onSelectPurpose,
}: PurposeSelectorProps) {
  const [modalVisible, setModalVisible] = useState(false);

  const selectPurpose = (purpose: string) => {
    onSelectPurpose(purpose);
    setModalVisible(false);
  };

  const renderPurposeItem = ({ item }: { item: string }) => (
    <TouchableOpacity
      style={[
        styles.purposeItem,
        selectedPurpose === item && styles.selectedPurposeItem,
      ]}
      onPress={() => selectPurpose(item)}
    >
      <Text style={styles.purposeName}>{item}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.purposeButton}
        onPress={() => setModalVisible(true)}
      >
        <Text style={styles.purposeButtonText}>{selectedPurpose}</Text>
        <ChevronDown size={20} color={Colors.text} />
      </TouchableOpacity>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Select Purpose</Text>
            <FlatList
              data={purposes}
              renderItem={renderPurposeItem}
              keyExtractor={(item) => item}
              style={styles.purposeList}
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
    marginVertical: 16,
  },
  purposeButton: {
    backgroundColor: Colors.card,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  purposeButtonText: {
    color: Colors.text,
    fontSize: 16,
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
  purposeList: {
    marginBottom: 16,
  },
  purposeItem: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginVertical: 4,
  },
  selectedPurposeItem: {
    backgroundColor: `${Colors.primary}20`,
  },
  purposeName: {
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
