import SearchBar from "react-native-dynamic-search-bar";
import { useEffect, useState } from "react";
import Layout from "../components/layout";
import OTP from "../components/otp";
// @ts-ignore
import { TOTP, URI } from "otpauth/dist/otpauth.esm.js";
import { deleteOTP, getOTPList } from "../db";
import { DBOTP } from "../types/otp";
import { useRoute } from "@react-navigation/native";
import { RouteProp } from "@react-navigation/core/src/types";
import { Alert, FlatList, RefreshControl, Text, View } from "react-native";
import i18n from "../i18n";
import { globalStyles } from "../styles";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
export default function Home() {
  const route = useRoute<RouteProp<RootStackParamList>>();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [value, setValue] = useState("");
  const [otps, setOtps] = useState<DBOTP[]>([]);
  const [listeners, setListeners] = useState<Record<number, () => void>>({});
  const onListen = (key: number, listener: () => void) => {
    setListeners((prev) => ({ ...prev, [key]: listener }));
  };
  const refresh = () => {
    getOTPList(value).then((otps) => {
      setOtps(otps);
    });
  };
  useEffect(() => {
    if (route.params?.refresh || route.params === undefined) {
      refresh();
    }
  }, [value, route.params?.refresh]);
  useEffect(() => {
    const interval = setInterval(() => {
      Object.values(listeners).forEach((listener) => listener());
    }, 1000);
    return () => clearInterval(interval);
  }, [listeners]);
  const onDelete = (id: number) => {
    Alert.alert(
      i18n.t("delete"),
      i18n.t("delete_confirm"),
      [
        {
          text: i18n.t("cancel"),
          style: "cancel",
        },
        {
          text: i18n.t("delete"),
          style: "destructive",
          onPress: () => {
            deleteOTP(id);
            refresh();
          },
        },
      ],
      { cancelable: true }
    );
  };
  return (
    <Layout>
      <SearchBar
        style={{
          width: "100%",
          borderRadius: 4,
          height: 50,
          ...globalStyles.shadow,
        }}
        onChangeText={(text) => setValue(text)}
        onClearPress={() => setValue("")}
        placeholder={i18n.t("search")}
        clearIconComponent={
          value == "" ? <View /> : <MaterialIcons name="clear" size={24} />
        }
      />
      <FlatList
        className="mt-4"
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View className="mt-[50%] flex items-center justify-center">
            <Text className="text-xl text-neutral-400">{i18n.t("no_otp")}</Text>
          </View>
        }
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={() => {
              setIsRefreshing(true);
              refresh();
              setIsRefreshing(false);
            }}
          />
        }
        renderItem={({ item }) => (
          <OTP
            otp={item}
            key={item.id}
            onListen={onListen}
            onDelete={onDelete}
          />
        )}
        data={otps}
      />
    </Layout>
  );
}
