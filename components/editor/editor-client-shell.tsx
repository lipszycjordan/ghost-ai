"use client";

import { useState } from "react";
import { EditorNavbar } from "./editor-navbar";
import { ProjectSidebar } from "./project-sidebar";
import { EditorHome } from "./editor-home";
import { CreateProjectDialog } from "./dialogs/create-project-dialog";
import { RenameProjectDialog } from "./dialogs/rename-project-dialog";
import { DeleteProjectDialog } from "./dialogs/delete-project-dialog";
import { useProjectActions } from "@/hooks/use-project-actions";
import type { ProjectSummary } from "@/lib/projects";

interface EditorClientShellProps {
  ownedProjects: ProjectSummary[];
  sharedProjects: ProjectSummary[];
}

export function EditorClientShell({ ownedProjects, sharedProjects }: EditorClientShellProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const {
    dialog,
    selectedProject,
    name,
    createSuffix,
    slugError,
    setName,
    isLoading,
    openCreate,
    openRename,
    openDelete,
    close,
    handleCreate,
    handleRename,
    handleDelete,
  } = useProjectActions();

  return (
    <div className="flex h-screen bg-base">
      <EditorNavbar
        isSidebarOpen={isSidebarOpen}
        onToggleSidebar={() => setIsSidebarOpen((prev) => !prev)}
      />

      <ProjectSidebar
        isOpen={isSidebarOpen}
        ownedProjects={ownedProjects}
        sharedProjects={sharedProjects}
        onClose={() => setIsSidebarOpen(false)}
        onNewProject={openCreate}
        onRenameProject={openRename}
        onDeleteProject={openDelete}
      />

      <main className="flex-1 pt-12">
        <EditorHome onNewProject={openCreate} />
      </main>

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
        isLoading={isLoading}
        onConfirm={handleDelete}
        onClose={close}
      />
    </div>
  );
}
