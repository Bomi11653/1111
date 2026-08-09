import type { ModuleConfig, ModulePageKey, ModulesContent } from "@/lib/cms-types";

export function getEnabledModules(modules: ModuleConfig[]): ModuleConfig[] {
  return [...modules].filter((m) => m.enabled).sort((a, b) => a.order - b.order);
}

export function isModuleEnabled(modules: ModuleConfig[], id: string): boolean {
  const mod = modules.find((m) => m.id === id || m.key === id);
  return mod?.enabled ?? true;
}

export function getModule(modules: ModuleConfig[], id: string): ModuleConfig | undefined {
  return modules.find((m) => m.id === id || m.key === id);
}

export function getModuleTitle(
  modules: ModuleConfig[],
  id: string,
  fallback: string,
): string {
  return getModule(modules, id)?.title || fallback;
}

export function getModuleDescription(
  modules: ModuleConfig[],
  id: string,
  fallback: string,
): string {
  return getModule(modules, id)?.description || fallback;
}

export function getPageModules(content: ModulesContent, page: ModulePageKey): ModuleConfig[] {
  return content[page] ?? [];
}
