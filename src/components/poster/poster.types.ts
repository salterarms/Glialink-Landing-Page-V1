import type { PosterSection } from "@/lib/copy";

export type PosterState = "grid" | "expanded";

export interface PosterContextType {
  activeId: string | null;
  state: PosterState;
  setActiveId: (id: string | null) => void;
  setState: (state: PosterState) => void;
}

export interface PosterTileProps {
  section: PosterSection;
  isActive: boolean;
  onClick: () => void;
}

export interface PosterExpandedViewProps {
  section: PosterSection | null;
  onClose: () => void;
  isContained?: boolean;
}

export interface PosterGridProps {
  sections: PosterSection[];
  activeId: string | null;
  onTileClick: (id: string) => void;
}
