import {
  createNavigationContainerRef,
  DefaultTheme,
  getFocusedRouteNameFromRoute,
  NavigationContainer,
  useNavigation,
} from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Home from "./views/home";
import Backup from "./views/backup";
import Cloud from "./views/cloud";
import i18n from "./i18n";
import Feather from "react-native-vector-icons/Feather";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import {
  ActionSheetProvider,
  useActionSheet,
} from "@expo/react-native-action-sheet";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Add from "./views/add";
import { Route } from "@react-navigation/routers";
import Toast from "react-native-toast-message";

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();
type RootStackParamList = {
  Add: undefined;
  Home: undefined;
};
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

function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarHideOnKeyboard: true,
        tabBarStyle: {
          height: 60,
          paddingBottom: 10,
        },
      }}
    >
      <Tab.Screen
        name="Home"
        component={Home}
        options={{
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <Feather name="home" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="Backup"
        component={Backup}
        options={{
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons
              name="settings-backup-restore"
              color={color}
              size={size}
            />
          ),
          headerShown: false,
        }}
      />
      <Tab.Screen
        name="Cloud"
        component={Cloud}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Feather name="upload-cloud" color={color} size={size} />
          ),
          headerShown: false,
        }}
      />
    </Tab.Navigator>
  );
}

function getHeaderTitle(route: Partial<Route<string>>) {
  const routeName = getFocusedRouteNameFromRoute(route) ?? "Home";

  switch (routeName) {
    case "Home":
      return i18n.t("home");
    case "Backup":
      return i18n.t("backup");
    case "Cloud":
      return i18n.t("cloud");
  }
}

const navigationRef = createNavigationContainerRef<RootStackParamList>();

function App() {
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
            break;
          case 1:
            navigationRef.navigate("Add");
            break;
        }
      }
    );
  };
  return (
    <NavigationContainer ref={navigationRef}>
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
            headerLeft: (props) => {
              const routeName = getFocusedRouteNameFromRoute(route);
              return (
                (routeName == "Home" || routeName == undefined) && (
                  <Feather
                    name="plus"
                    size={24}
                    color={DefaultTheme.colors.primary}
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
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
