export const cleanText = (value) => String(value ?? "")
  .replace(/<br\s*\/?>(?:)/gi, "\n")
  .replace(/<\/p>/gi, "\n")
  .replace(/<li[^>]*>/gi, "• ")
  .replace(/<\/li>/gi, "\n")
  .replace(/<[^>]*>/g, "")
  .replace(/&nbsp;/gi, " ")
  .replace(/&amp;/gi, "&")
  .replace(/&lt;/gi, "<")
  .replace(/&gt;/gi, ">")
  .replace(/\r\n/g, "\n")
  .replace(/[ \t]+/g, " ")
  .replace(/\n{3,}/g, "\n\n")
  .trim();

const text = (value) => cleanText(value);
const arr = (value) => Array.isArray(value) ? value : [];

export const getLanguage = (item) => {
  if (typeof item === "string") return item;
  return text(item?.language || item?.name || "");
};

const isChipSection = (sectionId) => ["skills", "coreSkills", "hobbies", "languages", "keyAchievements"].includes(sectionId);

/**
 * Returns the canonical section contents without mutating the source resume.
 * Object-array entries carry their original index as metadata so paginated
 * editing can always map back to the canonical resume item.
 */
export const sectionData = (resume, sectionId) => {
  switch (sectionId) {
    case "summary": return text(resume?.summary);
    case "experience": return arr(resume?.experience).filter((item) => text(item?.position || item?.company || item?.description) || arr(item?.responsibilities).length);
    case "projects": return arr(resume?.projects).filter((item) => text(item?.name || item?.description || item?.technologies || item?.link));
    case "education": return arr(resume?.education).filter((item) => text(item?.degree || item?.institution || item?.description));
    case "skills": return arr(resume?.skills).filter(Boolean);
    case "coreSkills": return arr(resume?.coreSkills).filter(Boolean);
    case "keyAchievements": return arr(resume?.keyAchievements).filter(Boolean);
    case "certificates": return arr(resume?.certificates).filter((item) => text(item?.name || item?.issuer || item?.date || item?.issueDate || item?.expiryDate));
    case "languages": return arr(resume?.languages).filter((item) => getLanguage(item));
    case "hobbies": return arr(resume?.hobbies).filter(Boolean);
    case "additionalInformation": return arr(resume?.additionalInformation).filter((item) => text(item?.heading || item?.name || item?.content || item?.description) || arr(item?.bullets).length);
    default: return null;
  }
};

export const hasSection = (resume, sectionId) => {
  const value = sectionData(resume, sectionId);
  if (typeof value === "string") return Boolean(value);
  return Array.isArray(value) && value.length > 0;
};

/**
 * Conservative CSS-pixel metrics for the actual 794 x 1123 browser page.
 * These values are intentionally conservative because the HTML templates
 * use fixed-height A4 roots with overflow hidden.
 */
export const getTemplateMetrics = (template, fontScale = 1) => {
  const PAGE_WIDTH = 794;
  const scale = Math.max(0.82, Math.min(1.2, fontScale));

  const defaults = {
    firstPageAvailableHeight: 730,
    continuationPageAvailableHeight: 965,
    singleColumnWidth: PAGE_WIDTH - 96,
    leftColumnWidth: 0,
    rightColumnWidth: 0,
    isTwoColumn: false,
    sectionHeadingHeight: 42 * scale,
    continuationHeadingHeight: 34 * scale,
  };

  const metrics = { ...defaults };

  // Match the broad header geometry of each template family rather than
  // pretending every template has the same first-page content budget.
  const firstPageBudgets = {
    Professional: 740,
    Modern: 760,
    Strategic: 760,
    Executive: 790,
    Corporate: 790,
    CleanTech: 800,
    Contemporary: 800,
    Elegant: 820,
    Refined: 810,
    Classic: 820,
    Minimal: 820,
  };
  const continuationBudgets = {
    Professional: 880,
    Modern: 880,
    Strategic: 880,
    Executive: 890,
    Corporate: 895,
    CleanTech: 900,
    Contemporary: 900,
    Elegant: 910,
    Refined: 905,
    Classic: 910,
    Minimal: 905,
  };

  metrics.firstPageAvailableHeight = (firstPageBudgets[template] ?? defaults.firstPageAvailableHeight) / scale;
  metrics.continuationPageAvailableHeight = (continuationBudgets[template] ?? defaults.continuationPageAvailableHeight) / scale;

  if (["Professional", "Modern", "Strategic"].includes(template)) {
    metrics.isTwoColumn = true;
    // Template1 (Professional): grid-cols-[270px_1fr] where page is 794px
    // Sidebar=270px, main column = 794-270 = 524px minus inner padding (~80px) = ~444px
    // Template2 (Modern): same grid but swapped orientation
    // Template6 (Strategic): different layout
    if (template === "Professional") {
      metrics.leftColumnWidth = 270;   // sidebar (left)
      metrics.rightColumnWidth = 444;  // main content (right)
    } else if (template === "Modern") {
      metrics.leftColumnWidth = 444;   // main content (left)
      metrics.rightColumnWidth = 270;  // sidebar (right)
    } else {
      metrics.leftColumnWidth = 460;   // Strategic: wider main
      metrics.rightColumnWidth = 210;  // Strategic: narrower sidebar
    }
  }

  return metrics;
};

const MAX_CACHE_SIZE = 2000;
const measurementCache = new Map();

const measureTextInDOM = (textValue, width, fontScale, isHeading = false, isSmall = false) => {
  if (!textValue) return 0;
  
  // Guard: fall back to a safe estimation if DOM is not available
  // (e.g. during PDF export in headless environments)
  if (typeof document === "undefined" || !document.body) {
    const charWidth = 6.2 * fontScale;
    const charsPerLine = Math.max(18, Math.floor(width / charWidth));
    const lineHeight = isHeading ? 20 * fontScale : isSmall ? 15 * fontScale : 19 * fontScale;
    const lines = Math.max(1, Math.ceil(textValue.length / charsPerLine));
    return lines * lineHeight;
  }

  // Cache key uses the actual text to prevent collision between
  // different texts that happen to share the same length.
  const cacheKey = `${textValue}_${width}_${fontScale}_${isHeading}_${isSmall}`;
  if (measurementCache.has(cacheKey)) {
    return measurementCache.get(cacheKey);
  }

  // Evict oldest entries if cache grows too large
  if (measurementCache.size >= MAX_CACHE_SIZE) {
    const firstKey = measurementCache.keys().next().value;
    measurementCache.delete(firstKey);
  }

  const measureNode = document.createElement("div");
  const baseFontSize = 16 * fontScale; 
  measureNode.style.cssText = [
    "position:absolute",
    "visibility:hidden",
    "pointer-events:none",
    `width:${width}px`,
    "font-family:Inter,sans-serif",
    "white-space:pre-line",
    "box-sizing:border-box",
    `font-size:${baseFontSize * (isHeading || !isSmall ? 0.875 : 0.6875)}px`,
    `font-weight:${isHeading ? "bold" : "normal"}`,
    `line-height:${isSmall ? "1.4" : "1.5"}`,
  ].join(";");

  measureNode.innerText = textValue;
  document.body.appendChild(measureNode);
  const height = measureNode.getBoundingClientRect().height;
  document.body.removeChild(measureNode);
  
  measurementCache.set(cacheKey, height);
  return height;
};

export const estimateItemHeight = (item, sectionId, width = 500, fontScale = 1) => {
  if (typeof item === "string") {
    return measureTextInDOM(item, width, fontScale) + 18 * fontScale;
  }

  const heading = item?.position || item?.degree || item?.name || item?.heading || item?.title || "";
  const company = item?.company || item?.institution || item?.issuer || "";
  const description = item?.description || item?.content || item?.summary || "";
  const technologies = item?.technologies || "";
  const link = item?.link || "";
  const bullets = arr(item?.responsibilities).concat(arr(item?.bullets));

  let height = 28 * fontScale; // Base padding/margin between items
  
  if (heading) height += measureTextInDOM(heading, width, fontScale, true, false);
  if (company) height += measureTextInDOM(company, width, fontScale, false, true);
  if (description) height += measureTextInDOM(description, width, fontScale, false, false);
  if (technologies) height += measureTextInDOM(technologies, width, fontScale, false, true);
  if (link) height += measureTextInDOM(link, width, fontScale, false, true);
  
  if (bullets.length) {
    height += 4 * fontScale;
    bullets.forEach((bullet) => {
      // Bullets have left padding, effectively reducing width
      height += measureTextInDOM(bullet, width - (20 * fontScale), fontScale, false, false) + 4 * fontScale;
    });
  }

  return Math.max(height, 38 * fontScale);
};

const cloneItem = (item, sourceIndex) => {
  if (item && typeof item === "object") {
    return { ...item, _globalIndex: sourceIndex };
  }
  return item;
};

// Large experience entries are the most common source of content being
// clipped at the bottom of an A4 page. The browser templates use a fixed
// page shell, so a single job entry must be splittable before it reaches the
// page boundary. We split responsibility bullets while keeping the source
// index intact for editing.
const splitExperienceItem = (item, width, remainingHeight, fontScale) => {
  if (!item || !Array.isArray(item.responsibilities) || !item.responsibilities.length || remainingHeight <= 40) return null;

  const base = { ...item };
  const responsibilities = arr(item.responsibilities);
  const baseWithoutBullets = { ...base, responsibilities: [] };
  const baseHeight = estimateItemHeight(baseWithoutBullets, "experience", width, fontScale);
  const availableForBullets = Math.max(18, remainingHeight - Math.min(baseHeight, remainingHeight));
  const bulletHeights = responsibilities.map((bullet) =>
    Math.max(12 * fontScale, estimateItemHeight({ responsibilities: [bullet] }, "experience", width, fontScale) - 28 * fontScale)
  );

  let used = 0;
  let count = 0;
  for (let i = 0; i < responsibilities.length; i += 1) {
    const bulletHeight = bulletHeights[i];
    if (count > 0 && used + bulletHeight > availableForBullets) break;
    if (count === 0 && bulletHeight > availableForBullets) {
      count = 1;
      break;
    }
    used += bulletHeight;
    count += 1;
  }

  if (count <= 0 || count >= responsibilities.length) return null;
  return {
    first: { ...base, responsibilities: responsibilities.slice(0, count) },
    rest: { ...base, position: "", title: "", company: "", startDate: "", endDate: "", description: "", responsibilities: responsibilities.slice(count), _responsibilityStartIndex: count, _paginationContinuation: true },
  };
};

const createSectionCursor = (resume, sectionId) => {
  const raw = sectionData(resume, sectionId);
  if (typeof raw === "string") {
    return raw ? { id: sectionId, type: "string", data: raw, sourceIndices: null, cursor: 0 } : null;
  }
  if (!Array.isArray(raw) || !raw.length) return null;

  // Preserve the original resume index after filtering empty entries.
  const original = arr(resume?.[sectionId]);
  const data = [];
  const sourceIndices = [];
  let searchFrom = 0;
  raw.forEach((item) => {
    let sourceIndex = -1;
    for (let i = searchFrom; i < original.length; i += 1) {
      if (original[i] === item) { sourceIndex = i; break; }
    }
    if (sourceIndex < 0) sourceIndex = data.length;
    searchFrom = sourceIndex + 1;
    sourceIndices.push(sourceIndex);
    data.push(cloneItem(item, sourceIndex));
  });

  return { id: sectionId, type: isChipSection(sectionId) ? "chips" : "array", data, sourceIndices, cursor: 0 };
};

const appendChunk = (pageData, pageDataMeta, sectionId, chunkData, sourceIndices) => {
  if (chunkData == null) return;
  if (Array.isArray(chunkData)) {
    pageData[sectionId] = (pageData[sectionId] || []).concat(chunkData);
    pageDataMeta[sectionId] = (pageDataMeta[sectionId] || []).concat(sourceIndices || []);
  } else {
    pageData[sectionId] = chunkData;
    pageDataMeta[sectionId] = null;
  }
};

export const paginateResume = ({ resume, layout, template }) => {
  const fontScale = Math.max(0.82, Math.min(1.2, Number(layout?.fontSize || 100) / 100));
  const metrics = getTemplateMetrics(template, fontScale);
  const defaultOrder = ["summary", "experience", "projects", "education", "skills", "coreSkills", "keyAchievements", "certificates", "languages", "hobbies", "additionalInformation"];
  const sectionOrder = Array.isArray(layout?.sectionOrder) && layout.sectionOrder.length ? layout.sectionOrder : defaultOrder;

  let leftOrder = [...sectionOrder];
  let rightOrder = [];
  if (metrics.isTwoColumn) {
    const sideDefaults = template === "Strategic"
      ? { left: ["summary", "experience", "keyAchievements", "projects", "certificates", "additionalInformation"], right: ["skills", "coreSkills", "education", "languages", "hobbies"] }
      : { left: ["summary", "experience", "keyAchievements", "projects", "additionalInformation"], right: ["education", "skills", "coreSkills", "certificates", "languages", "hobbies"] };
    const savedLeft = Array.isArray(layout?.sectionLayout?.leftColumn) ? layout.sectionLayout.leftColumn : null;
    const savedRight = Array.isArray(layout?.sectionLayout?.rightColumn) ? layout.sectionLayout.rightColumn : null;
    leftOrder = (savedLeft?.length ? savedLeft : sideDefaults.left).filter((id) => sectionOrder.includes(id));
    rightOrder = (savedRight?.length ? savedRight : sideDefaults.right).filter((id) => sectionOrder.includes(id));
    const placed = new Set([...leftOrder, ...rightOrder]);
    sectionOrder.filter((id) => !placed.has(id)).forEach((id) => {
      if (sideDefaults.left.includes(id)) leftOrder.push(id);
      else rightOrder.push(id);
    });
  }

  const pages = [];
  let pageIndex = 0;
  let leftPos = 0;
  let rightPos = 0;
  let leftCursor = null;
  let rightCursor = null;
  const MAX_PAGES = 1000;

  const consumeColumn = (order, state, width, availableHeight, pageData, pageDataMeta, targetSections, continuationSections) => {
    let { pos, cursor } = state;
    let height = 0;
    let guard = 0;

    if (cursor && cursor.cursor > 0) {
      continuationSections[cursor.id] = true;
    }

    while (guard++ < 10000 && height < availableHeight) {
      if (!cursor) {
        let found = false;
        while (pos < order.length) {
          const id = order[pos++];
          if (!hasSection(resume, id)) continue;
          cursor = createSectionCursor(resume, id);
          if (cursor) { found = true; break; }
        }
        if (!found) break;
      }

      const id = cursor.id;
      const isContinuationOnThisPage = !!continuationSections[id];
      const headingHeight = isContinuationOnThisPage ? 34 : 42;
      const sectionStyle = layout?.sectionStyles?.[id] || {};
      const customMarginTop = sectionStyle.marginTop != null ? sectionStyle.marginTop : undefined;
      const customMarginBottom = sectionStyle.marginBottom != null ? sectionStyle.marginBottom : undefined;
      const extraMargin = (customMarginTop !== undefined ? customMarginTop : 0) + (customMarginBottom !== undefined ? customMarginBottom : 24);

      const remainingPage = availableHeight - height;

      if (height > 0 && remainingPage < headingHeight + extraMargin + 18) break;      
      
      if (cursor.type === "chips") {
        const remaining = cursor.data.slice(cursor.cursor);
        if (!remaining.length) { cursor = null; continue; }
        let count = 0;
        let rows = 1;
        let lineWidth = 0;
        for (const item of remaining) {
          const w = (text(item?.name || item).length * 4.2 * fontScale) + (14 * fontScale);
          if (lineWidth + w > width) { rows++; lineWidth = w; }
          else { lineWidth += w; }
          count++;
        }
        const itemHeight = (rows * 20 * fontScale) + (6 * fontScale);
        const totalNeeded = headingHeight + itemHeight + extraMargin;

        if (height + totalNeeded <= availableHeight || height === 0) {
          appendChunk(pageData, pageDataMeta, id, remaining, null);
          targetSections.push(id);
          height += totalNeeded;
          cursor = null;
          continue;
        }
        break;
      }

      if (cursor.type === "array") {
        const remaining = cursor.data.slice(cursor.cursor);
        if (!remaining.length) { cursor = null; continue; }
        const item = remaining[0];
        const sourceIndex = cursor.sourceIndices ? cursor.sourceIndices[cursor.cursor] : cursor.cursor;
        
        let itemHeight = estimateItemHeight(item, id, width, fontScale);
        // If it's the very first item in the section on this page, add the extra margin
        const isFirstItemInSection = cursor.cursor === 0;
        const currentItemTotalNeeded = (isFirstItemInSection ? headingHeight + extraMargin : 0) + itemHeight;

        if (height + currentItemTotalNeeded <= availableHeight || height === 0) {
          const itemToAppend = id === "experience" ? splitExperienceItem(item, width, availableHeight - height - (isFirstItemInSection ? headingHeight + extraMargin : 0), fontScale) : null;
          
          if (itemToAppend) {
            appendChunk(pageData, pageDataMeta, id, [cloneItem(itemToAppend.first, sourceIndex)], [sourceIndex]);
            if (!targetSections.includes(id)) targetSections.push(id);
            height = availableHeight;
            const restItem = cloneItem(itemToAppend.rest, sourceIndex);
            cursor.data = [restItem, ...remaining.slice(1)];
            cursor.sourceIndices = [sourceIndex, ...(cursor.sourceIndices ? cursor.sourceIndices.slice(cursor.cursor + 1) : [])];
            cursor.cursor = 0; // The next item is the split remainder
            break;
          }

          appendChunk(pageData, pageDataMeta, id, [cloneItem(item, sourceIndex)], [sourceIndex]);
          if (!targetSections.includes(id)) targetSections.push(id);
          height += currentItemTotalNeeded;
          cursor.cursor++;
          continue;
        }
        
        // Didn't fit and wasn't the first item on page, so we break to new page
        break;
      }

      if (cursor.type === "string") {
        const itemHeight = estimateItemHeight(cursor.data, id, width, fontScale);
        const totalNeeded = headingHeight + itemHeight + extraMargin;

        // Case 1: Text fits entirely in remaining space → place it
        if (height + totalNeeded <= availableHeight) {
          appendChunk(pageData, pageDataMeta, id, cursor.data, null);
          targetSections.push(id);
          height += totalNeeded;
          cursor = null;
          continue;
        }

        // Case 2: Try to split text into remaining space (only if there is meaningful space)
        const remainingSpace = availableHeight - height - headingHeight - extraMargin;
        if (remainingSpace > 50) {
          const charWidth = 6.8 * fontScale;
          const charsPerLine = Math.max(18, Math.floor(width / charWidth));
          const bodyLine = 19 * fontScale;
          const allowedLines = Math.floor(remainingSpace / bodyLine);

          if (allowedLines >= 2) {
            const paragraphs = cursor.data.split(/\n/);
            let fittedText = "";
            let currentLines = 0;
            let splitIndex = 0;

            for (let i = 0; i < paragraphs.length; i++) {
              const p = paragraphs[i];
              const pLines = Math.max(1, Math.ceil(p.length / charsPerLine));
              if (currentLines + pLines <= allowedLines) {
                fittedText += (fittedText ? "\n" : "") + p;
                currentLines += pLines;
                splitIndex = i + 1;
              } else {
                break;
              }
            }

            if (fittedText && splitIndex < paragraphs.length) {
              appendChunk(pageData, pageDataMeta, id, fittedText, null);
              targetSections.push(id);
              cursor.data = paragraphs.slice(splitIndex).join("\n");
              cursor.cursor = 1; // Mark as continuation for next page
              height = availableHeight; // Force page break
              break;
            }
          }
        }

        // Case 3: Doesn't fit and can't be split — push to next page (unless already at top)
        if (height > 0) break;

        // Case 4: Even on a fresh page it's too tall — force it anyway (never drop data)
        appendChunk(pageData, pageDataMeta, id, cursor.data, null);
        targetSections.push(id);
        height += totalNeeded;
        cursor = null;
        continue;
      }


    }

    // Last-resort progress guard for malformed data/cursors. This path should
    // be unreachable, but it prevents a corrupt resume from hanging export.
    if (guard >= 10000 && cursor) {
      const id = cursor.id;
      const remaining = cursor.data.slice(cursor.cursor);
      if (remaining.length) {
        const forced = remaining[0];
        const index = cursor.sourceIndices?.[cursor.cursor] ?? 0;
        appendChunk(pageData, pageDataMeta, id, [forced], [index]);
        if (!targetSections.includes(id)) targetSections.push(id);
        cursor.cursor += 1;
        if (cursor.cursor >= cursor.data.length) cursor = null;
      }
    }

    return { pos, cursor, height };
  };

  while (leftCursor || leftPos < leftOrder.length || rightCursor || rightPos < rightOrder.length || pageIndex === 0) {
    if (pageIndex >= MAX_PAGES) throw new Error("Resume pagination exceeded the safety limit.");
    const isFirst = pageIndex === 0;
    const availableHeight = isFirst ? metrics.firstPageAvailableHeight : metrics.continuationPageAvailableHeight;
    const pageData = {};
    const pageDataMeta = {};
    const continuationSections = {};
    const left = [];
    const right = [];

    const leftResult = consumeColumn(
      leftOrder,
      { pos: leftPos, cursor: leftCursor },
      metrics.isTwoColumn ? metrics.leftColumnWidth : metrics.singleColumnWidth,
      availableHeight,
      pageData,
      pageDataMeta,
      left,
      continuationSections,
    );
    leftPos = leftResult.pos;
    leftCursor = leftResult.cursor;

    if (metrics.isTwoColumn) {
      const rightResult = consumeColumn(
        rightOrder,
        { pos: rightPos, cursor: rightCursor },
        metrics.rightColumnWidth,
        availableHeight,
        pageData,
        pageDataMeta,
        right,
        continuationSections,
      );
      rightPos = rightResult.pos;
      rightCursor = rightResult.cursor;
    }

    // Empty pages are never emitted. Force a single pending item onto the page
    // instead of advancing a cursor and silently losing its data.
    const sections = [...left, ...right];
    if (!sections.length) {
      let forced = false;
      for (const [side, order] of [["left", leftOrder], ["right", rightOrder]]) {
        if (forced) break;
        const cursor = side === "left" ? leftCursor : rightCursor;
        const pos = side === "left" ? leftPos : rightPos;
        if (cursor) {
          const id = cursor.id;
          const value = cursor.data[cursor.cursor];
          const index = cursor.sourceIndices?.[cursor.cursor] ?? 0;
          if (value != null) {
            appendChunk(pageData, pageDataMeta, id, cursor.type === "string" ? value : [value], cursor.type === "string" ? null : [index]);
            if (side === "left") { leftCursor = cursor.type === "string" || cursor.cursor + 1 >= cursor.data.length ? null : { ...cursor, cursor: cursor.cursor + 1 }; }
            else { rightCursor = cursor.type === "string" || cursor.cursor + 1 >= cursor.data.length ? null : { ...cursor, cursor: cursor.cursor + 1 }; }
            sections.push(id);
            forced = true;
          }
        } else if (pos < order.length) {
          const id = order[pos];
          const next = createSectionCursor(resume, id);
          if (next) {
            const value = next.data[0];
            const index = next.sourceIndices?.[0] ?? 0;
            appendChunk(pageData, pageDataMeta, id, next.type === "string" ? value : [value], next.type === "string" ? null : [index]);
            if (side === "left") leftPos = pos + 1;
            else rightPos = pos + 1;
            const newCursor = next.type === "string" || next.data.length <= 1 ? null : { ...next, cursor: 1 };
            if (side === "left") leftCursor = newCursor;
            else rightCursor = newCursor;
            sections.push(id);
            forced = true;
          }
        }
      }
      if (!forced) break;
    }

    pages.push({
      isFirst,
      isContinuation: !isFirst,
      pageIndex,
      sections,
      left,
      right,
      pageData,
      pageDataMeta,
      continuationSections,
      resume,
      template,
    });

    pageIndex += 1;
    if (!(leftCursor || leftPos < leftOrder.length || rightCursor || rightPos < rightOrder.length)) break;
  }

  if (typeof window !== "undefined") window.__PAGINATE_DEBUG = pages;

  return pages;
};
