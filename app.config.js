const isApkBuild = process.env.APK_BUILD === "true";

export default {
  expo: {
    name: "Exercise App",
    slug: "exercise-app",
    version: "0.2.0",
    orientation: "portrait",
    icon: "./assets/images/icon.png",
    scheme: "exerciseapp",
    userInterfaceStyle: "automatic",
    newArchEnabled: true,
    ios: {
      supportsTablet: true,
      bundleIdentifier: "com.angelou123.exerciseapp",
    },
    android: {
      adaptiveIcon: {
        backgroundColor: "#E6F4FE",
        foregroundImage: "./assets/images/android-icon-foreground.png",
        backgroundImage: "./assets/images/android-icon-background.png",
        monochromeImage: "./assets/images/android-icon-monochrome.png",
      },
      edgeToEdgeEnabled: true,
      predictiveBackGestureEnabled: false,
      permissions: [
        "android.permission.RECORD_AUDIO",
        "android.permission.MODIFY_AUDIO_SETTINGS",
      ],
      package: "com.angelou123.exerciseapp",
    },
    plugins: [
      "expo-router",
      [
        "expo-splash-screen",
        {
          image: "./assets/images/splash-icon.png",
          imageWidth: 300,
          resizeMode: "contain",
          backgroundColor: "#000000",
          dark: {
            backgroundColor: "#000000",
          },
        },
      ],
      "expo-sqlite",
      "expo-notifications",
      "expo-audio",
      [
        "expo-build-properties",
        {
          android: {
            enableShrinkResourcesInReleaseBuilds: isApkBuild,
            enableMinifyInReleaseBuilds: isApkBuild,
            buildArchs: ["armeabi-v7a", "arm64-v8a"],
          },
        },
      ],
    ],
    experiments: {
      typedRoutes: true,
      reactCompiler: true,
    },
    extra: {
      router: {},
      eas: {
        projectId: "2e7aaa2c-4f48-42df-ac23-789f583d81a8",
      },
    },
  },
};
