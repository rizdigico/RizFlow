import {
  InboxIcon,
  ClipboardDocumentCheckIcon,
  UserGroupIcon,
  BanknotesIcon,
  ChatBubbleLeftRightIcon,
  ShieldCheckIcon,
  Cog6ToothIcon,
} from "@heroicons/react/24/outline";
import { motion } from "framer-motion";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { useMeshPulse } from "@/hooks/useMeshPulse";
import { cn } from "@/lib/utils";

const features = [
  {
    Icon: InboxIcon,
    title: "Admin Automation Agent",
    desc: "Handles paperwork, data entry, filing, and routine admin tasks 24/7. Free yourself from the repetitive work that keeps you stuck at your desk.",
  },
  {
    Icon: ClipboardDocumentCheckIcon,
    title: "Project & Deliverables Agent",
    desc: "Tracks client deliverables, deadlines, and progress in real time. Sends proactive status updates so nothing falls through the cracks.",
  },
  {
    Icon: UserGroupIcon,
    title: "Scheduling & Coordination Agent",
    desc: "Smart scheduling, resource allocation, and team coordination. Eliminate the back-and-forth and let your calendar run itself.",
  },
  {
    Icon: BanknotesIcon,
    title: "Billing & Finance Agent",
    desc: "Auto-invoicing, payment reminders, expense tracking, and revenue forecasting. Your cash flow runs on autopilot.",
  },
  {
    Icon: ChatBubbleLeftRightIcon,
    title: "Communications Agent",
    desc: "Drafts and sends updates, handles client follow-ups, and manages responses across email, messaging, and social — all matching your brand tone.",
  },
  {
    Icon: Cog6ToothIcon,
    title: "Custom Agent Builder",
    desc: "Need something unique? We build fully custom agents for any business process — social media, compliance, reporting, operations, or anything else.",
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

export function FeaturesGrid() {
  const { ref, isVisible } = useScrollAnimation();

  return (
    <section id="agents" className="relative section-padding">
      {/* Teal topographic wave decoration */}
      <WaveDecoration className="absolute top-0 right-0 w-[600px] h-[400px] opacity-10" />
      <WaveDecoration className="absolute bottom-0 left-0 w-[500px] h-[350px] opacity-10 rotate-180" />

      <div className="container-width relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div ref={ref} className="text-center max-w-3xl mx-auto mb-20">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.8 }}
            className="text-4xl md:text-5xl font-bold mb-6 text-white"
          >
            Choose your{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-cyan-400">
              agent stack
            </span>
            .
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="text-lg text-slate-400"
          >
            Pick the agents your business needs, customize them to your
            workflows, and let them run your operations — from your phone — so
            you can focus on growth.
          </motion.p>
        </div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isVisible ? "visible" : "hidden"}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {features.map((feature, i) => (
            <FeatureCard key={i} feature={feature} index={i} />
          ))}
        </motion.div>
      </div>
    </section>
  );
}

interface FeatureCardProps {
  feature: (typeof features)[0];
  index: number;
}

function FeatureCard({ feature, index }: FeatureCardProps) {
  const pulseProps = useMeshPulse();

  return (
    <motion.div
      className="group relative bg-navy-900/40 backdrop-blur-md rounded-2xl p-7 border border-white/5 shadow-2xl hover:border-teal-500/30 cursor-default overflow-hidden transition-all duration-500"
      variants={{
        hidden: { opacity: 0, y: 30 },
        visible: {
          opacity: 1,
          y: 0,
          transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
        },
      }}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
    >
      {/* Animated mesh background pulse */}
      <motion.div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{
          background:
            "radial-gradient(circle at center, rgba(45, 212, 191, 0.08) 0%, transparent 70%)",
        }}
        animate={pulseProps.animate}
        transition={pulseProps.transition}
      />

      {/* Content */}
      <div className="relative z-10 space-y-4">
        <motion.div
          className="w-12 h-12 rounded-xl border border-white/10 flex items-center justify-center bg-navy-800/50 group-hover:border-teal-500/50 group-hover:bg-teal-500/10 transition-colors duration-500 relative"
          whileHover={{ scale: 1.1 }}
          transition={{ duration: 0.3 }}
        >
          {/* Subtle glow behind icon */}
          <div className="absolute inset-0 bg-teal-400/20 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

          <motion.div
            whileHover={{ rotate: 12 }}
            transition={{ duration: 0.4 }}
            className="relative z-10"
          >
            <feature.Icon className="w-6 h-6 text-teal-400" />
          </motion.div>
        </motion.div>

        <div>
          <motion.h3
            className="text-xl font-semibold font-heading text-white group-hover:text-teal-300 transition-colors duration-300 mb-2"
            initial={{ opacity: 0.9 }}
            whileHover={{ opacity: 1 }}
          >
            {feature.title}
          </motion.h3>

          <motion.p
            className="text-slate-400 text-sm leading-relaxed"
            initial={{ opacity: 0.8 }}
            whileHover={{ opacity: 1 }}
          >
            {feature.desc}
          </motion.p>
        </div>
      </div>
    </motion.div>
  );
}

function WaveDecoration({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 600 400"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <path
        d="M600,50 C500,80 400,20 300,60 C200,100 100,30 0,70"
        stroke="#4FA0B4"
        strokeWidth="1.2"
        opacity="0.5"
      />
      <path
        d="M600,100 C500,130 400,70 300,110 C200,150 100,80 0,120"
        stroke="#4FA0B4"
        strokeWidth="1.2"
        opacity="0.4"
      />
      <path
        d="M600,150 C500,180 400,120 300,160 C200,200 100,130 0,170"
        stroke="#4FA0B4"
        strokeWidth="1.2"
        opacity="0.35"
      />
      <path
        d="M600,200 C500,230 380,160 280,205 C180,250 80,180 0,220"
        stroke="#4FA0B4"
        strokeWidth="1.2"
        opacity="0.3"
      />
      <path
        d="M600,250 C490,275 370,205 265,250 C160,295 60,225 0,268"
        stroke="#4FA0B4"
        strokeWidth="1"
        opacity="0.25"
      />
      <path
        d="M600,300 C480,320 360,255 255,298 C150,340 50,272 0,315"
        stroke="#4FA0B4"
        strokeWidth="1"
        opacity="0.2"
      />
      <path
        d="M600,350 C470,365 350,300 245,345 C140,388 40,318 0,362"
        stroke="#4FA0B4"
        strokeWidth="1"
        opacity="0.15"
      />
    </svg>
  );
}
