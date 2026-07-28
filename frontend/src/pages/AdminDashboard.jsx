import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Activity,
  Building2,
  CreditCard,
  Loader2,
  LogOut,
  Shield,
  Users,
  Briefcase,
  FileText,
} from "lucide-react";
import { useAdminAuth } from "../context/AdminAuthContext";
import { api } from "../services/apiClient";

function StatCard({ icon: Icon, label, value, accent }) {
  return (
    <article className={`stat-card glass stat-card--${accent}`}>
      <Icon size={22} />
      <div>
        <strong>{value ?? "—"}</strong>
        <span>{label}</span>
      </div>
    </article>
  );
}

export default function AdminDashboard() {
  const { admin, logout, isAuthenticated } = useAdminAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [subs, setSubs] = useState([]);
  const [auditLogs, setAuditLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/admin/login");
      return;
    }
    loadData();
  }, [isAuthenticated, navigate]);

  async function loadData() {
    setLoading(true);
    try {
      const [dashboard, usersData, subsData, logs] = await Promise.all([
        api.admin.dashboard(),
        api.admin.users(1),
        api.admin.subscriptions(1),
        api.admin.auditLogs(),
      ]);
      setStats(dashboard);
      setUsers(usersData.items || []);
      setSubs(subsData.items || []);
      setAuditLogs(logs || []);
    } catch {
      /* handled by redirect if 401 */
    } finally {
      setLoading(false);
    }
  }

  async function handleLogout() {
    await logout();
    navigate("/admin/login");
  }

  async function toggleUserStatus(user) {
    setActionLoading(user.id);
    try {
      if (user.isActive) {
        await api.admin.suspendUser(user.id);
      } else {
        await api.admin.activateUser(user.id);
      }
      await loadData();
    } finally {
      setActionLoading(null);
    }
  }

  if (!isAuthenticated) return null;

  return (
    <div className="page page--admin">
      <div className="ambient ambient--gold" />
      <div className="admin-grid-bg" />

      <header className="admin-header glass">
        <div className="admin-header-left">
          <Shield size={22} />
          <div>
            <strong>Admin Console</strong>
            <span>{admin?.email}</span>
          </div>
        </div>
        <div className="admin-header-actions">
          <Link to="/" className="ghost-btn ghost-btn--small">
            Public site
          </Link>
          <button type="button" className="primary-btn primary-btn--admin" onClick={handleLogout}>
            <LogOut size={16} />
            Logout
          </button>
        </div>
      </header>

      {loading ? (
        <div className="loading-center">
          <Loader2 size={32} className="spin" />
        </div>
      ) : (
        <main className="admin-main">
          <section className="admin-stats">
            <StatCard icon={Users} label="Users" value={stats?.users} accent="violet" />
            <StatCard icon={Building2} label="Organizations" value={stats?.organizations} accent="coral" />
            <StatCard icon={CreditCard} label="Active subs" value={stats?.activeSubscriptions} accent="gold" />
            <StatCard icon={Briefcase} label="Jobs" value={stats?.jobs} accent="violet" />
            <StatCard icon={FileText} label="Applications" value={stats?.applications} accent="coral" />
          </section>

          <div className="admin-panels">
            <section className="admin-panel glass">
              <h2>
                <Users size={18} />
                User management
              </h2>
              <div className="admin-table-wrap">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Role</th>
                      <th>Status</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((u) => (
                      <tr key={u.id}>
                        <td>{u.firstName} {u.lastName}</td>
                        <td>{u.email}</td>
                        <td><span className="pill">{u.role}</span></td>
                        <td>
                          <span className={`status ${u.isActive ? "status--active" : "status--suspended"}`}>
                            {u.isActive ? "Active" : "Suspended"}
                          </span>
                        </td>
                        <td>
                          <button
                            type="button"
                            className="ghost-btn ghost-btn--small"
                            disabled={actionLoading === u.id}
                            onClick={() => toggleUserStatus(u)}
                          >
                            {u.isActive ? "Suspend" : "Activate"}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>

            <section className="admin-panel glass">
              <h2>
                <CreditCard size={18} />
                Subscriptions
              </h2>
              <div className="admin-table-wrap">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Organization</th>
                      <th>Plan</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {subs.map((s) => (
                      <tr key={s.id}>
                        <td>{s.organization?.name || s.organizationId}</td>
                        <td>{s.plan?.name || "—"}</td>
                        <td><span className="pill">{s.status}</span></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>

            <section className="admin-panel glass admin-panel--full">
              <h2>
                <Activity size={18} />
                Audit log
              </h2>
              <div className="audit-list">
                {auditLogs.length === 0 ? (
                  <p className="muted">No audit entries yet.</p>
                ) : (
                  auditLogs.map((log) => (
                    <div className="audit-item" key={log.id}>
                      <span className="audit-action">{log.action}</span>
                      <span className="audit-meta">
                        {log.resourceType}
                        {log.resourceId ? ` · ${log.resourceId.slice(0, 8)}` : ""}
                      </span>
                      <time>{new Date(log.createdAt).toLocaleString()}</time>
                    </div>
                  ))
                )}
              </div>
            </section>
          </div>
        </main>
      )}
    </div>
  );
}
