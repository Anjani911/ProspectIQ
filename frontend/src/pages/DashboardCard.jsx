function DashboardCard({ title, value }) {
  return (
    <div
      style={{
        background: "white",
        padding: "20px",
        borderRadius: "12px",
        boxShadow: "0 4px 10px rgba(0,0,0,.08)",
      }}
    >
      <h3>{title}</h3>

      <h1>{value}</h1>
    </div>
  );
}

export default DashboardCard;