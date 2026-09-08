import { Metadata } from "next";

export const metadata: Metadata = {
  robots: { index: false },
};

export default function CompareLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
