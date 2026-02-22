import { useThemeColor } from "@/hooks/use-theme-color";
import {
  Modal,
  Pressable,
  StyleSheet,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import RadioSelect from "./radio-select";

type RadioSelectModalProps = {
  visible: boolean;
  options: string[];
  defaultIndex: number;
  onSelect: (selected: number) => void;
  onClose: () => void;
};

export default function RadioSelectModal({
  visible,
  options,
  defaultIndex,
  onSelect,
  onClose,
}: RadioSelectModalProps) {
  const backgroundColor = useThemeColor({}, "background");

  const handleSelect = (selected: number) => {
    onSelect(selected);
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent={true}
      onRequestClose={onClose}
      animationType="fade"
    >
      <Pressable style={styles.overlay} onPress={onClose}>
        <TouchableWithoutFeedback>
          <View style={[styles.container, { backgroundColor }]}>
            <View>
              <RadioSelect
                options={options}
                initialIndex={defaultIndex}
                onSelect={handleSelect}
              />
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  container: {
    width: "100%",
    maxWidth: 400,
    borderRadius: 20,
    padding: 20,
    boxShadow: "0 2 4 0 rgba(0, 0, 0, 0.25)",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
});
