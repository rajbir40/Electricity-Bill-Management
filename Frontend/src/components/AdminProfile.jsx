import React from 'react';
import Navbar from './Navbar';
import adminProfile from '../assets/adminProfile.jpg';
export default function AdminProfile() {
  const admin = {
    name: "Alex Smith",
    email: "alex.smith@adminportal.com",
    phone: "(555) 987-6543",
    role: "Administrator",
    department: "IT Management",
    bio: "Alex has over 10 years of experience in managing IT infrastructure and operations. He is responsible for ensuring smooth IT operations and implementing security protocols across the organization."
  };

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
                    {admin.name?.split(' ').map(n => n[0]).join('')}
                  </span>
                </div>
              </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-800">{admin.name}</h1>
              <p className="text-gray-600 mt-1">{admin.role}</p>
              <p className="text-gray-600">{admin.department}</p>
            </div>
          </div>
          {/* Contact Information */}
          <div className="mt-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-2">Contact Information</h2>
            <div className="space-y-2">
              <div className="flex items-center">
                <span className="w-32 font-medium text-gray-600">Email:</span>
                <span className="text-gray-800">{admin.email}</span>
              </div>
              <div className="flex items-center">
                <span className="w-32 font-medium text-gray-600">Phone:</span>
                <span className="text-gray-800">{admin.phone}</span>
              </div>
            </div>
          </div>
          {/* About Section */}
          <div className="mt-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-2">About</h2>
            <p className="text-gray-700">{admin.bio}</p>
          </div>
        </div>
        </div>
      </div>
    </div>
  );
}
