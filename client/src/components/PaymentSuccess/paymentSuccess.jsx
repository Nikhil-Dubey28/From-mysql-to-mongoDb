import React, { useEffect } from 'react'
import {useSearchParams} from 'react-router-dom'

const PaymentSuccess = () => {

    const searchQuery = useSearchParams()[0]

    const referenceNum = searchQuery.get("reference")

    useEffect(() => {
      if (referenceNum) {
          // Update localStorage to indicate user is now premium
          const userString = localStorage.getItem('user');
          if (userString) {
              const user = JSON.parse(userString);
              user.ispremiumuser = true;
              localStorage.setItem('user', JSON.stringify(user));
          }
      }
  }, [referenceNum]);

    
  return (
    <div>
        <h1>Order Successful!</h1>
        <p>
            Reference No: {referenceNum }
        </p>
    </div>
  )
}

export default PaymentSuccess