import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { Mail, Lock, AlertCircle, Zap, BatteryCharging, BarChart2, ArrowRight,Loader } from 'lucide-react';

const host = import.meta.env.VITE_BACKEND_HOST;

const LoginPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [loginError, setLoginError] = useState('');

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    // Clear errors when user starts typing
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = {...prev};
        delete newErrors[name];
        return newErrors;
      });
    }
    
    // Clear login error when user makes changes
    if (loginError) {
      setLoginError('');
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = validate();
  
    if (Object.keys(newErrors).length === 0) {
      setIsLoading(true);
      try {
        const response = await axios.post(`${host}/api/auth/login`, formData);
        if (response.status === 200) {
          const { token, user } = response.data;
          localStorage.setItem("token", token);
          localStorage.setItem("role", user.role);
        
          // Optional: artificial delay (for UX, so loader is visible properly)
          setTimeout(() => {
            setIsLoading(false);  // stop loading just before navigation
        
            if (user.role === "admin") {
              navigate('/admin/dashboard');
            } else {
              navigate('/profile');
            }
          }, 1000);  // wait 1 second
        } else {
          setIsLoading(false);  // also stop loading if login failed
        }
      } catch (error) {
        setLoginError('Invalid credentials or server error');
        console.error('Login error:', error);
      } finally {
        setIsLoading(false);
      }
    } else {
      setErrors(newErrors);
    }
  };

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-blue-50 to-indigo-50">
      {/* Left Section - Visual Elements */}
      <div className="hidden lg:flex lg:w-1/2 flex-col bg-blue-600 text-white justify-center items-center p-12">
        <div className="max-w-md">
          <div className="flex justify-center mb-8">
            <div className="p-3 bg-blue-500 rounded-full">
              <Zap size={48} className="text-white" />
            </div>
          </div>
          
          <h1 className="text-4xl font-bold mb-6 text-center">SmartBill</h1>
          <p className="text-xl mb-8 text-center">Manage your electricity usage efficiently and save money</p>
          
          <div className="space-y-6">
            <div className="flex items-start">
              <div className="bg-blue-500 p-2 rounded-full mr-4">
                <BarChart2 size={20} />
              </div>
              <div>
                <h3 className="font-semibold text-lg">Track Consumption</h3>
                <p className="text-blue-100">Monitor your energy usage patterns in real-time</p>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="bg-blue-500 p-2 rounded-full mr-4">
                <BatteryCharging size={20} />
              </div>
              <div>
                <h3 className="font-semibold text-lg">Save Energy</h3>
                <p className="text-blue-100">Get personalized tips to reduce your energy consumption</p>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="bg-blue-500 p-2 rounded-full mr-4">
                <Mail size={20} />
              </div>
              <div>
                <h3 className="font-semibold text-lg">Bill Notifications</h3>
                <p className="text-blue-100">Receive timely alerts for upcoming and due bills</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Right Section - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center px-8">
        <div className="max-w-md w-full">
          {/* Top Nav for Mobile/Tablet */}
          <div className="flex justify-center mb-8 lg:hidden">
            <div className="flex items-center">
              <Zap size={28} className="text-blue-600 mr-2" />
              <span className="text-2xl font-bold">
                Smart<span className="text-blue-800">Bill</span>
              </span>
            </div>
          </div>
        
          <div className="bg-white shadow-xl rounded-xl p-8">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900">Welcome Back</h2>
              <p className="mt-2 text-gray-600">
                Sign in to access your electricity dashboard
              </p>
            </div>

            {loginError && (
              <div className="mb-6 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center text-red-700">
                <AlertCircle className="h-5 w-5 mr-2 flex-shrink-0" />
                <span className="text-sm">{loginError}</span>
              </div>
            )}

            <form className="space-y-6" onSubmit={handleSubmit}>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address
                </label>
                <div className="relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className={`block w-full pl-10 pr-3 py-3 border ${
                      errors.email ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
                    } rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2`}
                    placeholder="your@email.com"
                  />
                </div>
                {errors.email && (
                  <p className="mt-1 text-sm text-red-600 flex items-center">
                    <AlertCircle className="h-4 w-4 mr-1" />
                    {errors.email}
                  </p>
                )}
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                  Password
                </label>
                <div className="relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="current-password"
                    required
                    value={formData.password}
                    onChange={handleChange}
                    className={`block w-full pl-10 pr-3 py-3 border ${
                      errors.password ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
                    } rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2`}
                    placeholder="••••••••"
                  />
                </div>
                {errors.password && (
                  <p className="mt-1 text-sm text-red-600 flex items-center">
                    <AlertCircle className="h-4 w-4 mr-1" />
                    {errors.password}
                  </p>
                )}
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    id="remember-me"
                    name="remember-me"
                    type="checkbox"
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                    Remember me
                  </label>
                </div>
                <div className="text-sm">
                  <Link to="/forgot-password" className="font-medium text-blue-600 hover:text-blue-500">
                    Forgot password?
                  </Link>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className={`w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-white text-lg font-medium ${
                  isLoading ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
                }`}
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Signing in...
                  </>
                ) : (
                  <>
                    Sign in
                    <ArrowRight className="ml-2 h-5 w-5 " />
                  </>
                )}
              </button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-gray-700">
                Don't have an account?{' '}
                <Link to="/signup" className="text-blue-600 hover:text-blue-500 font-medium">
                  Create Account
                </Link>
              </p>
            </div>
          </div>
          
          <div className="mt-6 text-center text-sm text-gray-500">
            <p>© 2025 SmartBill. All rights reserved.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;