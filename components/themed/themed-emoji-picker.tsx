import { Colors } from '@/constants/theme';
import { useColorScheme } from 'react-native';
import type { EmojiType } from 'rn-emoji-keyboard';
import EmojiPicker from 'rn-emoji-keyboard';

type ThemedEmojiProps = {
    open: boolean;
    onClose: () => void;
    onEmojiSelected: (emoji: EmojiType) => void;
};

export function ThemedEmojiPicker({open, onClose, onEmojiSelected, ...rest}: ThemedEmojiProps) {
    const theme = useColorScheme() ?? 'light';
    
    return (
        <EmojiPicker 
            onEmojiSelected={onEmojiSelected} 
            open={open} 
            onClose={onClose}
            theme={{
                knob: Colors[theme].icon,
                container: Colors[theme].background,
                header: Colors[theme].text,
                skinTonesContainer: Colors[theme].background,
                category: {
                    icon: Colors[theme].icon,
                    container: Colors[theme].background,
                    containerActive: Colors[theme].tabIconSelected,
                }
            }}
            {...rest} 
        />
    );
}