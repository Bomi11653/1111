# Portfolio Phase 0 Recovery Report

日期：2026-08-09

## Git

- Recovery branch：`recovery/portfolio-2026-08-09`
- Snapshot commit：`11464b8 chore: snapshot local portfolio recovery state`
- Remote merge：`7113c97 merge: reconcile remote portfolio updates with CMS recovery`
- Remote commit：`741e833 Add bilingual i18n, About page updates, and mouse-driven home shader.`
- Conflict：21 个文本冲突。逐文件保留 CMS 单一数据源与动态模块控制，合入远端照片、简历、视觉/动效、翻译修正和语言 Cookie 持久化；没有使用整批 `ours` / `theirs` 覆盖。

## Security

- `/admin` production：返回 404；所有嵌套管理页同样不可访问。
- CMS API production：所有 `/api/cms/**` 读写方法均在服务端返回 404；前台不依赖这些管理 API。
- Draft preview：仅非生产环境允许 `?preview=draft`。
- Upload：限制项目 ID 字符集和长度、由 MIME 决定扩展名，并验证最终路径位于上传根目录内。
- Secret：工作树、暂存内容和文件名审计未发现密钥、令牌、证书或环境文件被提交。

## Assets

- Blender Ark：原有封面、画廊和作品详情路径均存在，开发与生产路由返回 200。
- 冰锁寒川：从 `E:\卓面应用\个人文件\项目工作\游戏地编\成稿作品\冰锁寒川-2025-3\0330.mp4` 恢复真实封面与 6 张制作过程帧；全部 CMS 引用已消除缺失文件，作品详情返回 200。
- Resume：从远端提交恢复 `public/resume/郑荣成-游戏场景设计师-简历.pdf`；15,336,257 bytes，签名为 `%PDF-`，CMS URL 返回 `application/pdf` / 200。
- Profile：从远端提交恢复 `public/about/profile.jpg`。

## Environment

- Node：`22.23.2`（`.nvmrc`、`.node-version`、`engines.node=22.x`）
- npm：`10.9.8`（`packageManager`、`engines.npm=10.x`）
- Next.js：仅按阶段要求从 `16.2.7` 升至 `16.2.11`；React / React DOM 保持 `19.2.4`。
- Dev：默认脚本改用 Turbopack，避免原 Webpack 开发进程卡住。

Node 22 仍为 LTS，Vercel 官方支持 `22.x` 用于构建与 Functions；Vercel 会在该主版本内自动更新补丁版本。

## Quality

- `npm install`：成功。
- Lint：0 errors，12 warnings；warning 保留为后续技术债。
- TypeScript：`npx tsc --noEmit` 成功。
- Build：Node 22.23.2 + Next 16.2.11 的生产构建成功，无构建 warning。
- Development：公开路由、两份作品详情、后台、CMS 真实 PUT、简历与图片验证通过。
- Production：公开路由 200、未知路由 404、`/admin` 404、CMS GET/PUT/POST/DELETE 404。
- Browser QA：Chrome/Playwright 实际渲染中文首页、英文首页、Works、About；Three.js 画面、GSAP / Framer Motion 页面状态与中英文切换无运行时崩溃。

## Data flow and dynamic rendering

生产前台通过服务端 `src/lib/cms.ts` 直接读取仓库内已提交的 `content/*.json`，不经过管理 API；Vercel 部署为只读内容源。管理后台和文件写入只在本地开发环境启用。

根布局及内容页的 `force-dynamic` 暂时保留。当前本地 CMS 的即时文件读取和模块开关依赖请求时读取；在 Phase 0 移除会改变行为并扩大重构范围。缓存与静态化优化放到 V2 数据层整理后处理。

## Residual debt

- ESLint 仍有 12 条非阻断 warning，包括未使用 import、字体规则和 Three 类型 import；本阶段按要求未清理 Three.js。
- `npm audit` 报告 6 个 high，来自当前生态在阶段指定版本之后披露的 `postcss`、`sharp` 及开发工具传递依赖。npm 建议升级 Next 至 16.3.0，但本阶段明确限制为 16.2.11，因此未越权升级或执行 `npm audit fix --force`。当前站点不接受远程图片源、生产 CMS 已关闭，暴露面已显著收窄；仍应单独安排依赖安全升级。

## Deployment

- 是否已经达到可安全部署状态：**是，达到 Phase 0 的权限、资产、构建和运行基线，可先部署 Vercel Preview，再晋升 Production。**
- 限定说明：这不是“零漏洞 / 零 warning”状态；上述 npm audit 项必须作为后续安全任务跟踪。
- Phase 0：**完成。**
- Portfolio V2：**可以开始页面与作品结构重构。**
