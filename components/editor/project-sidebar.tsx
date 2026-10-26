"use client";

import Link from "next/link";
import { X, Plus, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { ProjectSummary } from "@/lib/projects";

interface ProjectSidebarProps {
  isOpen: boolean;
  ownedProjects: ProjectSummary[];
  sharedProjects: ProjectSummary[];
  activeProjectId?: string;
  onClose: () => void;
  onNewProject: () => void;
  onRenameProject: (project: ProjectSummary) => void;
  onDeleteProject: (project: ProjectSummary) => void;
}

export function ProjectSidebar({
  isOpen,
  ownedProjects,
  sharedProjects,
  activeProjectId,
  onClose,
  onNewProject,
  onRenameProject,
  onDeleteProject,
}: ProjectSidebarProps) {
  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 sm:bg-transparent"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      <aside
        className={`fixed top-12 left-0 bottom-0 z-50 w-72 flex flex-col bg-surface border-r border-border-default transition-transform duration-200 ease-in-out ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
        aria-label="Project sidebar"
      >
        <div className="flex items-center justify-between px-4 py-3 border-b border-border-default">
          <span className="text-sm font-semibold text-copy-primary">Projects</span>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="h-7 w-7 text-copy-muted hover:text-copy-primary"
            aria-label="Close sidebar"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        <Tabs defaultValue="my-projects" className="flex flex-col flex-1 min-h-0">
          <TabsList className="mx-4 mt-3 mb-2 grid w-auto grid-cols-2">
            <TabsTrigger value="my-projects">My Projects</TabsTrigger>
            <TabsTrigger value="shared">Shared</TabsTrigger>
          </TabsList>

          <ScrollArea className="flex-1 px-2">
            <TabsContent value="my-projects" className="mt-0 pb-2">
              {ownedProjects.length === 0 ? (
                <div className="flex items-center justify-center h-32 text-copy-muted text-sm">
                  No projects yet
                </div>
              ) : (
                <ul className="flex flex-col gap-0.5">
                  {ownedProjects.map((project) => (
                    <li key={project.id}>
                      <ProjectItem
                        project={project}
                        isActive={project.id === activeProjectId}
                        showActions
                        onRename={() => onRenameProject(project)}
                        onDelete={() => onDeleteProject(project)}
                      />
                    </li>
                  ))}
                </ul>
              )}
            </TabsContent>

            <TabsContent value="shared" className="mt-0 pb-2">
              {sharedProjects.length === 0 ? (
                <div className="flex items-center justify-center h-32 text-copy-muted text-sm">
                  No shared projects
                </div>
              ) : (
                <ul className="flex flex-col gap-0.5">
                  {sharedProjects.map((project) => (
                    <li key={project.id}>
                      <ProjectItem
                        project={project}
                        isActive={project.id === activeProjectId}
                        showActions={false}
                      />
                    </li>
                  ))}
                </ul>
              )}
            </TabsContent>
          </ScrollArea>
        </Tabs>

        <div className="px-4 py-3 border-t border-border-default">
          <Button className="w-full gap-2" onClick={onNewProject}>
            <Plus className="h-4 w-4" />
            New Project
          </Button>
        </div>
      </aside>
    </>
  );
}

interface ProjectItemProps {
  project: ProjectSummary;
  isActive: boolean;
  showActions: boolean;
  onRename?: () => void;
  onDelete?: () => void;
}

function ProjectItem({ project, isActive, showActions, onRename, onDelete }: ProjectItemProps) {
  return (
    <Link
      href={`/editor/${project.id}`}
      className={`group flex items-center gap-2 rounded-xl px-2 py-2 transition-colors ${
        isActive ? "bg-accent-dim text-brand" : "hover:bg-elevated text-copy-primary"
      }`}
    >
      <span className="flex-1 text-sm truncate">{project.name}</span>

      {showActions && (
        <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6 text-copy-muted hover:text-copy-primary"
            onClick={(e) => {
              e.preventDefault();
              onRename?.();
            }}
            aria-label={`Rename ${project.name}`}
          >
            <Pencil className="h-3.5 w-3.5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6 text-copy-muted hover:text-state-error"
            onClick={(e) => {
              e.preventDefault();
              onDelete?.();
            }}
            aria-label={`Delete ${project.name}`}
          >
            <Trash2 className="h-3.5 w-3.5" />
          </Button>
        </div>
      )}
    </Link>
  );
}
