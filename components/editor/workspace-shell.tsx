"use client";

import { useState } from "react";
import { Share2, BrainCircuit, PanelLeftClose, PanelLeftOpen, X } from "lucide-react";
import { UserButton } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { ProjectSidebar } from "./project-sidebar";
import { CreateProjectDialog } from "./dialogs/create-project-dialog";
import { RenameProjectDialog } from "./dialogs/rename-project-dialog";
import { DeleteProjectDialog } from "./dialogs/delete-project-dialog";
import { useProjectActions } from "@/hooks/use-project-actions";
import { ShareDialog } from "./share-dialog";
import type { ProjectSummary } from "@/lib/projects";

interface WorkspaceShellProps {
  project: { id: string; name: string };
  isOwner: boolean;
  ownedProjects: ProjectSummary[];
  sharedProjects: ProjectSummary[];
}

export function WorkspaceShell({ project, isOwner, ownedProjects, sharedProjects }: WorkspaceShellProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isAiSidebarOpen, setIsAiSidebarOpen] = useState(false);
  const [isShareOpen, setIsShareOpen] = useState(false);

  const {
    dialog,
    selectedProject,
    name,
    createSuffix,
    slugError,
    deleteError,
    setName,
    isLoading,
    openCreate,
    openRename,
    openDelete,
    close,
    handleCreate,
    handleRename,
    handleDelete,
  } = useProjectActions(project.id);

  return (
    <div className="flex h-screen flex-col bg-base">
      <header className="fixed top-0 left-0 right-0 z-50 h-12 flex items-center bg-surface border-b border-border-default">
        <div className="flex items-center px-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsSidebarOpen((prev) => !prev)}
            className="h-8 w-8 text-copy-muted hover:text-copy-primary"
            aria-label={isSidebarOpen ? "Close sidebar" : "Open sidebar"}
          >
            {isSidebarOpen ? (
              <PanelLeftClose className="h-5 w-5" />
            ) : (
              <PanelLeftOpen className="h-5 w-5" />
            )}
          </Button>
        </div>

        <div className="flex-1 flex items-center justify-center">
          <span className="text-sm font-semibold text-copy-primary">{project.name}</span>
        </div>

        <div className="flex items-center gap-2 px-3">
          <Button
            variant="outline"
            size="sm"
            className="gap-2 h-8"
            onClick={() => setIsShareOpen(true)}
          >
            <Share2 className="h-4 w-4" />
            Share
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsAiSidebarOpen((prev) => !prev)}
            className={`h-8 w-8 transition-colors ${
              isAiSidebarOpen
                ? "text-brand bg-accent-dim"
                : "text-copy-muted hover:text-copy-primary"
            }`}
            aria-label={isAiSidebarOpen ? "Close AI sidebar" : "Open AI sidebar"}
          >
            <BrainCircuit className="h-5 w-5" />
          </Button>
          <UserButton />
        </div>
      </header>

      <div className="flex flex-1 pt-12 overflow-hidden">
        <ProjectSidebar
          isOpen={isSidebarOpen}
          ownedProjects={ownedProjects}
          sharedProjects={sharedProjects}
          activeProjectId={project.id}
          onClose={() => setIsSidebarOpen(false)}
          onNewProject={openCreate}
          onRenameProject={openRename}
          onDeleteProject={openDelete}
        />

        <main className="flex-1 flex items-center justify-center bg-base">
          <div className="flex flex-col items-center gap-2">
            <span className="text-base font-medium text-copy-muted">Canvas coming soon</span>
            <span className="text-sm text-copy-faint">
              Real-time collaborative canvas will render here
            </span>
          </div>
        </main>

        {isAiSidebarOpen && (
          <aside className="w-80 flex flex-col bg-surface border-l border-border-default">
            <div className="flex items-center justify-between px-4 py-3 border-b border-border-default">
              <span className="text-sm font-semibold text-copy-primary">AI Assistant</span>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsAiSidebarOpen(false)}
                className="h-7 w-7 text-copy-muted hover:text-copy-primary"
                aria-label="Close AI sidebar"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex-1 flex items-center justify-center text-copy-muted text-sm">
              AI chat coming soon
            </div>
          </aside>
        )}
      </div>

      <CreateProjectDialog
        open={dialog === "create"}
        name={name}
        suffix={createSuffix}
        slugError={slugError}
        isLoading={isLoading}
        onNameChange={setName}
        onSubmit={handleCreate}
        onClose={close}
      />
      <RenameProjectDialog
        open={dialog === "rename"}
        project={selectedProject}
        name={name}
        slugError={slugError}
        isLoading={isLoading}
        onNameChange={setName}
        onSubmit={handleRename}
        onClose={close}
      />
      <DeleteProjectDialog
        open={dialog === "delete"}
        project={selectedProject}
        error={deleteError}
        isLoading={isLoading}
        onConfirm={handleDelete}
        onClose={close}
      />
      <ShareDialog
        open={isShareOpen}
        projectId={project.id}
        isOwner={isOwner}
        onClose={() => setIsShareOpen(false)}
      />
    </div>
  );
}
