import http from "../axios";

export async function AddFeedback(content: string) {
  await http.post("/feedback", {
    content,
  });
}
