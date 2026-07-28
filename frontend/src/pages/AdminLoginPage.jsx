import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Crown, Loader2, Lock, Shield } from "lucide-react";
import { useAdminAuth } from "../context/AdminAuthContext";

export default function AdminLoginPage() {
  const { login, loading, error } = useAdminAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [localError, setLocalError] = useState(null);

  async function handleSubmit(e) {
    e.preventDefault();
    setLocalError(null);
    try {
      await login(email, password);
      navigate("/admin/dashboard");
    } catch (err) {
      setLocalError(err.message);
    }
  }

  return (
    <div className="page page--auth page--admin-auth">
      <div className="admin-grid-bg" />
      <div className="ambient ambient--gold" />

      <div className="auth-shell auth-shell--admin">
        <div className="admin-portal-badge">
          <Shield size={18} />
          <span>SECURE ADMIN PORTAL</span>
          <Crown size={14} />
        </div>

        <div className="auth-card glass auth-card--admin">
          <div className="auth-brand auth-brand--admin">
            <div className="admin-shield">
              <Lock size={28} />
            </div>
            <div>
              <h1>Admin Access</h1>
              <p>Restricted · Audited · Encrypted</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="auth-form">
            {(error || localError) && (
              <div className="alert alert--error">{localError || error}</div>
            )}

            <label className="field">
              <span>Admin email</span>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@uneedwhat.com"
                required
                autoComplete="username"
              />
            </label>

            <label className="field">
              <span>Password</span>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                required
                autoComplete="current-password"
              />
            </label>

            <button type="submit" className="primary-btn primary-btn--admin primary-btn--full" disabled={loading}>
              {loading ? <Loader2 size={18} className="spin" /> : <Shield size={18} />}
              Authenticate
            </button>
          </form>

          <p className="auth-footer auth-footer--muted">
            All admin actions are logged. Unauthorized access is prohibited.
          </p>
          <Link to="/" className="ghost-btn ghost-btn--small">
            ← Back to public site
          </Link>
        </div>
      </div>
    </div>
  );
}
