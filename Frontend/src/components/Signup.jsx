import React, { useState } from 'react';
import signupBg from '../assets/signupBg.jpg';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
const host = import.meta.env.VITE_BACKEND_HOST

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

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: type === 'checkbox' ? checked : value
    }));
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
      const response = await axios.post(`${host}/api/auth/signup`, formData);
      if(response.status === 201){
        alert('Sign up successful! Redirecting to login page...');
        console.log('Form submitted:', formData);
        navigate('/login');
      }
    } else {
      alert('Sign up failed! Please check the form.');
      setErrors(newErrors);
    }
  };

  return (
    <div className="min-h-screen bg-cover bg-center flex items-center justify-center px-4" style={{ backgroundImage: `url(${signupBg})` }}>
      <div className="max-w-md w-full bg-white bg-opacity-90 rounded-lg shadow-xl p-8 backdrop-blur-md">
        <div className="text-center mb-6">
          <h2 className="text-3xl font-bold text-gray-900">Sign Up</h2>
          <p className="mt-2 text-sm text-gray-600">Join us and start managing your electricity usage efficiently.</p>
        </div>
        
        <form className="space-y-4" onSubmit={handleSubmit}>
          {['fullName', 'email', 'password', 'phone', 'address'].map((field) => (
            <div key={field}>
              <label htmlFor={field} className="block text-sm font-medium text-gray-700">
                {field.charAt(0).toUpperCase() + field.slice(1)}
              </label>
              <input
                id={field}
                name={field}
                type={field === 'password' ? 'password' : 'text'}
                required
                value={formData[field]}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
              {errors[field] && <p className="mt-1 text-sm text-red-600">{errors[field]}</p>}
            </div>
          ))}
          
          <button
            type="submit"
            className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 text-lg"
            style={{ backgroundColor: '#2563EB', color: 'white' }}>          
            Sign Up
          </button>
        </form>
        
        <div className="mt-6 text-center">
          <p className="text-gray-700">Already have an account? <a href="/login" className="text-blue-600 hover:underline">Sign In</a></p>
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;