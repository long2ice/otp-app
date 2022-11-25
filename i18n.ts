import * as Localization from "expo-localization";
import { I18n } from "i18n-js";

const i18n = new I18n({
  en: {
    home: "Home",
    backup: "Backup & Restore",
    cloud: "Cloud",
    scan: "Scan QR Code",
    manual: "Manual Add",
    cancel: "Cancel",
    submit: "Submit",
    field_required: "{{field}} is required",
    label: "Label",
    issuer: "Issuer",
    secret: "Secret",
    algorithm: "Algorithm",
    digits: "Digits",
    period: "Period",
    no_camera_permission: "No camera permission",
    requesting_camera_permission: "Requesting camera permission",
    invalid_qr_code: "Invalid QR code",
    search: "Search here...",
  },
  zh: {
    home: "首页",
    backup: "备份 & 恢复",
    cloud: "云同步",
    scan: "扫码添加",
    manual: "手动添加",
    cancel: "取消",
    submit: "提交",
    field_required: "{{field}} 必填",
    label: "标签",
    issuer: "发行者",
    secret: "密钥",
    algorithm: "算法",
    digits: "位数",
    period: "周期",
    no_camera_permission: "没有相机权限",
    requesting_camera_permission: "请求相机权限",
    invalid_qr_code: "无效的二维码",
    search: "搜索...",
  },
});

i18n.locale = Localization.locale;
i18n.enableFallback = true;

export default i18n;
