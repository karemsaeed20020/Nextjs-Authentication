"use client";
import { useDispatch, useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormSchema, FormSchemaType } from "@/schema/validations";
import Input from "@/components/inputs/Input";
import { CiUser } from "react-icons/ci";
import { BsTelephone } from "react-icons/bs";
import { FiLock, FiMail } from "react-icons/fi";
import { motion } from "framer-motion";
import Link from "next/link";
import { toast, Toaster } from "react-hot-toast";
import axiosInstance from "@/lib/axios";
import {
  registerStart,
  registerSuccess,
  registerFailure,
} from "@/redux/auth/authSlice";
import { RootState } from "@/redux/store";
import { useRouter } from "next/navigation";
import { useState } from "react";

const getPasswordScore = (password: string) => {
  let score = 0;
  if (!password) return score;
  if (password.length >= 6) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;
  if (password.length >= 10) score++;
  return score;
};

export default function RegisterPage() {
  const dispatch = useDispatch();
  const router = useRouter();
  const { loading } = useSelector((state: RootState) => state.auth);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<FormSchemaType>({
    resolver: zodResolver(FormSchema),
  });

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [password, setPassword] = useState("");
  const passwordValue = watch("password", "");
  const passwordScore = getPasswordScore(passwordValue);

  const onSubmit = async (data: FormSchemaType) => {
    dispatch(registerStart());

    const payload = {
      name: data.username,
      email: data.email,
      phone: data.phone,
      password: data.password,
      password_confirmation: data.password_confirmation,
    };

    try {
      const response = await axiosInstance.post("api/auth/register", payload);

      if (response.status === 201 || response.status === 200) {
        // Assuming response.data contains a token
        const token = response.data.token || "";
        dispatch(registerSuccess({ token, phone: data.phone }));
        toast.success("Registration successful!");
        router.push("/sign-up/verify-code-signup");
      } else {
        throw new Error("Registration failed.");
      }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      const message =
        error?.response?.data?.message || error.message || "Registration failed.";
      dispatch(registerFailure(message));
      toast.error(message);
      console.error("Registration error:", error);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: 0.1,
        staggerChildren: 0.07,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15,
      },
    },
  };

  return (
    <main className="bg-dark-100 text-white flex items-center justify-center px-4 py-10">
      <Toaster position="top-right" />

      {loading && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="w-16 h-16 border-4 border-t-transparent border-[#E7C9A5] rounded-full animate-spin"></div>
          <span className="ml-4 text-lg font-semibold text-white">Loading...</span>
        </div>
      )}

      <motion.form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full max-w-lg space-y-5 bg-gradient-to-br from-[#12141D] to-[#12151F] p-6 md:p-8 rounded-xl shadow-lg relative z-10"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        <motion.h2
          className="text-2xl font-bold mb-2 text-center"
          variants={itemVariants}
        >
          Create Account
        </motion.h2>

        <motion.div variants={itemVariants}>
          <Input
            label="Username"
            type="text"
            icon={<CiUser />}
            placeholder="Your username"
            {...register("username")}
            error={errors.username?.message}
          />
        </motion.div>

        <motion.div variants={itemVariants}>
          <Input
            label="Email"
            type="email"
            icon={<FiMail />}
            placeholder="example@domain.com"
            {...register("email")}
            error={errors.email?.message}
          />
        </motion.div>

        <motion.div variants={itemVariants}>
          <Input
            label="Phone Number"
            type="text"
            icon={<BsTelephone />}
            placeholder="+(XXX) XXX-XXXX"
            {...register("phone")}
            error={errors.phone?.message}
          />
        </motion.div>

        <motion.div variants={itemVariants}>
          <Input
            label="Password"
            type="password"
            icon={<FiLock />}
            placeholder="********"
            {...register("password", {
              onChange: (e) => setPassword(e.target.value),
            })}
            error={errors.password?.message}
          />
        </motion.div>

        {passwordValue.length > 0 && (
          <motion.div
            className="flex gap-1 mt-1"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
          >
            {Array(5)
              .fill(0)
              .map((_, i) => (
                <motion.span
                  key={i}
                  className="w-full h-2 rounded-xl overflow-hidden"
                >
                  <motion.div
                    className={`h-full ${
                      i < passwordScore
                        ? passwordScore <= 2
                          ? "bg-red-400"
                          : passwordScore < 4
                          ? "bg-yellow-400"
                          : "bg-green-500"
                        : "bg-gray-300"
                    }`}
                    initial={{ width: 0 }}
                    animate={{ width: i < passwordScore ? "100%" : "0%" }}
                    transition={{ duration: 0.3, delay: i * 0.05 }}
                  />
                </motion.span>
              ))}
          </motion.div>
        )}

        <motion.div variants={itemVariants}>
          <Input
            label="Confirm Password"
            type="password"
            icon={<FiLock />}
            placeholder="********"
            {...register("password_confirmation")}
            error={errors.password_confirmation?.message}
          />
        </motion.div>

        <motion.button
          type="submit"
          className="w-full py-2 px-4 rounded bg-[#E7C9A5] transition-colors duration-200 disabled:opacity-60 disabled:cursor-not-allowed hover:bg-[#C9AB89] font-semibold text-gray-900"
          disabled={loading}
          variants={itemVariants}
        >
          {loading ? "Registering..." : "Register"}
        </motion.button>

        <motion.div
          className="mt-3 text-center text-sm text-gray-400"
          variants={itemVariants}
        >
          Already have an account?{" "}
          <Link href="/login" className="text-[#E7C9A5] hover:underline">
            Login
          </Link>
        </motion.div>
      </motion.form>
    </main>
  );
}
