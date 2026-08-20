import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { UserAuth } from '../context/AuthContext'

const Signup = () => {

  const [username, setUsername] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const { session, signupNewUser } = UserAuth();
  const navigate = useNavigate()
  console.log(session)
  

  const handleSignup = async (e) => {
    e.preventDefault()
    setLoading(true)
    try{
      const result = await signupNewUser(username, email, password)

      if (result.success) {
        navigate('/dashboard')
      }
    } catch (error) {
      setError("An error occured")
    }  finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <form onSubmit={handleSignup} className='max-w-md m-auto pt-14'>
        <h2 className='font-bold pb-2'>Signup!</h2>
        
        <div className='flex flex-col py-4'>
          <input onChange={(e) => setUsername(e.target.value)} className='p-3 m-3 border inline-block' type='text' placeholder='Enter Username' />
          <input onChange={(e) => setEmail(e.target.value)} className="p-3 m-3 border inline-block " type='email' name='' id='' placeholder='Enter Email'/>
          <input onChange={(e) => setPassword(e.target.value)} className="p-3 m-3 border inline-block" type='password' name='' id='' placeholder='Enter Password'/>
          <button type='submit' disabled={loading} className="px-4 py-2 bg-cyan-600 hover:bg-cyan-700 text-white font-medium rounded-md shadow-sm transition duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2">Sign-up</button>
          {error && <p className='text-red-600 text-center pt-4'>{error}</p>}
        </div>
        <p>Already have an account? <Link to='/signin'>Sign-in</Link> </p>
      </form>
    </div>
  )
}

export default Signup