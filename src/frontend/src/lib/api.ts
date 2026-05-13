// PHP API client for BabyAPI — replaces ICP/Motoko bindings
// Public endpoints do NOT send cookies; protected endpoints use credentials: 'include'

import type {
  ApiKey,
  Invoice,
  MeResponse,
  Notification,
  UsageDay,
} from "@/types/index";

import { getBackendUrl } from "@/lib/config";
import { useAuthStore } from "@/store/auth";

/** Always reads the runtime-configured backend URL — no hardcoded strings. */
export function BASE_URL(): string {
  return getBackendUrl();
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  error: string | null;
}

/**
 * Handle a 401 Unauthorized response globally.
 * Clears auth state and redirects to /login — unless we're already there
 * (avoids redirect loop on the login page itself).
 */
function handle401(): ApiResponse<never> {
  useAuthStore.getState().setUser(null);
  if (!window.location.pathname.startsWith("/login")) {
    window.location.href = "/login";
  }
  return { success: false, data: null as never, error: "Unauthorized" };
}

/** Parse a Response into an ApiResponse, handling non-OK status codes. */
async function parseResponse<T>(res: Response): Promise<ApiResponse<T>> {
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    let parsed: ApiResponse<T> | null = null;
    try {
      parsed = JSON.parse(text) as ApiResponse<T>;
    } catch {
      // not JSON
    }
    if (parsed) return parsed;
    return { success: false, data: null as T, error: `HTTP ${res.status}` };
  }
  const json = (await res.json()) as ApiResponse<T>;
  return json;
}

/**
 * Public fetch — NO credentials sent.
 * Use for auth endpoints and other public routes where cookies must not be included.
 */
async function publicApiClient<T>(
  path: string,
  options: RequestInit = {},
): Promise<ApiResponse<T>> {
  const url = `${BASE_URL()}${path}`;
  const res = await fetch(url, {
    credentials: "omit",
    headers: {
      "Content-Type": "application/json",
      "X-Requested-With": "XMLHttpRequest",
      ...((options.headers as Record<string, string>) ?? {}),
    },
    ...options,
  });
  return parseResponse<T>(res);
}

/**
 * Protected fetch — sends credentials: 'include' (BABYAPI_SESSION cookie).
 * Use for all panel/authenticated endpoints. Auto-redirects to /login on 401.
 */
async function protectedApiClient<T>(
  path: string,
  options: RequestInit = {},
): Promise<ApiResponse<T>> {
  const url = `${BASE_URL()}${path}`;
  const res = await fetch(url, {
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      "X-Requested-With": "XMLHttpRequest",
      ...((options.headers as Record<string, string>) ?? {}),
    },
    ...options,
  });

  if (res.status === 401) {
    return handle401() as ApiResponse<T>;
  }

  return parseResponse<T>(res);
}

/**
 * Protected form/multipart fetch — sends credentials: 'include'.
 * Use for file uploads (avatar, etc.).
 */
async function protectedFormClient<T>(
  path: string,
  body: FormData | URLSearchParams,
): Promise<ApiResponse<T>> {
  const url = `${BASE_URL()}${path}`;
  const res = await fetch(url, {
    method: "POST",
    credentials: "include",
    headers: {
      "X-Requested-With": "XMLHttpRequest",
    },
    body,
  });

  if (res.status === 401) {
    return handle401() as ApiResponse<T>;
  }

  return parseResponse<T>(res);
}

// ── Auth — PUBLIC (no cookies) ────────────────────────────────────────────────

export function login(email: string, password: string) {
  return publicApiClient<MeResponse>("/api/v1/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
}

export function signup(email: string, password: string) {
  return publicApiClient<null>("/api/v1/auth/signup", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
}

export function verifyOtp(email: string, otp: string, purpose: string) {
  return publicApiClient<MeResponse>("/api/v1/auth/verify-otp", {
    method: "POST",
    body: JSON.stringify({ email, otp, purpose }),
  });
}

export function resendOtp(email: string, purpose: string) {
  return publicApiClient<null>("/api/v1/auth/resend-otp", {
    method: "POST",
    body: JSON.stringify({ email, purpose }),
  });
}

export function forgotPassword(email: string) {
  return publicApiClient<null>("/api/v1/auth/forgot-password", {
    method: "POST",
    body: JSON.stringify({ email }),
  });
}

export function resetPassword(email: string, otp: string, password: string) {
  return publicApiClient<null>("/api/v1/auth/reset-password", {
    method: "POST",
    body: JSON.stringify({ email, otp, password }),
  });
}

export function createPassword(password: string) {
  return publicApiClient<null>("/api/v1/auth/create-password", {
    method: "POST",
    body: JSON.stringify({ password }),
  });
}

export function googleOAuth() {
  window.location.href = `${BASE_URL()}/auth/google.php`;
}

// ── Auth — PROTECTED (requires session cookie) ────────────────────────────────

export function logout() {
  return protectedApiClient<null>("/api/v1/auth/logout", { method: "POST" });
}

export function changePassword(current: string, newPwd: string) {
  return protectedApiClient<null>("/api/v1/auth/change-password", {
    method: "POST",
    body: JSON.stringify({ current_password: current, new_password: newPwd }),
  });
}

// ── User — PROTECTED ──────────────────────────────────────────────────────────

export function getMe() {
  return protectedApiClient<MeResponse>("/api/v1/me");
}

export function updateProfile(formData: FormData) {
  return protectedFormClient<MeResponse>("/api/v1/profile", formData);
}

// ── API Keys — PROTECTED ──────────────────────────────────────────────────────

export function getApiKeys() {
  return protectedApiClient<ApiKey[]>("/api/v1/api-keys");
}

export function generateApiKey(applicationName: string) {
  return protectedApiClient<ApiKey>("/api/v1/api-keys/generate", {
    method: "POST",
    body: JSON.stringify({ application_name: applicationName }),
  });
}

export function revokeApiKey(keyId: number, applicationName: string) {
  return protectedApiClient<null>("/api/v1/api-keys/revoke", {
    method: "POST",
    body: JSON.stringify({ key_id: keyId, application_name: applicationName }),
  });
}

// ── Usage — PROTECTED ─────────────────────────────────────────────────────────

export function getUsage(days = 7) {
  return protectedApiClient<UsageDay[]>(`/api/v1/usage?days=${days}`);
}

export function getUsageStats() {
  return protectedApiClient<{
    today: number;
    remaining: number;
    lifetime: number;
    limit: number;
  }>("/api/v1/usage/stats");
}

// ── Billing — PROTECTED ───────────────────────────────────────────────────────

export function getBillingCurrent() {
  return protectedApiClient<{
    plan: string;
    subscription_end: string | null;
  }>("/api/v1/billing/current");
}

export function goToBillingCheckout(plan: string, months: number) {
  window.location.href = `${BASE_URL()}/panel/billing-callback.php?plan=${encodeURIComponent(plan)}&months=${months}`;
}

// ── Plans — PUBLIC (no cookies) ───────────────────────────────────────────────

export function getPlans() {
  return publicApiClient<
    { id: number; name: string; price: number; limit: number }[]
  >("/api/v1/plans");
}

// ── Invoices — PROTECTED ──────────────────────────────────────────────────────

export function getInvoices() {
  return protectedApiClient<Invoice[]>("/api/v1/invoices");
}

export function getInvoicePdfUrl(id: number) {
  return `${BASE_URL()}/api/v1/invoices/${id}/pdf`;
}

// ── Notifications — PROTECTED ─────────────────────────────────────────────────

export function getNotifications() {
  return protectedApiClient<Notification[]>("/api/v1/notifications");
}

export function markNotificationsRead(ids: string[] | "all") {
  return protectedApiClient<null>("/api/v1/notifications/mark-read", {
    method: "POST",
    body: JSON.stringify({ ids }),
  });
}

export function deleteNotifications(ids: string[]) {
  return protectedApiClient<null>("/api/v1/notifications/delete", {
    method: "POST",
    body: JSON.stringify({ ids }),
  });
}

// ── Contact — PUBLIC (no cookies) ─────────────────────────────────────────────

export function submitContact(data: {
  name: string;
  email: string;
  subject: string;
  message: string;
}) {
  return publicApiClient<null>("/api/v1/contact", {
    method: "POST",
    body: JSON.stringify(data),
  });
}
