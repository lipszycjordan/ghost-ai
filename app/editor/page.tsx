import { auth } from "@clerk/nextjs/server";
import { EditorClientShell } from "@/components/editor/editor-client-shell";
import { getProjectsForUser } from "@/lib/projects";

export default async function EditorPage() {
  await auth.protect();
  const { owned, shared } = await getProjectsForUser();
  return <EditorClientShell ownedProjects={owned} sharedProjects={shared} />;
}
