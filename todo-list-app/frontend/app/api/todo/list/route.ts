import { NextResponse } from "next/server";
import { backendUrl } from "../backend";

export async function GET() {
  const res = await fetch(backendUrl("/todo/list"));
  const data = await res.json();
  return NextResponse.json(data);
}
