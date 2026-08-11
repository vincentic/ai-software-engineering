export const backendUrl = (path: string) => {
  const baseUrl = process.env.BACKEND_URL ?? "http://localhost:3000";
  return `${baseUrl.replace(/\/$/, "")}${path}`;
};
