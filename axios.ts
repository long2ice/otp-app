import axios from "axios";
import { getRandomStr, getSign } from "./sign";
import i18n from "./i18n";
import constants from "./constants";
import Toast from "react-native-toast-message";

const http = axios.create({
  baseURL: constants.API_URL,
});

http.interceptors.request.use((config) => {
  let timestamp = new Date().getTime().toString().substring(0, 10);
  let nonce = getRandomStr(8);
  let data;
  if (config.method === "get" || config.method === "delete") {
    data = config.params;
  } else {
    data = config.data;
  }
  config.headers = config.headers ?? {};
  config.headers["x-timestamp"] = timestamp;
  config.headers["x-nonce"] = nonce;
  config.headers["x-sign"] = getSign(data, timestamp, nonce);
  config.headers["Accept-Language"] = i18n.locale;
  return config;
});
http.interceptors.response.use(
  function (response) {
    return response;
  },
  function (error) {
    let response = error.response;
    if (response.status < 500) {
      Toast.show({
        type: "error",
        text1: response.data.error,
      });
    } else {
      Toast.show({
        type: "error",
        text1: "Server Error",
      });
    }
    return Promise.reject(error);
  }
);
export default http;
