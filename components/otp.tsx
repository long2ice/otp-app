import { Text, View } from "react-native";
import SvgView from "react-native-svg-view";
import { CountdownCircleTimer } from "react-native-countdown-circle-timer";

export default function OTP() {
  return (
    <View className="mb-4 flex flex-row items-center rounded bg-white p-3 shadow">
      <SvgView
        source="https://otp.long2ice.io/icon/github.svg"
        style={{ height: 50, width: 50 }}
      />
      <View className="ml-2">
        <Text className="text-xl">Binance</Text>
        <Text className="text-neutral-400">15025586467</Text>
      </View>
      <Text className="font-asap ml-auto mr-2 text-3xl">123456</Text>
      <CountdownCircleTimer
        isPlaying
        duration={30}
        size={40}
        strokeWidth={4}
        colors={["#007aff", "#FF0000"]}
        colorsTime={[30, 0]}
        onComplete={() => {
          return {
            shouldRepeat: true,
            delay: 0,
          };
        }}
      >
        {({ remainingTime }) => <Text>{remainingTime}</Text>}
      </CountdownCircleTimer>
    </View>
  );
}
