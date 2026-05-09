import { ProSidebar } from "./ProSidebar";
import { ProTopbar } from "./ProTopbar";

export function ProShell({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "var(--bg)" }}>
      <ProSidebar />
      <div style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column" }}>
        <ProTopbar />
        <div style={{ padding: "24px 28px", flex: 1 }}>{children}</div>
      </div>
    </div>
  );
}
