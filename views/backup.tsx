import { Text, TouchableOpacity, View } from "react-native";
import Layout from "../components/layout";
import i18n from "../i18n";
import { StyleSheet } from "react-native";
import { DefaultTheme } from "@react-navigation/native";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import * as FileSystem from "expo-file-system";
import { addOTP, getOTPList } from "../db";
import { StorageAccessFramework } from "expo-file-system";
import Toast from "react-native-toast-message";
// @ts-ignore
import { TOTP, URI } from "otpauth/dist/otpauth.esm.js";
import * as DocumentPicker from "expo-document-picker";

const styles = StyleSheet.create({
  button: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    borderRadius: 4,
    elevation: 3,
  },
  text: {
    fontSize: 16,
    lineHeight: 21,
    fontWeight: "bold",
    letterSpacing: 0.25,
  },
});
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
        <TouchableOpacity
          style={{
            ...styles.button,
            backgroundColor: DefaultTheme.colors.primary,
            width: "50%",
          }}
          onPress={backup}
          className="flex flex-row space-x-4"
        >
          <MaterialIcons name="backup" size={24} color="white" />
          <Text
            style={{
              ...styles.text,
              color: "white",
            }}
          >
            {i18n.t("backup_to_file")}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={{
            ...styles.button,
            backgroundColor: "white",
            width: "50%",
          }}
          onPress={restore}
          className="mt-4 flex flex-row space-x-4"
        >
          <MaterialIcons name="restore" size={24} color="gray" />
          <Text
            style={{
              ...styles.text,
              color: "gray",
            }}
          >
            {i18n.t("restore_from_file")}
          </Text>
        </TouchableOpacity>
      </View>
    </Layout>
  );
}
