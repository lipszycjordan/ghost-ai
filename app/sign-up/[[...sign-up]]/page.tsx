"use client";

import { SignUp } from "@clerk/nextjs";
import { Suspense } from "react";
import { Cpu, Share2, FileText } from "lucide-react";

const features = [
  {
    icon: Cpu,
    title: "AI Architecture Generation",
    description: "Describe your system, AI maps it to nodes and edges on a live canvas.",
  },
  {
    icon: Share2,
    title: "Real-time Collaboration",
    description: "Live cursors, presence indicators, and shared node editing across your team.",
  },
  {
    icon: FileText,
    title: "Instant Spec Generation",
    description: "Export a complete Markdown technical spec directly from the canvas graph.",
  },
];

function SignUpForm() {
  return (
    <Suspense>
      <SignUp
        appearance={{
          elements: {
            rootBox: "w-full",
            card: "w-full max-w-[480px]",
          },
        }}
      />
    </Suspense>
  );
}

export default function SignUpPage() {
  return (
    <div className="flex h-screen bg-base">
      {/* Left panel — hidden on small screens */}
      <div className="hidden lg:flex lg:w-1/2 flex-col justify-between bg-surface border-r border-border-default p-16 font-sans">
        {/* Logo */}
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-brand flex items-center justify-center">
            <span className="text-xs font-bold text-base leading-none">G</span>
          </div>
          <span className="text-base font-semibold text-copy-primary tracking-tight">Ghost AI</span>
        </div>

        {/* Main content */}
        <div>
          <h1 className="text-4xl font-bold text-copy-primary leading-tight mb-5">
            Design systems at the<br />speed of thought.
          </h1>
          <p className="text-base text-copy-secondary mb-14 leading-relaxed max-w-md">
            Describe your architecture in plain English. Ghost AI maps it to a shared canvas your whole team can refine in real time.
          </p>

          <ul className="space-y-8">
            {features.map(({ icon: Icon, title, description }) => (
              <li key={title} className="flex items-start gap-4">
                <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-brand-dim flex items-center justify-center">
                  <Icon className="h-5 w-5 text-brand" />
                </div>
                <div>
                  <p className="text-base font-semibold text-copy-primary">{title}</p>
                  <p className="text-sm text-copy-secondary mt-1 leading-relaxed">{description}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>

        {/* Copyright */}
        <p className="text-sm text-copy-faint">© 2026 Ghost AI. All rights reserved.</p>
      </div>

      {/* Right panel — form */}
      <div className="flex flex-1 items-center justify-center px-8">
        <SignUpForm />
      </div>
    </div>
  );
}
