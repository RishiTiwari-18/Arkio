
import { Button } from "@/components/ui/button";
import { Clock3, MailCheck, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import Background from "../components/Background";

export default function VerifyPage() {
  return (
    <main className="relative flex h-screen w-screen items-center justify-center p-4">
      <Background />

      <section className="relative z-10 w-full max-w-xl rounded-2xl border border-border/60 bg-card/85 p-8 shadow-xl backdrop-blur-sm md:p-10">
        <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
          <MailCheck className="size-3.5" />
          Verification Email Sent
        </div>

        <h1 className="text-3xl font-semibold tracking-tight text-foreground md:text-4xl">
          Check your email
        </h1>

        <p className="mt-3 text-sm leading-6 text-muted-foreground md:text-base">
          We have sent a verification link to your email address. Open your inbox and click the link to verify your account.
        </p>

        <div className="mt-6 rounded-xl border border-amber-400/30 bg-amber-400/10 p-4">
          <div className="flex items-start gap-3">
            <Clock3 className="mt-0.5 size-4 text-amber-600" />
            <p className="text-sm leading-6 text-amber-800 dark:text-amber-200">
              This verification link expires in <span className="font-semibold">1 hour</span>. If it expires, request a new link.
            </p>
          </div>
        </div>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Button asChild className="h-11 rounded-lg sm:flex-1">
            <Link to="/login">Go to Login</Link>
          </Button>
          <Button asChild variant="outline" className="h-11 rounded-lg sm:flex-1">
            <Link to="/register">Use another email</Link>
          </Button>
        </div>

       
      </section>
    </main>
  );
}
