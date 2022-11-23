import { ReactNode } from "react";
import { View } from "react-native";

export default function Layout({ children }: { children: ReactNode }) {
  return <View className="p-4">{children}</View>;
}
