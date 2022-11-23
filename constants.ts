import { TestIds } from "react-native-google-mobile-ads";
import { Platform } from "react-native";

const constants = {
  KEYWORDS: "keywords",
  TG_SCHEME_LINK: "tg://resolve?domain=jenlors",
  TG_HTTPS_LINK: "https://t.me/jenlors",
  AD_APP_OPEN: __DEV__
    ? TestIds.APP_OPEN
    : Platform.select({
        ios: "ca-app-pub-4103172601745047/1178575133",
        android: "ca-app-pub-4103172601745047/2749880949",
        default: TestIds.APP_OPEN,
      }),
  AD_BANNER: __DEV__
    ? TestIds.BANNER
    : Platform.select({
        ios: "ca-app-pub-4103172601745047/6351010766",
        android: "ca-app-pub-4103172601745047/7875598005",
        default: TestIds.BANNER,
      }),
  API_SECRET: "holjl698709X",
  API_URL: "https://otp.long2ice.io",
};
export default constants;
