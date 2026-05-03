import "../styles/Dashboard.css";

export default function MetricCard({ title, value, trend }) {
  return (
    <div className="stat-card">
      <h3>{title}</h3>
      <p>{value}</p>
      {trend && <span className="trend">{trend}</span>}
    </div>
  );
}

