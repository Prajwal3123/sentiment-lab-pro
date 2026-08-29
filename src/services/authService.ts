import type { User, UserRole } from "@/types";
import { delay } from "./api-contract";

/**
 * MOCK AUTHENTICATION
 * ------------------------------------------------------------------
 * Deliberately isolated so it can be swapped for the real backend
 * (POST /api/auth/login, POST /api/auth/register) without touching UI.
 * Credentials are never validated against any server.
 */

export const AUTH_STORAGE_KEY = "sentiment-lab.session";

const DEMO_ACCOUNTS: Record<string, { password: string; user: User }> = {
  "analyst@sentimentlab.io": {
    password: "analyst123",
    user: {
      id: "usr_02",
      name: "Ananya Krishnan",
      email: "analyst@sentimentlab.io",
      role: "analyst",
      status: "active",
      lastActive: new Date().toISOString(),
      predictions: 12904,
    },
  },
  "admin@sentimentlab.io": {
    password: "admin123",
    user: {
      id: "usr_01",
      name: "Prajwal Deshmukh",
      email: "admin@sentimentlab.io",
      role: "administrator",
      status: "active",
      lastActive: new Date().toISOString(),
      predictions: 4820,
    },
  },
};

export const DEMO_CREDENTIALS = [
  { label: "Analyst", email: "analyst@sentimentlab.io", password: "analyst123" },
  { label: "Administrator", email: "admin@sentimentlab.io", password: "admin123" },
];

/** POST /api/auth/login */
export async function login(email: string, password: string): Promise<User> {
  await delay(null, 700);
  const account = DEMO_ACCOUNTS[email.trim().toLowerCase()];
  if (!account || account.password !== password) {
    throw new Error("Invalid email or password. Use a demo account listed below.");
  }
  return account.user;
}

/** POST /api/auth/register — public sign-up is always role "analyst". */
export async function register(input: {
  name: string;
  email: string;
  password: string;
}): Promise<User> {
  await delay(null, 850);
  const role: UserRole = "analyst";
  return {
    id: `usr_${Date.now().toString(36)}`,
    name: input.name,
    email: input.email,
    role,
    status: "active",
    lastActive: new Date().toISOString(),
    predictions: 0,
  };
}
