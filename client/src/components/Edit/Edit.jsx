import React,{useState,useEffect} from 'react'
import axios from 'axios'
import Navbar from '../Navbar/Navbar'
import { useParams,useNavigate } from 'react-router-dom'

const Edit = () => {
    const {id} = useParams()
    const navigate = useNavigate()
    const [data,setData] = useState([])
    const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Food');
    useEffect(() => {
        const fetch = async () => {
            try {
                const token = localStorage.getItem('token')
                const response = await axios.get(`http://localhost:3000/api/expenses/getexpense/${id}`,{
                    headers: {
                        Authorization :token
                    }
                })
                console.log(response.data)
                setAmount(response.data.amount)
                setDescription(response.data.description)
                setCategory(response.data.category)
                setData(response.data)
            }catch(err){
                console.log(err)
            }
        }
        fetch()
    },[])
    
    
    const handleSubmit = async (id,e) => {
        e.preventDefault()
        try {

            const token = localStorage.getItem('token')
            const updatedExpenses = {
                amount : amount,
                description : description,
                category : category,
                date : data.date
            }


            const response = await axios.patch(`http://localhost:3000/api/expenses/edit/${id}`,updatedExpenses, {
                headers: {
                    Authorization: token
                }
            })
            console.log(response)
            if(response.status === 200) {
                alert('changes saved successfully')
                navigate('/')
            }
        }catch(err) {

        }
    }



  return (
    <>
    <Navbar /> 
    <div className="container p-4 rounded div-main">
        <h1 className='fw-normal text-center'>Edit Expense</h1>
    <form className="row g-3">
       
          <div className="col-sm mx-2 rounded-2 px-3 py-2 div-amount">
            <label htmlFor="expenseAmount" className="form-label"></label>
            <input type="number"  placeholder='Enter Amount' className="form-control mb-3 input-expense" id="expenseAmount" name='amount' value={amount} onChange={event => setAmount(event.target.value)} required />
          </div>
          <div className="col-sm mx-2 rounded-2 px-3 py-2 div-desc">
            <label htmlFor="description"  className="form-label"></label>
            <input type="text" placeholder='Write a Description' className="form-control mb-3 input-desc" id="description" name='description' value={description} onChange={event => setDescription(event.target.value)} required/>
          </div>
          <div className="col-sm mx-2 rounded-2 px-3 py-2 div-category">
            <label htmlFor="category" className="form-label"></label>
            <select className="form-select mb-3" id="category" name='category' value={category} onChange={event => setCategory(event.target.value)}>
              
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
          {/* <div className="col-12"> */}
            
            
              <button type="button" className="btn btn-dark mt-3 rounded-5 py-3 px-5" onClick={(e) => {
                handleSubmit(id,e)
              }}>Save</button>
            
          </div>
          {/* </div> */}
        </form>
        </div>
        <div className='container d-flex'><button className='btn btn-outline-dark' onClick={() => navigate('/')}>Click here to go back</button></div>

</>
  )
}

export default Edit