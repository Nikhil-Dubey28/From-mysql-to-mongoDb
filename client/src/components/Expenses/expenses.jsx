import React, { useState, useEffect, useRef } from 'react';
import Login from '../Login/login';
import 'bootstrap/dist/css/bootstrap.min.css';
import ReactPaginate from 'react-paginate'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCrown } from '@fortawesome/free-solid-svg-icons';
import { faFire } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import './expenses.css';
import { useNavigate } from 'react-router-dom';
import Navbar from '../Navbar/Navbar';


const Expenses = () => {
  const [showEdit, setShowEdit] = useState(true)
  
  const [expenses, setExpenses] = useState([]);
  const [editState , setEditState] = useState(expenses.map(() => false))
  const [pageCount, setPageCount]= useState(1)
  const currentPage = useRef()
  const [limit,setLimit] = useState(5)
  const [leaderboard, setLeaderboard] = useState([])
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  
  const [error, setError] = useState(null);
  const [isPremium, setIsPremium] = useState(false)
  const [showBuy, setShowBuy] = useState(true)
  const [leader, setLeader] = useState(false)
  const [report, setReport] = useState(false)

  const navigate = useNavigate()

const user = JSON.parse(localStorage.getItem('user'))

  useEffect(() => {
    currentPage.current = 1
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');

        // Fetch user data to check if the user is premium
        const userString = localStorage.getItem('user');
        const user = JSON.parse(userString);
        setIsPremium(user.ispremiumuser);
        setShowBuy(!user.ispremiumuser);

        // Fetch expenses data
        const expensesResponse = await axios.get('http://localhost:3000/api/expense/getexpense', {
          headers: {
            Authorization: token,
          },
        });
        setExpenses(expensesResponse.data);
      } catch (error) {
        console.error(error);
      }
    };

    // fetchData();
    getPaginatedExpenses()
  }, [localStorage.getItem('user')]);


const toggleEditState = (index) => {
  const newEditState = [...editState]
  newEditState[index] = !newEditState[index]
  setEditState(newEditState)
}

  const handleSubmit = (event) => {
    event.preventDefault();
    
    setError(null);

    const token = localStorage.getItem('token'); // Get the token from local storage

    const currentDate = new Date();
    const day = currentDate.getDate();
    const month = currentDate.getMonth() + 1;
    const year = currentDate.getFullYear();

    
    const formattedDay = day < 10 ? `0${day}` : day;
    const formattedMonth = month < 10 ? `0${month}` : month;

    const dateStr = `${formattedDay}-${formattedMonth}-${year}`;

   
    axios.post('http://localhost:3000/api/expense/addexpense', { amount, description, category,date:dateStr }, {
      headers: {
        Authorization: token, 
      },
    })
      .then(response => {
      
        const updatedExpenses = [...expenses]
        updatedExpenses.unshift(response.data)
        // setExpenses(expenses => [...expenses, response.data]);
        // setExpenses(updatedExpenses)
        // Reset form fields
        setExpenses(updatedExpenses);

        
         if (updatedExpenses.length > limit) {
          
          getPaginatedExpenses();
      } 
      
        setAmount('');
        setDescription('');
        setCategory('');
      })
      .catch(error => {
      
        if (error.response && error.response.data && error.response.data.message) {
          setError(error.response.data.message);
        } else {
          setError('An error occurred while adding the expense.');
        }
      });
  };

  const deleteExpense = async (id) => {
    try {
      const token = localStorage.getItem('token')
      const response = await axios.delete(`http://localhost:3000/api/expense/${id}`, {
        headers: {
          Authorization: token
        }
      })
      if (response.status === 204) {
        setExpenses((prevState) => prevState.filter((expense) => expense.id !== id))
       
      getPaginatedExpenses()
      }

    } catch (err) {
      console.log(err)
    }
  }

  const editExpense = async(id,e) => {
    try {
      // deleteExpense(id)
      console.log(e)
      const token = localStorage.getItem('token')
     const response = await axios.get(`http://localhost:3000/api/expense/getexpense/${id}`,{
      headers: {
        Authorization : token
      }
     })
     console.log(response.data)
     setAmount(response.data.amount)
     setCategory(response.data.category)
     setDescription(response.data.description)



   
    }catch(err) {

    }
  }


  const handlePageClick = async(e) => {
    console.log(e)
   currentPage.current = e.selected+1
    getPaginatedExpenses()
  }

  const getPaginatedExpenses = async () => {
    try {
      

      const token = localStorage.getItem('token');

      const userString = localStorage.getItem('user');
      const user = JSON.parse(userString);
      setIsPremium(user.ispremiumuser);
      setShowBuy(!user.ispremiumuser);

      // Fetch expenses data
      const response = await axios.get(`http://localhost:3000/api/expense/paginated?page=${currentPage.current}&limit=${limit}`, {
        headers: {
          Authorization: token,
        },
      });
      setPageCount(response.data.pageCount);
      setExpenses(response.data.result)
      console.log(response.data)
    } catch (error) {
      console.error(error);
    }
  }

 

  const changeLimit = () => {
  

      getPaginatedExpenses()
    
  }




  
  return (
    <>
      
      <Navbar />
    

      <h3 className='mt-5 text-center fw-light'>Welcome {user.name}!</h3>
       
        





      <div className='container-fluid d-flex justify-content-center align-items-center mt-4'>

        {isPremium && (

          <p className='mt-5'>YOU ARE A PREMIUM USER! <FontAwesomeIcon icon={faCrown} /></p>


        )}
      </div>


      

      <br />
     
      {leader && (
        <>
    <div className='container-fluid d-flex justify-content-center align-items-center'>
        {isPremium && (<h1>LeaderBoard: </h1>)}
        <br />
       
    </div>

        <ul className="list-group">
            {isPremium ? leaderboard.map(item => (
                <li key={item.id} className="list-group-item"><b>Name:</b> {item.name}, <b>Expenses</b> {item.totalexpenses}</li>
            )): <p>You are not a premium user</p> }
        </ul>
       </>
)}





      <br />
      <div className="container p-4 rounded div-main">
        <form className="row g-3" onSubmit={handleSubmit}>
       
          <div className="col-sm mx-2 rounded-2 px-3 py-2 div-amount">
            <label htmlFor="expenseAmount" className="form-label"></label>
            <input type="number" placeholder='Enter Amount' className="form-control mb-3 input-expense" id="expenseAmount" name='amount' value={amount} onChange={event => setAmount(event.target.value)} required />
          </div>
          <div className="col-sm mx-2 rounded-2 px-3 py-2 div-desc">
            <label htmlFor="description" className="form-label"></label>
            <input type="text" placeholder='Write a Description' className="form-control mb-3 input-desc" id="description" name='description' value={description} onChange={event => setDescription(event.target.value)} required/>
          </div>
          <div className="col-sm mx-2 rounded-2 px-3 py-2 div-category">
            <label htmlFor="category" className="form-label"></label>
            <select className="form-select mb-3" id="category" name='category' value={category} onChange={event => setCategory(event.target.value)}>
            <option disabled value=''>Choose a category</option>
              <option>Food</option>
              <option>Bills</option>
              <option>Recharge</option>
              <option>Fuel</option>
              <option>Electronics</option>
              <option>Movie</option>
              <option>Grocery</option>
              <option>Transport</option>
              <option>Clothing</option>
              <option>Vacation</option>
              <option>Others</option>
            </select>
          </div>
          <div className='d-flex justify-content-center'>
        
            
            
            
            <button type="submit" className="btn btn-dark mt-3 rounded-5 py-3 px-5">+ Add Expense</button>
          </div>
          {/* </div> */}
        </form>
        {/* display list of expenses */}
        {/* <ul className="list-group mt-4">
          
          {expenses.length?expenses.map(expense => (
            // <li key={expense.id} className="list-group-item d-flex justify-content-between align-items-center">
            
            <li key={expense.id} className="list-group-item li-main">
              <b className='fs-6 mt-3'>Amount:</b>  <span className="fs-6 badge bg-primary rounded-pill mt-3 fw-normal"> {expense.amount}</span>
              <br />
              <br />
              <b className='fs-6'>Description:</b> <span className='description-text fs-6 badge bg-warning rounded-pill fw-normal'> {expense.description}</span>
              <br />
              <br />
              <b className='fs-6'>Category:</b> <span className="fs-6 badge bg-info rounded-pill fw-normal"> {expense.category}</span>
              <br />
              <br />
              <button className='btn btn-danger mt-3 mb-2 rounded-5' onClick={() => deleteExpense(expense.id)}>Delete</button>
            </li>
          )) : <h2 className='fw-light text-center mt-5'>No Expenses Added</h2> }
        </ul> */}
         <div className="container mt-4 p-3 justify-content-evenly" id="table">
    <table id="example" className="table table-hover" style={{ width: '100%' }}>
      <thead id="tableHead">
        <tr>
          <th scope="col" className="rounded-start">Date</th>
          <th scope="col">Amount</th>
          <th scope="col">Description</th>
          <th scope="col">Category</th>
          <th scope="col" className="rounded-end"></th>
        </tr>
      </thead>
      {/* <br /> */}
      
      <tbody id="tbodyId">
      {expenses.map((expense,index) => (
    <tr key={expense._id}>
      <td><h5 className='fw-light mt-2'>{expense.createdAt.slice(0,-14).toString().split('-').reverse().join('-')}</h5></td>
      <td> <h5 className='fw-light mt-2'>{expense.amount}</h5></td>
      <td> <h5 className='fw-light mt-2'>{expense.description}</h5></td>
      <td> <h5 className='fw-light mt-2'>{expense.category}</h5></td>
      <td>
        {showEdit && (<button className="editDelete btn btn-secondary rounded-5 mx-2 mb-1" onClick={() => {
          // toggleEditState(index)
          // if(!editState[index])
          // editExpense(expense.id)
          navigate(`/edit/${expense._id}`)
         
          }}>Edit</button>)}
      
        <button className='btn btn-danger mx-2 rounded-5' onClick={() => deleteExpense(expense._id)}>Delete</button>
      </td>
    </tr>
  ))}
      </tbody>
    </table>
    
    {!expenses.length && (
      <h2 className='fw-light text-center mt-5'>No expenses to show</h2>
    )}
</div>
<br />
<br />
<br />
 <ReactPaginate
        breakLabel="..."
        nextLabel="next >"
        onPageChange={handlePageClick}
        pageRangeDisplayed={5}
        pageCount={pageCount}
        previousLabel="< previous"
        // renderOnZeroPageCount={}
        marginPagesDisplayed={2}
           
            containerClassName="pagination justify-content-center"
            pageClassName="page-item"
            pageLinkClassName="page-link"
            previousClassName="page-item"
            previousLinkClassName="page-link"
            nextClassName="page-item"
            nextLinkClassName="page-link"
            activeClassName="active"
      />
      <input type ='number' onChange={e => setLimit(e.target.value)}/>
        <button className='btn btn-outline-dark rounded-2 mx-2' onClick={changeLimit}>Set Limit per page</button>
      </div>

      

        
      

   
    </>
  );
};

export default Expenses;




