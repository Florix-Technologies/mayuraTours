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

/** Keep the approved SVG scenes distinct, including for newly added admin packages.
 * Explicit categories remain authoritative; keyword matches avoid repeated scenes. */
export function resolveHighlightIllustrations(
  highlights: readonly (string | { title?: string; name?: string; description?: string; illustration?: HighlightIllustrationKind; category?: HighlightIllustrationKind })[],
  destination = "",
): HighlightIllustrationKind[] {
  const preferred = highlights.map(item => typeof item === "string"
    ? resolveHighlightIllustration(item)
    : resolveHighlightIllustration(item.title || item.name || "", item.description, item.illustration || item.category));
  const destinationScenes = rules.filter(([pattern]) => pattern.test(destination)).map(([, kind]) => kind);
  const used = new Set<HighlightIllustrationKind>();
  return preferred.map((kind, index) => {
    const item = highlights[index];
    const context = typeof item === "string" ? item : `${item.title || item.name || ""} ${item.description || ""}`;
    const related = rules.filter(([pattern]) => pattern.test(context)).map(([, scene]) => scene);
    const alternatives: HighlightIllustrationKind[] = [...related, ...destinationScenes, "journey", "mountains", "garden", ...rules.map(([, scene]) => scene)];
    const explicit = typeof item !== "string" && (item.illustration || item.category);
    const scene = explicit ? kind : kind !== "journey" && !used.has(kind) ? kind
      : alternatives.find(candidate => !used.has(candidate) && !preferred.includes(candidate))
        || alternatives.find(candidate => !used.has(candidate)) || kind;
    used.add(scene);
    return scene;
  });
}
