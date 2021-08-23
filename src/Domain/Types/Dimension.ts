declare const Dimension: {
  REGION: "REGION";
  COUNTRY: "COUNTRY";
  SENIORITY: "SENIORITY";
  INDUSTRY: "INDUSTRY";
  FUNCTION: "FUNCTION";
};

export type Dimension = typeof Dimension[keyof typeof Dimension];
