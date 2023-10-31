import React, {useState} from 'react'
import axios from 'axios'

const ForgotPassword = () => {
const [formData,setFormData] = useState({
    email: ''
})

const [isSuccess, setIsSuccess] = useState(false);
    const handleEmailChange = (event) => {
        setFormData(prevFormData => ({
          ...prevFormData,
          email: event.target.value
        }));
      }

      const handleSubmit = async (e) => {
        e.preventDefault()
        try {
          
         const res =  await axios.post('http://localhost:3000/api/password/forgotpassword',formData)
          console.log(res)
         if(res.status === 202){
          setIsSuccess(true)
         }else{
          throw new Error('something went wrong')
         }
         
        }catch(err){
          console.log(err)
        }

      }


  return (
    <div className='container d-flex justify-content-center align-items-center vh-100'>
        <div className='row justify-content-center align-items-center'>
        <div className='form-container'>
        <form className="p-5 bg-light" onSubmit={handleSubmit}>
        <div className="mb-3">
          <h3>Forgot Password</h3>
          <br />
                <p className='text-success'>You will get a link to reset your password at the specified email address.</p>
                <br />
                <label htmlFor="email" className="form-label">Please enter your Email:</label>
                <input type="email" className="form-control" id="email" placeholder="Enter email" name='email' required onChange={handleEmailChange} />
              </div>
              <div className='d-flex justify-content-center'>
                <button type="submit" className="btn btn-dark btn-block text-center mt-5 w-75 rounded-5 login-button">Continue</button>
                </div>
        </form>
        {isSuccess && (
           <div className='mt-3 text-success'>
           Password reset email sent successfully!
         </div>
        )}
        </div>
        </div>
    </div>
  )
}

export default ForgotPassword