/** Three.js 联动视觉 — 色相偏移随生成式主题变化 */
export type ImmersiveVisual = {
  slug: string;
  title: string;
  subtitle: string;
  year: string;
  /** 相对主题 hue 的偏移（度） */
  hueOffset: number;
  speed: number;
};

export const immersiveVisuals: ImmersiveVisual[] = [
  {
    slug: "blender-ark",
    title: "blender 方舟",
    subtitle: "科幻概念 · 游戏场景",
    year: "2025",
    hueOffset: 0,
    speed: 1.05,
  },
  {
    slug: "bing-suo-han-chuan",
    title: "冰锁寒川",
    subtitle: "科幻概念 · 寒域环境",
    year: "2025",
    hueOffset: -14,
    speed: 0.82,
  },
];

export function getImmersiveVisual(slug: string): ImmersiveVisual | undefined {
  return immersiveVisuals.find((v) => v.slug === slug);
}
