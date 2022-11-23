import { View } from "react-native";
import SearchBar from "react-native-dynamic-search-bar";
import { useState } from "react";
import Layout from "../components/layout";
import OTP from "../components/otp";

export default function Home() {
  const [value, setValue] = useState("");
  return (
    <Layout>
      <SearchBar
        style={{
          width: "100%",
          borderRadius: 4,
          height: 50,
        }}
        onChangeText={(text) => setValue(text)}
      />
      <View className="mt-4 flex flex-col">
        <OTP />
        <OTP />
        <OTP />
        <OTP />
        <OTP />
      </View>
    </Layout>
  );
}
