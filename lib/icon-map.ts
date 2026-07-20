import {
  Activity,
  Award,
  BookOpen,
  Brain,
  Briefcase,
  Camera,
  Cloud,
  Code2,
  Coffee,
  Database,
  Dumbbell,
  Gauge,
  Globe,
  GraduationCap,
  Grid3x3,
  HeartHandshake,
  Lightbulb,
  Link2,
  Lock,
  Mail,
  MapPin,
  Music,
  Palette,
  Phone,
  Plane,
  Puzzle,
  Rocket,
  Server,
  Shield,
  Sparkles,
  Star,
  Target,
  Terminal,
  Trophy,
  Users,
  Zap,
  type LucideIcon,
} from "lucide-react";

/**
 * Curated icon registry backing every `icon` text column (skill_groups, recognitions,
 * interests, social_links). Keeping this as a closed enum — rather than letting the
 * admin type an arbitrary lucide name — is what makes the DB `icon` column safely
 * validatable with a Zod enum and renderable without a dynamic import.
 */
export const ICON_MAP = {
  activity: Activity,
  zap: Zap,
  database: Database,
  cloud: Cloud,
  trophy: Trophy,
  award: Award,
  sparkles: Sparkles,
  brain: Brain,
  puzzle: Puzzle,
  grid: Grid3x3,
  "heart-handshake": HeartHandshake,
  "graduation-cap": GraduationCap,
  star: Star,
  briefcase: Briefcase,
  code: Code2,
  shield: Shield,
  rocket: Rocket,
  target: Target,
  users: Users,
  globe: Globe,
  lightbulb: Lightbulb,
  terminal: Terminal,
  server: Server,
  lock: Lock,
  gauge: Gauge,
  "book-open": BookOpen,
  coffee: Coffee,
  music: Music,
  camera: Camera,
  palette: Palette,
  plane: Plane,
  dumbbell: Dumbbell,
  // lucide-react dropped trademarked brand/logo icons — these alias to a generic
  // external-link glyph rather than pulling in a separate brand-icon package for it.
  link: Link2,
  github: Link2,
  linkedin: Link2,
  mail: Mail,
  phone: Phone,
  "map-pin": MapPin,
} as const satisfies Record<string, LucideIcon>;

export const ICON_KEYS = Object.keys(ICON_MAP) as [keyof typeof ICON_MAP, ...(keyof typeof ICON_MAP)[]];

export type IconKey = keyof typeof ICON_MAP;

export const DEFAULT_ICON: IconKey = "sparkles";

export function getIcon(key: string | null | undefined): LucideIcon {
  if (key && key in ICON_MAP) return ICON_MAP[key as IconKey];
  return ICON_MAP[DEFAULT_ICON];
}
