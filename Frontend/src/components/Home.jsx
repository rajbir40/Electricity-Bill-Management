import React from 'react';
import { Link } from 'react-router-dom';
import { 
  ArrowRight, Shield, CreditCard, Calendar, Clock, 
  Bell, BarChart3, CheckCircle, Smartphone, Lock, Send
} from 'lucide-react';
import { authStore } from '../store/auth.store';
import profile from '../assets/profile.jpg'; // Import the background image

export default function LandingPage() {
  const { authUser } = authStore();
  
  // Card wrapper component similar to Profile page
  const CardWrapper = ({ header, children }) => (
    <div className="relative rounded-lg shadow-xl overflow-hidden bg-white/50 backdrop-blur-md mt-4">
      {header && (
        <div className="px-6 py-4" style={{ backgroundColor: '#d0d0ab' }}>
          {header}
        </div>
      )}
      <div className="p-6">
        {children}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen relative">
      {/* Background image with overlay */}
      <div
        className="fixed inset-0 z-0"
        style={{
          backgroundImage: `url(${profile})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          filter: 'brightness(0.7)',
        }}
      />
      <div className="relative z-10">
        {/* Navbar */}
        <nav className="bg-white/80 backdrop-blur-md shadow-sm">
          <div className="container mx-auto px-4 py-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-2">
                <Shield className="h-8 w-8 text-blue-600" />
                <span className="text-xl font-bold text-gray-800">SmartBill</span>
              </div>
              <div className="hidden md:flex space-x-8">
                <a href="#features" className="text-gray-600 hover:text-blue-600 transition-colors">Features</a>
                <a href="#how-it-works" className="text-gray-600 hover:text-blue-600 transition-colors">How It Works</a>
                <a href="#contact" className="text-gray-600 hover:text-blue-600 transition-colors">Contact</a>
              </div>
              {authUser ? (
                <Link
                to="/profile"
                className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors"
                >
                  Profile
                </Link>
              ) : (
                <div className="flex space-x-4">
                  <Link to="/login" className="px-4 py-2 rounded-lg text-blue-600 border border-blue-600 hover:bg-blue-50 transition-colors">
                    Log In
                  </Link>
                  <Link to="/signup" className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors">
                    Register
                  </Link>
                </div>
              )}
            </div>
          </div>
        </nav>

        {/* Hero Section */}
        <section className="py-16 md:py-24">
          <div className="container mx-auto px-4">
            <CardWrapper>
              <div className="flex flex-col md:flex-row items-center">
                <div className="w-full md:w-1/2 md:pr-12 mb-12 md:mb-0">
                  <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6 leading-tight">
                    Manage Your Electricity Bills. <span className="text-blue-600">Simple, Secure, Smart.</span>
                  </h1>
                  <p className="text-lg text-gray-600 mb-8">
                    Check your bills, get notified, and pay with ease—anytime, anywhere. 
                    Take control of your electricity usage with our intuitive dashboard.
                  </p>
                  
                  <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                    <Link
                      to="/signup"
                      className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-md font-medium"
                    >
                      Get Started Now
                    </Link>
                    <Link
                      to="/login"
                      className="px-8 py-3 bg-transparent text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50 transition-colors font-medium"
                    >
                      Log In
                    </Link>
                  </div>
                </div>
                <div className="w-full md:w-1/2">
                  <div className="bg-white/70 backdrop-blur-md p-6 rounded-xl shadow-xl">
                    <h3 className="text-xl font-semibold text-gray-800 mb-4">Why Choose SmartBill?</h3>
                    <ul className="space-y-3">
                      <li className="flex items-center">
                        <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                        <span>Secure OTP-based authentication</span>
                      </li>
                      <li className="flex items-center">
                        <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                        <span>Easy bill tracking and payments</span>
                      </li>
                      <li className="flex items-center">
                        <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                        <span>Smart notifications and reminders</span>
                      </li>
                      <li className="flex items-center">
                        <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                        <span>Detailed usage analytics</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </CardWrapper>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-16">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-[#d0d0ab] mb-4">Key Features</h2>
              <p className="text-white max-w-2xl mx-auto">
                Our electricity billing system is designed to make bill management 
                simple, secure, and hassle-free for consumers and administrators alike.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                { icon: <Lock className="h-10 w-10 text-blue-600" />, title: "OTP-Secured Login", description: "Secure access with one-time passwords sent directly to your registered mobile number." },
                { icon: <CreditCard className="h-10 w-10 text-blue-600" />, title: "Instant Bill Payments", description: "Pay your bills securely online with multiple payment methods and instant confirmation." },
                { icon: <BarChart3 className="h-10 w-10 text-blue-600" />, title: "Usage Analytics", description: "Track your electricity consumption patterns with intuitive visual charts and reports." },
                { icon: <Bell className="h-10 w-10 text-blue-600" />, title: "SMS/Email Reminders", description: "Never miss a payment with automatic notifications before due dates." },
                { icon: <Calendar className="h-10 w-10 text-blue-600" />, title: "Billing History", description: "Access your complete billing history and download statements anytime." },
                { icon: <Clock className="h-10 w-10 text-blue-600" />, title: "Late Fee Tracker", description: "Stay informed about potential late fees and avoid unnecessary charges." },
              ].map((feature, index) => (
                <CardWrapper key={index}>
                  <div className="mb-4">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </CardWrapper>
              ))}
            </div>
          </div>
        </section>

        {/* How it Works Section */}
        <section id="how-it-works" className="py-16">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-[#d0d0ab] mb-4">How It Works</h2>
              <p className="text-white max-w-2xl mx-auto">
                Getting started with SmartBill is simple. Just follow these three easy steps.
              </p>
            </div>

            <div className="flex flex-col md:flex-row justify-between items-start">
              {[
                { number: 1, icon: <Smartphone className="h-12 w-12 text-blue-600" />, title: "Login with OTP", description: "Securely log in using the OTP sent to your registered mobile number or email." },
                { number: 2, icon: <CreditCard className="h-12 w-12 text-blue-600" />, title: "View Your Current Bill", description: "Check your latest bill details, due date, and consumption patterns." },
                { number: 3, icon: <CheckCircle className="h-12 w-12 text-blue-600" />, title: "Pay & Get Receipt", description: "Make a payment using your preferred method and receive an instant digital receipt." },
              ].map((step, index) => (
                <div key={index} className="w-full md:w-1/3 mb-8 md:mb-0 px-4">
                  <CardWrapper>
                    <div className="flex flex-col items-center">
                      <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center mb-6">
                        <span className="text-xl font-bold text-blue-600">{step.number}</span>
                      </div>
                      <div className="mb-4">
                        {step.icon}
                      </div>
                      <h3 className="text-xl font-semibold text-gray-800 mb-2 text-center">{step.title}</h3>
                      <p className="text-gray-600 text-center">{step.description}</p>
                    </div>
                  </CardWrapper>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section id="contact" className="py-16">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row">
              <div className="w-full md:w-1/2 md:pr-12 mb-12 md:mb-0">
                <CardWrapper
                  header={<h2 className="text-xl font-bold">Get In Touch</h2>}
                >
                  <p className="text-gray-600 mb-8">
                    Have questions or need assistance with your account? 
                    Our support team is here to help you.
                  </p>
                  
                  <div className="space-y-4">
                    <div className="flex items-start">
                      <div className="mr-4 mt-1">
                        <Send className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-800">Email</h4>
                        <p className="text-gray-600">support@smartbill.com</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <div className="mr-4 mt-1">
                        <Smartphone className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-800">Phone</h4>
                        <p className="text-gray-600">+91 800-123-4567</p>
                      </div>
                    </div>
                  </div>
                </CardWrapper>
              </div>
              
              <div className="w-full md:w-1/2">
                <CardWrapper
                  header={<h3 className="text-xl font-bold">Send us a message</h3>}
                >
                  <form>
                    <div className="mb-4">
                      <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                      <input
                        type="text"
                        id="name"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Your name"
                      />
                    </div>
                    
                    <div className="mb-4">
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                      <input
                        type="email"
                        id="email"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Your email"
                      />
                    </div>
                    
                    <div className="mb-4">
                      <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                      <textarea
                        id="message"
                        rows={4}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="How can we help you?"
                      ></textarea>
                    </div>
                    
                    <button
                      type="submit"
                      className="w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Send Message
                    </button>
                  </form>
                </CardWrapper>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-gray-800/90 backdrop-blur-md text-white py-12">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <div>
                <div className="flex items-center space-x-2 mb-4">
                  <Shield className="h-6 w-6 text-blue-400" />
                  <span className="text-lg font-bold">SmartBill</span>
                </div>
                <p className="text-gray-400 text-sm">
                  Simplifying electricity bill management with secure, smart solutions.
                </p>
              </div>
              
              <div>
                <h4 className="font-semibold mb-4">Quick Links</h4>
                <ul className="space-y-2 text-gray-400">
                  <li><a href="#" className="hover:text-white transition-colors">Home</a></li>
                  <li><a href="#features" className="hover:text-white transition-colors">Features</a></li>
                  <li><a href="#how-it-works" className="hover:text-white transition-colors">How It Works</a></li>
                  <li><a href="#contact" className="hover:text-white transition-colors">Contact</a></li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-semibold mb-4">Support</h4>
                <ul className="space-y-2 text-gray-400">
                  <li><a href="#" className="hover:text-white transition-colors">Help Center</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">FAQs</a></li>
                  <li><a href="#contact" className="hover:text-white transition-colors">Contact Us</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-semibold mb-4">Connect With Us</h4>
                <div className="flex space-x-4">
                  <a href="#" className="hover:text-blue-400 transition-colors">
                    <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M22.675 0H1.325C.593 0 0 .593 0 1.325v21.351C0 23.407.593 24 1.325 24H12.82v-9.294H9.692v-3.622h3.128V8.413c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.795.143v3.24l-1.918.001c-1.504 0-1.795.715-1.795 1.763v2.313h3.587l-.467 3.622h-3.12V24h6.116c.73 0 1.323-.593 1.323-1.325V1.325C24 .593 23.407 0 22.677 0h-.002z" />
                    </svg>
                  </a>
                  <a href="#" className="hover:text-blue-400 transition-colors">
                    <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M23.954 4.569c-.885.389-1.83.654-2.825.775 1.014-.611 1.794-1.574 2.163-2.723-.951.555-2.005.959-3.127 1.184-.896-.959-2.173-1.559-3.591-1.559-2.717 0-4.92 2.203-4.92 4.917 0 .39.045.765.127 1.124C7.691 8.094 4.066 6.13 1.64 3.161c-.427.722-.666 1.561-.666 2.475 0 1.71.87 3.213 2.188 4.096-.807-.026-1.566-.248-2.228-.616v.061c0 2.385 1.693 4.374 3.946 4.827-.413.111-.849.171-1.296.171-.314 0-.615-.03-.916-.086.631 1.953 2.445 3.377 4.604 3.417-1.68 1.319-3.809 2.105-6.102 2.105-.39 0-.779-.023-1.17-.067 2.189 1.394 4.768 2.209 7.557 2.209 9.054 0 13.999-7.496 13.999-13.986 0-.209 0-.42-.015-.63.961-.689 1.8-1.56 2.46-2.548l-.047-.02z" />
                    </svg>
                  </a>
                  <a href="#" className="hover:text-blue-400 transition-colors">
                    <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm4.441 16.892c-2.102.144-6.784.144-8.883 0C5.282 16.736 5.017 15.622 5 12c.017-3.629.285-4.736 2.558-4.892 2.099-.144 6.782-.144 8.883 0C18.718 7.264 18.982 8.378 19 12c-.018 3.629-.285 4.736-2.559 4.892zM10 9.658l4.917 2.338L10 14.342V9.658z" />
                    </svg>
                  </a>
                  <a href="#" className="hover:text-blue-400 transition-colors">
                    <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                    </svg>
                  </a>
                </div>
              </div>
            </div>
            
            <div className="border-t border-gray-700 mt-8 pt-8 text-sm text-gray-400 text-center">
              <p>&copy; {new Date().getFullYear()} SmartBill. All rights reserved.</p>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}