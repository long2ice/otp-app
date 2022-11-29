import { Text, TouchableNativeFeedback, View } from "react-native";
import Layout from "../components/layout";
import i18n from "../i18n";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import * as FileSystem from "expo-file-system";
import { addOTP, getOTPList } from "../db";
import { StorageAccessFramework } from "expo-file-system";
import Toast from "react-native-toast-message";
// @ts-ignore
import { TOTP, URI } from "otpauth/dist/otpauth.esm.js";
import * as DocumentPicker from "expo-document-picker";
import { globalStyles } from "../styles";

export default function Backup() {
  const checkPermissions = async () => {
    const permissions =
      await StorageAccessFramework.requestDirectoryPermissionsAsync();
    if (!permissions.granted) {
      Toast.show({
        type: "error",
        text1: i18n.t("no_storage_permission"),
      });
      return "";
    }
    return permissions.directoryUri;
  };
  const backup = async () => {
    let dir = await checkPermissions();
    if (dir == "") {
      return;
    }
    getOTPList().then(async (otps) => {
      let data = otps.map((otp) => otp.uri);
      await StorageAccessFramework.createFileAsync(
        dir,
        "tinyotp.json",
        "application/json"
      )
        .then(async (fileUri) => {
          await FileSystem.writeAsStringAsync(fileUri, JSON.stringify(data), {
            encoding: FileSystem.EncodingType.UTF8,
          });
          Toast.show({
            type: "success",
            text1: i18n.t("backup_success"),
          });
        })
        .catch((e) => {
          Toast.show({
            type: "error",
            text1: i18n.t("backup_failed"),
          });
        });
    });
  };
  const restore = async () => {
    await DocumentPicker.getDocumentAsync().then(async (result) => {
      if (result.type == "success") {
        let data = await FileSystem.readAsStringAsync(result.uri, {
          encoding: FileSystem.EncodingType.UTF8,
        });
        let otps = JSON.parse(data);
        otps.forEach((otp: string) => {
          addOTP(URI.parse(otp) as TOTP);
        });
        Toast.show({
          type: "success",
          text1: i18n.t("restore_success"),
        });
      } else {
        Toast.show({
          type: "error",
          text1: i18n.t("restore_failed"),
        });
      }
    });
  };
  return (
    <Layout>
      <View className="flex h-full w-full flex-col items-center justify-center">
        <View className="rounded bg-blue-500">
          <TouchableNativeFeedback
            onPress={backup}
            background={TouchableNativeFeedback.Ripple("", true)}
          >
            <View
              className="flex flex-row items-center justify-center space-x-3 py-3 px-6"
              style={{
                ...globalStyles.shadow,
              }}
            >
              <MaterialIcons name="backup" size={24} color="white" />
              <Text className="text-lg font-bold text-white">
                {i18n.t("backup_to_file")}
              </Text>
            </View>
          </TouchableNativeFeedback>
        </View>
        <View
          className="mt-4 rounded bg-white"
          style={{
            ...globalStyles.shadow,
          }}
        >
          <TouchableNativeFeedback
            onPress={restore}
            background={TouchableNativeFeedback.Ripple("", true)}
          >
            <View className="flex flex-row items-center justify-center space-x-3 py-3 px-6">
              <MaterialIcons name="restore" size={24} color="gray" />
              <Text className="text-lg font-bold text-gray-500">
                {i18n.t("restore_from_file")}
              </Text>
            </View>
          </TouchableNativeFeedback>
        </View>
      </View>
    </Layout>
  );
}
