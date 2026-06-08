const NotFound = ({ message = "No data found" }) => {
  return (
    <div style={{
      display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "center",
      padding: "60px 20px", textAlign: "center",
    }}>
      <div style={{
        width: 64, height: 64, borderRadius: "18px", marginBottom: 16,
        background: "rgba(255,255,255,0.18)",
        backdropFilter: "blur(12px)",
        border: "1.5px solid rgba(255,255,255,0.35)",
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: 28,
      }}>
        🔍
      </div>
      <p style={{
        fontFamily: "'Sora', sans-serif", fontWeight: 600,
        fontSize: 15, color: "#2a2118", marginBottom: 6,
      }}>
        Nothing here yet
      </p>
      <p style={{
        fontFamily: "'DM Sans', sans-serif",
        fontSize: 13, color: "#8a7e74",
      }}>
        {message}
      </p>
    </div>
  );
};

export default NotFound;