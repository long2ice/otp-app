import React, { useState, useEffect } from "react";
import Toast from "react-native-toast-message";
import i18n from "../i18n";
import { Camera } from "expo-camera";
import { BarCodeScanner } from "expo-barcode-scanner";
import { Pressable, Text, View } from "react-native";
import { NavigationProp, useNavigation } from "@react-navigation/native";
// @ts-ignore
import { TOTP, URI } from "otpauth/dist/otpauth.esm.js";
import { addOTP } from "../db";
import Feather from "react-native-vector-icons/Feather";
import * as ImagePicker from "expo-image-picker";

export default function Scan() {
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const pickImage = async () => {
    await ImagePicker.requestMediaLibraryPermissionsAsync().then(
      async (res) => {
        if (!res.granted) {
          Toast.show({
            type: "error",
            text1: i18n.t("no_media_permission"),
          });
          return;
        }
        let pick = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
        });
        if (!pick.canceled) {
          const asset = pick.assets[0];
          const results = await BarCodeScanner.scanFromURLAsync(asset.uri, [
            BarCodeScanner.Constants.BarCodeType.qr,
          ]);
          if (results.length == 0) {
            Toast.show({
              type: "error",
              text1: i18n.t("invalid_qr_code"),
            });
            return;
          }
          const result = results[0];
          const data = result.data;
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
        }
      }
    );
  };
  useEffect(() => {
    Camera.requestCameraPermissionsAsync().then(({ status }) => {
      if (status === "granted") {
        setHasPermission(true);
        navigation.setOptions({
          headerTransparent: true,
          headerTintColor: "white",
          headerRight: () => (
            <Pressable onPress={pickImage}>
              <Feather name="image" size={24} color="white" />
            </Pressable>
          ),
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
