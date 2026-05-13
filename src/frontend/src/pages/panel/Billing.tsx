import { DashboardLayout } from "@/components/DashboardLayout";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/hooks/useAuth";
import { getMe, goToBillingCheckout } from "@/lib/api";
import { PLAN_LABELS } from "@/types/index";
import type { PlanCode } from "@/types/index";
import { useQuery } from "@tanstack/react-query";
import {
  ArrowRight,
  Building2,
  Check,
  Crown,
  Mail,
  Sparkles,
  Star,
  Zap,
} from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";

type BillingPeriod = "monthly" | "yearly";
type Duration = 1 | 3 | 6 | 12;

const CURRENT_PLAN_FEATURES: Record<PlanCode, string[]> = {
  free: [
    "500 API calls per day",
    "Audio streaming",
    "Basic equalizer (10 presets)",
    "Community support",
  ],
  pro: [
    "2,500 API calls per day",
    "Audio & Video streaming",
    "All 30+ equalizer presets",
    "Priority support",
  ],
  pro_plus: [
    "5,000 API calls per day",
    "Download support",
    "Maximum throughput",
    "Dedicated support",
    "Advanced analytics",
  ],
  business: [
    "Unlimited API calls",
    "Custom rate limits",
    "SLA guarantee",
    "Enterprise support",
    "Custom integration",
  ],
};

const PLAN_DATA = [
  {
    code: "pro" as PlanCode,
    name: "Pro",
    monthlyPrice: 49,
    dailyLimit: "2,500",
    highlight: false,
    popular: false,
    features: [
      "All Free features",
      "2,500 API calls/day",
      "Audio & Video streaming",
      "All 30+ equalizer presets",
      "Priority support",
    ],
    icon: Zap,
  },
  {
    code: "pro_plus" as PlanCode,
    name: "Pro Plus",
    monthlyPrice: 99,
    dailyLimit: "5,000",
    highlight: true,
    popular: true,
    features: [
      "All Pro features",
      "5,000 API calls/day",
      "Download support",
      "Maximum throughput",
      "Dedicated support",
    ],
    icon: Star,
  },
  {
    code: "business" as PlanCode,
    name: "Business",
    monthlyPrice: null,
    dailyLimit: "Unlimited",
    highlight: false,
    popular: false,
    features: [
      "Unlimited API calls/day",
      "Custom rate limits",
      "SLA guarantee",
      "Enterprise support",
      "Custom integration",
    ],
    icon: Building2,
  },
];

const PLAN_BADGE_COLORS: Record<PlanCode, string> = {
  free: "bg-muted/60 text-muted-foreground border-border",
  pro: "bg-primary/10 text-primary border-primary/30",
  pro_plus: "bg-accent/10 text-accent border-accent/30",
  business: "bg-yellow-500/10 text-yellow-400 border-yellow-500/30",
};

const PLAN_HERO_GRADIENT: Record<PlanCode, string> = {
  free: "from-muted/40 to-muted/10",
  pro: "from-primary/10 to-primary/5",
  pro_plus: "from-accent/10 to-accent/5",
  business: "from-yellow-500/10 to-yellow-500/5",
};

export function BillingPage() {
  const { t } = useTranslation();
  const { user: authUser } = useAuth();
  const [period, setPeriod] = useState<BillingPeriod>("monthly");
  const [duration, setDuration] = useState<Duration>(1);

  const DURATIONS = useMemo<
    { value: Duration; label: string; best?: boolean }[]
  >(
    () => [
      { value: 1, label: t("billing.duration_1_month") },
      { value: 3, label: t("billing.duration_3_months") },
      { value: 6, label: t("billing.duration_6_months") },
      { value: 12, label: t("billing.duration_12_months"), best: true },
    ],
    [t],
  );

  const { data: meData } = useQuery({
    queryKey: ["me"],
    queryFn: getMe,
    select: (r) => (r.success ? r.data : null),
    enabled: !!authUser,
  });

  const currentPlan = (meData?.plan?.code ??
    authUser?.plan?.code ??
    "free") as PlanCode;

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const payment = params.get("payment");
    if (payment === "success") {
      toast.success(t("billing.payment_success"));
      const url = new URL(window.location.href);
      url.searchParams.delete("payment");
      window.history.replaceState({}, "", url.toString());
    } else if (payment === "failed") {
      toast.error(t("billing.payment_failed"));
      const url = new URL(window.location.href);
      url.searchParams.delete("payment");
      window.history.replaceState({}, "", url.toString());
    }
  }, [t]);

  const getDisplayPrice = (base: number | null) => {
    if (base === null) return null;
    const multiplier = period === "yearly" ? 0.7 : 1;
    return Math.round(base * multiplier);
  };

  const getTotalPrice = (base: number | null) => {
    if (base === null) return null;
    const months = period === "yearly" ? 12 : duration;
    const multiplier = period === "yearly" ? 0.7 : 1;
    return Math.round(base * months * multiplier);
  };

  const handleBuy = (planCode: PlanCode) => {
    if (planCode === "business") {
      window.location.href = "mailto:billing@babyapi.pro";
      return;
    }
    const months = period === "yearly" ? 12 : duration;
    goToBillingCheckout(planCode, months);
  };

  const planLimit = meData?.plan?.daily_limit ?? authUser?.plan?.daily_limit;
  const currentFeatures = CURRENT_PLAN_FEATURES[currentPlan] ?? [];

  return (
    <ProtectedRoute>
      <DashboardLayout>
        <div className="space-y-8 max-w-5xl" data-ocid="billing.page">
          {/* Page header */}
          <div>
            <h1 className="text-2xl font-display font-bold text-foreground">
              {t("billing.title")}
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              {t("billing.subtitle")}
            </p>
          </div>

          {/* Current Plan Hero Card */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <Card className="bg-card border-border overflow-hidden shadow-sm">
              <div className="h-0.5 gradient-primary w-full" />
              <div
                className={`bg-gradient-to-br ${PLAN_HERO_GRADIENT[currentPlan]} p-6`}
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-yellow-500/10 border border-yellow-500/20 flex items-center justify-center flex-shrink-0">
                      <Crown className="w-6 h-6 text-yellow-400" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground uppercase tracking-wider font-medium mb-1">
                        {t("billing.current_plan")}
                      </p>
                      <div className="flex items-center gap-3 flex-wrap">
                        <Badge
                          variant="outline"
                          className={`text-sm px-4 py-1.5 font-bold rounded-full ${PLAN_BADGE_COLORS[currentPlan]}`}
                        >
                          {PLAN_LABELS[currentPlan]}
                        </Badge>
                        <Badge className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs">
                          {t("billing.active")}
                        </Badge>
                      </div>
                      {planLimit !== undefined && (
                        <p className="text-sm text-muted-foreground mt-2">
                          <span className="text-foreground font-semibold">
                            {planLimit.toLocaleString()}
                          </span>{" "}
                          {t("billing.api_calls_day")}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Features included */}
                  <div className="sm:max-w-xs w-full">
                    <p className="text-xs text-muted-foreground uppercase tracking-wider font-medium mb-2">
                      {t("billing.included_features")}
                    </p>
                    <ul className="space-y-1.5">
                      {currentFeatures.map((f) => (
                        <li
                          key={f}
                          className="flex items-center gap-2 text-sm text-muted-foreground"
                        >
                          <div className="w-4 h-4 rounded-full bg-emerald-500/15 flex items-center justify-center flex-shrink-0">
                            <Check className="w-2.5 h-2.5 text-emerald-500" />
                          </div>
                          {f}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {currentPlan === "free" && (
                  <div className="mt-5 pt-5 border-t border-border/40">
                    <div className="flex items-center gap-3">
                      <p className="text-sm text-muted-foreground">
                        {t("billing.upgrade_cta_desc")}
                      </p>
                      <Button
                        size="sm"
                        className="gradient-primary text-white border-0 hover:opacity-90 transition-smooth gap-1.5 flex-shrink-0"
                        onClick={() => {
                          document
                            .getElementById("billing-plans")
                            ?.scrollIntoView({ behavior: "smooth" });
                        }}
                        data-ocid="billing.upgrade_cta.button"
                      >
                        {t("billing.upgrade_now")}
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </Card>
          </motion.div>

          {/* Billing period + duration controls */}
          <div
            id="billing-plans"
            className="flex flex-col sm:flex-row sm:items-center gap-4"
          >
            <span className="text-sm font-medium text-muted-foreground">
              {t("billing.billing_period")}
            </span>
            <div className="flex items-center rounded-xl border border-border p-1 bg-muted/30 w-fit">
              <button
                type="button"
                onClick={() => setPeriod("monthly")}
                className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-smooth ${
                  period === "monthly"
                    ? "bg-card text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
                data-ocid="billing.period.monthly"
              >
                {t("billing.monthly")}
              </button>
              <button
                type="button"
                onClick={() => setPeriod("yearly")}
                className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-smooth flex items-center gap-2 ${
                  period === "yearly"
                    ? "bg-card text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
                data-ocid="billing.period.yearly"
              >
                {t("billing.yearly")}
                <span className="text-xs bg-emerald-500/20 text-emerald-400 px-1.5 py-0.5 rounded-full font-semibold">
                  30% {t("billing.off")}
                </span>
              </button>
            </div>
          </div>

          {period === "monthly" && (
            <div className="flex flex-col sm:flex-row sm:items-center gap-3">
              <span className="text-sm font-medium text-muted-foreground">
                {t("billing.duration")}
              </span>
              <div className="flex flex-wrap gap-2">
                {DURATIONS.map((d) => (
                  <button
                    key={d.value}
                    type="button"
                    onClick={() => setDuration(d.value)}
                    className={`relative px-4 py-2 rounded-xl text-sm font-medium transition-smooth border ${
                      duration === d.value
                        ? "bg-primary text-primary-foreground border-primary shadow-sm"
                        : "bg-muted/30 text-muted-foreground border-border hover:border-primary/40 hover:text-foreground"
                    }`}
                    data-ocid={`billing.duration.${d.value}m`}
                  >
                    {d.label}
                    {d.best && (
                      <span className="absolute -top-2 -right-2 text-[10px] bg-yellow-500 text-black px-1.5 rounded-full font-bold leading-5">
                        {t("billing.best")}
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Plan Cards */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {PLAN_DATA.map((plan, i) => {
              const displayPrice = getDisplayPrice(plan.monthlyPrice);
              const totalPrice = getTotalPrice(plan.monthlyPrice);
              const isCurrentPlan = currentPlan === plan.code;
              const PlanIcon = plan.icon;

              return (
                <motion.div
                  key={plan.code}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.1 + i * 0.1 }}
                >
                  <Card
                    className={`bg-card border relative flex flex-col h-full transition-smooth ${
                      plan.highlight
                        ? "border-primary/50 shadow-elevated"
                        : "border-border hover:border-primary/30 hover:shadow-md"
                    }`}
                    data-ocid={`billing.plan.${plan.code}`}
                  >
                    {plan.popular && (
                      <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-10">
                        <Badge className="gradient-primary text-white border-0 text-xs px-3 py-1 shadow-elevated flex items-center gap-1">
                          <Sparkles className="w-3 h-3" />
                          {t("billing.most_popular")}
                        </Badge>
                      </div>
                    )}
                    {plan.highlight && (
                      <div className="h-0.5 gradient-primary w-full rounded-t-xl" />
                    )}

                    <CardHeader className="pb-3 pt-5">
                      <div className="flex items-center gap-2.5 mb-2">
                        <div
                          className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                            plan.highlight ? "gradient-primary" : "bg-muted/60"
                          }`}
                        >
                          <PlanIcon
                            className={`w-4 h-4 ${
                              plan.highlight
                                ? "text-white"
                                : "text-muted-foreground"
                            }`}
                          />
                        </div>
                        <CardTitle className="font-display text-lg">
                          {plan.name}
                        </CardTitle>
                        {isCurrentPlan && (
                          <Badge
                            variant="outline"
                            className="text-xs ml-auto border-border text-muted-foreground"
                          >
                            {t("billing.current")}
                          </Badge>
                        )}
                      </div>

                      {plan.monthlyPrice !== null ? (
                        <div>
                          <div className="flex items-baseline gap-1">
                            <span className="text-4xl font-display font-bold text-foreground tracking-tight">
                              ₹{displayPrice}
                            </span>
                            <span className="text-muted-foreground text-sm">
                              {t("billing.per_mo")}
                            </span>
                          </div>
                          {totalPrice !== null && (
                            <p className="text-xs text-muted-foreground mt-0.5">
                              {period === "yearly"
                                ? `₹${totalPrice} ${t("billing.billed_yearly")}`
                                : duration > 1
                                  ? `₹${totalPrice} ${t("billing.total_for")} ${duration} ${t("billing.months")}`
                                  : ""}
                            </p>
                          )}
                        </div>
                      ) : (
                        <div>
                          <span className="text-xl font-bold text-foreground">
                            {t("billing.custom_pricing")}
                          </span>
                          <p className="text-xs text-muted-foreground mt-0.5">
                            {t("billing.contact_quote")}
                          </p>
                        </div>
                      )}
                      <div className="mt-1.5">
                        <span className="text-xs text-muted-foreground">
                          {plan.dailyLimit} {t("billing.api_calls_day")}
                        </span>
                      </div>
                    </CardHeader>

                    <CardContent className="flex flex-col flex-1 gap-5">
                      <ul className="space-y-2.5 flex-1">
                        {plan.features.map((f) => (
                          <li
                            key={f}
                            className="flex items-start gap-2.5 text-sm text-muted-foreground"
                          >
                            <div className="w-4 h-4 rounded-full bg-emerald-500/15 flex items-center justify-center flex-shrink-0 mt-0.5">
                              <Check className="w-2.5 h-2.5 text-emerald-500" />
                            </div>
                            <span>{f}</span>
                          </li>
                        ))}
                      </ul>

                      {isCurrentPlan ? (
                        <Button
                          variant="outline"
                          className="w-full border-border text-muted-foreground cursor-default"
                          disabled
                          data-ocid={`billing.current.${plan.code}`}
                        >
                          {t("billing.current_plan_btn")}
                        </Button>
                      ) : plan.code === "business" ? (
                        <Button
                          variant="outline"
                          className="w-full border-border hover:border-primary/40 gap-2 transition-smooth"
                          onClick={() => handleBuy(plan.code)}
                          data-ocid={`billing.contact.${plan.code}`}
                        >
                          <Mail className="w-4 h-4" />
                          {t("billing.contact_us")}
                        </Button>
                      ) : (
                        <Button
                          className={`w-full font-semibold gap-2 transition-smooth ${
                            plan.highlight
                              ? "gradient-primary text-white border-0 hover:opacity-90 shadow-elevated"
                              : "bg-primary text-primary-foreground hover:opacity-90"
                          }`}
                          onClick={() => handleBuy(plan.code)}
                          data-ocid={`billing.buy.${plan.code}`}
                        >
                          <Zap className="w-4 h-4" />
                          {plan.code === "pro"
                            ? t("billing.upgrade_to_pro")
                            : t("billing.upgrade_to_pro_plus")}
                        </Button>
                      )}
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>

          {/* Footer note */}
          <p className="text-xs text-muted-foreground text-center pb-4">
            {t("billing.money_back")}{" "}
            <a
              href="mailto:billing@babyapi.pro"
              className="text-primary hover:underline"
            >
              billing@babyapi.pro
            </a>
          </p>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
}
