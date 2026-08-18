export default function AuthPage({ authMode, setAuthMode, authForm, setAuthForm, loading, onSubmit, message }) {
  return (
    <section className="auth-shell">
      <div className="auth-card">
        <div className="auth-toggle">
          <button type="button" className={authMode === 'login' ? 'selected' : ''} onClick={() => setAuthMode('login')}>
            Sign in
          </button>
          <button type="button" className={authMode === 'register' ? 'selected' : ''} onClick={() => setAuthMode('register')}>
            Create account
          </button>
        </div>

        <form onSubmit={onSubmit} className="auth-form">
          {authMode === 'register' && (
            <label>
              Full name
              <input type="text" value={authForm.name} onChange={(event) => setAuthForm((current) => ({ ...current, name: event.target.value }))} placeholder="Your name" required />
            </label>
          )}

          <label>
            Email address
            <input type="email" value={authForm.email} onChange={(event) => setAuthForm((current) => ({ ...current, email: event.target.value }))} placeholder="you@example.com" required />
          </label>

          <label>
            Password
            <input type="password" value={authForm.password} onChange={(event) => setAuthForm((current) => ({ ...current, password: event.target.value }))} placeholder="••••••••" required />
          </label>

          {authMode === 'login' && (
            <button type="button" className="link-button" onClick={() => setAuthMode('forgot')}>
              Forgot password?
            </button>
          )}

          <button type="submit" className="primary-button primary-button--full" disabled={loading}>
            {loading ? 'Please wait...' : authMode === 'login' ? 'Sign in' : authMode === 'forgot' ? 'Reset password' : 'Create account'}
          </button>
        </form>

        {message && <p className="status-message">{message}</p>}
      </div>
    </section>
  );
}
