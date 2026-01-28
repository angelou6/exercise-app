import { ThemedIcon, ThemedText } from "@/components/themed";
import RadioSelectModal from "@/components/ui/settings/radio-select-modal";
import TimeSelectModal from "@/components/ui/settings/time-select-modal";
import ToggleButton from "@/components/ui/settings/toggle";
import { useCardTheme } from "@/hooks/use-card-theeme";
import { useThemeStrategy } from "@/hooks/use-color-scheme";
import * as Notifications from "expo-notifications";
import { router } from "expo-router";
import Storage from "expo-sqlite/kv-store";
import { useEffect, useState } from "react";
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

async function scheduleDailyNotification(hour: number, minute: number) {
  const { status } = await Notifications.requestPermissionsAsync();
  if (status !== "granted") {
    alert("Permission for notifications not granted!");
    throw new Error("Notification rejected");
  }

  await Notifications.cancelAllScheduledNotificationsAsync();

  await Notifications.scheduleNotificationAsync({
    content: {
      title: "Daily Reminder",
      body: "Workout time!",
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.DAILY,
      hour: hour,
      minute: minute,
    },
  });
}

const App = () => {
  const [useStreak, setUseStreak] = useState(false);
  const [reminder, setReminder] = useState(false);
  const cardTheme = useCardTheme();

  const [timeModalVisible, setTimeModalVisible] = useState(false);
  const { themePreference, setTheme } = useThemeStrategy();
  const [themeModalVisible, setThemeModalVisible] = useState(false);
  const themeOptions = ["System", "Light", "Dark"];
  const themeValues: ("system" | "light" | "dark")[] = [
    "system",
    "light",
    "dark",
  ];
  const [reminderTime, setReminderTime] = useState({
    hour: "16",
    minute: "00",
  });

  const handleNotification = async (hour: string, minute: string) => {
    try {
      await scheduleDailyNotification(Number(hour), Number(minute));
      setReminderTime({ hour, minute });
      ToastAndroid.show(
        `Notification set for ${hour}:${minute}`,
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
      setReminder(success);
    } else {
      await Notifications.cancelAllScheduledNotificationsAsync();
      ToastAndroid.show("Removed daily notification", ToastAndroid.SHORT);
      setReminder(false);
    }
  };

  useEffect(() => {
    const savedNotifications = Storage.getItemSync("sendNotifications");
    if (savedNotifications) {
      setReminder(savedNotifications === "true");
    }

    const savedStreak = Storage.getItemSync("useStreak");
    if (savedStreak) {
      setUseStreak(savedStreak === "true");
    }

    const savedTime = Storage.getItemSync("notificationTime");
    if (savedTime) {
      setReminderTime(JSON.parse(savedTime));
    }
  }, []);

  useEffect(() => {
    Storage.setItemSync("useStreak", String(useStreak));
  }, [useStreak]);

  useEffect(() => {
    Storage.setItemSync("sendNotifications", String(reminder));
  }, [reminder]);

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
        <ThemedText type="title">Ajustes</ThemedText>
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
              <ThemedText style={{ flex: 1 }}>Theme</ThemedText>
              <View style={styles.valueContainer}>
                <ThemedText style={styles.valueText}>
                  {themePreference}
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
            onSelect={setUseStreak}
            defaultValue={useStreak}
            text="Streak"
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
            defaultValue={reminder}
            text="Send Notifications"
          />
        </View>

        {reminder && (
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
                <ThemedText style={{ flex: 1 }}>Time</ThemedText>
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

export default App;
