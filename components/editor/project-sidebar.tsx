"use client";

import { X, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";

interface ProjectSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ProjectSidebar({ isOpen, onClose }: ProjectSidebarProps) {
  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 z-40"
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

          <ScrollArea className="flex-1 px-4">
            <TabsContent value="my-projects" className="mt-0">
              <div className="flex items-center justify-center h-32 text-copy-muted text-sm">
                No projects yet
              </div>
            </TabsContent>

            <TabsContent value="shared" className="mt-0">
              <div className="flex items-center justify-center h-32 text-copy-muted text-sm">
                No shared projects
              </div>
            </TabsContent>
          </ScrollArea>
        </Tabs>

        <div className="px-4 py-3 border-t border-border-default">
          <Button className="w-full gap-2">
            <Plus className="h-4 w-4" />
            New Project
          </Button>
        </div>
      </aside>
    </>
  );
}
