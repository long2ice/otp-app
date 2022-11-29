import { DBOTP } from "./otp";

interface OTPProps {
  otp: DBOTP;
  onListen: (key: number, listener: () => void) => void;
  onDelete: (id: number) => void;
}
