"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toSlug } from "@/lib/slug";
import type { ProjectSummary } from "@/lib/projects";

type DialogType = "create" | "rename" | "delete" | null;

function generateSuffix(): string {
  return Math.random().toString(36).slice(2, 7);
}

export function useProjectActions(activeProjectId?: string) {
  const router = useRouter();
  const [dialog, setDialog] = useState<DialogType>(null);
  const [selectedProject, setSelectedProject] = useState<ProjectSummary | null>(null);
  const [name, setNameState] = useState("");
  const [createSuffix, setCreateSuffix] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [slugError, setSlugError] = useState("");

  const openCreate = () => {
    setNameState("");
    setSlugError("");
    setSelectedProject(null);
    setCreateSuffix(generateSuffix());
    setDialog("create");
  };

  const openRename = (project: ProjectSummary) => {
    setSelectedProject(project);
    setNameState(project.name);
    setSlugError("");
    setDialog("rename");
  };

  const openDelete = (project: ProjectSummary) => {
    setSelectedProject(project);
    setDialog("delete");
  };

  const close = () => {
    setDialog(null);
    setSelectedProject(null);
    setNameState("");
    setSlugError("");
  };

  const setName = (value: string) => {
    setNameState(value);
    setSlugError("");
  };

  const handleCreate = async () => {
    if (!name.trim()) return;
    const slug = toSlug(name.trim());
    if (!slug) {
      setSlugError("Project name must include at least one letter or number.");
      return;
    }

    const id = `${slug}-${createSuffix}`;

    setIsLoading(true);
    try {
      const res = await fetch("/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name.trim(), id }),
      });

      if (!res.ok) throw new Error("Failed to create project");

      const project = await res.json() as { id: string };
      close();
      router.push(`/editor/${project.id}`);
    } catch {
      setSlugError("Failed to create project. Please try again.");
      setIsLoading(false);
    }
  };

  const handleRename = async () => {
    if (!selectedProject || !name.trim()) return;
    const slug = toSlug(name.trim());
    if (!slug) {
      setSlugError("Project name must include at least one letter or number.");
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch(`/api/projects/${selectedProject.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name.trim() }),
      });

      if (!res.ok) throw new Error("Failed to rename project");

      close();
      router.refresh();
    } catch {
      setSlugError("Failed to rename project. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedProject) return;

    setIsLoading(true);
    try {
      const res = await fetch(`/api/projects/${selectedProject.id}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error("Failed to delete project");

      close();
      if (activeProjectId === selectedProject.id) {
        router.push("/editor");
      } else {
        router.refresh();
      }
    } catch {
      setIsLoading(false);
      close();
    }
  };

  return {
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
  };
}
