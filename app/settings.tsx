import { ExternalLink } from "@/components/external-link";
import { ThemedIcon, ThemedText } from "@/components/themed";
import RadioSelectModal from "@/components/ui/settings/radio-select-modal";
import TimeSelectModal from "@/components/ui/settings/time-select-modal";
import ToggleButton from "@/components/ui/settings/toggle";
import { useCardTheme } from "@/hooks/use-card-theeme";
import { useThemeStrategy } from "@/hooks/use-color-scheme";
import * as Notifications from "expo-notifications";
import { router } from "expo-router";
import Storage from "expo-sqlite/kv-store";
import { useEffect, useReducer, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  ToastAndroid,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

interface settingsState {
  streak: boolean;
  reminder: boolean;
}

interface Action {
  type: "setStreak" | "setReminder";
  value: boolean;
}

function settingsDispatch(state: settingsState, action: Action) {
  const { type, value } = action;
  switch (type) {
    case "setStreak":
      return { ...state, streak: value };

    case "setReminder":
      return { ...state, reminder: value };

    default:
      break;
  }

  return state;
}

const Settings = () => {
  const { t } = useTranslation();
  const cardTheme = useCardTheme();
  const { themePreference, setTheme } = useThemeStrategy();

  const [settings, dispatchSettings] = useReducer(
    settingsDispatch,
    {
      streak: false,
      reminder: false,
    },
    () => {
      const savedStreak = Storage.getItemSync("useStreak");
      const savedReminder = Storage.getItemSync("sendNotifications");
      return {
        streak: savedStreak === "true",
        reminder: savedReminder === "true",
      };
    },
  );

  const [reminderTime, setReminderTime] = useState(() => {
    const savedTime = Storage.getItemSync("notificationTime");
    return savedTime ? JSON.parse(savedTime) : { hour: "16", minute: "00" };
  });

  const [timeModalVisible, setTimeModalVisible] = useState(false);
  const [themeModalVisible, setThemeModalVisible] = useState(false);

  const themeOptions = [
    t("settings.themeOptions.system"),
    t("settings.themeOptions.light"),
    t("settings.themeOptions.dark"),
  ];
  const themeValues: ("system" | "light" | "dark")[] = [
    "system",
    "light",
    "dark",
  ];

  const themeLabels: Record<string, string> = {
    system: t("settings.themeOptions.system"),
    light: t("settings.themeOptions.light"),
    dark: t("settings.themeOptions.dark"),
  };

  const scheduleDailyNotification = async (hour: number, minute: number) => {
    const { status } = await Notifications.requestPermissionsAsync();
    if (status !== "granted") {
      alert(t("settings.notifications.permissionDenied"));
      throw new Error(t("settings.notifications.rejected"));
    }

    await Notifications.cancelAllScheduledNotificationsAsync();

    await Notifications.scheduleNotificationAsync({
      content: {
        title: t("settings.notifications.dailyTitle"),
        body: t("settings.notifications.dailyBody"),
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.DAILY,
        hour: hour,
        minute: minute,
      },
    });
  };

  const handleNotification = async (hour: string, minute: string) => {
    try {
      await scheduleDailyNotification(Number(hour), Number(minute));
      setReminderTime({ hour, minute });
      ToastAndroid.show(
        t("settings.notifications.setFor", {
          time: `${hour}:${minute}`,
        }),
        ToastAndroid.SHORT,
      );
      return true;
    } catch {
      return false;
    }
  };

  const handleActivateNotifications = async (state: boolean) => {
    if (state) {
      const success = await handleNotification(
        reminderTime.hour,
        reminderTime.minute,
      );
      dispatchSettings({ type: "setReminder", value: success });
    } else {
      await Notifications.cancelAllScheduledNotificationsAsync();
      ToastAndroid.show(
        t("settings.notifications.removed"),
        ToastAndroid.SHORT,
      );
      dispatchSettings({ type: "setReminder", value: false });
    }
  };

  useEffect(() => {
    Storage.setItemSync("useStreak", String(settings.streak));
    Storage.setItemSync("sendNotifications", String(settings.reminder));
  }, [settings]);

  useEffect(() => {
    Storage.setItemSync("notificationTime", JSON.stringify(reminderTime));
  }, [reminderTime]);

  return (
    <SafeAreaView style={styles.container}>
      <TimeSelectModal
        visible={timeModalVisible}
        onClose={() => setTimeModalVisible(false)}
        onSelect={(hour, minute) => handleNotification(hour, minute)}
      />
      <RadioSelectModal
        visible={themeModalVisible}
        onClose={() => setThemeModalVisible(false)}
        options={themeOptions}
        defaultIndex={themeValues.indexOf(themePreference)}
        onSelect={(index) => setTheme(themeValues[index])}
      />

      <View style={styles.header}>
        <Pressable onPress={() => router.back()}>
          <ThemedIcon name="ArrowLeft" size={24} />
        </Pressable>
        <ThemedText type="title">{t("settings.title")}</ThemedText>
      </View>

      <ScrollView style={styles.content}>
        <Pressable onPress={() => setThemeModalVisible(true)}>
          <View
            style={[
              styles.card,
              {
                backgroundColor: cardTheme.background,
                borderColor: cardTheme.border,
              },
            ]}
          >
            <View style={styles.cardContent}>
              <ThemedText style={{ flex: 1 }}>{t("settings.theme")}</ThemedText>
              <View style={styles.valueContainer}>
                <ThemedText style={styles.valueText}>
                  {themeLabels[themePreference] ?? themePreference}
                </ThemedText>
                <ThemedIcon name="ChevronRight" size={20} color="#888" />
              </View>
            </View>
          </View>
        </Pressable>

        <View
          style={[
            styles.card,
            {
              backgroundColor: cardTheme.background,
              borderColor: cardTheme.border,
            },
          ]}
        >
          <ToggleButton
            onSelect={(state) =>
              dispatchSettings({ type: "setStreak", value: state })
            }
            isToggled={settings.streak}
            text={t("settings.streak")}
          />
        </View>

        <View
          style={[
            styles.card,
            {
              backgroundColor: cardTheme.background,
              borderColor: cardTheme.border,
            },
          ]}
        >
          <ToggleButton
            onSelect={handleActivateNotifications}
            isToggled={settings.reminder}
            text={t("settings.sendNotifications")}
          />
        </View>
        {settings.reminder && (
          <Pressable onPress={() => setTimeModalVisible(true)}>
            <View
              style={[
                styles.card,
                {
                  backgroundColor: cardTheme.background,
                  borderColor: cardTheme.border,
                },
              ]}
            >
              <View style={styles.cardContent}>
                <ThemedText style={{ flex: 1 }}>
                  {t("settings.time")}
                </ThemedText>
                <View style={styles.valueContainer}>
                  <ThemedText style={styles.valueText}>
                    {reminderTime.hour}:{reminderTime.minute}
                  </ThemedText>
                  <ThemedIcon name="ChevronRight" size={20} color="#888" />
                </View>
              </View>
            </View>
          </Pressable>
        )}
        <ExternalLink
          style={[
            styles.card,
            styles.externalLink,
            {
              backgroundColor: cardTheme.background,
              borderColor: cardTheme.border,
            },
          ]}
          href="https://github.com/angelou6/exercise-app"
        >
          <ThemedIcon name="Github" />
          <ThemedText>{t("settings.github")}</ThemedText>
        </ExternalLink>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 20,
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  card: {
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 12,
  },
  cardContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  externalLink: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  valueContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  valueText: {
    color: "#888",
    textTransform: "capitalize",
  },
});

export default Settings;
