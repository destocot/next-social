import type { User } from "@prisma/client";

export async function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function generateFullName(user: User) {
  const { name, surname, username } = user;
  return [name, surname].filter(Boolean).join(" ") || username;
}
