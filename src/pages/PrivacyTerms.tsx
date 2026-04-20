import { useState } from "react";
import { Helmet } from "react-helmet-async";
import { Container } from "@/components/layout/Container";
import { SITE_URL } from "@/lib/constants";

interface Section {
  id: string;
  title: string;
  content: string | string[];
}

interface TabContent {
  title: string;
  sections: Section[];
}

const privacyPolicy: TabContent = {
  title: "Privacy Policy",
  sections: [
    {
      id: "intro",
      title: "1.1 Introduction",
      content:
        'RizFlow ("we", "our", "us") respects your privacy and is committed to protecting personal data collected through our website (rizflow.co) and our service offerings. This Privacy Policy explains what information we collect, how we use it, and your rights regarding that data.',
    },
    {
      id: "collect",
      title: "1.2 Information We Collect",
      content: [
        "• Personal data: Name, email address, phone number, company name, job title — collected via contact forms, free audit requests, Calendly scheduling, and email correspondence",
        "• Usage data: IP address, browser type, operating system, pages visited, referral source, timestamps — automatically collected via server logs and analytics tools (Plausible, Umami)",
        "• Cookie data: Session IDs, preferences, analytics identifiers — set by our site or third-party services",
        "• Service data (clients only): Details of your business's workflow, tool integrations, performance metrics — provided during onboarding",
        "",
        "We do not collect sensitive personal data (health, racial/ethnic origin, religious beliefs) unless voluntarily provided, and we will delete it immediately if not needed for service delivery.",
      ],
    },
    {
      id: "use",
      title: "1.3 How We Use Your Information",
      content: [
        "• To provide and improve our services – process audit requests, configure AI agents, deliver reports, and communicate updates",
        "• To respond to inquiries – answer questions via email, Calendly, or chat",
        "• To send service-related notifications – service updates, billing reminders, and security notices (you may opt-out of promotional emails)",
        "• To analyse and improve the website – aggregated usage data helps us optimize performance and content",
        "• To comply with legal obligations – retain records as required by law (e.g., tax invoices)",
        "",
        "We do not sell, rent, or trade your personal data to third parties for marketing purposes.",
      ],
    },
    {
      id: "sharing",
      title: "1.4 Sharing & Disclosure",
      content: [
        "We may share your data with:",
        "• Service providers that help us operate the website and deliver services (Formspree/Getform, Calendly, Vercel/Netlify, email service providers). These processors are bound by confidentiality agreements.",
        "• Legal authorities if required by law, a subpoena, or to protect our rights, safety, or property.",
      ],
    },
    {
      id: "retention",
      title: "1.5 Data Retention",
      content: [
        "• Personal data from inquiries & audit requests: Retained for 24 months unless you request deletion earlier",
        "• Service-related data (client configurations, performance metrics): Retained for the duration of the contract plus 24 months after termination",
        "• Usage logs & analytics data: Retained for 14 months (or per analytics provider's policy)",
        "",
        "You may request deletion of your personal data at any time by contacting us at privacy@rizflow.co.",
      ],
    },
    {
      id: "rights",
      title: "1.6 Your Rights",
      content: [
        "Depending on your jurisdiction (Singapore PDPA, GDPR, etc.), you have the right to:",
        "• Access the personal data we hold about you",
        "• Rectify inaccurate or incomplete data",
        '• Erase ("right to be forgotten") your personal data, subject to legal retention requirements',
        "• Restrict or object to processing of your data",
        "• Data portability – receive your data in a structured, commonly used format",
        "• Withdraw consent where processing is based on consent (e.g., marketing emails)",
        "",
        "To exercise any of these rights, email privacy@rizflow.co with a verifiable request.",
      ],
    },
    {
      id: "cookies",
      title: "1.7 Cookies & Similar Technologies",
      content: [
        "Our site uses:",
        "• Essential cookies – necessary for site functionality (session management)",
        "• Analytics cookies – Plausible/Umami to gather anonymized usage statistics",
        "• Third-party embedded cookies – from Calendly when you interact with the scheduling widget",
        "",
        "You can manage or disable cookies via your browser settings. Disabling essential cookies may affect site functionality.",
      ],
    },
    {
      id: "security",
      title: "1.8 Data Security",
      content: [
        "We implement reasonable technical and organizational measures to protect your data, including:",
        "• Encryption in transit (TLS 1.2+)",
        "• Encryption at rest (AES-256) for databases and file storage",
        "• Regular security updates and vulnerability scanning",
        "• Access controls – least-privilege principles and multi-factor authentication for admin accounts",
        "",
        "No method of transmission or storage is 100% secure; however, we strive to protect your data against unauthorized access, alteration, or disclosure.",
      ],
    },
    {
      id: "transfers",
      title: "1.9 International Data Transfers",
      content:
        "If you are located outside Singapore, your data may be transferred to and processed in countries where our service providers operate (e.g., United States, European Economic Area). We ensure such transfers are safeguarded by Standard Contractual Clauses (SCCs) or equivalent mechanisms.",
    },
    {
      id: "changes",
      title: "1.10 Changes to This Policy",
      content:
        'We may update this Privacy Policy from time to time. The "Last updated" date at the top reflects the most recent revision. We will notify you of material changes via email or a notice on the website.',
    },
    {
      id: "contact-privacy",
      title: "1.11 Contact Us",
      content: [
        "For questions, requests, or concerns regarding this Privacy Policy, please contact:",
        "• Email: main@rizflow.co",
        "• Phone: +65 9181-7631",
      ],
    },
  ],
};

const termsOfService: TabContent = {
  title: "Terms of Service",
  sections: [
    {
      id: "acceptance",
      title: "2.1 Acceptance of Terms",
      content:
        'By accessing or using the website rizflow.co ("Site") and/or engaging our services ("Service"), you agree to be bound by these Terms of Service ("Terms"). If you do not agree, please do not use the Site or Service.',
    },
    {
      id: "overview",
      title: "2.2 Service Overview",
      content: [
        'RizFlow provides Custom agentic-AI implementation (the "Service") for businesses and SMEs across all industries. The Service includes:',
        "• Free Discovery Audit (no-obligation assessment)",
        "• Paid service tiers (Essential, Professional, Enterprise) that deploy specialized AI agents",
        "• Optional add-ons (custom agent development, integrations, training, consulting)",
        "",
        "Details of each tier are available on the Services page.",
      ],
    },
    {
      id: "eligibility",
      title: "2.3 Eligibility",
      content:
        "You must be at least 18 years old and have the authority to bind the business (or be acting on behalf of the business) to enter into these Terms. The Service is intended for business-to-business (B2B) use only.",
    },
    {
      id: "account",
      title: "2.4 Account & Registration",
      content:
        "To receive the Free Discovery Audit or engage a paid tier, you will need to provide accurate and complete information (name, email, phone, business details, website). You are responsible for maintaining the confidentiality of your account credentials and for all activities under your account.",
    },
    {
      id: "payment",
      title: "2.5 Payment & Billing",
      content: [
        "• Fees are listed on the Services page and quoted in Singapore Dollars (SGD)",
        "• Payment methods include credit/debit cards via Stripe/PayPal or bank transfer",
        "• Billing cycle is monthly in advance for recurring tiers",
        "• Late payments may result in suspension of service after a 5-day grace period",
        "• Refunds: We offer a 90-day guarantee; if after 90 days you have not seen the promised time-savings or measurable improvement, we will remediate at no additional cost or provide a prorated refund",
        "• Taxes: You are responsible for any applicable taxes; we will invoice accordingly where required",
      ],
    },
    {
      id: "delivery",
      title: "2.6 Service Delivery & Responsibilities",
      content: [
        "We will configure and maintain the AI agents and related integrations according to the agreed scope.",
        "",
        "You (the Client) are responsible for:",
        "• Providing necessary access to your tools (PM software, CRM, email, accounting systems)",
        "• Designating a point of contact",
        "",
        "We do not guarantee specific revenue increases or business outcomes; we guarantee that agents will perform the defined operational tasks with the agreed service level (uptime, response time).",
        "",
        "Any custom development or integration work outside the defined scope will be quoted separately and requires your written approval before commencement.",
      ],
    },
    {
      id: "ip",
      title: "2.7 Intellectual Property",
      content: [
        "• Our IP: The AI agent configurations, prompts, workflows, documentation, and the Site (code, design, content) are the exclusive property of RizFlow or its licensors",
        "• Your IP: You retain all rights to your data, branding, content, and any proprietary business information you provide",
        "• Feedback: If you provide suggestions, ideas, or feedback, you grant us a perpetual, worldwide, royalty-free license to use, modify, and distribute such feedback",
      ],
    },
    {
      id: "confidentiality",
      title: "2.8 Confidentiality",
      content:
        "Both parties agree to keep confidential all non-public information disclosed in connection with the Service (including business processes, financial data, and technical details) and to use such information solely for performing the Service or fulfilling obligations under these Terms. This obligation survives termination for 24 months.",
    },
    {
      id: "warranty",
      title: "2.9 Warranty Disclaimer",
      content:
        'THE SERVICE IS PROVIDED "AS IS" AND "AS AVAILABLE." WE MAKE NO WARRANTIES, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, NON-INFRINGEMENT, OR THAT THE SERVICE WILL BE UNINTERRUPTED OR ERROR-FREE.',
    },
    {
      id: "liability",
      title: "2.10 Limitation of Liability",
      content:
        "TO THE MAXIMUM EXTENT PERMITTED BY LAW, IN NO EVENT SHALL RIZFLOW, ITS OFFICERS, DIRECTORS, EMPLOYEES, OR AGENTS BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, OR ANY LOSS OF PROFITS, REVENUE, DATA, OR GOODWILL. OUR TOTAL LIABILITY FOR ANY CLAIM SHALL NOT EXCEED THE AMOUNT YOU HAVE PAID US FOR THE SERVICE IN THE PRECEDING 12 MONTHS.",
    },
    {
      id: "indemnification",
      title: "2.11 Indemnification",
      content: [
        "You agree to indemnify, defend, and hold harmless RizFlow and its affiliates from any claims, losses, liabilities, damages, costs, and expenses (including reasonable attorneys' fees) arising out of or related to:",
        "• Your breach of these Terms",
        "• Your violation of any applicable law or third-party right",
        "• Your misuse of the Service",
      ],
    },
    {
      id: "termination",
      title: "2.12 Termination",
      content: [
        "By you: You may terminate a paid service tier at any time by providing 30 days' written notice (email to support@rizflow.co). Termination takes effect at the end of the current billing period.",
        "",
        "By us: We may suspend or terminate your access for material breach, non-payment, or if your use poses a security risk, violates law, or is abusive.",
        "",
        "Upon termination, you will cease access to the Service. We will retain your data as per the Privacy Policy and delete or anonymize it after the applicable retention period.",
      ],
    },
    {
      id: "governing",
      title: "2.13 Governing Law & Dispute Resolution",
      content:
        "These Terms shall be governed by and construed in accordance with the laws of the Republic of Singapore, without regard to its conflict of law principles. Any dispute arising out of or relating to these Terms shall be resolved exclusively by the Singapore Courts.",
    },
    {
      id: "misc",
      title: "2.14 Miscellaneous",
      content: [
        "• Entire Agreement: These Terms, together with the Privacy Policy and any specific service agreements or invoices, constitute the entire agreement between you and RizFlow",
        "• Amendments: We may revise these Terms at any time. Continued use after changes constitutes your acceptance",
        "• Severability: If any provision is found unenforceable, remaining provisions remain in full force",
        "• Waiver: Failure to enforce any right does not constitute a waiver of that right",
      ],
    },
  ],
};

export function PrivacyTerms() {
  const [activeTab, setActiveTab] = useState<"privacy" | "terms">("privacy");
  const activeContent =
    activeTab === "privacy" ? privacyPolicy : termsOfService;

  return (
    <>
      <Helmet>
        <title>Privacy Policy & Terms of Service | RizFlow</title>
        <meta
          name="description"
          content="RizFlow's Privacy Policy and Terms of Service. Learn how we protect your data and the terms of our agentic-AI implementation service."
        />
        <meta property="og:url" content={`${SITE_URL}/privacy-terms`} />
      </Helmet>

      {/* Header */}
      <section className="pt-32 pb-16 bg-[#050A14] relative overflow-hidden min-h-screen flex flex-col">
        {/* Cyberpunk Grid */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: `linear-gradient(rgba(0,229,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(0,229,255,0.03) 1px, transparent 1px)`,
            backgroundSize: "40px 40px",
          }}
        />
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-teal-500/10 blur-[120px] rounded-full pointer-events-none" />

        <Container className="relative z-10 flex-1">
          <div className="text-center mb-16">
            <span className="font-mono text-teal-400 uppercase tracking-widest text-sm mb-4 block">
              [ SECURE_ACCESS_PROTOCOL ]
            </span>
            <h1 className="text-4xl md:text-5xl font-mono font-bold text-teal-400 drop-shadow-[0_0_8px_rgba(45,212,191,0.5)] mb-4">
              System Directives
            </h1>
            <p className="font-mono text-sm text-slate-400 max-w-xl mx-auto uppercase tracking-wider">
              Last updated: 20 Mar 2026
            </p>
          </div>

          {/* Tabs */}
          <div className="flex gap-4 mb-8 border-b border-teal-500/30 max-w-4xl mx-auto">
            <button
              onClick={() => setActiveTab("privacy")}
              className={`px-6 py-4 font-mono uppercase tracking-widest text-sm transition-all border-b-2 ${
                activeTab === "privacy"
                  ? "text-teal-400 border-teal-400 drop-shadow-[0_0_8px_rgba(45,212,191,0.5)]"
                  : "text-slate-500 border-transparent hover:text-slate-300"
              }`}
            >
              [ Privacy_Policy ]
            </button>
            <button
              onClick={() => setActiveTab("terms")}
              className={`px-6 py-4 font-mono uppercase tracking-widest text-sm transition-all border-b-2 ${
                activeTab === "terms"
                  ? "text-teal-400 border-teal-400 drop-shadow-[0_0_8px_rgba(45,212,191,0.5)]"
                  : "text-slate-500 border-transparent hover:text-slate-300"
              }`}
            >
              [ Terms_of_Service ]
            </button>
          </div>

          {/* Terminal Readout Window */}
          <div className="max-w-4xl mx-auto bg-[#050A14] border border-white/5 shadow-[0_0_30px_rgba(0,229,255,0.05)] rounded-lg overflow-hidden relative">
            {/* Terminal Header Bar */}
            <div className="bg-[#0A0F1A] border-b border-white/5 px-4 py-2 flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-slate-700"></div>
              <div className="w-3 h-3 rounded-full bg-slate-700"></div>
              <div className="w-3 h-3 rounded-full bg-slate-700"></div>
              <span className="ml-2 font-mono text-xs text-slate-500 uppercase tracking-wider">
                root@rizflow:~/
                {activeTab === "privacy"
                  ? "privacy_policy.txt"
                  : "terms_of_service.txt"}
              </span>
            </div>

            <div className="p-6 md:p-10 space-y-8 h-[600px] overflow-y-auto custom-scrollbar">
              {activeContent.sections.map((section) => (
                <div key={section.id} className="space-y-3 font-mono">
                  <h3 className="text-lg text-teal-400 drop-shadow-[0_0_5px_rgba(45,212,191,0.3)]">
                    # {section.title}
                  </h3>
                  <div className="pl-4 border-l border-white/10">
                    {typeof section.content === "string" ? (
                      <p className="text-slate-300 text-sm leading-relaxed">
                        {section.content}
                      </p>
                    ) : (
                      <div className="space-y-2">
                        {section.content.map((line, idx) => (
                          <p
                            key={idx}
                            className="text-slate-300 text-sm leading-relaxed"
                          >
                            {line || <br />}
                          </p>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
              <div className="font-mono text-teal-400/50 animate-pulse text-sm pt-4">
                _EOF
              </div>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
