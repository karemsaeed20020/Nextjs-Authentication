// 'use client';
// import React, { useEffect, useState } from 'react';
// import { useRouter } from 'next/navigation';
// import { toast, Toaster } from 'react-hot-toast';
// import axiosInstance from '@/lib/axios';
// import { useDispatch, useSelector } from 'react-redux';
// import { RootState } from '@/redux/store';
// import { clearPhoneAndCode } from '@/redux/auth/authSlice';

// const ResetPasswordPage = () => {
//   const router = useRouter();
//   const dispatch = useDispatch();

//   const phone = useSelector((state: RootState) => state.auth.phone);
//   const code = useSelector((state: RootState) => state.auth.code);

//   const [newPassword, setNewPassword] = useState('');
//   const [confirmPassword, setConfirmPassword] = useState('');
//   const [loading, setLoading] = useState(false);

//   useEffect(() => {
//     if (!phone || !code) {
//       toast.error('Missing OTP verification. Please verify again.');
//       router.push('/verify-otp');
//     }
//   }, [phone, code, router]);

//   const handleReset = async (e: React.FormEvent) => {
//   e.preventDefault();

//   if (!newPassword || !confirmPassword) {
//     toast.error('Please enter all fields.');
//     return;
//   }

//   if (newPassword !== confirmPassword) {
//     toast.error('Passwords do not match.');
//     return;
//   }

//   setLoading(true);
//   toast.dismiss();

//   try {
//     const res = await axiosInstance.post('api/auth/forget-password', {
//       phone,
//       code,
//       new_password: newPassword,
//       new_password_confirmation: confirmPassword,
//     });

//     console.log("Reset response:", res.data);  

    
//       if (res.data.success === 200 || res.data.success === "true") {
//       toast.success('Password reset successfully.');
//       dispatch(clearPhoneAndCode());
      
//     } else {
//       toast.success(res.data.message);
//       router.push('/login');
//     }
    
//   // eslint-disable-next-line @typescript-eslint/no-explicit-any
//   } catch (err: any) {
//     toast.error(err.response?.data?.message || 'Reset failed.');
//   } finally {
//     setLoading(false);
//   }
// };

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-900 via-purple-900 to-blue-900 px-4">
//       <Toaster position="top-right" />
//       <div className="w-full max-w-md bg-black/40 backdrop-blur p-6 rounded-lg border border-gray-600">
//         <h2 className="text-center text-3xl font-bold text-white mb-4">Reset Password</h2>
//         <form onSubmit={handleReset} className="space-y-6">
//           <input
//             type="password"
//             placeholder="New Password"
//             value={newPassword}
//             onChange={(e) => setNewPassword(e.target.value)}
//             className="w-full p-2 rounded border"
//           />
//           <input
//             type="password"
//             placeholder="Confirm Password"
//             value={confirmPassword}
//             onChange={(e) => setConfirmPassword(e.target.value)}
//             className="w-full p-2 rounded border"
//           />
//           <button
//             type="submit"
//             disabled={loading}
//             className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 rounded transition disabled:opacity-60"
//           >
//             {loading ? 'Resetting...' : 'Reset Password'}
//           </button>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default ResetPasswordPage;


'use client';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast, Toaster } from 'react-hot-toast';
import axiosInstance from '@/lib/axios';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { clearPhoneAndCode } from '@/redux/auth/authSlice';

const ResetPasswordPage = () => {
  const router = useRouter();
  const dispatch = useDispatch();

  const phone = useSelector((state: RootState) => state.auth.phone);
  const code = useSelector((state: RootState) => state.auth.code);

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!phone || !code) {
      toast.error('Missing OTP verification. Please verify again.');
      router.push('/verify-otp');
    }
  }, [phone, code, router]);

  const handleReset = async (e: React.FormEvent) => {
  e.preventDefault();

  if (!newPassword || !confirmPassword) {
    toast.error('Please enter all fields.');
    return;
  }

  if (newPassword !== confirmPassword) {
    toast.error('Passwords do not match.');
    return;
  }

  setLoading(true);
  toast.dismiss();

  try {
    const res = await axiosInstance.post('api/auth/forget-password', {
      phone,
      code,
      new_password: newPassword,
      new_password_confirmation: confirmPassword,
    });

    console.log("Reset response:", res.data);  

    
      if (res.data.success === 200 || res.data.success === "true") {
      toast.success('Password reset successfully.');
      dispatch(clearPhoneAndCode());
      
    } else {
      toast.success(res.data.message);
      router.push('/login');
    }
    
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (err: any) {
    toast.error(err.response?.data?.message || 'Reset failed.');
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-900 via-purple-900 to-blue-900 px-4">
      <Toaster position="top-right" />
      <div className="w-full max-w-md bg-black/40 backdrop-blur p-6 rounded-lg border border-gray-600">
        <h2 className="text-center text-3xl font-bold text-white mb-4">Reset Password</h2>
        <form onSubmit={handleReset} className="space-y-6">
          <input
            type="password"
            placeholder="New Password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="w-full p-2 rounded border"
          />
          <input
            type="password"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full p-2 rounded border"
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 rounded transition disabled:opacity-60"
          >
            {loading ? 'Resetting...' : 'Reset Password'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetPasswordPage;
