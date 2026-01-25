"use client";

import { LayoutGroup, motion } from "motion/react";
import { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Paperclip } from "lucide-react";

const signInSchema = z.object({
  email: z.email("Please enter a valid email"),
  password: z.string().min(8, "Password must be atleast 8 characters long"),
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

  const items = [
    {
      key: "signin" as const,
      label: "Sign In",
      title: "Login to your account",
    },
    { key: "signup" as const, label: "Sign Up", title: "Create an account" },
  ];

  return (
    <div className="text-white flex justify-center items-center  h-full">
      <div className="h-123 bg-zinc-900 rounded-lg p-12 border border-white/5">
        {/* mode pill*/}
        <LayoutGroup>
          <div className="flex bg-zinc-950 p-1 rounded-full w-fit border border-white/10">
            {items.map((item) => {
              const active = mode === item.key;

              return (
                <button
                  key={item.key}
                  type="button"
                  onClick={() => setMode(item.key)}
                  className="relative cursor-pointer px-4 py-2 rounded-full text-sm"
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
                  <span className="relative z-10 text-white">{item.label}</span>
                </button>
              );
            })}
          </div>
        </LayoutGroup>

        <h2 className="text-2xl font-bold my-6">
          {items.map((item) => item.key === mode && item.title)}
        </h2>

        {mode == "signin" ? <SignInForm /> : <SignUpForm />}
      </div>
    </div>
  );
};

const SignInForm = () => {
  const router = useRouter();
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
      { onSuccess: () => router.push("/dashboard") },
    );

    console.log(data);
  };

  return (
    <form
      onSubmit={form.handleSubmit(onSubmit)}
      className="flex flex-col gap-3 justify-center"
    >
      {/* Email */}
      <div className="flex items-center">
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
      <div className="flex items-center ">
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

      <button
        type="submit"
        className="mt-4 bg-violet-600 hover:bg-violet-500 transition-colors py-2 px-4 rounded-md font-medium"
      >
        Login
      </button>
    </form>
  );
};

const SignUpForm = () => {
  const router = useRouter();
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
      { onSuccess: () => router.push("/dashboard") },
    );

    console.log(data);
  };

  return (
    <form
      onSubmit={form.handleSubmit(onSubmit)}
      className="flex flex-col gap-3 justify-center"
    >
      {/* Name */}
      <div className="flex items-center">
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
      <div className="flex items-center">
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
      <div className="flex items-center ">
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
      <div key="confirm-field" className="overflow-hidden">
        <div className="flex items-center">
          <input
            type="password"
            autoComplete="off"
            {...form.register("confirmPassword")}
            placeholder="Confirm Password"
            className="input-inline-field"
          />
        </div>
      </div>
      {form.formState.errors.confirmPassword && (
        <p className="ml-2 text-sm text-destructive">
          {form.formState.errors.confirmPassword.message}
        </p>
      )}

      <button
        type="submit"
        className="mt-4 bg-violet-600 hover:bg-violet-500 transition-colors py-2 px-4 rounded-md font-medium"
      >
        Create Account
      </button>
    </form>
  );
};

export default Register;
