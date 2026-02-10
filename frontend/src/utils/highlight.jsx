import React from "react";

const escapeRegExp = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

export function highlightText(text, query) {
  if (!text) return text;
  const q = (query || "").trim();
  if (!q) return text;

  const re = new RegExp(`(${escapeRegExp(q)})`, "ig");
  const parts = String(text).split(re);

  return parts.map((part, idx) =>
    re.test(part) ? (
      <mark key={idx} className="hl">
        {part}
      </mark>
    ) : (
      <React.Fragment key={idx}>{part}</React.Fragment>
    )
  );
}
