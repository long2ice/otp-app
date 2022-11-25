import { Text, View } from "react-native";
import SvgView from "react-native-svg-view";
import { OTPProps } from "../types/props";
import { useEffect, useState } from "react";
import { AnimatedCircularProgress } from "react-native-circular-progress";
import { DefaultTheme } from "@react-navigation/native";

export default function OTP(props: OTPProps) {
  const otp = props.otp.otp;
  const [fill, setFill] = useState(0);
  const [seconds, setSeconds] = useState(0);
  useEffect(() => {
    props.onListen(props.otp.id, () => {
      const seconds =
        (otp.period * (1 - ((Date.now() / 1000 / otp.period) % 1)) + 1) | 0;
      setSeconds(seconds);
      setFill(Math.floor((seconds / otp.period) * 100));
    });
  }, []);
  return (
    <View
      className="mb-4 flex flex-row items-center rounded bg-white p-3"
      style={{
        shadowColor: "#000",
        shadowOffset: {
          width: 0,
          height: 1,
        },
        shadowOpacity: 0.18,
        shadowRadius: 1,
        elevation: 2,
      }}
    >
      <SvgView
        source="https://otp.long2ice.io/icon/github.svg"
        style={{ height: 50, width: 50 }}
      />
      <View className="ml-2">
        <Text className="text-xl">{otp.issuer}</Text>
        <Text className="text-neutral-400">{otp.label}</Text>
      </View>
      <Text className="font-asap ml-auto mr-2 text-3xl">{otp.generate()}</Text>
      <AnimatedCircularProgress
        lineCap="round"
        duration={1000}
        tintColor="red"
        tintColorSecondary={DefaultTheme.colors.primary}
        backgroundColor={DefaultTheme.colors.background}
        style={{ transform: [{ scaleX: -1 }] }}
        fill={fill}
        rotation={0}
        size={40}
        width={4}
      >
        {() => <Text style={{ transform: [{ scaleX: -1 }] }}>{seconds}</Text>}
      </AnimatedCircularProgress>
    </View>
  );
}
