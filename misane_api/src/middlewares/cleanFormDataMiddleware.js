import xss from "xss";

/**
 * Cleans and sanitizes any string input.
 */
function cleanInput(input) {
  if (!input || typeof input !== "string") return "";
  const cleaned = xss(input.trim());
  return cleaned.replace(/[\u0000-\u001F\u007F]+/g, "");
}

/**
 * Middleware to sanitize incoming JSON POST/PUT payloads.
 * - Sanitizes strings
 * - Parses and cleans `sections`
 * - Processes `tags` (can be comma-separated string or array)
 */
export function cleanJsonMiddleware(req, res, next) {
  const raw = req.body;
  const cleaned = {};

  for (const key in raw) {
    const value = raw[key];

    if (typeof value === "string") {
      const trimmed = value.trim();

      if (key === "sections") {
        try {
          const parsed = JSON.parse(trimmed);
          cleaned.sections = Array.isArray(parsed)
            ? parsed.map((s) => {
                const section = { ...s };
                if (section.text) section.text = cleanInput(section.text);
                if (section.code) section.code = cleanInput(section.code);
                if (section.caption) section.caption = cleanInput(section.caption);
                if (section.author) section.author = cleanInput(section.author);
                return section;
              })
            : [];
        } catch {
          cleaned.sections = [];
        }
        continue;
      }

      if (key === "tags") {
        cleaned.tags = trimmed
          .split(",")
          .map((t) => cleanInput(t))
          .filter(Boolean);
        continue;
      }

      cleaned[key] = cleanInput(trimmed);
    }

    // Allow already parsed arrays/objects
    else if (key === "sections" && Array.isArray(value)) {
      cleaned.sections = value.map((s) => {
        const section = { ...s };
        if (section.text) section.text = cleanInput(section.text);
        if (section.code) section.code = cleanInput(section.code);
        if (section.caption) section.caption = cleanInput(section.caption);
        if (section.author) section.author = cleanInput(section.author);
        return section;
      });
    }

    else if (key === "tags" && Array.isArray(value)) {
      cleaned.tags = value.map((t) =>
        typeof t === "string" ? cleanInput(t) : t
      );
    }

    else {
      cleaned[key] = value;
    }
  }

  req.body = cleaned;
  next();
}
