import { TextInput, type TextInputProps } from 'react-native';

import { useThemeColor } from '@/hooks/use-theme-color';

export type InputProps = TextInputProps & {
    lightColor?: string;
    darkColor?: string;
    lightPlaceholderColor?: string;
    darkPlaceholderColor?: string;
};

export function ThemedInput({
  style,
  lightColor,
  darkColor,
  lightPlaceholderColor,
  darkPlaceholderColor,
  ...rest
}: InputProps) {
  const color = useThemeColor({ light: lightColor, dark: darkColor }, 'text');

  const placeholderColor = useThemeColor(
    { light: lightPlaceholderColor, dark: darkPlaceholderColor }, 
    'tabIconDefault'
  );

  return (
    <TextInput
      style={[
        { color },
        style,
      ]}
        placeholderTextColor={placeholderColor}
        {...rest}
    />
  );
}
