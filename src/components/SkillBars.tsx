import { site } from "@/data/site";

const iconMap: Record<string, string> = {
  Blender: "B",
  Photoshop: "Ps",
  "Adobe After Effects 2025": "Ae",
  "Adobe Premiere Pro": "Pr",
};

export function SkillBars() {
  return (
    <ul className="space-y-6">
      {site.skills.map((skill) => (
        <li key={skill.name}>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-3">
              <span
                className="flex h-9 w-9 items-center justify-center rounded-lg bg-surface-elevated border border-border text-xs font-semibold text-accent"
                aria-hidden
              >
                {iconMap[skill.name] ?? "◆"}
              </span>
              <div>
                <p className="text-foreground text-sm font-medium">{skill.name}</p>
                <p className="text-xs text-muted">{skill.category}</p>
              </div>
            </div>
            <span className="text-sm text-muted tabular-nums">{skill.level}%</span>
          </div>
          <div className="h-1.5 rounded-full bg-border overflow-hidden">
            <div
              className="h-full rounded-full bg-accent transition-all duration-1000"
              style={{ width: `${skill.level}%` }}
              role="progressbar"
              aria-valuenow={skill.level}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-label={`${skill.name} 熟练度`}
            />
          </div>
        </li>
      ))}
    </ul>
  );
}
