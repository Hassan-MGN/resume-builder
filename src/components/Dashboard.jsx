import React from 'react'
import { UserAuth } from '../context/AuthContext'
import {useNavigate} from 'react-router-dom' 
import { Link } from 'react-router-dom'

const Dashboard = () => {
  const {session, Signout} = UserAuth()
  const navigate = useNavigate("/signup")

  console.log(session)

  const handleSignOut = async (e) => {
    e.preventDefault
   try {
        await Signout()
        navigate('/signup')
        

  } catch(error) {
      console.error(error)
  }

}

  return (
    <div>
    <h1>Dashboard</h1>
    <p>Welcome {session?.user?.email} to the dashboard!</p>
    <button className='cursor:hover-pointer border inline-block px-2 py-1 mt-2'><Link to="/builder">Resume Builder</Link></button>
    <button onClick={handleSignOut} className='cursor:hover-pointer border inline-block px-2 py-1 mt-2'>Sign Out</button>
    </div>
  )

}

export default Dashboard