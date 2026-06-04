import type { Locale } from "@/data/i18n";

export type SiteLocaleContent = {
  name: string;
  title: string;
  tagline: string;
  headline: string;
  locationCity: string;
  experienceRole: string;
  experienceSummary: string;
  philosophy: readonly string[];
  skills: readonly { name: string; level: number; category: string }[];
  featuredWorks: readonly { slug: string; title: string; year: string; meta: string }[];
};

export const siteLocales: Record<Locale, SiteLocaleContent> = {
  zh: {
    name: "郑荣成",
    title: "游戏场景设计师",
    tagline: "专注 3D 环境艺术",
    headline: "用光影和细节打造沉浸式游戏世界",
    locationCity: "广东 东莞",
    experienceRole: "游戏场景设计师 · 3D 环境艺术",
    experienceSummary:
      "参与游戏场景全流程制作：概念氛围、模块化资产、灯光烘焙与展示动效，注重叙事空间与可玩性节奏。",
    philosophy: [
      "场景首先是「可体验的空间」——动线、视线与情绪曲线，与单帧画面同样重要。",
      "光影是叙事工具：冷暖对比、体积雾与局部高光，引导注意力并暗示剧情张力。",
      "在预算内追求密度：模块化资产、可复用材质与合理 LOD，让美感可持续落地。",
    ],
    skills: [
      { name: "Blender", level: 88, category: "3D 场景 · 灯光 · 渲染" },
      { name: "Photoshop", level: 82, category: "氛围合成 · 材质细化" },
      { name: "Adobe After Effects 2025", level: 75, category: "展示动效 · 叙事转场" },
      { name: "Adobe Premiere Pro", level: 70, category: "作品剪辑 · 节奏呈现" },
    ],
    featuredWorks: [
      { slug: "blender-ark", title: "方舟", year: "2025", meta: "科幻概念 · 播种计划 · 4 周独立制作" },
      { slug: "bing-suo-han-chuan", title: "冰锁寒川", year: "2025", meta: "科幻寒域环境 · 3 周独立制作" },
    ],
  },
  en: {
    name: "Zheng Rongcheng",
    title: "Game Environment Artist",
    tagline: "3D Environment Art",
    headline: "Crafting immersive game worlds through light, shadow, and detail.",
    locationCity: "Dongguan, Guangdong",
    experienceRole: "Game Environment Artist · 3D Environment Art",
    experienceSummary:
      "Full-cycle game environment production—concept mood, modular assets, light baking, and presentation motion—with emphasis on narrative space and playable rhythm.",
    philosophy: [
      "A scene is first an experiential space—flow, sightlines, and emotional curves matter as much as a hero frame.",
      "Light is narrative: warm/cool contrast, volumetric fog, and local highlights guide attention and imply story tension.",
      "Density within budget: modular assets, reusable materials, and sensible LOD keep beauty shippable.",
    ],
    skills: [
      { name: "Blender", level: 88, category: "3D scenes · lighting · rendering" },
      { name: "Photoshop", level: 82, category: "Mood comp · texture polish" },
      { name: "Adobe After Effects 2025", level: 75, category: "Showreel motion · transitions" },
      { name: "Adobe Premiere Pro", level: 70, category: "Portfolio editing · pacing" },
    ],
    featuredWorks: [
      { slug: "blender-ark", title: "Ark", year: "2025", meta: "Sci-fi concept · Seeding Initiative · 4 weeks solo" },
      {
        slug: "bing-suo-han-chuan",
        title: "Ice Lock River",
        year: "2025",
        meta: "Sci-fi cold environment · 3 weeks solo",
      },
    ],
  },
};
