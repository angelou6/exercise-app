import { Colors } from '@/constants/theme';
import * as Icons from 'lucide-react-native';
import { LucideIcon } from 'lucide-react-native';
import { useColorScheme } from 'react-native';

type ThemedIconProps = {
  name: keyof typeof Icons;
  size?: number;
  color?: string;
};

export function ThemedIcon({ name, size = 24, color }: ThemedIconProps) {
    const theme = useColorScheme() ?? 'light';
    const Icon = Icons[name] as LucideIcon;
    const defaultColor = theme === 'light' ? Colors.light.icon : Colors.dark.icon;
    
    return (
        <Icon
          size={size}
          color={color ?? defaultColor}
        />
    );
}