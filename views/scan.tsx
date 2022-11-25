import React, { useState, useEffect } from "react";
import Toast from "react-native-toast-message";
import i18n from "../i18n";
import { Camera } from "expo-camera";
import { BarCodeScanner } from "expo-barcode-scanner";
import { Text, View } from "react-native";
import { NavigationProp, useNavigation } from "@react-navigation/native";
// @ts-ignore
import { TOTP, URI } from "otpauth/dist/otpauth.esm.js";
import { addOTP } from "../db";

export default function Scan() {
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  useEffect(() => {
    Camera.requestCameraPermissionsAsync().then(({ status }) => {
      if (status === "granted") {
        setHasPermission(true);
        navigation.setOptions({
          headerTransparent: true,
          headerTintColor: "white",
        });
      } else {
        Toast.show({
          type: "error",
          text1: i18n.t("no_camera_permission"),
        });
      }
    });
  }, []);

  const handleBarCodeScanned = ({ data }: { data: string }) => {
    try {
      const totp = URI.parse(data) as TOTP;
      addOTP(totp);
      navigation.navigate("Home", { refresh: true });
    } catch (e) {
      Toast.show({
        type: "error",
        text1: i18n.t("invalid_qr_code"),
      });
    }
  };
  if (hasPermission === null) {
    return (
      <View className="flex h-full w-full items-center justify-center">
        <Text className="text-xl">
          {i18n.t("requesting_camera_permission")}
        </Text>
      </View>
    );
  }
  if (!hasPermission) {
    return (
      <View className="flex h-full w-full items-center justify-center">
        <Text className="text-xl">{i18n.t("no_camera_permission")}</Text>
      </View>
    );
  }
  return (
    <Camera
      onBarCodeScanned={handleBarCodeScanned}
      barCodeScannerSettings={{
        barCodeTypes: [BarCodeScanner.Constants.BarCodeType.qr],
      }}
      className="h-full w-full"
    ></Camera>
  );
}
