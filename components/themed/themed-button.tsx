import { ButtonColors } from '@/constants/theme';
import * as Icons from 'lucide-react-native';
import { Pressable, StyleSheet, useColorScheme, type PressableProps, type StyleProp, type ViewStyle } from 'react-native';

type ThemedButtonProps = PressableProps & {
  children?: React.ReactNode;
  icon?: keyof typeof Icons;
  style?: StyleProp<ViewStyle>;
};

export function ThemedButton({ 
  children, 
  icon, 
  style, 
  ...props 
}: ThemedButtonProps) {
  const theme = useColorScheme() ?? 'light';
  const buttonColor = theme === 'light' ? ButtonColors.light : ButtonColors.dark;
  
  return (
    <Pressable 
      style={[
        styles.button, 
        { backgroundColor: buttonColor },
        style
      ]} 
      {...props}>
        {children}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderRadius: 8,
    gap: 8,
  },
  
  buttonText: {
    fontWeight: '600',
  }
});
