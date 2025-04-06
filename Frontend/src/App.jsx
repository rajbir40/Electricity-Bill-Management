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
import {BrowserRouter, Routes, Route} from 'react-router-dom';
import BillPage from './components/BillPage';
function App() {

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<SignUpPage/>}/>
          <Route path='/login' element={<LoginPage/>}/>
          <Route path='/home' element={<Home/>}/>
          <Route path='/forgot-password' element={<ForgotPassword/>}/>
          <Route path='/about' element={<About/>}/>
          <Route path='/profile' element={<Profile/>}/>
          <Route path='/admin/home' element={<AdminHome/>}/>
          <Route path='/admin/profile' element={<AdminProfile/>}/>
          <Route path='/admin/find-user' element={<FindUser/>}/>
          <Route path='/admin/find-meter' element={<FindMeter/>}/>
          <Route path='/admin/find-meter' element={<FindMeter/>}/>
          <Route path='/admin/generate-bill' element={<GenerateBill/>}/>
          <Route path='/admin/bill-page' element={<BillPage/>}/>
          <Route path='/bill' element={<Bill/>}/>
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App;
