import React from "react";

export function PageContainer({ children }: { children: React.ReactNode }) {
  return <div style={{ margin: '0 auto', maxWidth: 1200, padding: 16 }}>{children}</div>;
}
