export default function Panel({ className = "", children }) {
  return <div className={`glass-panel ${className}`}>{children}</div>;
}
