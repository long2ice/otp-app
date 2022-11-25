import Home from "../views/home";
import Feather from "react-native-vector-icons/Feather";
import Backup from "../views/backup";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import Cloud from "../views/cloud";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import i18n from "../i18n";

const Tab = createBottomTabNavigator();

export default function TabNavigator() {
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
          tabBarLabel: i18n.t("home"),
          tabBarIcon: ({ color, size }) => (
            <Feather name="home" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="Backup"
        component={Backup}
        options={{
          tabBarLabel: i18n.t("backup_restore"),
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
          tabBarLabel: i18n.t("cloud"),
          tabBarIcon: ({ color, size }) => (
            <Feather name="upload-cloud" color={color} size={size} />
          ),
          headerShown: false,
        }}
      />
    </Tab.Navigator>
  );
}
