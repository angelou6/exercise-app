import { Pressable, StyleSheet } from "react-native";
import { ThemedIcon, ThemedText } from "../../themed";

type RadioType = {
  text: string;
  isToggled?: boolean;
  onSelect?: (state: boolean) => void;
};

export default function ToggleButton({ text, isToggled, onSelect }: RadioType) {
  const handlePress = () => {
    if (onSelect) {
      onSelect(!isToggled);
    }
  };

  return (
    <Pressable onPress={handlePress} style={style.radio_option}>
      <ThemedText style={{ flex: 1 }}>{text}</ThemedText>
      {isToggled ? (
        <ThemedIcon size={36} name="ToggleRight" />
      ) : (
        <ThemedIcon size={36} name="ToggleLeft" />
      )}
    </Pressable>
  );
}

const style = StyleSheet.create({
  radio_option: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
  },
});
