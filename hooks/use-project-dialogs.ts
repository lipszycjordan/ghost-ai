"use client";

import { useState } from "react";
import { Project, INITIAL_MOCK_PROJECTS } from "@/lib/mock-projects";
import { toSlug } from "@/lib/slug";

type DialogType = "create" | "rename" | "delete" | null;

export function useProjectDialogs() {
  const [projects, setProjects] = useState<Project[]>(INITIAL_MOCK_PROJECTS);
  const [dialog, setDialog] = useState<DialogType>(null);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [name, setName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [slugError, setSlugError] = useState("");

  const openCreate = () => {
    setName("");
    setSlugError("");
    setSelectedProject(null);
    setDialog("create");
  };

  const openRename = (project: Project) => {
    setSelectedProject(project);
    setName(project.name);
    setSlugError("");
    setDialog("rename");
  };

  const openDelete = (project: Project) => {
    setSelectedProject(project);
    setDialog("delete");
  };

  const close = () => {
    setDialog(null);
    setSelectedProject(null);
    setName("");
    setSlugError("");
  };

  const handleNameChange = (value: string) => {
    setName(value);
    setSlugError("");
  };

  const handleCreate = () => {
    if (!name.trim()) return;
    const slug = toSlug(name.trim());
    if (!slug) {
      setSlugError("Project name must include at least one letter or number.");
      return;
    }

    setIsLoading(true);
    const newProject: Project = {
      id: Date.now().toString(),
      name: name.trim(),
      slug,
      isOwned: true,
    };
    setProjects((prev) => [...prev, newProject]);
    setIsLoading(false);
    close();
  };

  const handleRename = () => {
    if (!selectedProject || !name.trim()) return;
    const slug = toSlug(name.trim());
    if (!slug) {
      setSlugError("Project name must include at least one letter or number.");
      return;
    }

    setIsLoading(true);
    setProjects((prev) =>
      prev.map((p) =>
        p.id === selectedProject.id
          ? { ...p, name: name.trim(), slug }
          : p
      )
    );
    setIsLoading(false);
    close();
  };

  const handleDelete = () => {
    if (!selectedProject) return;
    setIsLoading(true);
    setProjects((prev) => prev.filter((p) => p.id !== selectedProject.id));
    setIsLoading(false);
    close();
  };

  return {
    projects,
    dialog,
    selectedProject,
    name,
    slugError,
    setName: handleNameChange,
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
