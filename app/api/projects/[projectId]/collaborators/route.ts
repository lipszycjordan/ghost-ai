import { auth, clerkClient } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentIdentity } from "@/lib/project-access";

interface RouteContext {
  params: Promise<{ projectId: string }>;
}

interface CollaboratorRow {
  email: string;
  name: string | null;
  imageUrl: string | null;
  isOwner: boolean;
}

async function enrichEmail(email: string): Promise<Omit<CollaboratorRow, "isOwner">> {
  try {
    const client = await clerkClient();
    const result = await client.users.getUserList({ emailAddress: [email] });
    const user = result.data[0];
    if (user) {
      const name =
        [user.firstName, user.lastName].filter(Boolean).join(" ").trim() ||
        user.username ||
        null;
      return { email, name, imageUrl: user.imageUrl ?? null };
    }
  } catch {
    // Clerk lookup failed — fall back to email only
  }
  return { email, name: null, imageUrl: null };
}

async function enrichOwner(ownerId: string): Promise<CollaboratorRow> {
  try {
    const client = await clerkClient();
    const user = await client.users.getUser(ownerId);
    const name =
      [user.firstName, user.lastName].filter(Boolean).join(" ").trim() ||
      user.username ||
      null;
    const email = user.emailAddresses[0]?.emailAddress ?? "";
    return { email, name, imageUrl: user.imageUrl ?? null, isOwner: true };
  } catch {
    return { email: "", name: null, imageUrl: null, isOwner: true };
  }
}

export async function GET(_req: NextRequest, { params }: RouteContext) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { projectId } = await params;

  const identity = await getCurrentIdentity();
  if (!identity) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const project = await prisma.project.findUnique({
    where: { id: projectId },
    select: { ownerId: true },
  });

  if (!project) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const isOwner = project.ownerId === identity.userId;
  if (!isOwner) {
    if (!identity.primaryEmail) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    const collab = await prisma.projectCollaborator.findUnique({
      where: { projectId_email: { projectId, email: identity.primaryEmail } },
      select: { id: true },
    });
    if (!collab) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const [ownerRow, collabs] = await Promise.all([
    enrichOwner(project.ownerId),
    prisma.projectCollaborator.findMany({
      where: { projectId },
      orderBy: { createdAt: "asc" },
      select: { email: true },
    }),
  ]);

  const collaboratorRows = await Promise.all(
    collabs.map(async (c) => ({ ...(await enrichEmail(c.email)), isOwner: false }))
  );

  return NextResponse.json([ownerRow, ...collaboratorRows]);
}

export async function POST(req: NextRequest, { params }: RouteContext) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { projectId } = await params;

  const project = await prisma.project.findUnique({
    where: { id: projectId },
    select: { ownerId: true },
  });

  if (!project) return NextResponse.json({ error: "Not found" }, { status: 404 });
  if (project.ownerId !== userId) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const raw: unknown = await req.json().catch(() => ({}));
  const body =
    raw !== null && typeof raw === "object" && !Array.isArray(raw)
      ? (raw as Record<string, unknown>)
      : {};

  const email: string | undefined =
    typeof body.email === "string" && body.email.trim().length > 0
      ? body.email.trim().toLowerCase()
      : undefined;

  if (!email) return NextResponse.json({ error: "email is required" }, { status: 400 });

  await prisma.projectCollaborator.upsert({
    where: { projectId_email: { projectId, email } },
    update: {},
    create: { projectId, email },
  });

  const enriched = await enrichEmail(email);
  return NextResponse.json(enriched, { status: 201 });
}
