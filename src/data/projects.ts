export type MediaBlock =
  | { type: "image"; src: string; alt: string; caption?: string }
  | { type: "video"; src: string; poster?: string; caption?: string; external?: boolean }
  | { type: "embed"; url: string; caption?: string };

export type ProjectSection = {
  id: string;
  title: string;
  body: string;
  media?: MediaBlock[];
};

export type GalleryItem = {
  id: string;
  title: string;
  subtitle: string;
  cover: string;
  tags: string[];
  year: string;
  externalUrl?: string;
  mediaType?: "image" | "video";
  featured: boolean;
  slug?: string;
};

export type ProjectMeta = {
  category: string;
  durationWeeks: number;
  solo: boolean;
  ggacUrl: string;
};

export type Project = {
  slug: string;
  title: string;
  role: string;
  year: string;
  tools: string[];
  summary: string;
  cover: string;
  meta: ProjectMeta;
  sections: ProjectSection[];
};

const arkImages = (n: number) =>
  `/works/blender-ark/${String(n).padStart(2, "0")}.jpg`;

const iceImages = (n: number) =>
  `/works/bing-suo-han-chuan/${String(n).padStart(2, "0")}.jpg`;

/** 从 GGAC 下载渲染图后放入 public/works/ 对应文件夹 */
export const galleryItems: GalleryItem[] = [
  {
    id: "g1",
    title: "blender 方舟",
    subtitle: "科幻概念 · 游戏场景 · 独立完成",
    cover: "/works/blender-ark/cover.jpg",
    tags: ["科幻概念", "Blender", "游戏场景"],
    year: "2025",
    externalUrl: "https://www.ggac.com/work/detail/1829377",
    featured: true,
    slug: "blender-ark",
  },
  {
    id: "g2",
    title: "冰锁寒川",
    subtitle: "科幻概念 · 寒域环境 · 独立完成",
    cover: "/works/bing-suo-han-chuan/cover.jpg",
    tags: ["科幻概念", "Blender", "环境叙事"],
    year: "2025",
    externalUrl: "https://www.ggac.com/work/detail/1783137",
    featured: true,
    slug: "bing-suo-han-chuan",
  },
];

export const featuredProjects: Project[] = [
  {
    slug: "blender-ark",
    title: "blender 方舟",
    role: "场景设计师 · 独立制作",
    year: "2025",
    tools: ["Blender", "Adobe After Effects 2025", "Photoshop"],
    summary:
      "科幻概念游戏场景「方舟-7」——人类播种计划中的永久家园级方舟，强调宏大尺度、工业结构可读性与叙事性空间层次。",
    cover: "/works/blender-ark/cover.jpg",
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
        body: "类型：科幻概念游戏场景。制作周期 4 周，独立完成。以「播种计划」世界观为背景，方舟-7 是集大成者的首艘永久家园级方舟，规模与技术远超早期试验型号，舱内社会结构类似自治城邦。",
        media: [
          {
            type: "image",
            src: arkImages(1),
            alt: "blender 方舟 · 主视角",
            caption: "主渲染 · 图源 GGAC 作品页",
          },
          {
            type: "image",
            src: arkImages(2),
            alt: "blender 方舟 · 全景",
          },
        ],
      },
      {
        id: "world",
        title: "世界观与空间叙事",
        body: "地球时代后期，面对资源枯竭与地缘政治不稳定，全球联合启动「播种计划」，向深空派遣承载知识、基因库、文化与科技的方舟。方舟-1 至方舟-6 为早期试验型号；方舟-7 为首个被设计为永久家园的方舟。场景设计需体现工业尺度、居住模块与公共空间的层次，以及「一生以船为家」的定居者社会氛围。",
        media: [
          {
            type: "image",
            src: arkImages(3),
            alt: "blender 方舟 · 空间层次",
          },
          {
            type: "image",
            src: arkImages(4),
            alt: "blender 方舟 · 细节",
          },
        ],
      },
      {
        id: "pipeline",
        title: "制作流程",
        body: "在 Blender 中完成场景搭建、硬表面与灯光；Photoshop 处理氛围与合成；After Effects 输出展示动效。重点控制大场景的面数分配、模块化重复与近景细节密度。",
        media: [
          {
            type: "image",
            src: arkImages(5),
            alt: "blender 方舟 · 灯光氛围",
          },
          {
            type: "image",
            src: arkImages(6),
            alt: "blender 方舟 · 补充角度",
          },
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
            caption: "在 GGAC 查看 blender 方舟 全部图片",
          },
        ],
      },
    ],
  },
  {
    slug: "bing-suo-han-chuan",
    title: "冰锁寒川",
    role: "场景设计师 · 独立制作",
    year: "2025",
    tools: ["Blender", "Adobe After Effects 2025", "Photoshop"],
    summary:
      "科幻概念寒域场景——冰封河川与工业遗迹交织，以冷色调体积光与结构剪影营造孤寂而壮丽的探索氛围。",
    cover: "/works/bing-suo-han-chuan/cover.jpg",
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
          {
            type: "image",
            src: iceImages(1),
            alt: "冰锁寒川 · 主视角",
            caption: "主渲染 · 图源 GGAC 作品页",
          },
          {
            type: "image",
            src: iceImages(2),
            alt: "冰锁寒川 · 环境全景",
          },
        ],
      },
      {
        id: "atmosphere",
        title: "氛围与灯光",
        body: "主光偏冷（天光、冰面反射），局部暖色（人工光源、警示标识）作为视觉锚点。通过体积雾与低饱和度材质强化寒域压迫感，同时保留结构剪影的戏剧张力。",
        media: [
          {
            type: "image",
            src: iceImages(3),
            alt: "冰锁寒川 · 氛围",
          },
          {
            type: "image",
            src: iceImages(4),
            alt: "冰锁寒川 · 灯光",
          },
        ],
      },
      {
        id: "detail",
        title: "结构与细节",
        body: "Blender 中完成地形大形、冰封河川与主体建筑；Photoshop 微调色彩与氛围；AE 用于最终展示剪辑。注重近景材质变化与中远景层次递进。",
        media: [
          {
            type: "image",
            src: iceImages(5),
            alt: "冰锁寒川 · 结构细节",
          },
          {
            type: "image",
            src: iceImages(6),
            alt: "冰锁寒川 · 补充角度",
          },
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
            caption: "在 GGAC 查看冰锁寒川 全部图片",
          },
        ],
      },
    ],
  },
];

export function getProjectBySlug(slug: string): Project | undefined {
  return featuredProjects.find((p) => p.slug === slug);
}

export function getFeaturedGallery(): GalleryItem[] {
  return galleryItems.filter((g) => g.featured);
}

export function getHomePreview(): GalleryItem[] {
  return galleryItems.filter((g) => g.featured);
}
