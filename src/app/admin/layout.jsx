import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import SignOutButton from "@/components/SignOutButton";
import "../../admin.css";

export default async function AdminLayout({ children }) {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/");
  }

  return (
    <div className='admin-container' style={{ display: "flex", minHeight: "100vh" }}>
      <aside
        className='admin-sidebar'
        style={{
          width: "250px",
          backgroundColor: "var(--brand)",
          color: "white",
          padding: "40px 20px",
          display: "flex",
          flexDirection: "column",
          gap: "20px",
        }}
      >
        <h2 style={{ fontSize: "20px", marginBottom: "20px" }}>Admin Panel</h2>
        <nav style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          <Link href='/admin' className='admin-nav-link'>
            Dashboard Home
          </Link>
          <Link href='/admin/projects' className='admin-nav-link'>
            Manage Projects
          </Link>
          <Link href='/admin/experience' className='admin-nav-link'>
            Manage Experience
          </Link>
          <Link href='/admin/skills' className='admin-nav-link'>
            Manage Skills
          </Link>
          <Link href='/admin/education' className='admin-nav-link'>
            Manage Education
          </Link>
        </nav>
        <div style={{ marginTop: "auto" }}>
          <SignOutButton />
        </div>
      </aside>
      <main style={{ flex: 1, padding: "40px", backgroundColor: "#f0f0f0" }}>
        {children}
      </main>
    </div>
  );
}
