import { auth, currentUser } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { normalizeEmailAddress } from "@/lib/project-access";

export interface ProjectSummary {
  id: string;
  name: string;
}

export async function getProjectsForUser(): Promise<{
  owned: ProjectSummary[];
  shared: ProjectSummary[];
}> {
  const { userId, sessionClaims } = await auth();
  if (!userId) return { owned: [], shared: [] };

  // Prefer email from the JWT (no HTTP call) — requires Clerk JWT template to include
  // {{ user.primary_email_address }} as "email". Falls back to currentUser() otherwise.
  const claimsEmail = (sessionClaims as Record<string, unknown> | null)?.email;
  const primaryEmail =
    normalizeEmailAddress(typeof claimsEmail === "string" ? claimsEmail : undefined) ??
    normalizeEmailAddress((await currentUser())?.primaryEmailAddress?.emailAddress);

  const ownedPromise = prisma.project.findMany({
    where: { ownerId: userId },
    select: { id: true, name: true },
    orderBy: { createdAt: "desc" },
  });

  const sharedPromise = primaryEmail
    ? prisma.projectCollaborator.findMany({
        where: { email: primaryEmail },
        select: { project: { select: { id: true, name: true } } },
        orderBy: { createdAt: "desc" },
      })
    : Promise.resolve([]);

  const [owned, sharedCollabs] = await Promise.all([ownedPromise, sharedPromise]);
  const shared = sharedCollabs.map((c) => c.project);

  return { owned, shared };
}
