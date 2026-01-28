"use client";

import { LayoutGroup, motion } from "motion/react";
import { useEffect, useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { ArrowLeft, LockIcon, MailIcon, UserIcon } from "lucide-react";
import Link from "next/link";

const signInSchema = z.object({
  email: z.email("Please enter a valid email"),
  password: z.string().min(1, "Please enter a password"),
});
type SignInFormData = z.infer<typeof signInSchema>;

const signUpSchema = z
  .object({
    name: z.string().min(1, "Name is required"),
    email: z.email("Please enter a valid email"),
    password: z.string().min(8, "Password must be atleast 8 characters long"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"], // Sets the error on the confirmPassword field
  });
type SignUpFormData = z.infer<typeof signUpSchema>;

const Register = () => {
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const { data: session } = authClient.useSession();
  const router = useRouter();

  useEffect(() => {
    if (session) {
      router.push("/dashboard");
    }
  }, [session, router]);

  const items = [
    {
      key: "signin" as const,
      label: "Sign In",
      title: "Login to your account",
    },
    { key: "signup" as const, label: "Sign Up", title: "Create an account" },
  ];

  return (
    <div className="text-white flex justify-center h-full">
      <div className="w-88 md:w-100 bg-zinc-900 rounded-lg p-12 m-5 border border-white/5">
        {/* mode pill*/}
        <div className="flex items-center justify-between">
          <Link href="/" className="size-10">
            <button>
              <ArrowLeft className="btn-back" />
            </button>
          </Link>
          <LayoutGroup>
            <div className="flex bg-zinc-950 p-1 rounded-full w-fit border border-white/10">
              {items.map((item) => {
                const active = mode === item.key;

                return (
                  <button
                    key={item.key}
                    type="button"
                    onClick={() => setMode(item.key)}
                    className="relative cursor-pointer text-xs md:text-base px-4 py-2 rounded-full"
                  >
                    {/* active pill that animates between buttons */}
                    {active && (
                      <motion.div
                        layoutId="auth-pill"
                        transition={{
                          type: "spring",
                          stiffness: 500,
                          damping: 25,
                        }}
                        className="absolute inset-0 rounded-full bg-zinc-900 border border-white/10"
                      />
                    )}

                    {/* label above pill */}
                    <span className="relative z-10 text-white">
                      {item.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </LayoutGroup>
        </div>

        <h2 className="text-xl md:text-2xl font-bold my-6">
          {items.map((item) => item.key === mode && item.title)}
        </h2>

        {mode == "signin" ? <SignInForm /> : <SignUpForm />}
      </div>
    </div>
  );
};

const SignInForm = () => {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const form = useForm<SignInFormData>({
    resolver: zodResolver(signInSchema),
    defaultValues: { email: "", password: "" },
  });

  const onSubmit = async (formData: SignInFormData) => {
    const { data, error } = await authClient.signIn.email(
      {
        ...formData,
        callbackURL: "/dashboard",
      },
      {
        onSuccess: () => router.push("/dashboard"),
        onError: (e) => setError(e.error.message),
      },
    );
  };

  return (
    <form
      onSubmit={form.handleSubmit(onSubmit)}
      className="flex flex-col gap-3 justify-center items-center"
    >
      {/* API error */}
      {error && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="w-full p-3 text-sm text-red-400 bg-red-400/10 border border-red-400/20 rounded-lg"
        >
          {error}
        </motion.div>
      )}

      {/* Email */}
      <div className="flex items-center w-full">
        <div className="input-inline-icon">
          <MailIcon className="input-inline-svg" />
        </div>
        <input
          type="email"
          autoComplete="off"
          placeholder="Email"
          {...form.register("email")}
          className="input-inline-field"
        />
      </div>
      {form.formState.errors.email && (
        <p className="ml-2 text-sm text-destructive">
          {form.formState.errors.email.message}
        </p>
      )}

      {/* pass */}
      <div className="flex items-center w-full">
        <div className="input-inline-icon">
          <LockIcon className="input-inline-svg" />
        </div>
        <input
          type="password"
          autoComplete="off"
          placeholder="Password"
          {...form.register("password")}
          className="input-inline-field"
        />
      </div>
      {form.formState.errors.password && (
        <p className="ml-2 text-sm text-destructive">
          {form.formState.errors.password.message}
        </p>
      )}

      <button type="submit" className="btn-primary">
        Login
      </button>
    </form>
  );
};

const SignUpForm = () => {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const form = useForm<SignUpFormData>({
    resolver: zodResolver(signUpSchema),
    defaultValues: { name: "", email: "", password: "", confirmPassword: "" },
  });

  const onSubmit = async (formData: SignUpFormData) => {
    const { data, error } = await authClient.signUp.email(
      {
        ...formData,
        callbackURL: "/dashboard",
      },
      {
        onSuccess: () => router.push("/dashboard"),
        onError: (e) => setError(e.error.message),
      },
    );

    console.log(data);
  };

  return (
    <form
      onSubmit={form.handleSubmit(onSubmit)}
      className="flex flex-col gap-3 justify-center items-center"
    >
      {error && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="w-full p-3 text-sm text-red-400 bg-red-400/10 border border-red-400/20 rounded-lg"
        >
          {error}
        </motion.div>
      )}
      {/* Name */}
      <div className="flex items-center w-full">
        <div className="input-inline-icon">
          <UserIcon />
        </div>
        <input
          type="text"
          placeholder="Name"
          {...form.register("name")}
          autoComplete="off"
          className="input-inline-field"
        />
      </div>
      {form.formState.errors.name && (
        <p className="ml-2 text-sm text-destructive">
          {form.formState.errors.name.message}
        </p>
      )}

      {/* Email */}
      <div className="flex items-center w-full">
        <div className="input-inline-icon">
          <MailIcon />
        </div>
        <input
          type="email"
          autoComplete="off"
          placeholder="Email"
          {...form.register("email")}
          className="input-inline-field"
        />
      </div>
      {form.formState.errors.email && (
        <p className="ml-2 text-sm text-destructive">
          {form.formState.errors.email.message}
        </p>
      )}

      {/* pass */}
      <div className="flex items-center w-full">
        <div className="input-inline-icon">
          <LockIcon />
        </div>
        <input
          type="password"
          autoComplete="off"
          placeholder="Password"
          {...form.register("password")}
          className="input-inline-field"
        />
      </div>
      {form.formState.errors.password && (
        <p className="ml-2 text-sm text-destructive">
          {form.formState.errors.password.message}
        </p>
      )}

      {/* Confirm Password */}
      <div className="flex items-center w-full">
        <div className="input-inline-icon">
          <LockIcon />
        </div>
        <input
          type="password"
          autoComplete="off"
          {...form.register("confirmPassword")}
          placeholder="Confirm Password"
          className="input-inline-field"
        />
      </div>
      {form.formState.errors.confirmPassword && (
        <p className="ml-2 text-sm text-destructive">
          {form.formState.errors.confirmPassword.message}
        </p>
      )}

      <button type="submit" className="btn-primary">
        Create Account
      </button>
    </form>
  );
};

export default Register;
