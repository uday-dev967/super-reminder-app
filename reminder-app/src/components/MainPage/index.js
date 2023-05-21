import {Link, Navigate} from 'react-router-dom'
import Cookies from "js-cookie"
import {IoNotificationsSharp} from "react-icons/io5"
import './index.css'

const MainPage = () => {
  const jwtToken = Cookies.get('jwt_token')
        if (jwtToken !== undefined) {
        return <Navigate to="/home" />
    }
  return (
      <>
        <div className='container-fluid vh-100 d-flex justify-content-center w-100 flex-row mobile-bg p-0'>
          <div className='row d-md-flex flex-row justify-content-center d-none h-100   align-items-center'>
            <div className='col-md-6'>
              <img src='https://m.media-amazon.com/images/I/61Ov0YMck7L._SL1196_.jpg' alt='reminder-pic' className='w-75' />
            </div>
            <div className='col-md-4 d-flex flex-column text-center'>
              <h1>SUPER RMINDER</h1>
              <p className='mb-3'>set a reminder once and forget</p>
              <Link to="/login">
                <button type='button' className='btn btn-primary mb-3 w-100'>LOGIN</button>
              </Link>
              <Link to="/register">
                <button type='button' className='btn btn-outline-primary w-100'>SIGN UP</button>
              </Link>
            </div>
          </div>
          
          <div className='row m-0 d-flex justify-content-center d-md-none align-items-center h-100 w-100 '>
          <div className='col-9 d-flex flex-column  text-center'>
          <IoNotificationsSharp className='align-self-center mb-3' style={{color:"pink"}} size="80px" />
              <h1>SUPER RMINDER</h1>
              <p className='mb-3'>set a reminder once and forget</p>
              <Link to="/login">
                <button type='button' className='btn btn-primary mb-3 w-100'>LOGIN</button>
              </Link>
              <Link to="/register">
                <button type='button' className='btn btn-outline-primary w-100'>SIGN UP</button>
              </Link>
            </div>
          </div>
        </div>
      </>
  )
}

export default MainPage