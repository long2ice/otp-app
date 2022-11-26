import {
  getFocusedRouteNameFromRoute,
  NavigationContainer,
  useNavigationContainerRef,
} from "@react-navigation/native";
import Home from "./views/home";
import Backup from "./views/backup";
import Cloud from "./views/cloud";
import i18n from "./i18n";
import Feather from "react-native-vector-icons/Feather";
import {
  ActionSheetProvider,
  useActionSheet,
} from "@expo/react-native-action-sheet";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Add from "./views/add";
import { Route } from "@react-navigation/routers";
import Toast from "react-native-toast-message";
import { useCallback, useEffect, useRef, useState } from "react";
import mobileAds, {
  AdEventType,
  AppOpenAd,
} from "react-native-google-mobile-ads";
import constants from "./constants";
import * as SplashScreen from "expo-splash-screen";
import analytics from "@react-native-firebase/analytics";
import Scan from "./views/scan";
import TabNavigator from "./components/tab";
import { createTable, getOTPList } from "./db";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import { Pressable } from "react-native";
import * as Sharing from "expo-sharing";
import * as DocumentPicker from "expo-document-picker";
import * as FileSystem from "expo-file-system";

const Stack = createNativeStackNavigator();

export default function AppContainer() {
  return (
    <ActionSheetProvider>
      <>
        <App />
        <Toast />
      </>
    </ActionSheetProvider>
  );
}

function getHeaderTitle(route: Partial<Route<string>>) {
  const routeName = getFocusedRouteNameFromRoute(route) ?? "Home";

  switch (routeName) {
    case "Home":
      return i18n.t("home");
    case "Backup":
      return i18n.t("backup_restore");
    case "Cloud":
      return i18n.t("cloud");
  }
}

function App() {
  const navigationRef = useNavigationContainerRef<RootStackParamList>();
  const routeNameRef = useRef("");
  const appOpenAd = AppOpenAd.createForAdRequest(constants.AD_APP_OPEN);
  const [appIsReady, setAppIsReady] = useState(false);
  useEffect(() => {
    (async () => {
      let ad = mobileAds();
      await ad.initialize();
      appOpenAd.load();
      appOpenAd.addAdEventListener(AdEventType.LOADED, (listener) => {
        appOpenAd.show();
      });
      await new Promise((resolve) => setTimeout(resolve, 2000));
      setAppIsReady(true);
      createTable();
    })();
  }, []);
  const { showActionSheetWithOptions } = useActionSheet();
  const onPress = () => {
    const options = [i18n.t("scan"), i18n.t("manual"), i18n.t("cancel")];
    const cancelButtonIndex = 2;
    const icons = [
      <Feather name="camera" size={24} />,
      <Feather name="edit" size={24} />,
      <MaterialCommunityIcons name="cancel" size={24} />,
    ];

    showActionSheetWithOptions(
      {
        options,
        cancelButtonIndex,
        icons,
      },
      (selectedIndex?: number) => {
        switch (selectedIndex) {
          case 0:
            navigationRef.navigate("Scan");
            break;
          case 1:
            navigationRef.navigate("Add");
            break;
        }
      }
    );
  };
  const shareBackup = async () => {
    let filename = constants.BACKUP_URI;
    getOTPList().then(async (otps) => {
      let data = otps.map((otp) => otp.uri);
      await FileSystem.writeAsStringAsync(filename, JSON.stringify(data), {
        encoding: FileSystem.EncodingType.UTF8,
      });
      await Sharing.shareAsync(filename);
    });
  };
  const onLayoutRootView = useCallback(async () => {
    if (appIsReady) {
      await SplashScreen.hideAsync();
    }
  }, [appIsReady]);

  if (!appIsReady) {
    return null;
  }
  return (
    <NavigationContainer
      ref={navigationRef}
      onReady={async () => {
        routeNameRef.current = navigationRef.getCurrentRoute()?.name ?? "";
        await onLayoutRootView();
      }}
      onStateChange={async () => {
        const previousRouteName = routeNameRef.current;
        const currentRouteName = navigationRef.getCurrentRoute()?.name;
        if (previousRouteName !== currentRouteName) {
          routeNameRef.current = currentRouteName ?? "";
          await analytics().logScreenView({
            screen_name: currentRouteName,
            screen_class: currentRouteName,
          });
        }
      }}
    >
      <Stack.Navigator
        screenOptions={{
          animation: "slide_from_right",
        }}
      >
        <Stack.Screen
          name="Tab"
          component={TabNavigator}
          options={({ route }) => ({
            headerTitleAlign: "center",
            headerTitle: getHeaderTitle(route),
            headerRight: ({ tintColor, canGoBack }) => {
              const routeName = getFocusedRouteNameFromRoute(route);
              if (routeName == "Backup") {
                return (
                  <Pressable onPress={shareBackup}>
                    <MaterialIcons name="share" color={tintColor} size={24} />
                  </Pressable>
                );
              }
            },
            headerLeft: ({ tintColor, canGoBack }) => {
              const routeName = getFocusedRouteNameFromRoute(route);
              return (
                (routeName == "Home" || routeName == undefined) && (
                  <Feather
                    name="plus"
                    size={24}
                    color={tintColor}
                    onPress={onPress}
                  />
                )
              );
            },
          })}
        />
        <Stack.Screen
          name="Add"
          component={Add}
          options={{
            title: i18n.t("manual"),
            headerTitleAlign: "center",
          }}
        />
        <Stack.Screen
          name="Scan"
          component={Scan}
          options={{
            title: i18n.t("scan"),
            headerTitleAlign: "center",
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
