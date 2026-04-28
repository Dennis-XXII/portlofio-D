import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import SignOutButton from "@/components/SignOutButton";
import "../../admin.css";

export default async function AdminLayout({ children }) {
  const session = await getServerSession(authOptions);

  if (!session || session.user.email !== process.env.ADMIN_EMAIL) {
    redirect("/login");
  }

  return (
    <div className="admin-container">
      <nav className="admin-nav">
        <div style={{ marginBottom: "40px" }}>
          <h2 style={{ color: "white", fontSize: "24px", fontWeight: "600", letterSpacing: "-0.04em" }}>Kyaw Swar Hein</h2>
          <p style={{ color: "rgba(255,255,255,0.4)", fontSize: "12px", textTransform: "uppercase", letterSpacing: "2px", marginTop: "4px" }}>Admin Panel</p>
        </div>
        
        <div className="admin-nav-links">
          <Link href="/admin">Dashboard</Link>
          <Link href="/admin/experience">Experience</Link>
          <Link href="/admin/projects">Projects</Link>
          <Link href="/admin/skills">Skills</Link>
          <Link href="/admin/education">Education</Link>
          
          <div style={{ marginTop: "auto", paddingTop: "20px", borderTop: "1px solid rgba(255,255,255,0.1)" }}>
            <Link href="/" style={{ color: "rgba(255,255,255,0.8)" }}>View Portfolio</Link>
          </div>
        </div>
        
        <div style={{ marginTop: "20px" }}>
          <SignOutButton />
        </div>
      </nav>
      <main className="admin-main">{children}</main>
    </div>
  );
}
