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

function App() {

  const {authUser,checkAuth,isCheckingAuth} = authStore();
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

  return (
    <>
      <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          <Route path='/login' element={<LoginPage/>}/>
          <Route path='/forgot-password' element={<ForgotPassword/>}/>
          <Route path='/about' element={<About/>}/>
          <Route path='/admin/bill-page' element={<BillPage/>}/>
          <Route path="/" element={<SignUpPage/>} />

          <Route path='/receipt' element={<Receipt/>}/>
          {/* Authenticated Routes */}
          <Route path='/home' element={authUser ? <Home/> : <Navigate to="/" />}/>
          <Route path='/profile' element={authUser ? <Profile/> : <Navigate to="/" />}/>
          <Route path='/admin/home' element={authUser ? <AdminHome/> : <Navigate to="/" />}/>
          <Route path='/admin/profile' element={authUser ? <AdminProfile/> : <Navigate to="/" />}/>
          <Route path='/admin/find-user' element={authUser ? <FindUser/> : <Navigate to="/" />}/>
          <Route path='/admin/find-meter' element={authUser ? <FindMeter/>: <Navigate to="/" />}/>
          <Route path='/admin/find-meter' element={authUser ? <FindMeter/> : <Navigate to="/" />}/>
          <Route path='/admin/generate-bill' element={authUser ? <GenerateBill/> : <Navigate to="/" />}/>
          <Route path='/bill' element={<Bill/>}/>
          <Route path='/payment-history' element={authUser ? <PaymentHistory/> : <Navigate to="/" />}/>
          <Route path='/billing-history' element={authUser ? <BillingHistory/> : <Navigate to="/" />}/>
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App;
