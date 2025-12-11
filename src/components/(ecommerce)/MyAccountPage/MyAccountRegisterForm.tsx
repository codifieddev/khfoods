"use client";

import axios, { isAxiosError } from "axios";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Eye, EyeOff } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Link } from "@/i18n/routing";

type RegisterFormData = {
  email: string;
  password: string;
  confirmPassword: string;
  fullName: string;
  sessions: [];
  shippings: [];
  cart: string;
  firstName: string;
  lastName: string;
  lastBuyerType: string;
};

export const MyAccountRegisterForm = () => {
  const [showPassword, setShowPassword] = useState(false);
  const t = useTranslations("RegisterForm");
  const tErrors = useTranslations("RegisterForm.errors");

  const form = useForm<RegisterFormData>({
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
      fullName: "",
      sessions: [],
      shippings: [],
      cart: "",
      firstName: "",
      lastName: "",
      lastBuyerType: "",
    },
    mode: "onBlur",
  });

  const [message, setMessage] = useState("");

  const onSubmit = async (values: RegisterFormData) => {
    setMessage("");

    // Validate email
    if (!values.email) {
      form.setError("email", { message: tErrors("email-empty") });
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(values.email)) {
      form.setError("email", { message: tErrors("email") });
      return;
    }

    // Validate password
    if (!values.password) {
      form.setError("password", { message: tErrors("password") });
      return;
    }
    if (values.password.length < 8) {
      form.setError("password", { message: tErrors("password-length") });
      return;
    }

    // Validate confirm password
    if (!values.confirmPassword) {
      form.setError("confirmPassword", { message: tErrors("password") });
      return;
    }
    if (values.password !== values.confirmPassword) {
      form.setError("confirmPassword", {
        message: tErrors("passwords-mismatch"),
      });
      return;
    }

    try {
      const res = await axios.post("/api/customers", {
        email: values.email,
        password: values.password,
      });

      console.log(" resposne --register", res);
      if (res.status === 200 || res.status === 201) {
        setMessage(t("success"));
        form.reset();
      }
    } catch (error) {
      if (isAxiosError(error)) {
        console.log(error?.response);
        form.setError("root", { message: t("errors.server-error") });
      } else {
        console.log(error);
        form.setError("root", { message: t("errors.server-error") });
      }
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col space-y-5"
      >
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-normal text-gray-700">
                Email address <span className="text-red-500">*</span>
              </FormLabel>
              <FormControl>
                <Input
                  placeholder=""
                  {...field}
                  className="bg-gray-100 border-0 focus-visible:ring-0 focus-visible:ring-offset-0 h-11 rounded-sm"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-normal text-gray-700">
                Password <span className="text-red-500">*</span>
              </FormLabel>
              <FormControl>
                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder=""
                    {...field}
                    className="bg-gray-100 border-0 focus-visible:ring-0 focus-visible:ring-offset-0 h-11 rounded-sm pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="confirmPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-normal text-gray-700">
                Confirm Password <span className="text-red-500">*</span>
              </FormLabel>
              <FormControl>
                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder=""
                    {...field}
                    className="bg-gray-100 border-0 focus-visible:ring-0 focus-visible:ring-offset-0 h-11 rounded-sm pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="text-sm text-gray-600 leading-relaxed -mt-1">
          Your personal data will be used to support your experience throughout
          this website, to manage access to your account, and for other purposes
          described in our{" "}
          <Link href="/privacy-policy" className="underline hover:no-underline">
            privacy policy
          </Link>
          .
        </div>

        {form.formState.errors.root?.message && (
          <p className="text-sm text-red-500">
            {form.formState.errors.root.message}
          </p>
        )}
        {message && <p className="text-sm text-green-600">{message}</p>}

        <Button
          type="submit"
          className="bg-gray-900 hover:bg-black text-white py-3 rounded-sm font-medium h-12"
        >
          Register
        </Button>
      </form>
    </Form>
  );
};
