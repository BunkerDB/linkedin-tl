declare const Dimension: {
  REGION: "REGION";
  COUNTRY: "COUNTRY";
  SENIORITY: "SENIORITY";
  INDUSTRY: "INDUSTRY";
  FUNCTION: "FUNCTION";
  STAFF_COUNT_RANGE: "STAFF_COUNT_RANGE";
};

export type Dimension = typeof Dimension[keyof typeof Dimension];
