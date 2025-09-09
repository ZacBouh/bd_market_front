export const ComicBookScanPart = {
  FRONT_COVER: "Front Cover",
  BACK_COVER: "Back Cover",
  SPINE: "Spine", // aka "dos"
  INSIDE_FRONT_COVER: "Inside Front Cover",
  INSIDE_BACK_COVER: "Inside Back Cover",
  TITLE_PAGE: "Title / Credits page", // credits / indicia
  INTERIOR_PAGE: "Interior Page",
} as const;

export type ComicBookScanPart = keyof typeof ComicBookScanPart;
