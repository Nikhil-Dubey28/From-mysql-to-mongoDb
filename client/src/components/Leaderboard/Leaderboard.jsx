import React, {useState,useEffect,useRef}from 'react'
import Navbar from '../Navbar/Navbar'
import axios from 'axios'
import ReactPaginate from 'react-paginate'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCrown } from '@fortawesome/free-solid-svg-icons'

const Leaderboard = () => {
    const [pageCount, setPageCount]= useState(1)
    const currentPage = useRef()
    const [limit,setLimit] = useState(5)

    const [leaderboard, setLeaderboard] = useState([]);
   

    useEffect(() => {
        currentPage.current = 1
      
          fetchLeaderboard();
    },[])


    const fetchLeaderboard = async () => {
        try {
            const token = localStorage.getItem('token')
          const response = await axios.get(`http://localhost:3000/api/premium/showleaderboard?page=${currentPage.current}&limit=${limit}`, {
            headers: {
              Authorization: token
            }
          });
          setPageCount(response.data.pageCount)
          setLeaderboard(response.data.result);
        } catch (error) {
          console.log(error);
        }
      }; 

    const handlePageClick = async(e) => {
        console.log(e)
       currentPage.current = e.selected+1
        fetchLeaderboard()
       
      }

  return (
    <>
    <Navbar />
      <h2 className="text-center mt-4 fw-normal">LEADERBOARD <FontAwesomeIcon icon={faCrown} /></h2>
    <div className="container table-responsive mt-4 p-3 d-flex justify-content-evenly" id="table">
        
      <table className="table table-hover" style={{width: "70%"}}>

        
      

        <thead className="">
          <tr className="">
            <th scope="col" style={{width: "40%"}}>Position</th>
            <th scope="col" style={{width: "40%"}}>Name</th>
            <th scope="col" style={{width: "10%"}}>Expenses</th>
          </tr>
        </thead>

       

        <tbody id="tbodyId">
            
        {leaderboard.map((item,index) => (
    <tr key={item.id}>
      <td><h5 className='fw-light mt-2'>{index+1}</h5></td>
      <td> <h5 className='fw-light mt-2'>{item.name}</h5></td>
      <td> <h5 className='fw-light mt-2'>{item.totalexpenses}</h5></td>
      <td> <h5 className='fw-light mt-2'>{}</h5></td>
     
    </tr>
  ))}
        </tbody>
      </table>
    </div>

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
    </>
  )
}

export default Leaderboard