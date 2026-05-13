import { Layout } from "@/components/Layout";
import { Link } from "@tanstack/react-router";
import { FileText } from "lucide-react";

const SECTIONS = [
  {
    id: "acceptance",
    title: "1. Acceptance of Terms",
    content: [
      "By accessing or using BabyAPI at babyapi.pro, you agree to be bound by these Terms of Service.",
      "If you do not agree to these terms, you must not use the service.",
      "We reserve the right to update these terms at any time. Continued use after changes constitutes acceptance.",
      "You must be at least 18 years old or have parental consent to use this service.",
    ],
  },
  {
    id: "service",
    title: "2. Service Description",
    content: [
      "BabyAPI provides a REST API for accessing YouTube-based audio and video streaming capabilities.",
      "The service includes search, audio extraction, video extraction, streaming with equalizer presets, and seek functionality.",
      "Access is provided through API keys, which are tied to your account and subscription plan.",
      "We reserve the right to modify, suspend, or discontinue any part of the service at any time with reasonable notice.",
    ],
  },
  {
    id: "obligations",
    title: "3. User Obligations",
    content: [
      "You are responsible for maintaining the confidentiality of your API key. Do not share it publicly.",
      "You must not use BabyAPI for any unlawful purpose or in violation of any regulations.",
      "You must not attempt to circumvent rate limits, access controls, or security measures.",
      "You must not use the service to stream copyrighted content in violation of applicable copyright law.",
      "You must not use automated scripts to exceed your plan's daily request limits.",
      "Violations may result in immediate account suspension without refund.",
    ],
  },
  {
    id: "api-usage",
    title: "4. API Usage",
    content: [
      "API usage is subject to the daily request limits of your subscribed plan.",
      "Free plan: 500 requests per day. Pro: 2,500/day. Pro Plus: 5,000/day. Business: Unlimited.",
      "Limits reset daily at midnight UTC.",
      "Exceeding limits will result in 429 responses. We do not charge overage fees — requests are simply rejected.",
      "API keys are issued one per account. Generating a new key automatically revokes the previous one.",
    ],
  },
  {
    id: "payment",
    title: "5. Payment Terms",
    content: [
      "Paid plans (Pro, Pro Plus, Business) are billed via Razorpay. All prices are in Indian Rupees (INR).",
      "Monthly billing: Pro at ₹49/month, Pro Plus at ₹99/month.",
      "Yearly billing provides a 30% discount. Multi-month purchases (1, 3, 6, 12 months) are available.",
      "Plan upgrades take effect immediately upon successful payment. Activation may take up to a few minutes.",
      "We do not offer prorated refunds for unused periods within a billing cycle, except as described in our Refund Policy.",
    ],
  },
  {
    id: "termination",
    title: "6. Termination",
    content: [
      "You may delete your account at any time by contacting support.",
      "We may suspend or terminate your account for violations of these terms, abuse of the service, or non-payment.",
      "Upon termination, your API keys are immediately revoked and access to the dashboard is removed.",
      "Active paid subscriptions will not be automatically refunded upon voluntary termination.",
    ],
  },
  {
    id: "liability",
    title: "7. Limitation of Liability",
    content: [
      "BabyAPI is provided on an 'as is' and 'as available' basis without any warranties of any kind.",
      "We do not guarantee 100% uptime, though we target 99.9% availability.",
      "BabyAPI is not liable for any indirect, incidental, or consequential damages arising from service use.",
      "Our total liability is limited to the amount paid by you in the 3 months preceding any claim.",
      "We are not responsible for YouTube's availability or content policy changes that may affect API results.",
    ],
  },
  {
    id: "contact",
    title: "8. Contact",
    content: [
      "For questions about these Terms: contact@babyapi.pro",
      "For billing disputes: contact@babyapi.pro with your invoice number.",
      "For abuse reports: contact@babyapi.pro",
    ],
  },
];

function PolicySection({
  id,
  title,
  content,
}: { id: string; title: string; content: string[] }) {
  return (
    <section
      id={id}
      className="mb-10 scroll-mt-24"
      data-ocid={`terms.${id}.section`}
    >
      <h2 className="font-display font-bold text-lg text-foreground mb-3">
        {title}
      </h2>
      <div className="h-px bg-border mb-4" />
      <ul className="space-y-2">
        {content.map((line) => (
          <li
            key={line.slice(0, 40)}
            className="flex items-start gap-2.5 text-sm text-muted-foreground font-body leading-relaxed"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-primary/50 mt-2 flex-shrink-0" />
            <span>{line}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}

export function TermsPage() {
  return (
    <Layout>
      <div className="bg-background min-h-screen" data-ocid="terms.page">
        <div className="bg-card border-b border-border px-4 py-10">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center gap-2 mb-3">
              <FileText className="w-4 h-4 text-primary" />
              <span className="text-[10px] font-mono text-primary uppercase tracking-widest">
                Legal
              </span>
            </div>
            <h1 className="font-display font-bold text-2xl md:text-3xl text-foreground mb-2">
              Terms of Service
            </h1>
            <p className="text-sm text-muted-foreground font-body">
              Last updated: January 2025 · Effective date: January 2025
            </p>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-4 py-10 flex gap-10">
          <aside className="hidden lg:block w-52 flex-shrink-0">
            <div className="sticky top-24">
              <p className="text-[10px] font-mono font-bold text-muted-foreground uppercase tracking-widest mb-3">
                Contents
              </p>
              <nav className="flex flex-col gap-0.5">
                {SECTIONS.map((s) => (
                  <a
                    key={s.id}
                    href={`#${s.id}`}
                    className="text-xs font-body text-muted-foreground hover:text-primary transition-colors py-1 px-2 rounded hover:bg-primary/5 truncate"
                  >
                    {s.title}
                  </a>
                ))}
              </nav>
            </div>
          </aside>

          <div className="flex-1 min-w-0">
            <p className="text-sm text-muted-foreground font-body leading-relaxed mb-8 p-4 rounded-lg bg-card border border-border">
              These Terms of Service govern your use of the BabyAPI platform at{" "}
              <a
                href="https://babyapi.pro"
                className="text-primary hover:underline"
              >
                babyapi.pro
              </a>
              . Please read them carefully before using the service.
            </p>
            {SECTIONS.map((s) => (
              <PolicySection key={s.id} {...s} />
            ))}
            <p className="text-xs text-muted-foreground font-body mt-8 pt-6 border-t border-border">
              By using BabyAPI you acknowledge that you have read and agree to
              these Terms.{" "}
              <Link to="/contact" className="text-primary hover:underline">
                Contact us
              </Link>{" "}
              with any questions.
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
}
