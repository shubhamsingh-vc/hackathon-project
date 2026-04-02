type CreatorProfile = {
  niche: string;
  targetAudience: string;
  goals: string[];
};

export function buildCreatorContext(profile: CreatorProfile | null | undefined): string {
  if (!profile) return "";

  const parts: string[] = [];

  if (profile.niche) {
    parts.push(`Niche: ${profile.niche}`);
  }
  if (profile.targetAudience) {
    parts.push(`Target audience: ${profile.targetAudience}`);
  }
  if (profile.goals && profile.goals.length > 0) {
    parts.push(`Content goals: ${profile.goals.join(", ")}`);
  }

  if (parts.length === 0) return "";

  return `Creator context:\n${parts.map((p) => `- ${p}`).join("\n")}`;
}
