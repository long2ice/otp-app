import { Animated, Text, TouchableNativeFeedback, View } from "react-native";
import SvgView from "react-native-svg-view";
import { OTPProps } from "../types/props";
import { useEffect, useState } from "react";
import { AnimatedCircularProgress } from "react-native-circular-progress";
import { DefaultTheme } from "@react-navigation/native";
import constants from "../constants";
import { globalStyles } from "../styles";
import * as Clipboard from "expo-clipboard";
import Toast from "react-native-toast-message";
import i18n from "../i18n";
import {
  GestureHandlerRootView,
  Swipeable,
} from "react-native-gesture-handler";
import Feather from "react-native-vector-icons/Feather";

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
  const onPress = async () => {
    await Clipboard.setStringAsync(otp.generate());
    Toast.show({
      type: "success",
      text1: i18n.t("copied"),
    });
  };
  return (
    <GestureHandlerRootView>
      <View
        className="mb-4 rounded bg-white"
        style={{
          ...globalStyles.shadow,
        }}
      >
        <TouchableNativeFeedback
          onPress={onPress}
          background={TouchableNativeFeedback.Ripple("", true)}
        >
          <View>
            <Swipeable
              containerStyle={{
                borderRadius: 4,
              }}
              renderRightActions={(progress, dragX) => {
                const trans = progress.interpolate({
                  inputRange: [0, 1],
                  outputRange: [100, 0],
                  extrapolate: "clamp",
                });
                return (
                  <TouchableNativeFeedback
                    onPress={() => props.onDelete(props.otp.id)}
                  >
                    <Animated.View
                      className="flex h-full items-center justify-center rounded-r bg-red-500 p-5"
                      style={{
                        transform: [{ translateX: trans }],
                      }}
                    >
                      <Feather name="trash-2" size={24} color="white" />
                    </Animated.View>
                  </TouchableNativeFeedback>
                );
              }}
            >
              <View className="flex flex-row items-center p-3">
                <SvgView
                  source={`${constants.API_URL}/icon/${otp.issuer}.svg`}
                  style={{ height: 50, width: 50 }}
                />
                <View className="ml-2">
                  <Text className="text-xl">{otp.issuer}</Text>
                  <Text className="text-neutral-400">{otp.label}</Text>
                </View>
                <Text className="ml-auto mr-2 text-3xl">{otp.generate()}</Text>
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
                  {() => (
                    <Text style={{ transform: [{ scaleX: -1 }] }}>
                      {seconds}
                    </Text>
                  )}
                </AnimatedCircularProgress>
              </View>
            </Swipeable>
          </View>
        </TouchableNativeFeedback>
      </View>
    </GestureHandlerRootView>
  );
}
