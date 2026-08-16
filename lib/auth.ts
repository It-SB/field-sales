import "server-only";

import { cookies } from "next/headers";
import { readJsonFile } from "./db";
import type { User } from "./types";

export async function authenticateUser(
  email: string,
  password: string
): Promise<User | null> {
  const users = await readJsonFile<User[]>("users.json");

  const user = users.find(
    (item) =>
      item.email.toLowerCase() === email.toLowerCase() &&
      item.password === password
  );

  return user ?? null;
}

export async function getUserById(
  userId: string
): Promise<User | null> {
  const users = await readJsonFile<User[]>("users.json");

  return users.find((user) => user.id === userId) ?? null;
}

export async function getCurrentUser(): Promise<User | null> {
  const cookieStore = await cookies();
  const userId = cookieStore.get("demo_user_id")?.value;

  if (!userId) {
    return null;
  }

  return getUserById(userId);
}