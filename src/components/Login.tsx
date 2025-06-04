import React, { useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import './Auth.css'

const Login: React.FC = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isRegister, setIsRegister] = useState(false)
  const { signIn, signUp, error, loading } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (isRegister) {
      await signUp(email, password)
    } else {
      await signIn(email, password)
    }
  }

  const isSuccessMessage = error?.includes('Please check your email')

  return (
    <div className="auth-container">
      <form onSubmit={handleSubmit} className="auth-form neon-box">
        <h2 className="auth-title neon-text">
          {isRegister ? 'Register' : 'Login'}
        </h2>
        
        {error && (
          <div className={isSuccessMessage ? "auth-success" : "auth-error"}>
            {error}
          </div>
        )}
        
        <div className="form-group">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="neon-input"
            required
          />
        </div>
        
        <div className="form-group">
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="neon-input"
            required
          />
        </div>
        
        <button type="submit" className="neon-button" disabled={loading}>
          {loading ? 'Loading...' : isRegister ? 'Register' : 'Login'}
        </button>
        
        <p className="auth-switch">
          {isRegister ? 'Already have an account?' : "Don't have an account?"}{' '}
          <button
            type="button"
            className="switch-button"
            onClick={() => setIsRegister(!isRegister)}
          >
            {isRegister ? 'Login' : 'Register'}
          </button>
        </p>
      </form>
    </div>
  )
}

export default Login
