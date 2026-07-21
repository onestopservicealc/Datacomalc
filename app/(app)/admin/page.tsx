import { auth } from "@/lib/auth/server";
import { ADMIN_EMAILS, isAdmin, listAllowed } from "@/lib/auth/allowlist";
import AdminEmails from "@/components/AdminEmails";

// อ่าน session + query DB → ต้อง dynamic
export const dynamic = "force-dynamic";

/** หน้าจัดการรายชื่ออีเมลที่อนุญาต — เฉพาะ admin */
export default async function AdminPage() {
  const { data: session } = await auth.getSession();

  if (!isAdmin(session?.user?.email)) {
    return (
      <div className="panel">
        <div className="empty">
          <i className="ti ti-lock"></i>
          เฉพาะผู้ดูแลระบบเท่านั้นที่เข้าถึงหน้านี้ได้
        </div>
      </div>
    );
  }

  const list = await listAllowed();
  return <AdminEmails initial={list} adminEmails={ADMIN_EMAILS} />;
}
