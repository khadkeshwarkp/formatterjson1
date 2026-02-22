# Formatterjson.org — Master Restructure & Expansion

This document describes the URL tree, content structure, and internal linking introduced by the restructure. **All existing URLs are unchanged**; new hubs, converters, and utilities are additive.

---

## 1. Final URL tree

### Homepage & hubs
| URL | Description | Priority |
|-----|-------------|----------|
| `/` | Platform homepage (unique content, no redirect) | 1.0 |
| `/json-tools` | JSON tools hub | 0.85 |
| `/xml-tools` | XML tools hub | 0.85 |
| `/yaml-tools` | YAML tools hub | 0.85 |
| `/encoding-tools` | Encoding tools hub | 0.85 |
| `/converters` | Converters hub | 0.85 |

### Existing tool URLs (unchanged)
| URL | Category |
|-----|----------|
| `/json-formatter`, `/json-validator`, `/json-minifier`, `/json-viewer`, `/json-parser`, `/json-pretty-print`, `/json-diff`, `/json-schema-generator`, `/json-to-xml`, `/json-to-csv`, `/json-to-yaml`, `/csv-to-json` | JSON |
| `/yaml-formatter`, `/yaml-to-json` | YAML |
| `/xml-formatter`, `/xml-validator`, `/xml-to-json` | XML |
| `/html-formatter` | Markup |
| `/url-encode`, `/url-decode`, `/base64`, `/base64-encode`, `/base64-decode` | Encoding |
| `/jwt-decoder` | Security |
| `/about`, `/privacy`, `/terms`, `/disclaimer`, `/contact` | Legal |

### New JSON-to-language converters (Phase 1)
| URL | Output |
|-----|--------|
| `/json-to-typescript` | TypeScript interfaces |
| `/json-to-python` | Python classes |
| `/json-to-java` | Java classes |
| `/json-to-go` | Go structs |
| `/json-to-csharp` | C# classes |
| `/json-to-dart` | Dart classes |
| `/json-to-rust` | Rust structs |
| `/json-to-kotlin` | Kotlin data classes |
| `/json-to-swift` | Swift structs |
| `/json-to-php` | PHP classes |

### New JSON utility pages (Phase 2)
| URL | Description |
|-----|-------------|
| `/json-compare` | Compare two JSON docs (two-panel, like json-diff) |
| `/json-sorter` | Sort JSON object keys |
| `/json-escape` | Escape string for JSON |
| `/json-unescape` | Unescape JSON string |
| `/json-editor` | Edit and format JSON |
| `/json-to-html-table` | JSON array → HTML table |
| `/json-to-sql` | JSON array → SQL INSERTs |
| `/json-to-excel` | JSON array → CSV (Excel) |
| `/json-to-tsv` | JSON array → TSV |
| `/json-to-one-line` | Minify JSON to one line |

---

## 2. Homepage structure outline

- **Route:** `/` (no redirect; distinct from `/json-formatter`).
- **Content:** 800–1200 words unique platform intro.
- **Sections:** What the platform offers; tool categories (with links to hubs); why browser-based; quick links to popular tools; FAQs (5–6); explore by category (hub cards); footer links (About, Contact, Privacy, Terms).
- **Schemas:** WebSite, BreadcrumbList (Home only), FAQPage.
- **Meta:** Unique title/description; canonical `/`.

---

## 3. Hub page template

- **Routes:** `/json-tools`, `/xml-tools`, `/yaml-tools`, `/encoding-tools`, `/converters`.
- **Content:** 800–1200 words unique to the category (ecosystem, not tool descriptions). Structured H2 sections and 5 FAQs.
- **Schemas:** CollectionPage, BreadcrumbList (Home > Hub), FAQPage.
- **Components:** `HubPage` in `components/hub/HubPage.tsx`; content in `lib/hub-content.ts` (title, description, metaDescription, faqs, sections).
- **Internal links:** Breadcrumb (Home, Hub); “Tools in this category” links to all tools in that hub; “Back to Home”.

---

## 4. Converter page template (JSON-to-language)

- **Route:** e.g. `/json-to-typescript`.
- **Layout:** Same as any tool: `ToolPage` → `ToolWorkspace` (Monaco input | output) + `ToolSEOContent`.
- **Processor:** In `lib/processors.ts` and `lib/json-to-code.ts`; input = JSON string, output = generated code (plaintext).
- **Registry:** `lib/tools-registry.ts` — `ToolMeta` with category `json`, sampleInput (JSON), sampleOutput (code snippet), 5 FAQs, relatedTools (e.g. json-formatter, json-validator, json-schema-generator).
- **Schemas:** FAQPage, WebApplication, BreadcrumbList (Home > JSON Tools > Tool).
- **Internal links:** Breadcrumb to Home and JSON Tools hub; Related Tools; All Developer Tools (Home, hub, other tools).

---

## 5. Internal linking map

- **Homepage (`/`)**  
  → All 5 hubs  
  → Popular tools (JSON Formatter, Validator, Minifier, Diff, JSON to XML, Base64, YAML/XML Formatter, JWT Decoder)  
  → Legal (About, Contact, Privacy, Terms)

- **Hub pages**  
  → Home  
  → Every tool in that hub (list of links)

- **Tool pages**  
  → Home (breadcrumb + “All Developer Tools”)  
  → Category hub (breadcrumb + “All Developer Tools”)  
  → 3–5 related tools (from `relatedTools` in registry)  
  → Full tool list in “All Developer Tools”

- **Crawl depth:** Home → Hub or Tool = 1 click; Home → Hub → Tool = 2 clicks; any tool → Home/hub = 1 click. Max depth from home ≤ 3.

---

## 6. Updated sitemap structure

- **Priority 1.0:** Homepage.
- **Priority 1.0:** `/json-formatter` (core).
- **Priority 0.9:** All other existing tool routes (core tools).
- **Priority 0.85:** Hub routes (`/json-tools`, `/xml-tools`, `/yaml-tools`, `/encoding-tools`, `/converters`).
- **Priority 0.8:** New converter routes (10 JSON-to-language) and new utility routes (10).
- **Priority 0.4:** `/about`, `/contact`.
- **Priority 0.3:** `/privacy`, `/terms`, `/disclaimer`.
- **Change frequency:** weekly for homepage, tools, hubs; monthly for legal.

---

## 7. Technical notes

- **No redirect** between `/` and `/json-formatter`; they are separate pages.
- **SSR:** Metadata and static structure are server-rendered; client components handle editor and state.
- **Canonical:** Every page has a canonical URL; no duplicate H1 or meta titles.
- **Breadcrumbs:** Tool pages use 3-level when applicable: Home > Category hub > Tool (via `lib/hubs.ts` and `ToolSEOContent`).
