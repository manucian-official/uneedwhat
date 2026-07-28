import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Loader2, LogIn, Sparkles } from "lucide-react";
import { useAuth } from "../context/AuthContext";

export default function LoginPage() {
  const { login, loading, error } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [localError, setLocalError] = useState(null);

  async function handleSubmit(e) {
    e.preventDefault();
    setLocalError(null);
    try {
      await login(email, password);
      navigate("/");
    } catch (err) {
      setLocalError(err.message);
    }
  }

  return (
    <div className="page page--auth">
      <div className="ambient ambient--violet" />
      <div className="ambient ambient--coral" />

      <div className="auth-shell">
        <Link to="/" className="back-link">
          <ArrowLeft size={16} />
          Về trang chủ
        </Link>

        <div className="auth-card glass auth-card--user">
          <div className="auth-brand">
            <Sparkles size={24} />
            <div>
              <h1>Đăng nhập</h1>
              <p>HR · Recruiter · Job seeker</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="auth-form">
            {(error || localError) && (
              <div className="alert alert--error">{localError || error}</div>
            )}

            <label className="field">
              <span>Email</span>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@company.com"
                required
                autoComplete="email"
              />
            </label>

            <label className="field">
              <span>Mật khẩu</span>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                autoComplete="current-password"
              />
            </label>

            <button type="submit" className="primary-btn primary-btn--full" disabled={loading}>
              {loading ? <Loader2 size={18} className="spin" /> : <LogIn size={18} />}
              Đăng nhập
            </button>
          </form>

          <p className="auth-footer">
            Chưa có tài khoản? Liên hệ HR team hoặc{" "}
            <Link to="/pricing">xem gói dịch vụ</Link>.
          </p>
        </div>
      </div>
    </div>
  );
}
