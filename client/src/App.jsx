import './App.css'
import {BrowserRouter as Router,Route,Routes,Navigate } from 'react-router-dom'
import Signup from './components//Signup/signup'
import Login from './components/Login/login'
import Expenses from './components/Expenses/expenses'
import axios from 'axios'
import PaymentSuccess from './components/PaymentSuccess/paymentSuccess'
import ForgotPassword from './components/ForgotPassword/forgotPassword'
import Report from './components/Report/Report'
import Leaderboard from './components/Leaderboard/Leaderboard'
import Edit from './components/Edit/Edit'
import Download from './components/Download/Download'


const ProtectedRoute = ({ element, ...rest }) => {
  const token = localStorage.getItem('token');
  if (token) {
    return element;
  } else {
    return <Navigate to="/login" />;
  }
};

function App() {
  // axios.interceptors.request.use(
  //   (config) => {
  //     const token = localStorage.getItem('token');
  //     if (token) {
  //       config.headers.Authorization = token;
  //     }
  //     return config;
  //   },
  //   (error) => {
  //     return Promise.reject(error);
  //   }
  // );

  return (
    <Router>
      <Routes>
        {/* <Route path= '/' element ={<h1>Home Page!</h1>}/> */}
        <Route path= '/paymentsuccess' element ={<PaymentSuccess />}/>
        {/* <Route path= '/expenses' element ={<Expenses />} /> */}
        <Route path="/" element={<ProtectedRoute element={<Expenses />} />} />
        <Route path='/signup' element = {<Signup />} />
        <Route path='/login' element = {<Login />}  />
        <Route path='/forgotpassword' element = {<ForgotPassword/>}  />
        <Route path='/report' element = {<ProtectedRoute element = {<Report/>} />}  />
        <Route path='/leaderboard' element = {<ProtectedRoute element = {<Leaderboard />}/>}  />
        <Route path='/download' element = {<ProtectedRoute element = {<Download />}/>}  />
        <Route path='/edit/:id' element = {<ProtectedRoute element = {<Edit />}/>}  />
      </Routes>
    </Router>
  )
}

export default App
