import { ProjectEditorClient } from "@/components/admin/projects/ProjectEditorClient";

export const metadata = { title: "编辑项目" };

type Props = { params: Promise<{ id: string }> };

export default async function AdminEditProjectPage({ params }: Props) {
  const { id } = await params;
  return <ProjectEditorClient projectId={id} />;
}
