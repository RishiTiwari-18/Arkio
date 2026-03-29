import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import zxcvbn from "zxcvbn";
import { cn } from "@/lib/utils";
import { useDeferredValue } from "react";
import Background from "../components/Background";

type RegisterFormValues = {
  email: string;
  username: string;
  password: string;
};

export default function RegisterPage() {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormValues>({
    defaultValues: {
      email: "",
      username: "",
      password: "",
    },
  });

  const password = watch("password", "");
  const debouncedPassword = useDeferredValue(password);
  const result = zxcvbn(debouncedPassword);
  const strength = result.score; // 0–4

  console.log(strength);

  const onSubmit = (_data: RegisterFormValues) => {
    // TODO: wire to auth API
  };

  return (
    <main className="h-screen p-4 w-screen flex items-center justify-center">
      <Background/>
      <div className="max-w-5xl p-4 w-full flex gap-4 rounded-2xl bg-card">
        <div className=" relative max-md:hidden rounded-xl overflow-hidden flex-1  max-w-[50%]">
          <div className=" inset-0  z-0 absolute">
            <img
              className="h-full w-full object-cover"
              src="https://images.unsplash.com/photo-1533134486753-c833f0ed4866?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
              alt=""
            />
          </div>
          <div className="flex p-4 absolute bg-background/60 w-full  h-full flex-col justify-between">
            <span className=" text-2xl font-semibold">Arkio.</span>
            <div className="">
              <h2 className="text-2xl font-bold">Think freely,</h2>
              <h2 className="text-2xl font-bold text-primary">build faster.</h2>
              <p className="text-sm mt-2 text-primary/60">
                Your AI. Your conversations. <br />
                Always right where you left off.
              </p>
            </div>
          </div>
        </div>
        <div className="flex-1 py-8 flex flex-col justify-center">
          <h1 className="text-3xl mb-2 font-semibold">Create an account</h1>
          <p className="text-primary/60 text-xs mb-6">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-primary cursor-pointer font-medium"
            >
              Log in
            </Link>
          </p>

          <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
            <div className="space-y-2">
              <label
                className="text-sm font-medium text-muted-foreground"
                htmlFor="email"
              >
                Email address
              </label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                className="h-11 rounded-lg"
                aria-invalid={Boolean(errors.email)}
                {...register("email", {
                  required: "Email is required",
                  pattern: {
                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                    message: "Please enter a valid email",
                  },
                })}
              />
              {errors.email && (
                <p className="text-sm text-destructive">
                  {errors.email.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <label
                className="text-sm font-medium text-muted-foreground"
                htmlFor="username"
              >
                Username
              </label>
              <Input
                id="username"
                type="text"
                placeholder="Choose a username"
                className="h-11 rounded-lg"
                aria-invalid={Boolean(errors.username)}
                {...register("username", {
                  required: "Username is required",
                  minLength: {
                    value: 3,
                    message: "Username must be at least 3 characters",
                  },
                })}
              />
              {errors.username && (
                <p className="text-sm text-destructive">
                  {errors.username.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <label
                className="text-sm font-medium text-muted-foreground"
                htmlFor="password"
              >
                Password
              </label>
              <Input
                id="password"
                type="password"
                placeholder="Create a password"
                className="h-11 rounded-lg"
                aria-invalid={Boolean(errors.password)}
                {...register("password", {
                  required: "Password is required",
                  validate: () => strength >= 3 || "Password is too weak",
                })}
              />
              <div className="flex gap-1">
                {[0, 1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className={cn(
                      "h-1.5 flex-1 rounded-full bg-muted transition-all",
                      strength > i && "bg-primary",
                    )}
                  />
                ))}
              </div>

              {password && result.feedback.suggestions.length > 0 ? (
                <div className="text-xs text-muted-foreground space-y-1">
                  <p>{result.feedback.suggestions[0]}</p>
                </div>
              ) : (
                <div className="text-xs text-card space-y-1">
                    <p>Enter a password</p>
                </div>
              )}

              {errors.password && (
                <p className="text-sm text-destructive">
                  {errors.password.message}
                </p>
              )}
            </div>

            <Button
              type="submit"
              className="w-full h-11 rounded-lg font-semibold"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Creating account..." : "Create account"}
            </Button>
          </form>
        </div>
      </div>
    </main>
  );
}
