import React,{useEffect,useState} from 'react';
import Navbar from './Navbar';
import adminProfile from '../assets/adminProfile.jpg';
import { authStore } from '../store/auth.store';
const host = import.meta.env.VITE_BACKEND_HOST;
import axios from 'axios';

export default function AdminProfile() {
  const { authUser } = authStore();
  
  const [userDetails, setUserDetails] = useState({
    fullName: "",
    email: "",
    phone: "",
    address: "",
    department: "",
    role: ""
  });

  const fetchUserDetails = async () => {
    try {
      const user_id = authUser.user_id;
      const response = await axios.get(`${host}/api/user/get/${user_id}`);
      setUserDetails(response.data[0]);
    } catch (error) {
      console.error('Error fetching user details:', error);
    }
  };
  useEffect(() => {
      fetchUserDetails();
    }, []);
  
  return (
    <div className="min-h-screen bg-gray-50 relative">
      <div
                    className="fixed inset-0 z-0"
                    style={{
                      backgroundImage: `url(${adminProfile})`,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                      filter: 'brightness(0.7)',  
                    }}
              />
              <div className='relative z-10'>
      <Navbar />
      <div className="container mx-auto py-8 px-4 mt-6">
        <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-md p-6">
          <div className="flex flex-col md:flex-row items-center">
            {/* Profile Picture */}
            <div className="flex justify-center mb-4">
                <div className="h-24 w-24 rounded-full bg-gray-200 flex items-center justify-center border-4 border-blue-200">
                  <span className="text-2xl font-bold text-blue-600">
                    {userDetails.fullName?.split(' ').map(n => n[0]).join('')}
                  </span>
                </div>
              </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-800">{userDetails.fullName}</h1>
              <p className="text-gray-600 mt-1">{userDetails.role}</p>
              <p className="text-gray-600">{userDetails.department}</p>
            </div>
          </div>
          {/* Contact Information */}
          <div className="mt-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-2">Contact Information</h2>
            <div className="space-y-2">
              <div className="flex items-center">
                <span className="w-32 font-medium text-gray-600">Email:</span>
                <span className="text-gray-800">{userDetails.email}</span>
              </div>
              <div className="flex items-center">
                <span className="w-32 font-medium text-gray-600">Phone:</span>
                <span className="text-gray-800">{userDetails.phone}</span>
              </div>
            </div>
          </div>
          {/* About Section */}
          <div className="mt-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-2">About</h2>
            <p className="text-gray-700">yoyoyoyoyoyoyoyoyyoyoyoyo</p>
          </div>
        </div>
        </div>
      </div>
    </div>
  );
}
