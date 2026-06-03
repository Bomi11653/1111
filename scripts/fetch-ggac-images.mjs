const urls = [
  "https://www.ggac.com/work/detail/1829377",
  "https://www.ggac.com/work/detail/1783137",
];

for (const url of urls) {
  const res = await fetch(url);
  const html = await res.text();
  const matches = [...html.matchAll(/https?:\/\/[^"'\s>]+\.(?:jpg|jpeg|png|webp)/gi)];
  const unique = [...new Set(matches.map((m) => m[0]))];
  console.log("\n===", url, "===");
  console.log(unique.slice(0, 12).join("\n"));
}
