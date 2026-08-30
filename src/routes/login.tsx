import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { FlaskConical } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Panel, PanelBody } from "@/components/lab/primitives";
import { useAuth } from "@/lib/auth-context";
import { DEMO_CREDENTIALS } from "@/services/authService";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Sign in — Sentiment Analysis Lab" },
      { name: "description", content: "Sign in to the Sentiment Analysis Lab research platform." },
    ],
  }),
  component: LoginPage,
});

function LoginPage() {
  const { signIn } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setError(null);
    setPending(true);
    try {
      await signIn(email, password);
      await navigate({ to: "/" });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Sign in failed. Check your credentials.");
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="w-full max-w-md">
        <div className="mb-8 flex flex-col items-center gap-2 text-center">
          <span className="flex size-10 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <FlaskConical aria-hidden className="size-5" strokeWidth={2} />
          </span>
          <h1 className="text-headline-lg font-semibold tracking-tight text-on-surface">
            Sentiment Analysis Lab
          </h1>
          <p className="text-body-md text-on-surface-variant">
            Sign in to access the research platform.
          </p>
        </div>

        <Panel>
          <PanelBody className="p-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label htmlFor="email" className="font-mono text-label-sm uppercase tracking-wide text-on-surface-variant">
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="analyst@lab.dev"
                  className="h-9 w-full rounded-lg border border-outline-variant bg-surface-lowest px-3 font-mono text-label-md text-on-surface placeholder:text-on-surface-variant focus:border-primary focus:outline-none"
                />
              </div>
              <div className="space-y-1.5">
                <label htmlFor="password" className="font-mono text-label-sm uppercase tracking-wide text-on-surface-variant">
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="h-9 w-full rounded-lg border border-outline-variant bg-surface-lowest px-3 font-mono text-label-md text-on-surface placeholder:text-on-surface-variant focus:border-primary focus:outline-none"
                />
              </div>

              {error ? (
                <p role="alert" className="rounded-lg border border-destructive/40 bg-destructive/10 px-3 py-2 font-mono text-label-sm text-destructive">
                  {error}
                </p>
              ) : null}

              <Button type="submit" disabled={pending} className="w-full">
                {pending ? "Signing in…" : "Sign in"}
              </Button>
            </form>

            <div className="mt-4 rounded-lg border border-outline-variant bg-surface-low px-3 py-2">
              <p className="font-mono text-label-sm text-on-surface-variant">
                Demo accounts: analyst@lab.dev / admin@lab.dev — any password (min 6 chars).
              </p>
            </div>
          </PanelBody>
        </Panel>
      </div>
    </div>
  );
}
