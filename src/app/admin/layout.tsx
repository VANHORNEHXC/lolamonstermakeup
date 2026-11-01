import type { ReactNode } from "react";
import "./admin.css";

export const metadata = {
	title: "Administración | Lola Monster Makeup",
	robots: { index: false, follow: false },
};

export default function AdminRootLayout({ children }: { children: ReactNode }) {
	return children;
}
