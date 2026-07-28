import { Link, useNavigate } from "react-router-dom";
import { ArrowRight, Crown, LogOut, Shield, Sparkles } from "lucide-react";
import { useAuth } from "../context/AuthContext";

export default function Navbar({ variant = "default" }) {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  async function handleLogout() {
    await logout();
    navigate("/");
  }

  return (
    <header className={`navbar navbar--${variant}`}>
      <Link to="/" className="brand">
        <span className="brand-icon">
          <Sparkles size={20} />
        </span>
        <div>
          <strong>UneedWhat</strong>
          <span>I Need U · Tuyển dụng thông minh</span>
        </div>
      </Link>

      <nav className="nav-links">
        <Link to="/#features">Tính năng</Link>
        <Link to="/pricing">Gói VIP</Link>
        <Link to="/#jobs">Việc làm</Link>
      </nav>

      <div className="nav-actions">
        {isAuthenticated ? (
          <div className="user-pill">
            <span>{user.firstName || user.email}</span>
            <button type="button" className="icon-btn" onClick={handleLogout} title="Đăng xuất">
              <LogOut size={16} />
            </button>
          </div>
        ) : (
          <>
            <Link to="/login" className="ghost-btn">
              Đăng nhập
            </Link>
            <Link to="/pricing" className="primary-btn">
              Nâng cấp VIP
              <ArrowRight size={16} />
            </Link>
          </>
        )}
        <Link to="/admin/login" className="admin-link" title="Admin portal">
          <Shield size={14} />
          <Crown size={12} />
        </Link>
      </div>
    </header>
  );
}
