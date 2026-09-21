import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../supabaseClient'

const ResetPassword = () => {
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [error, setError] = useState("")
  const [message, setMessage] = useState("")
  const [loading, setLoading] = useState(false)

  const navigate = useNavigate()

  const handleResetPassword = async (e) => {
    e.preventDefault()

    setError("")
    setMessage("")

    if (password !== confirmPassword) {
      setError("Passwords do not match")
      return
    }

    setLoading(true)

    try {
      const { error } = await supabase.auth.updateUser({
        password: password
      })

      if (error) {
        setError("We could not update the password. The reset link may have expired. Please request a new one.")
        return
      }

      setMessage("Password updated successfully!")

      setTimeout(() => {
        navigate("/signin")
      }, 2000)

    } catch (error) {
      console.error("Password update failed:", error)
      setError("We could not update the password. Please request a new reset link and try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-md m-auto pt-14">

      <h2 className="font-bold text-xl pb-4">
        Reset Password
      </h2>

      <form onSubmit={handleResetPassword}>

        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Enter new password"
          className="p-3 mb-4 w-full border rounded"
          required
        />

        <input
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          placeholder="Confirm new password"
          className="p-3 mb-4 w-full border rounded"
          required
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full px-4 py-2 bg-cyan-600 hover:bg-cyan-700 text-white rounded"
        >
          {loading ? "Updating..." : "Update Password"}
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

    </div>
  )
}

export default ResetPassword
