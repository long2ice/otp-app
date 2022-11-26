import { Text, View } from "react-native";
import * as React from "react";
import Layout from "../components/layout";

export default function Cloud() {
  return (
    <Layout>
      <View className="flex h-full flex-row items-center justify-center">
        <Text className="text-xl">Current is unavailable</Text>
      </View>
    </Layout>
  );
}
