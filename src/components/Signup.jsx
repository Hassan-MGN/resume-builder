import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserAuth } from '../context/AuthContext';
import Brand from './ui/Brand';

const Signup = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [verificationSent, setVerificationSent] = useState(false);

  const { signupNewUser } = UserAuth();
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setVerificationSent(false);
    try {
      const result = await signupNewUser(username, email, password);
      if (result.success) {
        if (result.requiresEmailConfirmation) {
          setVerificationSent(true);
        } else {
          navigate('/builder');
        }
      } else {
        setError(result.error || 'Could not create account. Please try again.');
      }
    } catch {
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F7F7F5] flex flex-col items-center justify-center px-4">
      {/* Logo */}
      <Brand className="mb-10" markClassName="h-7 w-7" textClassName="font-semibold text-[#151719] tracking-tight" />

      <div className="w-full max-w-sm">
        <h1 className="text-2xl font-bold text-[#151719] mb-1">Create your account</h1>
        <p className="text-sm text-[#626870] mb-8">Build your professional resume in minutes.</p>

        <form onSubmit={handleSignup} className="space-y-4">
          <div>
            <label htmlFor="username" className="block text-xs font-medium text-[#626870] mb-1.5">
              Name
            </label>
            <input
              id="username"
              type="text"
              autoComplete="name"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Your name"
              className="w-full h-[42px] px-3.5 rounded border border-[#E2E4E6] bg-white text-sm text-[#151719] placeholder:text-[#9BA3AE] outline-none transition-colors focus:border-[#087CB8] focus:ring-2 focus:ring-[#087CB8]/10 hover:border-[#C8CDD3]"
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-xs font-medium text-[#626870] mb-1.5">
              Email address
            </label>
            <input
              id="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full h-[42px] px-3.5 rounded border border-[#E2E4E6] bg-white text-sm text-[#151719] placeholder:text-[#9BA3AE] outline-none transition-colors focus:border-[#087CB8] focus:ring-2 focus:ring-[#087CB8]/10 hover:border-[#C8CDD3]"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-xs font-medium text-[#626870] mb-1.5">
              Password
            </label>
            <input
              id="password"
              type="password"
              autoComplete="new-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Minimum 6 characters"
              className="w-full h-[42px] px-3.5 rounded border border-[#E2E4E6] bg-white text-sm text-[#151719] placeholder:text-[#9BA3AE] outline-none transition-colors focus:border-[#087CB8] focus:ring-2 focus:ring-[#087CB8]/10 hover:border-[#C8CDD3]"
            />
          </div>

          {verificationSent && (
            <p className="text-xs text-[#25634A] bg-[#F0FAF5] border border-[#9AD8B7]/50 rounded px-3 py-2.5">Account created. Check your email to verify your account before signing in.</p>
          )}

          {error && (
            <p className="text-xs text-[#C94B4B] bg-[#FEF2F2] border border-[#FCA5A5]/40 rounded px-3 py-2.5">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full h-[42px] rounded bg-[#151719] hover:bg-[#222831] text-white text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed mt-2"
          >
            {loading ? 'Creating account…' : 'Create account'}
          </button>
        </form>

        <p className="mt-6 text-center text-xs text-[#626870]">
          Already have an account?{' '}
          <Link to="/signin" className="text-[#087CB8] hover:text-[#065E8C] font-medium transition-colors">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;
