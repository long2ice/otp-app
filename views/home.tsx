import SearchBar from "react-native-dynamic-search-bar";
import { useEffect, useState } from "react";
import Layout from "../components/layout";
import OTP from "../components/otp";
// @ts-ignore
import { TOTP, URI } from "otpauth/dist/otpauth.esm.js";
import { getOTPList } from "../db";
import { DBOTP } from "../types/otp";
import { useRoute } from "@react-navigation/native";
import { RouteProp } from "@react-navigation/core/src/types";
import { FlatList, RefreshControl, View } from "react-native";
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
        className="mt-4 flex flex-col"
        showsVerticalScrollIndicator={false}
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
        renderItem={({ item }) => {
          return <OTP otp={item} key={item.id} onListen={onListen} />;
        }}
        data={otps}
      />
    </Layout>
  );
}
