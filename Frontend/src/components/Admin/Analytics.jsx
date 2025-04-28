import { useState, useEffect } from "react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  AreaChart,
  Area,
} from "recharts";
import { Calendar, Download, Plus, Eye, Edit } from "lucide-react";
import axios from "axios";
const host = import.meta.env.VITE_BACKEND_HOST;

// Sample data for charts
const revenueData = [
  { name: "Apr 1", revenue: 4000 },
  { name: "Apr 2", revenue: 3000 },
  { name: "Apr 3", revenue: 5000 },
  { name: "Apr 4", revenue: 4500 },
  { name: "Apr 5", revenue: 6000 },
  { name: "Apr 6", revenue: 5500 },
  { name: "Apr 7", revenue: 7000 },
  { name: "Apr 8", revenue: 6500 },
  { name: "Apr 9", revenue: 8000 },
  { name: "Apr 10", revenue: 7500 },
];

const consumptionData = [
  { name: "Apr 1", residential: 240, commercial: 180 },
  { name: "Apr 2", residential: 300, commercial: 200 },
  { name: "Apr 3", residential: 280, commercial: 220 },
  { name: "Apr 4", residential: 320, commercial: 240 },
  { name: "Apr 5", residential: 290, commercial: 250 },
  { name: "Apr 6", residential: 330, commercial: 230 },
  { name: "Apr 7", residential: 350, commercial: 270 },
  { name: "Apr 8", residential: 320, commercial: 240 },
  { name: "Apr 9", residential: 340, commercial: 260 },
  { name: "Apr 10", residential: 360, commercial: 280 },
];

const paymentStatusData = [
  { name: "Paid", value: 68, fill: "#36D399" },
  { name: "Pending", value: 24, fill: "#FBBD23" },
  { name: "Overdue", value: 8, fill: "#F87272" },
];

const userGrowthData = [
  { name: "Jan", users: 400 },
  { name: "Feb", users: 600 },
  { name: "Mar", users: 800 },
  { name: "Apr", users: 1050 },
];

export default function Analytics() {
  const [monthlyRevnue, setMontlyRevenue] = useState([]);
  const [paymentReport, setPaymentReport] = useState({});
  const [consumptionData, setConsumptionData] = useState({});
  const [totalUnits, setTotalUnits] = useState(0);

  // const paymentStatusData = [
  //   { name: 'Paid', value: paymentReport.paid, fill: '#36D399' },
  //   { name: 'Pending', value: paymentReport.paid, fill: '#FBBD23' },
  //   { name: 'Overdue', value: paymentReport.paid, fill: '#F87272' },
  // ];

  const fetchRevenue = async () => {
    try {
      const response = await axios.get(`${host}/api/meter/revenue`);
      setMontlyRevenue(response.data);
      console.log(response.data);
    } catch (error) {
      console.error("Error fetching meters:", error);
    }
  };

  const fetchconsumptiondetails = async () => {
    try {
      const response = await axios.get(`${host}/api/meter/consumption`);
      setConsumptionData(response.data);
      console.log(response.data);
      const units = response.data;
      const totalUnits =
        Number(units.residential) +
        Number(units.industrial) +
        Number(units.commercial);
      setTotalUnits(totalUnits);
    } catch (error) {
      console.error("Error fetching meters:", error);
    }
  };

  const fetchPaymentReport = async () => {
    try {
      const response = await axios.get(`${host}/api/payment/report`);
      setPaymentReport(response.data);
      console.log(response.data);
      const value = response.data;
      const total =
        Number(value.paid) + Number(value.unpaid) + Number(value.overdue);
      console.log(total);
      paymentStatusData[0].value = Math.floor((value.paid / total) * 100);
      paymentStatusData[1].value = Math.floor((value.unpaid / total) * 100);
      paymentStatusData[2].value = Math.floor((value.overdue / total) * 100);
    } catch (error) {
      console.error("Error fetching meters:", error);
    }
  };

  useEffect(() => {
    fetchRevenue();
    fetchPaymentReport();
    fetchconsumptiondetails();
  }, []);

  const scaledMonthlyRevenue = monthlyRevnue.map((item) => ({
    ...item,
    total_amount: item.total_amount / 1000,
  }));

  return (
    <div className="p-6 bg-gray-100">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Reports & Analytics</h1>
        <div className="flex gap-2">
          <button className="bg-white border border-gray-300 rounded-lg px-4 py-2 flex items-center gap-2 text-sm font-medium">
            <Calendar size={16} />
            {new Date().toLocaleDateString()}          
          </button>
          {/* <button className="bg-blue-600 text-white rounded-lg px-4 py-2 flex items-center gap-2 text-sm font-medium">
            <Download size={16} />
            Export Report
          </button> */}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-bold mb-4">Monthly Revenue</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={monthlyRevnue}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month"/>
                <YAxis />
                <Tooltip formatter={(value) => [`$${value}`, 'Revenue']} />
                <Area type="monotone" dataKey="total_amount" stroke="#570DF8" fill="#570DF8" fillOpacity={0.2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div> */}

        {/* <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-bold mb-4">Consumption Overview</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={consumptionData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip formatter={(value) => [`${value} kWh`, '']} />
                <Legend />
                <Line type="monotone" dataKey="residential" stroke="#570DF8" strokeWidth={2} />
                <Line type="monotone" dataKey="commercial" stroke="#F000B8" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div> */}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-bold mb-4">Payment Status</h2>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={paymentStatusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={2}
                  dataKey="value"
                  // Using the fill property directly from the data
                />
                <Tooltip formatter={(value) => [`${value}%`, ""]} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4">
            {paymentStatusData.map((item, index) => (
              <div
                key={index}
                className="flex items-center justify-between mb-2"
              >
                <div className="flex items-center">
                  <div
                    className="w-4 h-4 rounded-full mr-2"
                    style={{ backgroundColor: item.fill }}
                  ></div>
                  <span>{item.name}</span>
                </div>
                <span className="font-semibold">{item.value}%</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-bold mb-4">User Growth</h2>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={userGrowthData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip formatter={(value) => [value, "Users"]} />
                <Line
                  type="monotone"
                  dataKey="users"
                  stroke="#570DF8"
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 grid grid-cols-2 gap-4">
            <div className="bg-gray-100 p-4 rounded-lg">
              <div className="text-sm text-gray-500">New Users</div>
              <div className="text-2xl font-bold text-blue-600">237</div>
              <div className="text-xs text-gray-500">This month</div>
            </div>
            <div className="bg-gray-100 p-4 rounded-lg">
              <div className="text-sm text-gray-500">Growth</div>
              <div className="text-2xl font-bold text-green-500">+5.4%</div>
              <div className="text-xs text-gray-500">vs. last month</div>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-bold mb-4">Consumption Categories</h2>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={[
                  {
                    name: "Categories",
                    residential: Math.floor(
                      (consumptionData.residential / totalUnits) * 100
                    ),
                    commercial: Math.floor(
                      (consumptionData.commercial / totalUnits) * 100
                    ),
                    industrial: Math.floor(
                      (consumptionData.industrial / totalUnits) * 100
                    ),
                  },
                ]}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip formatter={(value) => [`${value}%`, ""]} />
                <Legend />
                <Bar dataKey="residential" fill="#3B82F6" />
                <Bar dataKey="commercial" fill="#F59E0B" />
                <Bar dataKey="industrial" fill="#10B981" />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 flex gap-4">
            <div className="bg-gray-100 p-4 rounded-lg w-full max-w-xs">
              <div className="text-sm text-gray-500">Residential</div>
              <div className="text-2xl font-bold text-blue-600">62%</div>
            </div>
            <div className="bg-gray-100 p-4 rounded-lg w-full max-w-xs">
              <div className="text-sm text-gray-500">Commercial</div>
              <div className="text-2xl font-bold text-yellow-600">28%</div>
            </div>
            <div className="bg-gray-100 p-4 rounded-lg w-full max-w-xs">
              <div className="text-sm text-gray-500">Industrial</div>
              <div className="text-2xl font-bold text-green-600">10%</div>
            </div>
          </div>
        </div>
      </div>

      {/* <div className="bg-white p-6 rounded-lg shadow">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-bold">Saved Reports</h2>
          {/* <button className="bg-white border border-gray-300 rounded-lg px-3 py-1 flex items-center gap-1 text-sm font-medium">
            <Plus size={16} />
            Create New Report
          </button> */}
        {/* </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 text-left">
                <th className="px-4 py-3">Report Name</th>
                <th className="px-4 py-3">Type</th>
                <th className="px-4 py-3">Created</th>
                <th className="px-4 py-3">Last Run</th>
                <th className="px-4 py-3">Schedule</th>
                <th className="px-4 py-3">Actions</th> */}
              {/* </tr>
            </thead>
            <tbody>
              <tr className="border-b border-gray-200">
                <td className="px-4 py-3">Monthly Revenue Summary</td>
                <td className="px-4 py-3">Financial</td>
                <td className="px-4 py-3">Mar 15, 2025</td>
                <td className="px-4 py-3">Apr 1, 2025</td>
                <td className="px-4 py-3">Monthly</td>
                <td className="px-4 py-3">
                  <div className="flex gap-2">
                    <button className="text-gray-500 hover:text-blue-600">
                      <Eye size={16} />
                    </button>
                    <button className="text-gray-500 hover:text-blue-600">
                      <Download size={16} />
                    </button>
                    <button className="text-gray-500 hover:text-blue-600">
                      <Edit size={16} />
                    </button>
                  </div>
                </td>
              </tr>
              <tr className="border-b border-gray-200 bg-gray-50">
                <td className="px-4 py-3">User Consumption Patterns</td>
                <td className="px-4 py-3">Analytics</td>
                <td className="px-4 py-3">Feb 10, 2025</td>
                <td className="px-4 py-3">Apr 5, 2025</td>
                <td className="px-4 py-3">Weekly</td>
                <td className="px-4 py-3">
                  <div className="flex gap-2">
                    <button className="text-gray-500 hover:text-blue-600">
                      <Eye size={16} />
                    </button>
                    <button className="text-gray-500 hover:text-blue-600">
                      <Download size={16} />
                    </button>
                    <button className="text-gray-500 hover:text-blue-600">
                      <Edit size={16} /> */}
                    {/* </button>
                  </div>
                </td>
              </tr>
              <tr className="border-b border-gray-200">
                <td className="px-4 py-3">Overdue Payments Analysis</td>
                <td className="px-4 py-3">Compliance</td>
                <td className="px-4 py-3">Mar 22, 2025</td>
                <td className="px-4 py-3">Apr 9, 2025</td>
                <td className="px-4 py-3">Daily</td>
                <td className="px-4 py-3">
                  <div className="flex gap-2">
                    <button className="text-gray-500 hover:text-blue-600">
                      <Eye size={16} />
                    </button>
                    <button className="text-gray-500 hover:text-blue-600">
                      <Download size={16} />
                    </button>
                    <button className="text-gray-500 hover:text-blue-600">
                      <Edit size={16} />
                    </button>
                  </div> */}
                {/* </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div> */} 
    </div>
  );
}
