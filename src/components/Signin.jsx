import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserAuth } from '../context/AuthContext';
import Brand from './ui/Brand';

const Signin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { signInUser } = UserAuth();
  const navigate = useNavigate();

  const handleSignIn = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const result = await signInUser({ email, password });
      if (result.success) {
        navigate('/builder');
      } else {
        setError('Incorrect email or password.');
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
        <h1 className="text-2xl font-bold text-[#151719] mb-1">Welcome back</h1>
        <p className="text-sm text-[#626870] mb-8">Sign in to continue building your resume.</p>

        <form onSubmit={handleSignIn} className="space-y-4">
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
            <div className="flex items-center justify-between mb-1.5">
              <label htmlFor="password" className="block text-xs font-medium text-[#626870]">
                Password
              </label>
              <Link to="/forgot-password" className="text-xs text-[#087CB8] hover:text-[#065E8C] transition-colors">
                Forgot password?
              </Link>
            </div>
            <input
              id="password"
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full h-[42px] px-3.5 rounded border border-[#E2E4E6] bg-white text-sm text-[#151719] placeholder:text-[#9BA3AE] outline-none transition-colors focus:border-[#087CB8] focus:ring-2 focus:ring-[#087CB8]/10 hover:border-[#C8CDD3]"
            />
          </div>

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
            {loading ? 'Signing in…' : 'Sign in'}
          </button>
        </form>

        <p className="mt-6 text-center text-xs text-[#626870]">
          Don't have an account?{' '}
          <Link to="/signup" className="text-[#087CB8] hover:text-[#065E8C] font-medium transition-colors">
            Create account
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Signin;
