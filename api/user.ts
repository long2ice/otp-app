import http from "../axios";

export async function getUser() {
  let { data } = await http.get("/user");
  return data;
}

export async function updateUser(isCloudEnabled: boolean) {
  let { data } = await http.put("/user", {
    data: {
      is_cloud_enabled: isCloudEnabled,
    },
  });
  return data;
}
