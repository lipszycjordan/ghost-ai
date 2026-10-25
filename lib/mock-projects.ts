export interface Project {
  id: string;
  name: string;
  slug: string;
  isOwned: boolean;
}

export const INITIAL_MOCK_PROJECTS: Project[] = [
  { id: "1", name: "E-commerce Platform", slug: "e-commerce-platform", isOwned: true },
  { id: "2", name: "Chat Service", slug: "chat-service", isOwned: true },
  { id: "3", name: "Analytics Pipeline", slug: "analytics-pipeline", isOwned: false },
];
