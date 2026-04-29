export default function Loading() {
  return (
    <div
      style={{
        display: "flex",
        height: "100vh",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
        gap: "20px",
        background: "var(--bg)",
        color: "var(--brand)",
        position: "fixed",
        inset: 0,
        zIndex: 9999,
      }}
    >
      <div style={{ 
        width: "40px", 
        height: "40px", 
        border: "3px solid var(--button-bg)", 
        borderTopColor: "var(--brand)", 
        borderRadius: "50%",
        animation: "loading-spin 1s linear infinite"
      }} />
      <p style={{ fontWeight: 500, letterSpacing: "1px" }}>Loading Project...</p>
      
      <style>{`
        @keyframes loading-spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
