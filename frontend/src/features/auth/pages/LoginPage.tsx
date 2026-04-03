// import { useForm } from "react-hook-form"

import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Background from "../components/Background";
import useAuth from "../hooks/useAuth";
import { toast } from "sonner";


// import { ModeToggle } from "@/components/shared/mode-toggle"

type LoginFormValues = {
  identifier: string;
  password: string;
};

export default function LoginPage() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    defaultValues: {
      identifier: "",
      password: "",
    },
  });
  const { handleLogin } = useAuth();
  const navigate = useNavigate();

  const onSubmit = async (data: LoginFormValues) => {
    try {
      await handleLogin(data);
      navigate("/");
    } catch (error: any) {
      toast.error(error?.message || "Login failed");
    }
  };

  return (
    <main className="h-screen p-4 w-screen flex items-center justify-center">
      <Background/>
      <div className="max-w-5xl p-4 w-full flex gap-4 rounded-2xl bg-card dark:bg-card backdrop-blur-sm">
        <div className=" relative rounded-xl max-md:hidden overflow-hidden flex-1  max-w-[50%]">
          <div className=" inset-0  z-0 absolute">
            <img className="h-full w-full object-cover" src="https://images.unsplash.com/photo-1533134486753-c833f0ed4866?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" alt="" />
          </div>
          <div className="flex p-4 absolute bg-background/20 backdrop-blur-[1px] dark:backdrop-blur-none dark:bg-background/40 w-full  h-full flex-col justify-between">
            <span className=" text-2xl text-white dark:text-forground font-semibold">Arkio.</span>
            <div className="">
              <h2 className="text-2xl text-white dark:text-forground font-bold">Think freely,</h2>
              <h2 className="text-2xl font-bold text-primary">build faster.</h2>
              <p className="text-sm mt-2 text-background dark:text-primary/60">
                Your AI. Your conversations. <br />
                Always right where you left off.
              </p>
            </div>
          </div>
        </div>
        <div className="flex-1 py-8 flex flex-col justify-center">
          <h1 className="text-3xl mb-2 font-semibold">Welcome back</h1>
          <p className="text-primary/60 text-xs mb-6">
            Don't have an account?{" "}
            <Link
              to="/register"
              className="text-primary cursor-pointer font-medium"
            >
              Sign up
            </Link>
          </p>

          <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
            <div className="space-y-2">
              <label
                className="text-sm font-medium text-muted-foreground"
                htmlFor="identifier"
              >
                Email or Username
              </label>
              <Input
                id="identifier"
                type="text"
                placeholder="Enter your email or username"
                className="h-11 rounded-lg border-input"
                aria-invalid={Boolean(errors.identifier)}
                {...register("identifier", {
                  required: "Email or username is required",
                })}
              />
              {errors.identifier && (
                <p className="text-sm text-destructive">
                  {errors.identifier.message}
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
                placeholder="Enter your password"
                className="h-11 rounded-lg"
                aria-invalid={Boolean(errors.password)}
                {...register("password", {
                  required: "Password is required",
                  minLength: {
                    value: 6,
                    message: "Must be at least 6 characters",
                  },
                })}
              />
              {errors.password && (
                <p className="text-sm text-destructive">
                  {errors.password.message}
                </p>
              )}
            </div>

            <Button
              type="submit"
              className="w-full h-11 rounded-lg mt-4 font-semibold"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Logging in..." : "Log in"}
            </Button>
          </form>
        </div>
      </div>
    </main>
  );
}
