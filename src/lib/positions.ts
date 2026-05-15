import { Player } from "@/types";

const GROUP_ORDER = ["Goalkeepers", "Defenders", "Midfielders", "Forwards", "Other"];

export function getPositionGroup(position: string): string {
  const p = position.toUpperCase();
  if (p.includes("GK") || p.includes("GOAL")) return "Goalkeepers";
  if (
    p.includes("CB") ||
    p.includes("LB") ||
    p.includes("RB") ||
    p.includes("DEF") ||
    p.includes("BACK")
  )
    return "Defenders";
  if (
    p.includes("CM") ||
    p.includes("CDM") ||
    p.includes("CAM") ||
    p.includes("MID") ||
    p.includes("DM")
  )
    return "Midfielders";
  if (
    p.includes("ST") ||
    p.includes("FW") ||
    p.includes("WING") ||
    p.includes("STRIKER") ||
    p.includes("FORWARD") ||
    p.includes("LW") ||
    p.includes("RW")
  )
    return "Forwards";
  return "Other";
}

export function groupPlayersByPosition(players: Player[]): Record<string, Player[]> {
  const groups: Record<string, Player[]> = {};
  for (const player of players) {
    const group = getPositionGroup(player.position);
    if (!groups[group]) groups[group] = [];
    groups[group].push(player);
  }
  for (const key of Object.keys(groups)) {
    groups[key].sort((a, b) => (a.number ?? 99) - (b.number ?? 99));
  }
  return GROUP_ORDER.filter((g) => groups[g]?.length).reduce(
    (acc, g) => {
      acc[g] = groups[g];
      return acc;
    },
    {} as Record<string, Player[]>
  );
}

export function playerInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}
