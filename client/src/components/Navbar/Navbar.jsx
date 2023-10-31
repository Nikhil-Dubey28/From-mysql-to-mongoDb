import React , {useEffect, useState} from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCrown } from '@fortawesome/free-solid-svg-icons'
import './navbar.css'
import axios from 'axios'

const Navbar = () => {

    const [isPremium, setIsPremium] = useState(false)
    const [showBuy, setShowBuy] = useState(true)
  const navigate = useNavigate();

  useEffect(() => {
    // const token = localStorage.getItem('token');

      const userString = localStorage.getItem('user');
      const user = JSON.parse(userString);
      setIsPremium(user.ispremiumuser);
      setShowBuy(!user.ispremiumuser);
  },[])

  const handleLogout = () => {

    localStorage.getItem('user');
    localStorage.getItem('token');

    localStorage.removeItem('user');
    localStorage.removeItem('token');

    navigate('/login')
  }

  const handleBuy = async (e) => {
    const userString = localStorage.getItem('user')
    const user = JSON.parse(userString)

    const token = localStorage.getItem('token')
    const { data: { key } } = await axios.get('http://localhost:3000/api/getkey')
    //  const {data : {order}} = await axios.post('http://localhost:3000/api/checkout',{
    //   amount 

    //  })
    const response = await axios.post('http://localhost:3000/api/checkout', {}, {
      headers: {
        Authorization: token
      }
    })
    console.log(response)
    const { data: { order } } = response
    const options = {
      key: key, // Enter the Key ID generated from the Dashboard
      amount: "50000", // Amount is in currency subunits. Default currency is INR. Hence, 50000 refers to 50000 paise
      currency: "INR",
      name: user.name,
      description: "Test Transaction",
      image: "https://example.com/your_logo",
      order_id: order.id, //This is a sample Order ID. Pass the `id` obtained in the response of Step 1
      // callback_url : "http://localhost:3000/api/paymentverification",
      handler: async function (response) {



        const res = await axios.post('http://localhost:3000/api/updatetransactionstatus', {
          order_id: options.order_id,
          payment_id: response.razorpay_payment_id,
          signature_id: response.razorpay_signature_id,
        }, { headers: { Authorization: token } })


        alert('You are a Premium User')
        setShowBuy(false)
        setIsPremium(true)
        localStorage.setItem('token', res.data.token)

        const userStr = localStorage.getItem('user');
        const userObj = JSON.parse(userStr);
        userObj.ispremiumuser = true; 

        const updatedUserString = JSON.stringify(userObj);
        localStorage.setItem('user', updatedUserString);








      },
      prefill: {
        name: "Gaurav Kumar",
        email: "gaurav.kumar@example.com",
        contact: "9000090000"
      },
      notes: {
        address: "Razorpay Corporate Office"
      },
      theme: {
        "color": "#3399cc"
      }
    };
    const razor = new window.Razorpay(options);


    razor.open();


    razor.on('payment.failed', function (response) {
      console.log(response)
      alert('something went wrong')
    })
  }


  const handleLeader = () => {
    if(!isPremium){
        alert('You need to buy premium to access this feature!')
    }else{
        navigate('/leaderboard')
    }
  }

  const handleReport = () => {
    if(!isPremium) {
        alert('You need to buy premium to access this feature!')
    }else{
        navigate('/report')
    }
  }
  
  const handleDownload = () => {
    if(!isPremium) {
      alert('You need to buy premium to access this feature')
    }else{
      navigate('/download')
    }
  }

  return (

    <nav className="navbar navbar-expand-lg navbar-light bg-light main-nav">
    <div className="container-fluid">
      <span className="navbar-brand">
        <h1 className="fw-light expense-title mx-3">
          <a href="/" className='text-decoration-none' style={{color: "black"}}><span style={{ color: "teal" }}>E</span>xpense <span style={{ color: "teal" }}>T</span>racker</a>
        </h1>
      </span>
      <button
        className="navbar-toggler"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#navbarNav"
        aria-controls="navbarNav"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span className="navbar-toggler-icon"></span>
      </button>
      <div className="collapse navbar-collapse justify-content-end" id="navbarNav">
        <ul className="navbar-nav">
          <li className="nav-item">
            <button className="btn rounded-5 text-dark pt-2 px-3 mb-2 me-5 btn-underline" onClick={handleLeader}>Leaderboard <FontAwesomeIcon icon={faCrown} /></button>
          </li>
          <li className="nav-item">
            <button className="btn rounded-5 text-dark pt-2 px-3 mb-2 me-5 btn-underline" onClick={handleReport}>Reports <FontAwesomeIcon icon={faCrown} /></button>
          </li>
          <li className="nav-item">
            <button className="btn rounded-5 text-dark pt-2 px-3 mb-2 me-5 btn-underline" onClick={handleDownload}>Download <FontAwesomeIcon icon={faCrown} /></button>
          </li>
          {!isPremium && (
            <li className="nav-item">
            <button className="btn btn-outline-dark rounded-5 text-warning pt-2 px-3 mb-2" onClick={handleBuy}>Buy Premium <FontAwesomeIcon icon={faCrown} /></button>
          </li>
          ) }
          <li className="nav-item">
            <button className="btn btn-outline-dark text-danger rounded-5 py-2 px-4 mx-2" onClick={() => handleLogout()}>Logout</button>
          </li>
        </ul>
      </div>
    </div>
  </nav>
  );
};

export default Navbar;
