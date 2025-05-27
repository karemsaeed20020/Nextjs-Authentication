"use client";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import {
  loginStart,
  loginSuccess,
  loginFailure,
} from "@/redux/auth/authSlice";
import axiosInstance from "@/lib/axios";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";
import Input from "@/components/inputs/Input";
import { MdPhone, MdLock } from "react-icons/md";
import { useRouter } from "next/navigation";
import Link from "next/link"; // <-- Import Link
import { LoginFormType, loginSchema } from "@/schema/validations";

export default function LoginPage() {
  const dispatch = useDispatch();
  const router = useRouter();
  const { loading, error, token } = useSelector((state: RootState) => state.auth);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormType>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormType) => {
    try {
      dispatch(loginStart());
      const res = await axiosInstance.post("api/auth/login", data);
      const token = res.data.token;
      dispatch(loginSuccess(token));
      toast.success("Logged in successfully");
      router.push("/");
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      const message = err?.response?.data?.message || "Login failed";
      dispatch(loginFailure(message));
      toast.error(message);
    }
  };

  useEffect(() => {
    if (token) {
      axiosInstance.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    }
  }, [token]);

  return (
    <div className="max-w-md mx-auto mt-10 px-4">
      <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 p-10 rounded-lg  bg-gradient-to-br from-[#12141D] to-[#12151F]">
        <Input
          type="text"
          label="Phone"
          placeholder="Enter your phone"
          icon={<MdPhone />}
          error={errors.phone?.message}
          register={register("phone")}
        />
        <Input
          type="password"
          label="Password"
          placeholder="Enter your password"
          icon={<MdLock />}
          error={errors.password?.message}
          register={register("password")}
        />

        {/* Forgot Password Link */}
        <div className="text-right">
          <Link href="/forgot-password" className="text-sm text-[#E7C9A5] hover:underline">
            Forgot Password?
          </Link>
        </div>

        <button
          type="submit"
          className="w-full py-2.5 bg-[#E7C9A5] text-black font-semibold rounded hover:bg-[#d6b58f] transition"
          disabled={loading}
        >
          {loading ? "Logging in..." : "Login"}
        </button>

        {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
      </form>

      {/* Register Link */}
      <p className="mt-6 text-center text-sm text-gray-400">
        Dont have an account?{" "}
        <Link href="/sign-up" className="text-[#E7C9A5] hover:underline">
          Register
        </Link>
      </p>
    </div>
  );
}
