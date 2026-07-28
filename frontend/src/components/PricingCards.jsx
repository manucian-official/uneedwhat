import { Check, Sparkles } from "lucide-react";

const TIER_STYLES = {
  free: "plan-card--free",
  team: "plan-card--team",
  pro: "plan-card--pro",
  business: "plan-card--business",
  vip: "plan-card--enterprise",
  enterprise: "plan-card--enterprise",
};

function formatLimit(value) {
  if (value === -1) return "Không giới hạn";
  return value.toLocaleString();
}

function formatPrice(plan) {
  if (Number(plan.priceMonthly) === 0) return "Miễn phí";
  return `$${Number(plan.priceMonthly)}/tháng`;
}

export default function PricingCards({ plans = [], highlight, onSelect, compact }) {
  if (!plans.length) {
    return <p className="muted">Đang tải gói dịch vụ...</p>;
  }

  return (
    <div className={`pricing-grid ${compact ? "pricing-grid--compact" : ""}`}>
      {plans.map((plan) => {
        const isHighlight = highlight === plan.slug || plan.slug === "business";
        const f = plan.features || {};

        return (
          <article
            key={plan.id}
            className={`plan-card glass ${TIER_STYLES[plan.tier] || ""} ${isHighlight ? "plan-card--featured" : ""}`}
          >
            {isHighlight && (
              <span className="plan-badge">
                <Sparkles size={12} />
                Phổ biến nhất
              </span>
            )}
            <div className="plan-head">
              <h3>{plan.name}</h3>
              <p>{plan.description}</p>
            </div>
            <div className="plan-price">
              <strong>{formatPrice(plan)}</strong>
              {Number(plan.priceYearly) > 0 && (
                <span>${Number(plan.priceYearly)}/năm tiết kiệm 17%</span>
              )}
            </div>
            <ul className="plan-features">
              <li>
                <Check size={14} />
                {formatLimit(f.max_jobs)} job posts
              </li>
              <li>
                <Check size={14} />
                {formatLimit(f.max_applications)} hồ sơ ứng tuyển
              </li>
              <li>
                <Check size={14} />
                {formatLimit(f.team_seats)} thành viên team
              </li>
              <li>
                <Check size={14} />
                Analytics: {f.analytics ? (typeof f.analytics === "string" ? f.analytics : "Có") : "Không"}
              </li>
              {f.bulk_operations && (
                <li>
                  <Check size={14} />
                  Bulk operations
                </li>
              )}
              {f.api_access && (
                <li>
                  <Check size={14} />
                  API access
                </li>
              )}
              {f.custom_branding && (
                <li>
                  <Check size={14} />
                  Custom branding
                </li>
              )}
              {f.priority_support && (
                <li>
                  <Check size={14} />
                  Priority support
                </li>
              )}
            </ul>
            {onSelect && (
              <button
                type="button"
                className={isHighlight ? "primary-btn" : "secondary-btn"}
                onClick={() => onSelect(plan)}
              >
                {plan.tier === "enterprise" || plan.tier === "vip" ? "Liên hệ sales" : "Chọn gói"}
              </button>
            )}
          </article>
        );
      })}
    </div>
  );
}

export function PricingComparisonTable({ plans = [] }) {
  const rows = [
    { key: "max_jobs", label: "Job posts" },
    { key: "max_applications", label: "Applications" },
    { key: "team_seats", label: "Team seats" },
    { key: "analytics", label: "Analytics" },
    { key: "bulk_operations", label: "Bulk ops" },
    { key: "api_access", label: "API" },
    { key: "custom_branding", label: "Branding" },
    { key: "priority_support", label: "Support" },
  ];

  function cellValue(features, key) {
    const v = features?.[key];
    if (typeof v === "number") return v === -1 ? "∞" : v;
    if (typeof v === "boolean") return v ? "✓" : "—";
    if (typeof v === "string") return v;
    return "—";
  }

  return (
    <div className="comparison-wrap glass">
      <table className="comparison-table">
        <thead>
          <tr>
            <th>Feature</th>
            {plans.map((p) => (
              <th key={p.id}>{p.name}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.key}>
              <td>{row.label}</td>
              {plans.map((p) => (
                <td key={p.id}>{cellValue(p.features, row.key)}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
