import "./admin.css";
import { notFound } from "next/navigation";
import { AdminBodyGuard } from "@/components/admin/AdminBodyGuard";
import { isLocalCmsAvailable } from "@/lib/local-cms";

export const metadata = {
  title: "内容管理",
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  if (!isLocalCmsAvailable()) notFound();

  return (
    <>
      <AdminBodyGuard />
      {children}
    </>
  );
}
