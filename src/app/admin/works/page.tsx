import { redirect } from "next/navigation";

export default function AdminWorksRedirect() {
  redirect("/admin/projects");
}
