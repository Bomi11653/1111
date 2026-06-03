"use client";

import { useState } from "react";
import { Button } from "./ui/Button";

export function ContactForm() {
  const [status, setStatus] = useState<"idle" | "sent">("idle");

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    const name = data.get("name") as string;
    const message = data.get("message") as string;
    const email = data.get("email") as string;
    const subject = encodeURIComponent(`作品集联系 - ${name}`);
    const body = encodeURIComponent(
      `姓名：${name}\n邮箱：${email}\n\n${message}`,
    );
    window.location.href = `mailto:3311078363@qq.com?subject=${subject}&body=${body}`;
    setStatus("sent");
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid sm:grid-cols-2 gap-5">
        <label className="block">
          <span className="text-xs text-muted uppercase tracking-wider">姓名</span>
          <input
            name="name"
            required
            className="mt-2 w-full rounded-lg border border-border bg-surface px-4 py-3 text-foreground focus:border-accent outline-none transition-colors"
            placeholder="您的称呼"
          />
        </label>
        <label className="block">
          <span className="text-xs text-muted uppercase tracking-wider">邮箱</span>
          <input
            name="email"
            type="email"
            required
            className="mt-2 w-full rounded-lg border border-border bg-surface px-4 py-3 text-foreground focus:border-accent outline-none transition-colors"
            placeholder="用于回复您"
          />
        </label>
      </div>
      <label className="block">
        <span className="text-xs text-muted uppercase tracking-wider">留言</span>
        <textarea
          name="message"
          required
          rows={5}
          className="mt-2 w-full rounded-lg border border-border bg-surface px-4 py-3 text-foreground focus:border-accent outline-none transition-colors resize-y"
          placeholder="合作意向、项目类型或时间安排…"
        />
      </label>
      <Button type="submit" variant="primary">
        {status === "sent" ? "已打开邮件客户端" : "发送留言"}
      </Button>
      <p className="text-xs text-muted">
        提交后将打开本地邮件应用；也可直接发送至 3311078363@qq.com
      </p>
    </form>
  );
}
