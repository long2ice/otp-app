import { View } from "react-native";
import * as React from "react";
import { SvgFromUri } from "react-native-svg";

export default function Cloud() {
  return (
    <View>
      <SvgFromUri
        width={100}
        height={100}
        uri="https://otp.long2ice.io/icon/github.svg"
      />
    </View>
  );
}
