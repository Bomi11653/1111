import "server-only";

import {
  copyFileSync,
  existsSync,
  mkdirSync,
  readdirSync,
  readFileSync,
  statSync,
  unlinkSync,
  writeFileSync,
} from "fs";
import path from "path";
import type { BackupEntry, CmsFile } from "@/lib/cms-types";

const CONTENT_DIR = path.join(process.cwd(), "content");
const BACKUPS_DIR = path.join(CONTENT_DIR, "backups");
const MAX_BACKUPS_PER_FILE = 20;

const BACKUP_FILES: CmsFile[] = [
  "site.json",
  "home.json",
  "modules.json",
  "projects.json",
  "seo.json",
];

function backupPrefix(filename: CmsFile): string {
  return `${filename.replace(".json", "")}-`;
}

export function backupContentFile(filename: CmsFile): string | null {
  if (!BACKUP_FILES.includes(filename)) return null;
  const sourcePath = path.join(CONTENT_DIR, filename);
  if (!existsSync(sourcePath)) return null;

  mkdirSync(BACKUPS_DIR, { recursive: true });
  const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
  const backupName = `${backupPrefix(filename)}${timestamp}.json`;
  copyFileSync(sourcePath, path.join(BACKUPS_DIR, backupName));
  pruneBackupsForFile(filename);
  return backupName;
}

function pruneBackupsForFile(filename: CmsFile) {
  const prefix = backupPrefix(filename);
  const files = readdirSync(BACKUPS_DIR)
    .filter((f) => f.startsWith(prefix) && f.endsWith(".json"))
    .map((f) => ({ name: f, mtime: statSync(path.join(BACKUPS_DIR, f)).mtimeMs }))
    .sort((a, b) => b.mtime - a.mtime);

  for (const file of files.slice(MAX_BACKUPS_PER_FILE)) {
    unlinkSync(path.join(BACKUPS_DIR, file.name));
  }
}

function resolveSourceFile(backupName: string): CmsFile | null {
  for (const file of BACKUP_FILES) {
    if (backupName.startsWith(backupPrefix(file))) return file;
  }
  return null;
}

export function listBackups(): BackupEntry[] {
  if (!existsSync(BACKUPS_DIR)) return [];
  return readdirSync(BACKUPS_DIR)
    .filter((f) => f.endsWith(".json"))
    .map((name) => {
      const full = path.join(BACKUPS_DIR, name);
      const stat = statSync(full);
      return {
        name,
        sourceFile: resolveSourceFile(name) ?? "projects.json",
        createdAt: stat.mtime.toISOString(),
        size: stat.size,
      };
    })
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export function restoreBackup(backupName: string): CmsFile {
  const safeName = path.basename(backupName);
  if (safeName !== backupName || safeName.includes("..")) {
    throw new Error("无效的备份文件名");
  }

  const backupPath = path.join(BACKUPS_DIR, safeName);
  if (!existsSync(backupPath)) throw new Error("备份不存在");

  const sourceFile = resolveSourceFile(safeName);
  if (!sourceFile) throw new Error("无法识别备份对应的源文件");

  const content = readFileSync(backupPath, "utf-8");
  backupContentFile(sourceFile);
  writeFileSync(path.join(CONTENT_DIR, sourceFile), content, "utf-8");
  return sourceFile;
}
