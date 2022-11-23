import http from "../axios";

export async function login(code: string) {
  const { data } = await http.post("/login", {
    code,
  });
  return data;
}
