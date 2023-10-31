import React, {useState,useEffect} from 'react'
import Navbar from '../Navbar/Navbar'
import axios from 'axios'

const Download = () => {
    const [download, setDownload] = useState(true)
    const [fileURL, setFileURL] = useState('')

    const handleDownload = async () => {
        try {
    
    
            const token  = localStorage.getItem('token')
            const response = await axios.get('http://localhost:3000/api/expense/download', {
              headers : {
                Authorization: token
              }
            })
            if(response.status === 200){
              setFileURL(response.data.fileURL)
            }
        
        }catch(err) {
          console.log('error downloading file')
        }
      }

  return (
    <>
    <Navbar />
    <br />
    {fileURL && download &&(
          <div className='d-flex justify-content-center align-items-center'>
          <a href={fileURL} download="myexpense.csv" className='text-center' onClick={(e) => {
            e.preventDefault
            setDownload(prev => !prev)
          }}>Click here to download</a>
          </div>
        )}
        <div className='contianer-fluid d-flex justify-content-center align-items-center mt-4'> <button className='btn btn-success rounded-5 mb-5' onClick= {() => {
          handleDownload()
          setDownload(true)
        }}>Download Report</button>
        
        </div>
</>
  )
}

export default Download