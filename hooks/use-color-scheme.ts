import Storage from "expo-sqlite/kv-store";
import { useEffect, useState } from "react";
import { Appearance, ColorSchemeName } from "react-native";

export function useThemeStrategy() {
  const [themePreference, setThemePreference] = useState<
    "light" | "dark" | "system"
  >("system");

  useEffect(() => {
    const savedTheme = Storage.getItemSync("user_theme");
    if (savedTheme) {
      setThemePreference(savedTheme as "light" | "dark" | "system");
    }
  }, []);

  const setTheme = (theme: "light" | "dark" | "system") => {
    setThemePreference(theme);
    Storage.setItemSync("user_theme", theme);
    if (theme === "system") {
      Appearance.setColorScheme(null);
    } else {
      Appearance.setColorScheme(theme);
    }
  };

  return { themePreference, setTheme };
}

export function useColorScheme(): ColorSchemeName {
  const [colorScheme, setColorScheme] = useState<ColorSchemeName>(
    Appearance.getColorScheme(),
  );

  useEffect(() => {
    const savedTheme = Storage.getItemSync("user_theme");
    if (savedTheme === "light" || savedTheme === "dark") {
      Appearance.setColorScheme(savedTheme);
      setColorScheme(savedTheme);
    } else {
      Appearance.setColorScheme(null);
    }

    const subscription = Appearance.addChangeListener(({ colorScheme }) => {
      setColorScheme(colorScheme);
    });

    return () => subscription.remove();
  }, []);

  return colorScheme;
}
