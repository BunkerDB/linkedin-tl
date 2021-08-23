declare const Edge: {
  REACTIONS: "REACTIONS";
  METRICS: "METRICS";
  VIDEO_ANALYTICS: "VIDEO_ANALYTICS";
  MEDIA: "MEDIA";
};

export type Edge = typeof Edge[keyof typeof Edge];
