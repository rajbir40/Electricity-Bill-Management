import React from 'react';
import Navbar from './Navbar';
import profile from '../assets/profile.jpg';
const About = () => {
  return (
    <div className="min-h-screen relative">
      <div
              className="fixed inset-0 z-0"
              style={{
                backgroundImage: `url(${profile})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                filter: 'brightness(0.7)',  
              }}
        />
        <div className='relative z-10'>
      <Navbar/>
      
      {/* Main Content */}
      <main className="container mx-auto px-6 py-12">
        {/* Hero Section */}
        <section className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 text-[#b0b0ab]">About PowerTrack</h1>
          <div className="max-w-3xl mx-auto">
            <p className="text-lg text-white mb-8">
              Simplifying electricity bill management for homes and businesses since 2020.
            </p>
          </div>
          <div className="h-1 w-32 bg-gradient-to-r from-blue-400 to-blue-600 mx-auto rounded-full"></div>
        </section>

        <section className="mb-20 grid md:grid-cols-1 gap-12 items-center">
          <div className="rounded-lg shadow-lg p-8 bg-[#b0b0ab]">
            <h2 className="text-3xl font-bold  mb-6 text-center">Our Mission</h2>
            <p className="text-gray-900 mb-4">
              At PowerTrack, we're committed to making energy consumption transparent, manageable, and efficient for everyone. We believe that with the right tools, individuals and businesses can take control of their electricity usage and make informed decisions that benefit both their finances and the environment.
            </p>
            <p className="text-gray-900">
              Our platform simplifies the complex world of utility bills, providing intuitive insights that empower you to optimize your energy usage and reduce costs without sacrificing comfort or productivity.
            </p>
          </div>
      
        </section>

        

        {/* Our Story */}
        <section className="mb-20">
          <div className="bg-[#b0b0ab] rounded-lg shadow-lg p-8">
            <h2 className="text-3xl font-bold mb-6 text-center">Our Story</h2>
            <div className="space-y-4 text-gray-900">
              <p>
                PowerTrack began in 2020 when our founders recognized a critical gap in the market: despite the increasing complexity of energy pricing and the growing focus on sustainability, most consumers still received electricity bills they couldn't easily understand or act upon.
              </p>
              <p>
                Starting with a small team of energy experts and software developers, we built a platform that transforms complicated billing data into actionable insights. What began as a simple bill tracking tool has evolved into a comprehensive energy management solution used by thousands of homes and businesses across the country.
              </p>
              <p>
                Today, our users save an average of 23% on their electricity costs while reducing their carbon footprint. We continue to innovate, adding new features and integrations that make energy management even more accessible and effective.
              </p>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="mb-20">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="bg-[#c68129] rounded-lg p-6 text-center text-white">
              <span className="block text-4xl font-bold mb-2">15K+</span>
              <span className="text-blue-100">Active Users</span>
            </div>
            <div className="bg-[#c68129] rounded-lg p-6 text-center text-white">
              <span className="block text-4xl font-bold mb-2">$2.5M</span>
              <span className="text-blue-100">Customer Savings</span>
            </div>
            <div className="bg-[#c68129] rounded-lg p-6 text-center text-white">
              <span className="block text-4xl font-bold mb-2">23%</span>
              <span className="text-blue-100">Avg. Bill Reduction</span>
            </div>
            <div className="bg-[#c68129] rounded-lg p-6 text-center text-white">
              <span className="block text-4xl font-bold mb-2">7+</span>
              <span className="text-blue-100">Utility Integrations</span>
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-10 text-center">What Our Users Say</h2>
          <div className="grid md:grid-cols-2 gap-8 ">
            <div className="bg-[#b0b0ab] p-8 rounded-lg shadow-lg relative">
              <div className="absolute -top-4 left-8 w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                <svg className="w-4 h-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M6.5 10c-.223 0-.437.034-.65.065.069-.232.14-.468.254-.68.114-.308.292-.575.469-.844.177-.269.4-.52.598-.759.748-.869 1.63-1.477 2.322-2.121.766-.729 1.201-1.246 1.201-1.246l.672.808c0 0-.471.534-1.207 1.312-.738.781-1.743 1.401-2.464 2.238-.65.764-1.194 1.614-1.194 2.653C6.5 13.15 7.88 14.5 9.5 14.5s3-1.35 3-3-1.38-3-3-3c-.525 0-1.022.13-1.465.345L7.04 8.42c.345-.315.708-.621 1.213-.876.445-.223 1.099-.46 1.747-.46.223 0 .45.03.67.07v-.21c-.223-.07-.449-.11-.67-.11-1.07 0-1.969.47-2.65.868-.652.38-1.211.835-1.642 1.21L5 8.175V13.5h1.5V10z" />
                  <path d="M16.5 10c-.223 0-.437.034-.65.065.069-.232.14-.468.254-.68.114-.308.292-.575.469-.844.177-.269.4-.52.598-.759.748-.869 1.63-1.477 2.322-2.121.766-.729 1.201-1.246 1.201-1.246l.672.808c0 0-.471.534-1.207 1.312-.738.781-1.743 1.401-2.464 2.238-.65.764-1.194 1.614-1.194 2.653 0 1.65 1.38 3 3 3s3-1.35 3-3-1.38-3-3-3c-.525 0-1.022.13-1.465.345l-.995-.425c.345-.315.708-.621 1.213-.876.445-.223 1.099-.46 1.747-.46.223 0 .45.03.67.07v-.21c-.223-.07-.449-.11-.67-.11-1.07 0-1.969.47-2.65.868-.652.38-1.211.835-1.642 1.21L15 8.175V13.5h1.5V10z" />
                </svg>
              </div>
              <p className="text-gray-900 mb-4 mt-4">
                PowerTrack completely changed how I manage my household budget. I've reduced my electricity bill by 30% in just three months by following their personalized recommendations.
              </p>
              <div className="flex items-center">
                <div className="mr-4 w-12 h-12 bg-blue-100 rounded-full"></div>
                <div>
                  <h4 className="font-bold text-gray-800">Robert Garcia</h4>
                  <p className="text-sm text-gray-500">Homeowner, San Diego</p>
                </div>
              </div>
            </div>
            
            <div className="bg-[#b0b0ab] p-8 rounded-lg shadow-lg relative">
              <div className="absolute -top-4 left-8 w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                <svg className="w-4 h-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M6.5 10c-.223 0-.437.034-.65.065.069-.232.14-.468.254-.68.114-.308.292-.575.469-.844.177-.269.4-.52.598-.759.748-.869 1.63-1.477 2.322-2.121.766-.729 1.201-1.246 1.201-1.246l.672.808c0 0-.471.534-1.207 1.312-.738.781-1.743 1.401-2.464 2.238-.65.764-1.194 1.614-1.194 2.653C6.5 13.15 7.88 14.5 9.5 14.5s3-1.35 3-3-1.38-3-3-3c-.525 0-1.022.13-1.465.345L7.04 8.42c.345-.315.708-.621 1.213-.876.445-.223 1.099-.46 1.747-.46.223 0 .45.03.67.07v-.21c-.223-.07-.449-.11-.67-.11-1.07 0-1.969.47-2.65.868-.652.38-1.211.835-1.642 1.21L5 8.175V13.5h1.5V10z" />
                  <path d="M16.5 10c-.223 0-.437.034-.65.065.069-.232.14-.468.254-.68.114-.308.292-.575.469-.844.177-.269.4-.52.598-.759.748-.869 1.63-1.477 2.322-2.121.766-.729 1.201-1.246 1.201-1.246l.672.808c0 0-.471.534-1.207 1.312-.738.781-1.743 1.401-2.464 2.238-.65.764-1.194 1.614-1.194 2.653 0 1.65 1.38 3 3 3s3-1.35 3-3-1.38-3-3-3c-.525 0-1.022.13-1.465.345l-.995-.425c.345-.315.708-.621 1.213-.876.445-.223 1.099-.46 1.747-.46.223 0 .45.03.67.07v-.21c-.223-.07-.449-.11-.67-.11-1.07 0-1.969.47-2.65.868-.652.38-1.211.835-1.642 1.21L15 8.175V13.5h1.5V10z" />
                </svg>
              </div>
              <p className="text-gray-900 mb-4 mt-4">
                As a small business owner, controlling overhead is crucial. PowerTrack has given us visibility into our energy usage patterns that we never had before, helping us save over $5,000 annually.
              </p>
              <div className="flex items-center">
                <div className="mr-4 w-12 h-12 bg-blue-100 rounded-full"></div>
                <div>
                  <h4 className="font-bold text-gray-800">Jennifer Kim</h4>
                  <p className="text-sm text-gray-500">Cafe Owner, Portland</p>
                </div>
              </div>
            </div>
          </div>
        </section>

      </main>
      </div>
    </div>
  );
};

export default About;