import { Document, Image, Link, Page, StyleSheet, Text, View } from "@react-pdf/renderer";
import { sectionData, cleanText, paginateResume } from "./resumePagination";
import templateTitles from "./templateTitles.json";

const A4 = { width: 595.28, height: 841.89 };
const text = cleanText;
const arr = (value) => Array.isArray(value) ? value : [];
const primary = (theme) => theme?.primary || "#172033";
const secondary = (theme) => theme?.secondary || "#64748B";
const muted = (theme) => theme?.muted || "#667085";
const border = (theme) => theme?.border || "#DCE1E5";
const light = (theme) => theme?.light || "#F3F6F8";
const bodyText = (theme) => theme?.text || "#27303A";

const fontFor = (fontFamily) => {
  const family = String(fontFamily || "").toLowerCase();
  if (family.includes("georgia") || family.includes("times") || family.includes("serif")) return "Times-Roman";
  if (family.includes("courier") || family.includes("mono")) return "Courier";
  return "Helvetica";
};

const fontForBold = (fontFamily) => {
  const family = fontFor(fontFamily);
  if (family === "Times-Roman") return "Times-Bold";
  if (family === "Courier") return "Courier-Bold";
  return "Helvetica-Bold";
};

export const PDF_TEMPLATE_CONFIG = Object.freeze({
  Professional: { header: "dark", section: "accent", compact: false, sidebar: true },
  Modern: { header: "standard", section: "line", compact: false, sidebar: true },
  Minimal: { header: "standard", section: "line", compact: true, sidebar: false },
  Executive: { header: "dark", section: "caps", compact: false, sidebar: false },
  Corporate: { header: "standard", section: "accent", compact: false, sidebar: false },
  Strategic: { header: "dark", section: "line", compact: true, sidebar: true },
  CleanTech: { header: "standard", section: "line", compact: true, sidebar: false },
  Contemporary: { header: "standard", section: "accent", compact: true, sidebar: false },
  Elegant: { header: "center", section: "center", compact: false, sidebar: false },
  Refined: { header: "center", section: "accent", compact: true, sidebar: false },
  Classic: { header: "center", section: "caps", compact: true, sidebar: false },
});

const dateRange = (item) => {
  const start = text(item?.startDate);
  const end = text(item?.endDate);
  return [start, end].filter(Boolean).join(" — ");
};

const certificateDateRange = (item) => {
  const start = text(item?.issueDate || item?.date);
  const end = text(item?.expiryDate);
  return [start, end].filter(Boolean).join(" — ");
};

const safeUrl = (value) => {
  const candidate = text(value);
  if (!candidate) return "";
  try {
    const url = /^https?:\/\//i.test(candidate) ? new URL(candidate) : new URL(`https://${candidate}`);
    if (!['http:', 'https:'].includes(url.protocol)) return "";
    return url.toString();
  } catch {
    return "";
  }
};

const makeStyles = ({ fontScale = 1, fontFamily = "Inter" } = {}) => StyleSheet.create({
  page: { size: "A4", backgroundColor: "#FFFFFF", color: "#27303A", paddingTop: 38, paddingBottom: 38, paddingHorizontal: 40, fontFamily: fontFor(fontFamily) },
  name: { fontSize: 27 * fontScale, lineHeight: 1.02, fontFamily: fontForBold(fontFamily), marginBottom: 4 },
  title: { fontSize: 10 * fontScale, lineHeight: 1.3, marginBottom: 7 },
  contact: { fontSize: 7.7 * fontScale, lineHeight: 1.35, color: "#667085" },
  section: { marginTop: 12 },
  sectionHeading: { fontSize: 9.1 * fontScale, fontFamily: fontForBold(fontFamily), letterSpacing: 0.65, marginBottom: 6 },
  body: { fontSize: 8.8 * fontScale, lineHeight: 1.43, color: "#27303A" },
  small: { fontSize: 7.4 * fontScale, lineHeight: 1.35, color: "#667085" },
  item: { marginBottom: 8 },
  row: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start", gap: 9 },
  itemTitle: { fontSize: 9.35 * fontScale, fontFamily: fontForBold(fontFamily), lineHeight: 1.23 },
  itemSub: { fontSize: 8 * fontScale, lineHeight: 1.28, marginTop: 1.5 },
  bullets: { marginTop: 3, paddingLeft: 7 },
  bullet: { fontSize: 8.55 * fontScale, lineHeight: 1.42, marginBottom: 1.7, color: "#27303A" },
  rule: { borderBottomWidth: 0.8, borderBottomColor: "#DCE1E5", marginTop: 3, marginBottom: 7 },
  chipRow: { flexDirection: "row", flexWrap: "wrap", gap: 4 },
  chip: { fontSize: 7.25 * fontScale, paddingVertical: 3, paddingHorizontal: 5.5, borderRadius: 2 },
});

const contactLine = (resume) => {
  const p = resume?.personal || {};
  return [p.email, p.phone, p.location, p.linkedin, p.website].map(text).filter(Boolean).join("  •  ");
};

const Header = ({ resume, theme, styles, variant = "standard", template }) => {
  const p = resume?.personal || {};
  const contact = contactLine(resume);
  const photo = p.photo;
  if (variant === "dark") return (
    <View style={{ backgroundColor: primary(theme), marginHorizontal: -40, marginTop: -38, paddingHorizontal: 40, paddingTop: 31, paddingBottom: 24, marginBottom: 15 }}>
      <View style={{ flexDirection: "row", alignItems: "center", gap: 13 }}>
        {photo ? <Image src={photo} style={{ width: 57, height: 57, borderRadius: 28.5 }} /> : null}
        <View style={{ flexGrow: 1 }}>
          <Text style={{ ...styles.name, color: "#FFFFFF" }}>{text(p.fullname) || "Your Name"}</Text>
          {text(p.title) ? <Text style={{ ...styles.title, color: "#FFFFFF", opacity: 0.9 }}>{text(p.title)}</Text> : null}
          {contact ? <Text style={{ ...styles.contact, color: "#FFFFFF", opacity: 0.78 }}>{contact}</Text> : null}
        </View>
      </View>
    </View>
  );
  if (variant === "center") return (
    <View style={{ alignItems: "center", marginBottom: 13 }}>
      {photo ? <Image src={photo} style={{ width: 55, height: 55, borderRadius: 27.5, marginBottom: 7 }} /> : null}
      <Text style={{ ...styles.name, color: primary(theme), textAlign: "center" }}>{text(p.fullname) || "Your Name"}</Text>
      {text(p.title) ? <Text style={{ ...styles.title, color: secondary(theme), textAlign: "center" }}>{text(p.title)}</Text> : null}
      {contact ? <Text style={{ ...styles.contact, textAlign: "center" }}>{contact}</Text> : null}
    </View>
  );
  return (
    <View style={{ marginBottom: 10 }}>
      <Text style={{ ...styles.name, color: primary(theme) }}>{text(p.fullname) || "Your Name"}</Text>
      {text(p.title) ? <Text style={{ ...styles.title, color: secondary(theme) }}>{text(p.title)}</Text> : null}
      {contact ? <Text style={styles.contact}>{contact}</Text> : null}
      {template === "Contemporary" ? <View style={{ height: 3, width: 62, backgroundColor: primary(theme), marginTop: 9 }} /> : null}
    </View>
  );
};

const SectionHeading = ({ title, theme, styles, variant = "line" }) => {
  if (variant === "caps") return <Text style={{ ...styles.sectionHeading, color: primary(theme) }}>{title.toUpperCase()}</Text>;
  if (variant === "accent") return <View style={{ marginBottom: 7 }}><Text style={{ ...styles.sectionHeading, color: primary(theme), marginBottom: 3 }}>{title}</Text><View style={{ height: 2.2, width: 30, backgroundColor: primary(theme) }} /></View>;
  if (variant === "center") return <View style={{ alignItems: "center", marginBottom: 7 }}><Text style={{ ...styles.sectionHeading, color: primary(theme) }}>{title}</Text><View style={{ width: 38, height: 0.8, backgroundColor: border(theme) }} /></View>;
  return <View style={{ marginBottom: 7 }}><Text style={{ ...styles.sectionHeading, color: primary(theme) }}>{title}</Text><View style={styles.rule} /></View>;
};

const Experience = ({ items, theme, styles, compact = false }) => <>
  {items.map((item, index) => (
    <View key={`exp-${index}`} style={{ ...styles.item, marginBottom: compact ? 6 : 8 }}>
      <View style={styles.row}>
        <View style={{ flex: 1, paddingRight: 6 }}>
          <Text style={{ ...styles.itemTitle, color: primary(theme) }}>{text(item.position || item.title)}</Text>
          {text(item.company) ? <Text style={{ ...styles.itemSub, color: secondary(theme) }}>{text(item.company)}</Text> : null}
        </View>
        {dateRange(item) ? <Text style={{ ...styles.small, textAlign: "right", color: muted(theme) }}>{dateRange(item)}</Text> : null}
      </View>
      {text(item.description) ? <Text style={{ ...styles.body, marginTop: 3 }}>{text(item.description)}</Text> : null}
      {arr(item.responsibilities).length ? <View style={styles.bullets}>{arr(item.responsibilities).map((bullet, idx) => <Text key={idx} style={styles.bullet}>• {text(bullet)}</Text>)}</View> : null}
    </View>
  ))}
</>;

const Education = ({ items, theme, styles }) => <>{items.map((item, index) => <View key={`edu-${index}`} style={styles.item}>
  <View style={styles.row}><View style={{ flex: 1, paddingRight: 5 }}><Text style={{ ...styles.itemTitle, color: primary(theme) }}>{text(item.degree)}</Text>{text(item.institution) ? <Text style={{ ...styles.itemSub, color: secondary(theme) }}>{text(item.institution)}</Text> : null}</View>{dateRange(item) ? <Text style={{ ...styles.small, textAlign: "right" }}>{dateRange(item)}</Text> : null}</View>
  {text(item.description) ? <Text style={{ ...styles.body, marginTop: 3 }}>{text(item.description)}</Text> : null}
</View>)}</>;

const Projects = ({ items, theme, styles }) => <>{items.map((item, index) => {
  const link = safeUrl(item.link);
  return <View key={`proj-${index}`} style={styles.item}>
    <View style={styles.row}><Text style={{ ...styles.itemTitle, color: primary(theme), flex: 1 }}>{text(item.name) || "Project"}</Text>{dateRange(item) ? <Text style={styles.small}>{dateRange(item)}</Text> : null}</View>
    {text(item.description) ? <Text style={{ ...styles.body, marginTop: 3 }}>{text(item.description)}</Text> : null}
    {text(item.technologies) ? <Text style={{ ...styles.small, marginTop: 2 }}>Technologies: {text(item.technologies)}</Text> : null}
    {link ? <Link src={link} style={{ ...styles.small, color: primary(theme), marginTop: 2 }}>{text(item.link)}</Link> : text(item.link) ? <Text style={{ ...styles.small, color: muted(theme), marginTop: 2 }}>{text(item.link)}</Text> : null}
  </View>;
})}</>;

const formatLanguage = (item) => {
  if (typeof item === "string") return text(item);
  const language = text(item?.language || item?.name);
  const proficiency = text(item?.proficiency);
  return [language, proficiency].filter(Boolean).join(" — ");
};

const GenericList = ({ items, theme, styles, variant = "text" }) => variant === "chips"
  ? <View style={styles.chipRow}>{items.map((item, idx) => <View key={idx} style={{ ...styles.chip, backgroundColor: light(theme), borderWidth: 0.5, borderColor: border(theme) }}><Text style={{ color: primary(theme) }}>{text(item?.name || item)}</Text></View>)}</View>
  : <View>{items.map((item, idx) => <Text key={idx} style={{ ...styles.body, marginBottom: 3 }}>{variant === "bullet" ? "• " : ""}{text(item?.name || item)}</Text>)}</View>;

const Certificates = ({ items, theme, styles }) => <>{items.map((item, index) => {
  const credentialUrl = safeUrl(item.credentialUrl);
  return <View key={index} style={styles.item}>
    <Text style={{ ...styles.itemTitle, color: primary(theme) }}>{text(item.name)}</Text>
    {text(item.issuer) ? <Text style={{ ...styles.itemSub, color: secondary(theme) }}>{text(item.issuer)}</Text> : null}
    {certificateDateRange(item) ? <Text style={styles.small}>{certificateDateRange(item)}</Text> : null}
    {text(item.credentialId) ? <Text style={styles.small}>Credential ID: {text(item.credentialId)}</Text> : null}
    {credentialUrl ? <Link src={credentialUrl} style={{ ...styles.small, color: primary(theme) }}>{text(item.credentialUrl)}</Link> : text(item.credentialUrl) ? <Text style={{ ...styles.small, color: muted(theme) }}>{text(item.credentialUrl)}</Text> : null}
  </View>;
})}</>;
const AdditionalInformation = ({ items, theme, styles }) => <>{items.map((item, index) => { const heading = text(item.heading || item.name); const duplicateHeading = heading.toLowerCase() === "additional information"; const link = safeUrl(item.link); return <View key={index} style={styles.item}>{heading && !duplicateHeading ? <Text style={{ ...styles.itemTitle, color: primary(theme) }}>{heading}</Text> : null}{text(item.content || item.description) ? <Text style={{ ...styles.body, marginTop: 3 }}>{text(item.content || item.description)}</Text> : null}{arr(item.bullets).map((b, bi) => <Text key={bi} style={styles.bullet}>• {text(b)}</Text>)}{link ? <Link src={link} style={{ ...styles.small, color: primary(theme), marginTop: 2 }}>{text(item.link)}</Link> : text(item.link) ? <Text style={{ ...styles.small, color: muted(theme), marginTop: 2 }}>{text(item.link)}</Text> : null}</View>; })}</>;

const SectionBlock = ({ id, template, resume, layout, pageData, continuationSections, theme, styles, variant = "line", compact = false }) => {
  const defaultTitles = { summary: "Professional Summary", experience: "Professional Experience", projects: "Projects", education: "Education", skills: "Skills", coreSkills: "Core Skills", keyAchievements: "Key Achievements", certificates: "Certificates", languages: "Languages", hobbies: "Hobbies & Interests", additionalInformation: "Additional Information" };
  const titles = templateTitles[template] || defaultTitles;
  const data = pageData?.[id] ?? sectionData(resume, id);
  if (!data || (Array.isArray(data) && !data.length) || (typeof data === "string" && !data.trim())) return null;
  const content = id === "summary" ? <Text style={styles.body}>{data}</Text>
    : id === "experience" ? <Experience items={data} theme={theme} styles={styles} compact={compact} />
    : id === "education" ? <Education items={data} theme={theme} styles={styles} />
    : id === "projects" ? <Projects items={data} theme={theme} styles={styles} />
    : id === "certificates" ? <Certificates items={data} theme={theme} styles={styles} />
    : id === "additionalInformation" ? <AdditionalInformation items={data} theme={theme} styles={styles} />
    : id === "languages" ? <View>{data.map((item, idx) => <Text key={idx} style={{ ...styles.body, marginBottom: 3 }}>{formatLanguage(item)}</Text>)}</View>
    : id === "keyAchievements" ? <GenericList items={data} theme={theme} styles={styles} variant="bullet" />
    : <GenericList items={data} theme={theme} styles={styles} variant="chips" />;
  const heading = titles[id] || defaultTitles[id];
  const sectionStyle = layout?.sectionStyles?.[id] || {};
  const customMarginTop = sectionStyle.marginTop != null ? sectionStyle.marginTop : undefined;
  const customMarginBottom = sectionStyle.marginBottom != null ? sectionStyle.marginBottom : undefined;
  const computedMarginTop = customMarginTop !== undefined ? customMarginTop : (compact ? 9 : 12);
  const computedMarginBottom = customMarginBottom !== undefined ? customMarginBottom : 0;
  
  return <View style={{ ...styles.section, marginTop: computedMarginTop, marginBottom: computedMarginBottom }}><SectionHeading title={heading} theme={theme} styles={styles} variant={variant} />{content}</View>;
};

const sectionsFor = (sections, pageData) => sections.filter((id) => {
  const value = pageData?.[id];
  return value != null && (!Array.isArray(value) || value.length > 0) && (typeof value !== "string" || value.trim());
});

const PageShell = ({ template, sections, pageData, continuationSections, resume, layout, theme, styles, isFirst, left, right, headerVariant, sectionVariant = "line", compact = false, sidebar = false }) => {
  const actualSections = sectionsFor(sections, pageData);
  const content = () => {
    if (!sidebar) return actualSections.map((id) => <SectionBlock key={id} id={id} template={template} resume={resume} layout={layout} pageData={pageData} continuationSections={continuationSections} theme={theme} styles={styles} variant={sectionVariant} compact={compact} />);
    return <View style={{ flexDirection: "row", gap: 17 }}>
      <View style={{ flex: 1, minWidth: 0 }}>{sectionsFor(left, pageData).map((id) => <SectionBlock key={id} id={id} template={template} resume={resume} layout={layout} pageData={pageData} continuationSections={continuationSections} theme={theme} styles={styles} variant={sectionVariant} compact={compact} />)}</View>
      <View style={{ width: "34%", minWidth: 0, borderLeftWidth: 0.7, borderLeftColor: border(theme), paddingLeft: 14 }}>{sectionsFor(right, pageData).map((id) => <SectionBlock key={id} id={id} template={template} resume={resume} layout={layout} pageData={pageData} continuationSections={continuationSections} theme={theme} styles={styles} variant="caps" compact />)}</View>
    </View>;
  };
  return <Page size="A4" style={styles.page}>
    {isFirst ? <Header resume={resume} theme={theme} styles={styles} variant={headerVariant} template={template} /> : null}
    {content()}
  </Page>;
};

const RenderTemplatePage = (props) => {
  const { template, sections, pageData, continuationSections, resume, layout, theme, styles, isFirst, left, right } = props;
  const sidebarSets = {
    Professional: { main: ["summary", "experience", "projects", "keyAchievements"], side: ["education", "skills", "coreSkills", "certificates", "languages", "hobbies", "additionalInformation"] },
    Modern: { main: ["summary", "experience", "projects", "keyAchievements"], side: ["education", "skills", "coreSkills", "certificates", "languages", "hobbies", "additionalInformation"] },
    Strategic: { main: ["summary", "experience", "projects", "keyAchievements", "certificates"], side: ["education", "skills", "coreSkills", "languages", "hobbies", "additionalInformation"] },
  };
  const config = PDF_TEMPLATE_CONFIG[template] || PDF_TEMPLATE_CONFIG.Professional;
  if (config.sidebar) {
    const set = sidebarSets[template] || sidebarSets.Professional;
    return <PageShell {...props} left={left?.length ? left : set.main} right={right?.length ? right : set.side} sidebar headerVariant={config.header} sectionVariant={config.section} compact={config.compact} />;
  }
  return <PageShell {...props} headerVariant={config.header} sectionVariant={config.section} compact={config.compact} />;
};

export const ResumePdfDocument = ({ resume, template = "Professional", theme = {}, layout = {} }) => {
  const fontScale = Math.max(0.82, Math.min(1.2, Number(layout?.fontSize || 100) / 100));
  const styles = makeStyles({ fontScale, fontFamily: layout?.fontFamily });
  const pageSections = paginateResume({ resume, layout, template });
  return <Document title={text(resume?.personal?.fullname) ? `${text(resume.personal.fullname)} — Resume` : "Resummetry Resume"} author="Resummetry" subject="Resume" creator="Resummetry" keywords="resume, CV, Resummetry" language="en-US">
    {pageSections.map((page, index) => <RenderTemplatePage key={index} template={template} sections={page.sections} pageData={page.pageData} continuationSections={page.continuationSections} resume={page.resume} layout={layout} theme={theme} styles={styles} isFirst={page.isFirst} left={page.left} right={page.right} />)}
  </Document>;
};

export { A4 };
