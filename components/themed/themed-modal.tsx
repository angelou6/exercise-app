import { Modal, ModalProps, View } from 'react-native';

import { useThemeColor } from '@/hooks/use-theme-color';

export type ThemedModalProps = ModalProps & {
  children?: React.ReactNode;
  lightColor?: string;
  darkColor?: string;
};

export function ThemedModal({ children, style, lightColor, darkColor, ...otherProps }: ThemedModalProps) {
  const backgroundColor = useThemeColor({ light: lightColor, dark: darkColor }, 'background');

  return (
    <Modal {...otherProps}>
      <View style={[{ backgroundColor, flex: 1 }, style]}>
        {children}
      </View>
    </Modal>
  );
}
