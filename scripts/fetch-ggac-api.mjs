const ids = [1829377, 1783137];
for (const id of ids) {
  for (const path of [`/api/v1/work/detail?id=${id}`, `/api/work/detail/${id}`]) {
    try {
      const res = await fetch(`https://www.ggac.com${path}`);
      console.log(path, res.status);
      if (res.ok) {
        const text = await res.text();
        console.log(text.slice(0, 500));
      }
    } catch (e) {
      console.log(path, "err");
    }
  }
}
