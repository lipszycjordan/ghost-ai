import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
import { AccessDenied } from "@/components/editor/access-denied";
import { WorkspaceShell } from "@/components/editor/workspace-shell";
import { getProjectWithAccess } from "@/lib/project-access";
import { getProjectsForUser } from "@/lib/projects";

interface Props {
  params: Promise<{ roomId: string }>;
}

export default async function EditorRoomPage({ params }: Props) {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  const { roomId } = await params;

  const [project, { owned, shared }] = await Promise.all([
    getProjectWithAccess(roomId),
    getProjectsForUser(),
  ]);

  if (!project) return <AccessDenied />;

  return (
    <WorkspaceShell
      project={project}
      isOwner={project.isOwner}
      ownedProjects={owned}
      sharedProjects={shared}
    />
  );
}
