import "../../styles/DashboardSection.css";


export default function DashboardSection({
  title,
  children,
}) {
  return (
    <section className="dashboard-section">

      <h3>{title}</h3>

      {children}

    </section>
  );
}