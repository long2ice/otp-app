import { TestIds } from "react-native-google-mobile-ads";
import { Platform } from "react-native";
import * as FileSystem from "expo-file-system";

const constants = {
  AD_APP_OPEN: __DEV__
    ? TestIds.APP_OPEN
    : Platform.select({
        ios: "",
        android: "",
        default: TestIds.APP_OPEN,
      }),
  AD_BANNER: __DEV__
    ? TestIds.BANNER
    : Platform.select({
        ios: "",
        android: "",
        default: TestIds.BANNER,
      }),
  API_SECRET: "holjl698709X",
  API_URL: "https://otp.long2ice.io",
  BACKUP_URI: FileSystem.documentDirectory + "tinyotp.json",
};
export default constants;
