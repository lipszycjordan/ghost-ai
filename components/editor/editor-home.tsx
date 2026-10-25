"use client";

import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

interface EditorHomeProps {
  onNewProject: () => void;
}

export function EditorHome({ onNewProject }: EditorHomeProps) {
  return (
    <div className="flex flex-col items-center justify-center h-full gap-3 text-center px-4">
      <h1 className="text-xl font-semibold text-copy-primary">
        Create a project or open an existing one
      </h1>
      <p className="text-sm text-copy-muted">
        Start a new architecture workspace, or choose a project from the sidebar.
      </p>
      <Button onClick={onNewProject} className="mt-2 gap-2">
        <Plus className="h-4 w-4" />
        New Project
      </Button>
    </div>
  );
}
