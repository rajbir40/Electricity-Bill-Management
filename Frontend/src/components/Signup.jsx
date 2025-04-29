import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { Mail, Lock, AlertCircle, Zap, User, Phone, MapPin, ArrowRight } from 'lucide-react';

const host = import.meta.env.VITE_BACKEND_HOST;

const SignUpPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    phone: '',
    address: '',
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [signupError, setSignupError] = useState('');

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
    
    // Clear signup error when user makes changes
    if (signupError) {
      setSignupError('');
    }
  };

  const validate = () => {
    const newErrors = {};
    
    if (!formData.fullName.trim()) newErrors.fullName = 'Full name is required';
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
    if (!formData.phone) {
      newErrors.phone = 'Phone number is required';
    } else if (formData.phone.length !== 10) {
      newErrors.phone = 'Phone number should be 10 digits';
    }
    if (!formData.address) {
      newErrors.address = 'Address is required';
    }
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = validate();
    
    if (Object.keys(newErrors).length === 0) {
      setIsLoading(true);
      try {
        const response = await axios.post(`${host}/api/auth/signup`, formData);
        if(response.status === 201){
          navigate('/login');
        }
      } catch (error) {
        setSignupError('Registration failed. Please try again later.');
        console.error('Signup error:', error);
      } finally {
        setIsLoading(false);
      }
    } else {
      setErrors(newErrors);
    }
  };

  // Field configuration for easier rendering and maintenance
  const fields = [
    {
      id: 'fullName',
      label: 'Full Name',
      type: 'text',
      placeholder: 'Enter your full name',
      icon: User
    },
    {
      id: 'email',
      label: 'Email Address',
      type: 'email',
      placeholder: 'your@email.com',
      icon: Mail
    },
    {
      id: 'password',
      label: 'Password',
      type: 'password',
      placeholder: '••••••••',
      icon: Lock
    },
    {
      id: 'phone',
      label: 'Phone Number',
      type: 'tel',
      placeholder: '10-digit phone number',
      icon: Phone
    },
    {
      id: 'address',
      label: 'Address',
      type: 'text',
      placeholder: 'Enter your address',
      icon: MapPin
    }
  ];

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-blue-50 to-indigo-50">
      {/* Left Section - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center px-8 py-12">
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
            <div className="text-center mb-6">
              <h2   className="text-2xl font-bold text-gray-900 bg-blue">Create Account</h2>
              <p className="mt-2 text-gray-600">
                Join SmartBill and start managing your electricity usage efficiently
              </p>
            </div>

            {signupError && (
              <div className="mb-6 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center text-red-700">
                <AlertCircle className="h-5 w-5 mr-2 flex-shrink-0" />
                <span className="text-sm">{signupError}</span>
              </div>
            )}

            <form className="space-y-4" onSubmit={handleSubmit}>
              {fields.map((field) => (
                <div key={field.id}>
                  <label htmlFor={field.id} className="block text-sm font-medium text-gray-700 mb-1">
                    {field.label}
                  </label>
                  <div className="relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <field.icon className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      id={field.id}
                      name={field.id}
                      type={field.type}
                      required
                      value={formData[field.id]}
                      onChange={handleChange}
                      className={`block w-full pl-10 pr-3 py-2 border ${
                        errors[field.id] ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
                      } rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2`}
                      placeholder={field.placeholder}
                      disabled={isLoading}
                    />
                  </div>
                  {errors[field.id] && (
                    <p className="mt-1 text-sm text-red-600 flex items-center">
                      <AlertCircle className="h-4 w-4 mr-1" />
                      {errors[field.id]}
                    </p>
                  )}
                </div>
              ))}

              <div className="mt-6">
                <button
                  type="submit"
                  disabled={isLoading}
                  style={{ backgroundColor: "blue" }}
                  className={`bg-blue-700 w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-white text-lg font-medium ${
                    isLoading ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
                  }`}
                >
                  {isLoading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Creating Account...
                    </>
                  ) : (
                    <>
                      Create Account
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </>
                  )}
                </button>
              </div>
            </form>

            <div className="mt-6 text-center">
              <p className="text-gray-700">
                Already have an account?{' '}
                <Link to="/login" className="text-blue-600 hover:text-blue-500 font-medium">
                  Sign In
                </Link>
              </p>
            </div>
          </div>
          
          <div className="mt-6 text-center text-sm text-gray-500">
            <p>© 2025 SmartBill. All rights reserved.</p>
          </div>
        </div>
      </div>
      
      {/* Right Section - Visual Elements */}
      <div className="hidden lg:flex lg:w-1/2 flex-col bg-blue-600 text-white justify-center items-center p-12">
        <div className="max-w-md">
          <div className="flex justify-center mb-8">
            <div className="p-3 bg-blue-500 rounded-full">
              <Zap size={48} className="text-white" />
            </div>
          </div>
          
          <h1 className="text-4xl font-bold mb-6 text-center">Welcome to SmartBill</h1>
          <p className="text-xl mb-8 text-center">Join thousands of users already saving on their electricity bills</p>
          
          <div className="bg-blue-500/30 p-6 rounded-lg backdrop-blur-sm">
            <h3 className="font-semibold text-lg mb-4 flex items-center">
              <User className="mr-2 h-5 w-5" />
              Benefits of joining SmartBill
            </h3>
            
            <ul className="space-y-3">
              <li className="flex items-start">
                <div className="bg-blue-500 p-1 rounded-full mr-3 mt-1">
                  <svg className="h-3 w-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
                  </svg>
                </div>
                <span>Track your daily, weekly, and monthly consumption</span>
              </li>
              <li className="flex items-start">
                <div className="bg-blue-500 p-1 rounded-full mr-3 mt-1">
                  <svg className="h-3 w-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
                  </svg>
                </div>
                <span>Receive personalized energy-saving recommendations</span>
              </li>
              <li className="flex items-start">
                <div className="bg-blue-500 p-1 rounded-full mr-3 mt-1">
                  <svg className="h-3 w-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
                  </svg>
                </div>
                <span>Pay your bills online securely and conveniently</span>
              </li>
              <li className="flex items-start">
                <div className="bg-blue-500 p-1 rounded-full mr-3 mt-1">
                  <svg className="h-3 w-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
                  </svg>
                </div>
                <span>Compare usage with similar households in your area</span>
              </li>
              <li className="flex items-start">
                <div className="bg-blue-500 p-1 rounded-full mr-3 mt-1">
                  <svg className="h-3 w-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
                  </svg>
                </div>
                <span>Get alerts for unusual consumption patterns</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;