import { useThemeColor } from "@/hooks/use-theme-color";
import { Picker, type PickerProps } from "@react-native-picker/picker";

export type ThemedPickerProps = PickerProps & {
  lightColor?: string;
  darkColor?: string;
};

function ThemedPickerComponent({ style, lightColor, darkColor, ...rest }: ThemedPickerProps) {
    const color = useThemeColor({ light: lightColor, dark: darkColor }, "text");
    return (
        <Picker
            {...rest}
            dropdownIconColor={color}
            style={[{ color }, style]}
        />
    );
}

export const ThemedPicker = Object.assign(ThemedPickerComponent, {
    Item: Picker.Item,
});