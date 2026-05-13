// ---- Database types ----

export interface Profile {
  id: string;
  display_name: string | null;
  created_at: string;
}

export interface Team {
  id: string;
  user_id: string;
  name: string;
  formation: string;
  play_style: string | null;
  created_at: string;
}

export interface Player {
  id: string;
  team_id: string;
  name: string;
  position: string;
  number: number | null;
  strengths: string | null;
  weaknesses: string | null;
  fitness_status: "fit" | "doubtful" | "injured" | "suspended";
  preferred_foot: "left" | "right" | "both";
  age: number | null;
  created_at: string;
}

// ---- AI types ----

export interface MatchInput {
  opponentName: string;
  opponentFormation: string;
  opponentWeaknesses: string;
  matchType: string;
  weather: string;
  teamId: string;
}

export interface TacticalAnalysis {
  suggestedFormation: string;
  tacticalStyle: string;
  pressingIntensity: string;
  keyDangerAreas: string[];
  substitutionStrategy: string[];
  gameplan: string;
  setPieces: string;
}

// ---- Formation data ----

export interface FormationPosition {
  x: number;
  y: number;
  role: string;
}

export const FORMATIONS: Record<string, FormationPosition[]> = {
  "4-3-3": [
    { x: 50, y: 90, role: "GK" },
    { x: 20, y: 72, role: "LB" },
    { x: 38, y: 75, role: "CB" },
    { x: 62, y: 75, role: "CB" },
    { x: 80, y: 72, role: "RB" },
    { x: 30, y: 50, role: "CM" },
    { x: 50, y: 55, role: "CM" },
    { x: 70, y: 50, role: "CM" },
    { x: 20, y: 25, role: "LW" },
    { x: 50, y: 20, role: "ST" },
    { x: 80, y: 25, role: "RW" },
  ],
  "4-4-2": [
    { x: 50, y: 90, role: "GK" },
    { x: 20, y: 72, role: "LB" },
    { x: 38, y: 75, role: "CB" },
    { x: 62, y: 75, role: "CB" },
    { x: 80, y: 72, role: "RB" },
    { x: 20, y: 48, role: "LM" },
    { x: 40, y: 52, role: "CM" },
    { x: 60, y: 52, role: "CM" },
    { x: 80, y: 48, role: "RM" },
    { x: 38, y: 22, role: "ST" },
    { x: 62, y: 22, role: "ST" },
  ],
  "3-5-2": [
    { x: 50, y: 90, role: "GK" },
    { x: 30, y: 75, role: "CB" },
    { x: 50, y: 78, role: "CB" },
    { x: 70, y: 75, role: "CB" },
    { x: 15, y: 50, role: "LWB" },
    { x: 35, y: 52, role: "CM" },
    { x: 50, y: 48, role: "CAM" },
    { x: 65, y: 52, role: "CM" },
    { x: 85, y: 50, role: "RWB" },
    { x: 38, y: 22, role: "ST" },
    { x: 62, y: 22, role: "ST" },
  ],
  "4-2-3-1": [
    { x: 50, y: 90, role: "GK" },
    { x: 20, y: 72, role: "LB" },
    { x: 38, y: 75, role: "CB" },
    { x: 62, y: 75, role: "CB" },
    { x: 80, y: 72, role: "RB" },
    { x: 38, y: 58, role: "CDM" },
    { x: 62, y: 58, role: "CDM" },
    { x: 20, y: 35, role: "LW" },
    { x: 50, y: 38, role: "CAM" },
    { x: 80, y: 35, role: "RW" },
    { x: 50, y: 18, role: "ST" },
  ],
  "5-3-2": [
    { x: 50, y: 90, role: "GK" },
    { x: 15, y: 70, role: "LWB" },
    { x: 33, y: 75, role: "CB" },
    { x: 50, y: 78, role: "CB" },
    { x: 67, y: 75, role: "CB" },
    { x: 85, y: 70, role: "RWB" },
    { x: 30, y: 50, role: "CM" },
    { x: 50, y: 48, role: "CM" },
    { x: 70, y: 50, role: "CM" },
    { x: 38, y: 22, role: "ST" },
    { x: 62, y: 22, role: "ST" },
  ],
};
