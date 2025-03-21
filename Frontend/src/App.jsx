import SignUpPage from './components/Signup';
import LoginPage from './components/Login';
import {BrowserRouter, Routes, Route} from 'react-router-dom';
function App() {

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<SignUpPage/>}/>
          <Route path='/login' element={<LoginPage/>}/>
        </Routes>
      </BrowserRouter>
      <div className="text-center">Hello</div>
    </>
  )
}

export default App
