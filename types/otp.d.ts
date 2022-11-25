import { TOTP } from "otpauth/dist/otpauth.esm.js";

type OtpFields =
  | "label"
  | "secret"
  | "issuer"
  | "digits"
  | "period"
  | "algorithm";

interface DBOTP {
  id: number;
  otp: TOTP;
  uri: string;
  created_at: string;
}
