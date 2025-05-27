"use client";
import { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { setPhoneAndCode } from "@/redux/auth/authSlice";
import { useRouter } from "next/navigation";
import axiosInstance from "@/lib/axios";
import { toast, Toaster } from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";
import { FiCheckCircle } from "react-icons/fi";

export default function VerifyOtp() {
  const dispatch = useDispatch();
  const router = useRouter();
  const phone = useSelector((state: RootState) => state.auth.phone);

  const [code, setCode] = useState(["", "", "", ""]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [timer, setTimer] = useState(60);
  const inputsRef = useRef<(HTMLInputElement | null)[]>([]);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);

  // Check for phone in Redux; if missing, redirect
  useEffect(() => {
    if (!phone) {
      toast.error("Verification process interrupted. Please start again.");
      router.push("/signup");
    }
  }, [phone, router]);

  useEffect(() => {
    if (timer === 0) return;
    const interval = setInterval(() => setTimer((prev) => prev - 1), 1000);
    return () => clearInterval(interval);
  }, [timer]);

  useEffect(() => {
    inputsRef.current[activeIndex]?.focus();
  }, [activeIndex]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>, idx: number) => {
    const val = e.target.value;
    if (!/^\d?$/.test(val)) return;
    const newCode = [...code];
    newCode[idx] = val;
    setCode(newCode);
    if (val && idx < 3) setActiveIndex(idx + 1);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, idx: number) => {
    if (e.key === "Backspace") {
      if (code[idx]) {
        const newCode = [...code];
        newCode[idx] = "";
        setCode(newCode);
      } else if (idx > 0) {
        setActiveIndex(idx - 1);
      }
    } else if (e.key === "ArrowLeft" && idx > 0) {
      setActiveIndex(idx - 1);
    } else if (e.key === "ArrowRight" && idx < 3) {
      setActiveIndex(idx + 1);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!phone) {
      toast.error("Phone number not found. Please go back and try again.");
      return router.push("/signup");
    }

    const otp = code.join("");
    if (otp.length < 4) {
      setError("Please enter a 4-digit code.");
      return;
    }

    setLoading(true);
    toast.loading("Verifying code...", { id: "verify-toast" });

    try {
      await axiosInstance.post("api/auth/verify", { phone, code: otp });
      toast.dismiss("verify-toast");
      setShowSuccessPopup(true);

      // Save phone and code to Redux
      dispatch(setPhoneAndCode({ phone, code: otp }));

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      const message = err.response?.data?.message || "Invalid code, please try again.";
      setError(message);
      toast.error(message, { id: "verify-toast" });
    } finally {
      setLoading(false);
    }
  };

  const resendCode = async () => {
    if (!phone) {
      toast.error("Phone number missing for resend. Please go back.");
      return router.push("/signup");
    }
    setLoading(true);
    setError("");
    toast.loading("Sending code...", { id: "send-code-toast" });

    try {
      await axiosInstance.post("api/auth/send-code", {
        phone,
        usage: "verify",
      });
      setCode(["", "", "", ""]);
      setActiveIndex(0);
      setTimer(60);
      toast.success("Code resent!", { id: "send-code-toast" });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      const message = err.response?.data?.message || "Failed to resend code.";
      setError(message);
      toast.error(message, { id: "send-code-toast" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let redirectTimer: NodeJS.Timeout;
    if (showSuccessPopup) {
      redirectTimer = setTimeout(() => {
        router.push("/login");
      }, 3000);
    }
    return () => clearTimeout(redirectTimer);
  }, [showSuccessPopup, router]);

  return (
    <div className="flex flex-col items-center justify-center bg-gray-900 px-4 py-10">
      <Toaster position="top-right" />

      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md bg-white/10 backdrop-blur p-8 rounded-xl shadow-lg space-y-6 border border-gray-700"
        style={{ display: showSuccessPopup ? "none" : "block" }}
      >
        <h2 className="text-2xl font-bold text-white text-center">Enter Verification Code</h2>
        <div className="flex justify-between gap-4">
          {code.map((digit, i) => (
            <input
              key={i}
             ref={(el) => {
                inputsRef.current[i] = el;
              }}
              type="text"
              maxLength={1}
              value={digit}
              onChange={(e) => handleChange(e, i)}
              onKeyDown={(e) => handleKeyDown(e, i)}
              className="w-12 h-12 text-center text-2xl font-bold rounded-lg bg-white/20 text-white outline-none border border-gray-500 focus:ring-2 ring-[#E7C9A5] transition-all"
            />
          ))}
        </div>

        {error && <p className="text-red-400 text-sm text-center">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 text-sm font-semibold text-black bg-[#E7C9A5] rounded-xl hover:bg-[#d8b58e] transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {loading ? "Verifying..." : "Verify Code"}
        </button>

        <div className="text-center text-sm text-gray-300">
          Didnt get the code?{" "}
          <button
            onClick={resendCode}
            type="button"
            className="text-[#E7C9A5] hover:underline disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={timer > 0 || loading}
          >
            Resend {timer > 0 && `(${timer})`}
          </button>
        </div>
      </form>

      <AnimatePresence>
        {showSuccessPopup && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <motion.div
              className="bg-gray-800 text-white p-8 rounded-lg shadow-2xl max-w-sm w-full text-center border border-green-700"
              initial={{ scale: 0.8, opacity: 0, y: 50 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.8, opacity: 0, y: -50 }}
              transition={{ type: "spring", stiffness: 200, damping: 20 }}
            >
              <div className="mb-4">
                <FiCheckCircle className="text-green-500 text-6xl mx-auto animate-bounce-subtle" />
              </div>
              <h3 className="text-2xl font-bold mb-2 text-green-400">Verification Successful!</h3>
              <p className="text-gray-300 mb-6">
                Your account has been successfully verified. You will be redirected to the login page shortly.
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
