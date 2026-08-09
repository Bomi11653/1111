import "./admin.css";
import { AdminBodyGuard } from "@/components/admin/AdminBodyGuard";

export const metadata = {
  title: "内容管理",
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <AdminBodyGuard />
      {children}
    </>
  );
}
