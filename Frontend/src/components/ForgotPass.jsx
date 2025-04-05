import React, { useState } from 'react';
import axios from 'axios';
import signupBg from '../assets/signupBg.jpg';
import { useNavigate } from 'react-router-dom';
const host = import.meta.env.VITE_BACKEND_HOST

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [step, setStep] = useState(1);
  const [message, setMessage] = useState('');

  const requestOtp = async () => {
    try {
      const res = await axios.post('${host}/api/auth/forgot-password', { email });
      setMessage(res.data.message);
      setStep(2);
    } catch (error) {
      console.log(error);
      setMessage(error.response?.data?.error || "Error sending OTP");
    }
  };

  const verifyOtp = async () => {
    try {
      const res = await axios.post('${host}/api/auth/verify-otp', { email, otp });
      setMessage(res.data.message);
      setStep(3);
    } catch (error) {
      setMessage(error.response?.data?.error || "Invalid OTP");
    }
  };

  const resetPassword = async () => {
    try {
      const res = await axios.post('${host}/api/auth/reset-password', { email, password:newPassword });
      setMessage(res.data.message);
      navigate('/login');
    } catch (error) {
      setMessage(error.response?.data?.error || "Error resetting password");
    }
  };

  return (
    <div className="min-h-screen bg-cover bg-center flex items-center justify-center px-4" style={{ backgroundImage: `url(${signupBg})` }}>
    <div className="max-w-md mx-auto p-6 bg-white shadow-md rounded-md">
      {message && <p className="text-green-500">{message}</p>}

      {step === 1 && (
        <>
        <div className="text-center mb-6">
          <h2 className="text-lg font-bold mb-2 text-center">Forgot Password</h2>
          <p className="mt-2 text-sm text-gray-600">
            Join us and start managing your electricity usage efficiently.
          </p>
          </div>
          <label htmlFor='email' className='block text-sm font-medium text-gray-700'>Email</label>
          <input
          name='email'
          id='email'
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
          <button onClick={requestOtp} className="mt-5 w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 text-lg">Send OTP</button>
        </>
      )}

      {step === 2 && (
        <>
          <div className='text-center mb-6'>
          <h2 className="text-lg font-bold mb-2 text-center">Verify OTP</h2>
          <p className="mt-2 text-sm text-gray-600">
            Join us and start managing your electricity usage efficiently.
          </p>
          </div>
          <label htmlFor='otp' className='block text-sm font-medium text-gray-700'>OTP</label>
          <input
          name='otp'
          id='otp'
            type="text"
            placeholder="Enter OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
          <button onClick={verifyOtp} className="bg-green-500 text-white p-2 w-full mt-2">Verify OTP</button>
        </>
      )}

      {step === 3 && (
        <>
          <div className='text-center mb-6'>
          <h2 className="text-lg font-bold mb-2 text-center">Reset Password</h2>
          <p className="mt-2 text-sm text-gray-600">
            Join us and start managing your electricity usage efficiently.
          </p>
          </div>
          <label htmlFor='pass' className='block text-sm font-medium text-gray-700'>Password</label>
          <input
          name='pass'
          id='pass'
            type="password"
            placeholder="Enter new password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
          <button onClick={resetPassword} className="bg-red-500 text-white p-2 w-full mt-5 border-amber-50 rounded-md">Reset Password</button>
        </>
      )}
    </div>
    </div>
  );
};

export default ForgotPassword;