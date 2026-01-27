import { useThemeColor } from "@/hooks/use-theme-color";
import { Modal, ModalProps } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export type ThemedModalProps = ModalProps & {
  children?: React.ReactNode;
  lightColor?: string;
  darkColor?: string;
};

export function ThemedModal({
  children,
  style,
  lightColor,
  darkColor,
  ...otherProps
}: ThemedModalProps) {
  const backgroundColor = useThemeColor(
    { light: lightColor, dark: darkColor },
    "background",
  );

  return (
    <Modal {...otherProps}>
      <SafeAreaView style={[{ backgroundColor, flex: 1 }, style]}>
        {children}
      </SafeAreaView>
    </Modal>
  );
}
