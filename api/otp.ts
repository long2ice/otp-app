import http from "../axios";

export async function deleteOTP(uri: string) {
  const { data } = await http.put("/otp", {
    uri,
  });
  return data;
}

export async function deleteOTPRecycle(id: number) {
  const { data } = await http.delete(`/otp/${id}/recycle`);
  return data;
}

export async function restoreOTP(id: number) {
  const { data } = await http.put(`/otp/${id}/restore`);
  return data;
}

export async function getRecycle() {
  const { data } = await http.get("/otp/recycle");
  return data;
}

export async function getOTPList() {
  const { data } = await http.get("/otp");
  return data;
}

export async function addOTPs(uris: string[]) {
  const { data } = await http.post("/otp", {
    uris,
  });
  return data;
}
