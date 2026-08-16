export const backendUrl = (path: string) => {
  const baseUrl = process.env.BACKEND_URL ?? "http://localhost:8080";
  return `${baseUrl.replace(/\/$/, "")}${path}`;
};

export async function proxyJson(path: string, init?: RequestInit) {
  try {
    const res = await fetch(backendUrl(path), init);
    const data = await res.json();

    return Response.json(data, { status: res.ok ? 200 : res.status });
  } catch (error) {
    console.error(`Failed to proxy todo request to ${path}:`, error);

    return Response.json(
      {
        code: 500,
        data: null,
        message: "Unable to reach todo backend",
      },
      { status: 500 }
    );
  }
}
