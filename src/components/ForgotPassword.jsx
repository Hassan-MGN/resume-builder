import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../supabaseClient'

const ForgotPassword = () => {
  const [email, setEmail] = useState("")
  const [error, setError] = useState("")
  const [message, setMessage] = useState("")
  const [loading, setLoading] = useState(false)

  const handleForgotPassword = async (e) => {
    e.preventDefault()

    setLoading(true)
    setError("")
    setMessage("")

    try {
      const { data, error } = await supabase.auth.resetPasswordForEmail(
        email,
        {
          redirectTo: `${window.location.origin}/reset-password`,
        }
      )

      if (error) {
        console.error("Password reset error:", error)

        setError(error.message)
        return
      }

      console.log("Password reset email sent:", data)

      setMessage("Password reset link has been sent to your email.")
    } catch (error) {
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-md m-auto pt-14">

      <h2 className="font-bold text-xl pb-4">
        Forgot Password
      </h2>

      <form onSubmit={handleForgotPassword}>

        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
          className="p-3 mb-4 w-full border rounded"
          required
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full px-4 py-2 bg-cyan-600 hover:bg-cyan-700 text-white rounded"
        >
          {loading ? "Sending..." : "Send Reset Link"}
        </button>

      </form>

      {message && (
        <p className="text-green-600 mt-4">
          {message}
        </p>
      )}

      {error && (
        <p className="text-red-600 mt-4">
          {error}
        </p>
      )}

      <p className="mt-4">
        Remember your password?{" "}
        <Link
          to="/signin"
          className="text-cyan-600"
        >
          Sign in
        </Link>
      </p>

    </div>
  )
}

export default ForgotPassword