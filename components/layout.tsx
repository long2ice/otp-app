import { ReactNode } from "react";
import { View } from "react-native";

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <View
      className="m-4"
      style={{
        marginBottom: 60,
      }}
    >
      {children}
    </View>
  );
}
