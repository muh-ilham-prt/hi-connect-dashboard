export function parseDocuments(raw) {
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function radiusText(o) {
  const rad = o.radius ?? 10;
  const u = (o.radiusUnit ?? o.radius_unit) === "kilometer" ? "km" : "m";
  return `${rad} ${u}`;
}
export function mapLink(lat, lng) {
  return `https://www.google.com/maps?q=${lat},${lng}`;
}
export function parseHost(url) {
  try {
    return new URL(url).hostname;
  } catch {
    return url;
  }
}
export function missionLines(text) {
  if (!text) return [];
  return text
    .split(/\.\s+|\n+/)
    .map((s) => s.trim().replace(/\.$/, ""))
    .filter(Boolean);
}
export function sanitizeRichText(html) {
  const parsed = new DOMParser().parseFromString(html, "text/html");
  const output = document.createElement("div");
  const allowed = new Set([
    "P",
    "BR",
    "B",
    "STRONG",
    "I",
    "EM",
    "U",
    "S",
    "UL",
    "OL",
    "LI",
    "A",
  ]);
  const discarded = new Set([
    "SCRIPT",
    "STYLE",
    "IFRAME",
    "OBJECT",
    "EMBED",
    "SVG",
    "MATH",
  ]);
  function copySafe(source, target) {
    for (const node of source.childNodes) {
      if (node.nodeType === Node.TEXT_NODE) {
        target.appendChild(document.createTextNode(node.textContent ?? ""));
      } else if (
        node.nodeType === Node.ELEMENT_NODE &&
        !discarded.has(node.tagName)
      ) {
        if (!allowed.has(node.tagName)) {
          copySafe(node, target);
          continue;
        }
        const clean = document.createElement(node.tagName.toLowerCase());
        if (node.tagName === "A") {
          const href = node.getAttribute("href");
          try {
            const url = new URL(href, window.location.origin);
            if (["http:", "https:", "mailto:"].includes(url.protocol)) {
              clean.setAttribute("href", url.href);
              clean.setAttribute("target", "_blank");
              clean.setAttribute("rel", "noopener noreferrer");
            }
          } catch {
            // Drop malformed links but keep their text.
          }
        }
        copySafe(node, clean);
        target.appendChild(clean);
      }
    }
  }
  copySafe(parsed.body, output);
  return output.innerHTML;
}
