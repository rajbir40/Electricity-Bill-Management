import { useEffect } from 'react';
import SignUpPage from './components/Signup';
import LoginPage from './components/Login';
import ForgotPassword from './components/ForgotPass';
import Home from './components/Home';
import About from './components/About';
import AdminHome from './components/AdminHome';
import Profile from './components/Profile';
import AdminProfile from './components/AdminProfile';
import FindUser from './components/FindUser';
import FindMeter from './components/FindMeter';
import GenerateBill from './components/GenerateBill';
import Bill from './components/Bill';
import Receipt from './components/Receipt';
import BillPage from './components/BillPage';
import {BrowserRouter, Routes, Route , Navigate} from 'react-router-dom';
import { authStore } from './store/auth.store';
import PaymentHistory from './components/PaymentHistory';
import BillingHistory from './components/BillingHistory';
import {Loader} from "lucide-react";
import AdminDashboard from './components/Admin/AdminDashboard';

function App() {

  const {authUser,checkAuth,isCheckingAuth,isAdmin} = authStore();
  useEffect(() => {
    checkAuth();
  },[checkAuth])

  if(isCheckingAuth && !authUser){
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader className="animate-spin" />
      </div>
    );
  }

  console.log(authUser);
  console.log(isAdmin);
  console.log(isCheckingAuth);

  return (
    <>
      <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          <Route path='/login' element={<LoginPage/>}/>
          <Route path='/forgot-password' element={<ForgotPassword/>}/>
          <Route path='/about' element={<About/>}/>
          <Route path="/signup" element={<SignUpPage/>} />
          <Route path='/home' element={<Home/>}/>
          <Route path='/admin/dashboard' element={<AdminDashboard/> } />
          <Route path='/' element={<Home/>}/>

          <Route path='/receipt' element={<Receipt/>}/>
          {/* Authenticated Routes */}
          <Route path='/profile' element={authUser ? <Profile/> : <Navigate to="/login" />}/>
          <Route path='/admin/home' element={isAdmin ? <AdminHome/> : <Navigate to="/login" />}/>
          <Route path='/admin/profile' element={isAdmin ? <AdminProfile/> : <Navigate to="/login" />}/>
          <Route path='/admin/find-user' element={isAdmin ? <FindUser/> : <Navigate to="/login" />}/>
          <Route path='/admin/find-meter' element={isAdmin ? <FindMeter/>: <Navigate to="/login" />}/>
          <Route path='/admin/find-meter' element={isAdmin ? <FindMeter/> : <Navigate to="/login" />}/>
          <Route path='/admin/generate-bill' element={isAdmin ? <GenerateBill/> : <Navigate to="/login" />}/>
          {/* <Route path='/admin/dashboard' element={isAdmin ? <AdminDashboard/> : <Navigate to="/login" />}/> */}
          <Route path='/bill' element={authUser ? <Bill/> : <Navigate to="/login" />}/>
          <Route path='/admin/bill-page' element={isAdmin ? <BillPage/> : <Navigate to="/login" />}/>
          <Route path='/payment-history' element={authUser ? <PaymentHistory/> : <Navigate to="/login" />}/>
          <Route path='/billing-history' element={authUser ? <BillingHistory/> : <Navigate to="/login" />}/>
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App;
