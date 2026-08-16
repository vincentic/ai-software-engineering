import { NextRequest } from "next/server";
import { proxyJson } from "../../backend";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  return proxyJson(`/todo/delete/${id}`);
}
