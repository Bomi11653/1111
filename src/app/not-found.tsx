import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-6xl px-6 py-32 text-center">
      <h1 className="font-display text-4xl text-foreground">页面未找到</h1>
      <Link href="/" className="mt-6 inline-block text-accent hover:underline">
        返回首页
      </Link>
    </div>
  );
}
