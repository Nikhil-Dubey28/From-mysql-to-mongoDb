import React from 'react'

const resetPassword = () => {
  return (
    <div className='container d-flex justify-content-center align-items-center vh-100'>
        <div className='row justify-content-center align-items-center'>
        <div className='form-container'>
        <form className="p-5 bg-light" onSubmit={handleSubmit}>
        <div className="mb-3">
                <label htmlFor="newpassword" className="form-label">Enter new password:</label>
                <input type="password" className="form-control" id="newpassword" placeholder="Enter password" name='newpassword' required onChange={handleEmailChange} />
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

export default resetPassword

