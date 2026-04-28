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
        <div className="admin-nav-links">
          <Link href="/admin">Dashboard</Link>
          <Link href="/admin/experience">Experience</Link>
          <Link href="/admin/projects">Projects</Link>
          <Link href="/admin/skills">Skills</Link>
          <Link href="/admin/education">Education</Link>
          <Link href="/">Back to Portfolio</Link>
        </div>
        <SignOutButton />
      </nav>
      <main className="admin-main">{children}</main>
    </div>
  );
}
