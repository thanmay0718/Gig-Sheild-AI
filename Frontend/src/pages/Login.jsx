import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import FloatingField from "@/components/FloatingField";
import Panel from "@/components/Panel";
import Button from "@/components/ui/button";
import Input from "@/components/ui/input";
import { toast } from "@/components/ui/sonner";
import { useAuth } from "@/contexts/AuthContext";
import { loginUser, registerUser } from "@/services/api";

export default function Login({ defaultMode = "login" }) {
  const navigate = useNavigate();
  const { setSession } = useAuth();
  const [mode, setMode] = useState(defaultMode);
  const [role, setRole] = useState("WORKER");
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", password: "" });

  const isRegister = mode === "register";
  const title = useMemo(() => (isRegister ? "Create your workspace" : "Welcome back"), [isRegister]);

  const onChange = (key) => (event) => {
    setForm((current) => ({ ...current, [key]: event.target.value }));
  };

  async function handleSubmit(event) {
    event.preventDefault();
    setLoading(true);

    try {
      const payload = isRegister
        ? {
            email: form.email,
            password: form.password,
            role: role,               // "WORKER" or "ADMIN"
            name: form.name || null,
          }
        : {
            email: form.email,
            password: form.password,
          };

      // ── Always hit the real backend — no demo bypass ──────────────────────
      const response = isRegister
        ? await registerUser(payload)
        : await loginUser(payload);

      // Backend returns: { token, role, email, name, workerId }
      if (!response?.token) {
        throw new Error(response?.error || "Login failed — no token received");
      }

      const resolvedRole = String(response.role || role).toUpperCase();

      setSession({
        token: response.token,
        email: response.email || form.email,
        role: resolvedRole,
        name: response.name || form.name || form.email,
        workerId: response.workerId ?? null,
      });

      toast.success(isRegister ? "Account created successfully!" : "Signed in successfully!");
      navigate(resolvedRole === "ADMIN" ? "/admin" : "/worker");

    } catch (error) {
      toast.error(error.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="grid w-full max-w-6xl gap-10 lg:grid-cols-[0.95fr_1.05fr]">
      <div className="hidden flex-col justify-center lg:flex">
        <p className="text-xs uppercase tracking-[0.3em] text-zinc-500">Secure access</p>
        <h1 className="mt-5 max-w-lg text-5xl font-semibold leading-tight text-white">{title}</h1>
        <p className="mt-5 max-w-xl text-lg leading-8 text-zinc-400">
          Parametric insurance for gig workers — instant coverage, zero paperwork.
        </p>
      </div>

      <Panel className="mx-auto w-full max-w-xl p-8 sm:p-10">
        {/* Login / Register toggle */}
        <div className="mb-8 flex rounded-2xl border border-white/10 bg-white/[0.03] p-1.5">
          {["login", "register"].map((value) => (
            <button
              key={value}
              type="button"
              onClick={() => setMode(value)}
              className={`flex-1 rounded-2xl px-4 py-3 text-sm capitalize transition ${
                mode === value ? "bg-white text-black" : "text-zinc-400 hover:text-white"
              }`}
            >
              {value}
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {isRegister && (
            <FloatingField label="Full Name">
              <Input
                value={form.name}
                onChange={onChange("name")}
                placeholder="Full Name"
              />
            </FloatingField>
          )}

          <FloatingField label="Email">
            <Input
              type="email"
              value={form.email}
              onChange={onChange("email")}
              placeholder="Email"
              required
            />
          </FloatingField>

          <FloatingField label="Password">
            <Input
              type="password"
              value={form.password}
              onChange={onChange("password")}
              placeholder="Password"
              required
            />
          </FloatingField>

          {/* Role selector — shown on both login and register */}
          <div className="grid gap-3 sm:grid-cols-2">
            {["WORKER", "ADMIN"].map((value) => (
              <button
                key={value}
                type="button"
                onClick={() => setRole(value)}
                className={`rounded-2xl border px-4 py-4 text-left transition ${
                  role === value
                    ? "border-sky-500/30 bg-sky-500/10 text-white"
                    : "border-white/10 bg-white/[0.03] text-zinc-400 hover:text-white"
                }`}
              >
                <p className="text-sm font-medium capitalize">{value.toLowerCase()}</p>
                <p className="mt-1 text-xs text-zinc-500">
                  {value === "WORKER"
                    ? "Personal coverage workspace"
                    : "Operations dashboard access"}
                </p>
              </button>
            ))}
          </div>

          <Button type="submit" variant="primary" className="w-full" disabled={loading}>
            {loading
              ? "Please wait..."
              : isRegister
              ? "Create Account"
              : "Continue"}
          </Button>
        </form>

        {/* Hint for first-time users */}
        <div className="mt-6 rounded-2xl border border-white/10 bg-white/[0.03] p-4 text-sm text-zinc-400">
          <p className="text-xs uppercase tracking-[0.2em] text-zinc-600">First time?</p>
          <p className="mt-2">
            Click <span className="text-white">Register</span> to create an account, then log in.
            Use <span className="text-white">Worker</span> for the coverage dashboard or{" "}
            <span className="text-white">Admin</span> for the ops panel.
          </p>
        </div>

        <p className="mt-6 text-center text-sm text-zinc-500">
          {isRegister ? "Already have an account?" : "New to GigShield AI?"}{" "}
          <Link
            to={isRegister ? "/login" : "/register"}
            className="text-zinc-200 hover:text-white"
          >
            {isRegister ? "Login" : "Register"}
          </Link>
        </p>
      </Panel>
    </div>
  );
}