"use client";

import { useState, useEffect, useCallback } from "react";
import { Copy, Check, UserMinus, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface Collaborator {
  email: string;
  name: string | null;
  imageUrl: string | null;
  isOwner: boolean;
}

interface ShareDialogProps {
  open: boolean;
  projectId: string;
  isOwner: boolean;
  onClose: () => void;
}

export function ShareDialog({ open, projectId, isOwner, onClose }: ShareDialogProps) {
  const [collaborators, setCollaborators] = useState<Collaborator[]>([]);
  const [inviteEmail, setInviteEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [inviteError, setInviteError] = useState<string | null>(null);
  const [removingEmails, setRemovingEmails] = useState<Set<string>>(new Set());

  const fetchCollaborators = useCallback(async () => {
    try {
      const res = await fetch(`/api/projects/${projectId}/collaborators`);
      if (res.ok) {
        const data: Collaborator[] = await res.json();
        setCollaborators(data);
      }
    } catch {
      // Silently fail
    }
  }, [projectId]);

  useEffect(() => {
    if (open) fetchCollaborators();
  }, [open, fetchCollaborators]);

  const handleCopyLink = async () => {
    const url = `${window.location.origin}/editor/${projectId}`;
    await navigator.clipboard.writeText(url);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const handleInvite = async () => {
    const email = inviteEmail.trim().toLowerCase();
    if (!email) return;

    setIsLoading(true);
    setInviteError(null);

    try {
      const res = await fetch(`/api/projects/${projectId}/collaborators`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (res.ok) {
        const newCollab: Collaborator = await res.json();
        setCollaborators((prev) =>
          prev.some((c) => c.email === newCollab.email) ? prev : [...prev, newCollab]
        );
        setInviteEmail("");
      } else {
        const data: { error?: string } = await res.json().catch(() => ({}));
        setInviteError(data.error ?? "Failed to invite collaborator");
      }
    } catch {
      setInviteError("Failed to invite collaborator");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemove = async (email: string) => {
    setRemovingEmails((prev) => new Set(prev).add(email));
    try {
      const res = await fetch(
        `/api/projects/${projectId}/collaborators/${encodeURIComponent(email)}`,
        { method: "DELETE" }
      );
      if (res.ok) {
        setCollaborators((prev) => prev.filter((c) => c.email !== email));
      }
    } finally {
      setRemovingEmails((prev) => {
        const next = new Set(prev);
        next.delete(email);
        return next;
      });
    }
  };

  const projectUrl =
    typeof window !== "undefined" ? `${window.location.origin}/editor/${projectId}` : "";

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="sm:max-w-lg bg-elevated border-border-default rounded-3xl overflow-hidden">
        <DialogHeader>
          <DialogTitle className="text-copy-primary">Share</DialogTitle>
        </DialogHeader>

        <div className="space-y-5 pt-1">
          {/* Copy link */}
          <div className="space-y-2">
            <p className="text-xs font-medium text-copy-muted uppercase tracking-wider">
              Project link
            </p>
            <div className="flex items-center gap-2">
              <div className="flex-1 bg-base border border-border-default rounded-xl px-3 py-2 text-sm text-copy-muted truncate font-mono">
                {projectUrl}
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={handleCopyLink}
                className="shrink-0 gap-1.5 rounded-xl"
              >
                {isCopied ? (
                  <>
                    <Check className="h-4 w-4 text-success" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy className="h-4 w-4" />
                    Copy
                  </>
                )}
              </Button>
            </div>
          </div>

          {/* Invite (owners only) */}
          {isOwner && (
            <div className="space-y-2">
              <p className="text-xs font-medium text-copy-muted uppercase tracking-wider">
                Invite by email
              </p>
              <div className="flex items-center gap-2">
                <Input
                  type="email"
                  placeholder="colleague@example.com"
                  value={inviteEmail}
                  onChange={(e) => {
                    setInviteEmail(e.target.value);
                    setInviteError(null);
                  }}
                  onKeyDown={(e) => e.key === "Enter" && handleInvite()}
                  className="flex-1 rounded-xl bg-base border-border-default text-copy-primary placeholder:text-copy-faint"
                />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleInvite}
                  disabled={isLoading || !inviteEmail.trim()}
                  className="shrink-0 gap-1.5 rounded-xl"
                >
                  <UserPlus className="h-4 w-4" />
                  Invite
                </Button>
              </div>
              {inviteError && <p className="text-xs text-error">{inviteError}</p>}
            </div>
          )}

          {/* People with access */}
          <div className="space-y-2">
            <p className="text-xs font-medium text-copy-muted uppercase tracking-wider">
              People with access{collaborators.length > 0 ? ` (${collaborators.length})` : ""}
            </p>
            {collaborators.length === 0 ? (
              <p className="text-sm text-copy-faint py-1">No one has access yet</p>
            ) : (
              <ul className="space-y-1">
                {collaborators.map((collab) => (
                  <li
                    key={collab.email}
                    className="flex items-center gap-3 py-2 px-3 rounded-xl bg-subtle"
                  >
                    {collab.imageUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={collab.imageUrl}
                        alt={collab.name ?? collab.email}
                        className="h-7 w-7 rounded-full shrink-0 object-cover"
                      />
                    ) : (
                      <div className="h-7 w-7 rounded-full bg-elevated border border-border-default flex items-center justify-center shrink-0">
                        <span className="text-xs text-copy-muted font-medium">
                          {(collab.name ?? collab.email)[0].toUpperCase()}
                        </span>
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      {collab.name && (
                        <p className="text-sm font-medium text-copy-primary truncate">
                          {collab.name}
                        </p>
                      )}
                      <p
                        className={`truncate ${
                          collab.name
                            ? "text-xs text-copy-muted"
                            : "text-sm text-copy-primary"
                        }`}
                      >
                        {collab.email}
                      </p>
                    </div>
                    {collab.isOwner ? (
                      <span className="text-xs text-copy-faint shrink-0">Owner</span>
                    ) : (
                      isOwner && (
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleRemove(collab.email)}
                          disabled={removingEmails.has(collab.email)}
                          className="h-7 w-7 text-copy-muted hover:text-error shrink-0"
                          aria-label={`Remove ${collab.email}`}
                        >
                          <UserMinus className="h-4 w-4" />
                        </Button>
                      )
                    )}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
