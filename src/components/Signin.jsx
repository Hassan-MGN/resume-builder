import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { UserAuth } from '../context/AuthContext'


const SignInUser = () => {

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const { session, signInUser } = UserAuth();
  const navigate = useNavigate()
  console.log(session)
  

  const handleSignIn = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError("")
    try{
      const result = await signInUser({email, password})

      if (result.success) {
        navigate('/dashboard')
      } else {
        setError("Incorrect Emial or Password")
      }
    } catch (error) {
      setError("An error occured")
    }  finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <form onSubmit={handleSignIn} className='max-w-md m-auto pt-14'>
        <h2 className='font-bold pb-2'>Signin!</h2>
        
        <div className='flex flex-col py-4'>
          <input onChange={(e) => setEmail(e.target.value)} className="p-3 m-3 border inline-block " type='email' name='' id='' placeholder='Enter Email'/>
          <input onChange={(e) => setPassword(e.target.value)} className="p-3 m-3 border inline-block" type='password' name='' id='' placeholder='Enter Password'/>
          <button type='submit' disabled={loading} className="px-4 py-2 bg-cyan-600 hover:bg-cyan-700 text-white font-medium rounded-md shadow-sm transition duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2">Sign-in</button>
          
          {error && <p className='text-red-600 text-center pt-4'>{error}</p>}
        </div>
        <p>Don't have an account? <Link to='/signup'>Sign-up</Link> </p> <p> <Link to="/forgot-password">Forgot Password?</Link> </p>
      </form>
    </div>
  )
}

export default SignInUser;