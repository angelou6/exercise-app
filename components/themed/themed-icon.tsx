import { Colors } from '@/constants/theme';
import * as Icons from 'lucide-react-native';
import { LucideIcon } from 'lucide-react-native';
import { useColorScheme } from 'react-native';

type ThemedIconProps = {
  name: keyof typeof Icons;
  size?: number;
};

export function ThemedIcon({ name, size = 24 }: ThemedIconProps) {
    const theme = useColorScheme() ?? 'light';
    const Icon = Icons[name] as LucideIcon;
    
    return (
        <Icon
          size={size}
          color={theme === 'light' ? Colors.light.icon : Colors.dark.icon}
        />
    );
}