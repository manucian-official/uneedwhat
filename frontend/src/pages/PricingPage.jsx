import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Crown } from "lucide-react";
import Navbar from "../components/Navbar";
import PricingCards, { PricingComparisonTable } from "../components/PricingCards";
import { api } from "../services/apiClient";
import { useAuth } from "../context/AuthContext";

export default function PricingPage() {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [plans, setPlans] = useState([]);
  const [methods, setMethods] = useState([]);
  const [subscribing, setSubscribing] = useState(null);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [billingCycle, setBillingCycle] = useState("monthly");
  const [paymentMethod, setPaymentMethod] = useState("stripe_card");
  const [checkoutResult, setCheckoutResult] = useState(null);
  const [paymentState, setPaymentState] = useState(null);

  useEffect(() => {
    api.plans.list().then(setPlans).catch(() => {});
    api.plans.paymentMethods().then(setMethods).catch(() => {});
  }, []);

  async function handleSelect(plan) {
    if (plan.tier === "enterprise" || plan.tier === "vip" || plan.slug === "vip") {
      window.location.href = "mailto:sales@uneedwhat.com?subject=Enterprise%20VIP%20Inquiry";
      return;
    }
    if (!isAuthenticated) {
      navigate("/login", { state: { redirect: "/pricing", plan: plan.slug } });
      return;
    }
    setSelectedPlan(plan);
    setCheckoutResult(null);
    setPaymentState(null);
  }

  async function handleCheckout() {
    if (!selectedPlan) return;
    setSubscribing(selectedPlan.slug);
    try {
      const result = await api.plans.checkout({
        planSlug: selectedPlan.slug,
        billingCycle,
        paymentMethod,
      });
      setCheckoutResult(result);
      setPaymentState(result?.type === "payment-required" ? "pending" : null);
      if (result.type === "free-activation") {
        navigate("/");
      }
    } catch (err) {
      alert(err.message);
    } finally {
      setSubscribing(null);
    }
  }

  async function handleConfirmPayment() {
    if (!checkoutResult?.transactionId) return;
    try {
      await api.plans.confirmPayment(checkoutResult.transactionId);
      alert("Thanh toán thành công. Gói dịch vụ đã được kích hoạt.");
      setPaymentState("paid");
      setSelectedPlan(null);
      setCheckoutResult(null);
      navigate("/");
    } catch (err) {
      alert(err.message);
    }
  }

  async function handleCancelPayment() {
    if (!checkoutResult?.transactionId) return;
    try {
      await api.plans.cancelPayment(checkoutResult.transactionId, "checkout_closed_by_user");
      setPaymentState("cancelled");
      alert("Thanh toán đã được hủy.");
    } catch (err) {
      alert(err.message);
    }
  }

  async function handleRefreshStatus() {
    if (!checkoutResult?.transactionId) return;
    try {
      const tx = await api.plans.paymentStatus(checkoutResult.transactionId);
      setPaymentState(tx?.status || "pending");
    } catch (err) {
      alert(err.message);
    }
  }

  return (
    <div className="page page--pricing">
      <div className="ambient ambient--violet" />
      <div className="ambient ambient--coral" />

      <Navbar />

      <section className="pricing-hero">
        <span className="eyebrow">
          <Crown size={14} />
          Gói dịch vụ · Packages
        </span>
        <h1>Chọn gói phù hợp với quy mô team</h1>
        <p>
          Từ Free cho cá nhân đến Enterprise VIP với API, branding và hỗ trợ ưu tiên.
          Nâng cấp bất cứ lúc nào.
        </p>
      </section>

      <section className="section">
        <PricingCards
          plans={plans}
          highlight="business"
          onSelect={handleSelect}
        />
        {subscribing && <p className="muted center">Đang xử lý gói {subscribing}...</p>}
      </section>

      {selectedPlan && (
        <section className="section">
          <div className="glass checkout-panel">
            <h3>
              Checkout · {selectedPlan.name}
            </h3>
            <p className="muted">
              Chọn chu kỳ thanh toán và phương thức phù hợp cho doanh nghiệp của bạn.
            </p>
            <div className="checkout-grid">
              <label>
                Chu kỳ
                <select value={billingCycle} onChange={(e) => setBillingCycle(e.target.value)}>
                  <option value="monthly">Monthly</option>
                  <option value="yearly">Yearly</option>
                </select>
              </label>
              <label>
                Payment Method
                <select value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)}>
                  {methods.map((m) => (
                    <option key={m.method} value={m.method}>
                      {m.label}
                    </option>
                  ))}
                </select>
              </label>
            </div>
            <div className="hero-cta">
              <button
                type="button"
                className="primary-btn primary-btn--glow"
                onClick={handleCheckout}
                disabled={subscribing === selectedPlan.slug}
              >
                {subscribing === selectedPlan.slug ? "Đang tạo checkout..." : "Tạo thanh toán"}
              </button>
              <button type="button" className="secondary-btn" onClick={() => setSelectedPlan(null)}>
                Hủy
              </button>
            </div>
            {checkoutResult?.paymentUrl && (
              <div className="checkout-result">
                <p>
                  Payment link:
                  <a href={checkoutResult.paymentUrl} target="_blank" rel="noreferrer">
                    {" "}
                    Open Gateway
                  </a>
                </p>
                <button type="button" className="secondary-btn" onClick={handleConfirmPayment}>
                  Tôi đã thanh toán · Confirm
                </button>
                <button type="button" className="secondary-btn" onClick={handleRefreshStatus}>
                  Làm mới trạng thái
                </button>
                <button type="button" className="secondary-btn" onClick={handleCancelPayment}>
                  Hủy giao dịch
                </button>
                {paymentState && (
                  <p className="muted">
                    Trạng thái thanh toán hiện tại: <strong>{paymentState}</strong>
                  </p>
                )}
              </div>
            )}
          </div>
        </section>
      )}

      <section className="section">
        <div className="section-intro">
          <h2>Bảng so sánh chi tiết</h2>
          <p>Feature comparison · Đối chiếu tính năng</p>
        </div>
        <PricingComparisonTable plans={plans} />
      </section>

      <section className="section cta-band glass">
        <h2>Cần tư vấn Enterprise?</h2>
        <p>Liên hệ đội ngũ VIP để được custom branding, SLA và API riêng.</p>
        <div className="hero-cta">
          <a href="mailto:sales@uneedwhat.com" className="primary-btn primary-btn--glow">
            Liên hệ sales
          </a>
          <Link to="/login" className="secondary-btn">
            Đăng nhập để nâng cấp
          </Link>
        </div>
      </section>

      <footer className="footer">
        <p>© 2026 UneedWhat · Flexible pricing for every hiring team</p>
      </footer>
    </div>
  );
}
