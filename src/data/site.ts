export const site = {
  email: "3311078363@qq.com",
  location: {
    base: "BASE",
  },
  resumeFilename: "郑荣成-游戏场景设计师-简历.pdf",
  resumePath: "/resume/郑荣成-游戏场景设计师-简历.pdf",
  profilePath: "/about/profile.jpg",
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
  },
} as const;

export const navItems = [
  { href: "/", labelKey: "home" as const },
  { href: "/works", labelKey: "works" as const },
  { href: "/about", labelKey: "about" as const },
  { href: "/contact", labelKey: "contact" as const },
] as const;
