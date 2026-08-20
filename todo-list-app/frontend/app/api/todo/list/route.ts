import { proxyJson } from "../backend";

export async function GET(request: Request) {
  const url = new URL(request.url);
  return proxyJson(`/todo/list${url.search}`);
}
