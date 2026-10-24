import { auth } from "@clerk/nextjs/server";
import { EditorClientShell } from "@/components/editor/editor-client-shell";

export default async function EditorPage() {
  await auth.protect();
  return <EditorClientShell />;
}
