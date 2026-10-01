import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Icon } from "@iconify/react";
import { http } from "../../helpers/http";

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function getErrors(email, password) {
  const errors = {};
  const value = email.trim();
  if (!value) errors.email = "Enter your work email.";
  else if (!emailPattern.test(value))
    errors.email = "Enter a valid email, like name@company.com.";
  if (!password) errors.password = "Enter your password.";
  return errors;
}

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState("");
  const [loading, setLoading] = useState(false);
  const [now, setNow] = useState(() => new Date());
  const pad = (value) => String(value).padStart(2, "0");

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const updateEmail = (value) => {
    setEmail(value);
    if (errors.email) setErrors((current) => ({ ...current, email: "" }));
  };

  const updatePassword = (value) => {
    setPassword(value);
    if (errors.password) setErrors((current) => ({ ...current, password: "" }));
  };

  const submit = async (event) => {
    event.preventDefault();
    setFormError("");
    const nextErrors = getErrors(email, password);
    setErrors(nextErrors);
    if (Object.values(nextErrors).some(Boolean)) return;

    setLoading(true);
    try {
      const data = await http.post("/auth/login", {
        email: email.trim(),
        password,
        remember,
      });

      navigate(data.redirect || "/dashboard");
    } catch (err) {
      if (err.status === 401) {
        setFormError(
          "Email or password is incorrect. Check your details and try again.",
        );
      } else {
        setFormError(
          "We could not reach the server. Check your connection and try again.",
        );
      }
    } finally {
      setLoading(false);
    }
  };

  const fieldClass = (field) =>
    `w-full rounded-lg border bg-white py-2.5 pl-10 pr-3 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-secondary/30 ${
      errors[field]
        ? "border-red-400 focus:border-red-400"
        : "border-slate-300 focus:border-secondary"
    }`;

  return (
    <main className="grid min-h-screen bg-white font-sans text-slate-800 antialiased lg:grid-cols-[1.05fr_1fr]">
      <section className="relative flex flex-col justify-between gap-10 overflow-hidden bg-primary px-6 py-8 text-white sm:px-10 lg:px-14 lg:py-12" style={{ backgroundImage: 'radial-gradient(circle at 100% 100%, transparent 0 140px, rgba(66,90,173,.55) 141px 142px, transparent 143px), radial-gradient(circle at 100% 100%, transparent 0 220px, rgba(66,90,173,.45) 221px 222px, transparent 223px), radial-gradient(circle at 100% 100%, transparent 0 300px, rgba(66,90,173,.35) 301px 302px, transparent 303px), radial-gradient(circle at 100% 100%, transparent 0 380px, rgba(66,90,173,.25) 381px 382px, transparent 383px)' }}>

        <div className="flex items-center gap-3">
          <span className="grid size-11 place-items-center rounded-xl bg-white text-primary">
            <Icon icon="lucide:fingerprint" width="26" height="26" />
          </span>
          <span className="text-xl font-extrabold tracking-tight">
            Hi-Connect
          </span>
        </div>

        <div className="max-w-md">
          <h1 className="text-3xl font-extrabold leading-tight sm:text-4xl">
            Every check-in, in one place.
          </h1>
          <p className="mt-4 text-base leading-relaxed text-white/75">
            Review attendance, approve leave, and keep every site on schedule
            from a single dashboard.
          </p>

          <div className="mt-10 inline-block rounded-2xl border border-white/20 bg-white/10 px-6 py-5 backdrop-blur-sm">
            <div className="flex items-center gap-2 text-sm text-white/75">
              <Icon icon="lucide:clock-3" width="16" height="16" />
              <span>
                {new Intl.DateTimeFormat("en-GB", {
                  weekday: "long",
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                }).format(now)}
              </span>
            </div>
            <div
              className="mt-1 flex items-baseline gap-1 text-5xl font-bold tabular-nums sm:text-6xl"
              aria-live="off"
            >
              <span>{pad(now.getHours())}</span>
              <span className="tick">:</span>
              <span>{pad(now.getMinutes())}</span>
              <span className="ml-2 text-2xl font-semibold text-white/60">
                {pad(now.getSeconds())}
              </span>
            </div>
            <p className="mt-1 text-sm text-white/60">
              {Intl.DateTimeFormat().resolvedOptions().timeZone}
            </p>
          </div>
        </div>

        <p className="hidden text-sm text-white/60 lg:block">
          &copy; {now.getFullYear()} Hi-Connect. All rights reserved.
        </p>
      </section>

      <section className="flex items-center justify-center px-6 py-12 sm:px-10">
        <div className="w-full max-w-sm">
          <h2 className="text-2xl font-bold text-primary">
            Sign in to your dashboard
          </h2>
          <p className="mt-2 text-sm text-slate-500">
            Use your admin or HR account to manage employee attendance.
          </p>

          {formError && (
            <div
              role="alert"
              className="mt-6 flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 px-3 py-2.5 text-sm text-red-700"
            >
              <Icon
                icon="lucide:alert-circle"
                width="18"
                height="18"
                className="mt-0.5 shrink-0"
              />
              <span>{formError}</span>
            </div>
          )}

          <form onSubmit={submit} className="mt-6 space-y-5" noValidate>
            <div>
              <label
                htmlFor="email"
                className="mb-1.5 block text-sm font-semibold text-slate-700"
              >
                Work email
              </label>
              <div className="relative">
                <Icon
                  icon="lucide:mail"
                  width="18"
                  height="18"
                  className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                />
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="username"
                  required
                  placeholder="name@company.com"
                  value={email}
                  onChange={(event) => updateEmail(event.target.value)}
                  aria-invalid={Boolean(errors.email)}
                  aria-describedby={errors.email ? "email-error" : undefined}
                  className={fieldClass("email")}
                />
              </div>
              {errors.email && (
                <p id="email-error" className="mt-1 text-xs text-red-600">
                  {errors.email}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="password"
                className="mb-1.5 block text-sm font-semibold text-slate-700"
              >
                Password
              </label>
              <div className="relative">
                <Icon
                  icon="lucide:lock"
                  width="18"
                  height="18"
                  className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                />
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  required
                  placeholder="Enter your password"
                  value={password}
                  onChange={(event) => updatePassword(event.target.value)}
                  aria-invalid={Boolean(errors.password)}
                  aria-describedby={
                    errors.password ? "password-error" : undefined
                  }
                  className={`${fieldClass("password")} pr-11`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((show) => !show)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  aria-pressed={showPassword}
                  className="absolute right-2 top-1/2 grid size-8 -translate-y-1/2 place-items-center rounded-md text-slate-500 hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary/40"
                >
                  <Icon
                    icon={showPassword ? "lucide:eye-off" : "lucide:eye"}
                    width="18"
                    height="18"
                  />
                </button>
              </div>
              {errors.password && (
                <p id="password-error" className="mt-1 text-xs text-red-600">
                  {errors.password}
                </p>
              )}
            </div>

            <div className="flex items-center justify-between text-sm">
              <label className="flex cursor-pointer items-center gap-2 text-slate-600">
                <input
                  type="checkbox"
                  checked={remember}
                  onChange={(event) => setRemember(event.target.checked)}
                  className="size-4 rounded border-slate-300 accent-secondary"
                />
                Keep me signed in
              </label>
              <a
                href="#"
                onClick={(event) => event.preventDefault()}
                className="font-semibold text-secondary hover:text-primary focus-visible:outline-none focus-visible:underline"
              >
                Forgot password?
              </a>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-4 py-3 text-sm font-semibold text-white transition hover:bg-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {loading && (
                <Icon
                  icon="lucide:loader-2"
                  width="18"
                  height="18"
                  className="animate-spin"
                />
              )}
              <span>{loading ? "Signing in..." : "Sign in"}</span>
            </button>
          </form>

          <p className="mt-8 flex items-center gap-2 text-xs text-slate-500">
            <Icon
              icon="lucide:shield-check"
              width="16"
              height="16"
              className="text-secondary"
            />
            Access is limited to authorized administrators.
          </p>
        </div>
      </section>
    </main>
  );
}

