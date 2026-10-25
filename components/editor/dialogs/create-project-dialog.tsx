"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toSlug } from "@/lib/slug";

interface CreateProjectDialogProps {
  open: boolean;
  name: string;
  slugError: string;
  isLoading: boolean;
  onNameChange: (value: string) => void;
  onSubmit: () => void;
  onClose: () => void;
}

export function CreateProjectDialog({
  open,
  name,
  slugError,
  isLoading,
  onNameChange,
  onSubmit,
  onClose,
}: CreateProjectDialogProps) {
  const slug = toSlug(name);

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-copy-primary">New Project</DialogTitle>
          <DialogDescription>
            Give your project a name. You can change it later.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-2">
          <Input
            placeholder="Project name"
            value={name}
            onChange={(e) => onNameChange(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && onSubmit()}
            autoFocus
            className="text-copy-primary caret-copy-primary"
          />
          {name && (
            <p className="text-xs text-copy-muted font-mono px-1">
              ghost.ai/<span className="text-copy-secondary">{slug || "…"}</span>
            </p>
          )}
          {slugError && (
            <p className="px-1 text-xs text-state-error" role="alert">
              {slugError}
            </p>
          )}
        </div>

        <DialogFooter>
          <Button variant="ghost" onClick={onClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button onClick={onSubmit} disabled={!name.trim() || isLoading}>
            Create Project
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
