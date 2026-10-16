export type HighlightIllustrationKind = "beach" | "church" | "palace" | "fortress" | "temple" | "food" | "adventure" | "mountains" | "tea" | "coffee" | "garden" | "waterfall" | "boat" | "evening" | "journey";
export type HighlightTheme = "blue" | "pink" | "yellow";

const rules: Array<[RegExp, HighlightIllustrationKind]> = [
  [/\b(church|basilica|portuguese|goa.*heritage)/i, "church"],
  [/\b(palace|royal)/i, "palace"],
  [/\b(fort|fortress|history)/i, "fortress"],
  [/\b(temple|hoysala|shrine|bhagamandala)/i, "temple"],
  [/\b(food|cuisine|dining|meal|restaurant)/i, "food"],
  [/\b(night|sunset|evening|cafe)/i, "evening"],
  [/\b(waterfall|falls)/i, "waterfall"],
  [/\b(backwater|houseboat|boat|cruise|alleppey)/i, "boat"],
  [/\b(beach|coast|sea|shore|ocean)/i, "beach"],
  [/\b(coffee|estate)/i, "coffee"],
  [/\b(tea|plantation)/i, "tea"],
  [/\b(adventure|trek|hike|jeep|sport|ride)/i, "adventure"],
  [/\b(garden|park|coonoor)/i, "garden"],
  [/\b(nature|hill|mountain|peak|view|mullayanagiri|doddabetta|forest)/i, "mountains"],
];

/** Title wins over supporting copy; a data override can refine any automatic choice. */
export function resolveHighlightIllustration(title: string, description = "", override?: HighlightIllustrationKind): HighlightIllustrationKind {
  if (override) return override;
  return rules.find(([pattern]) => pattern.test(title))?.[1]
    || rules.find(([pattern]) => pattern.test(description))?.[1] || "journey";
}
