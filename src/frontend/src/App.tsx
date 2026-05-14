import { Toaster } from "@/components/ui/sonner";
import {
  Outlet,
  RouterProvider,
  createRootRoute,
  createRoute,
  createRouter,
} from "@tanstack/react-router";
import { useEffect } from "react";

import { DiagnosticPanel } from "@/components/DiagnosticPanel";
import { useAuth } from "@/hooks/useAuth";

// ── Pages ─────────────────────────────────────────────────────────────────────
import { ContactPage } from "@/pages/Contact";
import { DocsPage } from "@/pages/Docs";
import { ForgotPasswordPage } from "@/pages/ForgotPassword";
import { HomePage } from "@/pages/Home";
import { LoginPage } from "@/pages/Login";
import { PricingPage } from "@/pages/Pricing";
import { PrivacyPage } from "@/pages/Privacy";
import { RefundPage } from "@/pages/Refund";
import { ResetPasswordPage } from "@/pages/ResetPassword";
import { SignupPage } from "@/pages/Signup";
import { TermsPage } from "@/pages/Terms";

// Auth flow pages
import { CreatePasswordPage } from "@/pages/auth/CreatePassword";
import { PasswordSuccessPage } from "@/pages/auth/PasswordSuccess";
import { VerifyOtpPage } from "@/pages/auth/VerifyOtp";

import { CookieConsent } from "@/components/CookieConsent";
import { ApiKeysPage } from "@/pages/panel/ApiKeys";
import { BillingPage } from "@/pages/panel/Billing";
// Panel pages
import { DashboardPage } from "@/pages/panel/Dashboard";
import { InvoicesPage } from "@/pages/panel/Invoices";
import { NotificationsPage } from "@/pages/panel/Notifications";
import { ProfileSettingsPage } from "@/pages/panel/ProfileSettings";
import { UsagePage } from "@/pages/panel/Usage";
import { applyDocumentDir } from "./lib/i18n";

// ── Root ──────────────────────────────────────────────────────────────────────

function RootComponent() {
  const { initialize } = useAuth();

  useEffect(() => {
    initialize();
    applyDocumentDir(localStorage.getItem("babiesiq-lang") || "en");
  }, [initialize]);

  return (
    <>
      <Outlet />
      <Toaster position="top-right" richColors />
      <CookieConsent />
    </>
  );
}

const rootRoute = createRootRoute({ component: RootComponent });

// ── Public routes ─────────────────────────────────────────────────────────────
const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: HomePage,
});
const pricingRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/pricing",
  component: PricingPage,
});
const docsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/docs",
  component: DocsPage,
});
const contactRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/contact",
  component: ContactPage,
});
const privacyRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/privacy",
  component: PrivacyPage,
});
const termsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/terms",
  component: TermsPage,
});
const refundRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/refund",
  component: RefundPage,
});

// ── Auth routes ───────────────────────────────────────────────────────────────
const loginRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/login",
  component: LoginPage,
});
const signupRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/signup",
  component: SignupPage,
});
const forgotPasswordRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/forgot-password",
  component: ForgotPasswordPage,
});
const resetPasswordRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/reset-password",
  component: ResetPasswordPage,
});
const verifyOtpRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/auth/verify-otp",
  component: VerifyOtpPage,
});
const createPasswordRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/auth/create-password",
  component: CreatePasswordPage,
});
const passwordSuccessRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/auth/password-success",
  component: PasswordSuccessPage,
});

// ── Panel routes ──────────────────────────────────────────────────────────────
const panelDashboardRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/panel/dashboard",
  component: DashboardPage,
});
const panelApiKeysRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/panel/api-keys",
  component: ApiKeysPage,
});
const panelUsageRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/panel/usage",
  component: UsagePage,
});
const panelBillingRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/panel/billing",
  component: BillingPage,
});
const panelInvoicesRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/panel/invoices",
  component: InvoicesPage,
});
const panelNotificationsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/panel/notifications",
  component: NotificationsPage,
});
const panelProfileRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/panel/profile-settings",
  component: ProfileSettingsPage,
});

// ── Router ────────────────────────────────────────────────────────────────────
const routeTree = rootRoute.addChildren([
  indexRoute,
  pricingRoute,
  docsRoute,
  contactRoute,
  privacyRoute,
  termsRoute,
  refundRoute,
  loginRoute,
  signupRoute,
  forgotPasswordRoute,
  resetPasswordRoute,
  verifyOtpRoute,
  createPasswordRoute,
  passwordSuccessRoute,
  panelDashboardRoute,
  panelApiKeysRoute,
  panelUsageRoute,
  panelBillingRoute,
  panelInvoicesRoute,
  panelNotificationsRoute,
  panelProfileRoute,
]);

const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return (
    <>
      <RouterProvider router={router} />
      <DiagnosticPanel />
    </>
  );
}
