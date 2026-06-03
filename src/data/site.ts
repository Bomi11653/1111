export const site = {
  name: "郑荣成",
  nameEn: "Zheng Rongcheng",
  title: "游戏场景设计师",
  tagline: "专注 3D 环境艺术",
  headline: "用光影和细节打造沉浸式游戏世界",
  email: "3311078363@qq.com",
  resumeFilename: "郑荣成-游戏场景设计师-简历.pdf",
  resumePath: "/resume/郑荣成-游戏场景设计师-简历.pdf",
  social: {
    bilibili: {
      label: "Bilibili",
      url: "https://space.bilibili.com/279855573?spm_id_from=333.1387.0.0",
    },
    ggac: {
      label: "GGAC",
      url: "https://www.ggac.com/user-center/home/work/list?uid=674218",
    },
  },
  experience: {
    years: 1,
    company: "dBsoure",
    summary:
      "参与游戏场景全流程制作，从概念氛围、模块化资产到灯光烘焙与引擎整合，注重叙事感与可玩性的空间节奏。",
  },
  philosophy: [
    "场景首先是「可体验的空间」——玩家在其中的动线、视线与情绪曲线，与单帧画面同样重要。",
    "光影是叙事工具：冷暖对比、体积雾与局部高光，用来引导注意力并暗示剧情张力。",
    "在预算内追求密度：模块化资产、可复用材质与合理的 LOD，让美感可持续落地到项目管线。",
  ],
  skills: [
    { name: "Blender", level: 88, category: "3D" },
    { name: "Photoshop", level: 82, category: "2D" },
    { name: "Adobe After Effects 2025", level: 75, category: "动效" },
    { name: "Adobe Premiere Pro", level: 70, category: "剪辑" },
  ],
} as const;

export const navItems = [
  { href: "/", label: "首页" },
  { href: "/works", label: "作品" },
  { href: "/about", label: "关于" },
  { href: "/contact", label: "联系" },
] as const;
