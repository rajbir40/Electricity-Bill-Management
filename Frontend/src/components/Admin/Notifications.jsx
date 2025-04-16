import React from "react";
import { 
  Users, Settings,CheckCircle, AlertTriangle
} from 'lucide-react';
const host = import.meta.env.VITE_BACKEND_HOST;
import axios from 'axios';

const Notifications = () => {
  return (
    <div>
      <>
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Notifications Center</h1>
          <div className="flex gap-2">
            <button className="btn btn-outline btn-sm">
              <CheckCircle size={16} className="mr-2" />
              Mark All as Read
            </button>
            <button className="btn btn-outline btn-sm">
              <Settings size={16} className="mr-2" />
              Notification Settings
            </button>
          </div>
        </div>

        <div className="card bg-white shadow-lg mb-6">
          <div className="card-body">
            <div className="tabs">
              <a className="tab tab-bordered tab-active">All (12)</a>
              <a className="tab tab-bordered">Unread (5)</a>
              <a className="tab tab-bordered">System (3)</a>
              <a className="tab tab-bordered">Alerts (4)</a>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <div className="card bg-white shadow hover:shadow-md transition-shadow cursor-pointer">
            <div className="card-body p-4">
              <div className="flex items-start gap-4">
                <div className="avatar">
                  <div className="w-12 h-12 rounded-full bg-warning text-white flex items-center justify-center">
                    <AlertTriangle size={24} />
                  </div>
                </div>
                <div className="flex-1">
                  <div className="flex justify-between">
                    <h3 className="font-bold">Bill Payment Overdue</h3>
                    <span className="text-sm text-gray-500">2 hours ago</span>
                  </div>
                  <p className="text-gray-600 my-1">
                    User Robert Johnson (ID: 5423) has an overdue bill
                    (BILL-3243) of $245.00 that was due on April 5.
                  </p>
                  <div className="flex gap-2 mt-2">
                    <button className="btn btn-xs btn-outline">
                      View Details
                    </button>
                    <button className="btn btn-xs btn-outline">
                      Send Reminder
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="card bg-white shadow hover:shadow-md transition-shadow cursor-pointer">
            <div className="card-body p-4">
              <div className="flex items-start gap-4">
                <div className="avatar">
                  <div className="w-12 h-12 rounded-full bg-info text-white flex items-center justify-center">
                    <Users size={24} />
                  </div>
                </div>
                <div className="flex-1">
                  <div className="flex justify-between">
                    <h3 className="font-bold">New User Registration</h3>
                    <span className="text-sm text-gray-500">5 hours ago</span>
                  </div>
                  <p className="text-gray-600 my-1">
                    A new user Emma Wilson has registered and requires meter
                    assignment.
                  </p>
                  <div className="flex gap-2 mt-2">
                    <button className="btn btn-xs btn-outline">
                      View Profile
                    </button>
                    <button className="btn btn-xs btn-outline">
                      Assign Meter
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="card bg-white shadow hover:shadow-md transition-shadow cursor-pointer">
            <div className="card-body p-4">
              <div className="flex items-start gap-4">
                <div className="avatar">
                  <div className="w-12 h-12 rounded-full bg-success text-white flex items-center justify-center">
                    <CheckCircle size={24} />
                  </div>
                </div>
                <div className="flex-1">
                  <div className="flex justify-between">
                    <h3 className="font-bold">Bill Payment Received</h3>
                    <span className="text-sm text-gray-500">Yesterday</span>
                  </div>
                  <p className="text-gray-600 my-1">
                    User Alice Smith (ID: 4892) has successfully paid bill
                    (BILL-3244) of $87.20.
                  </p>
                  <div className="flex gap-2 mt-2">
                    <button className="btn btn-xs btn-outline">
                      View Payment
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="card bg-white shadow hover:shadow-md transition-shadow cursor-pointer">
            <div className="card-body p-4">
              <div className="flex items-start gap-4">
                <div className="avatar">
                  <div className="w-12 h-12 rounded-full bg-error text-white flex items-center justify-center">
                    <AlertTriangle size={24} />
                  </div>
                </div>
                <div className="flex-1">
                  <div className="flex justify-between">
                    <h3 className="font-bold">System Maintenance</h3>
                    <span className="text-sm text-gray-500">3 days ago</span>
                  </div>
                  <p className="text-gray-600 my-1">
                    Scheduled maintenance will be performed on April 15, 2025,
                    from 1:00 AM to 3:00 AM EST. The system may be temporarily
                    unavailable during this time.
                  </p>
                  <div className="flex gap-2 mt-2">
                    <button className="btn btn-xs btn-outline">
                      View Details
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </>
    </div>
  );
};

export default Notifications;
