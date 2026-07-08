import "../../styles/DashboardCard.css";


export default function DashboardCard({ title, value }) {
  return (
    <div className="dashboard-card">
      <span className="dashboard-card-title">
        {title}
      </span>

      <h2 className="dashboard-card-value">
        {value}
      </h2>
    </div>
  );
}