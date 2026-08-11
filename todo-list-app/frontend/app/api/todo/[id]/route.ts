import { NextRequest, NextResponse } from "next/server";
import { backendUrl } from "../backend";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const res = await fetch(backendUrl(`/todo/${id}`));
  const data = await res.json();
  return NextResponse.json(data);
}
