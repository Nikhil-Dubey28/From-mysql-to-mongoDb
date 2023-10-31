import React, { useState } from 'react';
import Navbar from '../Navbar/Navbar';
import './report.css'
import axios from 'axios';
import DatePicker from 'react-datepicker'

const Report = () => {

  const [daily , setDaily] = useState([])
  const [monthly,setMonthly] =useState([])
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedMonth,setSelectedMonth] = useState(null)

  let totalAmount = 0

  const handleSubmitDaily = async (e) => {
    e.preventDefault()
try {
  const token = localStorage.getItem('token')

  const response = await axios.post('http://localhost:3000/api/premium/dailyreports',{date: selectedDate},{
    headers : {
      Authorization :token
    }
  })
  setDaily(response.data)
  console.log(response)
}catch(err) {
console.log(err)
}
}



const handleSubmitMonth = async(e) => {
  e.preventDefault()
  try {
    const token = localStorage.getItem('token')

    const month = new Date(selectedMonth);
    const formattedMonth = `${(month.getMonth() + 1)
      .toString()
      .padStart(2, "0")}`;

  const response = await axios.post('http://localhost:3000/api/premium/monthlyreports',{month: formattedMonth},{
    headers : {
      Authorization :token
    }
  })
  setMonthly(response.data)
  console.log(response)
  }catch(err) {
    console.log(err)
  }
}
return (
    <>
      <Navbar />
      <div className="container table-responsive mt-4 p-3 d-flex bd-highlight" id="table">
  {/* Daily table Form */}
  <div className="ps-2 pe-5 py-1 ms-3 me-5 my-1 bd-highlight">
    <div className="my-1">
      <h3>DAILY REPORTS</h3>
    </div>
    <div>
      <form onSubmit={handleSubmitDaily}>
        <div className="mb-3">
          <label htmlFor="date" className="form-label"> Select Date</label>
          <input type="date" className="form-control" id="date" name='date' onChange={(e) => setSelectedDate(e.target.value)}/>
        </div>
        <button id="dateShowBtn" type="submit" className="btn btn-primary showBtn">Show</button>
      </form>
    </div>
  </div>

  <div className="p-2 flex-grow-1 bd-highlight">
    <table
      id="table1"
      className="table table-hover display"
      style={{ width: '100%' }}
    >
      {/* Daily table head */}
      <thead>
        <tr>
          <th scope="col">Date</th>
          <th scope="col">Category</th>
          <th scope="col">Description</th>
          <th scope="col">Amount</th>
        </tr>
      </thead>

      {/* Daily table body */}
      <tbody id="tbodyDailyId">
      {daily.length > 0 && daily.map(item => (
        <tr key={item.id}>
          
          <td>{item.date}</td>
          <td>{item.category}</td>
          <td>{item.description}</td>
          <td>{item.amount}</td>
          

        </tr>
          
      )) }

      </tbody>
      <tfoot id="tfootDailyId">
        <tr>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
        </tr>
      </tfoot>
    </table>
    
        {!daily.length && (
          <h3 className='text-center'>Nothing to show</h3>
        )}
  </div>
</div>


      <div className="container table-responsive mt-4 p-3 d-flex bd-highlight" id="table">
  <div className="px-2 py-1 ms-3 me-4 my-1 bd-highlight">
    <div className="my-1">
      <h3>MONTHLY REPORTS</h3>
    </div>
    <div>
      <form onSubmit={handleSubmitMonth}>
        <div className="mb-3">
          <label htmlFor="month" className="form-label">Select Month</label>
          {/* <input type="month" className="form-control" id="month" /> */}
          <DatePicker
                  id="month"
                  className="form-control"
                  dateFormat="MM-yyyy"
                  showMonthYearPicker
                  selected={selectedMonth} // Provide the selectedDate state here
                  onChange={(month) => setSelectedMonth(month)} // Handle date change
                />
        </div>
        <button id="monthShowBtn" type="submit" className="btn btn-primary showBtn">Show</button>
      </form>
    </div>
  </div>
  <div className="p-2 flex-grow-1 bd-highlight">
    <table
      id="table2"
      className="table table-hover display"
      style={{ width: '100%' }}
    >
      <thead>
        <tr>
          <th scope="col">Date</th>
          <th scope="col">Category</th>
          <th scope="col">Description</th>
          <th scope="col">Amount</th>
        </tr>
      </thead>
      <tbody id="tbodyMonthlyId">
      {monthly.length > 0 && monthly.map(item => (
        <tr key={item.id}>
          
          <td>{item.date}</td>
          <td>{item.category}</td>
          <td>{item.description}</td>
          <td>{item.amount}</td>
         
        </tr>
      )) }
      </tbody>
      <tfoot id="tfootMonthlyId">
      </tfoot>
    </table>
    {!monthly.length && (
          <h3 className='text-center'>Nothing to show</h3>
        )}
  </div>
</div>

    </>
  );
}

export default Report;
