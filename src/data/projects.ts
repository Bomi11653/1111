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
  /** 外部链接：B站、GGAC 等 */
  externalUrl?: string;
  mediaType?: "image" | "video";
  featured: boolean;
  slug?: string;
};

export type Project = {
  slug: string;
  title: string;
  role: string;
  year: string;
  tools: string[];
  summary: string;
  cover: string;
  heroVideo?: string;
  sections: ProjectSection[];
};

/** 作品列表（叠页展示）— 替换 cover 为你的作品图路径 */
export const galleryItems: GalleryItem[] = [
  {
    id: "g1",
    title: "古镇夜雨",
    subtitle: "叙事向开放场景 · 灯光与氛围",
    cover: "/works/covers/ancient-town.jpg",
    tags: ["Blender", "UE5", "环境叙事"],
    year: "2025",
    externalUrl: "https://space.bilibili.com/279855573",
    mediaType: "video",
    featured: true,
    slug: "ancient-town-night",
  },
  {
    id: "g2",
    title: "轨道补给站",
    subtitle: "科幻工业环境 · 模块化资产",
    cover: "/works/covers/sci-fi-station.jpg",
    tags: ["硬表面", "模块化", "PBR"],
    year: "2025",
    featured: true,
    slug: "orbital-supply-hub",
  },
  {
    id: "g3",
    title: "遗迹峡谷",
    subtitle: "自然地貌 · 植被与岩石 sculpt",
    cover: "/works/covers/ruins-canyon.jpg",
    tags: ["地貌", "植被", "氛围"],
    year: "2024",
    externalUrl: "https://www.ggac.com/user-center/home/work/list?uid=674218",
    featured: true,
    slug: "ruins-canyon",
  },
  {
    id: "g4",
    title: "室内关卡原型",
    subtitle: "白盒到美术阶段对比",
    cover: "/works/covers/interior-blockout.jpg",
    tags: ["关卡", "灯光烘焙"],
    year: "2024",
    featured: false,
  },
];

export const featuredProjects: Project[] = [
  {
    slug: "ancient-town-night",
    title: "古镇夜雨",
    role: "场景设计师 · 环境美术",
    year: "2025",
    tools: ["Blender", "Substance", "Unreal Engine 5"],
    summary:
      "以江南古镇为蓝本，强调雨夜霓虹与石板反射的叙事氛围。负责整体布局、关键资产与三级灯光方案。",
    cover: "/works/covers/ancient-town.jpg",
    sections: [
      {
        id: "overview",
        title: "项目概述",
        body: "目标是在单关卡内完成「进入—驻足—高潮—撤离」的情绪曲线。通过与策划对齐的动线，用灯笼、雨棚与水面反射引导玩家视线。",
        media: [
          {
            type: "image",
            src: "/works/ancient-town/01-hero.jpg",
            alt: "古镇主视角",
            caption: "主广场视角 · 待替换为你的渲染图",
          },
        ],
      },
      {
        id: "process",
        title: "制作流程",
        body: "从氛围板与灰盒开始，确定建筑模数与街道宽度；中期完成模块化墙面、屋面与道具；后期以体积雾、局部点光与湿润材质强化雨夜质感。",
        media: [
          {
            type: "image",
            src: "/works/ancient-town/02-blockout.jpg",
            alt: "灰盒阶段",
          },
          {
            type: "video",
            src: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/video/dummy.mp4",
            poster: "/works/covers/ancient-town.jpg",
            caption: "替换为你的 B 站或本地演示视频",
            external: true,
          },
        ],
      },
      {
        id: "lighting",
        title: "灯光与氛围",
        body: "主光偏冷（月光），辅光偏暖（灯笼、窗内），在湿地面形成长反射条。避免全局过曝，保留暗部层次以支撑恐怖/悬疑向叙事。",
        media: [
          {
            type: "image",
            src: "/works/ancient-town/03-lighting.jpg",
            alt: "灯光 breakdown",
          },
        ],
      },
      {
        id: "result",
        title: "成果与反思",
        body: "在有限面数下通过重复模块与装饰物密度差异，拉开近中远景可读性。下一步会优化远景 impostor 与烘焙时间。",
        media: [
          {
            type: "embed",
            url: "https://space.bilibili.com/279855573",
            caption: "完整过程视频见 Bilibili 空间",
          },
        ],
      },
    ],
  },
  {
    slug: "orbital-supply-hub",
    title: "轨道补给站",
    role: "环境艺术家",
    year: "2025",
    tools: ["Blender", "Photoshop", "UE5"],
    summary:
      "近未来工业科幻场景，强调管线、桁架与警示标识的可读性，服务第三人称射击玩法的掩体与视线。",
    cover: "/works/covers/sci-fi-station.jpg",
    sections: [
      {
        id: "concept",
        title: "概念与参考",
        body: "收集空间站、船坞与炼油厂工业摄影，提炼「环形走廊 + 中央吊装区」的空间母题，保证战斗环路的 360° 掩体分布。",
        media: [
          {
            type: "image",
            src: "/works/orbital/01-concept.jpg",
            alt: "概念拼贴",
          },
        ],
      },
      {
        id: "modular",
        title: "模块化搭建",
        body: "桁架、管道、舱门与电缆盘为可复用模块，网格对齐 4m，便于关卡设计师快速迭代。",
        media: [
          {
            type: "image",
            src: "/works/orbital/02-modular.jpg",
            alt: "模块组件",
          },
        ],
      },
      {
        id: "shader",
        title: "材质与标识",
        body: "金属三层（底漆磨损、油污、边缘高光）+ 荧光警示条；在暗背景中保持 UI 式导航色一致性。",
        media: [
          {
            type: "image",
            src: "/works/orbital/03-materials.jpg",
            alt: "材质特写",
          },
        ],
      },
    ],
  },
  {
    slug: "ruins-canyon",
    title: "遗迹峡谷",
    role: "地貌 & 植被",
    year: "2024",
    tools: ["Blender", "Gaea", "Photoshop"],
    summary:
      "荒漠峡谷遗迹探索关卡，突出岩层侵蚀、古迹残垣与稀疏灌木的层次，服务开放世界片段任务。",
    cover: "/works/covers/ruins-canyon.jpg",
    sections: [
      {
        id: "terrain",
        title: "地貌雕刻",
        body: "大形在 Gaea 中完成侵蚀与河流切割，导入 Blender 细化岩壁；古迹建筑作为地标锚点控制远景构图。",
        media: [
          {
            type: "image",
            src: "/works/ruins/01-terrain.jpg",
            alt: "地貌鸟瞰",
          },
        ],
      },
      {
        id: "foliage",
        title: "植被与散布",
        body: "低面数灌木与枯枝实例化，按坡度与湿度遮罩散布；近景手动摆点增强「荒废但仍有人迹」的叙事。",
        media: [
          {
            type: "image",
            src: "/works/ruins/02-foliage.jpg",
            alt: "植被分布",
          },
        ],
      },
      {
        id: "publish",
        title: "发布与链接",
        body: "该项目的更多角度与过程图发布在 GGAC 个人主页，欢迎跳转查看。",
        media: [
          {
            type: "embed",
            url: "https://www.ggac.com/user-center/home/work/list?uid=674218",
            caption: "GGAC 作品列表",
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
  return galleryItems.filter((g) => g.featured).slice(0, 4);
}
