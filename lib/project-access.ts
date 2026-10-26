import { auth, currentUser } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

interface CurrentIdentity {
  userId: string;
  primaryEmail: string | undefined;
}

export async function getCurrentIdentity(): Promise<CurrentIdentity | null> {
  const { userId, sessionClaims } = await auth();
  if (!userId) return null;

  const claimsEmail = (sessionClaims as Record<string, unknown> | null)?.email;
  const primaryEmail: string | undefined =
    typeof claimsEmail === "string" && claimsEmail.length > 0
      ? claimsEmail
      : (await currentUser())?.primaryEmailAddress?.emailAddress;

  return { userId, primaryEmail };
}

export async function getProjectWithAccess(
  projectId: string,
): Promise<{ id: string; name: string; isOwner: boolean } | null> {
  const identity = await getCurrentIdentity();
  if (!identity) return null;

  const project = await prisma.project.findUnique({
    where: { id: projectId },
    select: { id: true, name: true, ownerId: true },
  });

  if (!project) return null;
  if (project.ownerId === identity.userId) {
    return { id: project.id, name: project.name, isOwner: true };
  }

  if (!identity.primaryEmail) return null;

  const collab = await prisma.projectCollaborator.findUnique({
    where: { projectId_email: { projectId: project.id, email: identity.primaryEmail } },
    select: { id: true },
  });

  if (!collab) return null;
  return { id: project.id, name: project.name, isOwner: false };
}
