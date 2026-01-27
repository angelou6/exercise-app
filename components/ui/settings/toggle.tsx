import { useEffect, useState } from "react";
import { Pressable, StyleSheet } from "react-native";
import { ThemedIcon, ThemedText } from "../../themed";

type RadioType = {
  text: string;
  defaultValue?: boolean;
  onSelect?: (state: boolean) => void;
};

export default function ToggleButton({
  text,
  defaultValue,
  onSelect,
}: RadioType) {
  const [toggle, setToggle] = useState(defaultValue ?? false);

  useEffect(() => {
    if (defaultValue !== undefined) {
      setToggle(defaultValue);
    }
  }, [defaultValue]);

  const handlePress = () => {
    const newState = !toggle;
    if (onSelect) {
      onSelect(newState);
    }
    if (defaultValue === undefined) {
      setToggle(newState);
    }
  };

  return (
    <Pressable onPress={handlePress} style={style.radio_option}>
      <ThemedText style={{ flex: 1 }}>{text}</ThemedText>
      {toggle ? (
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
