import { Link } from "react-router-dom";

import Panel from "@/components/Panel";
import SectionHeading from "@/components/SectionHeading";
import Button from "@/components/ui/button";
import { landingFeatures, landingSteps } from "@/utils/mockData";

export default function Landing() {
  return (
    <div>
      <section className="mx-auto grid min-h-[calc(100vh-88px)] max-w-7xl items-center gap-16 px-6 py-20 lg:grid-cols-[1.1fr_0.9fr] lg:px-10">
        <div className="animate-fade-up">
          <p className="mb-5 inline-flex rounded-full border border-white/10 bg-white/[0.03] px-4 py-2 text-xs uppercase tracking-[0.28em] text-zinc-400">
            Premium AI insurance infrastructure
          </p>
          <h1 className="max-w-3xl text-5xl font-semibold leading-[1.02] text-white sm:text-6xl lg:text-7xl">
            AI Insurance for Gig Workers
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-zinc-400">
            A clean, intelligent insurance workspace for riders, drivers, and delivery teams who need protection against real-world disruption.
          </p>
          <div className="mt-10 flex flex-col gap-4 sm:flex-row">
            <Link to="/register"><Button variant="primary">Get Started</Button></Link>
            <Link to="/login"><Button variant="secondary">Login</Button></Link>
          </div>
        </div>

        <Panel className="p-6">
          <p className="text-xs uppercase tracking-[0.28em] text-zinc-500">Why GigShield</p>
          <div className="mt-6 space-y-4">
            {landingFeatures.map((item) => (
              <div key={item.title} className="rounded-2xl border border-white/10 bg-black/20 p-5">
                <p className="text-base font-semibold text-white">{item.title}</p>
                <p className="mt-2 text-sm leading-7 text-zinc-400">{item.description}</p>
              </div>
            ))}
          </div>
        </Panel>
      </section>

      <section id="how-it-works" className="mx-auto max-w-7xl px-6 py-24 lg:px-10">
        <SectionHeading
          eyebrow="How it works"
          title="A three-step workflow designed for clarity"
          description="Focused interactions for onboarding, policy purchase, and claims."
        />
        <div className="mt-12 grid gap-6 lg:grid-cols-3">
          {landingSteps.map((step) => (
            <Panel key={step.id} className="p-6">
              <p className="text-xs uppercase tracking-[0.28em] text-zinc-600">{step.id}</p>
              <h3 className="mt-6 text-xl font-semibold text-white">{step.title}</h3>
              <p className="mt-4 text-sm leading-7 text-zinc-400">{step.description}</p>
            </Panel>
          ))}
        </div>
      </section>

      <footer className="border-t border-white/[0.06] px-6 py-10 text-sm text-zinc-500 lg:px-10">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <p className="text-white">GigShield AI</p>
          <p>Premium AI-powered income protection for gig workers.</p>
        </div>
      </footer>
    </div>
  );
}
