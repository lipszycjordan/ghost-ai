"use client";

import { useState } from "react";
import { EditorNavbar } from "./editor-navbar";
import { ProjectSidebar } from "./project-sidebar";
import { EditorHome } from "./editor-home";
import { CreateProjectDialog } from "./dialogs/create-project-dialog";
import { RenameProjectDialog } from "./dialogs/rename-project-dialog";
import { DeleteProjectDialog } from "./dialogs/delete-project-dialog";
import { useProjectDialogs } from "@/hooks/use-project-dialogs";

export function EditorClientShell() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const {
    projects,
    dialog,
    selectedProject,
    name,
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
  } = useProjectDialogs();

  return (
    <div className="flex h-screen bg-base">
      <EditorNavbar
        isSidebarOpen={isSidebarOpen}
        onToggleSidebar={() => setIsSidebarOpen((prev) => !prev)}
      />

      <ProjectSidebar
        isOpen={isSidebarOpen}
        projects={projects}
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
