import { NextRequest } from "next/server";
import { proxyJson } from "../backend";

export async function POST(req: NextRequest) {
  const body = await req.json();
  return proxyJson("/todo/add", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}
