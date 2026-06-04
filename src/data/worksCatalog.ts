import type { Locale } from "@/data/i18n";
import type { GalleryItem, Project, ProjectSection } from "@/data/projects";
import { worksCatalogEn } from "@/data/worksCatalog.en";

/** 作品页右侧轮播海报 + 三页同步文案/图片路径 */
export type WorkCatalogEntry = {
  slug: string;
  title: string;
  /** 列表副标题 — 首页 / 作品页 / 过渡动画共用 */
  subtitle: string;
  /** 一句话摘要 — 详情页头图 + SEO */
  summary: string;
  /** 卡片短描述 */
  tagline: string;
  year: string;
  role: string;
  tools: string[];
  tags: string[];
  cover: string;
  /** 详情页分屏图 01–06 */
  gallery: { file: string; alt: string; caption?: string }[];
  /** 作品页右侧竖版海报（仅 portrait，不含横图） */
  stagePosters: { file: string; alt: string }[];
  meta: {
    category: string;
    durationWeeks: number;
    solo: boolean;
    ggacUrl: string;
  };
  sections: ProjectSection[];
  /** Three.js 色相偏移 */
  hueOffset: number;
  speed: number;
  externalUrl?: string;
  featured: boolean;
};

const ARK_BASE = "/works/blender-ark";
const ICE_BASE = "/works/bing-suo-han-chuan";

export const worksCatalogZh: WorkCatalogEntry[] = [
  {
    slug: "blender-ark",
    title: "方舟",
    subtitle: "科幻概念 · 播种计划 · 方舟-7",
    tagline: "承载生命与文明的庇护所",
    summary:
      "方舟-7 是「播种计划」下第七艘、首艘被设计为永久家园的文明方舟——移动的、自给自足的生态城市，以工业尺度与叙事性空间层次呈现星际殖民先驱的使命。",
    year: "2025",
    role: "场景设计师 · 独立制作",
    tools: ["Blender", "Adobe After Effects 2025", "Photoshop"],
    tags: ["科幻概念", "Blender", "游戏场景", "方舟-7"],
    cover: `${ARK_BASE}/cover.jpg`,
    gallery: [
      { file: "01.jpg", alt: "方舟 · 主视角", caption: "方舟-7 轨道主渲染 · 行星与空间站" },
      { file: "02.jpg", alt: "方舟 · 结构解析", caption: "模块分区 · 农业 / 居住 / 水循环 / 引擎" },
      { file: "03.jpg", alt: "方舟 · 世界观", caption: "世界观与历史背景 · 播种计划" },
      { file: "04.jpg", alt: "方舟 · 制作流程", caption: "线框 · 白模 · 材质 · 最终渲染" },
      { file: "05.jpg", alt: "方舟 · 氛围镜头", caption: "九帧电影感选集" },
      { file: "06.jpg", alt: "方舟 · 部分参考", caption: "概念与造型参考集" },
    ],
    stagePosters: [
      { file: "posters/poster-01.jpg", alt: "方舟 · 黑白三联海报" },
      { file: "posters/poster-02.jpg", alt: "方舟 · 竖版主体结构" },
      { file: "posters/poster-03.jpg", alt: "方舟 · 编号叙事海报" },
    ],
    meta: {
      category: "科幻概念",
      durationWeeks: 4,
      solo: true,
      ggacUrl: "https://www.ggac.com/work/detail/1829377",
    },
    sections: [
      {
        id: "overview",
        title: "项目概述",
        body: "类型：科幻概念游戏场景。制作周期 4 周，独立完成。方舟-7 并非传统探索或军事飞船，而是「播种计划」下新一代文明方舟——使命不是快速穿梭星际，而是作为移动生态城市缓缓航行，寻找可殖民星球并建立先驱立足点。",
        media: [
          { type: "image", src: `${ARK_BASE}/01.jpg`, alt: "方舟 · 主视角", caption: "主渲染 · 方舟-7 与行星" },
          { type: "image", src: `${ARK_BASE}/02.jpg`, alt: "方舟 · 结构解析" },
        ],
      },
      {
        id: "world",
        title: "世界观与历史背景",
        body: "地球时代后期，全球联合启动「播种计划」，向深空派遣承载知识、基因库、文化与科技的方舟。方舟-1 至方舟-6 为早期试验型号；方舟-7 是集大成者，首艘真正意义上被设计为「永久家园」的方舟，舱内社会结构类似自治城邦，居民是定居者而非短暂宇航员。",
        media: [
          { type: "image", src: `${ARK_BASE}/03.jpg`, alt: "方舟 · 世界观与历史背景" },
        ],
      },
      {
        id: "structure",
        title: "空间模块与结构",
        body: "场景划分农业圆顶、居住圆顶、水循环与 STL 引擎等核心模块。居住层融合绿化与全息天幕；农业层模拟昼夜与完整生态；中央 AI「Curator」子程序管理光、温与空气质量。设计强调工业尺度、模块可读性与叙事层次。",
        media: [{ type: "image", src: `${ARK_BASE}/05.jpg`, alt: "方舟 · 氛围镜头" }],
      },
      {
        id: "pipeline",
        title: "制作流程",
        body: "Blender 完成场景搭建、硬表面与灯光；Photoshop 处理氛围与合成；After Effects 输出展示动效。从线框、白模到材质与最终渲染，控制大场面数分配、模块化重复与近景细节密度。",
        media: [
          { type: "image", src: `${ARK_BASE}/04.jpg`, alt: "方舟 · 制作流程" },
          { type: "image", src: `${ARK_BASE}/06.jpg`, alt: "方舟 · 部分参考" },
        ],
      },
      {
        id: "ggac",
        title: "GGAC 完整图集",
        body: "该作品完整高清图集与过程展示发布于 GGAC，欢迎跳转查看原页。",
        media: [
          {
            type: "embed",
            url: "https://www.ggac.com/work/detail/1829377",
            caption: "在 GGAC 查看方舟全部图片",
          },
        ],
      },
    ],
    hueOffset: 0,
    speed: 1.05,
    externalUrl: "https://www.ggac.com/work/detail/1829377",
    featured: true,
  },
  {
    slug: "bing-suo-han-chuan",
    title: "冰锁寒川",
    subtitle: "科幻概念 · 寒域环境",
    tagline: "冰封河川与工业遗迹",
    summary:
      "科幻概念寒域场景——冰封河川与工业遗迹交织，以冷色调体积光与结构剪影营造孤寂而壮丽的探索氛围。",
    year: "2025",
    role: "场景设计师 · 独立制作",
    tools: ["Blender", "Adobe After Effects 2025", "Photoshop"],
    tags: ["科幻概念", "Blender", "环境叙事"],
    cover: `${ICE_BASE}/cover.jpg`,
    gallery: [
      { file: "01.jpg", alt: "冰锁寒川 · 主视角", caption: "主渲染" },
      { file: "02.jpg", alt: "冰锁寒川 · 环境全景" },
      { file: "03.jpg", alt: "冰锁寒川 · 氛围" },
      { file: "04.jpg", alt: "冰锁寒川 · 灯光" },
      { file: "05.jpg", alt: "冰锁寒川 · 结构细节" },
      { file: "06.jpg", alt: "冰锁寒川 · 补充角度" },
    ],
    stagePosters: [],
    meta: {
      category: "科幻概念",
      durationWeeks: 3,
      solo: true,
      ggacUrl: "https://www.ggac.com/work/detail/1783137",
    },
    sections: [
      {
        id: "overview",
        title: "项目概述",
        body: "类型：科幻概念环境。制作周期 3 周，独立完成。以「冰锁寒川」为题，构建极寒地貌中的科幻遗迹与人工结构，强调冷暖对比、雾效层次与远景可读性。",
        media: [
          { type: "image", src: `${ICE_BASE}/01.jpg`, alt: "冰锁寒川 · 主视角", caption: "主渲染" },
          { type: "image", src: `${ICE_BASE}/02.jpg`, alt: "冰锁寒川 · 环境全景" },
        ],
      },
      {
        id: "atmosphere",
        title: "氛围与灯光",
        body: "主光偏冷（天光、冰面反射），局部暖色（人工光源、警示标识）作为视觉锚点。通过体积雾与低饱和度材质强化寒域压迫感，同时保留结构剪影的戏剧张力。",
        media: [
          { type: "image", src: `${ICE_BASE}/03.jpg`, alt: "冰锁寒川 · 氛围" },
          { type: "image", src: `${ICE_BASE}/04.jpg`, alt: "冰锁寒川 · 灯光" },
        ],
      },
      {
        id: "detail",
        title: "结构与细节",
        body: "Blender 中完成地形大形、冰封河川与主体建筑；Photoshop 微调色彩与氛围；AE 用于最终展示剪辑。注重近景材质变化与中远景层次递进。",
        media: [
          { type: "image", src: `${ICE_BASE}/05.jpg`, alt: "冰锁寒川 · 结构细节" },
          { type: "image", src: `${ICE_BASE}/06.jpg`, alt: "冰锁寒川 · 补充角度" },
        ],
      },
      {
        id: "ggac",
        title: "GGAC 完整图集",
        body: "该作品完整高清图集发布于 GGAC，欢迎跳转查看原页。",
        media: [
          {
            type: "embed",
            url: "https://www.ggac.com/work/detail/1783137",
            caption: "在 GGAC 查看冰锁寒川全部图片",
          },
        ],
      },
    ],
    hueOffset: -14,
    speed: 0.82,
    externalUrl: "https://www.ggac.com/work/detail/1783137",
    featured: true,
  },
];

function catalogFor(locale: Locale): WorkCatalogEntry[] {
  return locale === "en" ? worksCatalogEn : worksCatalogZh;
}

export function getWorkBySlug(slug: string, locale: Locale = "zh"): WorkCatalogEntry | undefined {
  return catalogFor(locale).find((w) => w.slug === slug);
}

export function getFeaturedWorks(locale: Locale = "zh"): WorkCatalogEntry[] {
  return catalogFor(locale).filter((w) => w.featured);
}

export function toGalleryItem(entry: WorkCatalogEntry): GalleryItem {
  return {
    id: entry.slug,
    title: entry.title,
    subtitle: entry.subtitle,
    cover: entry.cover,
    tags: entry.tags,
    year: entry.year,
    externalUrl: entry.externalUrl,
    featured: entry.featured,
    slug: entry.slug,
  };
}

export function toFeaturedProject(entry: WorkCatalogEntry): Project {
  return {
    slug: entry.slug,
    title: entry.title,
    role: entry.role,
    year: entry.year,
    tools: entry.tools,
    summary: entry.summary,
    cover: entry.cover,
    meta: entry.meta,
    sections: entry.sections,
  };
}
