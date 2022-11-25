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
import { FlatList, RefreshControl } from "react-native";
import i18n from "../i18n";

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
          backgroundColor: "white",
          height: 50,
          shadowColor: "#000",
          shadowOffset: {
            width: 0,
            height: 1,
          },
          shadowOpacity: 0.18,
          shadowRadius: 1,
          elevation: 2,
        }}
        onChangeText={(text) => setValue(text)}
        placeholder={i18n.t("search")}
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
