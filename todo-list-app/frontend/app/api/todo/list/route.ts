import { proxyJson } from "../backend";

export async function GET() {
  return proxyJson("/todo/list");
}
