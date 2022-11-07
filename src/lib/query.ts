const l = window.location.hash.slice(1) || "50"; // hack to let users ask for more images

export default async function search(q: string) {
  let host = "https://diffusiondb-api.fly.dev/search";
  q = q.trim();

  if (q.length > 0) {
    console.log("searching for", q);
    const url = host + "?" + new URLSearchParams({ q, l });
    return fetch(url)
      .then((response) => response.json())
      .then((d) => d.results);
  }
  return [];
}
