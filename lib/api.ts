import { authClient } from "./auth-client";

export async function getToken(): Promise<string | null> {
  const { data } = await authClient.token();
  return data?.token ?? null;
}