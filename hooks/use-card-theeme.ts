import { CardColor } from "@/constants/theme";
import { useColorScheme } from "react-native";

export function useCardTheme() {
  const theme = useColorScheme() ?? "light";
  return theme === "light" ? CardColor.light : CardColor.dark;
}
