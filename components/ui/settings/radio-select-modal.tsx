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
            <View style={styles.content}>
              <RadioSelect
                options={options}
                defaultIndex={defaultIndex}
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
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  content: {
    //
  },
});
