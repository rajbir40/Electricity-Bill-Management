import SignUpPage from './components/Signup';
import LoginPage from './components/Login';
import ForgotPassword from './components/ForgotPass';
import Home from './components/Home';
import {BrowserRouter, Routes, Route} from 'react-router-dom';
function App() {

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<SignUpPage/>}/>
          <Route path='/login' element={<LoginPage/>}/>
          <Route path='/home' element={<Home/>}/>
          <Route path='/forgot-password' element={<ForgotPassword/>}/>
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
