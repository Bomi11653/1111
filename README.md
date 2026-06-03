# 郑荣成 · 游戏场景设计师作品集

高转化率个人作品集网站，基于 **Next.js 16** + **Tailwind CSS 4**，可直接部署到 [Vercel](https://vercel.com)。

---

## 站点结构（导航 4 项，≤6）

| 路由 | 模块 | 说明 |
|------|------|------|
| `/` | 首页 | 姓名、职业标签、一句话介绍、精选 4 图、CTA |
| `/works` | 作品列表 | **叠页卡片**交互，支持外部链接 |
| `/works/[slug]` | 项目详情 | 2–3 个大项目，每案 3–5 屏叙事 |
| `/about` | 关于我 | 经历、技能进度条、设计理念、可选照片 |
| `/contact` | 联系 | 邮箱、Bilibili、GGAC、简历下载、留言表单 |

---

## 已写入的个人信息

| 字段 | 内容 |
|------|------|
| 姓名 | 郑荣成 |
| 职业 | 游戏场景设计师 \| 专注 3D 环境艺术 |
| 一句话 | 用光影和细节打造沉浸式游戏世界 |
| 工作年限 | 1 年 |
| 公司 | dBsoure |
| 邮箱 | 3311078363@qq.com |
| Bilibili | https://space.bilibili.com/279855573 |
| GGAC | https://www.ggac.com/user-center/home/work/list?uid=674218 |
| 简历文件名 | `郑荣成-游戏场景设计师-简历.pdf` |

### 技能（进度条在关于页）

- Blender — 88%
- Photoshop — 82%
- Adobe After Effects 2025 — 75%
- Adobe Premiere Pro — 70%

> 熟练度百分比为占位，请按真实水平在 `src/data/site.ts` 中修改。

---

## 占位项目（需你替换为真实作品）

当前在 `src/data/projects.ts` 中配置了 **3 个重点项目** + **1 个列表项**：

1. **古镇夜雨** — `ancient-town-night`
2. **轨道补给站** — `orbital-supply-hub`
3. **遗迹峡谷** — `ruins-canyon`
4. 室内关卡原型（仅列表，无详情页）

文案为示例叙事，请改成你在 dBsoure 或其它项目的真实描述。

---

## 本地预览

```bash
cd zhengrongcheng-portfolio
npm install
npm run dev
```

浏览器打开：**http://localhost:3000**

---

## 部署到 Vercel

1. 将本项目推送到 GitHub（或 GitLab）。
2. 登录 Vercel → **Add New Project** → 导入仓库。
3. Framework 选 **Next.js**（自动识别，已含 `vercel.json`）。
4. 点击 Deploy。

也可使用 CLI：

```bash
npm i -g vercel
vercel
```

---

## 你需要补充的资源（重要）

### 1. 作品图片 / 视频

将高清图放入 `public/works/`，路径需与 `src/data/projects.ts` 一致：

```
public/works/covers/
  ancient-town.jpg      # 列表封面
  sci-fi-station.jpg
  ruins-canyon.jpg
  interior-blockout.jpg

public/works/ancient-town/
  01-hero.jpg
  02-blockout.jpg
  03-lighting.jpg
# … 按项目自建文件夹
```

未放置图片时，站点会显示「待上传作品图」占位，不影响预览结构。

### 2. 简历 PDF

```
public/resume/郑荣成-游戏场景设计师-简历.pdf
```

### 3. 个人照片（可选）

```
public/about/profile.jpg
```

### 4. 待你确认 / 提供的信息

请回复以下内容，我可以帮你改 `projects.ts` 与文案：

- [ ] **dBsoure** 公司名称是否拼写正确？（是否为 dBsource？）
- [ ] 三个重点项目是否为你真实作品？请提供：**中文标题、年份、你在项目中的职责、3–5 段说明**
- [ ] 每个项目的 **B站 / GGAC / 视频直链**（替换详情页里的示例视频）
- [ ] 是否使用 **UE5 / Unity** 等引擎（目前文案写了 UE5）
- [ ] 技能熟练度是否按上面百分比，还是需要调整？
- [ ] 是否需要 **英文版** 或双语切换？
- [ ] 联系表单是否要对接 **Formspree / Resend**（当前为 mailto 打开邮件客户端）

---

## 修改内容的文件索引

| 要改什么 | 文件 |
|----------|------|
| 姓名、邮箱、社交、经历、技能 | `src/data/site.ts` |
| 作品列表、叠页项、详情结构与媒体 | `src/data/projects.ts` |
| 全局配色与字体 | `src/app/globals.css`、`src/app/layout.tsx` |
| 导航 | `src/data/site.ts` → `navItems` |

---

## 技术栈

- Next.js App Router（SSG 详情页）
- TypeScript
- Tailwind CSS v4
- 叠页组件：`src/components/StackGallery.tsx`
- 图片失败回退：`src/components/WorkImage.tsx`

---

## 脚本

| 命令 | 作用 |
|------|------|
| `npm run dev` | 开发预览 |
| `npm run build` | 生产构建 |
| `npm run start` | 运行生产包 |
| `npm run lint` | ESLint |

---

## 许可证

个人作品集项目，版权归郑荣成所有。
