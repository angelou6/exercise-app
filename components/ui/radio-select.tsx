import { Colors } from "@/constants/theme";
import React from "react";
import { Pressable, StyleSheet, useColorScheme, View } from "react-native";
import { ThemedIcon, ThemedText } from "../themed";

type RadioType = {
    options: string[],
    active: number,
    setActive: React.Dispatch<React.SetStateAction<number>>
}

export default function RadioSelect({options, active, setActive}: RadioType) {
    const theme = useColorScheme() ?? 'light';

    const pressHandle = (index: number) => {
        setActive(index);
    }

    return(
        <View>
            {options.map((op, index) => {
            const selected = index === active;
            return (
                <Pressable 
                    onPress={() => pressHandle(index)}
                    style={[
                        style.radio_option,
                        { backgroundColor: theme === "light" ? Colors.light.highlight : Colors.dark.highlight }
                    ]} 
                    key={index}>
                    {selected ? <ThemedIcon name="CircleCheck" /> : <ThemedIcon name="Circle" />}
                    <ThemedText>{op}</ThemedText>
                </Pressable>
            )
            })}
        </View>
    )
}

const style = StyleSheet.create({
    radio_option: {
        flexDirection: 'row',
        gap: 10,
        borderRadius: 10,
        marginTop: 10,
        padding: 20
    }
})