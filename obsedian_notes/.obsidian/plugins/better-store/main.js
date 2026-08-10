"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key2 of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key2) && key2 !== except)
        __defProp(to, key2, { get: () => from[key2], enumerable: !(desc = __getOwnPropDesc(from, key2)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/main.ts
var main_exports = {};
__export(main_exports, {
  default: () => BetterStorePlugin
});
module.exports = __toCommonJS(main_exports);
var import_obsidian9 = require("obsidian");

// src/data/registry.ts
function isRegistryPlugin(v) {
  if (typeof v !== "object" || v === null) return false;
  const o = v;
  return typeof o.id === "string" && typeof o.name === "string" && typeof o.author === "string" && typeof o.description === "string" && typeof o.repo === "string";
}
function parseRegistry(raw) {
  if (!Array.isArray(raw)) return [];
  return raw.filter(isRegistryPlugin).map((p) => ({
    id: p.id,
    name: p.name,
    author: p.author,
    description: p.description,
    repo: p.repo
  }));
}
function slimStats(raw) {
  if (typeof raw !== "object" || raw === null || Array.isArray(raw)) return {};
  const out = {};
  for (const [id, v] of Object.entries(raw)) {
    if (typeof v !== "object" || v === null) continue;
    const o = v;
    out[id] = {
      downloads: typeof o.downloads === "number" ? o.downloads : 0,
      updated: typeof o.updated === "number" ? o.updated : 0
    };
  }
  return out;
}
function mergeRegistry(plugins, stats, classify) {
  return plugins.map((p) => ({
    ...p,
    downloads: stats[p.id]?.downloads ?? 0,
    updated: stats[p.id]?.updated ?? 0,
    categories: classify(p.name, p.description)
  }));
}

// src/data/categories.ts
var CATEGORY_RULES = [
  { category: "Tasks", keywords: ["task", "tasks", "todo", "to-do", "kanban", "checklist", "gtd", "project management"] },
  { category: "Sync & Backup", keywords: ["sync", "syncing", "backup", "git", "version control", "s3", "webdav"] },
  { category: "AI", keywords: ["ai", "gpt", "llm", "openai", "claude", "chatgpt", "copilot", "whisper", "ollama", "embedding", "semantic search"] },
  { category: "Appearance", keywords: ["theme", "style", "styling", "css", "icon", "icons", "color", "colors", "appearance", "font", "fonts", "banner"] },
  { category: "Editor", keywords: ["editor", "editing", "autocomplete", "snippet", "snippets", "shortcut", "hotkey", "vim", "paste", "formatting", "markdown syntax", "toolbar"] },
  { category: "Export & Import", keywords: ["export", "import", "pdf", "epub", "docx", "convert", "converter"] },
  { category: "Calendar & Time", keywords: ["calendar", "daily note", "daily notes", "weekly", "journal", "diary", "pomodoro", "habit", "time tracking", "timer"] },
  { category: "Data & Queries", keywords: ["dataview", "query", "queries", "table", "tables", "database", "chart", "charts", "graph", "sql", "csv", "statistics"] },
  { category: "Files & Organization", keywords: ["file", "files", "folder", "folders", "attachment", "attachments", "tag", "tags", "organize", "explorer", "bookmark", "archive"] },
  { category: "Publishing & Sharing", keywords: ["publish", "publishing", "share", "sharing", "blog", "website", "hugo", "jekyll", "wordpress"] },
  { category: "Integrations", keywords: ["integration", "zotero", "anki", "readwise", "notion", "todoist", "spotify", "telegram", "slack", "github", "jira", "discord", "home assistant"] }
];
var ALL_CATEGORIES = [...CATEGORY_RULES.map((r) => r.category), "Other"];
function escapeRegExp(s) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
var RULE_PATTERNS = CATEGORY_RULES.map((r) => ({
  category: r.category,
  pattern: new RegExp(`\\b(${r.keywords.map(escapeRegExp).join("|")})\\b`, "i")
}));
function classifyPlugin(name, description) {
  const text2 = `${name} ${description}`;
  const cats = RULE_PATTERNS.filter((r) => r.pattern.test(text2)).map((r) => r.category);
  return cats.length > 0 ? cats : ["Other"];
}

// src/data/trending.ts
var DEFAULTS = { maxSnapshots: 30, minIntervalMs: 6 * 36e5 };
function appendSnapshot(history, snap, opts) {
  const { maxSnapshots, minIntervalMs } = { ...DEFAULTS, ...opts };
  const last = history[history.length - 1];
  if (last && snap.ts - last.ts < minIntervalMs) return history;
  return [...history, snap].slice(-maxSnapshots);
}
function computeDeltas(history) {
  if (history.length < 2) return {};
  const first = history[0];
  const last = history[history.length - 1];
  const out = {};
  for (const [id, n] of Object.entries(last.downloads)) {
    const baseline = first.downloads[id];
    if (baseline != null) out[id] = n - baseline;
  }
  return out;
}
function historyFor(history, id) {
  return history.filter((s) => id in s.downloads).map((s) => ({ ts: s.ts, downloads: s.downloads[id] }));
}

// src/data/newness.ts
function updateKnownIds(known, currentIds, now) {
  if (known == null) {
    return { firstSeen: Object.fromEntries(currentIds.map((id) => [id, 0])) };
  }
  const firstSeen = { ...known.firstSeen };
  for (const id of currentIds) {
    if (!(id in firstSeen)) firstSeen[id] = now;
  }
  return { firstSeen };
}
function newIdsWithin(known, days, now) {
  const cutoff = now - days * 864e5;
  return new Set(
    Object.entries(known.firstSeen).filter(([, ts]) => ts > 0 && ts >= cutoff).map(([id]) => id)
  );
}

// src/data/scan.ts
function pendingRepos(repos, cache, now, maxAgeMs) {
  const seen = /* @__PURE__ */ new Set();
  const ranked = [];
  for (const repo of repos) {
    if (seen.has(repo)) continue;
    seen.add(repo);
    const entry = cache[repo];
    if (entry == null) {
      ranked.push({ repo, key: -Infinity });
    } else if (now - entry.scannedAt >= maxAgeMs) {
      ranked.push({ repo, key: entry.scannedAt });
    }
  }
  return ranked.map((r, i) => ({ ...r, i })).sort((a, b) => a.key - b.key || a.i - b.i).map((r) => r.repo);
}

// src/data/service.ts
var REGISTRY_URL = "https://raw.githubusercontent.com/obsidianmd/obsidian-releases/HEAD/community-plugins.json";
var STATS_URL = "https://raw.githubusercontent.com/obsidianmd/obsidian-releases/HEAD/community-plugin-stats.json";
var RateLimitError = class extends Error {
  constructor() {
    super("GitHub API rate limit reached. Add a GitHub token in Better Store settings to raise it.");
    this.name = "RateLimitError";
  }
};
function parseTimestamp(value) {
  if (typeof value !== "string") return 0;
  const ms = Date.parse(value);
  return Number.isNaN(ms) ? 0 : ms;
}
var DataService = class {
  constructor(io, cacheDir, opts) {
    this.io = io;
    this.cacheDir = cacheDir;
    this.opts = opts;
  }
  readmes = /* @__PURE__ */ new Map();
  enrichments = /* @__PURE__ */ new Map();
  /** Persistent stars/open-issues cache, loaded lazily from repostats.json. */
  repoStatsCache = null;
  /** Serializes read-modify-write operations on the local snapshot files. */
  writeLock = Promise.resolve();
  /**
   * Run a read-modify-write task after any previous one finishes, so overlapping
   * catalog refreshes can't interleave their updates to history.json/known.json.
   */
  serialize(task) {
    const run3 = this.writeLock.then(task, task);
    this.writeLock = run3.catch(() => {
    });
    return run3;
  }
  async readJson(name) {
    const raw = await this.io.readFile(`${this.cacheDir}/${name}`);
    if (raw == null) return null;
    try {
      return JSON.parse(raw);
    } catch {
      return null;
    }
  }
  writeJson(name, value) {
    return this.io.writeFile(`${this.cacheDir}/${name}`, JSON.stringify(value));
  }
  async loadCatalog(force = false) {
    const cachedRaw = await this.readJson("catalog.json");
    const cached = cachedRaw != null && Array.isArray(cachedRaw.entries) && typeof cachedRaw.fetchedAt === "number" ? cachedRaw : null;
    const fresh = cached != null && this.io.now() - cached.fetchedAt < this.opts.ttlMs;
    if (cached && fresh && !force) return { ...cached, stale: false };
    try {
      const [registryRaw, statsRaw] = await Promise.all([
        this.io.fetchText(REGISTRY_URL),
        this.io.fetchText(STATS_URL)
      ]);
      const entries = mergeRegistry(
        parseRegistry(JSON.parse(registryRaw)),
        slimStats(JSON.parse(statsRaw)),
        classifyPlugin
      );
      const catalog = { entries, fetchedAt: this.io.now() };
      await this.writeJson("catalog.json", catalog);
      await this.recordSnapshot(entries);
      await this.recordKnownIds(entries);
      return { ...catalog, stale: false };
    } catch (e) {
      if (cached) return { ...cached, stale: true };
      throw e;
    }
  }
  recordSnapshot(entries) {
    return this.serialize(async () => {
      const history = await this.readJson("history.json") ?? [];
      const snap = {
        ts: this.io.now(),
        downloads: Object.fromEntries(entries.map((e) => [e.id, e.downloads]))
      };
      const next2 = appendSnapshot(history, snap);
      if (next2 !== history) await this.writeJson("history.json", next2);
    });
  }
  async getTrendingDeltas() {
    return computeDeltas(await this.readJson("history.json") ?? []);
  }
  recordKnownIds(entries) {
    return this.serialize(async () => {
      const known = await this.readJson("known.json");
      const next2 = updateKnownIds(
        known != null && typeof known.firstSeen === "object" ? known : null,
        entries.map((e) => e.id),
        this.io.now()
      );
      await this.writeJson("known.json", next2);
    });
  }
  /** Ids of plugins that first appeared in the registry within the last N days. */
  async getNewIds(days) {
    const known = await this.readJson("known.json");
    if (known == null || typeof known.firstSeen !== "object") return /* @__PURE__ */ new Set();
    return newIdsWithin(known, days, this.io.now());
  }
  /** True when requests carry a GitHub token (raised rate limit). */
  hasGithubToken() {
    return Boolean(this.opts.githubToken);
  }
  async ensureRepoStats() {
    if (this.repoStatsCache == null) {
      const stored = await this.readJson("repostats.json");
      const entries = Object.entries(stored?.stats ?? {}).map(([repo, s]) => {
        const hasCreated = typeof s?.createdAt === "number";
        return [
          repo,
          {
            stars: typeof s?.stars === "number" ? s.stars : 0,
            openIssues: typeof s?.openIssues === "number" ? s.openIssues : 0,
            createdAt: hasCreated ? s.createdAt : 0,
            scannedAt: hasCreated && typeof s?.scannedAt === "number" ? s.scannedAt : 0
          }
        ];
      });
      this.repoStatsCache = new Map(entries);
    }
    return this.repoStatsCache;
  }
  /**
   * Stars + open issues for one repo — a single API call. Reads through the
   * persistent scan cache first, then any already-fetched enrichment, so cards
   * and sorts reuse scanned data without re-hitting the API.
   */
  async getRepoStats(repo) {
    const cache = await this.ensureRepoStats();
    const hit = cache.get(repo);
    if (hit != null) return hit;
    const enriched = this.enrichments.get(repo);
    if (enriched) {
      const stats2 = {
        stars: enriched.stars,
        openIssues: enriched.openIssues,
        createdAt: enriched.createdAt,
        scannedAt: this.io.now()
      };
      cache.set(repo, stats2);
      return stats2;
    }
    const raw = await this.githubFetch(`https://api.github.com/repos/${repo}`);
    const data = JSON.parse(raw);
    const stats = {
      stars: data.stargazers_count ?? 0,
      openIssues: data.open_issues_count ?? 0,
      createdAt: parseTimestamp(data.created_at),
      scannedAt: this.io.now()
    };
    cache.set(repo, stats);
    return stats;
  }
  /** Snapshot of all scanned repo stats, keyed by repo. */
  async getAllRepoStats() {
    return Object.fromEntries(await this.ensureRepoStats());
  }
  persistRepoStats() {
    const cache = this.repoStatsCache;
    if (cache == null) return Promise.resolve();
    return this.serialize(() => this.writeJson("repostats.json", { stats: Object.fromEntries(cache) }));
  }
  /**
   * Scan the given repos for stars/open issues, filling the persistent cache.
   * Resumable and incremental (skips repos scanned within maxAgeMs), cancellable,
   * and rate-limit aware: on a rate-limit error it stops cleanly with progress saved.
   */
  async scanRepos(repos, opts) {
    const cache = await this.ensureRepoStats();
    const now = this.io.now();
    const queue = pendingRepos(repos, Object.fromEntries(cache), now, opts.maxAgeMs);
    const total = queue.length;
    let done = 0;
    let rateLimited = false;
    let cancelled = false;
    const worker = async () => {
      while (queue.length > 0) {
        if (rateLimited || cancelled) return;
        if (opts.isCancelled?.()) {
          cancelled = true;
          return;
        }
        const repo = queue.shift();
        if (repo == null) return;
        try {
          await this.getRepoStats(repo);
        } catch (e) {
          if (e instanceof RateLimitError) {
            rateLimited = true;
            return;
          }
        }
        done++;
        opts.onProgress?.(done, total);
        if (done % 25 === 0) await this.persistRepoStats();
      }
    };
    const workers = Math.max(1, Math.min(opts.concurrency ?? 5, 8));
    await Promise.all(Array.from({ length: workers }, () => worker()));
    await this.persistRepoStats();
    return { scanned: done, total, rateLimited, cancelled };
  }
  githubHeaders() {
    return this.opts.githubToken ? { Authorization: `Bearer ${this.opts.githubToken}` } : void 0;
  }
  async githubFetch(url) {
    try {
      return await this.io.fetchText(url, this.githubHeaders());
    } catch (e) {
      const msg = String(e instanceof Error ? e.message : e);
      if (msg.includes("HTTP 403") || msg.includes("HTTP 429")) throw new RateLimitError();
      throw e;
    }
  }
  async getReadme(repo) {
    const hit = this.readmes.get(repo);
    if (hit != null) return hit;
    let lastError = new Error(`no README found for ${repo}`);
    for (const name of ["README.md", "readme.md", "Readme.md"]) {
      try {
        const text2 = await this.io.fetchText(`https://raw.githubusercontent.com/${repo}/HEAD/${name}`);
        this.readmes.set(repo, text2);
        return text2;
      } catch (e) {
        lastError = e;
      }
    }
    throw lastError;
  }
  /** One plugin's download series from the stored trending snapshots. */
  async getDownloadHistory(id) {
    return historyFor(await this.readJson("history.json") ?? [], id);
  }
  async getEnrichment(repo) {
    const hit = this.enrichments.get(repo);
    if (hit) return hit;
    const [repoRaw, releasesRaw, manifestRaw] = await Promise.all([
      this.githubFetch(`https://api.github.com/repos/${repo}`),
      this.githubFetch(`https://api.github.com/repos/${repo}/releases?per_page=10`),
      this.io.fetchText(`https://raw.githubusercontent.com/${repo}/HEAD/manifest.json`).catch(() => null)
    ]);
    const repoData = JSON.parse(repoRaw);
    let releasesData;
    try {
      releasesData = JSON.parse(releasesRaw);
    } catch {
      releasesData = [];
    }
    let manifest = {};
    if (manifestRaw != null) {
      try {
        manifest = JSON.parse(manifestRaw);
      } catch {
        manifest = {};
      }
    }
    const enrichment = {
      stars: repoData.stargazers_count ?? 0,
      openIssues: repoData.open_issues_count ?? 0,
      releases: (Array.isArray(releasesData) ? releasesData : []).map((r) => ({
        tag: r.tag_name ?? "",
        publishedAt: r.published_at ?? "",
        url: r.html_url ?? "",
        body: typeof r.body === "string" ? r.body : ""
      })),
      latestVersion: typeof manifest.version === "string" ? manifest.version : null,
      minAppVersion: typeof manifest.minAppVersion === "string" ? manifest.minAppVersion : null,
      fundingUrl: typeof manifest.fundingUrl === "string" && /^https?:\/\//i.test(manifest.fundingUrl) ? manifest.fundingUrl : null,
      createdAt: parseTimestamp(repoData.created_at)
    };
    this.enrichments.set(repo, enrichment);
    return enrichment;
  }
  async getLatestVersion(repo) {
    try {
      const raw = await this.io.fetchText(`https://raw.githubusercontent.com/${repo}/HEAD/manifest.json`);
      const manifest = JSON.parse(raw);
      return typeof manifest.version === "string" ? manifest.version : null;
    } catch {
      return null;
    }
  }
};

// src/data/versions.ts
function splitPrerelease(v) {
  const i = v.indexOf("-");
  return i === -1 ? [v, null] : [v.slice(0, i), v.slice(i + 1)];
}
function compareVersions(a, b) {
  const [coreA, preA] = splitPrerelease(a);
  const [coreB, preB] = splitPrerelease(b);
  const pa = coreA.split(".").map((s) => parseInt(s, 10) || 0);
  const pb = coreB.split(".").map((s) => parseInt(s, 10) || 0);
  const len = Math.max(pa.length, pb.length);
  for (let i = 0; i < len; i++) {
    const d = (pa[i] ?? 0) - (pb[i] ?? 0);
    if (d !== 0) return d;
  }
  if (preA === null && preB === null) return 0;
  if (preA === null) return 1;
  if (preB === null) return -1;
  return preA < preB ? -1 : preA > preB ? 1 : 0;
}

// src/data/token.ts
function resolveLegacySecret(legacyValue, legacyId, existingIds) {
  if (!legacyValue) return { secretId: "", scrubLegacy: false };
  if (legacyValue === legacyId) return { secretId: "", scrubLegacy: true };
  if (existingIds.includes(legacyValue)) return { secretId: legacyValue, scrubLegacy: true };
  return { secretId: legacyId, scrubLegacy: false };
}
function summarizeTokenCheck(hasToken, status, body) {
  if (status === 401) return { valid: false, message: "GitHub token is invalid or expired." };
  if (status >= 400) return { valid: false, message: `GitHub API returned HTTP ${status} \u2014 try again later.` };
  let limit;
  let remaining;
  try {
    const parsed = JSON.parse(body);
    const core = parsed.resources?.core ?? parsed.rate;
    limit = core?.limit;
    remaining = core?.remaining;
  } catch {
  }
  if (limit == null || remaining == null) {
    return { valid: false, message: "GitHub API responded, but the rate limit could not be read." };
  }
  const quota = `${remaining.toLocaleString()} of ${limit.toLocaleString()} requests remaining this hour`;
  if (!hasToken) return { valid: false, message: `No token set \u2014 using the anonymous limit (${quota}).` };
  if (limit <= 60) return { valid: false, message: `Token was not accepted \u2014 still on the anonymous limit (${quota}).` };
  return { valid: true, message: `GitHub token is valid \u2014 ${quota}.` };
}

// src/data/updates.ts
var DURATION_MS = {
  "1h": 36e5,
  "8h": 8 * 36e5,
  "1d": 24 * 36e5,
  "3d": 3 * 24 * 36e5,
  "1w": 7 * 24 * 36e5
};
var MUTE_OPTIONS = [
  { value: "1h", label: "1 hour" },
  { value: "8h", label: "8 hours" },
  { value: "1d", label: "1 day" },
  { value: "3d", label: "3 days" },
  { value: "1w", label: "1 week" }
];
function muteDeadline(choice, now) {
  return now + DURATION_MS[choice];
}
function isMuted(prefs, now) {
  return prefs.muteUntil > now;
}
function isUpdateActionable(id, latest, prefs) {
  if (prefs.ignored.includes(id)) return false;
  const skipped = prefs.skipped[id];
  if (skipped != null && compareVersions(latest, skipped) <= 0) return false;
  return true;
}
function muteRemaining(prefs, now) {
  const ms = prefs.muteUntil - now;
  if (ms <= 0) return null;
  const hours = Math.ceil(ms / 36e5);
  if (hours < 24) return `${hours}h`;
  const days = Math.floor(hours / 24);
  const rem = hours % 24;
  return rem > 0 ? `${days}d ${rem}h` : `${days}d`;
}

// src/data/brat.ts
var BRAT_PLUGIN_ID = "obsidian42-brat";
var BRAT_COMMANDS = {
  addBetaPlugin: `${BRAT_PLUGIN_ID}:AddBetaPlugin`,
  checkAndUpdate: `${BRAT_PLUGIN_ID}:checkForUpdatesAndUpdate`,
  checkOnly: `${BRAT_PLUGIN_ID}:checkForUpdatesAndDontUpdate`
};
function parseBratPlugins(raw) {
  if (raw == null || typeof raw !== "object") return [];
  const data = raw;
  const byRepo = /* @__PURE__ */ new Map();
  if (Array.isArray(data.pluginList)) {
    for (const repo of data.pluginList) {
      if (typeof repo === "string" && repo.trim()) {
        byRepo.set(repo, { repo, frozenVersion: null });
      }
    }
  }
  if (Array.isArray(data.pluginSubListFrozenVersion)) {
    for (const item of data.pluginSubListFrozenVersion) {
      if (item == null || typeof item !== "object") continue;
      const { repo, version } = item;
      if (typeof repo !== "string" || !repo.trim()) continue;
      const frozenVersion = typeof version === "string" && version !== "latest" ? version : null;
      byRepo.set(repo, { repo, frozenVersion });
    }
  }
  return [...byRepo.values()].sort((a, b) => a.repo.localeCompare(b.repo));
}

// src/data/portability.ts
function buildExportList(manifests, enabledIds) {
  return Object.values(manifests).map((m) => ({ id: m.id, name: m.name, version: m.version, enabled: enabledIds.has(m.id) })).sort((a, b) => a.name.localeCompare(b.name));
}
function exportJson(list) {
  return JSON.stringify({ type: "better-store-plugin-list", plugins: list }, null, 2);
}
function exportMarkdown(list, date) {
  const rows = list.map((p) => `| ${p.name} | \`${p.id}\` | ${p.version} | ${p.enabled ? "Yes" : "No"} |`);
  return [
    `# Obsidian plugins \u2014 exported ${date}`,
    "",
    "| Plugin | ID | Version | Enabled |",
    "| --- | --- | --- | --- |",
    ...rows,
    ""
  ].join("\n");
}
function parseImport(text2) {
  const seen = /* @__PURE__ */ new Set();
  const push2 = (id) => {
    if (typeof id === "string" && id.trim()) seen.add(id.trim());
  };
  try {
    const parsed = JSON.parse(text2);
    if (Array.isArray(parsed)) {
      for (const item of parsed) push2(typeof item === "object" && item !== null ? item.id : item);
    } else if (typeof parsed === "object" && parsed !== null) {
      const plugins = parsed.plugins;
      if (Array.isArray(plugins)) for (const item of plugins) push2(item.id);
    }
    return [...seen];
  } catch {
    for (const match of text2.matchAll(/`([A-Za-z0-9._-]+)`/g)) push2(match[1]);
    return [...seen];
  }
}
function diffImport(imported, installed) {
  return {
    present: imported.filter((id) => installed.has(id)),
    missing: imported.filter((id) => !installed.has(id))
  };
}

// src/data/profiles.ts
function diffProfile(profileIds, enabled, installed, selfId) {
  const target = new Set(profileIds);
  return {
    toEnable: profileIds.filter((id) => id !== selfId && installed.has(id) && !enabled.has(id)),
    toDisable: [...enabled].filter((id) => id !== selfId && installed.has(id) && !target.has(id)),
    missing: profileIds.filter((id) => !installed.has(id))
  };
}

// src/settings.ts
var import_obsidian2 = require("obsidian");

// src/ui/modals.ts
var import_obsidian = require("obsidian");

// src/ui/store-context.ts
var EMPTY_PLUGINS_API = {
  manifests: {},
  enabledPlugins: /* @__PURE__ */ new Set(),
  enablePluginAndSave: async () => {
  },
  disablePluginAndSave: async () => {
  }
};
var warnedMissingPlugins = false;
function getPluginsApi(app) {
  const api = app.plugins;
  if (api == null || typeof api.enablePluginAndSave !== "function" || typeof api.disablePluginAndSave !== "function" || api.manifests == null || !(api.enabledPlugins instanceof Set)) {
    if (!warnedMissingPlugins) {
      console.warn("Better Store: Obsidian's internal plugins API was not the expected shape; installed-plugin features are disabled.");
      warnedMissingPlugins = true;
    }
    return EMPTY_PLUGINS_API;
  }
  return api;
}
function getInstalledIds(app) {
  return new Set(Object.keys(getPluginsApi(app).manifests));
}
function getBratStatus(app) {
  const api = getPluginsApi(app);
  return { installed: BRAT_PLUGIN_ID in api.manifests, enabled: api.enabledPlugins.has(BRAT_PLUGIN_ID) };
}
function runCommand(app, id) {
  const commands = app.commands;
  if (typeof commands?.executeCommandById !== "function") {
    console.warn(`Better Store: could not run command "${id}" \u2014 Obsidian's command API was unavailable.`);
    return false;
  }
  return commands.executeCommandById(id);
}

// src/ui/modals.ts
var NameModal = class extends import_obsidian.Modal {
  constructor(app, promptTitle, onSubmit) {
    super(app);
    this.promptTitle = promptTitle;
    this.onSubmit = onSubmit;
  }
  onOpen() {
    this.titleEl.setText(this.promptTitle);
    let value = "";
    const submit = () => {
      const name = value.trim();
      if (!name) {
        new import_obsidian.Notice("Enter a name.");
        return;
      }
      this.close();
      this.onSubmit(name);
    };
    new import_obsidian.Setting(this.contentEl).setName("Name").addText((text2) => {
      text2.onChange((v) => value = v);
      text2.inputEl.addEventListener("keydown", (e) => {
        if (e.key === "Enter") {
          e.preventDefault();
          submit();
        }
      });
      window.setTimeout(() => text2.inputEl.focus(), 0);
    });
    new import_obsidian.Setting(this.contentEl).addButton((btn) => btn.setButtonText("Save").setCta().onClick(submit));
  }
  onClose() {
    this.contentEl.empty();
  }
};
var ImportModal = class extends import_obsidian.Modal {
  constructor(app, plugin) {
    super(app);
    this.plugin = plugin;
  }
  onOpen() {
    this.titleEl.setText("Import plugin list");
    const { contentEl } = this;
    contentEl.createEl("p", {
      text: "Paste a plugin list exported from Better Store (Markdown or JSON).",
      cls: "setting-item-description"
    });
    const textarea = contentEl.createEl("textarea", {
      cls: "bs-import-textarea",
      attr: { rows: "10", placeholder: "Paste the exported list here\u2026", "aria-label": "Exported plugin list" }
    });
    const results = contentEl.createDiv();
    new import_obsidian.Setting(contentEl).addButton(
      (btn) => btn.setButtonText("Analyze").setCta().onClick(() => void this.analyze(textarea.value, results))
    );
  }
  async analyze(text2, out) {
    out.empty();
    const ids = parseImport(text2);
    if (ids.length === 0) {
      out.createEl("p", { text: "No plugin ids found in the pasted text." });
      return;
    }
    const installed = new Set(Object.keys(getPluginsApi(this.app).manifests));
    const { present, missing } = diffImport(ids, installed);
    out.createEl("p", {
      text: `${ids.length} plugins in the list \u2014 ${present.length} already installed, ${missing.length} missing.`
    });
    if (missing.length === 0) return;
    let names = /* @__PURE__ */ new Map();
    try {
      const catalog = await this.plugin.service.loadCatalog();
      names = new Map(catalog.entries.map((e) => [e.id, e.name]));
    } catch {
    }
    const list = out.createEl("ul");
    for (const id of missing) list.createEl("li", { text: names.get(id) ?? id });
    new import_obsidian.Setting(out).addButton(
      (btn) => btn.setButtonText(`Star ${missing.length} missing`).onClick(async () => {
        const favorites = new Set(this.plugin.settings.favoritePlugins);
        for (const id of missing) favorites.add(id);
        this.plugin.settings.favoritePlugins = [...favorites];
        await this.plugin.saveSettings();
        new import_obsidian.Notice(`Starred ${missing.length} plugins \u2014 use the "Starred only" filter to install them.`);
        this.close();
      })
    );
  }
  onClose() {
    this.contentEl.empty();
  }
};
var ProfileSuggestModal = class extends import_obsidian.FuzzySuggestModal {
  constructor(app, plugin) {
    super(app);
    this.plugin = plugin;
    this.setPlaceholder("Apply plugin profile\u2026");
    this.emptyStateText = "No profiles yet \u2014 save one from Better Store's Installed tab.";
  }
  getItems() {
    return this.plugin.settings.profiles;
  }
  getItemText(profile) {
    return `${profile.name} (${profile.pluginIds.length} plugins)`;
  }
  onChooseItem(profile) {
    void this.plugin.applyProfile(profile);
  }
};

// src/settings.ts
var DEFAULT_SETTINGS = {
  githubSecretId: "",
  cacheTtlHours: 12,
  defaultSort: "downloads",
  openLocation: "tab",
  hideInstalledByDefault: false,
  ignoredPlugins: [],
  ignoredAuthors: [],
  ignoredCategories: [],
  favoritePlugins: [],
  showNewBadges: true,
  showCardStars: true,
  scanMaxAgeDays: 7,
  backgroundUpdateCheck: true,
  updateNotice: true,
  showHealth: true,
  showSimilar: true,
  showSparkline: true,
  trackRecentlyViewed: true,
  profiles: [],
  filterPresets: [],
  updateIgnored: [],
  updateSkipped: {},
  muteUpdatesUntil: 0,
  ui: { layout: "grid", detailWidth: 380, treeExpanded: {}, recentlyViewed: [], lastTab: "all" }
};
var NEW_WINDOW_DAYS = 14;
var BetterStoreSettingTab = class extends import_obsidian2.PluginSettingTab {
  constructor(app, plugin) {
    super(app, plugin);
    this.plugin = plugin;
  }
  muteLabel() {
    return muteRemaining(
      { ignored: [], skipped: {}, muteUntil: this.plugin.settings.muteUpdatesUntil },
      Date.now()
    );
  }
  getControlValue(key2) {
    return this.plugin.settings[key2];
  }
  async setControlValue(key2, value) {
    this.plugin.settings[key2] = value;
    await this.plugin.saveSettings();
  }
  removableList(heading, emptyState, key2) {
    return {
      type: "list",
      heading,
      emptyState,
      items: this.plugin.settings[key2].map((name) => ({ name })),
      onDelete: (index2) => {
        const next2 = [...this.plugin.settings[key2]];
        next2.splice(index2, 1);
        this.plugin.settings[key2] = next2;
        void this.plugin.saveSettings();
        this.update();
      }
    };
  }
  getSettingDefinitions() {
    return [
      {
        name: "GitHub token",
        desc: "Optional. Link a secret holding a GitHub personal access token \u2014 it raises the API rate limit (60/hour without) used for stars, issues, and release data. A classic token with no scopes is enough. Only the secret's name is stored in plugin data; the token stays in Obsidian's secret storage.",
        render: (setting) => {
          setting.addComponent((el) => {
            const secret = new import_obsidian2.SecretComponent(this.app, el);
            secret.setValue(this.plugin.settings.githubSecretId);
            secret.onChange((id) => {
              void (async () => {
                const next2 = (id ?? "").trim();
                await this.plugin.setGithubSecretId(next2);
                if (next2 && await this.plugin.testGithubToken()) this.plugin.onTokenLinked();
              })();
            });
            return secret;
          });
          setting.addButton(
            (btn) => btn.setButtonText("Test").setTooltip("Verify the linked token against the GitHub API").onClick(async () => {
              btn.setDisabled(true).setButtonText("Testing\u2026");
              try {
                await this.plugin.testGithubToken();
              } finally {
                btn.setDisabled(false).setButtonText("Test");
              }
            })
          );
        }
      },
      {
        name: "Cache lifetime (hours)",
        desc: "How long the plugin catalog is cached before refetching. Use the refresh button in the store for an immediate update.",
        control: { type: "slider", key: "cacheTtlHours", min: 1, max: 72, step: 1, defaultValue: 12 }
      },
      {
        name: "Default sort",
        control: {
          type: "dropdown",
          key: "defaultSort",
          options: { downloads: "Downloads", updated: "Recently updated", name: "Name", trending: "Trending" },
          defaultValue: "downloads"
        }
      },
      {
        name: "Open the store in",
        desc: "Where the store opens from the ribbon and commands. A new window is desktop-only and falls back to a tab on mobile.",
        control: {
          type: "dropdown",
          key: "openLocation",
          options: { tab: "A tab", split: "A split", window: "A new window" },
          defaultValue: "tab"
        }
      },
      {
        name: "Hide installed plugins by default",
        control: { type: "toggle", key: "hideInstalledByDefault", defaultValue: false }
      },
      {
        name: `Show "New" badges`,
        desc: `Highlight plugins that entered the registry within the last ${NEW_WINDOW_DAYS} days.`,
        control: { type: "toggle", key: "showNewBadges", defaultValue: true }
      },
      {
        name: "Show GitHub stars on cards",
        desc: "With a token linked, fetches star counts for the cards on screen (one API request per plugin, cached for the session). Without a token this stays inactive so the anonymous rate limit is saved for the detail pane.",
        control: { type: "toggle", key: "showCardStars", defaultValue: true }
      },
      {
        type: "group",
        heading: "GitHub catalog scan",
        items: [
          {
            name: "Scan the catalog for stars & open issues",
            desc: "Fetches GitHub stars and open-issue counts for every plugin (one request each) so the whole catalog can be sorted and filtered by them. Requires a linked token; the scan is resumable and only re-fetches stale entries. Progress and a cancel button appear in the store header.",
            action: () => void this.plugin.startCatalogScan()
          },
          {
            name: "Rescan stats older than (days)",
            desc: "During a scan, entries fetched within this many days are considered fresh and skipped.",
            control: { type: "slider", key: "scanMaxAgeDays", min: 1, max: 30, step: 1, defaultValue: 7 }
          }
        ]
      },
      {
        name: "Track recently viewed plugins",
        desc: "Ranks plugins you've opened recently at the top of the quick-jump search.",
        control: { type: "toggle", key: "trackRecentlyViewed", defaultValue: true }
      },
      {
        type: "group",
        heading: "Detail pane",
        items: [
          {
            name: "Show maintenance health",
            desc: "A healthy / aging / at-risk chip based on update recency and release cadence.",
            control: { type: "toggle", key: "showHealth", defaultValue: true }
          },
          {
            name: "Show similar plugins",
            desc: "Related plugins by shared categories and keywords.",
            control: { type: "toggle", key: "showSimilar", defaultValue: true }
          },
          {
            name: "Show download history chart",
            desc: "A small sparkline built from your catalog-refresh snapshots.",
            control: { type: "toggle", key: "showSparkline", defaultValue: true }
          }
        ]
      },
      {
        type: "group",
        heading: "Updates",
        items: [
          {
            name: "Check for updates in the background",
            desc: "Checks your installed plugins against their repositories on the cache-lifetime cadence and marks the ribbon icon when updates are available.",
            control: { type: "toggle", key: "backgroundUpdateCheck", defaultValue: true }
          },
          {
            name: "Notify when updates are found",
            desc: "Shows a notice when the background check finds plugin updates.",
            control: { type: "toggle", key: "updateNotice", defaultValue: true }
          },
          {
            name: "Update nags are muted",
            desc: "Proactive update notices and the ribbon badge are silenced for now. The Installed tab still shows what's available.",
            visible: () => this.muteLabel() != null,
            action: () => {
              this.plugin.settings.muteUpdatesUntil = 0;
              void this.plugin.saveSettings();
              void this.plugin.checkForUpdates();
              this.update();
            }
          }
        ]
      },
      {
        type: "list",
        heading: "Update checks disabled",
        emptyState: `No plugins excluded. Use "Don't check for updates" on an installed plugin's card.`,
        items: this.plugin.settings.updateIgnored.map((id) => ({ name: id })),
        onDelete: (index2) => {
          const next2 = [...this.plugin.settings.updateIgnored];
          next2.splice(index2, 1);
          this.plugin.settings.updateIgnored = next2;
          void this.plugin.saveSettings();
          this.update();
        }
      },
      {
        type: "list",
        heading: "Skipped update versions",
        emptyState: `No skipped versions. Use "Skip this version" on an installed plugin's update.`,
        items: Object.entries(this.plugin.settings.updateSkipped).map(([id, version]) => ({
          name: id,
          desc: `skipped v${version}`
        })),
        onDelete: (index2) => {
          const ids = Object.keys(this.plugin.settings.updateSkipped);
          const id = ids[index2];
          if (id == null) return;
          const next2 = { ...this.plugin.settings.updateSkipped };
          delete next2[id];
          this.plugin.settings.updateSkipped = next2;
          void this.plugin.saveSettings();
          this.update();
        }
      },
      {
        type: "group",
        heading: "Portability",
        items: [
          {
            name: "Export plugin list (Markdown)",
            desc: "Copies a Markdown table of your installed plugins to the clipboard.",
            action: () => void this.plugin.exportPluginList("markdown")
          },
          {
            name: "Export plugin list (JSON)",
            desc: "Copies a JSON export of your installed plugins to the clipboard.",
            action: () => void this.plugin.exportPluginList("json")
          },
          {
            name: "Import plugin list\u2026",
            desc: "Paste an exported list to see what's missing from this vault.",
            action: () => new ImportModal(this.app, this.plugin).open()
          }
        ]
      },
      {
        type: "list",
        heading: "Profiles",
        emptyState: "No profiles. Save one from Better Store's Installed tab.",
        items: this.plugin.settings.profiles.map((p) => ({
          name: p.name,
          desc: `${p.pluginIds.length} plugins`
        })),
        onDelete: (index2) => {
          const next2 = [...this.plugin.settings.profiles];
          next2.splice(index2, 1);
          this.plugin.settings.profiles = next2;
          void this.plugin.saveSettings();
          this.update();
        }
      },
      {
        type: "list",
        heading: "Filter presets",
        emptyState: "No presets. Save one from the browse sidebar.",
        items: this.plugin.settings.filterPresets.map((p) => ({ name: p.name })),
        onDelete: (index2) => {
          const next2 = [...this.plugin.settings.filterPresets];
          next2.splice(index2, 1);
          this.plugin.settings.filterPresets = next2;
          void this.plugin.saveSettings();
          this.update();
        }
      },
      this.removableList(
        "Starred plugins",
        "No starred plugins. Use the star action on a plugin card or detail view.",
        "favoritePlugins"
      ),
      this.removableList(
        "Ignored plugins",
        "No ignored plugins. Use the ignore menu on a plugin card to hide it from browsing.",
        "ignoredPlugins"
      ),
      this.removableList(
        "Ignored authors",
        "No ignored authors. Use a plugin card's ignore menu to hide everything by an author.",
        "ignoredAuthors"
      ),
      this.removableList(
        "Ignored categories",
        "No ignored categories. Use a plugin card's ignore menu to hide a whole category.",
        "ignoredCategories"
      )
    ];
  }
};

// src/view.ts
var import_obsidian7 = require("obsidian");

// node_modules/esm-env/dev-fallback.js
var node_env = globalThis.process?.env?.NODE_ENV;
var dev_fallback_default = node_env && !node_env.toLowerCase().startsWith("prod");

// node_modules/svelte/src/internal/shared/utils.js
var is_array = Array.isArray;
var index_of = Array.prototype.indexOf;
var includes = Array.prototype.includes;
var array_from = Array.from;
var object_keys = Object.keys;
var define_property = Object.defineProperty;
var get_descriptor = Object.getOwnPropertyDescriptor;
var get_descriptors = Object.getOwnPropertyDescriptors;
var object_prototype = Object.prototype;
var array_prototype = Array.prototype;
var get_prototype_of = Object.getPrototypeOf;
var is_extensible = Object.isExtensible;
var noop = () => {
};
function run_all(arr) {
  for (var i = 0; i < arr.length; i++) {
    arr[i]();
  }
}
function deferred() {
  var resolve;
  var reject;
  var promise = new Promise((res, rej) => {
    resolve = res;
    reject = rej;
  });
  return { promise, resolve, reject };
}

// node_modules/svelte/src/internal/client/constants.js
var DERIVED = 1 << 1;
var EFFECT = 1 << 2;
var RENDER_EFFECT = 1 << 3;
var MANAGED_EFFECT = 1 << 24;
var BLOCK_EFFECT = 1 << 4;
var BRANCH_EFFECT = 1 << 5;
var ROOT_EFFECT = 1 << 6;
var BOUNDARY_EFFECT = 1 << 7;
var CONNECTED = 1 << 9;
var CLEAN = 1 << 10;
var DIRTY = 1 << 11;
var MAYBE_DIRTY = 1 << 12;
var INERT = 1 << 13;
var DESTROYED = 1 << 14;
var REACTION_RAN = 1 << 15;
var DESTROYING = 1 << 25;
var EFFECT_TRANSPARENT = 1 << 16;
var EAGER_EFFECT = 1 << 17;
var HEAD_EFFECT = 1 << 18;
var EFFECT_PRESERVED = 1 << 19;
var USER_EFFECT = 1 << 20;
var EFFECT_OFFSCREEN = 1 << 25;
var WAS_MARKED = 1 << 16;
var REACTION_IS_UPDATING = 1 << 21;
var ASYNC = 1 << 22;
var ERROR_VALUE = 1 << 23;
var STATE_SYMBOL = Symbol("$state");
var LEGACY_PROPS = Symbol("legacy props");
var LOADING_ATTR_SYMBOL = Symbol("");
var PROXY_PATH_SYMBOL = Symbol("proxy path");
var ATTRIBUTES_CACHE = Symbol("attributes");
var CLASS_CACHE = Symbol("class");
var STYLE_CACHE = Symbol("style");
var TEXT_CACHE = Symbol("text");
var FORM_RESET_HANDLER = Symbol("form reset");
var HMR_ANCHOR = Symbol("hmr anchor");
var STALE_REACTION = new class StaleReactionError extends Error {
  name = "StaleReactionError";
  message = "The reaction that called `getAbortSignal()` was re-run or destroyed";
}();
var IS_XHTML = (
  // We gotta write it like this because after downleveling the pure comment may end up in the wrong location
  !!globalThis.document?.contentType && /* @__PURE__ */ globalThis.document.contentType.includes("xml")
);
var TEXT_NODE = 3;
var COMMENT_NODE = 8;

// node_modules/svelte/src/internal/shared/errors.js
function invariant_violation(message) {
  if (dev_fallback_default) {
    const error = new Error(`invariant_violation
An invariant violation occurred, meaning Svelte's internal assumptions were flawed. This is a bug in Svelte, not your app \u2014 please open an issue at https://github.com/sveltejs/svelte, citing the following message: "${message}"
https://svelte.dev/e/invariant_violation`);
    error.name = "Svelte error";
    throw error;
  } else {
    throw new Error(`https://svelte.dev/e/invariant_violation`);
  }
}
function lifecycle_outside_component(name) {
  if (dev_fallback_default) {
    const error = new Error(`lifecycle_outside_component
\`${name}(...)\` can only be used during component initialisation
https://svelte.dev/e/lifecycle_outside_component`);
    error.name = "Svelte error";
    throw error;
  } else {
    throw new Error(`https://svelte.dev/e/lifecycle_outside_component`);
  }
}

// node_modules/svelte/src/internal/client/errors.js
function async_derived_orphan() {
  if (dev_fallback_default) {
    const error = new Error(`async_derived_orphan
Cannot create a \`$derived(...)\` with an \`await\` expression outside of an effect tree
https://svelte.dev/e/async_derived_orphan`);
    error.name = "Svelte error";
    throw error;
  } else {
    throw new Error(`https://svelte.dev/e/async_derived_orphan`);
  }
}
function bind_invalid_checkbox_value() {
  if (dev_fallback_default) {
    const error = new Error(`bind_invalid_checkbox_value
Using \`bind:value\` together with a checkbox input is not allowed. Use \`bind:checked\` instead
https://svelte.dev/e/bind_invalid_checkbox_value`);
    error.name = "Svelte error";
    throw error;
  } else {
    throw new Error(`https://svelte.dev/e/bind_invalid_checkbox_value`);
  }
}
function derived_references_self() {
  if (dev_fallback_default) {
    const error = new Error(`derived_references_self
A derived value cannot reference itself recursively
https://svelte.dev/e/derived_references_self`);
    error.name = "Svelte error";
    throw error;
  } else {
    throw new Error(`https://svelte.dev/e/derived_references_self`);
  }
}
function each_key_duplicate(a, b, value) {
  if (dev_fallback_default) {
    const error = new Error(`each_key_duplicate
${value ? `Keyed each block has duplicate key \`${value}\` at indexes ${a} and ${b}` : `Keyed each block has duplicate key at indexes ${a} and ${b}`}
https://svelte.dev/e/each_key_duplicate`);
    error.name = "Svelte error";
    throw error;
  } else {
    throw new Error(`https://svelte.dev/e/each_key_duplicate`);
  }
}
function each_key_volatile(index2, a, b) {
  if (dev_fallback_default) {
    const error = new Error(`each_key_volatile
Keyed each block has key that is not idempotent \u2014 the key for item at index ${index2} was \`${a}\` but is now \`${b}\`. Keys must be the same each time for a given item
https://svelte.dev/e/each_key_volatile`);
    error.name = "Svelte error";
    throw error;
  } else {
    throw new Error(`https://svelte.dev/e/each_key_volatile`);
  }
}
function effect_in_teardown(rune) {
  if (dev_fallback_default) {
    const error = new Error(`effect_in_teardown
\`${rune}\` cannot be used inside an effect cleanup function
https://svelte.dev/e/effect_in_teardown`);
    error.name = "Svelte error";
    throw error;
  } else {
    throw new Error(`https://svelte.dev/e/effect_in_teardown`);
  }
}
function effect_in_unowned_derived() {
  if (dev_fallback_default) {
    const error = new Error(`effect_in_unowned_derived
Effect cannot be created inside a \`$derived\` value that was not itself created inside an effect
https://svelte.dev/e/effect_in_unowned_derived`);
    error.name = "Svelte error";
    throw error;
  } else {
    throw new Error(`https://svelte.dev/e/effect_in_unowned_derived`);
  }
}
function effect_orphan(rune) {
  if (dev_fallback_default) {
    const error = new Error(`effect_orphan
\`${rune}\` can only be used inside an effect (e.g. during component initialisation)
https://svelte.dev/e/effect_orphan`);
    error.name = "Svelte error";
    throw error;
  } else {
    throw new Error(`https://svelte.dev/e/effect_orphan`);
  }
}
function effect_update_depth_exceeded() {
  if (dev_fallback_default) {
    const error = new Error(`effect_update_depth_exceeded
Maximum update depth exceeded. This typically indicates that an effect reads and writes the same piece of state
https://svelte.dev/e/effect_update_depth_exceeded`);
    error.name = "Svelte error";
    throw error;
  } else {
    throw new Error(`https://svelte.dev/e/effect_update_depth_exceeded`);
  }
}
function hydration_failed() {
  if (dev_fallback_default) {
    const error = new Error(`hydration_failed
Failed to hydrate the application
https://svelte.dev/e/hydration_failed`);
    error.name = "Svelte error";
    throw error;
  } else {
    throw new Error(`https://svelte.dev/e/hydration_failed`);
  }
}
function props_invalid_value(key2) {
  if (dev_fallback_default) {
    const error = new Error(`props_invalid_value
Cannot do \`bind:${key2}={undefined}\` when \`${key2}\` has a fallback value
https://svelte.dev/e/props_invalid_value`);
    error.name = "Svelte error";
    throw error;
  } else {
    throw new Error(`https://svelte.dev/e/props_invalid_value`);
  }
}
function rune_outside_svelte(rune) {
  if (dev_fallback_default) {
    const error = new Error(`rune_outside_svelte
The \`${rune}\` rune is only available inside \`.svelte\` and \`.svelte.js/ts\` files
https://svelte.dev/e/rune_outside_svelte`);
    error.name = "Svelte error";
    throw error;
  } else {
    throw new Error(`https://svelte.dev/e/rune_outside_svelte`);
  }
}
function state_descriptors_fixed() {
  if (dev_fallback_default) {
    const error = new Error(`state_descriptors_fixed
Property descriptors defined on \`$state\` objects must contain \`value\` and always be \`enumerable\`, \`configurable\` and \`writable\`.
https://svelte.dev/e/state_descriptors_fixed`);
    error.name = "Svelte error";
    throw error;
  } else {
    throw new Error(`https://svelte.dev/e/state_descriptors_fixed`);
  }
}
function state_prototype_fixed() {
  if (dev_fallback_default) {
    const error = new Error(`state_prototype_fixed
Cannot set prototype of \`$state\` object
https://svelte.dev/e/state_prototype_fixed`);
    error.name = "Svelte error";
    throw error;
  } else {
    throw new Error(`https://svelte.dev/e/state_prototype_fixed`);
  }
}
function state_unsafe_mutation() {
  if (dev_fallback_default) {
    const error = new Error(`state_unsafe_mutation
Updating state inside \`$derived(...)\`, \`$inspect(...)\` or a template expression is forbidden. If the value should not be reactive, declare it without \`$state\`
https://svelte.dev/e/state_unsafe_mutation`);
    error.name = "Svelte error";
    throw error;
  } else {
    throw new Error(`https://svelte.dev/e/state_unsafe_mutation`);
  }
}
function svelte_boundary_reset_onerror() {
  if (dev_fallback_default) {
    const error = new Error(`svelte_boundary_reset_onerror
A \`<svelte:boundary>\` \`reset\` function cannot be called while an error is still being handled
https://svelte.dev/e/svelte_boundary_reset_onerror`);
    error.name = "Svelte error";
    throw error;
  } else {
    throw new Error(`https://svelte.dev/e/svelte_boundary_reset_onerror`);
  }
}

// node_modules/svelte/src/constants.js
var EACH_ITEM_REACTIVE = 1;
var EACH_INDEX_REACTIVE = 1 << 1;
var EACH_IS_CONTROLLED = 1 << 2;
var EACH_IS_ANIMATED = 1 << 3;
var EACH_ITEM_IMMUTABLE = 1 << 4;
var PROPS_IS_IMMUTABLE = 1;
var PROPS_IS_RUNES = 1 << 1;
var PROPS_IS_UPDATED = 1 << 2;
var PROPS_IS_BINDABLE = 1 << 3;
var PROPS_IS_LAZY_INITIAL = 1 << 4;
var TRANSITION_OUT = 1 << 1;
var TRANSITION_GLOBAL = 1 << 2;
var TEMPLATE_FRAGMENT = 1;
var TEMPLATE_USE_IMPORT_NODE = 1 << 1;
var TEMPLATE_USE_SVG = 1 << 2;
var TEMPLATE_USE_MATHML = 1 << 3;
var HYDRATION_START = "[";
var HYDRATION_START_ELSE = "[!";
var HYDRATION_START_FAILED = "[?";
var HYDRATION_END = "]";
var HYDRATION_ERROR = {};
var ELEMENT_PRESERVE_ATTRIBUTE_CASE = 1 << 1;
var ELEMENT_IS_INPUT = 1 << 2;
var UNINITIALIZED = Symbol("uninitialized");
var FILENAME = Symbol("filename");
var HMR = Symbol("hmr");
var NAMESPACE_HTML = "http://www.w3.org/1999/xhtml";

// node_modules/svelte/src/internal/client/warnings.js
var bold = "font-weight: bold";
var normal = "font-weight: normal";
function await_reactivity_loss(name) {
  if (dev_fallback_default) {
    console.warn(`%c[svelte] await_reactivity_loss
%cDetected reactivity loss when reading \`${name}\`. This happens when state is read in an async function after an earlier \`await\`
https://svelte.dev/e/await_reactivity_loss`, bold, normal);
  } else {
    console.warn(`https://svelte.dev/e/await_reactivity_loss`);
  }
}
function await_waterfall(name, location) {
  if (dev_fallback_default) {
    console.warn(`%c[svelte] await_waterfall
%cAn async derived, \`${name}\` (${location}) was not read immediately after it resolved. This often indicates an unnecessary waterfall, which can slow down your app
https://svelte.dev/e/await_waterfall`, bold, normal);
  } else {
    console.warn(`https://svelte.dev/e/await_waterfall`);
  }
}
function derived_inert() {
  if (dev_fallback_default) {
    console.warn(`%c[svelte] derived_inert
%cReading a derived belonging to a now-destroyed effect may result in stale values
https://svelte.dev/e/derived_inert`, bold, normal);
  } else {
    console.warn(`https://svelte.dev/e/derived_inert`);
  }
}
function hydration_attribute_changed(attribute, html2, value) {
  if (dev_fallback_default) {
    console.warn(`%c[svelte] hydration_attribute_changed
%cThe \`${attribute}\` attribute on \`${html2}\` changed its value between server and client renders. The client value, \`${value}\`, will be ignored in favour of the server value
https://svelte.dev/e/hydration_attribute_changed`, bold, normal);
  } else {
    console.warn(`https://svelte.dev/e/hydration_attribute_changed`);
  }
}
function hydration_mismatch(location) {
  if (dev_fallback_default) {
    console.warn(
      `%c[svelte] hydration_mismatch
%c${location ? `Hydration failed because the initial UI does not match what was rendered on the server. The error occurred near ${location}` : "Hydration failed because the initial UI does not match what was rendered on the server"}
https://svelte.dev/e/hydration_mismatch`,
      bold,
      normal
    );
  } else {
    console.warn(`https://svelte.dev/e/hydration_mismatch`);
  }
}
function lifecycle_double_unmount() {
  if (dev_fallback_default) {
    console.warn(`%c[svelte] lifecycle_double_unmount
%cTried to unmount a component that was not mounted
https://svelte.dev/e/lifecycle_double_unmount`, bold, normal);
  } else {
    console.warn(`https://svelte.dev/e/lifecycle_double_unmount`);
  }
}
function select_multiple_invalid_value() {
  if (dev_fallback_default) {
    console.warn(`%c[svelte] select_multiple_invalid_value
%cThe \`value\` property of a \`<select multiple>\` element should be an array, but it received a non-array value. The selection will be kept as is.
https://svelte.dev/e/select_multiple_invalid_value`, bold, normal);
  } else {
    console.warn(`https://svelte.dev/e/select_multiple_invalid_value`);
  }
}
function state_proxy_equality_mismatch(operator) {
  if (dev_fallback_default) {
    console.warn(`%c[svelte] state_proxy_equality_mismatch
%cReactive \`$state(...)\` proxies and the values they proxy have different identities. Because of this, comparisons with \`${operator}\` will produce unexpected results
https://svelte.dev/e/state_proxy_equality_mismatch`, bold, normal);
  } else {
    console.warn(`https://svelte.dev/e/state_proxy_equality_mismatch`);
  }
}
function state_proxy_unmount() {
  if (dev_fallback_default) {
    console.warn(`%c[svelte] state_proxy_unmount
%cTried to unmount a state proxy, rather than a component
https://svelte.dev/e/state_proxy_unmount`, bold, normal);
  } else {
    console.warn(`https://svelte.dev/e/state_proxy_unmount`);
  }
}
function svelte_boundary_reset_noop() {
  if (dev_fallback_default) {
    console.warn(`%c[svelte] svelte_boundary_reset_noop
%cA \`<svelte:boundary>\` \`reset\` function only resets the boundary the first time it is called
https://svelte.dev/e/svelte_boundary_reset_noop`, bold, normal);
  } else {
    console.warn(`https://svelte.dev/e/svelte_boundary_reset_noop`);
  }
}

// node_modules/svelte/src/internal/client/dom/hydration.js
var hydrating = false;
function set_hydrating(value) {
  hydrating = value;
}
var hydrate_node;
function set_hydrate_node(node) {
  if (node === null) {
    hydration_mismatch();
    throw HYDRATION_ERROR;
  }
  return hydrate_node = node;
}
function hydrate_next() {
  return set_hydrate_node(get_next_sibling(hydrate_node));
}
function reset(node) {
  if (!hydrating) return;
  if (get_next_sibling(hydrate_node) !== null) {
    hydration_mismatch();
    throw HYDRATION_ERROR;
  }
  hydrate_node = node;
}
function next(count = 1) {
  if (hydrating) {
    var i = count;
    var node = hydrate_node;
    while (i--) {
      node = /** @type {TemplateNode} */
      get_next_sibling(node);
    }
    hydrate_node = node;
  }
}
function skip_nodes(remove = true) {
  var depth = 0;
  var node = hydrate_node;
  while (true) {
    if (node.nodeType === COMMENT_NODE) {
      var data = (
        /** @type {Comment} */
        node.data
      );
      if (data === HYDRATION_END) {
        if (depth === 0) return node;
        depth -= 1;
      } else if (data === HYDRATION_START || data === HYDRATION_START_ELSE || // "[1", "[2", etc. for if blocks
      data[0] === "[" && !isNaN(Number(data.slice(1)))) {
        depth += 1;
      }
    }
    var next2 = (
      /** @type {TemplateNode} */
      get_next_sibling(node)
    );
    if (remove) node.remove();
    node = next2;
  }
}
function read_hydration_instruction(node) {
  if (!node || node.nodeType !== COMMENT_NODE) {
    hydration_mismatch();
    throw HYDRATION_ERROR;
  }
  return (
    /** @type {Comment} */
    node.data
  );
}

// node_modules/svelte/src/internal/client/reactivity/equality.js
function equals(value) {
  return value === this.v;
}
function safe_not_equal(a, b) {
  return a != a ? b == b : a !== b || a !== null && typeof a === "object" || typeof a === "function";
}
function safe_equals(value) {
  return !safe_not_equal(value, this.v);
}

// node_modules/svelte/src/internal/flags/index.js
var async_mode_flag = false;
var legacy_mode_flag = false;
var tracing_mode_flag = false;

// node_modules/svelte/src/internal/client/dev/tracing.js
var tracing_expressions = null;
function tag(source2, label2) {
  source2.label = label2;
  tag_proxy(source2.v, label2);
  return source2;
}
function tag_proxy(value, label2) {
  value?.[PROXY_PATH_SYMBOL]?.(label2);
  return value;
}
function label(value) {
  if (typeof value === "symbol") return `Symbol(${value.description})`;
  if (typeof value === "function") return "<function>";
  if (typeof value === "object" && value) return "<object>";
  return String(value);
}

// node_modules/svelte/src/internal/shared/dev.js
function get_error(label2) {
  const error = new Error();
  const stack2 = get_stack();
  if (stack2.length === 0) {
    return null;
  }
  stack2.unshift("\n");
  define_property(error, "stack", {
    value: stack2.join("\n")
  });
  define_property(error, "name", {
    value: label2
  });
  return (
    /** @type {Error & { stack: string }} */
    error
  );
}
function get_stack() {
  const limit = Error.stackTraceLimit;
  Error.stackTraceLimit = Infinity;
  const stack2 = new Error().stack;
  Error.stackTraceLimit = limit;
  if (!stack2) return [];
  const lines = stack2.split("\n");
  const new_lines = [];
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const posixified = line.replaceAll("\\", "/");
    if (line.trim() === "Error") {
      continue;
    }
    if (line.includes("validate_each_keys")) {
      return [];
    }
    if (posixified.includes("svelte/src/internal") || posixified.includes("node_modules/.vite")) {
      continue;
    }
    new_lines.push(line);
  }
  return new_lines;
}
function invariant(condition, message) {
  if (!dev_fallback_default) {
    throw new Error("invariant(...) was not guarded by if (DEV)");
  }
  if (!condition) invariant_violation(message);
}

// node_modules/svelte/src/internal/client/context.js
var component_context = null;
function set_component_context(context) {
  component_context = context;
}
var dev_stack = null;
function set_dev_stack(stack2) {
  dev_stack = stack2;
}
var dev_current_component_function = null;
function set_dev_current_component_function(fn) {
  dev_current_component_function = fn;
}
function push(props, runes = false, fn) {
  component_context = {
    p: component_context,
    i: false,
    c: null,
    e: null,
    s: props,
    x: null,
    r: (
      /** @type {Effect} */
      active_effect
    ),
    l: legacy_mode_flag && !runes ? { s: null, u: null, $: [] } : null
  };
  if (dev_fallback_default) {
    component_context.function = fn;
    dev_current_component_function = fn;
  }
}
function pop(component2) {
  var context = (
    /** @type {ComponentContext} */
    component_context
  );
  var effects = context.e;
  if (effects !== null) {
    context.e = null;
    for (var fn of effects) {
      create_user_effect(fn);
    }
  }
  if (component2 !== void 0) {
    context.x = component2;
  }
  context.i = true;
  component_context = context.p;
  if (dev_fallback_default) {
    dev_current_component_function = component_context?.function ?? null;
  }
  return component2 ?? /** @type {T} */
  {};
}
function is_runes() {
  return !legacy_mode_flag || component_context !== null && component_context.l === null;
}

// node_modules/svelte/src/internal/client/dom/task.js
var micro_tasks = [];
function run_micro_tasks() {
  var tasks = micro_tasks;
  micro_tasks = [];
  run_all(tasks);
}
function queue_micro_task(fn) {
  if (micro_tasks.length === 0 && !is_flushing_sync) {
    var tasks = micro_tasks;
    queueMicrotask(() => {
      if (tasks === micro_tasks) run_micro_tasks();
    });
  }
  micro_tasks.push(fn);
}
function flush_tasks() {
  while (micro_tasks.length > 0) {
    run_micro_tasks();
  }
}

// node_modules/svelte/src/internal/client/error-handling.js
var adjustments = /* @__PURE__ */ new WeakMap();
function handle_error(error) {
  var effect2 = active_effect;
  if (effect2 === null) {
    active_reaction.f |= ERROR_VALUE;
    return error;
  }
  if (dev_fallback_default && error instanceof Error && !adjustments.has(error)) {
    adjustments.set(error, get_adjustments(error, effect2));
  }
  if ((effect2.f & REACTION_RAN) === 0 && (effect2.f & EFFECT) === 0) {
    if (dev_fallback_default && !effect2.parent && error instanceof Error) {
      apply_adjustments(error);
    }
    throw error;
  }
  invoke_error_boundary(error, effect2);
}
function invoke_error_boundary(error, effect2) {
  if (effect2 !== null && (effect2.f & DESTROYED) !== 0) {
    return;
  }
  while (effect2 !== null) {
    if ((effect2.f & BOUNDARY_EFFECT) !== 0) {
      if ((effect2.f & REACTION_RAN) === 0) {
        throw error;
      }
      try {
        effect2.b.error(error);
        return;
      } catch (e) {
        error = e;
      }
    }
    effect2 = effect2.parent;
  }
  if (dev_fallback_default && error instanceof Error) {
    apply_adjustments(error);
  }
  throw error;
}
function get_adjustments(error, effect2) {
  const message_descriptor = get_descriptor(error, "message");
  if (message_descriptor && !message_descriptor.configurable) return;
  var indent = is_firefox ? "  " : "	";
  var component_stack = `
${indent}in ${effect2.fn?.name || "<unknown>"}`;
  var context = effect2.ctx;
  while (context !== null) {
    component_stack += `
${indent}in ${context.function?.[FILENAME].split("/").pop()}`;
    context = context.p;
  }
  return {
    message: error.message + `
${component_stack}
`,
    stack: error.stack?.split("\n").filter((line) => !line.includes("svelte/src/internal")).join("\n")
  };
}
function apply_adjustments(error) {
  const adjusted = adjustments.get(error);
  if (adjusted) {
    define_property(error, "message", {
      value: adjusted.message
    });
    define_property(error, "stack", {
      value: adjusted.stack
    });
  }
}

// node_modules/svelte/src/internal/client/reactivity/status.js
var STATUS_MASK = ~(DIRTY | MAYBE_DIRTY | CLEAN);
function set_signal_status(signal, status) {
  signal.f = signal.f & STATUS_MASK | status;
}
function update_derived_status(derived2) {
  if ((derived2.f & CONNECTED) !== 0 || derived2.deps === null) {
    set_signal_status(derived2, CLEAN);
  } else {
    set_signal_status(derived2, MAYBE_DIRTY);
  }
}

// node_modules/svelte/src/internal/client/reactivity/utils.js
function clear_marked(deps) {
  if (deps === null) return;
  for (const dep of deps) {
    if ((dep.f & DERIVED) === 0 || (dep.f & WAS_MARKED) === 0) {
      continue;
    }
    dep.f ^= WAS_MARKED;
    clear_marked(
      /** @type {Derived} */
      dep.deps
    );
  }
}
function defer_effect(effect2, dirty_effects, maybe_dirty_effects) {
  if ((effect2.f & DIRTY) !== 0) {
    dirty_effects.add(effect2);
  } else if ((effect2.f & MAYBE_DIRTY) !== 0) {
    maybe_dirty_effects.add(effect2);
  }
  clear_marked(effect2.deps);
  set_signal_status(effect2, CLEAN);
}

// node_modules/svelte/src/internal/client/reactivity/store.js
var legacy_is_updating_store = false;
var is_store_binding = false;
var IS_UNMOUNTED = Symbol("unmounted");
function capture_store_binding(fn) {
  var previous_is_store_binding = is_store_binding;
  try {
    is_store_binding = false;
    return [fn(), is_store_binding];
  } finally {
    is_store_binding = previous_is_store_binding;
  }
}

// node_modules/svelte/src/reactivity/create-subscriber.js
function createSubscriber(start) {
  let subscribers = 0;
  let version = source(0);
  let stop;
  if (dev_fallback_default) {
    tag(version, "createSubscriber version");
  }
  return () => {
    if (effect_tracking()) {
      get2(version);
      render_effect(() => {
        if (subscribers === 0) {
          stop = untrack(() => start(() => increment(version)));
        }
        subscribers += 1;
        return () => {
          queue_micro_task(() => {
            subscribers -= 1;
            if (subscribers === 0) {
              stop?.();
              stop = void 0;
              increment(version);
            }
          });
        };
      });
    }
  };
}

// node_modules/svelte/src/internal/client/dom/blocks/boundary.js
var flags = EFFECT_TRANSPARENT | EFFECT_PRESERVED;
function boundary(node, props, children, transform_error) {
  new Boundary(node, props, children, transform_error);
}
var Boundary = class {
  /** @type {Boundary | null} */
  parent;
  is_pending = false;
  /**
   * API-level transformError transform function. Transforms errors before they reach the `failed` snippet.
   * Inherited from parent boundary, or defaults to identity.
   * @type {(error: unknown) => unknown}
   */
  transform_error;
  /** @type {TemplateNode} */
  #anchor;
  /** @type {TemplateNode | null} */
  #hydrate_open = hydrating ? hydrate_node : null;
  /** @type {BoundaryProps} */
  #props;
  /** @type {((anchor: Node) => void)} */
  #children;
  /** @type {Effect} */
  #effect;
  /** @type {Effect | null} */
  #main_effect = null;
  /** @type {Effect | null} */
  #pending_effect = null;
  /** @type {Effect | null} */
  #failed_effect = null;
  /** @type {DocumentFragment | null} */
  #offscreen_fragment = null;
  #local_pending_count = 0;
  #pending_count = 0;
  #pending_count_update_queued = false;
  /** @type {Set<Effect>} */
  #dirty_effects = /* @__PURE__ */ new Set();
  /** @type {Set<Effect>} */
  #maybe_dirty_effects = /* @__PURE__ */ new Set();
  /**
   * A source containing the number of pending async deriveds/expressions.
   * Only created if `$effect.pending()` is used inside the boundary,
   * otherwise updating the source results in needless `Batch.ensure()`
   * calls followed by no-op flushes
   * @type {Source<number> | null}
   */
  #effect_pending = null;
  #effect_pending_subscriber = createSubscriber(() => {
    this.#effect_pending = source(this.#local_pending_count);
    if (dev_fallback_default) {
      tag(this.#effect_pending, "$effect.pending()");
    }
    return () => {
      this.#effect_pending = null;
    };
  });
  /**
   * @param {TemplateNode} node
   * @param {BoundaryProps} props
   * @param {((anchor: Node) => void)} children
   * @param {((error: unknown) => unknown) | undefined} [transform_error]
   */
  constructor(node, props, children, transform_error) {
    this.#anchor = node;
    this.#props = props;
    this.#children = (anchor) => {
      var effect2 = (
        /** @type {Effect} */
        active_effect
      );
      effect2.b = this;
      effect2.f |= BOUNDARY_EFFECT;
      children(anchor);
    };
    this.parent = /** @type {Effect} */
    active_effect.b;
    this.transform_error = transform_error ?? this.parent?.transform_error ?? ((e) => e);
    this.#effect = block(() => {
      if (hydrating) {
        const comment2 = (
          /** @type {Comment} */
          this.#hydrate_open
        );
        hydrate_next();
        const server_rendered_pending = comment2.data === HYDRATION_START_ELSE;
        const server_rendered_failed = comment2.data.startsWith(HYDRATION_START_FAILED);
        if (server_rendered_failed) {
          const serialized_error = JSON.parse(comment2.data.slice(HYDRATION_START_FAILED.length));
          this.#hydrate_failed_content(serialized_error);
        } else if (server_rendered_pending) {
          this.#hydrate_pending_content();
        } else {
          this.#hydrate_resolved_content();
        }
      } else {
        this.#render();
      }
    }, flags);
    if (hydrating) {
      this.#anchor = hydrate_node;
    }
  }
  #hydrate_resolved_content() {
    try {
      this.#main_effect = branch(() => this.#children(this.#anchor));
    } catch (error) {
      this.error(error);
    }
  }
  /**
   * @param {unknown} error The deserialized error from the server's hydration comment
   */
  #hydrate_failed_content(error) {
    const failed = this.#props.failed;
    if (!failed) return;
    this.#failed_effect = branch(() => {
      failed(
        this.#anchor,
        () => error,
        () => () => {
        }
      );
    });
  }
  #hydrate_pending_content() {
    const pending2 = this.#props.pending;
    if (!pending2) return;
    this.is_pending = true;
    this.#pending_effect = branch(() => pending2(this.#anchor));
    queue_micro_task(() => {
      var fragment = this.#offscreen_fragment = document.createDocumentFragment();
      var anchor = create_text();
      fragment.append(anchor);
      this.#main_effect = this.#run(() => {
        return branch(() => this.#children(anchor));
      });
      if (this.#pending_count === 0) {
        this.#anchor.before(fragment);
        this.#offscreen_fragment = null;
        pause_effect(
          /** @type {Effect} */
          this.#pending_effect,
          () => {
            this.#pending_effect = null;
          }
        );
        this.#resolve(
          /** @type {Batch} */
          current_batch
        );
      }
    });
  }
  #render() {
    try {
      this.is_pending = this.has_pending_snippet();
      this.#pending_count = 0;
      this.#local_pending_count = 0;
      this.#main_effect = branch(() => {
        this.#children(this.#anchor);
      });
      if (this.#pending_count > 0) {
        var fragment = this.#offscreen_fragment = document.createDocumentFragment();
        move_effect(this.#main_effect, fragment);
        const pending2 = (
          /** @type {(anchor: Node) => void} */
          this.#props.pending
        );
        this.#pending_effect = branch(() => pending2(this.#anchor));
      } else {
        this.#resolve(
          /** @type {Batch} */
          current_batch
        );
      }
    } catch (error) {
      this.error(error);
    }
  }
  /**
   * @param {Batch} batch
   */
  #resolve(batch) {
    this.is_pending = false;
    batch.transfer_effects(this.#dirty_effects, this.#maybe_dirty_effects);
  }
  /**
   * Defer an effect inside a pending boundary until the boundary resolves
   * @param {Effect} effect
   */
  defer_effect(effect2) {
    defer_effect(effect2, this.#dirty_effects, this.#maybe_dirty_effects);
  }
  /**
   * Returns `false` if the effect exists inside a boundary whose pending snippet is shown
   * @returns {boolean}
   */
  is_rendered() {
    return !this.is_pending && (!this.parent || this.parent.is_rendered());
  }
  has_pending_snippet() {
    return !!this.#props.pending;
  }
  /**
   * @template T
   * @param {() => T} fn
   */
  #run(fn) {
    var previous_effect = active_effect;
    var previous_reaction = active_reaction;
    var previous_ctx = component_context;
    set_active_effect(this.#effect);
    set_active_reaction(this.#effect);
    set_component_context(this.#effect.ctx);
    try {
      Batch.ensure();
      return fn();
    } catch (e) {
      handle_error(e);
      return null;
    } finally {
      set_active_effect(previous_effect);
      set_active_reaction(previous_reaction);
      set_component_context(previous_ctx);
    }
  }
  /**
   * Updates the pending count associated with the currently visible pending snippet,
   * if any, such that we can replace the snippet with content once work is done
   * @param {1 | -1} d
   * @param {Batch} batch
   */
  #update_pending_count(d, batch) {
    if (!this.has_pending_snippet()) {
      if (this.parent) {
        this.parent.#update_pending_count(d, batch);
      }
      return;
    }
    this.#pending_count += d;
    if (this.#pending_count === 0) {
      this.#resolve(batch);
      if (this.#pending_effect) {
        pause_effect(this.#pending_effect, () => {
          this.#pending_effect = null;
        });
      }
      if (this.#offscreen_fragment) {
        this.#anchor.before(this.#offscreen_fragment);
        this.#offscreen_fragment = null;
      }
    }
  }
  /**
   * Update the source that powers `$effect.pending()` inside this boundary,
   * and controls when the current `pending` snippet (if any) is removed.
   * Do not call from inside the class
   * @param {1 | -1} d
   * @param {Batch} batch
   */
  update_pending_count(d, batch) {
    this.#update_pending_count(d, batch);
    this.#local_pending_count += d;
    if (!this.#effect_pending || this.#pending_count_update_queued) return;
    this.#pending_count_update_queued = true;
    queue_micro_task(() => {
      this.#pending_count_update_queued = false;
      if (this.#effect_pending) {
        internal_set(this.#effect_pending, this.#local_pending_count);
      }
    });
  }
  get_effect_pending() {
    this.#effect_pending_subscriber();
    return get2(
      /** @type {Source<number>} */
      this.#effect_pending
    );
  }
  /** @param {unknown} error */
  error(error) {
    if (!this.#props.onerror && !this.#props.failed) {
      throw error;
    }
    if (current_batch?.is_fork) {
      if (this.#main_effect) current_batch.skip_effect(this.#main_effect);
      if (this.#pending_effect) current_batch.skip_effect(this.#pending_effect);
      if (this.#failed_effect) current_batch.skip_effect(this.#failed_effect);
      current_batch.oncommit(() => {
        this.#handle_error(error);
      });
    } else {
      this.#handle_error(error);
    }
  }
  /**
   * @param {unknown} error
   */
  #handle_error(error) {
    if (this.#main_effect) {
      destroy_effect(this.#main_effect);
      this.#main_effect = null;
    }
    if (this.#pending_effect) {
      destroy_effect(this.#pending_effect);
      this.#pending_effect = null;
    }
    if (this.#failed_effect) {
      destroy_effect(this.#failed_effect);
      this.#failed_effect = null;
    }
    if (hydrating) {
      set_hydrate_node(
        /** @type {TemplateNode} */
        this.#hydrate_open
      );
      next();
      set_hydrate_node(skip_nodes());
    }
    var onerror = this.#props.onerror;
    let failed = this.#props.failed;
    var did_reset = false;
    var calling_on_error = false;
    const reset2 = () => {
      if (did_reset) {
        svelte_boundary_reset_noop();
        return;
      }
      did_reset = true;
      if (calling_on_error) {
        svelte_boundary_reset_onerror();
      }
      if (this.#failed_effect !== null) {
        pause_effect(this.#failed_effect, () => {
          this.#failed_effect = null;
        });
      }
      this.#run(() => {
        this.#render();
      });
    };
    const handle_error_result = (transformed_error) => {
      try {
        calling_on_error = true;
        onerror?.(transformed_error, reset2);
        calling_on_error = false;
      } catch (error2) {
        invoke_error_boundary(error2, this.#effect && this.#effect.parent);
      }
      if (failed) {
        this.#failed_effect = this.#run(() => {
          try {
            return branch(() => {
              var effect2 = (
                /** @type {Effect} */
                active_effect
              );
              effect2.b = this;
              effect2.f |= BOUNDARY_EFFECT;
              failed(
                this.#anchor,
                () => transformed_error,
                () => reset2
              );
            });
          } catch (error2) {
            invoke_error_boundary(
              error2,
              /** @type {Effect} */
              this.#effect.parent
            );
            return null;
          }
        });
      }
    };
    queue_micro_task(() => {
      var result;
      try {
        result = this.transform_error(error);
      } catch (e) {
        invoke_error_boundary(e, this.#effect && this.#effect.parent);
        return;
      }
      if (result !== null && typeof result === "object" && typeof /** @type {any} */
      result.then === "function") {
        result.then(
          handle_error_result,
          /** @param {unknown} e */
          (e) => invoke_error_boundary(e, this.#effect && this.#effect.parent)
        );
      } else {
        handle_error_result(result);
      }
    });
  }
};

// node_modules/svelte/src/internal/client/reactivity/async.js
function flatten(blockers, sync, async2, fn) {
  const d = is_runes() ? derived : derived_safe_equal;
  var pending2 = blockers.filter((b) => !b.settled);
  var deriveds = sync.map(d);
  if (dev_fallback_default) {
    deriveds.forEach((d2, i) => {
      d2.label = sync[i].toString().replace("() => ", "").replaceAll("$.eager(() => ", "$state.eager(").replace(/\$\.get\((.+?)\)/g, (_, id) => id);
    });
  }
  if (async2.length === 0 && pending2.length === 0) {
    fn(deriveds);
    return;
  }
  var parent = (
    /** @type {Effect} */
    active_effect
  );
  var restore = capture();
  var blocker_promise = pending2.length === 1 ? pending2[0].promise : pending2.length > 1 ? Promise.all(pending2.map((b) => b.promise)) : null;
  function finish(async3) {
    if ((parent.f & DESTROYED) !== 0) {
      return;
    }
    restore();
    try {
      fn([...deriveds, ...async3]);
    } catch (error) {
      invoke_error_boundary(error, parent);
    }
    unset_context();
  }
  var decrement_pending = increment_pending();
  if (async2.length === 0) {
    blocker_promise.then(() => finish([])).finally(decrement_pending);
    return;
  }
  function run3() {
    Promise.all(async2.map((expression) => async_derived(expression))).then(finish).catch((error) => invoke_error_boundary(error, parent)).finally(decrement_pending);
  }
  if (blocker_promise) {
    blocker_promise.then(() => {
      restore();
      run3();
      unset_context();
    });
  } else {
    run3();
  }
}
function capture() {
  var previous_effect = (
    /** @type {Effect} */
    active_effect
  );
  var previous_reaction = active_reaction;
  var previous_component_context = component_context;
  var previous_batch2 = (
    /** @type {Batch} */
    current_batch
  );
  if (dev_fallback_default) {
    var previous_dev_stack = dev_stack;
  }
  return function restore(activate_batch = true) {
    set_active_effect(previous_effect);
    set_active_reaction(previous_reaction);
    set_component_context(previous_component_context);
    if (activate_batch && (previous_effect.f & DESTROYED) === 0) {
      previous_batch2?.activate();
      previous_batch2?.apply();
    }
    if (dev_fallback_default) {
      set_reactivity_loss_tracker(null);
      set_dev_stack(previous_dev_stack);
    }
  };
}
function unset_context(deactivate_batch = true) {
  set_active_effect(null);
  set_active_reaction(null);
  set_component_context(null);
  if (deactivate_batch) current_batch?.deactivate();
  if (dev_fallback_default) {
    set_reactivity_loss_tracker(null);
    set_dev_stack(null);
  }
}
function increment_pending() {
  var effect2 = (
    /** @type {Effect} */
    active_effect
  );
  var boundary2 = effect2.b;
  var batch = (
    /** @type {Batch} */
    current_batch
  );
  var blocking = !!boundary2?.is_rendered();
  boundary2?.update_pending_count(1, batch);
  batch.increment(blocking, effect2);
  return () => {
    boundary2?.update_pending_count(-1, batch);
    batch.decrement(blocking, effect2);
  };
}

// node_modules/svelte/src/internal/client/reactivity/deriveds.js
var reactivity_loss_tracker = null;
function set_reactivity_loss_tracker(v) {
  reactivity_loss_tracker = v;
}
var recent_async_deriveds = /* @__PURE__ */ new Set();
// @__NO_SIDE_EFFECTS__
function derived(fn) {
  var flags2 = DERIVED | DIRTY;
  if (active_effect !== null) {
    active_effect.f |= EFFECT_PRESERVED;
  }
  const signal = {
    ctx: component_context,
    deps: null,
    effects: null,
    equals,
    f: flags2,
    fn,
    reactions: null,
    rv: 0,
    v: (
      /** @type {V} */
      UNINITIALIZED
    ),
    wv: 0,
    parent: active_effect,
    ac: null
  };
  if (dev_fallback_default && tracing_mode_flag) {
    signal.created = get_error("created at");
  }
  return signal;
}
var OBSOLETE = Symbol("obsolete");
// @__NO_SIDE_EFFECTS__
function async_derived(fn, label2, location) {
  let parent = (
    /** @type {Effect | null} */
    active_effect
  );
  if (parent === null) {
    async_derived_orphan();
  }
  var promise = (
    /** @type {Promise<V>} */
    /** @type {unknown} */
    void 0
  );
  var signal = source(
    /** @type {V} */
    UNINITIALIZED
  );
  if (dev_fallback_default) signal.label = label2 ?? fn.toString();
  var should_suspend = !active_reaction;
  var deferreds = /* @__PURE__ */ new Set();
  async_effect(() => {
    var effect2 = (
      /** @type {Effect} */
      active_effect
    );
    if (dev_fallback_default) {
      reactivity_loss_tracker = { effect: effect2, effect_deps: /* @__PURE__ */ new Set(), warned: false };
    }
    var d = deferred();
    promise = d.promise;
    try {
      Promise.resolve(fn()).then(d.resolve, (e) => {
        if (e !== STALE_REACTION) d.reject(e);
      }).finally(unset_context);
    } catch (error) {
      d.reject(error);
      unset_context();
    }
    if (dev_fallback_default) {
      if (reactivity_loss_tracker) {
        if (effect2.deps !== null) {
          for (let i = 0; i < skipped_deps; i += 1) {
            reactivity_loss_tracker.effect_deps.add(effect2.deps[i]);
          }
        }
        if (new_deps !== null) {
          for (let i = 0; i < new_deps.length; i += 1) {
            reactivity_loss_tracker.effect_deps.add(new_deps[i]);
          }
        }
      }
      reactivity_loss_tracker = null;
    }
    var batch = (
      /** @type {Batch} */
      current_batch
    );
    if (should_suspend) {
      if ((effect2.f & REACTION_RAN) !== 0) {
        var decrement_pending = increment_pending();
      }
      if (
        // boundary can be null if the async derived is inside an $effect.root not connected to the component render tree
        parent.b?.is_rendered()
      ) {
        batch.async_deriveds.get(effect2)?.reject(OBSOLETE);
      } else {
        for (const d2 of deferreds.values()) {
          d2.reject(OBSOLETE);
        }
      }
      deferreds.add(d);
      batch.async_deriveds.set(effect2, d);
    }
    const handler = (value, error = void 0) => {
      if (dev_fallback_default) {
        reactivity_loss_tracker = null;
      }
      decrement_pending?.();
      deferreds.delete(d);
      if (error === OBSOLETE) return;
      batch.activate();
      if (error) {
        signal.f |= ERROR_VALUE;
        internal_set(signal, error);
      } else {
        if ((signal.f & ERROR_VALUE) !== 0) {
          signal.f ^= ERROR_VALUE;
        }
        if (dev_fallback_default && location !== void 0 && !signal.equals(value)) {
          recent_async_deriveds.add(signal);
          setTimeout(() => {
            if (recent_async_deriveds.has(signal) && (effect2.f & DESTROYED) === 0) {
              await_waterfall(
                /** @type {string} */
                signal.label,
                location
              );
              recent_async_deriveds.delete(signal);
            }
          });
        }
        internal_set(signal, value);
      }
      batch.deactivate();
    };
    d.promise.then(handler, (e) => handler(null, e || "unknown"));
  });
  teardown(() => {
    for (const d of deferreds) {
      d.reject(OBSOLETE);
    }
  });
  if (dev_fallback_default) {
    signal.f |= ASYNC;
  }
  return new Promise((fulfil) => {
    function next2(p) {
      function go() {
        if (p === promise) {
          fulfil(signal);
        } else {
          next2(promise);
        }
      }
      p.then(go, go);
    }
    next2(promise);
  });
}
// @__NO_SIDE_EFFECTS__
function user_derived(fn) {
  const d = /* @__PURE__ */ derived(fn);
  if (!async_mode_flag) push_reaction_value(d);
  return d;
}
// @__NO_SIDE_EFFECTS__
function derived_safe_equal(fn) {
  const signal = /* @__PURE__ */ derived(fn);
  signal.equals = safe_equals;
  return signal;
}
function destroy_derived_effects(derived2) {
  var effects = derived2.effects;
  if (effects !== null) {
    derived2.effects = null;
    for (var i = 0; i < effects.length; i += 1) {
      destroy_effect(
        /** @type {Effect} */
        effects[i]
      );
    }
  }
}
var stack = [];
function execute_derived(derived2) {
  var value;
  var prev_active_effect = active_effect;
  var parent = derived2.parent;
  if (!is_destroying_effect && parent !== null && derived2.v !== UNINITIALIZED && // if it was never evaluated before, it's guaranteed to fail downstream, so we try to execute instead
  (parent.f & (DESTROYED | INERT)) !== 0) {
    derived_inert();
    return derived2.v;
  }
  set_active_effect(parent);
  if (dev_fallback_default) {
    let prev_eager_effects = eager_effects;
    set_eager_effects(/* @__PURE__ */ new Set());
    try {
      if (includes.call(stack, derived2)) {
        derived_references_self();
      }
      stack.push(derived2);
      derived2.f &= ~WAS_MARKED;
      destroy_derived_effects(derived2);
      value = update_reaction(derived2);
    } finally {
      set_active_effect(prev_active_effect);
      set_eager_effects(prev_eager_effects);
      stack.pop();
    }
  } else {
    try {
      derived2.f &= ~WAS_MARKED;
      destroy_derived_effects(derived2);
      value = update_reaction(derived2);
    } finally {
      set_active_effect(prev_active_effect);
    }
  }
  return value;
}
function update_derived(derived2) {
  var value = execute_derived(derived2);
  if (!derived2.equals(value)) {
    derived2.wv = increment_write_version();
    if (!current_batch?.is_fork || derived2.deps === null) {
      if (current_batch !== null) {
        current_batch.capture(derived2, value, true);
        previous_batch?.capture(derived2, value, true);
      } else {
        derived2.v = value;
      }
      if (derived2.deps === null) {
        set_signal_status(derived2, CLEAN);
        return;
      }
    }
  }
  if (is_destroying_effect) {
    return;
  }
  if (batch_values !== null) {
    if (effect_tracking() || current_batch?.is_fork) {
      batch_values.set(derived2, value);
    }
  } else {
    update_derived_status(derived2);
  }
}
function freeze_derived_effects(derived2) {
  if (derived2.effects === null) return;
  for (const e of derived2.effects) {
    if (e.teardown || e.ac) {
      e.teardown?.();
      e.ac?.abort(STALE_REACTION);
      if (e.fn !== null) e.teardown = noop;
      e.ac = null;
      remove_reactions(e, 0);
      destroy_effect_children(e);
    }
  }
}
function unfreeze_derived_effects(derived2) {
  if (derived2.effects === null) return;
  for (const e of derived2.effects) {
    if (e.teardown && e.fn !== null) {
      update_effect(e);
    }
  }
}

// node_modules/svelte/src/internal/client/reactivity/batch.js
var first_batch = null;
var last_batch = null;
var current_batch = null;
var previous_batch = null;
var batch_values = null;
var last_scheduled_effect = null;
var is_flushing_sync = false;
var is_processing = false;
var collected_effects = null;
var legacy_updates = null;
var flush_count = 0;
var source_stacks = /* @__PURE__ */ new Set();
var uid = 1;
var Batch = class _Batch {
  id = uid++;
  /** True as soon as `#process` was called */
  #started = false;
  linked = true;
  /** @type {Batch | null} */
  #prev = null;
  /** @type {Batch | null} */
  #next = null;
  /** @type {Map<Effect, ReturnType<typeof deferred<any>>>} */
  async_deriveds = /* @__PURE__ */ new Map();
  /**
   * The current values of any signals that are updated in this batch.
   * Tuple format: [value, is_derived] (note: is_derived is false for deriveds, too, if they were overridden via assignment)
   * They keys of this map are identical to `this.#previous`
   * @type {Map<Value, [any, boolean]>}
   */
  current = /* @__PURE__ */ new Map();
  /**
   * The values of any signals (sources and deriveds) that are updated in this batch _before_ those updates took place.
   * They keys of this map are identical to `this.#current`
   * @type {Map<Value, any>}
   */
  previous = /* @__PURE__ */ new Map();
  /**
   * When the batch is committed (and the DOM is updated), we need to remove old branches
   * and append new ones by calling the functions added inside (if/each/key/etc) blocks
   * @type {Set<(batch: Batch) => void>}
   */
  #commit_callbacks = /* @__PURE__ */ new Set();
  /**
   * If a fork is discarded, we need to destroy any effects that are no longer needed
   * @type {Set<(batch: Batch) => void>}
   */
  #discard_callbacks = /* @__PURE__ */ new Set();
  /**
   * The number of async effects that are currently in flight
   */
  #pending = 0;
  /**
   * Async effects that are currently in flight, _not_ inside a pending boundary
   * @type {Map<Effect, number>}
   */
  #blocking_pending = /* @__PURE__ */ new Map();
  /**
   * A deferred that resolves when the batch is committed, used with `settled()`
   * TODO replace with Promise.withResolvers once supported widely enough
   * @type {{ promise: Promise<void>, resolve: (value?: any) => void, reject: (reason: unknown) => void } | null}
   */
  #deferred = null;
  /**
   * The root effects that need to be flushed
   * @type {Effect[]}
   */
  #roots = [];
  /**
   * Effects created while this batch was active.
   * @type {Effect[]}
   */
  #new_effects = [];
  /**
   * Deferred effects (which run after async work has completed) that are DIRTY
   * @type {Set<Effect>}
   */
  #dirty_effects = /* @__PURE__ */ new Set();
  /**
   * Deferred effects that are MAYBE_DIRTY
   * @type {Set<Effect>}
   */
  #maybe_dirty_effects = /* @__PURE__ */ new Set();
  /**
   * A map of branches that still exist, but will be destroyed when this batch
   * is committed — we skip over these during `process`.
   * The value contains child effects that were dirty/maybe_dirty before being reset,
   * so they can be rescheduled if the branch survives.
   * @type {Map<Effect, { d: Effect[], m: Effect[] }>}
   */
  #skipped_branches = /* @__PURE__ */ new Map();
  /**
   * Inverse of #skipped_branches which we need to tell prior batches to unskip them when committing
   * @type {Set<Effect>}
   */
  #unskipped_branches = /* @__PURE__ */ new Set();
  is_fork = false;
  #decrement_queued = false;
  constructor() {
    if (last_batch === null) {
      first_batch = last_batch = this;
    } else {
      last_batch.#next = this;
      this.#prev = last_batch;
    }
    last_batch = this;
  }
  #is_deferred() {
    if (this.is_fork) return true;
    for (const effect2 of this.#blocking_pending.keys()) {
      var e = effect2;
      var skipped = false;
      while (e.parent !== null) {
        if (this.#skipped_branches.has(e)) {
          skipped = true;
          break;
        }
        e = e.parent;
      }
      if (!skipped) {
        return true;
      }
    }
    return false;
  }
  /**
   * Add an effect to the #skipped_branches map and reset its children
   * @param {Effect} effect
   */
  skip_effect(effect2) {
    if (!this.#skipped_branches.has(effect2)) {
      this.#skipped_branches.set(effect2, { d: [], m: [] });
    }
    this.#unskipped_branches.delete(effect2);
  }
  /**
   * Remove an effect from the #skipped_branches map and reschedule
   * any tracked dirty/maybe_dirty child effects
   * @param {Effect} effect
   * @param {(e: Effect) => void} callback
   */
  unskip_effect(effect2, callback = (e) => this.schedule(e)) {
    var tracked = this.#skipped_branches.get(effect2);
    if (tracked) {
      this.#skipped_branches.delete(effect2);
      for (var e of tracked.d) {
        set_signal_status(e, DIRTY);
        callback(e);
      }
      for (e of tracked.m) {
        set_signal_status(e, MAYBE_DIRTY);
        callback(e);
      }
    }
    this.#unskipped_branches.add(effect2);
  }
  #process() {
    this.#started = true;
    if (flush_count++ > 1e3) {
      this.#unlink();
      infinite_loop_guard();
    }
    if (dev_fallback_default) {
      for (const value of this.current.keys()) {
        source_stacks.add(value);
      }
    }
    for (const e of this.#dirty_effects) {
      this.#maybe_dirty_effects.delete(e);
      set_signal_status(e, DIRTY);
      this.schedule(e);
    }
    for (const e of this.#maybe_dirty_effects) {
      set_signal_status(e, MAYBE_DIRTY);
      this.schedule(e);
    }
    const roots = this.#roots;
    this.#roots = [];
    this.apply();
    var effects = collected_effects = [];
    var render_effects = [];
    var updates = legacy_updates = [];
    for (const root9 of roots) {
      try {
        this.#traverse(root9, effects, render_effects);
      } catch (e) {
        reset_all(root9);
        if (!this.#is_deferred()) this.discard();
        throw e;
      }
    }
    current_batch = null;
    if (updates.length > 0) {
      var batch = _Batch.ensure();
      for (const e of updates) {
        batch.schedule(e);
      }
    }
    collected_effects = null;
    legacy_updates = null;
    if (this.#is_deferred()) {
      this.#defer_effects(render_effects);
      this.#defer_effects(effects);
      for (const [e, t] of this.#skipped_branches) {
        reset_branch(e, t);
      }
      if (updates.length > 0) {
        /** @type {unknown} */
        current_batch.#process();
      }
      return;
    }
    const earlier_batch = this.#find_earlier_batch();
    if (earlier_batch) {
      this.#defer_effects(render_effects);
      this.#defer_effects(effects);
      earlier_batch.#merge(this);
      return;
    }
    this.#dirty_effects.clear();
    this.#maybe_dirty_effects.clear();
    for (const fn of this.#commit_callbacks) fn(this);
    this.#commit_callbacks.clear();
    previous_batch = this;
    flush_queued_effects(render_effects);
    flush_queued_effects(effects);
    previous_batch = null;
    this.#deferred?.resolve();
    var next_batch = (
      /** @type {Batch | null} */
      /** @type {unknown} */
      current_batch
    );
    if (this.#pending === 0 && (this.#roots.length === 0 || next_batch !== null)) {
      this.#unlink();
      if (async_mode_flag) {
        this.#commit();
        current_batch = next_batch;
      }
    }
    if (this.#roots.length > 0) {
      if (next_batch !== null) {
        const batch2 = next_batch;
        batch2.#roots.push(...this.#roots.filter((r) => !batch2.#roots.includes(r)));
      } else {
        next_batch = this;
      }
    }
    if (next_batch !== null) {
      next_batch.#process();
    }
  }
  /**
   * Traverse the effect tree, executing effects or stashing
   * them for later execution as appropriate
   * @param {Effect} root
   * @param {Effect[]} effects
   * @param {Effect[]} render_effects
   */
  #traverse(root9, effects, render_effects) {
    root9.f ^= CLEAN;
    var effect2 = root9.first;
    while (effect2 !== null) {
      var flags2 = effect2.f;
      var is_branch = (flags2 & (BRANCH_EFFECT | ROOT_EFFECT)) !== 0;
      var is_skippable_branch = is_branch && (flags2 & CLEAN) !== 0;
      var skip = is_skippable_branch || (flags2 & INERT) !== 0 || this.#skipped_branches.has(effect2);
      if (!skip && effect2.fn !== null) {
        if (is_branch) {
          effect2.f ^= CLEAN;
        } else if ((flags2 & EFFECT) !== 0) {
          effects.push(effect2);
        } else if (async_mode_flag && (flags2 & (RENDER_EFFECT | MANAGED_EFFECT)) !== 0) {
          render_effects.push(effect2);
        } else if (is_dirty(effect2)) {
          if ((flags2 & BLOCK_EFFECT) !== 0) this.#maybe_dirty_effects.add(effect2);
          update_effect(effect2);
        }
        var child2 = effect2.first;
        if (child2 !== null) {
          effect2 = child2;
          continue;
        }
      }
      while (effect2 !== null) {
        var next2 = effect2.next;
        if (next2 !== null) {
          effect2 = next2;
          break;
        }
        effect2 = effect2.parent;
      }
    }
  }
  #find_earlier_batch() {
    var batch = this.#prev;
    while (batch !== null) {
      if (!batch.is_fork) {
        for (const [value, [, is_derived]] of this.current) {
          if (batch.current.has(value) && !is_derived) {
            return batch;
          }
        }
      }
      batch = batch.#prev;
    }
    return null;
  }
  /**
   * @param {Batch} batch
   */
  #merge(batch) {
    for (const [source2, value] of batch.current) {
      if (!this.previous.has(source2) && batch.previous.has(source2)) {
        this.previous.set(source2, batch.previous.get(source2));
      }
      this.current.set(source2, value);
    }
    for (const [effect2, deferred2] of batch.async_deriveds) {
      const d = this.async_deriveds.get(effect2);
      if (d) deferred2.promise.then(d.resolve).catch(d.reject);
    }
    batch.async_deriveds.clear();
    this.transfer_effects(batch.#dirty_effects, batch.#maybe_dirty_effects);
    const mark = (value) => {
      var reactions = value.reactions;
      if (reactions === null) return;
      for (const reaction of reactions) {
        var flags2 = reaction.f;
        if ((flags2 & DERIVED) !== 0) {
          mark(
            /** @type {Derived} */
            reaction
          );
        } else {
          var effect2 = (
            /** @type {Effect} */
            reaction
          );
          if (flags2 & (ASYNC | BLOCK_EFFECT) && !this.async_deriveds.has(effect2)) {
            this.#maybe_dirty_effects.delete(effect2);
            set_signal_status(effect2, DIRTY);
            this.schedule(effect2);
          }
        }
      }
    };
    for (const source2 of this.current.keys()) {
      mark(source2);
    }
    this.oncommit(() => batch.discard());
    batch.#unlink();
    current_batch = this;
    this.#process();
  }
  /**
   * @param {Effect[]} effects
   */
  #defer_effects(effects) {
    for (var i = 0; i < effects.length; i += 1) {
      defer_effect(effects[i], this.#dirty_effects, this.#maybe_dirty_effects);
    }
  }
  /**
   * Associate a change to a given source with the current
   * batch, noting its previous and current values
   * @param {Value} source
   * @param {any} value
   * @param {boolean} [is_derived]
   */
  capture(source2, value, is_derived = false) {
    if (source2.v !== UNINITIALIZED && !this.previous.has(source2)) {
      this.previous.set(source2, source2.v);
    }
    if ((source2.f & ERROR_VALUE) === 0) {
      this.current.set(source2, [value, is_derived]);
      batch_values?.set(source2, value);
    }
    if (!this.is_fork) {
      source2.v = value;
    }
  }
  activate() {
    current_batch = this;
  }
  deactivate() {
    current_batch = null;
    batch_values = null;
  }
  flush() {
    try {
      if (dev_fallback_default) {
        source_stacks.clear();
      }
      is_processing = true;
      current_batch = this;
      this.#process();
    } finally {
      flush_count = 0;
      last_scheduled_effect = null;
      collected_effects = null;
      legacy_updates = null;
      is_processing = false;
      current_batch = null;
      batch_values = null;
      old_values.clear();
      if (dev_fallback_default) {
        for (const source2 of source_stacks) {
          source2.updated = null;
        }
      }
    }
  }
  discard() {
    for (const fn of this.#discard_callbacks) fn(this);
    this.#discard_callbacks.clear();
    for (const deferred2 of this.async_deriveds.values()) {
      deferred2.reject(OBSOLETE);
    }
    this.#unlink();
    this.#deferred?.resolve();
  }
  /**
   * @param {Effect} effect
   */
  register_created_effect(effect2) {
    this.#new_effects.push(effect2);
  }
  #commit() {
    for (let batch = first_batch; batch !== null; batch = batch.#next) {
      var is_earlier = batch.id < this.id;
      var sources = [];
      for (const [source3, [value, is_derived]] of this.current) {
        if (batch.current.has(source3)) {
          var batch_value = (
            /** @type {[any, boolean]} */
            batch.current.get(source3)[0]
          );
          if (is_earlier && value !== batch_value) {
            batch.current.set(source3, [value, is_derived]);
          } else {
            continue;
          }
        }
        sources.push(source3);
      }
      if (is_earlier) {
        for (const [effect2, deferred2] of this.async_deriveds) {
          const d = batch.async_deriveds.get(effect2);
          if (d) deferred2.promise.then(d.resolve).catch(d.reject);
        }
      }
      var current = [...batch.current.keys()].filter(
        (source3) => !/** @type {[any, boolean]} */
        batch.current.get(source3)[1]
      );
      if (!batch.#started || current.length === 0) continue;
      var others = current.filter((source3) => !this.current.has(source3));
      if (others.length === 0) {
        if (is_earlier) {
          batch.discard();
        }
      } else if (sources.length > 0) {
        if (dev_fallback_default && !batch.#decrement_queued) {
          invariant(batch.#roots.length === 0, "Batch has scheduled roots");
        }
        if (is_earlier) {
          for (const unskipped of this.#unskipped_branches) {
            batch.unskip_effect(unskipped, (e) => {
              if ((e.f & (BLOCK_EFFECT | ASYNC)) !== 0) {
                batch.schedule(e);
              } else {
                batch.#defer_effects([e]);
              }
            });
          }
        }
        batch.activate();
        var marked = /* @__PURE__ */ new Set();
        var checked = /* @__PURE__ */ new Map();
        for (var source2 of sources) {
          mark_effects(source2, others, marked, checked);
        }
        checked = /* @__PURE__ */ new Map();
        var current_unequal = [...batch.current].filter(([c, v1]) => {
          const v2 = this.current.get(c);
          if (!v2) return true;
          return v2[0] !== v1[0] || v2[1] !== v1[1];
        }).map(([c]) => c);
        if (current_unequal.length > 0) {
          for (const effect2 of this.#new_effects) {
            if ((effect2.f & (DESTROYED | INERT | EAGER_EFFECT)) === 0 && depends_on(effect2, current_unequal, checked)) {
              if ((effect2.f & (ASYNC | BLOCK_EFFECT)) !== 0) {
                set_signal_status(effect2, DIRTY);
                batch.schedule(effect2);
              } else {
                batch.#dirty_effects.add(effect2);
              }
            }
          }
        }
        if (batch.#roots.length > 0 && !batch.#decrement_queued) {
          batch.apply();
          for (var root9 of batch.#roots) {
            batch.#traverse(root9, [], []);
          }
          batch.#roots = [];
        }
        batch.deactivate();
      }
    }
  }
  /**
   * @param {boolean} blocking
   * @param {Effect} effect
   */
  increment(blocking, effect2) {
    this.#pending += 1;
    if (blocking) {
      let blocking_pending_count = this.#blocking_pending.get(effect2) ?? 0;
      this.#blocking_pending.set(effect2, blocking_pending_count + 1);
    }
  }
  /**
   * @param {boolean} blocking
   * @param {Effect} effect
   */
  decrement(blocking, effect2) {
    this.#pending -= 1;
    if (blocking) {
      let blocking_pending_count = this.#blocking_pending.get(effect2) ?? 0;
      if (blocking_pending_count === 1) {
        this.#blocking_pending.delete(effect2);
      } else {
        this.#blocking_pending.set(effect2, blocking_pending_count - 1);
      }
    }
    if (this.#decrement_queued) return;
    this.#decrement_queued = true;
    queue_micro_task(() => {
      this.#decrement_queued = false;
      if (this.linked) {
        this.flush();
      }
    });
  }
  /**
   * @param {Set<Effect>} dirty_effects
   * @param {Set<Effect>} maybe_dirty_effects
   */
  transfer_effects(dirty_effects, maybe_dirty_effects) {
    for (const e of dirty_effects) {
      this.#dirty_effects.add(e);
    }
    for (const e of maybe_dirty_effects) {
      this.#maybe_dirty_effects.add(e);
    }
    dirty_effects.clear();
    maybe_dirty_effects.clear();
  }
  /** @param {(batch: Batch) => void} fn */
  oncommit(fn) {
    this.#commit_callbacks.add(fn);
  }
  /** @param {(batch: Batch) => void} fn */
  ondiscard(fn) {
    this.#discard_callbacks.add(fn);
  }
  settled() {
    return (this.#deferred ??= deferred()).promise;
  }
  static ensure() {
    if (current_batch === null) {
      const batch = current_batch = new _Batch();
      if (!is_processing && !is_flushing_sync) {
        queue_micro_task(() => {
          if (!batch.#started) {
            batch.flush();
          }
        });
      }
    }
    return current_batch;
  }
  apply() {
    if (!async_mode_flag || !this.is_fork && this.#prev === null && this.#next === null) {
      batch_values = null;
      return;
    }
    batch_values = /* @__PURE__ */ new Map();
    for (const [source2, [value]] of this.current) {
      batch_values.set(source2, value);
    }
    for (let batch = first_batch; batch !== null; batch = batch.#next) {
      if (batch === this || batch.is_fork) continue;
      var intersects = false;
      if (batch.id < this.id) {
        for (const [source2, [, is_derived]] of batch.current) {
          if (is_derived) continue;
          if (this.current.has(source2)) {
            intersects = true;
            break;
          }
        }
      }
      if (!intersects) {
        for (const [source2, previous] of batch.previous) {
          if (!batch_values.has(source2)) {
            batch_values.set(source2, previous);
          }
        }
      }
    }
  }
  /**
   *
   * @param {Effect} effect
   */
  schedule(effect2) {
    last_scheduled_effect = effect2;
    if (effect2.b?.is_pending && (effect2.f & (EFFECT | RENDER_EFFECT | MANAGED_EFFECT)) !== 0 && (effect2.f & REACTION_RAN) === 0) {
      effect2.b.defer_effect(effect2);
      return;
    }
    var e = effect2;
    while (e.parent !== null) {
      e = e.parent;
      var flags2 = e.f;
      if (collected_effects !== null && e === active_effect) {
        if (async_mode_flag) return;
        if ((active_reaction === null || (active_reaction.f & DERIVED) === 0) && !legacy_is_updating_store) {
          return;
        }
      }
      if ((flags2 & (ROOT_EFFECT | BRANCH_EFFECT)) !== 0) {
        if ((flags2 & CLEAN) === 0) {
          return;
        }
        e.f ^= CLEAN;
      }
    }
    this.#roots.push(e);
  }
  #unlink() {
    if (!this.linked) return;
    var prev = this.#prev;
    var next2 = this.#next;
    if (prev === null) {
      first_batch = next2;
    } else {
      prev.#next = next2;
    }
    if (next2 === null) {
      last_batch = prev;
    } else {
      next2.#prev = prev;
    }
    this.linked = false;
  }
};
function flushSync(fn) {
  var was_flushing_sync = is_flushing_sync;
  is_flushing_sync = true;
  try {
    var result;
    if (fn) {
      if (current_batch !== null && !current_batch.is_fork) {
        current_batch.flush();
      }
      result = fn();
    }
    while (true) {
      flush_tasks();
      if (current_batch === null) {
        return (
          /** @type {T} */
          result
        );
      }
      current_batch.flush();
    }
  } finally {
    is_flushing_sync = was_flushing_sync;
  }
}
function infinite_loop_guard() {
  if (dev_fallback_default) {
    var updates = /* @__PURE__ */ new Map();
    for (
      const source2 of
      /** @type {Batch} */
      current_batch.current.keys()
    ) {
      for (const [stack2, update2] of source2.updated ?? []) {
        var entry = updates.get(stack2);
        if (!entry) {
          entry = { error: update2.error, count: 0 };
          updates.set(stack2, entry);
        }
        entry.count += update2.count;
      }
    }
    for (const update2 of updates.values()) {
      if (update2.error) {
        console.error(update2.error);
      }
    }
  }
  try {
    effect_update_depth_exceeded();
  } catch (error) {
    if (dev_fallback_default) {
      define_property(error, "stack", { value: "" });
    }
    invoke_error_boundary(error, last_scheduled_effect);
  }
}
var eager_block_effects = null;
function flush_queued_effects(effects) {
  var length = effects.length;
  if (length === 0) return;
  var i = 0;
  while (i < length) {
    var effect2 = effects[i++];
    if ((effect2.f & (DESTROYED | INERT)) === 0 && is_dirty(effect2)) {
      eager_block_effects = /* @__PURE__ */ new Set();
      update_effect(effect2);
      if (effect2.deps === null && effect2.first === null && effect2.nodes === null && effect2.teardown === null && effect2.ac === null) {
        unlink_effect(effect2);
      }
      if (eager_block_effects?.size > 0) {
        old_values.clear();
        for (const e of eager_block_effects) {
          if ((e.f & (DESTROYED | INERT)) !== 0) continue;
          const ordered_effects = [e];
          let ancestor = e.parent;
          while (ancestor !== null) {
            if (eager_block_effects.has(ancestor)) {
              eager_block_effects.delete(ancestor);
              ordered_effects.push(ancestor);
            }
            ancestor = ancestor.parent;
          }
          for (let j = ordered_effects.length - 1; j >= 0; j--) {
            const e2 = ordered_effects[j];
            if ((e2.f & (DESTROYED | INERT)) !== 0) continue;
            update_effect(e2);
          }
        }
        eager_block_effects.clear();
      }
    }
  }
  eager_block_effects = null;
}
function mark_effects(value, sources, marked, checked) {
  if (marked.has(value)) return;
  marked.add(value);
  if (value.reactions !== null) {
    for (const reaction of value.reactions) {
      const flags2 = reaction.f;
      if ((flags2 & DERIVED) !== 0) {
        mark_effects(
          /** @type {Derived} */
          reaction,
          sources,
          marked,
          checked
        );
      } else if ((flags2 & (ASYNC | BLOCK_EFFECT)) !== 0 && (flags2 & DIRTY) === 0 && depends_on(reaction, sources, checked)) {
        set_signal_status(reaction, DIRTY);
        schedule_effect(
          /** @type {Effect} */
          reaction
        );
      }
    }
  }
}
function depends_on(reaction, sources, checked) {
  const depends = checked.get(reaction);
  if (depends !== void 0) return depends;
  if (reaction.deps !== null) {
    for (const dep of reaction.deps) {
      if (includes.call(sources, dep)) {
        return true;
      }
      if ((dep.f & DERIVED) !== 0 && depends_on(
        /** @type {Derived} */
        dep,
        sources,
        checked
      )) {
        checked.set(
          /** @type {Derived} */
          dep,
          true
        );
        return true;
      }
    }
  }
  checked.set(reaction, false);
  return false;
}
function schedule_effect(effect2) {
  current_batch.schedule(effect2);
}
function reset_branch(effect2, tracked) {
  if ((effect2.f & BRANCH_EFFECT) !== 0 && (effect2.f & CLEAN) !== 0) {
    return;
  }
  if ((effect2.f & DIRTY) !== 0) {
    tracked.d.push(effect2);
  } else if ((effect2.f & MAYBE_DIRTY) !== 0) {
    tracked.m.push(effect2);
  }
  set_signal_status(effect2, CLEAN);
  var e = effect2.first;
  while (e !== null) {
    reset_branch(e, tracked);
    e = e.next;
  }
}
function reset_all(effect2) {
  set_signal_status(effect2, CLEAN);
  var e = effect2.first;
  while (e !== null) {
    reset_all(e);
    e = e.next;
  }
}

// node_modules/svelte/src/internal/client/reactivity/sources.js
var eager_effects = /* @__PURE__ */ new Set();
var old_values = /* @__PURE__ */ new Map();
function set_eager_effects(v) {
  eager_effects = v;
}
var eager_effects_deferred = false;
function set_eager_effects_deferred() {
  eager_effects_deferred = true;
}
function source(v, stack2) {
  var signal = {
    f: 0,
    // TODO ideally we could skip this altogether, but it causes type errors
    v,
    reactions: null,
    equals,
    rv: 0,
    wv: 0
  };
  if (dev_fallback_default && tracing_mode_flag) {
    signal.created = stack2 ?? get_error("created at");
    signal.updated = null;
    signal.set_during_effect = false;
    signal.trace = null;
  }
  return signal;
}
// @__NO_SIDE_EFFECTS__
function state(v, stack2) {
  const s = source(v, stack2);
  push_reaction_value(s);
  return s;
}
// @__NO_SIDE_EFFECTS__
function mutable_source(initial_value, immutable = false, trackable = true) {
  const s = source(initial_value);
  if (!immutable) {
    s.equals = safe_equals;
  }
  if (legacy_mode_flag && trackable && component_context !== null && component_context.l !== null) {
    (component_context.l.s ??= []).push(s);
  }
  return s;
}
function set(source2, value, should_proxy = false) {
  if (active_reaction !== null && // since we are untracking the function inside `$inspect.with` we need to add this check
  // to ensure we error if state is set inside an inspect effect
  (!untracking || (active_reaction.f & EAGER_EFFECT) !== 0) && is_runes() && (active_reaction.f & (DERIVED | BLOCK_EFFECT | ASYNC | EAGER_EFFECT)) !== 0 && (current_sources === null || !current_sources.has(source2))) {
    state_unsafe_mutation();
  }
  let new_value = should_proxy ? proxy(value) : value;
  if (dev_fallback_default) {
    tag_proxy(
      new_value,
      /** @type {string} */
      source2.label
    );
  }
  return internal_set(source2, new_value, legacy_updates);
}
function internal_set(source2, value, updated_during_traversal = null) {
  if (!source2.equals(value)) {
    old_values.set(source2, is_destroying_effect ? value : source2.v);
    var batch = Batch.ensure();
    batch.capture(source2, value);
    if (dev_fallback_default) {
      if (tracing_mode_flag || active_effect !== null) {
        source2.updated ??= /* @__PURE__ */ new Map();
        const count = (source2.updated.get("")?.count ?? 0) + 1;
        source2.updated.set("", { error: (
          /** @type {any} */
          null
        ), count });
        if (tracing_mode_flag || count > 5) {
          const error = get_error("updated at");
          if (error !== null) {
            let entry = source2.updated.get(error.stack);
            if (!entry) {
              entry = { error, count: 0 };
              source2.updated.set(error.stack, entry);
            }
            entry.count++;
          }
        }
      }
      if (active_effect !== null) {
        source2.set_during_effect = true;
      }
    }
    if ((source2.f & DERIVED) !== 0) {
      const derived2 = (
        /** @type {Derived} */
        source2
      );
      if ((source2.f & DIRTY) !== 0) {
        execute_derived(derived2);
      }
      if (batch_values === null) {
        update_derived_status(derived2);
      }
    }
    source2.wv = increment_write_version();
    mark_reactions(source2, DIRTY, updated_during_traversal);
    if (is_runes() && active_effect !== null && (active_effect.f & CLEAN) !== 0 && (active_effect.f & (BRANCH_EFFECT | ROOT_EFFECT)) === 0) {
      if (untracked_writes === null) {
        set_untracked_writes([source2]);
      } else {
        untracked_writes.push(source2);
      }
    }
    if (!batch.is_fork && eager_effects.size > 0 && !eager_effects_deferred) {
      flush_eager_effects();
    }
  }
  return value;
}
function flush_eager_effects() {
  eager_effects_deferred = false;
  for (const effect2 of eager_effects) {
    if ((effect2.f & CLEAN) !== 0) {
      set_signal_status(effect2, MAYBE_DIRTY);
    }
    let dirty;
    try {
      dirty = is_dirty(effect2);
    } catch {
      dirty = true;
    }
    if (dirty) {
      update_effect(effect2);
    }
  }
  eager_effects.clear();
}
function increment(source2) {
  set(source2, source2.v + 1);
}
function mark_reactions(signal, status, updated_during_traversal) {
  var reactions = signal.reactions;
  if (reactions === null) return;
  var runes = is_runes();
  var length = reactions.length;
  for (var i = 0; i < length; i++) {
    var reaction = reactions[i];
    var flags2 = reaction.f;
    if (!runes && reaction === active_effect) continue;
    var not_dirty = (flags2 & DIRTY) === 0;
    if (not_dirty) {
      set_signal_status(reaction, status);
    }
    if ((flags2 & EAGER_EFFECT) !== 0) {
      eager_effects.add(
        /** @type {Effect} */
        reaction
      );
    } else if ((flags2 & DERIVED) !== 0) {
      var derived2 = (
        /** @type {Derived} */
        reaction
      );
      batch_values?.delete(derived2);
      if ((flags2 & WAS_MARKED) === 0) {
        if (flags2 & CONNECTED && (active_effect === null || (active_effect.f & REACTION_IS_UPDATING) === 0)) {
          reaction.f |= WAS_MARKED;
        }
        mark_reactions(derived2, MAYBE_DIRTY, updated_during_traversal);
      }
    } else if (not_dirty) {
      var effect2 = (
        /** @type {Effect} */
        reaction
      );
      if ((flags2 & BLOCK_EFFECT) !== 0 && eager_block_effects !== null) {
        eager_block_effects.add(effect2);
      }
      if (updated_during_traversal !== null) {
        updated_during_traversal.push(effect2);
      } else {
        schedule_effect(effect2);
      }
    }
  }
}

// node_modules/svelte/src/internal/client/proxy.js
var regex_is_valid_identifier = /^[a-zA-Z_$][a-zA-Z_$0-9]*$/;
function proxy(value) {
  if (typeof value !== "object" || value === null || STATE_SYMBOL in value) {
    return value;
  }
  const prototype = get_prototype_of(value);
  if (prototype !== object_prototype && prototype !== array_prototype) {
    return value;
  }
  var sources = /* @__PURE__ */ new Map();
  var is_proxied_array = is_array(value);
  var version = state(0);
  var stack2 = dev_fallback_default && tracing_mode_flag ? get_error("created at") : null;
  var parent_version = update_version;
  var with_parent = (fn) => {
    if (update_version === parent_version) {
      return fn();
    }
    var reaction = active_reaction;
    var version2 = update_version;
    set_active_reaction(null);
    set_update_version(parent_version);
    var result = fn();
    set_active_reaction(reaction);
    set_update_version(version2);
    return result;
  };
  if (is_proxied_array) {
    sources.set("length", state(
      /** @type {any[]} */
      value.length,
      stack2
    ));
    if (dev_fallback_default) {
      value = /** @type {any} */
      inspectable_array(
        /** @type {any[]} */
        value
      );
    }
  }
  var path = "";
  let updating = false;
  function update_path(new_path) {
    if (updating) return;
    updating = true;
    path = new_path;
    tag(version, `${path} version`);
    for (const [prop2, source2] of sources) {
      tag(source2, get_label(path, prop2));
    }
    updating = false;
  }
  return new Proxy(
    /** @type {any} */
    value,
    {
      defineProperty(_, prop2, descriptor) {
        if (!("value" in descriptor) || descriptor.configurable === false || descriptor.enumerable === false || descriptor.writable === false) {
          state_descriptors_fixed();
        }
        var s = sources.get(prop2);
        if (s === void 0) {
          with_parent(() => {
            var s2 = state(descriptor.value, stack2);
            sources.set(prop2, s2);
            if (dev_fallback_default && typeof prop2 === "string") {
              tag(s2, get_label(path, prop2));
            }
            return s2;
          });
        } else {
          set(s, descriptor.value, true);
        }
        return true;
      },
      deleteProperty(target, prop2) {
        var s = sources.get(prop2);
        if (s === void 0) {
          if (prop2 in target) {
            const s2 = with_parent(() => state(UNINITIALIZED, stack2));
            sources.set(prop2, s2);
            increment(version);
            if (dev_fallback_default) {
              tag(s2, get_label(path, prop2));
            }
          }
        } else {
          set(s, UNINITIALIZED);
          increment(version);
        }
        return true;
      },
      get(target, prop2, receiver) {
        if (prop2 === STATE_SYMBOL) {
          return value;
        }
        if (dev_fallback_default && prop2 === PROXY_PATH_SYMBOL) {
          return update_path;
        }
        var s = sources.get(prop2);
        var exists = prop2 in target;
        if (s === void 0 && (!exists || get_descriptor(target, prop2)?.writable)) {
          s = with_parent(() => {
            var p = proxy(exists ? target[prop2] : UNINITIALIZED);
            var s2 = state(p, stack2);
            if (dev_fallback_default) {
              tag(s2, get_label(path, prop2));
            }
            return s2;
          });
          sources.set(prop2, s);
        }
        if (s !== void 0) {
          var v = get2(s);
          return v === UNINITIALIZED ? void 0 : v;
        }
        return Reflect.get(target, prop2, receiver);
      },
      getOwnPropertyDescriptor(target, prop2) {
        var descriptor = Reflect.getOwnPropertyDescriptor(target, prop2);
        if (descriptor && "value" in descriptor) {
          var s = sources.get(prop2);
          if (s) descriptor.value = get2(s);
        } else if (descriptor === void 0) {
          var source2 = sources.get(prop2);
          var value2 = source2?.v;
          if (source2 !== void 0 && value2 !== UNINITIALIZED) {
            return {
              enumerable: true,
              configurable: true,
              value: value2,
              writable: true
            };
          }
        }
        return descriptor;
      },
      has(target, prop2) {
        if (prop2 === STATE_SYMBOL) {
          return true;
        }
        var s = sources.get(prop2);
        var has = s !== void 0 && s.v !== UNINITIALIZED || Reflect.has(target, prop2);
        if (s !== void 0 || active_effect !== null && (!has || get_descriptor(target, prop2)?.writable)) {
          if (s === void 0) {
            s = with_parent(() => {
              var p = has ? proxy(target[prop2]) : UNINITIALIZED;
              var s2 = state(p, stack2);
              if (dev_fallback_default) {
                tag(s2, get_label(path, prop2));
              }
              return s2;
            });
            sources.set(prop2, s);
          }
          var value2 = get2(s);
          if (value2 === UNINITIALIZED) {
            return false;
          }
        }
        return has;
      },
      set(target, prop2, value2, receiver) {
        var s = sources.get(prop2);
        var has = prop2 in target;
        if (is_proxied_array && prop2 === "length") {
          for (var i = value2; i < /** @type {Source<number>} */
          s.v; i += 1) {
            var other_s = sources.get(i + "");
            if (other_s !== void 0) {
              set(other_s, UNINITIALIZED);
            } else if (i in target) {
              other_s = with_parent(() => state(UNINITIALIZED, stack2));
              sources.set(i + "", other_s);
              if (dev_fallback_default) {
                tag(other_s, get_label(path, i));
              }
            }
          }
        }
        if (s === void 0) {
          if (!has || get_descriptor(target, prop2)?.writable) {
            s = with_parent(() => state(void 0, stack2));
            if (dev_fallback_default) {
              tag(s, get_label(path, prop2));
            }
            set(s, proxy(value2));
            sources.set(prop2, s);
          }
        } else {
          has = s.v !== UNINITIALIZED;
          var p = with_parent(() => proxy(value2));
          set(s, p);
        }
        var descriptor = Reflect.getOwnPropertyDescriptor(target, prop2);
        if (descriptor?.set) {
          descriptor.set.call(receiver, value2);
        }
        if (!has) {
          if (is_proxied_array && typeof prop2 === "string") {
            var ls = (
              /** @type {Source<number>} */
              sources.get("length")
            );
            var n = Number(prop2);
            if (Number.isInteger(n) && n >= ls.v) {
              set(ls, n + 1);
            }
          }
          increment(version);
        }
        return true;
      },
      ownKeys(target) {
        get2(version);
        var own_keys = Reflect.ownKeys(target).filter((key3) => {
          var source3 = sources.get(key3);
          return source3 === void 0 || source3.v !== UNINITIALIZED;
        });
        for (var [key2, source2] of sources) {
          if (source2.v !== UNINITIALIZED && !(key2 in target)) {
            own_keys.push(key2);
          }
        }
        return own_keys;
      },
      setPrototypeOf() {
        state_prototype_fixed();
      }
    }
  );
}
function get_label(path, prop2) {
  if (typeof prop2 === "symbol") return `${path}[Symbol(${prop2.description ?? ""})]`;
  if (regex_is_valid_identifier.test(prop2)) return `${path}.${prop2}`;
  return /^\d+$/.test(prop2) ? `${path}[${prop2}]` : `${path}['${prop2}']`;
}
function get_proxied_value(value) {
  try {
    if (value !== null && typeof value === "object" && STATE_SYMBOL in value) {
      return value[STATE_SYMBOL];
    }
  } catch {
  }
  return value;
}
function is(a, b) {
  return Object.is(get_proxied_value(a), get_proxied_value(b));
}
var ARRAY_MUTATING_METHODS = /* @__PURE__ */ new Set([
  "copyWithin",
  "fill",
  "pop",
  "push",
  "reverse",
  "shift",
  "sort",
  "splice",
  "unshift"
]);
function inspectable_array(array) {
  return new Proxy(array, {
    get(target, prop2, receiver) {
      var value = Reflect.get(target, prop2, receiver);
      if (!ARRAY_MUTATING_METHODS.has(
        /** @type {string} */
        prop2
      )) {
        return value;
      }
      return function(...args) {
        set_eager_effects_deferred();
        var result = value.apply(this, args);
        flush_eager_effects();
        return result;
      };
    }
  });
}

// node_modules/svelte/src/internal/client/dev/equality.js
function init_array_prototype_warnings() {
  const array_prototype2 = Array.prototype;
  const cleanup = Array.__svelte_cleanup;
  if (cleanup) {
    cleanup();
  }
  const { indexOf, lastIndexOf, includes: includes2 } = array_prototype2;
  array_prototype2.indexOf = function(item, from_index) {
    const index2 = indexOf.call(this, item, from_index);
    if (index2 === -1) {
      for (let i = from_index ?? 0; i < this.length; i += 1) {
        if (get_proxied_value(this[i]) === item) {
          state_proxy_equality_mismatch("array.indexOf(...)");
          break;
        }
      }
    }
    return index2;
  };
  array_prototype2.lastIndexOf = function(item, from_index) {
    const index2 = lastIndexOf.call(this, item, from_index ?? this.length - 1);
    if (index2 === -1) {
      for (let i = 0; i <= (from_index ?? this.length - 1); i += 1) {
        if (get_proxied_value(this[i]) === item) {
          state_proxy_equality_mismatch("array.lastIndexOf(...)");
          break;
        }
      }
    }
    return index2;
  };
  array_prototype2.includes = function(item, from_index) {
    const has = includes2.call(this, item, from_index);
    if (!has) {
      for (let i = 0; i < this.length; i += 1) {
        if (get_proxied_value(this[i]) === item) {
          state_proxy_equality_mismatch("array.includes(...)");
          break;
        }
      }
    }
    return has;
  };
  Array.__svelte_cleanup = () => {
    array_prototype2.indexOf = indexOf;
    array_prototype2.lastIndexOf = lastIndexOf;
    array_prototype2.includes = includes2;
  };
}

// node_modules/svelte/src/internal/client/dom/operations.js
var $window;
var $document;
var is_firefox;
var first_child_getter;
var next_sibling_getter;
function init_operations() {
  if ($window !== void 0) {
    return;
  }
  $window = window;
  $document = document;
  is_firefox = /Firefox/.test(navigator.userAgent);
  var element_prototype = Element.prototype;
  var node_prototype = Node.prototype;
  var text_prototype = Text.prototype;
  first_child_getter = get_descriptor(node_prototype, "firstChild").get;
  next_sibling_getter = get_descriptor(node_prototype, "nextSibling").get;
  if (is_extensible(element_prototype)) {
    element_prototype[CLASS_CACHE] = void 0;
    element_prototype[ATTRIBUTES_CACHE] = null;
    element_prototype[STYLE_CACHE] = void 0;
    element_prototype.__e = void 0;
  }
  if (is_extensible(text_prototype)) {
    text_prototype[TEXT_CACHE] = void 0;
  }
  if (dev_fallback_default) {
    element_prototype.__svelte_meta = null;
    init_array_prototype_warnings();
  }
}
function create_text(value = "") {
  return document.createTextNode(value);
}
// @__NO_SIDE_EFFECTS__
function get_first_child(node) {
  return (
    /** @type {TemplateNode | null} */
    first_child_getter.call(node)
  );
}
// @__NO_SIDE_EFFECTS__
function get_next_sibling(node) {
  return (
    /** @type {TemplateNode | null} */
    next_sibling_getter.call(node)
  );
}
function child(node, is_text) {
  if (!hydrating) {
    return /* @__PURE__ */ get_first_child(node);
  }
  var child2 = /* @__PURE__ */ get_first_child(hydrate_node);
  if (child2 === null) {
    child2 = hydrate_node.appendChild(create_text());
  } else if (is_text && child2.nodeType !== TEXT_NODE) {
    var text2 = create_text();
    child2?.before(text2);
    set_hydrate_node(text2);
    return text2;
  }
  if (is_text) {
    merge_text_nodes(
      /** @type {Text} */
      child2
    );
  }
  set_hydrate_node(child2);
  return child2;
}
function first_child(node, is_text = false) {
  if (!hydrating) {
    var first = /* @__PURE__ */ get_first_child(node);
    if (first instanceof Comment && first.data === "") return /* @__PURE__ */ get_next_sibling(first);
    return first;
  }
  if (is_text) {
    if (hydrate_node?.nodeType !== TEXT_NODE) {
      var text2 = create_text();
      hydrate_node?.before(text2);
      set_hydrate_node(text2);
      return text2;
    }
    merge_text_nodes(
      /** @type {Text} */
      hydrate_node
    );
  }
  return hydrate_node;
}
function sibling(node, count = 1, is_text = false) {
  let next_sibling = hydrating ? hydrate_node : node;
  var last_sibling;
  while (count--) {
    last_sibling = next_sibling;
    next_sibling = /** @type {TemplateNode} */
    /* @__PURE__ */ get_next_sibling(next_sibling);
  }
  if (!hydrating) {
    return next_sibling;
  }
  if (is_text) {
    if (next_sibling?.nodeType !== TEXT_NODE) {
      var text2 = create_text();
      if (next_sibling === null) {
        last_sibling?.after(text2);
      } else {
        next_sibling.before(text2);
      }
      set_hydrate_node(text2);
      return text2;
    }
    merge_text_nodes(
      /** @type {Text} */
      next_sibling
    );
  }
  set_hydrate_node(next_sibling);
  return next_sibling;
}
function clear_text_content(node) {
  node.textContent = "";
}
function should_defer_append() {
  if (!async_mode_flag) return false;
  if (eager_block_effects !== null) return false;
  var flags2 = (
    /** @type {Effect} */
    active_effect.f
  );
  return (flags2 & REACTION_RAN) !== 0;
}
function create_element(tag2, namespace, is2) {
  if (namespace == null || namespace === NAMESPACE_HTML) {
    return (
      /** @type {T extends keyof HTMLElementTagNameMap ? HTMLElementTagNameMap[T] : Element} */
      is2 ? document.createElement(tag2, { is: is2 }) : document.createElement(tag2)
    );
  }
  return (
    /** @type {T extends keyof HTMLElementTagNameMap ? HTMLElementTagNameMap[T] : Element} */
    is2 ? document.createElementNS(namespace, tag2, { is: is2 }) : document.createElementNS(namespace, tag2)
  );
}
function merge_text_nodes(text2) {
  if (
    /** @type {string} */
    text2.nodeValue.length < 65536
  ) {
    return;
  }
  let next2 = text2.nextSibling;
  while (next2 !== null && next2.nodeType === TEXT_NODE) {
    next2.remove();
    text2.nodeValue += /** @type {string} */
    next2.nodeValue;
    next2 = text2.nextSibling;
  }
}

// node_modules/svelte/src/internal/client/dom/elements/misc.js
var listening_to_form_reset = false;
function add_form_reset_listener() {
  if (!listening_to_form_reset) {
    listening_to_form_reset = true;
    document.addEventListener(
      "reset",
      (evt) => {
        Promise.resolve().then(() => {
          if (!evt.defaultPrevented) {
            for (
              const e of
              /**@type {HTMLFormElement} */
              evt.target.elements
            ) {
              e[FORM_RESET_HANDLER]?.();
            }
          }
        });
      },
      // In the capture phase to guarantee we get noticed of it (no possibility of stopPropagation)
      { capture: true }
    );
  }
}

// node_modules/svelte/src/internal/client/dom/elements/bindings/shared.js
function without_reactive_context(fn) {
  var previous_reaction = active_reaction;
  var previous_effect = active_effect;
  set_active_reaction(null);
  set_active_effect(null);
  try {
    return fn();
  } finally {
    set_active_reaction(previous_reaction);
    set_active_effect(previous_effect);
  }
}
function listen_to_event_and_reset_event(element2, event2, handler, on_reset = handler) {
  element2.addEventListener(event2, () => without_reactive_context(handler));
  const prev = (
    /** @type {any} */
    element2[FORM_RESET_HANDLER]
  );
  if (prev) {
    element2[FORM_RESET_HANDLER] = () => {
      prev();
      on_reset(true);
    };
  } else {
    element2[FORM_RESET_HANDLER] = () => on_reset(true);
  }
  add_form_reset_listener();
}

// node_modules/svelte/src/internal/client/reactivity/effects.js
function validate_effect(rune) {
  if (active_effect === null) {
    if (active_reaction === null) {
      effect_orphan(rune);
    }
    effect_in_unowned_derived();
  }
  if (is_destroying_effect) {
    effect_in_teardown(rune);
  }
}
function push_effect(effect2, parent_effect) {
  var parent_last = parent_effect.last;
  if (parent_last === null) {
    parent_effect.last = parent_effect.first = effect2;
  } else {
    parent_last.next = effect2;
    effect2.prev = parent_last;
    parent_effect.last = effect2;
  }
}
function create_effect(type, fn) {
  var parent = active_effect;
  if (dev_fallback_default) {
    while (parent !== null && (parent.f & EAGER_EFFECT) !== 0) {
      parent = parent.parent;
    }
  }
  if (parent !== null && (parent.f & INERT) !== 0) {
    type |= INERT;
  }
  var effect2 = {
    ctx: component_context,
    deps: null,
    nodes: null,
    f: type | DIRTY | CONNECTED,
    first: null,
    fn,
    last: null,
    next: null,
    parent,
    b: parent && parent.b,
    prev: null,
    teardown: null,
    wv: 0,
    ac: null
  };
  if (dev_fallback_default) {
    effect2.component_function = dev_current_component_function;
  }
  current_batch?.register_created_effect(effect2);
  var e = effect2;
  if ((type & EFFECT) !== 0) {
    if (collected_effects !== null) {
      collected_effects.push(effect2);
    } else {
      Batch.ensure().schedule(effect2);
    }
  } else if (fn !== null) {
    try {
      update_effect(effect2);
    } catch (e2) {
      destroy_effect(effect2);
      throw e2;
    }
    if (e.deps === null && e.teardown === null && e.nodes === null && e.first === e.last && // either `null`, or a singular child
    (e.f & EFFECT_PRESERVED) === 0) {
      e = e.first;
      if ((type & BLOCK_EFFECT) !== 0 && (type & EFFECT_TRANSPARENT) !== 0 && e !== null) {
        e.f |= EFFECT_TRANSPARENT;
      }
    }
  }
  if (e !== null) {
    e.parent = parent;
    if (parent !== null) {
      push_effect(e, parent);
    }
    if (active_reaction !== null && (active_reaction.f & DERIVED) !== 0 && (type & ROOT_EFFECT) === 0) {
      var derived2 = (
        /** @type {Derived} */
        active_reaction
      );
      (derived2.effects ??= []).push(e);
    }
  }
  return effect2;
}
function effect_tracking() {
  return active_reaction !== null && !untracking;
}
function teardown(fn) {
  const effect2 = create_effect(RENDER_EFFECT, null);
  set_signal_status(effect2, CLEAN);
  effect2.teardown = fn;
  return effect2;
}
function user_effect(fn) {
  validate_effect("$effect");
  if (dev_fallback_default) {
    define_property(fn, "name", {
      value: "$effect"
    });
  }
  var flags2 = (
    /** @type {Effect} */
    active_effect.f
  );
  var defer = !active_reaction && (flags2 & BRANCH_EFFECT) !== 0 && component_context !== null && !component_context.i;
  if (defer) {
    var context = (
      /** @type {ComponentContext} */
      component_context
    );
    (context.e ??= []).push(fn);
  } else {
    return create_user_effect(fn);
  }
}
function create_user_effect(fn) {
  return create_effect(EFFECT | USER_EFFECT, fn);
}
function effect_root(fn) {
  Batch.ensure();
  const effect2 = create_effect(ROOT_EFFECT | EFFECT_PRESERVED, fn);
  return () => {
    destroy_effect(effect2);
  };
}
function component_root(fn) {
  Batch.ensure();
  const effect2 = create_effect(ROOT_EFFECT | EFFECT_PRESERVED, fn);
  return (options = {}) => {
    return new Promise((fulfil) => {
      if (options.outro) {
        pause_effect(effect2, () => {
          destroy_effect(effect2);
          fulfil(void 0);
        });
      } else {
        destroy_effect(effect2);
        fulfil(void 0);
      }
    });
  };
}
function effect(fn) {
  return create_effect(EFFECT, fn);
}
function async_effect(fn) {
  return create_effect(ASYNC | EFFECT_PRESERVED, fn);
}
function render_effect(fn, flags2 = 0) {
  return create_effect(RENDER_EFFECT | flags2, fn);
}
function template_effect(fn, sync = [], async2 = [], blockers = []) {
  flatten(blockers, sync, async2, (values) => {
    create_effect(RENDER_EFFECT, () => {
      fn(...values.map(get2));
    });
  });
}
function block(fn, flags2 = 0) {
  var effect2 = create_effect(BLOCK_EFFECT | flags2, fn);
  if (dev_fallback_default) {
    effect2.dev_stack = dev_stack;
  }
  return effect2;
}
function branch(fn) {
  return create_effect(BRANCH_EFFECT | EFFECT_PRESERVED, fn);
}
function execute_effect_teardown(effect2) {
  var teardown2 = effect2.teardown;
  if (teardown2 !== null) {
    const previously_destroying_effect = is_destroying_effect;
    const previous_reaction = active_reaction;
    set_is_destroying_effect(true);
    set_active_reaction(null);
    try {
      teardown2.call(null);
    } finally {
      set_is_destroying_effect(previously_destroying_effect);
      set_active_reaction(previous_reaction);
    }
  }
}
function destroy_effect_children(signal, remove_dom = false) {
  var effect2 = signal.first;
  signal.first = signal.last = null;
  while (effect2 !== null) {
    const controller = effect2.ac;
    if (controller !== null) {
      without_reactive_context(() => {
        controller.abort(STALE_REACTION);
      });
    }
    var next2 = effect2.next;
    if ((effect2.f & ROOT_EFFECT) !== 0) {
      effect2.parent = null;
    } else {
      destroy_effect(effect2, remove_dom);
    }
    effect2 = next2;
  }
}
function destroy_block_effect_children(signal) {
  var effect2 = signal.first;
  while (effect2 !== null) {
    var next2 = effect2.next;
    if ((effect2.f & BRANCH_EFFECT) === 0) {
      destroy_effect(effect2);
    }
    effect2 = next2;
  }
}
function destroy_effect(effect2, remove_dom = true) {
  var removed = false;
  if ((remove_dom || (effect2.f & HEAD_EFFECT) !== 0) && effect2.nodes !== null && effect2.nodes.end !== null) {
    remove_effect_dom(
      effect2.nodes.start,
      /** @type {TemplateNode} */
      effect2.nodes.end
    );
    removed = true;
  }
  effect2.f |= DESTROYING;
  destroy_effect_children(effect2, remove_dom && !removed);
  remove_reactions(effect2, 0);
  var transitions = effect2.nodes && effect2.nodes.t;
  if (transitions !== null) {
    for (const transition2 of transitions) {
      transition2.stop();
    }
  }
  execute_effect_teardown(effect2);
  effect2.f ^= DESTROYING;
  effect2.f |= DESTROYED;
  var parent = effect2.parent;
  if (parent !== null && parent.first !== null) {
    unlink_effect(effect2);
  }
  if (dev_fallback_default) {
    effect2.component_function = null;
  }
  effect2.next = effect2.prev = effect2.teardown = effect2.ctx = effect2.deps = effect2.fn = effect2.nodes = effect2.ac = effect2.b = null;
}
function remove_effect_dom(node, end) {
  while (node !== null) {
    var next2 = node === end ? null : get_next_sibling(node);
    node.remove();
    node = next2;
  }
}
function unlink_effect(effect2) {
  var parent = effect2.parent;
  var prev = effect2.prev;
  var next2 = effect2.next;
  if (prev !== null) prev.next = next2;
  if (next2 !== null) next2.prev = prev;
  if (parent !== null) {
    if (parent.first === effect2) parent.first = next2;
    if (parent.last === effect2) parent.last = prev;
  }
}
function pause_effect(effect2, callback, destroy = true) {
  var transitions = [];
  pause_children(effect2, transitions, true);
  var fn = () => {
    if (destroy) destroy_effect(effect2);
    if (callback) callback();
  };
  var remaining = transitions.length;
  if (remaining > 0) {
    var check = () => --remaining || fn();
    for (var transition2 of transitions) {
      transition2.out(check);
    }
  } else {
    fn();
  }
}
function pause_children(effect2, transitions, local) {
  if ((effect2.f & INERT) !== 0) return;
  effect2.f ^= INERT;
  var t = effect2.nodes && effect2.nodes.t;
  if (t !== null) {
    for (const transition2 of t) {
      if (transition2.is_global || local) {
        transitions.push(transition2);
      }
    }
  }
  var child2 = effect2.first;
  while (child2 !== null) {
    var sibling2 = child2.next;
    if ((child2.f & ROOT_EFFECT) === 0) {
      var transparent = (child2.f & EFFECT_TRANSPARENT) !== 0 || // If this is a branch effect without a block effect parent,
      // it means the parent block effect was pruned. In that case,
      // transparency information was transferred to the branch effect.
      (child2.f & BRANCH_EFFECT) !== 0 && (effect2.f & BLOCK_EFFECT) !== 0;
      pause_children(child2, transitions, transparent ? local : false);
    }
    child2 = sibling2;
  }
}
function resume_effect(effect2) {
  resume_children(effect2, true);
}
function resume_children(effect2, local) {
  if ((effect2.f & INERT) === 0) return;
  effect2.f ^= INERT;
  if ((effect2.f & CLEAN) === 0) {
    set_signal_status(effect2, DIRTY);
    Batch.ensure().schedule(effect2);
  }
  var child2 = effect2.first;
  while (child2 !== null) {
    var sibling2 = child2.next;
    var transparent = (child2.f & EFFECT_TRANSPARENT) !== 0 || (child2.f & BRANCH_EFFECT) !== 0;
    resume_children(child2, transparent ? local : false);
    child2 = sibling2;
  }
  var t = effect2.nodes && effect2.nodes.t;
  if (t !== null) {
    for (const transition2 of t) {
      if (transition2.is_global || local) {
        transition2.in();
      }
    }
  }
}
function move_effect(effect2, fragment) {
  if (!effect2.nodes) return;
  var node = effect2.nodes.start;
  var end = effect2.nodes.end;
  while (node !== null) {
    var next2 = node === end ? null : get_next_sibling(node);
    fragment.append(node);
    node = next2;
  }
}

// node_modules/svelte/src/internal/client/legacy.js
var captured_signals = null;

// node_modules/svelte/src/internal/client/runtime.js
var is_updating_effect = false;
var is_destroying_effect = false;
function set_is_destroying_effect(value) {
  is_destroying_effect = value;
}
var active_reaction = null;
var untracking = false;
function set_active_reaction(reaction) {
  active_reaction = reaction;
}
var active_effect = null;
function set_active_effect(effect2) {
  active_effect = effect2;
}
var current_sources = null;
function push_reaction_value(value) {
  if (active_reaction !== null && (!async_mode_flag || (active_reaction.f & DERIVED) !== 0)) {
    (current_sources ??= /* @__PURE__ */ new Set()).add(value);
  }
}
var new_deps = null;
var skipped_deps = 0;
var untracked_writes = null;
function set_untracked_writes(value) {
  untracked_writes = value;
}
var write_version = 1;
var read_version = 0;
var update_version = read_version;
function set_update_version(value) {
  update_version = value;
}
function increment_write_version() {
  return ++write_version;
}
function is_dirty(reaction) {
  var flags2 = reaction.f;
  if ((flags2 & DIRTY) !== 0) {
    return true;
  }
  if (flags2 & DERIVED) {
    reaction.f &= ~WAS_MARKED;
  }
  if ((flags2 & MAYBE_DIRTY) !== 0) {
    var dependencies = (
      /** @type {Value[]} */
      reaction.deps
    );
    var length = dependencies.length;
    for (var i = 0; i < length; i++) {
      var dependency = dependencies[i];
      if (is_dirty(
        /** @type {Derived} */
        dependency
      )) {
        update_derived(
          /** @type {Derived} */
          dependency
        );
      }
      if (dependency.wv > reaction.wv) {
        return true;
      }
    }
    if ((flags2 & CONNECTED) !== 0 && // During time traveling we don't want to reset the status so that
    // traversal of the graph in the other batches still happens
    batch_values === null) {
      set_signal_status(reaction, CLEAN);
    }
  }
  return false;
}
function schedule_possible_effect_self_invalidation(signal, effect2, root9 = true) {
  var reactions = signal.reactions;
  if (reactions === null) return;
  if (!async_mode_flag && current_sources !== null && current_sources.has(signal)) {
    return;
  }
  for (var i = 0; i < reactions.length; i++) {
    var reaction = reactions[i];
    if ((reaction.f & DERIVED) !== 0) {
      schedule_possible_effect_self_invalidation(
        /** @type {Derived} */
        reaction,
        effect2,
        false
      );
    } else if (effect2 === reaction) {
      if (root9) {
        set_signal_status(reaction, DIRTY);
      } else if ((reaction.f & CLEAN) !== 0) {
        set_signal_status(reaction, MAYBE_DIRTY);
      }
      schedule_effect(
        /** @type {Effect} */
        reaction
      );
    }
  }
}
function update_reaction(reaction) {
  var previous_deps = new_deps;
  var previous_skipped_deps = skipped_deps;
  var previous_untracked_writes = untracked_writes;
  var previous_reaction = active_reaction;
  var previous_sources = current_sources;
  var previous_component_context = component_context;
  var previous_untracking = untracking;
  var previous_update_version = update_version;
  var flags2 = reaction.f;
  new_deps = /** @type {null | Value[]} */
  null;
  skipped_deps = 0;
  untracked_writes = null;
  active_reaction = (flags2 & (BRANCH_EFFECT | ROOT_EFFECT)) === 0 ? reaction : null;
  current_sources = null;
  set_component_context(reaction.ctx);
  untracking = false;
  update_version = ++read_version;
  if (reaction.ac !== null) {
    without_reactive_context(() => {
      reaction.ac.abort(STALE_REACTION);
    });
    reaction.ac = null;
  }
  try {
    reaction.f |= REACTION_IS_UPDATING;
    var fn = (
      /** @type {Function} */
      reaction.fn
    );
    var result = fn();
    reaction.f |= REACTION_RAN;
    var deps = reaction.deps;
    var is_fork = current_batch?.is_fork;
    if (new_deps !== null) {
      var i;
      if (!is_fork) {
        remove_reactions(reaction, skipped_deps);
      }
      if (deps !== null && skipped_deps > 0) {
        deps.length = skipped_deps + new_deps.length;
        for (i = 0; i < new_deps.length; i++) {
          deps[skipped_deps + i] = new_deps[i];
        }
      } else {
        reaction.deps = deps = new_deps;
      }
      if (effect_tracking() && (reaction.f & CONNECTED) !== 0) {
        for (i = skipped_deps; i < deps.length; i++) {
          (deps[i].reactions ??= []).push(reaction);
        }
      }
    } else if (!is_fork && deps !== null && skipped_deps < deps.length) {
      remove_reactions(reaction, skipped_deps);
      deps.length = skipped_deps;
    }
    if (is_runes() && untracked_writes !== null && !untracking && deps !== null && (reaction.f & (DERIVED | MAYBE_DIRTY | DIRTY)) === 0) {
      for (i = 0; i < /** @type {Source[]} */
      untracked_writes.length; i++) {
        schedule_possible_effect_self_invalidation(
          untracked_writes[i],
          /** @type {Effect} */
          reaction
        );
      }
    }
    if (previous_reaction !== null && previous_reaction !== reaction) {
      read_version++;
      if (previous_reaction.deps !== null) {
        for (let i2 = 0; i2 < previous_skipped_deps; i2 += 1) {
          previous_reaction.deps[i2].rv = read_version;
        }
      }
      if (previous_deps !== null) {
        for (const dep of previous_deps) {
          dep.rv = read_version;
        }
      }
      if (untracked_writes !== null) {
        if (previous_untracked_writes === null) {
          previous_untracked_writes = untracked_writes;
        } else {
          previous_untracked_writes.push(.../** @type {Source[]} */
          untracked_writes);
        }
      }
    }
    if ((reaction.f & ERROR_VALUE) !== 0) {
      reaction.f ^= ERROR_VALUE;
    }
    return result;
  } catch (error) {
    return handle_error(error);
  } finally {
    reaction.f ^= REACTION_IS_UPDATING;
    new_deps = previous_deps;
    skipped_deps = previous_skipped_deps;
    untracked_writes = previous_untracked_writes;
    active_reaction = previous_reaction;
    current_sources = previous_sources;
    set_component_context(previous_component_context);
    untracking = previous_untracking;
    update_version = previous_update_version;
  }
}
function remove_reaction(signal, dependency) {
  let reactions = dependency.reactions;
  if (reactions !== null) {
    var index2 = index_of.call(reactions, signal);
    if (index2 !== -1) {
      var new_length = reactions.length - 1;
      if (new_length === 0) {
        reactions = dependency.reactions = null;
      } else {
        reactions[index2] = reactions[new_length];
        reactions.pop();
      }
    }
  }
  if (reactions === null && (dependency.f & DERIVED) !== 0 && // Destroying a child effect while updating a parent effect can cause a dependency to appear
  // to be unused, when in fact it is used by the currently-updating parent. Checking `new_deps`
  // allows us to skip the expensive work of disconnecting and immediately reconnecting it
  (new_deps === null || !includes.call(new_deps, dependency))) {
    var derived2 = (
      /** @type {Derived} */
      dependency
    );
    if ((derived2.f & CONNECTED) !== 0) {
      derived2.f ^= CONNECTED;
      derived2.f &= ~WAS_MARKED;
    }
    if (derived2.v !== UNINITIALIZED) {
      update_derived_status(derived2);
    }
    freeze_derived_effects(derived2);
    remove_reactions(derived2, 0);
  }
}
function remove_reactions(signal, start_index) {
  var dependencies = signal.deps;
  if (dependencies === null) return;
  for (var i = start_index; i < dependencies.length; i++) {
    remove_reaction(signal, dependencies[i]);
  }
}
function update_effect(effect2) {
  var flags2 = effect2.f;
  if ((flags2 & DESTROYED) !== 0) {
    return;
  }
  set_signal_status(effect2, CLEAN);
  var previous_effect = active_effect;
  var was_updating_effect = is_updating_effect;
  active_effect = effect2;
  is_updating_effect = true;
  if (dev_fallback_default) {
    var previous_component_fn = dev_current_component_function;
    set_dev_current_component_function(effect2.component_function);
    var previous_stack = (
      /** @type {any} */
      dev_stack
    );
    set_dev_stack(effect2.dev_stack ?? dev_stack);
  }
  try {
    if ((flags2 & (BLOCK_EFFECT | MANAGED_EFFECT)) !== 0) {
      destroy_block_effect_children(effect2);
    } else {
      destroy_effect_children(effect2);
    }
    execute_effect_teardown(effect2);
    var teardown2 = update_reaction(effect2);
    effect2.teardown = typeof teardown2 === "function" ? teardown2 : null;
    effect2.wv = write_version;
    if (dev_fallback_default && tracing_mode_flag && (effect2.f & DIRTY) !== 0 && effect2.deps !== null) {
      for (var dep of effect2.deps) {
        if (dep.set_during_effect) {
          dep.wv = increment_write_version();
          dep.set_during_effect = false;
        }
      }
    }
  } finally {
    is_updating_effect = was_updating_effect;
    active_effect = previous_effect;
    if (dev_fallback_default) {
      set_dev_current_component_function(previous_component_fn);
      set_dev_stack(previous_stack);
    }
  }
}
async function tick() {
  if (async_mode_flag) {
    return new Promise((f) => {
      requestAnimationFrame(() => f());
      setTimeout(() => f());
    });
  }
  await Promise.resolve();
  flushSync();
}
function get2(signal) {
  var flags2 = signal.f;
  var is_derived = (flags2 & DERIVED) !== 0;
  captured_signals?.add(signal);
  if (active_reaction !== null && !untracking) {
    var destroyed = active_effect !== null && (active_effect.f & DESTROYED) !== 0;
    if (!destroyed && (current_sources === null || !current_sources.has(signal))) {
      var deps = active_reaction.deps;
      if ((active_reaction.f & REACTION_IS_UPDATING) !== 0) {
        if (signal.rv < read_version) {
          signal.rv = read_version;
          if (new_deps === null && deps !== null && deps[skipped_deps] === signal) {
            skipped_deps++;
          } else if (new_deps === null) {
            new_deps = [signal];
          } else {
            new_deps.push(signal);
          }
        }
      } else {
        active_reaction.deps ??= [];
        if (!includes.call(active_reaction.deps, signal)) {
          active_reaction.deps.push(signal);
        }
        var reactions = signal.reactions;
        if (reactions === null) {
          signal.reactions = [active_reaction];
        } else if (!includes.call(reactions, active_reaction)) {
          reactions.push(active_reaction);
        }
      }
    }
  }
  if (dev_fallback_default) {
    if (!untracking && reactivity_loss_tracker && // By checking that current/previous batch are null we filter out false positives.
    // reactivity_loss_tracker is only reset after a microtask, so if a flush happens
    // before that, we get warnings for things we shouldn't warn on.
    current_batch === null && previous_batch === null && !reactivity_loss_tracker.warned && (reactivity_loss_tracker.effect.f & REACTION_IS_UPDATING) === 0 && !reactivity_loss_tracker.effect_deps.has(signal)) {
      reactivity_loss_tracker.warned = true;
      await_reactivity_loss(
        /** @type {string} */
        signal.label
      );
      var trace2 = get_error("traced at");
      if (trace2) console.warn(trace2);
    }
    recent_async_deriveds.delete(signal);
    if (tracing_mode_flag && !untracking && tracing_expressions !== null && active_reaction !== null && tracing_expressions.reaction === active_reaction) {
      if (signal.trace) {
        signal.trace();
      } else {
        trace2 = get_error("traced at");
        if (trace2) {
          var entry = tracing_expressions.entries.get(signal);
          if (entry === void 0) {
            entry = { traces: [] };
            tracing_expressions.entries.set(signal, entry);
          }
          var last = entry.traces[entry.traces.length - 1];
          if (trace2.stack !== last?.stack) {
            entry.traces.push(trace2);
          }
        }
      }
    }
  }
  if (is_destroying_effect && old_values.has(signal)) {
    return old_values.get(signal);
  }
  if (is_derived) {
    var derived2 = (
      /** @type {Derived} */
      signal
    );
    if (is_destroying_effect) {
      var value = derived2.v;
      if ((derived2.f & CLEAN) === 0 && derived2.reactions !== null || depends_on_old_values(derived2)) {
        value = execute_derived(derived2);
      }
      old_values.set(derived2, value);
      return value;
    }
    var should_connect = (derived2.f & CONNECTED) === 0 && !untracking && active_reaction !== null && (is_updating_effect || (active_reaction.f & CONNECTED) !== 0);
    var is_new = (derived2.f & REACTION_RAN) === 0;
    if (is_dirty(derived2)) {
      if (should_connect) {
        derived2.f |= CONNECTED;
      }
      update_derived(derived2);
    }
    if (should_connect && !is_new) {
      unfreeze_derived_effects(derived2);
      reconnect(derived2);
    }
  }
  if (batch_values?.has(signal)) {
    return batch_values.get(signal);
  }
  if ((signal.f & ERROR_VALUE) !== 0) {
    throw signal.v;
  }
  return signal.v;
}
function reconnect(derived2) {
  derived2.f |= CONNECTED;
  if (derived2.deps === null) return;
  for (const dep of derived2.deps) {
    (dep.reactions ??= []).push(derived2);
    if ((dep.f & DERIVED) !== 0 && (dep.f & CONNECTED) === 0) {
      unfreeze_derived_effects(
        /** @type {Derived} */
        dep
      );
      reconnect(
        /** @type {Derived} */
        dep
      );
    }
  }
}
function depends_on_old_values(derived2) {
  if (derived2.v === UNINITIALIZED) return true;
  if (derived2.deps === null) return false;
  for (const dep of derived2.deps) {
    if (old_values.has(dep)) {
      return true;
    }
    if ((dep.f & DERIVED) !== 0 && depends_on_old_values(
      /** @type {Derived} */
      dep
    )) {
      return true;
    }
  }
  return false;
}
function untrack(fn) {
  var previous_untracking = untracking;
  try {
    untracking = true;
    return fn();
  } finally {
    untracking = previous_untracking;
  }
}
function deep_read_state(value) {
  if (typeof value !== "object" || !value || value instanceof EventTarget) {
    return;
  }
  if (STATE_SYMBOL in value) {
    deep_read(value);
  } else if (!Array.isArray(value)) {
    for (let key2 in value) {
      const prop2 = value[key2];
      if (typeof prop2 === "object" && prop2 && STATE_SYMBOL in prop2) {
        deep_read(prop2);
      }
    }
  }
}
function deep_read(value, visited = /* @__PURE__ */ new Set()) {
  if (typeof value === "object" && value !== null && // We don't want to traverse DOM elements
  !(value instanceof EventTarget) && !visited.has(value)) {
    visited.add(value);
    if (value instanceof Date) {
      value.getTime();
    }
    for (let key2 in value) {
      try {
        deep_read(value[key2], visited);
      } catch (e) {
      }
    }
    const proto = get_prototype_of(value);
    if (proto !== Object.prototype && proto !== Array.prototype && proto !== Map.prototype && proto !== Set.prototype && proto !== Date.prototype) {
      const descriptors = get_descriptors(proto);
      for (let key2 in descriptors) {
        const get3 = descriptors[key2].get;
        if (get3) {
          try {
            get3.call(value);
          } catch (e) {
          }
        }
      }
    }
  }
}

// node_modules/svelte/src/utils.js
var DOM_BOOLEAN_ATTRIBUTES = [
  "allowfullscreen",
  "async",
  "autofocus",
  "autoplay",
  "checked",
  "controls",
  "default",
  "disabled",
  "formnovalidate",
  "indeterminate",
  "inert",
  "ismap",
  "loop",
  "multiple",
  "muted",
  "nomodule",
  "novalidate",
  "open",
  "playsinline",
  "readonly",
  "required",
  "reversed",
  "seamless",
  "selected",
  "webkitdirectory",
  "defer",
  "disablepictureinpicture",
  "disableremoteplayback"
];
var DOM_PROPERTIES = [
  ...DOM_BOOLEAN_ATTRIBUTES,
  "formNoValidate",
  "isMap",
  "noModule",
  "playsInline",
  "readOnly",
  "value",
  "volume",
  "defaultValue",
  "defaultChecked",
  "srcObject",
  "noValidate",
  "allowFullscreen",
  "disablePictureInPicture",
  "disableRemotePlayback"
];
var PASSIVE_EVENTS = ["touchstart", "touchmove"];
function is_passive_event(name) {
  return PASSIVE_EVENTS.includes(name);
}
var STATE_CREATION_RUNES = (
  /** @type {const} */
  [
    "$state",
    "$state.raw",
    "$derived",
    "$derived.by"
  ]
);
var RUNES = (
  /** @type {const} */
  [
    ...STATE_CREATION_RUNES,
    "$state.eager",
    "$state.snapshot",
    "$props",
    "$props.id",
    "$bindable",
    "$effect",
    "$effect.pre",
    "$effect.tracking",
    "$effect.root",
    "$effect.pending",
    "$inspect",
    "$inspect().with",
    "$inspect.trace",
    "$host"
  ]
);

// node_modules/svelte/src/internal/client/dom/elements/events.js
var event_symbol = Symbol("events");
var all_registered_events = /* @__PURE__ */ new Set();
var root_event_handles = /* @__PURE__ */ new Set();
function delegated(event_name, element2, handler) {
  (element2[event_symbol] ??= {})[event_name] = handler;
}
function delegate(events) {
  for (var i = 0; i < events.length; i++) {
    all_registered_events.add(events[i]);
  }
  for (var fn of root_event_handles) {
    fn(events);
  }
}
var last_propagated_event = null;
function handle_event_propagation(event2) {
  var handler_element = this;
  var owner_document = (
    /** @type {Node} */
    handler_element.ownerDocument
  );
  var event_name = event2.type;
  var path = event2.composedPath?.() || [];
  var current_target = (
    /** @type {null | Element} */
    path[0] || event2.target
  );
  last_propagated_event = event2;
  var path_idx = 0;
  var handled_at = last_propagated_event === event2 && event2[event_symbol];
  if (handled_at) {
    var at_idx = path.indexOf(handled_at);
    if (at_idx !== -1 && (handler_element === document || handler_element === /** @type {any} */
    window)) {
      event2[event_symbol] = handler_element;
      return;
    }
    var handler_idx = path.indexOf(handler_element);
    if (handler_idx === -1) {
      return;
    }
    if (at_idx <= handler_idx) {
      path_idx = at_idx;
    }
  }
  current_target = /** @type {Element} */
  path[path_idx] || event2.target;
  if (current_target === handler_element) return;
  define_property(event2, "currentTarget", {
    configurable: true,
    get() {
      return current_target || owner_document;
    }
  });
  var previous_reaction = active_reaction;
  var previous_effect = active_effect;
  set_active_reaction(null);
  set_active_effect(null);
  try {
    var throw_error;
    var other_errors = [];
    while (current_target !== null) {
      if (current_target === handler_element) break;
      try {
        var delegated2 = current_target[event_symbol]?.[event_name];
        if (delegated2 != null && (!/** @type {any} */
        current_target.disabled || // DOM could've been updated already by the time this is reached, so we check this as well
        // -> the target could not have been disabled because it emits the event in the first place
        event2.target === current_target)) {
          delegated2.call(current_target, event2);
        }
      } catch (error) {
        if (throw_error) {
          other_errors.push(error);
        } else {
          throw_error = error;
        }
      }
      if (event2.cancelBubble) break;
      path_idx++;
      current_target = path_idx < path.length ? (
        /** @type {Element} */
        path[path_idx]
      ) : null;
    }
    if (throw_error) {
      for (let error of other_errors) {
        queueMicrotask(() => {
          throw error;
        });
      }
      throw throw_error;
    }
  } finally {
    event2[event_symbol] = handler_element;
    delete event2.currentTarget;
    set_active_reaction(previous_reaction);
    set_active_effect(previous_effect);
  }
}

// node_modules/svelte/src/internal/client/dom/reconciler.js
var policy = (
  // We gotta write it like this because after downleveling the pure comment may end up in the wrong location
  globalThis?.window?.trustedTypes && /* @__PURE__ */ globalThis.window.trustedTypes.createPolicy("svelte-trusted-html", {
    /** @param {string} html */
    createHTML: (html2) => {
      return html2;
    }
  })
);
function create_trusted_html(html2) {
  return (
    /** @type {string} */
    policy?.createHTML(html2) ?? html2
  );
}
function create_fragment_from_html(html2) {
  var elem = create_element("template");
  elem.innerHTML = create_trusted_html(html2.replaceAll("<!>", "<!---->"));
  return elem.content;
}

// node_modules/svelte/src/internal/client/dom/template.js
function assign_nodes(start, end) {
  var effect2 = (
    /** @type {Effect} */
    active_effect
  );
  if (effect2.nodes === null) {
    effect2.nodes = { start, end, a: null, t: null };
  }
}
// @__NO_SIDE_EFFECTS__
function from_html(content, flags2) {
  var is_fragment = (flags2 & TEMPLATE_FRAGMENT) !== 0;
  var use_import_node = (flags2 & TEMPLATE_USE_IMPORT_NODE) !== 0;
  var node;
  var has_start = !content.startsWith("<!>");
  return () => {
    if (hydrating) {
      assign_nodes(hydrate_node, null);
      return hydrate_node;
    }
    if (node === void 0) {
      node = create_fragment_from_html(has_start ? content : "<!>" + content);
      if (!is_fragment) node = /** @type {TemplateNode} */
      get_first_child(node);
    }
    var clone = (
      /** @type {TemplateNode} */
      use_import_node || is_firefox ? document.importNode(node, true) : node.cloneNode(true)
    );
    if (is_fragment) {
      var start = (
        /** @type {TemplateNode} */
        get_first_child(clone)
      );
      var end = (
        /** @type {TemplateNode} */
        clone.lastChild
      );
      assign_nodes(start, end);
    } else {
      assign_nodes(clone, clone);
    }
    return clone;
  };
}
function text(value = "") {
  if (!hydrating) {
    var t = create_text(value + "");
    assign_nodes(t, t);
    return t;
  }
  var node = hydrate_node;
  if (node.nodeType !== TEXT_NODE) {
    node.before(node = create_text());
    set_hydrate_node(node);
  } else {
    merge_text_nodes(
      /** @type {Text} */
      node
    );
  }
  assign_nodes(node, node);
  return node;
}
function comment() {
  if (hydrating) {
    assign_nodes(hydrate_node, null);
    return hydrate_node;
  }
  var frag = document.createDocumentFragment();
  var start = document.createComment("");
  var anchor = create_text();
  frag.append(start, anchor);
  assign_nodes(start, anchor);
  return frag;
}
function append(anchor, dom) {
  if (hydrating) {
    var effect2 = (
      /** @type {Effect & { nodes: EffectNodes }} */
      active_effect
    );
    if ((effect2.f & REACTION_RAN) === 0 || effect2.nodes.end === null) {
      effect2.nodes.end = hydrate_node;
    }
    hydrate_next();
    return;
  }
  if (anchor === null) {
    return;
  }
  anchor.before(
    /** @type {Node} */
    dom
  );
}

// node_modules/svelte/src/internal/client/render.js
var should_intro = true;
function set_text(text2, value) {
  var str = value == null ? "" : typeof value === "object" ? `${value}` : value;
  if (str !== /** @type {any} */
  (text2[TEXT_CACHE] ??= text2.nodeValue)) {
    text2[TEXT_CACHE] = str;
    text2.nodeValue = `${str}`;
  }
}
function mount(component2, options) {
  return _mount(component2, options);
}
function hydrate(component2, options) {
  init_operations();
  options.intro = options.intro ?? false;
  const target = options.target;
  const was_hydrating = hydrating;
  const previous_hydrate_node = hydrate_node;
  try {
    var anchor = get_first_child(target);
    while (anchor && (anchor.nodeType !== COMMENT_NODE || /** @type {Comment} */
    anchor.data !== HYDRATION_START)) {
      anchor = get_next_sibling(anchor);
    }
    if (!anchor) {
      throw HYDRATION_ERROR;
    }
    set_hydrating(true);
    set_hydrate_node(
      /** @type {Comment} */
      anchor
    );
    const instance = _mount(component2, { ...options, anchor });
    set_hydrating(false);
    return (
      /**  @type {Exports} */
      instance
    );
  } catch (error) {
    if (error instanceof Error && error.message.split("\n").some((line) => line.startsWith("https://svelte.dev/e/"))) {
      throw error;
    }
    if (error !== HYDRATION_ERROR) {
      console.warn("Failed to hydrate: ", error);
    }
    if (options.recover === false) {
      hydration_failed();
    }
    init_operations();
    clear_text_content(target);
    set_hydrating(false);
    return mount(component2, options);
  } finally {
    set_hydrating(was_hydrating);
    set_hydrate_node(previous_hydrate_node);
  }
}
var listeners = /* @__PURE__ */ new Map();
function _mount(Component, { target, anchor, props = {}, events, context, intro = true, transformError }) {
  init_operations();
  var component2 = void 0;
  var unmount2 = component_root(() => {
    var anchor_node = anchor ?? target.appendChild(create_text());
    boundary(
      /** @type {TemplateNode} */
      anchor_node,
      {
        pending: () => {
        }
      },
      (anchor_node2) => {
        push({});
        var ctx = (
          /** @type {ComponentContext} */
          component_context
        );
        if (context) ctx.c = context;
        if (events) {
          props.$$events = events;
        }
        if (hydrating) {
          assign_nodes(
            /** @type {TemplateNode} */
            anchor_node2,
            null
          );
        }
        should_intro = intro;
        component2 = Component(anchor_node2, props) || {};
        should_intro = true;
        if (hydrating) {
          active_effect.nodes.end = hydrate_node;
          if (hydrate_node === null || hydrate_node.nodeType !== COMMENT_NODE || /** @type {Comment} */
          hydrate_node.data !== HYDRATION_END) {
            hydration_mismatch();
            throw HYDRATION_ERROR;
          }
        }
        pop();
      },
      transformError
    );
    var registered_events = /* @__PURE__ */ new Set();
    var event_handle = (events2) => {
      for (var i = 0; i < events2.length; i++) {
        var event_name = events2[i];
        if (registered_events.has(event_name)) continue;
        registered_events.add(event_name);
        var passive2 = is_passive_event(event_name);
        for (const node of [target, document]) {
          var counts = listeners.get(node);
          if (counts === void 0) {
            counts = /* @__PURE__ */ new Map();
            listeners.set(node, counts);
          }
          var count = counts.get(event_name);
          if (count === void 0) {
            node.addEventListener(event_name, handle_event_propagation, { passive: passive2 });
            counts.set(event_name, 1);
          } else {
            counts.set(event_name, count + 1);
          }
        }
      }
    };
    event_handle(array_from(all_registered_events));
    root_event_handles.add(event_handle);
    return () => {
      for (var event_name of registered_events) {
        for (const node of [target, document]) {
          var counts = (
            /** @type {Map<string, number>} */
            listeners.get(node)
          );
          var count = (
            /** @type {number} */
            counts.get(event_name)
          );
          if (--count == 0) {
            node.removeEventListener(event_name, handle_event_propagation);
            counts.delete(event_name);
            if (counts.size === 0) {
              listeners.delete(node);
            }
          } else {
            counts.set(event_name, count);
          }
        }
      }
      root_event_handles.delete(event_handle);
      if (anchor_node !== anchor) {
        anchor_node.parentNode?.removeChild(anchor_node);
      }
    };
  });
  mounted_components.set(component2, unmount2);
  return component2;
}
var mounted_components = /* @__PURE__ */ new WeakMap();
function unmount(component2, options) {
  const fn = mounted_components.get(component2);
  if (fn) {
    mounted_components.delete(component2);
    return fn(options);
  }
  if (dev_fallback_default) {
    if (STATE_SYMBOL in component2) {
      state_proxy_unmount();
    } else {
      lifecycle_double_unmount();
    }
  }
  return Promise.resolve();
}

// node_modules/svelte/src/internal/client/dom/blocks/branches.js
var BranchManager = class {
  /** @type {TemplateNode} */
  anchor;
  /** @type {Map<Batch, Key>} */
  #batches = /* @__PURE__ */ new Map();
  /**
   * Map of keys to effects that are currently rendered in the DOM.
   * These effects are visible and actively part of the document tree.
   * Example:
   * ```
   * {#if condition}
   * 	foo
   * {:else}
   * 	bar
   * {/if}
   * ```
   * Can result in the entries `true->Effect` and `false->Effect`
   * @type {Map<Key, Effect>}
   */
  #onscreen = /* @__PURE__ */ new Map();
  /**
   * Similar to #onscreen with respect to the keys, but contains branches that are not yet
   * in the DOM, because their insertion is deferred.
   * @type {Map<Key, Branch>}
   */
  #offscreen = /* @__PURE__ */ new Map();
  /**
   * Keys of effects that are currently outroing
   * @type {Set<Key>}
   */
  #outroing = /* @__PURE__ */ new Set();
  /**
   * Whether to pause (i.e. outro) on change, or destroy immediately.
   * This is necessary for `<svelte:element>`
   */
  #transition = true;
  /**
   * @param {TemplateNode} anchor
   * @param {boolean} transition
   */
  constructor(anchor, transition2 = true) {
    this.anchor = anchor;
    this.#transition = transition2;
  }
  /**
   * @param {Batch} batch
   */
  #commit = (batch) => {
    if (!this.#batches.has(batch)) return;
    var key2 = (
      /** @type {Key} */
      this.#batches.get(batch)
    );
    var onscreen = this.#onscreen.get(key2);
    if (onscreen) {
      resume_effect(onscreen);
      this.#outroing.delete(key2);
    } else {
      var offscreen = this.#offscreen.get(key2);
      if (offscreen) {
        resume_effect(offscreen.effect);
        this.#onscreen.set(key2, offscreen.effect);
        this.#offscreen.delete(key2);
        if (dev_fallback_default) {
          offscreen.fragment.lastChild[HMR_ANCHOR] = this.anchor;
        }
        offscreen.fragment.lastChild.remove();
        this.anchor.before(offscreen.fragment);
        onscreen = offscreen.effect;
      }
    }
    for (const [b, k] of this.#batches) {
      this.#batches.delete(b);
      if (b === batch) {
        break;
      }
      const offscreen2 = this.#offscreen.get(k);
      if (offscreen2) {
        destroy_effect(offscreen2.effect);
        this.#offscreen.delete(k);
      }
    }
    for (const [k, effect2] of this.#onscreen) {
      if (k === key2 || this.#outroing.has(k)) continue;
      const on_destroy = () => {
        const keys = Array.from(this.#batches.values());
        if (keys.includes(k)) {
          var fragment = document.createDocumentFragment();
          move_effect(effect2, fragment);
          fragment.append(create_text());
          this.#offscreen.set(k, { effect: effect2, fragment });
        } else {
          destroy_effect(effect2);
        }
        this.#outroing.delete(k);
        this.#onscreen.delete(k);
      };
      if (this.#transition || !onscreen) {
        this.#outroing.add(k);
        pause_effect(effect2, on_destroy, false);
      } else {
        on_destroy();
      }
    }
  };
  /**
   * @param {Batch} batch
   */
  #discard = (batch) => {
    this.#batches.delete(batch);
    const keys = Array.from(this.#batches.values());
    for (const [k, branch2] of this.#offscreen) {
      if (!keys.includes(k)) {
        destroy_effect(branch2.effect);
        this.#offscreen.delete(k);
      }
    }
  };
  /**
   *
   * @param {any} key
   * @param {null | ((target: TemplateNode) => void)} fn
   */
  ensure(key2, fn) {
    var batch = (
      /** @type {Batch} */
      current_batch
    );
    var defer = should_defer_append();
    if (fn && !this.#onscreen.has(key2) && !this.#offscreen.has(key2)) {
      if (defer) {
        var fragment = document.createDocumentFragment();
        var target = create_text();
        fragment.append(target);
        this.#offscreen.set(key2, {
          effect: branch(() => fn(target)),
          fragment
        });
      } else {
        this.#onscreen.set(
          key2,
          branch(() => fn(this.anchor))
        );
      }
    }
    this.#batches.set(batch, key2);
    if (defer) {
      for (const [k, effect2] of this.#onscreen) {
        if (k === key2) {
          batch.unskip_effect(effect2);
        } else {
          batch.skip_effect(effect2);
        }
      }
      for (const [k, branch2] of this.#offscreen) {
        if (k === key2) {
          batch.unskip_effect(branch2.effect);
        } else {
          batch.skip_effect(branch2.effect);
        }
      }
      batch.oncommit(this.#commit);
      batch.ondiscard(this.#discard);
    } else {
      if (hydrating) {
        this.anchor = hydrate_node;
      }
      this.#commit(batch);
    }
  }
};

// node_modules/svelte/src/internal/client/dom/blocks/if.js
function if_block(node, fn, elseif = false) {
  var marker;
  if (hydrating) {
    marker = hydrate_node;
    hydrate_next();
  }
  var branches = new BranchManager(node);
  var flags2 = elseif ? EFFECT_TRANSPARENT : 0;
  function update_branch(key2, fn2) {
    if (hydrating) {
      var data = read_hydration_instruction(
        /** @type {TemplateNode} */
        marker
      );
      if (key2 !== parseInt(data.substring(1))) {
        var anchor = skip_nodes();
        set_hydrate_node(anchor);
        branches.anchor = anchor;
        set_hydrating(false);
        branches.ensure(key2, fn2);
        set_hydrating(true);
        return;
      }
    }
    branches.ensure(key2, fn2);
  }
  block(() => {
    var has_branch = false;
    fn((fn2, key2 = 0) => {
      has_branch = true;
      update_branch(key2, fn2);
    });
    if (!has_branch) {
      update_branch(-1, null);
    }
  }, flags2);
}

// node_modules/svelte/src/internal/client/dom/blocks/key.js
var NAN = Symbol("NaN");
function key(node, get_key, render_fn) {
  if (hydrating) {
    hydrate_next();
  }
  var branches = new BranchManager(node);
  var legacy = !is_runes();
  block(() => {
    var key2 = get_key();
    if (key2 !== key2) {
      key2 = /** @type {any} */
      NAN;
    }
    if (legacy && key2 !== null && typeof key2 === "object") {
      key2 = /** @type {V} */
      {};
    }
    branches.ensure(key2, render_fn);
  });
}

// node_modules/svelte/src/internal/client/dom/blocks/each.js
function index(_, i) {
  return i;
}
function pause_effects(state2, to_destroy, controlled_anchor) {
  var transitions = [];
  var length = to_destroy.length;
  var group;
  var remaining = to_destroy.length;
  for (var i = 0; i < length; i++) {
    let effect2 = to_destroy[i];
    pause_effect(
      effect2,
      () => {
        if (group) {
          group.pending.delete(effect2);
          group.done.add(effect2);
          if (group.pending.size === 0) {
            var groups = (
              /** @type {Set<EachOutroGroup>} */
              state2.outrogroups
            );
            destroy_effects(state2, array_from(group.done));
            groups.delete(group);
            if (groups.size === 0) {
              state2.outrogroups = null;
            }
          }
        } else {
          remaining -= 1;
        }
      },
      false
    );
  }
  if (remaining === 0) {
    var fast_path = transitions.length === 0 && controlled_anchor !== null;
    if (fast_path) {
      var anchor = (
        /** @type {Element} */
        controlled_anchor
      );
      var parent_node = (
        /** @type {Element} */
        anchor.parentNode
      );
      clear_text_content(parent_node);
      parent_node.append(anchor);
      state2.items.clear();
    }
    destroy_effects(state2, to_destroy, !fast_path);
  } else {
    group = {
      pending: new Set(to_destroy),
      done: /* @__PURE__ */ new Set()
    };
    (state2.outrogroups ??= /* @__PURE__ */ new Set()).add(group);
  }
}
function destroy_effects(state2, to_destroy, remove_dom = true) {
  var preserved_effects;
  if (state2.pending.size > 0) {
    preserved_effects = /* @__PURE__ */ new Set();
    for (const keys of state2.pending.values()) {
      for (const key2 of keys) {
        preserved_effects.add(
          /** @type {EachItem} */
          state2.items.get(key2).e
        );
      }
    }
  }
  for (var i = 0; i < to_destroy.length; i++) {
    var e = to_destroy[i];
    if (preserved_effects?.has(e)) {
      e.f |= EFFECT_OFFSCREEN;
      const fragment = document.createDocumentFragment();
      move_effect(e, fragment);
    } else {
      destroy_effect(to_destroy[i], remove_dom);
    }
  }
}
var offscreen_anchor;
function each(node, flags2, get_collection, get_key, render_fn, fallback_fn = null) {
  var anchor = node;
  var items = /* @__PURE__ */ new Map();
  var is_controlled = (flags2 & EACH_IS_CONTROLLED) !== 0;
  if (is_controlled) {
    var parent_node = (
      /** @type {Element} */
      node
    );
    anchor = hydrating ? set_hydrate_node(get_first_child(parent_node)) : parent_node.appendChild(create_text());
  }
  if (hydrating) {
    hydrate_next();
  }
  var fallback2 = null;
  var each_array = derived_safe_equal(() => {
    var collection = get_collection();
    return (
      /** @type {V[]} */
      is_array(collection) ? collection : collection == null ? [] : array_from(collection)
    );
  });
  if (dev_fallback_default) {
    tag(each_array, "{#each ...}");
  }
  var array;
  var pending2 = /* @__PURE__ */ new Map();
  var first_run = true;
  function commit(batch) {
    if ((state2.effect.f & DESTROYED) !== 0) {
      return;
    }
    state2.pending.delete(batch);
    state2.fallback = fallback2;
    reconcile(state2, array, anchor, flags2, get_key);
    if (fallback2 !== null) {
      if (array.length === 0) {
        if ((fallback2.f & EFFECT_OFFSCREEN) === 0) {
          resume_effect(fallback2);
        } else {
          fallback2.f ^= EFFECT_OFFSCREEN;
          move(fallback2, null, anchor);
        }
      } else {
        pause_effect(fallback2, () => {
          fallback2 = null;
        });
      }
    }
  }
  function discard(batch) {
    state2.pending.delete(batch);
  }
  var effect2 = block(() => {
    array = /** @type {V[]} */
    get2(each_array);
    var length = array.length;
    let mismatch = false;
    if (hydrating) {
      var is_else = read_hydration_instruction(anchor) === HYDRATION_START_ELSE;
      if (is_else !== (length === 0)) {
        anchor = skip_nodes();
        set_hydrate_node(anchor);
        set_hydrating(false);
        mismatch = true;
      }
    }
    var keys = /* @__PURE__ */ new Set();
    var batch = (
      /** @type {Batch} */
      current_batch
    );
    var defer = should_defer_append();
    for (var index2 = 0; index2 < length; index2 += 1) {
      if (hydrating && hydrate_node.nodeType === COMMENT_NODE && /** @type {Comment} */
      hydrate_node.data === HYDRATION_END) {
        anchor = /** @type {Comment} */
        hydrate_node;
        mismatch = true;
        set_hydrating(false);
      }
      var value = array[index2];
      var key2 = get_key(value, index2);
      if (dev_fallback_default) {
        var key_again = get_key(value, index2);
        if (key2 !== key_again) {
          each_key_volatile(String(index2), String(key2), String(key_again));
        }
      }
      var item = first_run ? null : items.get(key2);
      if (item) {
        if (item.v) internal_set(item.v, value);
        if (item.i) internal_set(item.i, index2);
        if (defer) {
          batch.unskip_effect(item.e);
        }
      } else {
        item = create_item(
          items,
          first_run ? anchor : offscreen_anchor ??= create_text(),
          value,
          key2,
          index2,
          render_fn,
          flags2,
          get_collection
        );
        if (!first_run) {
          item.e.f |= EFFECT_OFFSCREEN;
        }
        items.set(key2, item);
      }
      keys.add(key2);
    }
    if (length === 0 && fallback_fn && !fallback2) {
      if (first_run) {
        fallback2 = branch(() => fallback_fn(anchor));
      } else {
        fallback2 = branch(() => fallback_fn(offscreen_anchor ??= create_text()));
        fallback2.f |= EFFECT_OFFSCREEN;
      }
    }
    if (length > keys.size) {
      if (dev_fallback_default) {
        validate_each_keys(array, get_key);
      } else {
        each_key_duplicate("", "", "");
      }
    }
    if (hydrating && length > 0) {
      set_hydrate_node(skip_nodes());
    }
    if (!first_run) {
      pending2.set(batch, keys);
      if (defer) {
        for (const [key3, item2] of items) {
          if (!keys.has(key3)) {
            batch.skip_effect(item2.e);
          }
        }
        batch.oncommit(commit);
        batch.ondiscard(discard);
      } else {
        commit(batch);
      }
    }
    if (mismatch) {
      set_hydrating(true);
    }
    get2(each_array);
  });
  var state2 = { effect: effect2, flags: flags2, items, pending: pending2, outrogroups: null, fallback: fallback2 };
  first_run = false;
  if (hydrating) {
    anchor = hydrate_node;
  }
}
function skip_to_branch(effect2) {
  while (effect2 !== null && (effect2.f & BRANCH_EFFECT) === 0) {
    effect2 = effect2.next;
  }
  return effect2;
}
function reconcile(state2, array, anchor, flags2, get_key) {
  var is_animated = (flags2 & EACH_IS_ANIMATED) !== 0;
  var length = array.length;
  var items = state2.items;
  var current = skip_to_branch(state2.effect.first);
  var seen;
  var prev = null;
  var to_animate;
  var matched = [];
  var stashed = [];
  var value;
  var key2;
  var effect2;
  var i;
  if (is_animated) {
    for (i = 0; i < length; i += 1) {
      value = array[i];
      key2 = get_key(value, i);
      effect2 = /** @type {EachItem} */
      items.get(key2).e;
      if ((effect2.f & EFFECT_OFFSCREEN) === 0) {
        effect2.nodes?.a?.measure();
        (to_animate ??= /* @__PURE__ */ new Set()).add(effect2);
      }
    }
  }
  for (i = 0; i < length; i += 1) {
    value = array[i];
    key2 = get_key(value, i);
    effect2 = /** @type {EachItem} */
    items.get(key2).e;
    if (state2.outrogroups !== null) {
      for (const group of state2.outrogroups) {
        group.pending.delete(effect2);
        group.done.delete(effect2);
      }
    }
    if ((effect2.f & INERT) !== 0) {
      resume_effect(effect2);
      if (is_animated) {
        effect2.nodes?.a?.unfix();
        (to_animate ??= /* @__PURE__ */ new Set()).delete(effect2);
      }
    }
    if ((effect2.f & EFFECT_OFFSCREEN) !== 0) {
      effect2.f ^= EFFECT_OFFSCREEN;
      if (effect2 === current) {
        move(effect2, null, anchor);
      } else {
        var next2 = prev ? prev.next : current;
        if (effect2 === state2.effect.last) {
          state2.effect.last = effect2.prev;
        }
        if (effect2.prev) effect2.prev.next = effect2.next;
        if (effect2.next) effect2.next.prev = effect2.prev;
        link(state2, prev, effect2);
        link(state2, effect2, next2);
        move(effect2, next2, anchor);
        prev = effect2;
        matched = [];
        stashed = [];
        current = skip_to_branch(prev.next);
        continue;
      }
    }
    if (effect2 !== current) {
      if (seen !== void 0 && seen.has(effect2)) {
        if (matched.length < stashed.length) {
          var start = stashed[0];
          var j;
          prev = start.prev;
          var a = matched[0];
          var b = matched[matched.length - 1];
          for (j = 0; j < matched.length; j += 1) {
            move(matched[j], start, anchor);
          }
          for (j = 0; j < stashed.length; j += 1) {
            seen.delete(stashed[j]);
          }
          link(state2, a.prev, b.next);
          link(state2, prev, a);
          link(state2, b, start);
          current = start;
          prev = b;
          i -= 1;
          matched = [];
          stashed = [];
        } else {
          seen.delete(effect2);
          move(effect2, current, anchor);
          link(state2, effect2.prev, effect2.next);
          link(state2, effect2, prev === null ? state2.effect.first : prev.next);
          link(state2, prev, effect2);
          prev = effect2;
        }
        continue;
      }
      matched = [];
      stashed = [];
      while (current !== null && current !== effect2) {
        (seen ??= /* @__PURE__ */ new Set()).add(current);
        stashed.push(current);
        current = skip_to_branch(current.next);
      }
      if (current === null) {
        continue;
      }
    }
    if ((effect2.f & EFFECT_OFFSCREEN) === 0) {
      matched.push(effect2);
    }
    prev = effect2;
    current = skip_to_branch(effect2.next);
  }
  if (state2.outrogroups !== null) {
    for (const group of state2.outrogroups) {
      if (group.pending.size === 0) {
        destroy_effects(state2, array_from(group.done));
        state2.outrogroups?.delete(group);
      }
    }
    if (state2.outrogroups.size === 0) {
      state2.outrogroups = null;
    }
  }
  if (current !== null || seen !== void 0) {
    var to_destroy = [];
    if (seen !== void 0) {
      for (effect2 of seen) {
        if ((effect2.f & INERT) === 0) {
          to_destroy.push(effect2);
        }
      }
    }
    while (current !== null) {
      if ((current.f & INERT) === 0 && current !== state2.fallback) {
        to_destroy.push(current);
      }
      current = skip_to_branch(current.next);
    }
    var destroy_length = to_destroy.length;
    if (destroy_length > 0) {
      var controlled_anchor = (flags2 & EACH_IS_CONTROLLED) !== 0 && length === 0 ? anchor : null;
      if (is_animated) {
        for (i = 0; i < destroy_length; i += 1) {
          to_destroy[i].nodes?.a?.measure();
        }
        for (i = 0; i < destroy_length; i += 1) {
          to_destroy[i].nodes?.a?.fix();
        }
      }
      pause_effects(state2, to_destroy, controlled_anchor);
    }
  }
  if (is_animated) {
    queue_micro_task(() => {
      if (to_animate === void 0) return;
      for (effect2 of to_animate) {
        effect2.nodes?.a?.apply();
      }
    });
  }
}
function create_item(items, anchor, value, key2, index2, render_fn, flags2, get_collection) {
  var v = (flags2 & EACH_ITEM_REACTIVE) !== 0 ? (flags2 & EACH_ITEM_IMMUTABLE) === 0 ? mutable_source(value, false, false) : source(value) : null;
  var i = (flags2 & EACH_INDEX_REACTIVE) !== 0 ? source(index2) : null;
  if (dev_fallback_default && v) {
    v.trace = () => {
      get_collection()[i?.v ?? index2];
    };
  }
  return {
    v,
    i,
    e: branch(() => {
      render_fn(anchor, v ?? value, i ?? index2, get_collection);
      return () => {
        items.delete(key2);
      };
    })
  };
}
function move(effect2, next2, anchor) {
  if (!effect2.nodes) return;
  var node = effect2.nodes.start;
  var end = effect2.nodes.end;
  var dest = next2 && (next2.f & EFFECT_OFFSCREEN) === 0 ? (
    /** @type {EffectNodes} */
    next2.nodes.start
  ) : anchor;
  while (node !== null) {
    var next_node = (
      /** @type {TemplateNode} */
      get_next_sibling(node)
    );
    dest.before(node);
    if (node === end) {
      return;
    }
    node = next_node;
  }
}
function link(state2, prev, next2) {
  if (prev === null) {
    state2.effect.first = next2;
  } else {
    prev.next = next2;
  }
  if (next2 === null) {
    state2.effect.last = prev;
  } else {
    next2.prev = prev;
  }
}
function validate_each_keys(array, key_fn) {
  const keys = /* @__PURE__ */ new Map();
  const length = array.length;
  for (let i = 0; i < length; i++) {
    const key2 = key_fn(array[i], i);
    if (keys.has(key2)) {
      const a = String(keys.get(key2));
      const b = String(i);
      let k = String(key2);
      if (k.startsWith("[object ")) k = null;
      each_key_duplicate(a, b, k);
    }
    keys.set(key2, i);
  }
}

// node_modules/svelte/src/internal/client/dom/elements/actions.js
function action(dom, action2, get_value) {
  effect(() => {
    var payload = untrack(() => action2(dom, get_value?.()) || {});
    if (get_value && payload?.update) {
      var inited = false;
      var prev = (
        /** @type {any} */
        {}
      );
      render_effect(() => {
        var value = get_value();
        deep_read_state(value);
        if (inited && safe_not_equal(prev, value)) {
          prev = value;
          payload.update(value);
        }
      });
      inited = true;
    }
    if (payload?.destroy) {
      return () => (
        /** @type {Function} */
        payload.destroy()
      );
    }
  });
}

// node_modules/svelte/src/internal/shared/attributes.js
var whitespace = [..." 	\n\r\f\xA0\v\uFEFF"];
function to_class(value, hash2, directives) {
  var classname = value == null ? "" : "" + value;
  if (hash2) {
    classname = classname ? classname + " " + hash2 : hash2;
  }
  if (directives) {
    for (var key2 of Object.keys(directives)) {
      if (directives[key2]) {
        classname = classname ? classname + " " + key2 : key2;
      } else if (classname.length) {
        var len = key2.length;
        var a = 0;
        while ((a = classname.indexOf(key2, a)) >= 0) {
          var b = a + len;
          if ((a === 0 || whitespace.includes(classname[a - 1])) && (b === classname.length || whitespace.includes(classname[b]))) {
            classname = (a === 0 ? "" : classname.substring(0, a)) + classname.substring(b + 1);
          } else {
            a = b;
          }
        }
      }
    }
  }
  return classname === "" ? null : classname;
}
function append_styles(styles, important = false) {
  var separator = important ? " !important;" : ";";
  var css = "";
  for (var key2 of Object.keys(styles)) {
    var value = styles[key2];
    if (value != null && value !== "") {
      css += " " + key2 + ": " + value + separator;
    }
  }
  return css;
}
function to_css_name(name) {
  if (name[0] !== "-" || name[1] !== "-") {
    return name.toLowerCase();
  }
  return name;
}
function to_style(value, styles) {
  if (styles) {
    var new_style = "";
    var normal_styles;
    var important_styles;
    if (Array.isArray(styles)) {
      normal_styles = styles[0];
      important_styles = styles[1];
    } else {
      normal_styles = styles;
    }
    if (value) {
      value = String(value).replaceAll(/\s*\/\*.*?\*\/\s*/g, "").trim();
      var in_str = false;
      var in_apo = 0;
      var in_comment = false;
      var reserved_names = [];
      if (normal_styles) {
        reserved_names.push(...Object.keys(normal_styles).map(to_css_name));
      }
      if (important_styles) {
        reserved_names.push(...Object.keys(important_styles).map(to_css_name));
      }
      var start_index = 0;
      var name_index = -1;
      const len = value.length;
      for (var i = 0; i < len; i++) {
        var c = value[i];
        if (in_comment) {
          if (c === "/" && value[i - 1] === "*") {
            in_comment = false;
          }
        } else if (in_str) {
          if (in_str === c) {
            in_str = false;
          }
        } else if (c === "/" && value[i + 1] === "*") {
          in_comment = true;
        } else if (c === '"' || c === "'") {
          in_str = c;
        } else if (c === "(") {
          in_apo++;
        } else if (c === ")") {
          in_apo--;
        }
        if (!in_comment && in_str === false && in_apo === 0) {
          if (c === ":" && name_index === -1) {
            name_index = i;
          } else if (c === ";" || i === len - 1) {
            if (name_index !== -1) {
              var name = to_css_name(value.substring(start_index, name_index).trim());
              if (!reserved_names.includes(name)) {
                if (c !== ";") {
                  i++;
                }
                var property = value.substring(start_index, i).trim();
                new_style += " " + property + ";";
              }
            }
            start_index = i + 1;
            name_index = -1;
          }
        }
      }
    }
    if (normal_styles) {
      new_style += append_styles(normal_styles);
    }
    if (important_styles) {
      new_style += append_styles(important_styles, true);
    }
    new_style = new_style.trim();
    return new_style === "" ? null : new_style;
  }
  return value == null ? null : String(value);
}

// node_modules/svelte/src/internal/client/dom/elements/class.js
function set_class(dom, is_html, value, hash2, prev_classes, next_classes) {
  var prev = (
    /** @type {any} */
    dom[CLASS_CACHE]
  );
  if (hydrating || prev !== value || prev === void 0) {
    var next_class_name = to_class(value, hash2, next_classes);
    if (!hydrating || next_class_name !== dom.getAttribute("class")) {
      if (next_class_name == null) {
        dom.removeAttribute("class");
      } else if (is_html) {
        dom.className = next_class_name;
      } else {
        dom.setAttribute("class", next_class_name);
      }
    }
    dom[CLASS_CACHE] = value;
  } else if (next_classes && prev_classes !== next_classes) {
    for (var key2 in next_classes) {
      var is_present = !!next_classes[key2];
      if (prev_classes == null || is_present !== !!prev_classes[key2]) {
        dom.classList.toggle(key2, is_present);
      }
    }
  }
  return next_classes;
}

// node_modules/svelte/src/internal/client/dom/elements/style.js
function update_styles(dom, prev = {}, next2, priority) {
  for (var key2 in next2) {
    var value = next2[key2];
    if (prev[key2] !== value) {
      if (next2[key2] == null) {
        dom.style.removeProperty(key2);
      } else {
        dom.style.setProperty(key2, value, priority);
      }
    }
  }
}
function set_style(dom, value, prev_styles, next_styles) {
  var prev = (
    /** @type {any} */
    dom[STYLE_CACHE]
  );
  if (hydrating || prev !== value) {
    var next_style_attr = to_style(value, next_styles);
    if (!hydrating || next_style_attr !== dom.getAttribute("style")) {
      if (next_style_attr == null) {
        dom.removeAttribute("style");
      } else {
        dom.style.cssText = next_style_attr;
      }
    }
    dom[STYLE_CACHE] = value;
  } else if (next_styles) {
    if (Array.isArray(next_styles)) {
      update_styles(dom, prev_styles?.[0], next_styles[0]);
      update_styles(dom, prev_styles?.[1], next_styles[1], "important");
    } else {
      update_styles(dom, prev_styles, next_styles);
    }
  }
  return next_styles;
}

// node_modules/svelte/src/internal/client/dom/elements/bindings/select.js
function select_option(select, value, mounting = false) {
  if (select.multiple) {
    if (value == void 0) {
      return;
    }
    if (!is_array(value)) {
      return select_multiple_invalid_value();
    }
    for (var option of select.options) {
      option.selected = value.includes(get_option_value(option));
    }
    return;
  }
  for (option of select.options) {
    var option_value = get_option_value(option);
    if (is(option_value, value)) {
      option.selected = true;
      return;
    }
  }
  if (!mounting || value !== void 0) {
    select.selectedIndex = -1;
  }
}
function init_select(select) {
  var observer = new MutationObserver(() => {
    select_option(select, select.__value);
  });
  observer.observe(select, {
    // Listen to option element changes
    childList: true,
    subtree: true,
    // because of <optgroup>
    // Listen to option element value attribute changes
    // (doesn't get notified of select value changes,
    // because that property is not reflected as an attribute)
    attributes: true,
    attributeFilter: ["value"]
  });
  teardown(() => {
    observer.disconnect();
  });
}
function get_option_value(option) {
  if ("__value" in option) {
    return option.__value;
  } else {
    return option.value;
  }
}

// node_modules/svelte/src/internal/client/dom/elements/attributes.js
var CLASS = Symbol("class");
var STYLE = Symbol("style");
var IS_CUSTOM_ELEMENT = Symbol("is custom element");
var IS_HTML = Symbol("is html");
var LINK_TAG = IS_XHTML ? "link" : "LINK";
var PROGRESS_TAG = IS_XHTML ? "progress" : "PROGRESS";
function remove_input_defaults(input) {
  if (!hydrating) return;
  var already_removed = false;
  var remove_defaults = () => {
    if (already_removed) return;
    already_removed = true;
    if (input.hasAttribute("value")) {
      var value = input.value;
      set_attribute2(input, "value", null);
      input.value = value;
    }
    if (input.hasAttribute("checked")) {
      var checked = input.checked;
      set_attribute2(input, "checked", null);
      input.checked = checked;
    }
  };
  input[FORM_RESET_HANDLER] = remove_defaults;
  queue_micro_task(remove_defaults);
  add_form_reset_listener();
}
function set_value(element2, value) {
  var attributes = get_attributes(element2);
  if (attributes.value === (attributes.value = // treat null and undefined the same for the initial value
  value ?? void 0) || // @ts-expect-error
  // `progress` elements always need their value set when it's `0`
  element2.value === value && (value !== 0 || element2.nodeName !== PROGRESS_TAG)) {
    return;
  }
  element2.value = value ?? "";
}
function set_checked(element2, checked) {
  var attributes = get_attributes(element2);
  if (attributes.checked === (attributes.checked = // treat null and undefined the same for the initial value
  checked ?? void 0)) {
    return;
  }
  element2.checked = checked;
}
function set_attribute2(element2, attribute, value, skip_warning) {
  var attributes = get_attributes(element2);
  if (hydrating) {
    attributes[attribute] = element2.getAttribute(attribute);
    if (attribute === "src" || attribute === "srcset" || attribute === "href" && element2.nodeName === LINK_TAG) {
      if (!skip_warning) {
        check_src_in_dev_hydration(element2, attribute, value ?? "");
      }
      return;
    }
  }
  if (attributes[attribute] === (attributes[attribute] = value)) return;
  if (attribute === "loading") {
    element2[LOADING_ATTR_SYMBOL] = value;
  }
  if (value == null) {
    element2.removeAttribute(attribute);
  } else if (typeof value !== "string" && get_setters(element2).includes(attribute)) {
    element2[attribute] = value;
  } else {
    element2.setAttribute(attribute, value);
  }
}
function get_attributes(element2) {
  return (
    /** @type {Record<string | symbol, unknown>} **/
    /** @type {any} */
    element2[ATTRIBUTES_CACHE] ??= {
      [IS_CUSTOM_ELEMENT]: element2.nodeName.includes("-"),
      [IS_HTML]: element2.namespaceURI === NAMESPACE_HTML
    }
  );
}
var setters_cache = /* @__PURE__ */ new Map();
function get_setters(element2) {
  var cache_key = element2.getAttribute("is") || element2.nodeName;
  var setters = setters_cache.get(cache_key);
  if (setters) return setters;
  setters_cache.set(cache_key, setters = []);
  var descriptors;
  var proto = element2;
  var element_proto = Element.prototype;
  while (element_proto !== proto) {
    descriptors = get_descriptors(proto);
    for (var key2 in descriptors) {
      if (descriptors[key2].set && // better safe than sorry, we don't want spread attributes to mess with HTML content
      key2 !== "innerHTML" && key2 !== "textContent" && key2 !== "innerText") {
        setters.push(key2);
      }
    }
    proto = get_prototype_of(proto);
  }
  return setters;
}
function check_src_in_dev_hydration(element2, attribute, value) {
  if (!dev_fallback_default) return;
  if (attribute === "srcset" && srcset_url_equal(element2, value)) return;
  if (src_url_equal(element2.getAttribute(attribute) ?? "", value)) return;
  hydration_attribute_changed(
    attribute,
    element2.outerHTML.replace(element2.innerHTML, element2.innerHTML && "..."),
    String(value)
  );
}
function src_url_equal(element_src, url) {
  if (element_src === url) return true;
  return new URL(element_src, document.baseURI).href === new URL(url, document.baseURI).href;
}
function split_srcset(srcset) {
  return srcset.split(",").map((src) => src.trim().split(" ").filter(Boolean));
}
function srcset_url_equal(element2, srcset) {
  var element_urls = split_srcset(element2.srcset);
  var urls = split_srcset(srcset);
  return urls.length === element_urls.length && urls.every(
    ([url, width], i) => width === element_urls[i][1] && // We need to test both ways because Vite will create an a full URL with
    // `new URL(asset, import.meta.url).href` for the client when `base: './'`, and the
    // relative URLs inside srcset are not automatically resolved to absolute URLs by
    // browsers (in contrast to img.src). This means both SSR and DOM code could
    // contain relative or absolute URLs.
    (src_url_equal(element_urls[i][0], url) || src_url_equal(url, element_urls[i][0]))
  );
}

// node_modules/svelte/src/internal/client/dom/elements/bindings/input.js
function bind_value(input, get3, set2 = get3) {
  var batches = /* @__PURE__ */ new WeakSet();
  listen_to_event_and_reset_event(input, "input", async (is_reset) => {
    if (dev_fallback_default && input.type === "checkbox") {
      bind_invalid_checkbox_value();
    }
    var value = is_reset ? input.defaultValue : input.value;
    value = is_numberlike_input(input) ? to_number(value) : value;
    set2(value);
    if (current_batch !== null) {
      batches.add(current_batch);
    }
    await tick();
    if (value !== (value = get3())) {
      var start = input.selectionStart;
      var end = input.selectionEnd;
      var length = input.value.length;
      input.value = value ?? "";
      if (end !== null) {
        var new_length = input.value.length;
        if (start === end && end === length && new_length > length) {
          input.selectionStart = new_length;
          input.selectionEnd = new_length;
        } else {
          input.selectionStart = start;
          input.selectionEnd = Math.min(end, new_length);
        }
      }
    }
  });
  if (
    // If we are hydrating and the value has since changed,
    // then use the updated value from the input instead.
    hydrating && input.defaultValue !== input.value || // If defaultValue is set, then value == defaultValue
    // TODO Svelte 6: remove input.value check and set to empty string?
    untrack(get3) == null && input.value
  ) {
    set2(is_numberlike_input(input) ? to_number(input.value) : input.value);
    if (current_batch !== null) {
      batches.add(current_batch);
    }
  }
  render_effect(() => {
    if (dev_fallback_default && input.type === "checkbox") {
      bind_invalid_checkbox_value();
    }
    var value = get3();
    if (input === document.activeElement) {
      var batch = (
        /** @type {Batch} */
        async_mode_flag ? previous_batch : current_batch
      );
      if (batches.has(batch)) {
        return;
      }
    }
    if (is_numberlike_input(input) && value === to_number(input.value)) {
      return;
    }
    if (input.type === "date" && !value && !input.value) {
      return;
    }
    if (value !== input.value) {
      input.value = value ?? "";
    }
  });
}
function is_numberlike_input(input) {
  var type = input.type;
  return type === "number" || type === "range";
}
function to_number(value) {
  return value === "" ? null : +value;
}

// node_modules/svelte/src/internal/client/dom/elements/bindings/this.js
function is_bound_this(bound_value, element_or_component) {
  return bound_value === element_or_component || bound_value?.[STATE_SYMBOL] === element_or_component;
}
function bind_this(element_or_component = {}, update2, get_value, get_parts) {
  var component_effect = (
    /** @type {ComponentContext} */
    component_context.r
  );
  var parent = (
    /** @type {Effect} */
    active_effect
  );
  effect(() => {
    var old_parts;
    var parts;
    render_effect(() => {
      old_parts = parts;
      parts = get_parts?.() || [];
      untrack(() => {
        if (!is_bound_this(get_value(...parts), element_or_component)) {
          update2(element_or_component, ...parts);
          if (old_parts && is_bound_this(get_value(...old_parts), element_or_component)) {
            update2(null, ...old_parts);
          }
        }
      });
    });
    return () => {
      let p = parent;
      while (p !== component_effect && p.parent !== null && p.parent.f & DESTROYING) {
        p = p.parent;
      }
      const teardown2 = () => {
        if (parts && is_bound_this(get_value(...parts), element_or_component)) {
          update2(null, ...parts);
        }
      };
      const original_teardown = p.teardown;
      p.teardown = () => {
        teardown2();
        original_teardown?.();
      };
    };
  });
  return element_or_component;
}

// node_modules/svelte/src/internal/client/reactivity/props.js
function prop(props, key2, flags2, fallback2) {
  var runes = !legacy_mode_flag || (flags2 & PROPS_IS_RUNES) !== 0;
  var bindable = (flags2 & PROPS_IS_BINDABLE) !== 0;
  var lazy = (flags2 & PROPS_IS_LAZY_INITIAL) !== 0;
  var fallback_value = (
    /** @type {V} */
    fallback2
  );
  var fallback_dirty = true;
  var fallback_signal = (
    /** @type {Derived<V> | undefined} */
    void 0
  );
  var get_fallback = () => {
    if (lazy && runes) {
      fallback_signal ??= derived(
        /** @type {() => V} */
        fallback2
      );
      return get2(fallback_signal);
    }
    if (fallback_dirty) {
      fallback_dirty = false;
      fallback_value = lazy ? untrack(
        /** @type {() => V} */
        fallback2
      ) : (
        /** @type {V} */
        fallback2
      );
    }
    return fallback_value;
  };
  let setter;
  if (bindable) {
    var is_entry_props = STATE_SYMBOL in props || LEGACY_PROPS in props;
    setter = get_descriptor(props, key2)?.set ?? (is_entry_props && key2 in props ? (v) => props[key2] = v : void 0);
  }
  var initial_value;
  var is_store_sub = false;
  if (bindable) {
    [initial_value, is_store_sub] = capture_store_binding(() => (
      /** @type {V} */
      props[key2]
    ));
  } else {
    initial_value = /** @type {V} */
    props[key2];
  }
  if (initial_value === void 0 && fallback2 !== void 0) {
    initial_value = get_fallback();
    if (setter) {
      if (runes) props_invalid_value(key2);
      setter(initial_value);
    }
  }
  var getter;
  if (runes) {
    getter = () => {
      var value = (
        /** @type {V} */
        props[key2]
      );
      if (value === void 0) return get_fallback();
      fallback_dirty = true;
      return value;
    };
  } else {
    getter = () => {
      var value = (
        /** @type {V} */
        props[key2]
      );
      if (value !== void 0) {
        fallback_value = /** @type {V} */
        void 0;
      }
      return value === void 0 ? fallback_value : value;
    };
  }
  if (runes && (flags2 & PROPS_IS_UPDATED) === 0) {
    return getter;
  }
  if (setter) {
    var legacy_parent = props.$$legacy;
    return (
      /** @type {() => V} */
      function(value, mutation) {
        if (arguments.length > 0) {
          if (!runes || !mutation || legacy_parent || is_store_sub) {
            setter(mutation ? getter() : value);
          }
          return value;
        }
        return getter();
      }
    );
  }
  var overridden = false;
  var d = ((flags2 & PROPS_IS_IMMUTABLE) !== 0 ? derived : derived_safe_equal)(() => {
    overridden = false;
    return getter();
  });
  if (dev_fallback_default) {
    d.label = key2;
  }
  if (bindable) get2(d);
  var parent_effect = (
    /** @type {Effect} */
    active_effect
  );
  return (
    /** @type {() => V} */
    function(value, mutation) {
      if (arguments.length > 0) {
        const new_value = mutation ? get2(d) : runes && bindable ? proxy(value) : value;
        set(d, new_value);
        overridden = true;
        if (fallback_value !== void 0) {
          fallback_value = new_value;
        }
        return value;
      }
      if (is_destroying_effect && overridden || (parent_effect.f & DESTROYED) !== 0) {
        return d.v;
      }
      return get2(d);
    }
  );
}

// node_modules/svelte/src/legacy/legacy-client.js
function createClassComponent(options) {
  return new Svelte4Component(options);
}
var Svelte4Component = class {
  /** @type {any} */
  #events;
  /** @type {Record<string, any>} */
  #instance;
  /**
   * @param {ComponentConstructorOptions & {
   *  component: any;
   * }} options
   */
  constructor(options) {
    var sources = /* @__PURE__ */ new Map();
    var add_source = (key2, value) => {
      var s = mutable_source(value, false, false);
      sources.set(key2, s);
      return s;
    };
    const props = new Proxy(
      { ...options.props || {}, $$events: {} },
      {
        get(target, prop2) {
          return get2(sources.get(prop2) ?? add_source(prop2, Reflect.get(target, prop2)));
        },
        has(target, prop2) {
          if (prop2 === LEGACY_PROPS) return true;
          get2(sources.get(prop2) ?? add_source(prop2, Reflect.get(target, prop2)));
          return Reflect.has(target, prop2);
        },
        set(target, prop2, value) {
          set(sources.get(prop2) ?? add_source(prop2, value), value);
          return Reflect.set(target, prop2, value);
        }
      }
    );
    this.#instance = (options.hydrate ? hydrate : mount)(options.component, {
      target: options.target,
      anchor: options.anchor,
      props,
      context: options.context,
      intro: options.intro ?? false,
      recover: options.recover,
      transformError: options.transformError
    });
    if (!async_mode_flag && (!options?.props?.$$host || options.sync === false)) {
      flushSync();
    }
    this.#events = props.$$events;
    for (const key2 of Object.keys(this.#instance)) {
      if (key2 === "$set" || key2 === "$destroy" || key2 === "$on") continue;
      define_property(this, key2, {
        get() {
          return this.#instance[key2];
        },
        /** @param {any} value */
        set(value) {
          this.#instance[key2] = value;
        },
        enumerable: true
      });
    }
    this.#instance.$set = /** @param {Record<string, any>} next */
    (next2) => {
      Object.assign(props, next2);
    };
    this.#instance.$destroy = () => {
      unmount(this.#instance);
    };
  }
  /** @param {Record<string, any>} props */
  $set(props) {
    this.#instance.$set(props);
  }
  /**
   * @param {string} event
   * @param {(...args: any[]) => any} callback
   * @returns {any}
   */
  $on(event2, callback) {
    this.#events[event2] = this.#events[event2] || [];
    const cb = (...args) => callback.call(this, ...args);
    this.#events[event2].push(cb);
    return () => {
      this.#events[event2] = this.#events[event2].filter(
        /** @param {any} fn */
        (fn) => fn !== cb
      );
    };
  }
  $destroy() {
    this.#instance.$destroy();
  }
};

// node_modules/svelte/src/internal/client/dom/elements/custom-element.js
var SvelteElement;
if (typeof HTMLElement === "function") {
  SvelteElement = class extends HTMLElement {
    /** The Svelte component constructor */
    $$ctor;
    /** Slots */
    $$s;
    /** @type {any} The Svelte component instance */
    $$c;
    /** Whether or not the custom element is connected */
    $$cn = false;
    /** @type {Record<string, any>} Component props data */
    $$d = {};
    /** `true` if currently in the process of reflecting component props back to attributes */
    $$r = false;
    /** @type {Record<string, CustomElementPropDefinition>} Props definition (name, reflected, type etc) */
    $$p_d = {};
    /** @type {Record<string, EventListenerOrEventListenerObject[]>} Event listeners */
    $$l = {};
    /** @type {Map<EventListenerOrEventListenerObject, Function>} Event listener unsubscribe functions */
    $$l_u = /* @__PURE__ */ new Map();
    /** @type {any} The managed render effect for reflecting attributes */
    $$me;
    /** @type {ShadowRoot | null} The ShadowRoot of the custom element */
    $$shadowRoot = null;
    /**
     * @param {*} $$componentCtor
     * @param {*} $$slots
     * @param {ShadowRootInit | undefined} shadow_root_init
     */
    constructor($$componentCtor, $$slots, shadow_root_init) {
      super();
      this.$$ctor = $$componentCtor;
      this.$$s = $$slots;
      if (shadow_root_init) {
        this.$$shadowRoot = this.attachShadow(shadow_root_init);
      }
    }
    /**
     * @param {string} type
     * @param {EventListenerOrEventListenerObject} listener
     * @param {boolean | AddEventListenerOptions} [options]
     */
    addEventListener(type, listener, options) {
      this.$$l[type] = this.$$l[type] || [];
      this.$$l[type].push(listener);
      if (this.$$c) {
        const unsub = this.$$c.$on(type, listener);
        this.$$l_u.set(listener, unsub);
      }
      super.addEventListener(type, listener, options);
    }
    /**
     * @param {string} type
     * @param {EventListenerOrEventListenerObject} listener
     * @param {boolean | AddEventListenerOptions} [options]
     */
    removeEventListener(type, listener, options) {
      super.removeEventListener(type, listener, options);
      if (this.$$c) {
        const unsub = this.$$l_u.get(listener);
        if (unsub) {
          unsub();
          this.$$l_u.delete(listener);
        }
      }
    }
    async connectedCallback() {
      this.$$cn = true;
      if (!this.$$c) {
        let create_slot = function(name) {
          return (anchor) => {
            const slot2 = create_element("slot");
            if (name !== "default") slot2.name = name;
            append(anchor, slot2);
          };
        };
        await Promise.resolve();
        if (!this.$$cn || this.$$c) {
          return;
        }
        const $$slots = {};
        const existing_slots = get_custom_elements_slots(this);
        for (const name of this.$$s) {
          if (name in existing_slots) {
            if (name === "default" && !this.$$d.children) {
              this.$$d.children = create_slot(name);
              $$slots.default = true;
            } else {
              $$slots[name] = create_slot(name);
            }
          }
        }
        for (const attribute of this.attributes) {
          const name = this.$$g_p(attribute.name);
          if (!(name in this.$$d)) {
            this.$$d[name] = get_custom_element_value(name, attribute.value, this.$$p_d, "toProp");
          }
        }
        for (const key2 in this.$$p_d) {
          if (!(key2 in this.$$d) && this[key2] !== void 0) {
            this.$$d[key2] = this[key2];
            delete this[key2];
          }
        }
        this.$$c = createClassComponent({
          component: this.$$ctor,
          target: this.$$shadowRoot || this,
          props: {
            ...this.$$d,
            $$slots,
            $$host: this
          }
        });
        this.$$me = effect_root(() => {
          render_effect(() => {
            this.$$r = true;
            for (const key2 of object_keys(this.$$c)) {
              if (!this.$$p_d[key2]?.reflect) continue;
              this.$$d[key2] = this.$$c[key2];
              const attribute_value = get_custom_element_value(
                key2,
                this.$$d[key2],
                this.$$p_d,
                "toAttribute"
              );
              if (attribute_value == null) {
                this.removeAttribute(this.$$p_d[key2].attribute || key2);
              } else {
                this.setAttribute(this.$$p_d[key2].attribute || key2, attribute_value);
              }
            }
            this.$$r = false;
          });
        });
        for (const type in this.$$l) {
          for (const listener of this.$$l[type]) {
            const unsub = this.$$c.$on(type, listener);
            this.$$l_u.set(listener, unsub);
          }
        }
        this.$$l = {};
      }
    }
    // We don't need this when working within Svelte code, but for compatibility of people using this outside of Svelte
    // and setting attributes through setAttribute etc, this is helpful
    /**
     * @param {string} attr
     * @param {string} _oldValue
     * @param {string} newValue
     */
    attributeChangedCallback(attr2, _oldValue, newValue) {
      if (this.$$r) return;
      attr2 = this.$$g_p(attr2);
      this.$$d[attr2] = get_custom_element_value(attr2, newValue, this.$$p_d, "toProp");
      this.$$c?.$set({ [attr2]: this.$$d[attr2] });
    }
    disconnectedCallback() {
      this.$$cn = false;
      Promise.resolve().then(() => {
        if (!this.$$cn && this.$$c) {
          this.$$c.$destroy();
          this.$$me();
          this.$$c = void 0;
        }
      });
    }
    /**
     * @param {string} attribute_name
     */
    $$g_p(attribute_name) {
      return object_keys(this.$$p_d).find(
        (key2) => this.$$p_d[key2].attribute === attribute_name || !this.$$p_d[key2].attribute && key2.toLowerCase() === attribute_name
      ) || attribute_name;
    }
  };
}
function get_custom_element_value(prop2, value, props_definition, transform) {
  const type = props_definition[prop2]?.type;
  value = type === "Boolean" && typeof value !== "boolean" ? value != null : value;
  if (!transform || !props_definition[prop2]) {
    return value;
  } else if (transform === "toAttribute") {
    switch (type) {
      case "Object":
      case "Array":
        return value == null ? null : JSON.stringify(value);
      case "Boolean":
        return value ? "" : null;
      case "Number":
        return value == null ? null : value;
      default:
        return value;
    }
  } else {
    switch (type) {
      case "Object":
      case "Array":
        return value && JSON.parse(value);
      case "Boolean":
        return value;
      // conversion already handled above
      case "Number":
        return value != null ? +value : value;
      default:
        return value;
    }
  }
}
function get_custom_elements_slots(element2) {
  const result = {};
  element2.childNodes.forEach((node) => {
    result[
      /** @type {Element} node */
      node.slot || "default"
    ] = true;
  });
  return result;
}

// node_modules/svelte/src/index-client.js
if (dev_fallback_default) {
  let throw_rune_error = function(rune) {
    if (!(rune in globalThis)) {
      let value;
      Object.defineProperty(globalThis, rune, {
        configurable: true,
        // eslint-disable-next-line getter-return
        get: () => {
          if (value !== void 0) {
            return value;
          }
          rune_outside_svelte(rune);
        },
        set: (v) => {
          value = v;
        }
      });
    }
  };
  throw_rune_error("$state");
  throw_rune_error("$effect");
  throw_rune_error("$derived");
  throw_rune_error("$inspect");
  throw_rune_error("$props");
  throw_rune_error("$bindable");
}
function onMount(fn) {
  if (component_context === null) {
    lifecycle_outside_component("onMount");
  }
  if (legacy_mode_flag && component_context.l !== null) {
    init_update_callbacks(component_context).m.push(fn);
  } else {
    user_effect(() => {
      const cleanup = untrack(fn);
      if (typeof cleanup === "function") return (
        /** @type {() => void} */
        cleanup
      );
    });
  }
}
function init_update_callbacks(context) {
  var l = (
    /** @type {ComponentContextLegacy} */
    context.l
  );
  return l.u ??= { a: [], b: [], m: [] };
}

// node_modules/svelte/src/version.js
var PUBLIC_VERSION = "5";

// node_modules/svelte/src/internal/disclose-version.js
if (typeof window !== "undefined") {
  ((window.__svelte ??= {}).v ??= /* @__PURE__ */ new Set()).add(PUBLIC_VERSION);
}

// node_modules/svelte/src/reactivity/map.js
var SvelteMap = class extends Map {
  /** @type {Map<K, Source<number>>} */
  #sources = /* @__PURE__ */ new Map();
  #version = state(0);
  #size = state(0);
  #update_version = update_version || -1;
  /**
   * @param {Iterable<readonly [K, V]> | null | undefined} [value]
   */
  constructor(value) {
    super();
    if (dev_fallback_default) {
      value = new Map(value);
      tag(this.#version, "SvelteMap version");
      tag(this.#size, "SvelteMap.size");
    }
    if (value) {
      for (var [key2, v] of value) {
        super.set(key2, v);
      }
      this.#size.v = super.size;
    }
  }
  /**
   * If the source is being created inside the same reaction as the SvelteMap instance,
   * we use `state` so that it will not be a dependency of the reaction. Otherwise we
   * use `source` so it will be.
   *
   * @template T
   * @param {T} value
   * @returns {Source<T>}
   */
  #source(value) {
    return update_version === this.#update_version ? state(value) : source(value);
  }
  /** @param {K} key */
  has(key2) {
    var sources = this.#sources;
    var s = sources.get(key2);
    if (s === void 0) {
      if (super.has(key2)) {
        s = this.#source(0);
        if (dev_fallback_default) {
          tag(s, `SvelteMap get(${label(key2)})`);
        }
        sources.set(key2, s);
      } else {
        get2(this.#version);
        return false;
      }
    }
    get2(s);
    return true;
  }
  /**
   * @param {(value: V, key: K, map: Map<K, V>) => void} callbackfn
   * @param {any} [this_arg]
   */
  forEach(callbackfn, this_arg) {
    this.#read_all();
    super.forEach(callbackfn, this_arg);
  }
  /** @param {K} key */
  get(key2) {
    var sources = this.#sources;
    var s = sources.get(key2);
    if (s === void 0) {
      if (super.has(key2)) {
        s = this.#source(0);
        if (dev_fallback_default) {
          tag(s, `SvelteMap get(${label(key2)})`);
        }
        sources.set(key2, s);
      } else {
        get2(this.#version);
        return void 0;
      }
    }
    get2(s);
    return super.get(key2);
  }
  /**
   * @param {K} key
   * @param {V} value
   * */
  set(key2, value) {
    var sources = this.#sources;
    var s = sources.get(key2);
    var prev_res = super.get(key2);
    var res = super.set(key2, value);
    var version = this.#version;
    if (s === void 0) {
      s = this.#source(0);
      if (dev_fallback_default) {
        tag(s, `SvelteMap get(${label(key2)})`);
      }
      sources.set(key2, s);
      set(this.#size, super.size);
      increment(version);
    } else if (prev_res !== value) {
      increment(s);
      var v_reactions = version.reactions === null ? null : new Set(version.reactions);
      var needs_version_increase = v_reactions === null || !s.reactions?.every(
        (r) => (
          /** @type {NonNullable<typeof v_reactions>} */
          v_reactions.has(r)
        )
      );
      if (needs_version_increase) {
        increment(version);
      }
    }
    return res;
  }
  /** @param {K} key */
  delete(key2) {
    var sources = this.#sources;
    var s = sources.get(key2);
    var res = super.delete(key2);
    if (s !== void 0) {
      sources.delete(key2);
      set(s, -1);
    }
    if (res) {
      set(this.#size, super.size);
      increment(this.#version);
    }
    return res;
  }
  clear() {
    if (super.size === 0) {
      return;
    }
    super.clear();
    var sources = this.#sources;
    set(this.#size, 0);
    for (var s of sources.values()) {
      set(s, -1);
    }
    increment(this.#version);
    sources.clear();
  }
  #read_all() {
    get2(this.#version);
    var sources = this.#sources;
    if (this.#size.v !== sources.size) {
      for (var key2 of super.keys()) {
        if (!sources.has(key2)) {
          var s = this.#source(0);
          if (dev_fallback_default) {
            tag(s, `SvelteMap get(${label(key2)})`);
          }
          sources.set(key2, s);
        }
      }
    }
    for ([, s] of this.#sources) {
      get2(s);
    }
  }
  keys() {
    get2(this.#version);
    return super.keys();
  }
  values() {
    this.#read_all();
    return super.values();
  }
  entries() {
    this.#read_all();
    return super.entries();
  }
  [Symbol.iterator]() {
    return this.entries();
  }
  get size() {
    get2(this.#size);
    return super.size;
  }
};

// node_modules/svelte/src/reactivity/url-search-params.js
var REPLACE = Symbol("replace");
var SvelteURLSearchParams = class extends URLSearchParams {
  #version = dev_fallback_default ? tag(state(0), "SvelteURLSearchParams version") : state(0);
  #url = get_current_url();
  #updating = false;
  #update_url() {
    if (!this.#url || this.#updating) return;
    this.#updating = true;
    const search = this.toString();
    this.#url.search = search && `?${search}`;
    this.#updating = false;
  }
  /**
   * @param {URLSearchParams} params
   * @internal
   */
  [REPLACE](params) {
    if (this.#updating) return;
    if (params.toString() === super.toString()) return;
    this.#updating = true;
    for (const key2 of [...super.keys()]) {
      super.delete(key2);
    }
    for (const [key2, value] of params) {
      super.append(key2, value);
    }
    increment(this.#version);
    this.#updating = false;
  }
  /**
   * @param {string} name
   * @param {string} value
   * @returns {void}
   */
  append(name, value) {
    super.append(name, value);
    this.#update_url();
    increment(this.#version);
  }
  /**
   * @param {string} name
   * @param {string=} value
   * @returns {void}
   */
  delete(name, value) {
    var has_value = super.has(name, value);
    super.delete(name, value);
    if (has_value) {
      this.#update_url();
      increment(this.#version);
    }
  }
  /**
   * @param {string} name
   * @returns {string|null}
   */
  get(name) {
    get2(this.#version);
    return super.get(name);
  }
  /**
   * @param {string} name
   * @returns {string[]}
   */
  getAll(name) {
    get2(this.#version);
    return super.getAll(name);
  }
  /**
   * @param {string} name
   * @param {string=} value
   * @returns {boolean}
   */
  has(name, value) {
    get2(this.#version);
    return super.has(name, value);
  }
  keys() {
    get2(this.#version);
    return super.keys();
  }
  /**
   * @param {(value: string, key: string, parent: URLSearchParams) => void} callback
   * @param {any} [this_arg]
   * @returns {void}
   */
  forEach(callback, this_arg) {
    get2(this.#version);
    super.forEach(callback, this_arg);
  }
  /**
   * @param {string} name
   * @param {string} value
   * @returns {void}
   */
  set(name, value) {
    var previous = super.getAll(name);
    super.set(name, value);
    var current = super.getAll(name);
    if (previous.length !== current.length || previous.some((value2, i) => value2 !== current[i])) {
      this.#update_url();
      increment(this.#version);
    }
  }
  sort() {
    super.sort();
    this.#update_url();
    increment(this.#version);
  }
  toString() {
    get2(this.#version);
    return super.toString();
  }
  values() {
    get2(this.#version);
    return super.values();
  }
  entries() {
    get2(this.#version);
    return super.entries();
  }
  [Symbol.iterator]() {
    return this.entries();
  }
  get size() {
    get2(this.#version);
    return super.size;
  }
};

// node_modules/svelte/src/reactivity/url.js
var current_url = null;
function get_current_url() {
  return current_url;
}

// src/ui/StoreView.svelte
var import_obsidian6 = require("obsidian");

// src/data/filter.ts
var EMPTY_FILTER = {
  query: "",
  categories: [],
  sort: "downloads",
  updatedWithinDays: null,
  minDownloads: 0,
  minStars: 0,
  hideInstalled: false,
  starredOnly: false,
  newOnly: false,
  author: ""
};
var DAY_MS = 864e5;
function filterPlugins(entries, state2, ctx) {
  const q = state2.query.trim().toLowerCase();
  const cutoff = state2.updatedWithinDays == null ? null : ctx.now - state2.updatedWithinDays * DAY_MS;
  const stars = (e) => ctx.repoStats[e.repo]?.stars ?? -1;
  const issues = (e) => ctx.repoStats[e.repo]?.openIssues ?? -1;
  const created = (e) => ctx.repoStats[e.repo]?.createdAt ?? -1;
  const filtered = entries.filter((e) => {
    if (ctx.ignoredIds.has(e.id)) return false;
    if (ctx.ignoredAuthors.has(e.author)) return false;
    if (e.categories.some((c) => ctx.ignoredCategories.has(c))) return false;
    if (state2.starredOnly && !ctx.favoriteIds.has(e.id)) return false;
    if (state2.newOnly && !ctx.newIds.has(e.id)) return false;
    if (state2.author && e.author !== state2.author) return false;
    if (state2.hideInstalled && ctx.installedIds.has(e.id)) return false;
    if (e.downloads < state2.minDownloads) return false;
    if (state2.minStars > 0 && (ctx.repoStats[e.repo]?.stars ?? 0) < state2.minStars) return false;
    if (cutoff != null && e.updated < cutoff) return false;
    if (state2.categories.length > 0 && !state2.categories.some((c) => e.categories.includes(c))) return false;
    if (q && !e.name.toLowerCase().includes(q) && !e.description.toLowerCase().includes(q) && !e.author.toLowerCase().includes(q)) {
      return false;
    }
    return true;
  });
  const comparators = {
    downloads: (a, b) => b.downloads - a.downloads,
    updated: (a, b) => b.updated - a.updated,
    name: (a, b) => a.name.localeCompare(b.name),
    trending: (a, b) => (ctx.trendingDeltas[b.id] ?? 0) - (ctx.trendingDeltas[a.id] ?? 0),
    // Unscanned plugins (-1) sort to the bottom of a stars/issues/added sort.
    stars: (a, b) => stars(b) - stars(a),
    issues: (a, b) => issues(b) - issues(a),
    added: (a, b) => created(b) - created(a)
  };
  return filtered.sort(comparators[state2.sort]);
}

// src/data/similar.ts
var STOP_WORDS = /* @__PURE__ */ new Set([
  "the",
  "and",
  "for",
  "with",
  "your",
  "from",
  "that",
  "this",
  "into",
  "obsidian",
  "plugin",
  "plugins",
  "note",
  "notes",
  "vault",
  "files",
  "file"
]);
function tokens(entry) {
  return new Set(
    `${entry.name} ${entry.description}`.toLowerCase().split(/[^a-z0-9]+/).filter((w) => w.length > 3 && !STOP_WORDS.has(w))
  );
}
function similarPlugins(target, all, limit = 5) {
  const targetTokens = tokens(target);
  const targetCats = new Set(target.categories.filter((c) => c !== "Other"));
  return all.filter((e) => e.id !== target.id).map((e) => {
    const sharedCats = e.categories.filter((c) => targetCats.has(c)).length;
    let sharedTokens = 0;
    for (const t of tokens(e)) if (targetTokens.has(t)) sharedTokens++;
    return { entry: e, score: sharedCats * 3 + Math.min(sharedTokens, 5) };
  }).filter((s) => s.score > 0).sort((a, b) => b.score - a.score || b.entry.downloads - a.entry.downloads).slice(0, limit).map((s) => s.entry);
}

// src/ui/Icon.svelte
var import_obsidian3 = require("obsidian");
var root = from_html(`<span class="bs-icon" aria-hidden="true"></span>`);
function Icon($$anchor, $$props) {
  push($$props, true);
  let el = state(void 0);
  user_effect(() => {
    if (get2(el)) (0, import_obsidian3.setIcon)(get2(el), $$props.name);
  });
  var span = root();
  bind_this(span, ($$value) => set(el, $$value), () => get2(el));
  append($$anchor, span);
  pop();
}

// src/ui/FilterSidebar.svelte
var root2 = from_html(`<option> </option>`);
var root_1 = from_html(`<select class="dropdown" aria-label="Apply filter preset"><option selected="" disabled="">Apply preset\u2026</option><!></select>`);
var root_2 = from_html(`<label class="bs-field"><span class="bs-field-label">Sort by</span> <select class="dropdown"></select></label>`);
var root_3 = from_html(`<button> </button>`);
var root_4 = from_html(`<aside class="bs-sidebar"><input type="search" class="bs-search" placeholder="Search plugins\u2026" aria-label="Search plugins"/> <div class="bs-field"><span class="bs-field-label">Presets</span> <div class="bs-preset-row"><!> <button class="bs-preset-save" title="Save current filters as a preset" aria-label="Save current filters as a preset"><!></button></div></div> <!> <label class="bs-field"><span class="bs-field-label">Updated within</span> <select class="dropdown"></select></label> <label class="bs-field"><span class="bs-field-label">Min downloads</span> <input type="number" min="0" step="1000"/></label> <label class="bs-field"><span class="bs-field-label">Min stars (scanned)</span> <input type="number" min="0" step="100"/></label> <label class="bs-field bs-field-row"><input type="checkbox"/> <span>Hide installed</span></label> <label class="bs-field bs-field-row"><input type="checkbox"/> <span>Starred only</span></label> <label class="bs-field bs-field-row"><input type="checkbox"/> <span>New only</span></label> <div class="bs-field"><span class="bs-field-label">Categories</span> <div class="bs-cats"></div></div></aside>`);
function FilterSidebar($$anchor, $$props) {
  push($$props, true);
  function applyPreset(name) {
    const preset = $$props.presets.find((p) => p.name === name);
    if (preset) $$props.onChange({ ...EMPTY_FILTER, ...preset.state });
  }
  const SORTS = [
    { key: "downloads", label: "Downloads" },
    { key: "updated", label: "Recently updated" },
    { key: "name", label: "Name" },
    { key: "trending", label: "Trending" },
    { key: "stars", label: "GitHub stars (scanned)" },
    { key: "issues", label: "Open issues (scanned)" },
    { key: "added", label: "Recently added (scanned)" }
  ];
  const UPDATED_OPTIONS = [
    { value: null, label: "Any time" },
    { value: 1, label: "Last 24 hours" },
    { value: 7, label: "Last 7 days" },
    { value: 30, label: "Last 30 days" },
    { value: 90, label: "Last 3 months" },
    { value: 365, label: "Last year" }
  ];
  function toggleCategory(cat) {
    const categories = $$props.filters.categories.includes(cat) ? $$props.filters.categories.filter((c) => c !== cat) : [...$$props.filters.categories, cat];
    $$props.onChange({ ...$$props.filters, categories });
  }
  var aside = root_4();
  var input = child(aside);
  remove_input_defaults(input);
  var div = sibling(input, 2);
  var div_1 = sibling(child(div), 2);
  var node = child(div_1);
  {
    var consequent = ($$anchor2) => {
      var select = root_1();
      var option = child(select);
      option.value = option.__value = "";
      var node_1 = sibling(option);
      each(node_1, 17, () => $$props.presets, (p) => p.name, ($$anchor3, p) => {
        var option_1 = root2();
        var text2 = child(option_1, true);
        reset(option_1);
        var option_1_value = {};
        template_effect(() => {
          set_text(text2, get2(p).name);
          if (option_1_value !== (option_1_value = get2(p).name)) {
            option_1.value = (option_1.__value = get2(p).name) ?? "";
          }
        });
        append($$anchor3, option_1);
      });
      reset(select);
      delegated("change", select, (e) => {
        applyPreset(e.currentTarget.value);
        e.currentTarget.value = "";
      });
      append($$anchor2, select);
    };
    if_block(node, ($$render) => {
      if ($$props.presets.length > 0) $$render(consequent);
    });
  }
  var button = sibling(node, 2);
  var node_2 = child(button);
  Icon(node_2, { name: "save" });
  reset(button);
  reset(div_1);
  reset(div);
  var node_3 = sibling(div, 2);
  {
    var consequent_1 = ($$anchor2) => {
      var label2 = root_2();
      var select_1 = sibling(child(label2), 2);
      each(select_1, 21, () => SORTS, (s) => s.key, ($$anchor3, s) => {
        var option_2 = root2();
        var text_1 = child(option_2, true);
        reset(option_2);
        var option_2_value = {};
        template_effect(() => {
          set_text(text_1, get2(s).label);
          if (option_2_value !== (option_2_value = get2(s).key)) {
            option_2.value = (option_2.__value = get2(s).key) ?? "";
          }
        });
        append($$anchor3, option_2);
      });
      reset(select_1);
      var select_1_value;
      init_select(select_1);
      reset(label2);
      template_effect(() => {
        if (select_1_value !== (select_1_value = $$props.filters.sort)) {
          select_1.value = (select_1.__value = $$props.filters.sort) ?? "", select_option(select_1, $$props.filters.sort);
        }
      });
      delegated("change", select_1, (e) => $$props.onChange({ ...$$props.filters, sort: e.currentTarget.value }));
      append($$anchor2, label2);
    };
    if_block(node_3, ($$render) => {
      if ($$props.showSort) $$render(consequent_1);
    });
  }
  var label_1 = sibling(node_3, 2);
  var select_2 = sibling(child(label_1), 2);
  each(select_2, 21, () => UPDATED_OPTIONS, (o) => String(o.value), ($$anchor2, o) => {
    var option_3 = root2();
    var text_2 = child(option_3, true);
    reset(option_3);
    var option_3_value = {};
    template_effect(
      ($0) => {
        set_text(text_2, get2(o).label);
        if (option_3_value !== (option_3_value = $0)) {
          option_3.value = (option_3.__value = $0) ?? "";
        }
      },
      [() => String(get2(o).value)]
    );
    append($$anchor2, option_3);
  });
  reset(select_2);
  var select_2_value;
  init_select(select_2);
  reset(label_1);
  var label_2 = sibling(label_1, 2);
  var input_1 = sibling(child(label_2), 2);
  remove_input_defaults(input_1);
  reset(label_2);
  var label_3 = sibling(label_2, 2);
  var input_2 = sibling(child(label_3), 2);
  remove_input_defaults(input_2);
  reset(label_3);
  var label_4 = sibling(label_3, 2);
  var input_3 = child(label_4);
  remove_input_defaults(input_3);
  next(2);
  reset(label_4);
  var label_5 = sibling(label_4, 2);
  var input_4 = child(label_5);
  remove_input_defaults(input_4);
  next(2);
  reset(label_5);
  var label_6 = sibling(label_5, 2);
  var input_5 = child(label_6);
  remove_input_defaults(input_5);
  next(2);
  reset(label_6);
  var div_2 = sibling(label_6, 2);
  var div_3 = sibling(child(div_2), 2);
  each(div_3, 20, () => ALL_CATEGORIES, (cat) => cat, ($$anchor2, cat) => {
    var button_1 = root_3();
    let classes;
    var text_3 = child(button_1, true);
    reset(button_1);
    template_effect(
      ($0) => {
        classes = set_class(button_1, 1, "bs-chip", null, classes, $0);
        set_text(text_3, cat);
      },
      [
        () => ({ "bs-chip-active": $$props.filters.categories.includes(cat) })
      ]
    );
    delegated("click", button_1, () => toggleCategory(cat));
    append($$anchor2, button_1);
  });
  reset(div_3);
  reset(div_2);
  reset(aside);
  template_effect(
    ($0) => {
      set_value(input, $$props.filters.query);
      if (select_2_value !== (select_2_value = $0)) {
        select_2.value = (select_2.__value = $0) ?? "", select_option(select_2, $0);
      }
      set_value(input_1, $$props.filters.minDownloads);
      set_value(input_2, $$props.filters.minStars);
      set_checked(input_3, $$props.filters.hideInstalled);
      set_checked(input_4, $$props.filters.starredOnly);
      set_checked(input_5, $$props.filters.newOnly);
    },
    [() => String($$props.filters.updatedWithinDays)]
  );
  delegated("input", input, (e) => $$props.onChange({ ...$$props.filters, query: e.currentTarget.value }));
  delegated("click", button, function(...$$args) {
    $$props.onSavePreset?.apply(this, $$args);
  });
  delegated("change", select_2, (e) => {
    const v = e.currentTarget.value;
    $$props.onChange({
      ...$$props.filters,
      updatedWithinDays: v === "null" ? null : Number(v)
    });
  });
  delegated("input", input_1, (e) => $$props.onChange({
    ...$$props.filters,
    minDownloads: Number(e.currentTarget.value) || 0
  }));
  delegated("input", input_2, (e) => $$props.onChange({
    ...$$props.filters,
    minStars: Number(e.currentTarget.value) || 0
  }));
  delegated("change", input_3, (e) => $$props.onChange({ ...$$props.filters, hideInstalled: e.currentTarget.checked }));
  delegated("change", input_4, (e) => $$props.onChange({ ...$$props.filters, starredOnly: e.currentTarget.checked }));
  delegated("change", input_5, (e) => $$props.onChange({ ...$$props.filters, newOnly: e.currentTarget.checked }));
  append($$anchor, aside);
  pop();
}
delegate(["input", "change", "click"]);

// src/data/format.ts
function formatCount(n) {
  if (n >= 1e6) return (n / 1e6).toFixed(1).replace(/\.0$/, "") + "M";
  if (n >= 1e3) return (n / 1e3).toFixed(1).replace(/\.0$/, "") + "k";
  return String(n);
}
function formatAge(ts, now) {
  if (!ts) return "unknown";
  const days = Math.floor((now - ts) / 864e5);
  if (days < 1) return "today";
  if (days < 30) return `${days}d ago`;
  if (days < 365) return `${Math.floor(days / 30)}mo ago`;
  return `${Math.floor(days / 365)}y ago`;
}

// src/ui/PluginCard.svelte
var root3 = from_html(`<span class="bs-badge bs-badge-new">New</span>`);
var root_12 = from_html(`<span title="GitHub stars"><!> </span>`);
var root_22 = from_html(`<span class="bs-chip bs-chip-small"> </span>`);
var root_32 = from_html(`<span class="bs-badge bs-badge-installed">Installed</span>`);
var root_42 = from_html(`<div role="button" tabindex="0"><div class="bs-card-top"><span class="bs-card-name"> </span> <!> <button><!></button> <button class="bs-ignore" title="Ignore options"><!></button></div> <div class="bs-card-meta"><span title="Downloads"><!> </span> <!> <button class="bs-author-link"> </button> <span> </span></div> <p class="bs-card-desc"> </p> <div class="bs-card-footer"><div class="bs-card-cats"></div> <!></div></div>`);
function PluginCard($$anchor, $$props) {
  push($$props, true);
  var div = root_42();
  let classes;
  var div_1 = child(div);
  var span = child(div_1);
  var text2 = child(span, true);
  reset(span);
  var node = sibling(span, 2);
  {
    var consequent = ($$anchor2) => {
      var span_1 = root3();
      append($$anchor2, span_1);
    };
    if_block(node, ($$render) => {
      if ($$props.isNew) $$render(consequent);
    });
  }
  var button = sibling(node, 2);
  let classes_1;
  var node_1 = child(button);
  Icon(node_1, { name: "star" });
  reset(button);
  var button_1 = sibling(button, 2);
  var node_2 = child(button_1);
  Icon(node_2, { name: "x" });
  reset(button_1);
  reset(div_1);
  var div_2 = sibling(div_1, 2);
  var span_2 = child(div_2);
  var node_3 = child(span_2);
  Icon(node_3, { name: "download" });
  var text_1 = sibling(node_3, 1, true);
  reset(span_2);
  var node_4 = sibling(span_2, 2);
  {
    var consequent_1 = ($$anchor2) => {
      var span_3 = root_12();
      var node_5 = child(span_3);
      Icon(node_5, { name: "star" });
      var text_2 = sibling(node_5, 1, true);
      reset(span_3);
      template_effect(($0) => set_text(text_2, $0), [() => formatCount($$props.stars)]);
      append($$anchor2, span_3);
    };
    if_block(node_4, ($$render) => {
      if ($$props.stars != null && $$props.stars > 0) $$render(consequent_1);
    });
  }
  var button_2 = sibling(node_4, 2);
  var text_3 = child(button_2, true);
  reset(button_2);
  var span_4 = sibling(button_2, 2);
  var text_4 = child(span_4, true);
  reset(span_4);
  reset(div_2);
  var p = sibling(div_2, 2);
  var text_5 = child(p, true);
  reset(p);
  var div_3 = sibling(p, 2);
  var div_4 = child(div_3);
  each(div_4, 20, () => $$props.entry.categories, (cat) => cat, ($$anchor2, cat) => {
    var span_5 = root_22();
    var text_6 = child(span_5, true);
    reset(span_5);
    template_effect(() => set_text(text_6, cat));
    append($$anchor2, span_5);
  });
  reset(div_4);
  var node_6 = sibling(div_4, 2);
  {
    var consequent_2 = ($$anchor2) => {
      var span_6 = root_32();
      append($$anchor2, span_6);
    };
    if_block(node_6, ($$render) => {
      if ($$props.installed) $$render(consequent_2);
    });
  }
  reset(div_3);
  reset(div);
  template_effect(
    ($0, $1) => {
      classes = set_class(div, 1, "bs-card bs-card-browse", null, classes, { "bs-card-selected": $$props.selected });
      set_text(text2, $$props.entry.name);
      classes_1 = set_class(button, 1, "bs-star", null, classes_1, { "bs-star-active": $$props.starred });
      set_attribute2(button, "title", $$props.starred ? "Unstar" : "Star");
      set_attribute2(button, "aria-label", $$props.starred ? `Unstar ${$$props.entry.name}` : `Star ${$$props.entry.name}`);
      set_attribute2(button, "aria-pressed", $$props.starred);
      set_attribute2(button_1, "aria-label", `Ignore options for ${$$props.entry.name}`);
      set_text(text_1, $0);
      set_attribute2(button_2, "title", `Show all plugins by ${$$props.entry.author}`);
      set_text(text_3, $$props.entry.author);
      set_text(text_4, $1);
      set_text(text_5, $$props.entry.description);
    },
    [
      () => formatCount($$props.entry.downloads),
      () => formatAge($$props.entry.updated, Date.now())
    ]
  );
  delegated("click", div, function(...$$args) {
    $$props.onSelect?.apply(this, $$args);
  });
  delegated("keydown", div, (e) => {
    if (e.target !== e.currentTarget) return;
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      $$props.onSelect();
    }
  });
  delegated("click", button, (e) => {
    e.stopPropagation();
    $$props.onToggleStar();
  });
  delegated("click", button_1, (e) => {
    e.stopPropagation();
    $$props.onIgnore(e);
  });
  delegated("click", button_2, (e) => {
    e.stopPropagation();
    $$props.onAuthor();
  });
  append($$anchor, div);
  pop();
}
delegate(["click", "keydown"]);

// src/ui/DetailPane.svelte
var import_obsidian4 = require("obsidian");

// src/data/readme.ts
var ABSOLUTE = /^(?:https?:)?\/\/|^#|^mailto:|^data:|^obsidian:/i;
function stripLeadingDot(url) {
  return url.replace(/^\.?\//, "");
}
function rewriteReadmeUrls(markdown, repo) {
  const rawBase = `https://raw.githubusercontent.com/${repo}/HEAD/`;
  const blobBase = `https://github.com/${repo}/blob/HEAD/`;
  return markdown.replace(
    /(!\[[^\]]*\]\()([^)\s]+)(\))/g,
    (m, pre, url, post) => ABSOLUTE.test(url) ? m : pre + rawBase + stripLeadingDot(url) + post
  ).replace(
    /((?<!!)\[[^\]]*\]\()([^)\s]+)(\))/g,
    (m, pre, url, post) => ABSOLUTE.test(url) ? m : pre + blobBase + stripLeadingDot(url) + post
  ).replace(
    /(<img[^>]*\ssrc=")([^"]+)(")/gi,
    (m, pre, url, post) => ABSOLUTE.test(url) ? m : pre + rawBase + stripLeadingDot(url) + post
  );
}

// src/data/health.ts
var DAY = 864e5;
function assessHealth(input) {
  const recentReleases = input.releases.filter(
    (r) => r.publishedAt && input.now - Date.parse(r.publishedAt) < 365 * DAY
  ).length;
  const reasons = [];
  let level;
  if (input.updated <= 0) {
    level = "aging";
    reasons.push("last update date unknown");
  } else {
    const days = (input.now - input.updated) / DAY;
    if (days <= 120) level = "healthy";
    else if (days <= 365) level = "aging";
    else level = "at-risk";
    reasons.push(`updated ${formatAge(input.updated, input.now)}`);
  }
  if (level === "aging" && recentReleases >= 3) {
    level = "healthy";
  }
  reasons.push(`${recentReleases} release${recentReleases === 1 ? "" : "s"} in the last year`);
  return { level, reasons };
}

// src/ui/Sparkline.svelte
var root4 = from_html(`<div class="bs-spark"><svg aria-hidden="true"><path fill="none" stroke="var(--interactive-accent)" stroke-width="1.5"></path></svg> <span class="bs-spark-label"> </span></div>`);
function Sparkline($$anchor, $$props) {
  push($$props, true);
  const W = 180;
  const H = 40;
  const PAD = 3;
  let path = user_derived(() => {
    if ($$props.points.length < 2) return "";
    const xs = $$props.points.map((p) => p.ts);
    const ys = $$props.points.map((p) => p.downloads);
    const minX = Math.min(...xs);
    const maxX = Math.max(...xs);
    const minY = Math.min(...ys);
    const maxY = Math.max(...ys);
    const sx = (x) => maxX === minX ? W / 2 : PAD + (x - minX) / (maxX - minX) * (W - PAD * 2);
    const sy = (y) => maxY === minY ? H / 2 : H - PAD - (y - minY) / (maxY - minY) * (H - PAD * 2);
    return $$props.points.map((p, i) => `${i === 0 ? "M" : "L"}${sx(p.ts).toFixed(1)},${sy(p.downloads).toFixed(1)}`).join(" ");
  });
  let delta = user_derived(() => $$props.points.length >= 2 ? $$props.points[$$props.points.length - 1].downloads - $$props.points[0].downloads : 0);
  var fragment = comment();
  var node = first_child(fragment);
  {
    var consequent = ($$anchor2) => {
      var div = root4();
      var svg = child(div);
      set_attribute2(svg, "viewBox", "0 0 180 40");
      set_attribute2(svg, "width", W);
      set_attribute2(svg, "height", H);
      var path_1 = child(svg);
      reset(svg);
      var span = sibling(svg, 2);
      var text2 = child(span);
      reset(span);
      reset(div);
      template_effect(
        ($0) => {
          set_attribute2(path_1, "d", get2(path));
          set_text(text2, `${get2(delta) >= 0 ? "+" : "\u2212"}${$0 ?? ""} downloads across ${$$props.points.length ?? ""} snapshots`);
        },
        [() => formatCount(Math.abs(get2(delta)))]
      );
      append($$anchor2, div);
    };
    if_block(node, ($$render) => {
      if ($$props.points.length >= 2) $$render(consequent);
    });
  }
  append($$anchor, fragment);
  pop();
}

// src/ui/DetailPane.svelte
var root5 = from_html(`<span class="bs-badge bs-badge-installed">Installed</span>`);
var root_13 = from_html(`<span title="GitHub stars"><!> </span> <span title="Open issues"><!> </span>`, 1);
var root_23 = from_html(`<div><!> </div>`);
var root_33 = from_html(`<div class="bs-compat-warning"><!> </div>`);
var root_43 = from_html(`<a target="_blank" rel="noopener">Support author</a>`);
var root_5 = from_html(`<span class="bs-chip bs-chip-small"> </span>`);
var root_6 = from_html(`<div class="bs-detail-note"> </div>`);
var root_7 = from_html(`<button class="bs-chip"> </button>`);
var root_8 = from_html(`<div class="bs-similar"><span class="bs-field-label">Similar plugins</span> <div class="bs-cats"></div></div>`);
var root_9 = from_html(`<details class="bs-release"><summary><a target="_blank" rel="noopener"> </a> <span class="bs-release-date"> </span></summary> <div class="bs-release-notes"></div></details>`);
var root_10 = from_html(`<details class="bs-releases"><summary>Recent releases</summary> <div class="bs-release-list"></div></details>`);
var root_11 = from_html(`<div class="bs-status">Loading README\u2026</div>`);
var root_122 = from_html(`<aside class="bs-detail"><div class="bs-detail-resize" role="separator" aria-orientation="vertical" aria-label="Resize details panel" title="Drag to resize"></div> <div class="bs-detail-header"><div class="bs-detail-title"><h3> <!></h3> <span class="bs-detail-author">by <button class="bs-author-link"> </button></span></div> <div class="bs-detail-header-actions"><button><!></button> <button class="bs-detail-close" title="Close" aria-label="Close details"><!></button></div></div> <div class="bs-detail-stats"><span title="Downloads"><!> </span> <span title="Last updated"><!> </span> <!></div> <!> <!> <!> <div class="bs-detail-actions"><button class="mod-cta"> </button> <a target="_blank" rel="noopener">Repository</a> <!> <span class="bs-copy-actions"><button class="bs-copy-btn" title="Copy repository URL" aria-label="Copy repository URL"><!></button> <button class="bs-copy-btn" title="Copy BRAT string" aria-label="Copy BRAT string"><!></button></span></div> <div class="bs-card-cats"></div> <!> <!> <!> <!> <div class="bs-readme"></div></aside>`);
function DetailPane($$anchor, $$props) {
  push($$props, true);
  let plugin = prop($$props, "plugin", 7), refreshTick = prop($$props, "refreshTick", 3, 0);
  let readmeEl = state(void 0);
  let enrichment = state(null);
  let enrichError = state(null);
  let readmeLoading = state(true);
  let sparkPoints = state(proxy([]));
  const MIN_WIDTH = 300;
  const MAX_WIDTH = 900;
  function loadWidth() {
    const stored = plugin().settings.ui.detailWidth;
    return stored >= MIN_WIDTH && stored <= MAX_WIDTH ? stored : 380;
  }
  let width = state(proxy(loadWidth()));
  function startResize(e) {
    e.preventDefault();
    const win = e.currentTarget.ownerDocument.defaultView ?? window;
    const startX = e.clientX;
    const startWidth = get2(width);
    const onMove = (ev) => {
      set(width, Math.min(MAX_WIDTH, Math.max(MIN_WIDTH, startWidth + (startX - ev.clientX))), true);
    };
    const onUp = () => {
      win.removeEventListener("pointermove", onMove);
      win.removeEventListener("pointerup", onUp);
      plugin().settings.ui.detailWidth = Math.round(get2(width));
      void plugin().saveSettings();
    };
    win.addEventListener("pointermove", onMove);
    win.addEventListener("pointerup", onUp);
  }
  user_effect(() => {
    const current = $$props.entry;
    const el = get2(readmeEl);
    void refreshTick();
    if (!el) return;
    untrack(() => void loadDetails(current, el));
  });
  async function loadDetails(current, el) {
    set(readmeLoading, true);
    set(enrichment, null);
    set(enrichError, null);
    set(sparkPoints, [], true);
    el.empty();
    try {
      const md = rewriteReadmeUrls(await plugin().service.getReadme(current.repo), current.repo);
      if (current.id !== $$props.entry.id) return;
      await import_obsidian4.MarkdownRenderer.render(plugin().app, md, el, "", $$props.view);
      if (current.id !== $$props.entry.id) return;
      const rendered = el.innerHTML;
      el.empty();
      el.appendChild((0, import_obsidian4.sanitizeHTMLToDom)(rendered));
    } catch {
      if (current.id === $$props.entry.id) el.createEl("p", { text: current.description });
    } finally {
      if (current.id === $$props.entry.id) set(readmeLoading, false);
    }
    if (plugin().settings.showSparkline) {
      try {
        const points = await plugin().service.getDownloadHistory(current.id);
        if (current.id === $$props.entry.id) set(sparkPoints, points, true);
      } catch {
      }
    }
    try {
      const e = await plugin().service.getEnrichment(current.repo);
      if (current.id === $$props.entry.id) set(enrichment, e, true);
    } catch (err) {
      if (current.id === $$props.entry.id) {
        set(enrichError, err instanceof RateLimitError ? err.message : "GitHub data unavailable.", true);
      }
    }
  }
  function openNative() {
    window.open(`obsidian://show-plugin?id=${encodeURIComponent($$props.entry.id)}`);
  }
  async function copyText(text2, label2) {
    await navigator.clipboard.writeText(text2);
    new import_obsidian4.Notice(`Copied ${label2}.`);
  }
  let incompatible = user_derived(() => get2(enrichment)?.minAppVersion != null && compareVersions(get2(enrichment).minAppVersion, import_obsidian4.apiVersion) > 0);
  let health = user_derived(() => plugin().settings.showHealth && get2(enrichment) ? assessHealth({
    updated: $$props.entry.updated,
    releases: get2(enrichment).releases,
    now: Date.now()
  }) : null);
  const HEALTH_LABEL = {
    healthy: "Actively maintained",
    aging: "Aging",
    "at-risk": "At risk"
  };
  const HEALTH_ICON = {
    healthy: "check-circle",
    aging: "clock",
    "at-risk": "alert-triangle"
  };
  function releaseNotes(node, body) {
    if (!body.trim()) {
      node.createEl("p", { text: "No release notes provided.", cls: "bs-detail-note" });
      return;
    }
    void import_obsidian4.MarkdownRenderer.render(plugin().app, rewriteReadmeUrls(body, $$props.entry.repo), node, "", $$props.view).then(() => {
      const rendered = node.innerHTML;
      node.empty();
      node.appendChild((0, import_obsidian4.sanitizeHTMLToDom)(rendered));
    });
  }
  var aside = root_122();
  var div = child(aside);
  var div_1 = sibling(div, 2);
  var div_2 = child(div_1);
  var h3 = child(div_2);
  var text_1 = child(h3);
  var node_1 = sibling(text_1);
  {
    var consequent = ($$anchor2) => {
      var span = root5();
      append($$anchor2, span);
    };
    if_block(node_1, ($$render) => {
      if ($$props.installed) $$render(consequent);
    });
  }
  reset(h3);
  var span_1 = sibling(h3, 2);
  var button = sibling(child(span_1));
  var text_2 = child(button, true);
  reset(button);
  reset(span_1);
  reset(div_2);
  var div_3 = sibling(div_2, 2);
  var button_1 = child(div_3);
  let classes;
  var node_2 = child(button_1);
  Icon(node_2, { name: "star" });
  reset(button_1);
  var button_2 = sibling(button_1, 2);
  var node_3 = child(button_2);
  Icon(node_3, { name: "x" });
  reset(button_2);
  reset(div_3);
  reset(div_1);
  var div_4 = sibling(div_1, 2);
  var span_2 = child(div_4);
  var node_4 = child(span_2);
  Icon(node_4, { name: "download" });
  var text_3 = sibling(node_4, 1, true);
  reset(span_2);
  var span_3 = sibling(span_2, 2);
  var node_5 = child(span_3);
  Icon(node_5, { name: "clock" });
  var text_4 = sibling(node_5, 1, true);
  reset(span_3);
  var node_6 = sibling(span_3, 2);
  {
    var consequent_1 = ($$anchor2) => {
      var fragment = root_13();
      var span_4 = first_child(fragment);
      var node_7 = child(span_4);
      Icon(node_7, { name: "star" });
      var text_5 = sibling(node_7, 1, true);
      reset(span_4);
      var span_5 = sibling(span_4, 2);
      var node_8 = child(span_5);
      Icon(node_8, { name: "circle-dot" });
      var text_6 = sibling(node_8, 1, true);
      reset(span_5);
      template_effect(
        ($0, $1) => {
          set_text(text_5, $0);
          set_text(text_6, $1);
        },
        [
          () => formatCount(get2(enrichment).stars),
          () => formatCount(get2(enrichment).openIssues)
        ]
      );
      append($$anchor2, fragment);
    };
    if_block(node_6, ($$render) => {
      if (get2(enrichment)) $$render(consequent_1);
    });
  }
  reset(div_4);
  var node_9 = sibling(div_4, 2);
  {
    var consequent_2 = ($$anchor2) => {
      var div_5 = root_23();
      var node_10 = child(div_5);
      Icon(node_10, {
        get name() {
          return HEALTH_ICON[get2(health).level];
        }
      });
      var text_7 = sibling(node_10);
      reset(div_5);
      template_effect(
        ($0) => {
          set_class(div_5, 1, `bs-health bs-health-${get2(health).level}`);
          set_attribute2(div_5, "title", $0);
          set_text(text_7, ` ${HEALTH_LABEL[get2(health).level] ?? ""}`);
        },
        [() => get2(health).reasons.join(" \xB7 ")]
      );
      append($$anchor2, div_5);
    };
    if_block(node_9, ($$render) => {
      if (get2(health)) $$render(consequent_2);
    });
  }
  var node_11 = sibling(node_9, 2);
  {
    var consequent_3 = ($$anchor2) => {
      Sparkline($$anchor2, {
        get points() {
          return get2(sparkPoints);
        }
      });
    };
    if_block(node_11, ($$render) => {
      if (get2(sparkPoints).length >= 2) $$render(consequent_3);
    });
  }
  var node_12 = sibling(node_11, 2);
  {
    var consequent_4 = ($$anchor2) => {
      var div_6 = root_33();
      var node_13 = child(div_6);
      Icon(node_13, { name: "alert-triangle" });
      var text_8 = sibling(node_13);
      reset(div_6);
      template_effect(() => set_text(text_8, ` Requires Obsidian ${get2(enrichment).minAppVersion ?? ""} or newer \u2014 you're on ${import_obsidian4.apiVersion ?? ""}.`));
      append($$anchor2, div_6);
    };
    if_block(node_12, ($$render) => {
      if (get2(incompatible) && get2(enrichment)) $$render(consequent_4);
    });
  }
  var div_7 = sibling(node_12, 2);
  var button_3 = child(div_7);
  var text_9 = child(button_3, true);
  reset(button_3);
  var a = sibling(button_3, 2);
  var node_14 = sibling(a, 2);
  {
    var consequent_5 = ($$anchor2) => {
      var a_1 = root_43();
      template_effect(() => set_attribute2(a_1, "href", get2(enrichment).fundingUrl));
      append($$anchor2, a_1);
    };
    if_block(node_14, ($$render) => {
      if (get2(enrichment)?.fundingUrl) $$render(consequent_5);
    });
  }
  var span_6 = sibling(node_14, 2);
  var button_4 = child(span_6);
  var node_15 = child(button_4);
  Icon(node_15, { name: "link" });
  reset(button_4);
  var button_5 = sibling(button_4, 2);
  var node_16 = child(button_5);
  Icon(node_16, { name: "clipboard-copy" });
  reset(button_5);
  reset(span_6);
  reset(div_7);
  var div_8 = sibling(div_7, 2);
  each(div_8, 20, () => $$props.entry.categories, (cat) => cat, ($$anchor2, cat) => {
    var span_7 = root_5();
    var text_10 = child(span_7, true);
    reset(span_7);
    template_effect(() => set_text(text_10, cat));
    append($$anchor2, span_7);
  });
  reset(div_8);
  var node_17 = sibling(div_8, 2);
  {
    var consequent_6 = ($$anchor2) => {
      var div_9 = root_6();
      var text_11 = child(div_9, true);
      reset(div_9);
      template_effect(() => set_text(text_11, get2(enrichError)));
      append($$anchor2, div_9);
    };
    if_block(node_17, ($$render) => {
      if (get2(enrichError)) $$render(consequent_6);
    });
  }
  var node_18 = sibling(node_17, 2);
  {
    var consequent_7 = ($$anchor2) => {
      var div_10 = root_8();
      var div_11 = sibling(child(div_10), 2);
      each(div_11, 21, () => $$props.similar, (s) => s.id, ($$anchor3, s) => {
        var button_6 = root_7();
        var text_12 = child(button_6, true);
        reset(button_6);
        template_effect(() => set_text(text_12, get2(s).name));
        delegated("click", button_6, () => $$props.onSelectEntry(get2(s)));
        append($$anchor3, button_6);
      });
      reset(div_11);
      reset(div_10);
      append($$anchor2, div_10);
    };
    if_block(node_18, ($$render) => {
      if ($$props.similar.length > 0) $$render(consequent_7);
    });
  }
  var node_19 = sibling(node_18, 2);
  {
    var consequent_8 = ($$anchor2) => {
      var details = root_10();
      var div_12 = sibling(child(details), 2);
      each(div_12, 21, () => get2(enrichment).releases, index, ($$anchor3, r) => {
        var details_1 = root_9();
        var summary = child(details_1);
        var a_2 = child(summary);
        var text_13 = child(a_2, true);
        reset(a_2);
        var span_8 = sibling(a_2, 2);
        var text_14 = child(span_8, true);
        reset(span_8);
        reset(summary);
        var div_13 = sibling(summary, 2);
        action(div_13, ($$node, $$action_arg) => releaseNotes?.($$node, $$action_arg), () => get2(r).body);
        reset(details_1);
        template_effect(
          ($0) => {
            set_attribute2(a_2, "href", get2(r).url);
            set_text(text_13, get2(r).tag);
            set_text(text_14, $0);
          },
          [() => get2(r).publishedAt.slice(0, 10)]
        );
        delegated("click", a_2, (e) => e.stopPropagation());
        append($$anchor3, details_1);
      });
      reset(div_12);
      reset(details);
      append($$anchor2, details);
    };
    if_block(node_19, ($$render) => {
      if (get2(enrichment) && get2(enrichment).releases.length > 0) $$render(consequent_8);
    });
  }
  var node_20 = sibling(node_19, 2);
  {
    var consequent_9 = ($$anchor2) => {
      var div_14 = root_11();
      append($$anchor2, div_14);
    };
    if_block(node_20, ($$render) => {
      if (get2(readmeLoading)) $$render(consequent_9);
    });
  }
  var div_15 = sibling(node_20, 2);
  bind_this(div_15, ($$value) => set(readmeEl, $$value), () => get2(readmeEl));
  reset(aside);
  template_effect(
    ($0, $1) => {
      set_style(aside, `width:${get2(width)}px`);
      set_text(text_1, `${$$props.entry.name ?? ""} `);
      set_attribute2(button, "title", `Show all plugins by ${$$props.entry.author}`);
      set_text(text_2, $$props.entry.author);
      classes = set_class(button_1, 1, "bs-star", null, classes, { "bs-star-active": $$props.starred });
      set_attribute2(button_1, "title", $$props.starred ? "Unstar" : "Star");
      set_attribute2(button_1, "aria-label", $$props.starred ? `Unstar ${$$props.entry.name}` : `Star ${$$props.entry.name}`);
      set_attribute2(button_1, "aria-pressed", $$props.starred);
      set_text(text_3, $0);
      set_text(text_4, $1);
      set_text(text_9, $$props.installed ? "Open in Community Plugins" : "Install via Community Plugins");
      set_attribute2(a, "href", `https://github.com/${$$props.entry.repo}`);
    },
    [
      () => formatCount($$props.entry.downloads),
      () => formatAge($$props.entry.updated, Date.now())
    ]
  );
  delegated("pointerdown", div, startResize);
  delegated("click", button, () => $$props.onDrillAuthor($$props.entry.author));
  delegated("click", button_1, function(...$$args) {
    $$props.onToggleStar?.apply(this, $$args);
  });
  delegated("click", button_2, function(...$$args) {
    $$props.onClose?.apply(this, $$args);
  });
  delegated("click", button_3, openNative);
  delegated("click", button_4, () => void copyText(`https://github.com/${$$props.entry.repo}`, "repository URL"));
  delegated("click", button_5, () => void copyText($$props.entry.repo, "BRAT string"));
  append($$anchor, aside);
  pop();
}
delegate(["pointerdown", "click"]);

// src/ui/InstalledTab.svelte
var import_obsidian5 = require("obsidian");

// src/data/installed.ts
var ABANDONED_MS = 365 * 864e5;
function buildInstalledInfo(manifests, enabledIds, catalog, latestVersions, now) {
  const byId = new Map(catalog.map((e) => [e.id, e]));
  return Object.values(manifests).map((m) => {
    const entry = byId.get(m.id);
    const latest = latestVersions[m.id] ?? null;
    return {
      id: m.id,
      name: m.name,
      version: m.version,
      latestVersion: latest,
      updateAvailable: latest != null && compareVersions(latest, m.version) > 0,
      enabled: enabledIds.has(m.id),
      repo: entry?.repo ?? null,
      updated: entry?.updated ?? null,
      abandoned: entry != null && entry.updated > 0 && now - entry.updated > ABANDONED_MS
    };
  }).sort((a, b) => a.name.localeCompare(b.name));
}

// src/ui/InstalledTab.svelte
var root6 = from_html(`<option> </option>`);
var root_14 = from_html(`<select class="dropdown bs-profile-select" aria-label="Apply plugin profile"><option selected="" disabled="">Profiles\u2026</option><!></select>`);
var root_24 = from_html(`<button class="bs-chip bs-chip-active" title="Update notices are muted"><!> </button>`);
var root_34 = from_html(`<select class="dropdown bs-mute-select" aria-label="Mute update notices"><option selected="" disabled="">Mute updates\u2026</option><!></select>`);
var root_44 = from_html(`<span class="bs-bulk-actions"><span class="bs-bulk-count"> </span> <button class="bs-bulk-btn">Enable</button> <button class="bs-bulk-btn">Disable</button> <button class="bs-bulk-btn bs-bulk-clear">Clear</button></span>`);
var root_52 = from_html(`<div class="bs-status bs-error"> </div>`);
var root_62 = from_html(`<span class="bs-brat-count"> </span>`);
var root_72 = from_html(`<p>BRAT installs and auto-updates plugins straight from GitHub, before they reach the community store. Better Store hands off to BRAT \u2014 it never manages beta files itself.</p> <button class="bs-chip"><!>Install BRAT</button>`, 1);
var root_82 = from_html(`<p>BRAT is installed but disabled. Enable it to manage beta plugins here.</p>`);
var root_92 = from_html(`<p class="bs-brat-empty">No beta plugins tracked yet. Use "Add beta plugin" to start testing one from GitHub.</p>`);
var root_102 = from_html(`<span class="bs-badge"> </span>`);
var root_112 = from_html(`<li><a target="_blank" rel="noopener"> </a> <!></li>`);
var root_123 = from_html(`<ul class="bs-brat-list"></ul>`);
var root_132 = from_html(`<div class="bs-brat-actions"><button class="bs-chip"><!>Add beta plugin</button> <button class="bs-chip"><!>Check for updates</button> <button class="bs-chip" title="Reload the BRAT list"><!>Refresh</button></div> <!>`, 1);
var root_142 = from_html(`<input type="checkbox"/>`);
var root_15 = from_html(`<span class="bs-badge bs-badge-warn" title="No update in over a year">stale</span>`);
var root_16 = from_html(`<p class="bs-card-desc"> </p>`);
var root_17 = from_html(`<button class="bs-update-btn" title="Open in Community Plugins to update"><!> </button> <button class="bs-update-skip">Skip this version</button> <button class="bs-update-skip" title="Never check this plugin for updates">Don't check</button>`, 1);
var root_18 = from_html(`<a class="bs-installed-changelog" target="_blank" rel="noopener" title="Changelog"><!></a>`);
var root_19 = from_html(`<div><div class="bs-card-top"><!> <span class="bs-card-name"> </span> <!> <div role="switch"><input type="checkbox" tabindex="-1"/></div></div> <div class="bs-card-meta"><span> </span> <span> </span></div> <!> <div class="bs-installed-actions"><!> <!></div></div>`);
var root_20 = from_html(`<div class="bs-status"> </div>`);
var root_21 = from_html(`<div class="bs-installed"><div class="bs-installed-toolbar"><input type="search" class="bs-installed-search" placeholder="Filter installed plugins\u2026" aria-label="Filter installed plugins"/> <button>Updates<!></button> <!> <button class="bs-chip" title="Save the currently enabled plugins as a profile">Save profile</button> <!> <!> <span class="bs-installed-summary"><!></span></div> <!> <details class="bs-brat"><summary><!> <span>Beta plugins (BRAT)</span> <!></summary> <div class="bs-brat-body"><!></div></details> <div class="bs-grid bs-installed-grid"></div></div>`);
function InstalledTab($$anchor, $$props) {
  push($$props, true);
  let plugin = prop($$props, "plugin", 7);
  let infos = state(proxy([]));
  let checking = state(true);
  let toggleError = state(null);
  let query = state("");
  let updatesOnly = state(false);
  let selectedIds = state(proxy(/* @__PURE__ */ new Set()));
  let bulkBusy = state(false);
  const api = getPluginsApi(plugin().app);
  const byId = user_derived(() => new Map($$props.entries.map((e) => [e.id, e])));
  let prefsTick = state(0);
  function actionable(info) {
    void get2(prefsTick);
    return info.updateAvailable && info.latestVersion != null && isUpdateActionable(info.id, info.latestVersion, plugin().updatePrefs());
  }
  let updateCount = user_derived(() => {
    void get2(prefsTick);
    return get2(infos).filter(actionable).length;
  });
  let muteLabel = user_derived(() => {
    void get2(prefsTick);
    return muteRemaining(plugin().updatePrefs(), Date.now());
  });
  let visible = user_derived(() => {
    void get2(prefsTick);
    const q = get2(query).trim().toLowerCase();
    const filtered = get2(infos).filter((i) => (!get2(updatesOnly) || actionable(i)) && (q === "" || i.name.toLowerCase().includes(q) || i.id.toLowerCase().includes(q)));
    return filtered.sort((a, b) => Number(actionable(b)) - Number(actionable(a)) || a.name.localeCompare(b.name));
  });
  async function skipUpdate(info) {
    if (info.latestVersion == null) return;
    await plugin().skipUpdate(info.id, info.latestVersion);
    set(prefsTick, get2(prefsTick) + 1);
  }
  async function ignoreUpdates(info) {
    await plugin().ignorePluginUpdates(info.id);
    set(prefsTick, get2(prefsTick) + 1);
  }
  async function muteUpdates(choice) {
    await plugin().muteUpdates(choice);
    set(prefsTick, get2(prefsTick) + 1);
  }
  async function unmuteUpdates() {
    await plugin().unmuteUpdates();
    set(prefsTick, get2(prefsTick) + 1);
  }
  let brat = state(proxy(getBratStatus(plugin().app)));
  let betaPlugins = state(proxy([]));
  async function loadBrat() {
    set(brat, getBratStatus(plugin().app), true);
    set(betaPlugins, get2(brat).enabled ? parseBratPlugins(await plugin().readBratData()) : [], true);
  }
  onMount(() => void loadBrat());
  function runBrat(commandId) {
    runCommand(plugin().app, commandId);
    window.setTimeout(() => void loadBrat(), 1500);
  }
  function installBrat() {
    window.open(`obsidian://show-plugin?id=${BRAT_PLUGIN_ID}`);
  }
  let lastLatest = {};
  function rebuild(latestVersions) {
    set(infos, buildInstalledInfo(api.manifests, new Set(api.enabledPlugins), $$props.entries, latestVersions, Date.now()), true);
  }
  onMount(async () => {
    rebuild({});
    const latest = {};
    await Promise.all(get2(infos).filter((i) => i.repo != null && i.id !== plugin().manifest.id).map(async (i) => {
      latest[i.id] = await plugin().service.getLatestVersion(i.repo);
    }));
    lastLatest = latest;
    rebuild(latest);
    set(checking, false);
  });
  onMount(() => {
    const poll = window.setInterval(
      () => {
        const ids = Object.keys(api.manifests);
        const changed = ids.length !== get2(infos).length || ids.some((id) => !get2(infos).some((i) => i.id === id)) || get2(infos).some((i) => i.enabled !== api.enabledPlugins.has(i.id));
        if (changed) rebuild(lastLatest);
        const s = getBratStatus(plugin().app);
        if (s.installed !== get2(brat).installed || s.enabled !== get2(brat).enabled) void loadBrat();
      },
      2e3
    );
    return () => window.clearInterval(poll);
  });
  async function toggle(info) {
    if (info.id === plugin().manifest.id) return;
    set(toggleError, null);
    try {
      if (info.enabled) await api.disablePluginAndSave(info.id);
      else await api.enablePluginAndSave(info.id);
    } catch (e) {
      set(toggleError, `Could not toggle ${info.name}: ${e instanceof Error ? e.message : String(e)}`);
    }
    set(infos, get2(infos).map((i) => i.id === info.id ? { ...i, enabled: api.enabledPlugins.has(i.id) } : i), true);
  }
  function openNative(id) {
    window.open(`obsidian://show-plugin?id=${encodeURIComponent(id)}`);
  }
  let profileNames = state(proxy(plugin().settings.profiles.map((p) => p.name)));
  function saveProfile() {
    new NameModal(plugin().app, "Save plugin profile", (name) => {
      const pluginIds = [...api.enabledPlugins].filter((id) => id !== plugin().manifest.id && id in api.manifests);
      const withoutSameName = plugin().settings.profiles.filter((p) => p.name !== name);
      plugin().settings.profiles = [...withoutSameName, { name, pluginIds }];
      void plugin().saveSettings();
      set(profileNames, plugin().settings.profiles.map((p) => p.name), true);
      new import_obsidian5.Notice(`Profile "${name}" saved (${pluginIds.length} plugins).`);
    }).open();
  }
  async function applyProfileByName(name) {
    const profile = plugin().settings.profiles.find((p) => p.name === name);
    if (!profile) return;
    await plugin().applyProfile(profile);
    rebuild(lastLatest);
  }
  function toggleSelect(id) {
    if (id === plugin().manifest.id) return;
    const next2 = new Set(get2(selectedIds));
    if (next2.has(id)) next2.delete(id);
    else next2.add(id);
    set(selectedIds, next2, true);
  }
  async function bulkToggle(enable) {
    set(bulkBusy, true);
    set(toggleError, null);
    try {
      for (const id of get2(selectedIds)) {
        if (id === plugin().manifest.id) continue;
        const isEnabled = api.enabledPlugins.has(id);
        if (enable && !isEnabled) await api.enablePluginAndSave(id);
        if (!enable && isEnabled) await api.disablePluginAndSave(id);
      }
    } catch (e) {
      set(toggleError, `Bulk toggle stopped: ${e instanceof Error ? e.message : String(e)}`);
    } finally {
      set(bulkBusy, false);
      set(selectedIds, /* @__PURE__ */ new Set(), true);
      rebuild(lastLatest);
    }
  }
  var div = root_21();
  var div_1 = child(div);
  var input = child(div_1);
  remove_input_defaults(input);
  var button = sibling(input, 2);
  let classes;
  var node = sibling(child(button));
  {
    var consequent = ($$anchor2) => {
      var text2 = text();
      template_effect(() => set_text(text2, `\xA0(${get2(updateCount) ?? ""})`));
      append($$anchor2, text2);
    };
    if_block(node, ($$render) => {
      if (!get2(checking)) $$render(consequent);
    });
  }
  reset(button);
  var node_1 = sibling(button, 2);
  {
    var consequent_1 = ($$anchor2) => {
      var select = root_14();
      var option = child(select);
      option.value = option.__value = "";
      var node_2 = sibling(option);
      each(node_2, 16, () => get2(profileNames), (name) => name, ($$anchor3, name) => {
        var option_1 = root6();
        var text_1 = child(option_1, true);
        reset(option_1);
        var option_1_value = {};
        template_effect(() => {
          set_text(text_1, name);
          if (option_1_value !== (option_1_value = name)) {
            option_1.value = (option_1.__value = name) ?? "";
          }
        });
        append($$anchor3, option_1);
      });
      reset(select);
      delegated("change", select, (e) => {
        const name = e.currentTarget.value;
        e.currentTarget.value = "";
        void applyProfileByName(name);
      });
      append($$anchor2, select);
    };
    if_block(node_1, ($$render) => {
      if (get2(profileNames).length > 0) $$render(consequent_1);
    });
  }
  var button_1 = sibling(node_1, 2);
  var node_3 = sibling(button_1, 2);
  {
    var consequent_2 = ($$anchor2) => {
      var button_2 = root_24();
      var node_4 = child(button_2);
      Icon(node_4, { name: "bell-off" });
      var text_2 = sibling(node_4);
      reset(button_2);
      template_effect(() => set_text(text_2, `Muted (${get2(muteLabel) ?? ""}) \xB7 Unmute`));
      delegated("click", button_2, () => void unmuteUpdates());
      append($$anchor2, button_2);
    };
    var alternate = ($$anchor2) => {
      var select_1 = root_34();
      var option_2 = child(select_1);
      option_2.value = option_2.__value = "";
      var node_5 = sibling(option_2);
      each(node_5, 17, () => MUTE_OPTIONS, (opt) => opt.value, ($$anchor3, opt) => {
        var option_3 = root6();
        var text_3 = child(option_3, true);
        reset(option_3);
        var option_3_value = {};
        template_effect(() => {
          set_text(text_3, get2(opt).label);
          if (option_3_value !== (option_3_value = get2(opt).value)) {
            option_3.value = (option_3.__value = get2(opt).value) ?? "";
          }
        });
        append($$anchor3, option_3);
      });
      reset(select_1);
      delegated("change", select_1, (e) => {
        const choice = e.currentTarget.value;
        e.currentTarget.value = "";
        if (choice) void muteUpdates(choice);
      });
      append($$anchor2, select_1);
    };
    if_block(node_3, ($$render) => {
      if (get2(muteLabel)) $$render(consequent_2);
      else $$render(alternate, -1);
    });
  }
  var node_6 = sibling(node_3, 2);
  {
    var consequent_3 = ($$anchor2) => {
      var span = root_44();
      var span_1 = child(span);
      var text_4 = child(span_1);
      reset(span_1);
      var button_3 = sibling(span_1, 2);
      var button_4 = sibling(button_3, 2);
      var button_5 = sibling(button_4, 2);
      reset(span);
      template_effect(() => {
        set_text(text_4, `${get2(selectedIds).size ?? ""} selected`);
        button_3.disabled = get2(bulkBusy);
        button_4.disabled = get2(bulkBusy);
        button_5.disabled = get2(bulkBusy);
      });
      delegated("click", button_3, () => void bulkToggle(true));
      delegated("click", button_4, () => void bulkToggle(false));
      delegated("click", button_5, () => set(selectedIds, /* @__PURE__ */ new Set(), true));
      append($$anchor2, span);
    };
    if_block(node_6, ($$render) => {
      if (get2(selectedIds).size > 0) $$render(consequent_3);
    });
  }
  var span_2 = sibling(node_6, 2);
  var node_7 = child(span_2);
  {
    var consequent_4 = ($$anchor2) => {
      var text_5 = text("Checking for updates\u2026");
      append($$anchor2, text_5);
    };
    var alternate_1 = ($$anchor2) => {
      var text_6 = text();
      template_effect(() => set_text(text_6, `${get2(infos).length ?? ""} installed \xB7 ${get2(updateCount) ?? ""} ${get2(updateCount) === 1 ? "update" : "updates"} available`));
      append($$anchor2, text_6);
    };
    if_block(node_7, ($$render) => {
      if (get2(checking)) $$render(consequent_4);
      else $$render(alternate_1, -1);
    });
  }
  reset(span_2);
  reset(div_1);
  var node_8 = sibling(div_1, 2);
  {
    var consequent_5 = ($$anchor2) => {
      var div_2 = root_52();
      var text_7 = child(div_2, true);
      reset(div_2);
      template_effect(() => set_text(text_7, get2(toggleError)));
      append($$anchor2, div_2);
    };
    if_block(node_8, ($$render) => {
      if (get2(toggleError)) $$render(consequent_5);
    });
  }
  var details = sibling(node_8, 2);
  var summary = child(details);
  var node_9 = child(summary);
  Icon(node_9, { name: "flask-conical" });
  var node_10 = sibling(node_9, 4);
  {
    var consequent_6 = ($$anchor2) => {
      var span_3 = root_62();
      var text_8 = child(span_3, true);
      reset(span_3);
      template_effect(() => set_text(text_8, get2(betaPlugins).length));
      append($$anchor2, span_3);
    };
    if_block(node_10, ($$render) => {
      if (get2(brat).enabled) $$render(consequent_6);
    });
  }
  reset(summary);
  var div_3 = sibling(summary, 2);
  var node_11 = child(div_3);
  {
    var consequent_7 = ($$anchor2) => {
      var fragment_2 = root_72();
      var button_6 = sibling(first_child(fragment_2), 2);
      var node_12 = child(button_6);
      Icon(node_12, { name: "download" });
      next();
      reset(button_6);
      delegated("click", button_6, installBrat);
      append($$anchor2, fragment_2);
    };
    var consequent_8 = ($$anchor2) => {
      var p_1 = root_82();
      append($$anchor2, p_1);
    };
    var alternate_3 = ($$anchor2) => {
      var fragment_3 = root_132();
      var div_4 = first_child(fragment_3);
      var button_7 = child(div_4);
      var node_13 = child(button_7);
      Icon(node_13, { name: "plus" });
      next();
      reset(button_7);
      var button_8 = sibling(button_7, 2);
      var node_14 = child(button_8);
      Icon(node_14, { name: "refresh-cw" });
      next();
      reset(button_8);
      var button_9 = sibling(button_8, 2);
      var node_15 = child(button_9);
      Icon(node_15, { name: "rotate-cw" });
      next();
      reset(button_9);
      reset(div_4);
      var node_16 = sibling(div_4, 2);
      {
        var consequent_9 = ($$anchor3) => {
          var p_2 = root_92();
          append($$anchor3, p_2);
        };
        var alternate_2 = ($$anchor3) => {
          var ul = root_123();
          each(ul, 21, () => get2(betaPlugins), (bp) => bp.repo, ($$anchor4, bp) => {
            var li = root_112();
            var a_1 = child(li);
            var text_9 = child(a_1, true);
            reset(a_1);
            var node_17 = sibling(a_1, 2);
            {
              var consequent_10 = ($$anchor5) => {
                var span_4 = root_102();
                var text_10 = child(span_4);
                reset(span_4);
                template_effect(() => set_text(text_10, `pinned v${get2(bp).frozenVersion ?? ""}`));
                append($$anchor5, span_4);
              };
              if_block(node_17, ($$render) => {
                if (get2(bp).frozenVersion) $$render(consequent_10);
              });
            }
            reset(li);
            template_effect(() => {
              set_attribute2(a_1, "href", `https://github.com/${get2(bp).repo}`);
              set_text(text_9, get2(bp).repo);
            });
            append($$anchor4, li);
          });
          reset(ul);
          append($$anchor3, ul);
        };
        if_block(node_16, ($$render) => {
          if (get2(betaPlugins).length === 0) $$render(consequent_9);
          else $$render(alternate_2, -1);
        });
      }
      delegated("click", button_7, () => runBrat(BRAT_COMMANDS.addBetaPlugin));
      delegated("click", button_8, () => runBrat(BRAT_COMMANDS.checkAndUpdate));
      delegated("click", button_9, () => void loadBrat());
      append($$anchor2, fragment_3);
    };
    if_block(node_11, ($$render) => {
      if (!get2(brat).installed) $$render(consequent_7);
      else if (!get2(brat).enabled) $$render(consequent_8, 1);
      else $$render(alternate_3, -1);
    });
  }
  reset(div_3);
  reset(details);
  var div_5 = sibling(details, 2);
  each(
    div_5,
    21,
    () => get2(visible),
    (info) => info.id,
    ($$anchor2, info) => {
      const entry = user_derived(() => get2(byId).get(get2(info).id));
      var div_6 = root_19();
      let classes_1;
      var div_7 = child(div_6);
      var node_18 = child(div_7);
      {
        var consequent_11 = ($$anchor3) => {
          var input_1 = root_142();
          remove_input_defaults(input_1);
          let classes_2;
          template_effect(
            ($0, $1) => {
              classes_2 = set_class(input_1, 1, "bs-select", null, classes_2, $0);
              set_attribute2(input_1, "aria-label", `Select ${get2(info).name} for bulk actions`);
              set_checked(input_1, $1);
            },
            [
              () => ({ "bs-select-active": get2(selectedIds).has(get2(info).id) }),
              () => get2(selectedIds).has(get2(info).id)
            ]
          );
          delegated("click", input_1, (e) => e.stopPropagation());
          delegated("change", input_1, () => toggleSelect(get2(info).id));
          append($$anchor3, input_1);
        };
        if_block(node_18, ($$render) => {
          if (get2(info).id !== plugin().manifest.id) $$render(consequent_11);
        });
      }
      var span_5 = sibling(node_18, 2);
      var text_11 = child(span_5, true);
      reset(span_5);
      var node_19 = sibling(span_5, 2);
      {
        var consequent_12 = ($$anchor3) => {
          var span_6 = root_15();
          append($$anchor3, span_6);
        };
        if_block(node_19, ($$render) => {
          if (get2(info).abandoned) $$render(consequent_12);
        });
      }
      var div_8 = sibling(node_19, 2);
      let classes_3;
      var input_2 = child(div_8);
      remove_input_defaults(input_2);
      reset(div_8);
      reset(div_7);
      var div_9 = sibling(div_7, 2);
      var span_7 = child(div_9);
      var text_12 = child(span_7);
      reset(span_7);
      var span_8 = sibling(span_7, 2);
      var text_13 = child(span_8, true);
      reset(span_8);
      reset(div_9);
      var node_20 = sibling(div_9, 2);
      {
        var consequent_13 = ($$anchor3) => {
          var p_3 = root_16();
          var text_14 = child(p_3, true);
          reset(p_3);
          template_effect(() => set_text(text_14, get2(entry).description));
          append($$anchor3, p_3);
        };
        if_block(node_20, ($$render) => {
          if (get2(entry)) $$render(consequent_13);
        });
      }
      var div_10 = sibling(node_20, 2);
      var node_21 = child(div_10);
      {
        var consequent_14 = ($$anchor3) => {
          var fragment_4 = root_17();
          var button_10 = first_child(fragment_4);
          var node_22 = child(button_10);
          Icon(node_22, { name: "arrow-up" });
          var text_15 = sibling(node_22);
          reset(button_10);
          var button_11 = sibling(button_10, 2);
          var button_12 = sibling(button_11, 2);
          template_effect(() => {
            set_text(text_15, `Update to ${get2(info).latestVersion ?? ""}`);
            set_attribute2(button_11, "title", `Skip v${get2(info).latestVersion} \u2014 you'll be notified again on the next version`);
          });
          delegated("click", button_10, (e) => {
            e.stopPropagation();
            openNative(get2(info).id);
          });
          delegated("click", button_11, (e) => {
            e.stopPropagation();
            void skipUpdate(get2(info));
          });
          delegated("click", button_12, (e) => {
            e.stopPropagation();
            void ignoreUpdates(get2(info));
          });
          append($$anchor3, fragment_4);
        };
        var d = user_derived(() => actionable(get2(info)));
        if_block(node_21, ($$render) => {
          if (get2(d)) $$render(consequent_14);
        });
      }
      var node_23 = sibling(node_21, 2);
      {
        var consequent_15 = ($$anchor3) => {
          var a_2 = root_18();
          var node_24 = child(a_2);
          Icon(node_24, { name: "scroll-text" });
          reset(a_2);
          template_effect(() => {
            set_attribute2(a_2, "href", `https://github.com/${get2(info).repo}/releases`);
            set_attribute2(a_2, "aria-label", `Changelog for ${get2(info).name}`);
          });
          delegated("click", a_2, (e) => e.stopPropagation());
          append($$anchor3, a_2);
        };
        if_block(node_23, ($$render) => {
          if (get2(info).repo) $$render(consequent_15);
        });
      }
      reset(div_10);
      reset(div_6);
      template_effect(
        ($0) => {
          classes_1 = set_class(div_6, 1, "bs-card bs-installed-card", null, classes_1, { "bs-installed-off": !get2(info).enabled });
          set_attribute2(div_6, "role", get2(entry) ? "button" : void 0);
          set_attribute2(div_6, "tabindex", get2(entry) ? 0 : void 0);
          set_text(text_11, get2(info).name);
          classes_3 = set_class(div_8, 1, "checkbox-container bs-installed-toggle", null, classes_3, {
            "is-enabled": get2(info).enabled,
            "bs-toggle-locked": get2(info).id === plugin().manifest.id
          });
          set_attribute2(div_8, "aria-checked", get2(info).enabled);
          set_attribute2(div_8, "aria-label", `Enable ${get2(info).name}`);
          set_attribute2(div_8, "tabindex", get2(info).id === plugin().manifest.id ? -1 : 0);
          set_attribute2(div_8, "title", get2(info).id === plugin().manifest.id ? "Better Store cannot disable itself" : get2(info).enabled ? "Disable" : "Enable");
          set_checked(input_2, get2(info).enabled);
          input_2.disabled = get2(info).id === plugin().manifest.id;
          set_text(text_12, `v${get2(info).version ?? ""}`);
          set_text(text_13, $0);
        },
        [
          () => get2(info).updated ? `updated ${formatAge(get2(info).updated, Date.now())}` : "not in catalog"
        ]
      );
      delegated("click", div_6, function(...$$args) {
        (get2(entry) ? () => $$props.onSelect(get2(entry)) : void 0)?.apply(this, $$args);
      });
      delegated("keydown", div_6, function(...$$args) {
        (get2(entry) ? (e) => {
          if (e.target !== e.currentTarget) return;
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            $$props.onSelect(get2(entry));
          }
        } : void 0)?.apply(this, $$args);
      });
      delegated("click", div_8, (e) => {
        e.stopPropagation();
        void toggle(get2(info));
      });
      delegated("keydown", div_8, (e) => {
        e.stopPropagation();
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          void toggle(get2(info));
        }
      });
      append($$anchor2, div_6);
    },
    ($$anchor2) => {
      var div_11 = root_20();
      var text_16 = child(div_11, true);
      reset(div_11);
      template_effect(() => set_text(text_16, get2(updatesOnly) ? "Everything is up to date." : "No installed plugins match."));
      append($$anchor2, div_11);
    }
  );
  reset(div_5);
  reset(div);
  template_effect(() => classes = set_class(button, 1, "bs-chip", null, classes, { "bs-chip-active": get2(updatesOnly) }));
  bind_value(input, () => get2(query), ($$value) => set(query, $$value));
  delegated("click", button, () => set(updatesOnly, !get2(updatesOnly)));
  delegated("click", button_1, saveProfile);
  append($$anchor, div);
  pop();
}
delegate(["click", "change", "keydown"]);

// src/ui/TreeView.svelte
var root7 = from_html(`<span class="bs-sr-only">installed</span>`);
var root_110 = from_html(`<div data-row="" role="button" tabindex="0"><!> <span class="bs-tree-name"> </span> <!> <span class="bs-tree-meta"><!> </span></div>`);
var root_25 = from_html(`<div class="bs-tree-more" data-row="" role="button" tabindex="0"> </div>`);
var root_35 = from_html(`<!> <!>`, 1);
var root_45 = from_html(`<div class="bs-tree-folder" data-row="" role="button" tabindex="0"><!> <span class="bs-tree-label"> </span> <span class="bs-tree-count"> </span></div> <!>`, 1);
var root_53 = from_html(`<div class="bs-tree-folder bs-tree-stale" style="--bs-depth:0" data-row="" data-key="__stale__" role="button" tabindex="0"><!> <span class="bs-tree-label">Stale (12+ months)</span> <span class="bs-tree-count"> </span></div> <!>`, 1);
var root_63 = from_html(`<div class="bs-tree"><div class="bs-tree-tools"><button class="bs-tree-tool"><!>Expand all</button> <button class="bs-tree-tool"><!>Collapse all</button></div> <!> <!></div>`);
function TreeView($$anchor, $$props) {
  push($$props, true);
  const folder = ($$anchor2, group = noop, key2 = noop, depth = noop) => {
    var fragment = root_45();
    var div = first_child(fragment);
    var node_1 = child(div);
    {
      let $0 = user_derived(() => get2(expanded).has(key2()) ? "folder-open" : "folder");
      Icon(node_1, {
        get name() {
          return get2($0);
        }
      });
    }
    var span = sibling(node_1, 2);
    var text2 = child(span, true);
    reset(span);
    var span_1 = sibling(span, 2);
    var text_1 = child(span_1, true);
    reset(span_1);
    reset(div);
    var node_2 = sibling(div, 2);
    {
      var consequent_2 = ($$anchor3) => {
        var fragment_1 = root_35();
        var node_3 = first_child(fragment_1);
        each(node_3, 17, () => group().entries.slice(0, get2(folderLimits)[key2()] ?? FOLDER_PAGE), (entry) => entry.id, ($$anchor4, entry) => {
          var div_1 = root_110();
          let classes;
          var node_4 = child(div_1);
          Icon(node_4, { name: "puzzle" });
          var span_2 = sibling(node_4, 2);
          var text_2 = child(span_2, true);
          reset(span_2);
          var node_5 = sibling(span_2, 2);
          {
            var consequent = ($$anchor5) => {
              var span_3 = root7();
              append($$anchor5, span_3);
            };
            var d = user_derived(() => $$props.installedIds.has(get2(entry).id));
            if_block(node_5, ($$render) => {
              if (get2(d)) $$render(consequent);
            });
          }
          var span_4 = sibling(node_5, 2);
          var node_6 = child(span_4);
          Icon(node_6, { name: "download" });
          var text_3 = sibling(node_6, 1, true);
          reset(span_4);
          reset(div_1);
          template_effect(
            ($0, $1, $2) => {
              classes = set_class(div_1, 1, "bs-tree-item", null, classes, $0);
              set_style(div_1, `--bs-depth:${depth() + 1}`);
              set_attribute2(div_1, "data-depth", depth() + 1);
              set_attribute2(div_1, "title", $1);
              set_text(text_2, get2(entry).name);
              set_text(text_3, $2);
            },
            [
              () => ({
                "bs-tree-item-selected": $$props.selected?.id === get2(entry).id,
                "bs-tree-item-installed": $$props.installedIds.has(get2(entry).id)
              }),
              () => $$props.installedIds.has(get2(entry).id) ? `${get2(entry).name} (installed)` : get2(entry).name,
              () => formatCount(get2(entry).downloads)
            ]
          );
          delegated("click", div_1, () => $$props.onSelect(get2(entry)));
          delegated("keydown", div_1, (e) => activate(e, () => $$props.onSelect(get2(entry))));
          append($$anchor4, div_1);
        });
        var node_7 = sibling(node_3, 2);
        {
          var consequent_1 = ($$anchor4) => {
            var div_2 = root_25();
            var text_4 = child(div_2);
            reset(div_2);
            template_effect(
              ($0) => {
                set_style(div_2, `--bs-depth:${depth() + 1}`);
                set_attribute2(div_2, "data-depth", depth() + 1);
                set_text(text_4, `Show more (${$0 ?? ""} remaining)`);
              },
              [
                () => (group().entries.length - (get2(folderLimits)[key2()] ?? FOLDER_PAGE)).toLocaleString()
              ]
            );
            delegated("click", div_2, () => showMore(key2()));
            delegated("keydown", div_2, (e) => activate(e, () => showMore(key2())));
            append($$anchor4, div_2);
          };
          if_block(node_7, ($$render) => {
            if (group().entries.length > (get2(folderLimits)[key2()] ?? FOLDER_PAGE)) $$render(consequent_1);
          });
        }
        append($$anchor3, fragment_1);
      };
      var d_1 = user_derived(() => get2(expanded).has(key2()));
      if_block(node_2, ($$render) => {
        if (get2(d_1)) $$render(consequent_2);
      });
    }
    template_effect(
      ($0) => {
        set_style(div, `--bs-depth:${depth()}`);
        set_attribute2(div, "data-depth", depth());
        set_attribute2(div, "data-key", key2());
        set_text(text2, group().label);
        set_text(text_1, $0);
      },
      [() => group().entries.length.toLocaleString()]
    );
    delegated("click", div, () => toggleFolder(key2()));
    delegated("keydown", div, (e) => activate(e, () => toggleFolder(key2())));
    append($$anchor2, fragment);
  };
  let plugin = prop($$props, "plugin", 7);
  const FOLDER_PAGE = 150;
  let expanded = state(proxy(new Set(plugin().settings.ui.treeExpanded[$$props.sort] ?? [])));
  let folderLimits = state(proxy({}));
  function persistExpanded() {
    plugin().settings.ui.treeExpanded = {
      ...plugin().settings.ui.treeExpanded,
      [$$props.sort]: [...get2(expanded)]
    };
    void plugin().saveSettings();
  }
  function toggleFolder(key2) {
    const next2 = new Set(get2(expanded));
    if (next2.has(key2)) next2.delete(key2);
    else next2.add(key2);
    set(expanded, next2, true);
    persistExpanded();
  }
  function showMore(key2) {
    set(
      folderLimits,
      {
        ...get2(folderLimits),
        [key2]: (get2(folderLimits)[key2] ?? FOLDER_PAGE) + 300
      },
      true
    );
  }
  function activate(e, action2) {
    if (e.target !== e.currentTarget) return;
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      action2();
    }
  }
  function treeNav(node) {
    const handler = (e) => {
      if (!["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(e.key)) return;
      const rows = Array.from(node.querySelectorAll("[data-row]"));
      const idx = rows.indexOf(node.ownerDocument.activeElement);
      if (idx === -1) return;
      e.preventDefault();
      if (e.key === "ArrowUp" || e.key === "ArrowDown") {
        rows[idx + (e.key === "ArrowDown" ? 1 : -1)]?.focus();
        return;
      }
      const key2 = rows[idx].dataset.key;
      if (!key2) return;
      const open = get2(expanded).has(key2);
      if (e.key === "ArrowRight" && !open || e.key === "ArrowLeft" && open) toggleFolder(key2);
    };
    node.addEventListener("keydown", handler);
    return { destroy: () => node.removeEventListener("keydown", handler) };
  }
  let staleTotal = user_derived(() => $$props.model.stale.reduce((n, g) => n + g.entries.length, 0));
  function allKeys() {
    const keys = $$props.model.groups.map((g) => g.label);
    if (get2(staleTotal) > 0) {
      keys.push("__stale__");
      for (const g of $$props.model.stale) keys.push(`stale:${g.label}`);
    }
    return keys;
  }
  function expandAll() {
    set(expanded, new Set(allKeys()), true);
    persistExpanded();
  }
  function collapseAll() {
    set(expanded, /* @__PURE__ */ new Set(), true);
    persistExpanded();
  }
  var div_3 = root_63();
  var div_4 = child(div_3);
  var button = child(div_4);
  var node_8 = child(button);
  Icon(node_8, { name: "chevrons-up-down" });
  next();
  reset(button);
  var button_1 = sibling(button, 2);
  var node_9 = child(button_1);
  Icon(node_9, { name: "chevrons-down-up" });
  next();
  reset(button_1);
  reset(div_4);
  var node_10 = sibling(div_4, 2);
  each(node_10, 17, () => $$props.model.groups, (group) => group.label, ($$anchor2, group) => {
    folder($$anchor2, () => get2(group), () => get2(group).label, () => 0);
  });
  var node_11 = sibling(node_10, 2);
  {
    var consequent_4 = ($$anchor2) => {
      var fragment_3 = root_53();
      var div_5 = first_child(fragment_3);
      var node_12 = child(div_5);
      {
        let $0 = user_derived(() => get2(expanded).has("__stale__") ? "folder-open" : "folder");
        Icon(node_12, {
          get name() {
            return get2($0);
          }
        });
      }
      var span_5 = sibling(node_12, 4);
      var text_5 = child(span_5, true);
      reset(span_5);
      reset(div_5);
      var node_13 = sibling(div_5, 2);
      {
        var consequent_3 = ($$anchor3) => {
          var fragment_4 = comment();
          var node_14 = first_child(fragment_4);
          each(node_14, 17, () => $$props.model.stale, (group) => group.label, ($$anchor4, group) => {
            folder($$anchor4, () => get2(group), () => `stale:${get2(group).label}`, () => 1);
          });
          append($$anchor3, fragment_4);
        };
        var d_2 = user_derived(() => get2(expanded).has("__stale__"));
        if_block(node_13, ($$render) => {
          if (get2(d_2)) $$render(consequent_3);
        });
      }
      template_effect(($0) => set_text(text_5, $0), [() => get2(staleTotal).toLocaleString()]);
      delegated("click", div_5, () => toggleFolder("__stale__"));
      delegated("keydown", div_5, (e) => activate(e, () => toggleFolder("__stale__")));
      append($$anchor2, fragment_3);
    };
    if_block(node_11, ($$render) => {
      if (get2(staleTotal) > 0) $$render(consequent_4);
    });
  }
  reset(div_3);
  action(div_3, ($$node) => treeNav?.($$node));
  delegated("click", button, expandAll);
  delegated("click", button_1, collapseAll);
  append($$anchor, div_3);
  pop();
}
delegate(["click", "keydown"]);

// src/data/tree.ts
var DAY2 = 864e5;
var STALE_MS = 365 * DAY2;
var DOWNLOAD_BUCKETS = [
  { min: 3e6, label: "3M+" },
  { min: 2e6, label: "2M+" },
  { min: 1e6, label: "1M+" },
  { min: 5e5, label: "500k+" },
  { min: 1e5, label: "100k+" },
  { min: 5e4, label: "50k+" },
  { min: 1e4, label: "10k+" },
  { min: 0, label: "Under 10k" }
];
var UPDATED_BUCKETS = [
  { maxDays: 7, label: "This week" },
  { maxDays: 30, label: "This month" },
  { maxDays: 90, label: "Last 3 months" },
  { maxDays: 180, label: "Last 6 months" },
  { maxDays: 365, label: "This year" },
  { maxDays: Infinity, label: "Older" }
];
var TRENDING_BUCKETS = [
  { min: 1e5, label: "+100k or more" },
  { min: 5e4, label: "+50k or more" },
  { min: 1e4, label: "+10k or more" },
  { min: 1e3, label: "+1k or more" },
  { min: 1, label: "Growing" },
  { min: -Infinity, label: "No recent growth" }
];
var NAME_ORDER = [..."ABCDEFGHIJKLMNOPQRSTUVWXYZ", "#"];
var STAR_BUCKETS = [
  { min: 1e4, label: "10k+ stars" },
  { min: 1e3, label: "1k+ stars" },
  { min: 100, label: "100+ stars" },
  { min: 1, label: "Under 100 stars" },
  { min: 0, label: "No stars" }
];
var ISSUE_BUCKETS = [
  { min: 100, label: "100+ open issues" },
  { min: 10, label: "10+ open issues" },
  { min: 1, label: "1+ open issues" },
  { min: 0, label: "No open issues" }
];
var ADDED_BUCKETS = [
  { maxDays: 30, label: "Added this month" },
  { maxDays: 90, label: "Added last 3 months" },
  { maxDays: 365, label: "Added this year" },
  { maxDays: Infinity, label: "Added over a year ago" }
];
var NOT_SCANNED = "Not scanned yet";
function labelFor(entry, sort, ctx) {
  switch (sort) {
    case "downloads":
      return DOWNLOAD_BUCKETS.find((b) => entry.downloads >= b.min).label;
    case "updated": {
      if (!entry.updated) return "Unknown";
      const days = (ctx.now - entry.updated) / DAY2;
      return UPDATED_BUCKETS.find((b) => days <= b.maxDays).label;
    }
    case "trending": {
      const delta = ctx.trendingDeltas[entry.id] ?? 0;
      return TRENDING_BUCKETS.find((b) => delta >= b.min).label;
    }
    case "name": {
      const first = entry.name.trim().charAt(0).toUpperCase();
      return /[A-Z]/.test(first) ? first : "#";
    }
    case "stars": {
      const stat = ctx.repoStats[entry.repo];
      if (stat == null) return NOT_SCANNED;
      const stars = typeof stat.stars === "number" ? stat.stars : 0;
      return STAR_BUCKETS.find((b) => stars >= b.min).label;
    }
    case "issues": {
      const stat = ctx.repoStats[entry.repo];
      if (stat == null) return NOT_SCANNED;
      const issues = typeof stat.openIssues === "number" ? stat.openIssues : 0;
      return ISSUE_BUCKETS.find((b) => issues >= b.min).label;
    }
    case "added": {
      const stat = ctx.repoStats[entry.repo];
      if (stat == null || !stat.createdAt) return NOT_SCANNED;
      const days = (ctx.now - stat.createdAt) / DAY2;
      return ADDED_BUCKETS.find((b) => days <= b.maxDays).label;
    }
  }
}
function bucketOrder(sort) {
  switch (sort) {
    case "downloads":
      return DOWNLOAD_BUCKETS.map((b) => b.label);
    case "updated":
      return [...UPDATED_BUCKETS.map((b) => b.label), "Unknown"];
    case "trending":
      return TRENDING_BUCKETS.map((b) => b.label);
    case "name":
      return NAME_ORDER;
    case "stars":
      return [...STAR_BUCKETS.map((b) => b.label), NOT_SCANNED];
    case "issues":
      return [...ISSUE_BUCKETS.map((b) => b.label), NOT_SCANNED];
    case "added":
      return [...ADDED_BUCKETS.map((b) => b.label), NOT_SCANNED];
  }
}
function groupInOrder(entries, sort, ctx) {
  const byLabel = /* @__PURE__ */ new Map();
  for (const e of entries) {
    const label2 = labelFor(e, sort, ctx);
    const bucket = byLabel.get(label2);
    if (bucket) bucket.push(e);
    else byLabel.set(label2, [e]);
  }
  return bucketOrder(sort).filter((label2) => byLabel.has(label2)).map((label2) => ({ label: label2, entries: byLabel.get(label2) }));
}
function buildTree(entries, sort, ctx) {
  if (sort === "updated") {
    return { groups: groupInOrder(entries, sort, ctx), stale: [] };
  }
  const fresh = [];
  const stale = [];
  for (const e of entries) {
    (e.updated > 0 && ctx.now - e.updated > STALE_MS ? stale : fresh).push(e);
  }
  return {
    groups: groupInOrder(fresh, sort, ctx),
    stale: groupInOrder(stale, sort, ctx)
  };
}

// src/ui/StoreView.svelte
var root8 = from_html(`<button> </button>`);
var root_111 = from_html(`<button class="bs-refresh bs-scan-progress" title="Cancel the GitHub scan"><!> </button>`);
var root_26 = from_html(`<button class="bs-refresh"><!>Scan GitHub</button>`);
var root_36 = from_html(`<button title="Show or hide filters"><!>Filters</button> <!> <button class="bs-refresh"><!> </button>`, 1);
var root_46 = from_html(`<div class="bs-banner">Showing cached data \u2014 the registry could not be refreshed.</div>`);
var root_54 = from_html(`<div class="bs-banner bs-banner-info">Trending compares download counts across catalog refreshes, so it needs a couple of days of history \u2014 sorted by downloads for now.</div>`);
var root_64 = from_html(`<div class="bs-card bs-skeleton-card"><div class="bs-skel" style="width:55%"></div> <div class="bs-skel bs-skel-thin" style="width:90%"></div> <div class="bs-skel bs-skel-thin" style="width:70%"></div> <div class="bs-skel bs-skel-chip"></div></div>`);
var root_73 = from_html(`<div class="bs-body" aria-label="Loading plugin catalog"><main class="bs-main"><div class="bs-grid" aria-hidden="true"></div></main></div>`);
var root_83 = from_html(`<div class="bs-status bs-error"> </div>`);
var root_93 = from_html(`<div class="bs-body"><main class="bs-main"><!></main> <!></div>`);
var root_103 = from_html(`<div class="bs-author-filter"><!> <span>Plugins by <strong> </strong></span> <button class="bs-author-clear" title="Clear author filter" aria-label="Clear author filter"><!></button></div>`);
var root_113 = from_html(`<div class="bs-empty"><!> <p>No plugins match the current filters.</p> <button class="bs-empty-clear">Clear filters</button></div>`);
var root_124 = from_html(`<div class="bs-load-more"> </div>`);
var root_133 = from_html(`<div class="bs-grid"></div> <!>`, 1);
var root_143 = from_html(`<div><!> <main class="bs-main"><!> <div class="bs-count"> </div> <!></main> <!></div>`);
var root_152 = from_html(`<div class="bs-root"><header class="bs-header"><nav class="bs-tabs"></nav> <div class="bs-header-actions"><!> <button class="bs-refresh" title="Refresh catalog"><!>Refresh</button></div></header> <!> <!> <!></div>`);
function StoreView($$anchor, $$props) {
  push($$props, true);
  let plugin = prop($$props, "plugin", 7);
  let entries = state(proxy([]));
  let loading = state(true);
  let stale = state(false);
  let error = state(null);
  let tab = state(proxy(plugin().settings.ui.lastTab ?? "all"));
  let trendingDeltas = state(proxy({}));
  let installedIds = state(proxy(/* @__PURE__ */ new Set()));
  let newIds = state(proxy(/* @__PURE__ */ new Set()));
  let selected = state(null);
  let settingsTick = state(0);
  let tokenTick = state(0);
  let repoStats = state(proxy({}));
  let scanState = state(proxy(plugin().scanState));
  let filters = state(proxy({
    ...EMPTY_FILTER,
    sort: plugin().settings.defaultSort,
    hideInstalled: plugin().settings.hideInstalledByDefault
  }));
  const TABS = [
    { id: "all", label: "All" },
    { id: "trending", label: "Trending" },
    { id: "installed", label: "Installed" }
  ];
  let trendingReady = user_derived(() => Object.keys(get2(trendingDeltas)).length > 0);
  let hasToken = user_derived(() => {
    void get2(tokenTick);
    void get2(settingsTick);
    return plugin().service.hasGithubToken();
  });
  let requestedSort = user_derived(() => get2(tab) === "trending" ? "trending" : get2(filters).sort);
  let effectiveFilters = user_derived(() => ({
    ...get2(filters),
    sort: get2(requestedSort) === "trending" && !get2(trendingReady) ? "downloads" : get2(requestedSort)
  }));
  let favoriteIds = user_derived(() => {
    void get2(settingsTick);
    return new Set(plugin().settings.favoritePlugins);
  });
  let showNewBadges = user_derived(() => {
    void get2(settingsTick);
    return plugin().settings.showNewBadges;
  });
  let filterPresets = user_derived(() => {
    void get2(settingsTick);
    return plugin().settings.filterPresets;
  });
  let similar = user_derived(() => {
    void get2(settingsTick);
    return get2(selected) && plugin().settings.showSimilar ? similarPlugins(get2(selected), get2(entries), 5) : [];
  });
  user_effect(() => {
    const id = get2(selected)?.id;
    if (!id) return;
    untrack(() => {
      if (!plugin().settings.trackRecentlyViewed) return;
      const current = plugin().settings.ui.recentlyViewed;
      if (current[0] === id) return;
      plugin().settings.ui.recentlyViewed = [id, ...current.filter((r) => r !== id)].slice(0, 20);
      void plugin().saveSettings();
    });
  });
  const NO_INSTALLED = /* @__PURE__ */ new Set();
  let visible = user_derived(() => {
    void get2(settingsTick);
    return filterPlugins(get2(entries), get2(effectiveFilters), {
      installedIds: get2(effectiveFilters).hideInstalled ? get2(installedIds) : NO_INSTALLED,
      ignoredIds: new Set(plugin().settings.ignoredPlugins),
      ignoredAuthors: new Set(plugin().settings.ignoredAuthors),
      ignoredCategories: new Set(plugin().settings.ignoredCategories),
      favoriteIds: get2(favoriteIds),
      newIds: get2(newIds),
      trendingDeltas: get2(trendingDeltas),
      repoStats: get2(repoStats),
      now: Date.now()
    });
  });
  const PAGE_SIZE = 60;
  let renderLimit = state(PAGE_SIZE);
  let shown = user_derived(() => get2(visible).slice(0, get2(renderLimit)));
  const cardStars = new SvelteMap();
  const requestedStars = /* @__PURE__ */ new Set();
  let starsHalted = false;
  let starsEnabled = user_derived(() => {
    void get2(settingsTick);
    void get2(tokenTick);
    return plugin().settings.showCardStars && plugin().service.hasGithubToken();
  });
  user_effect(() => {
    const targets = get2(starsEnabled) && get2(layout) === "grid" && get2(tab) !== "installed" ? get2(shown) : [];
    untrack(() => void prefetchStars(targets));
  });
  async function prefetchStars(targets) {
    if (starsHalted) return;
    const queue = targets.filter((e) => !requestedStars.has(e.id));
    for (const e of queue) requestedStars.add(e.id);
    await Promise.all(Array.from({ length: 4 }, async () => {
      let entry;
      while (!starsHalted && (entry = queue.shift())) {
        try {
          cardStars.set(entry.id, (await plugin().service.getRepoStats(entry.repo)).stars);
        } catch {
          starsHalted = true;
        }
      }
    }));
  }
  let layout = state(proxy(plugin().settings.ui.layout));
  let showFilters = state(false);
  function toggleLayout() {
    set(layout, get2(layout) === "grid" ? "tree" : "grid", true);
    plugin().settings.ui.layout = get2(layout);
    void plugin().saveSettings();
  }
  let tree = user_derived(() => get2(layout) === "tree" ? buildTree(get2(visible), get2(effectiveFilters).sort, {
    now: Date.now(),
    trendingDeltas: get2(trendingDeltas),
    repoStats: get2(repoStats)
  }) : null);
  function loadMoreSentinel(node) {
    const win = node.ownerDocument.defaultView ?? window;
    const observer = new win.IntersectionObserver(
      (intersections) => {
        if (intersections.some((i) => i.isIntersecting) && get2(renderLimit) < get2(visible).length) {
          set(renderLimit, get2(renderLimit) + PAGE_SIZE);
        }
      },
      { rootMargin: "600px" }
    );
    observer.observe(node);
    return { destroy: () => observer.disconnect() };
  }
  function gridNav(node) {
    const handler = (e) => {
      if (!["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"].includes(e.key)) return;
      const cards = Array.from(node.querySelectorAll(".bs-card"));
      const idx = cards.indexOf(node.ownerDocument.activeElement);
      if (idx === -1) return;
      e.preventDefault();
      let target;
      if (e.key === "ArrowLeft") target = cards[idx - 1];
      else if (e.key === "ArrowRight") target = cards[idx + 1];
      else {
        const rect = cards[idx].getBoundingClientRect();
        const down = e.key === "ArrowDown";
        let bestScore = Infinity;
        for (const card of cards) {
          const r = card.getBoundingClientRect();
          if (down ? r.top <= rect.top + 1 : r.top >= rect.top - 1) continue;
          const score = Math.abs(r.top - rect.top) * 1e4 + Math.abs(r.left - rect.left);
          if (score < bestScore) {
            bestScore = score;
            target = card;
          }
        }
      }
      target?.focus();
    };
    node.addEventListener("keydown", handler);
    return { destroy: () => node.removeEventListener("keydown", handler) };
  }
  async function load(force = false) {
    set(loading, true);
    set(error, null);
    try {
      const catalog = await plugin().service.loadCatalog(force);
      set(entries, catalog.entries, true);
      set(stale, catalog.stale, true);
      set(trendingDeltas, await plugin().service.getTrendingDeltas(), true);
      set(newIds, await plugin().service.getNewIds(NEW_WINDOW_DAYS), true);
      set(installedIds, getInstalledIds(plugin().app), true);
      set(repoStats, await plugin().service.getAllRepoStats(), true);
    } catch (e) {
      set(error, e instanceof Error ? e.message : String(e), true);
    } finally {
      set(loading, false);
      if (plugin().pendingDetailId) showDetail(plugin().pendingDetailId);
    }
  }
  async function refreshRepoStats() {
    set(repoStats, await plugin().service.getAllRepoStats(), true);
  }
  function startScan() {
    void plugin().startCatalogScan();
  }
  function showDetail(id) {
    const entry = get2(entries).find((e) => e.id === id);
    if (!entry) return;
    plugin().pendingDetailId = null;
    set(selected, entry, true);
  }
  function openIgnoreMenu(e, entry) {
    const menu = new import_obsidian6.Menu();
    menu.addItem((item) => item.setTitle(`Ignore "${entry.name}"`).setIcon("x").onClick(async () => {
      if (!plugin().settings.ignoredPlugins.includes(entry.id)) {
        plugin().settings.ignoredPlugins = [...plugin().settings.ignoredPlugins, entry.id];
        await plugin().saveSettings();
      }
      if (get2(selected)?.id === entry.id) set(selected, null);
    }));
    menu.addItem((item) => item.setTitle(`Ignore author "${entry.author}"`).setIcon("user-x").onClick(async () => {
      if (!plugin().settings.ignoredAuthors.includes(entry.author)) {
        plugin().settings.ignoredAuthors = [...plugin().settings.ignoredAuthors, entry.author];
        await plugin().saveSettings();
      }
      if (get2(selected)?.author === entry.author) set(selected, null);
    }));
    for (const cat of entry.categories) {
      menu.addItem((item) => item.setTitle(`Ignore category "${cat}"`).setIcon("tag").onClick(async () => {
        if (!plugin().settings.ignoredCategories.includes(cat)) {
          plugin().settings.ignoredCategories = [...plugin().settings.ignoredCategories, cat];
          await plugin().saveSettings();
        }
        if (get2(selected)?.categories.includes(cat)) set(selected, null);
      }));
    }
    menu.showAtMouseEvent(e);
  }
  function savePreset() {
    new NameModal(plugin().app, "Save filter preset", (name) => {
      const withoutSameName = plugin().settings.filterPresets.filter((p) => p.name !== name);
      plugin().settings.filterPresets = [...withoutSameName, { name, state: { ...get2(filters) } }];
      void plugin().saveSettings();
      new import_obsidian6.Notice(`Preset "${name}" saved.`);
    }).open();
  }
  function resetFilters() {
    set(filters, { ...EMPTY_FILTER, sort: plugin().settings.defaultSort }, true);
    set(renderLimit, PAGE_SIZE);
  }
  function setTab(next2) {
    set(tab, next2, true);
    set(selected, null);
    set(renderLimit, PAGE_SIZE);
    plugin().settings.ui.lastTab = next2;
    void plugin().saveSettings();
  }
  function drillAuthor(author) {
    set(filters, { ...EMPTY_FILTER, sort: get2(filters).sort, author }, true);
    set(renderLimit, PAGE_SIZE);
    setTab("all");
  }
  function clearAuthor() {
    set(filters, { ...get2(filters), author: "" }, true);
    set(renderLimit, PAGE_SIZE);
  }
  async function toggleFavorite(id) {
    plugin().settings.favoritePlugins = plugin().settings.favoritePlugins.includes(id) ? plugin().settings.favoritePlugins.filter((f) => f !== id) : [...plugin().settings.favoritePlugins, id];
    await plugin().saveSettings();
  }
  let lastHideInstalledDefault = plugin().settings.hideInstalledByDefault;
  onMount(() => {
    void load();
    const installedPoll = window.setInterval(
      () => {
        const fresh = getInstalledIds(plugin().app);
        if (fresh.size !== get2(installedIds).size || [...fresh].some((id) => !get2(installedIds).has(id))) {
          set(installedIds, fresh, true);
        }
      },
      2e3
    );
    const unsubscribeSettings = plugin().registerSettingsListener(() => {
      if (plugin().settings.hideInstalledByDefault !== lastHideInstalledDefault) {
        lastHideInstalledDefault = plugin().settings.hideInstalledByDefault;
        set(
          filters,
          {
            ...get2(filters),
            hideInstalled: plugin().settings.hideInstalledByDefault
          },
          true
        );
      }
      set(settingsTick, get2(settingsTick) + 1);
    });
    const unsubscribeDetail = plugin().registerDetailListener((id) => showDetail(id));
    const unsubscribeToken = plugin().registerTokenListener(() => {
      requestedStars.clear();
      starsHalted = false;
      set(tokenTick, get2(tokenTick) + 1);
    });
    let lastStatsRefresh = 0;
    const unsubscribeScan = plugin().registerScanListener(() => {
      set(scanState, { ...plugin().scanState }, true);
      const now = Date.now();
      if (!plugin().scanState.running || now - lastStatsRefresh >= 5e3) {
        lastStatsRefresh = now;
        void refreshRepoStats();
      }
    });
    const onEscape = (e) => {
      if (e.key === "Escape" && get2(selected)) {
        set(selected, null);
        e.stopPropagation();
      }
    };
    $$props.view.contentEl.addEventListener("keydown", onEscape);
    return () => {
      window.clearInterval(installedPoll);
      unsubscribeSettings();
      unsubscribeDetail();
      unsubscribeToken();
      unsubscribeScan();
      $$props.view.contentEl.removeEventListener("keydown", onEscape);
    };
  });
  var div = root_152();
  var header = child(div);
  var nav = child(header);
  each(nav, 21, () => TABS, (t) => t.id, ($$anchor2, t) => {
    var button = root8();
    let classes;
    var text2 = child(button, true);
    reset(button);
    template_effect(() => {
      classes = set_class(button, 1, "bs-tab", null, classes, { "bs-tab-active": get2(tab) === get2(t).id });
      set_attribute2(button, "aria-pressed", get2(tab) === get2(t).id);
      set_text(text2, get2(t).label);
    });
    delegated("click", button, () => setTab(get2(t).id));
    append($$anchor2, button);
  });
  reset(nav);
  var div_1 = sibling(nav, 2);
  var node_1 = child(div_1);
  {
    var consequent_1 = ($$anchor2) => {
      var fragment = root_36();
      var button_1 = first_child(fragment);
      let classes_1;
      var node_2 = child(button_1);
      Icon(node_2, { name: "sliders-horizontal" });
      next();
      reset(button_1);
      var node_3 = sibling(button_1, 2);
      {
        var consequent = ($$anchor3) => {
          var button_2 = root_111();
          var node_4 = child(button_2);
          Icon(node_4, { name: "loader" });
          var text_1 = sibling(node_4);
          reset(button_2);
          template_effect(($0, $1) => set_text(text_1, `Scanning ${$0 ?? ""}/${$1 ?? ""} \xB7 Cancel`), [
            () => get2(scanState).done.toLocaleString(),
            () => get2(scanState).total.toLocaleString()
          ]);
          delegated("click", button_2, () => plugin().cancelCatalogScan());
          append($$anchor3, button_2);
        };
        var alternate = ($$anchor3) => {
          var button_3 = root_26();
          var node_5 = child(button_3);
          Icon(node_5, { name: "github" });
          next();
          reset(button_3);
          template_effect(() => {
            set_attribute2(button_3, "title", get2(hasToken) ? "Fetch GitHub stars & open issues for the whole catalog so you can sort by them" : "Link a GitHub token in settings to scan the catalog (the 60/hour anonymous limit is too low)");
            button_3.disabled = !get2(hasToken);
          });
          delegated("click", button_3, startScan);
          append($$anchor3, button_3);
        };
        if_block(node_3, ($$render) => {
          if (get2(scanState).running) $$render(consequent);
          else $$render(alternate, -1);
        });
      }
      var button_4 = sibling(node_3, 2);
      var node_6 = child(button_4);
      {
        let $0 = user_derived(() => get2(layout) === "grid" ? "list-tree" : "layout-grid");
        Icon(node_6, {
          get name() {
            return get2($0);
          }
        });
      }
      var text_2 = sibling(node_6, 1, true);
      reset(button_4);
      template_effect(() => {
        classes_1 = set_class(button_1, 1, "bs-refresh bs-filters-toggle", null, classes_1, { "bs-tab-active": get2(showFilters) });
        set_attribute2(button_1, "aria-pressed", get2(showFilters));
        set_attribute2(button_4, "title", get2(layout) === "grid" ? "Switch to tree view" : "Switch to grid view");
        set_attribute2(button_4, "aria-label", get2(layout) === "grid" ? "Switch to tree view" : "Switch to grid view");
        set_text(text_2, get2(layout) === "grid" ? "Tree" : "Grid");
      });
      delegated("click", button_1, () => set(showFilters, !get2(showFilters)));
      delegated("click", button_4, toggleLayout);
      append($$anchor2, fragment);
    };
    if_block(node_1, ($$render) => {
      if (get2(tab) !== "installed") $$render(consequent_1);
    });
  }
  var button_5 = sibling(node_1, 2);
  var node_7 = child(button_5);
  Icon(node_7, { name: "refresh-cw" });
  next();
  reset(button_5);
  reset(div_1);
  reset(header);
  var node_8 = sibling(header, 2);
  {
    var consequent_2 = ($$anchor2) => {
      var div_2 = root_46();
      append($$anchor2, div_2);
    };
    if_block(node_8, ($$render) => {
      if (get2(stale)) $$render(consequent_2);
    });
  }
  var node_9 = sibling(node_8, 2);
  {
    var consequent_3 = ($$anchor2) => {
      var div_3 = root_54();
      append($$anchor2, div_3);
    };
    if_block(node_9, ($$render) => {
      if (get2(requestedSort) === "trending" && !get2(loading) && !get2(trendingReady)) $$render(consequent_3);
    });
  }
  var node_10 = sibling(node_9, 2);
  {
    var consequent_4 = ($$anchor2) => {
      var div_4 = root_73();
      var main = child(div_4);
      var div_5 = child(main);
      each(div_5, 20, () => Array(12), index, ($$anchor3, _) => {
        var div_6 = root_64();
        append($$anchor3, div_6);
      });
      reset(div_5);
      reset(main);
      reset(div_4);
      append($$anchor2, div_4);
    };
    var consequent_5 = ($$anchor2) => {
      var div_7 = root_83();
      var text_3 = child(div_7);
      reset(div_7);
      template_effect(() => set_text(text_3, `Failed to load the plugin catalog: ${get2(error) ?? ""}`));
      append($$anchor2, div_7);
    };
    var consequent_7 = ($$anchor2) => {
      var div_8 = root_93();
      var main_1 = child(div_8);
      var node_11 = child(main_1);
      InstalledTab(node_11, {
        get plugin() {
          return plugin();
        },
        get entries() {
          return get2(entries);
        },
        onSelect: (entry) => set(selected, entry, true)
      });
      reset(main_1);
      var node_12 = sibling(main_1, 2);
      {
        var consequent_6 = ($$anchor3) => {
          {
            let $0 = user_derived(() => get2(installedIds).has(get2(selected).id));
            let $1 = user_derived(() => get2(favoriteIds).has(get2(selected).id));
            DetailPane($$anchor3, {
              get plugin() {
                return plugin();
              },
              get view() {
                return $$props.view;
              },
              get refreshTick() {
                return get2(tokenTick);
              },
              get entry() {
                return get2(selected);
              },
              get installed() {
                return get2($0);
              },
              get starred() {
                return get2($1);
              },
              get similar() {
                return get2(similar);
              },
              onSelectEntry: (entry) => set(selected, entry, true),
              onToggleStar: () => void toggleFavorite(get2(selected).id),
              onDrillAuthor: drillAuthor,
              onClose: () => set(selected, null)
            });
          }
        };
        if_block(node_12, ($$render) => {
          if (get2(selected)) $$render(consequent_6);
        });
      }
      reset(div_8);
      append($$anchor2, div_8);
    };
    var alternate_2 = ($$anchor2) => {
      var div_9 = root_143();
      let classes_2;
      var node_13 = child(div_9);
      {
        let $0 = user_derived(() => get2(tab) === "all");
        FilterSidebar(node_13, {
          get filters() {
            return get2(filters);
          },
          get showSort() {
            return get2($0);
          },
          get presets() {
            return get2(filterPresets);
          },
          onChange: (next2) => {
            set(filters, next2, true);
            set(renderLimit, PAGE_SIZE);
          },
          onSavePreset: savePreset
        });
      }
      var main_2 = sibling(node_13, 2);
      var node_14 = child(main_2);
      {
        var consequent_8 = ($$anchor3) => {
          var div_10 = root_103();
          var node_15 = child(div_10);
          Icon(node_15, { name: "user" });
          var span = sibling(node_15, 2);
          var strong = sibling(child(span));
          var text_4 = child(strong, true);
          reset(strong);
          reset(span);
          var button_6 = sibling(span, 2);
          var node_16 = child(button_6);
          Icon(node_16, { name: "x" });
          reset(button_6);
          reset(div_10);
          template_effect(() => set_text(text_4, get2(filters).author));
          delegated("click", button_6, clearAuthor);
          append($$anchor3, div_10);
        };
        if_block(node_14, ($$render) => {
          if (get2(filters).author) $$render(consequent_8);
        });
      }
      var div_11 = sibling(node_14, 2);
      var text_5 = child(div_11);
      reset(div_11);
      var node_17 = sibling(div_11, 2);
      {
        var consequent_9 = ($$anchor3) => {
          var div_12 = root_113();
          var node_18 = child(div_12);
          Icon(node_18, { name: "search-x" });
          var button_7 = sibling(node_18, 4);
          reset(div_12);
          delegated("click", button_7, resetFilters);
          append($$anchor3, div_12);
        };
        var consequent_10 = ($$anchor3) => {
          var fragment_2 = comment();
          var node_19 = first_child(fragment_2);
          key(node_19, () => get2(effectiveFilters).sort, ($$anchor4) => {
            TreeView($$anchor4, {
              get model() {
                return get2(tree);
              },
              get sort() {
                return get2(effectiveFilters).sort;
              },
              get plugin() {
                return plugin();
              },
              get selected() {
                return get2(selected);
              },
              get installedIds() {
                return get2(installedIds);
              },
              onSelect: (entry) => set(selected, entry, true)
            });
          });
          append($$anchor3, fragment_2);
        };
        var alternate_1 = ($$anchor3) => {
          var fragment_4 = root_133();
          var div_13 = first_child(fragment_4);
          each(div_13, 21, () => get2(shown), (entry) => entry.id, ($$anchor4, entry) => {
            {
              let $0 = user_derived(() => get2(installedIds).has(get2(entry).id));
              let $1 = user_derived(() => get2(selected)?.id === get2(entry).id);
              let $2 = user_derived(() => get2(favoriteIds).has(get2(entry).id));
              let $3 = user_derived(() => get2(showNewBadges) && get2(newIds).has(get2(entry).id));
              let $4 = user_derived(() => cardStars.get(get2(entry).id) ?? get2(repoStats)[get2(entry).repo]?.stars);
              PluginCard($$anchor4, {
                get entry() {
                  return get2(entry);
                },
                get installed() {
                  return get2($0);
                },
                get selected() {
                  return get2($1);
                },
                get starred() {
                  return get2($2);
                },
                get isNew() {
                  return get2($3);
                },
                get stars() {
                  return get2($4);
                },
                onSelect: () => set(selected, get2(entry), true),
                onToggleStar: () => void toggleFavorite(get2(entry).id),
                onIgnore: (e) => openIgnoreMenu(e, get2(entry)),
                onAuthor: () => drillAuthor(get2(entry).author)
              });
            }
          });
          reset(div_13);
          action(div_13, ($$node) => gridNav?.($$node));
          var node_20 = sibling(div_13, 2);
          {
            var consequent_11 = ($$anchor4) => {
              var div_14 = root_124();
              var text_6 = child(div_14);
              reset(div_14);
              action(div_14, ($$node) => loadMoreSentinel?.($$node));
              template_effect(($0, $1) => set_text(text_6, `Showing ${$0 ?? ""} of ${$1 ?? ""} \u2014 scroll for more`), [
                () => get2(renderLimit).toLocaleString(),
                () => get2(visible).length.toLocaleString()
              ]);
              append($$anchor4, div_14);
            };
            if_block(node_20, ($$render) => {
              if (get2(renderLimit) < get2(visible).length) $$render(consequent_11);
            });
          }
          append($$anchor3, fragment_4);
        };
        if_block(node_17, ($$render) => {
          if (get2(visible).length === 0) $$render(consequent_9);
          else if (get2(tree)) $$render(consequent_10, 1);
          else $$render(alternate_1, -1);
        });
      }
      reset(main_2);
      var node_21 = sibling(main_2, 2);
      {
        var consequent_12 = ($$anchor3) => {
          {
            let $0 = user_derived(() => get2(installedIds).has(get2(selected).id));
            let $1 = user_derived(() => get2(favoriteIds).has(get2(selected).id));
            DetailPane($$anchor3, {
              get plugin() {
                return plugin();
              },
              get view() {
                return $$props.view;
              },
              get refreshTick() {
                return get2(tokenTick);
              },
              get entry() {
                return get2(selected);
              },
              get installed() {
                return get2($0);
              },
              get starred() {
                return get2($1);
              },
              get similar() {
                return get2(similar);
              },
              onSelectEntry: (entry) => set(selected, entry, true),
              onToggleStar: () => void toggleFavorite(get2(selected).id),
              onDrillAuthor: drillAuthor,
              onClose: () => set(selected, null)
            });
          }
        };
        if_block(node_21, ($$render) => {
          if (get2(selected)) $$render(consequent_12);
        });
      }
      reset(div_9);
      template_effect(
        ($0) => {
          classes_2 = set_class(div_9, 1, "bs-body", null, classes_2, { "bs-filters-open": get2(showFilters) });
          set_text(text_5, `${$0 ?? ""} plugins`);
        },
        [() => get2(visible).length.toLocaleString()]
      );
      append($$anchor2, div_9);
    };
    if_block(node_10, ($$render) => {
      if (get2(loading)) $$render(consequent_4);
      else if (get2(error)) $$render(consequent_5, 1);
      else if (get2(tab) === "installed") $$render(consequent_7, 2);
      else $$render(alternate_2, -1);
    });
  }
  reset(div);
  template_effect(() => button_5.disabled = get2(loading));
  delegated("click", button_5, () => void load(true));
  append($$anchor, div);
  pop();
}
delegate(["click"]);

// src/view.ts
var VIEW_TYPE_BETTER_STORE = "better-store-view";
var BetterStoreView = class extends import_obsidian7.ItemView {
  constructor(leaf, plugin) {
    super(leaf);
    this.plugin = plugin;
    this.navigation = false;
  }
  component = null;
  getViewType() {
    return VIEW_TYPE_BETTER_STORE;
  }
  getDisplayText() {
    return "Better Store";
  }
  getIcon() {
    return "store";
  }
  async onOpen() {
    this.contentEl.empty();
    this.contentEl.addClass("better-store");
    this.component = mount(StoreView, {
      target: this.contentEl,
      props: { plugin: this.plugin, view: this }
    });
  }
  async onClose() {
    if (this.component) {
      await unmount(this.component);
      this.component = null;
    }
  }
};

// src/ui/QuickJumpModal.ts
var import_obsidian8 = require("obsidian");
var QuickJumpModal = class extends import_obsidian8.FuzzySuggestModal {
  constructor(app, entries, onChoose) {
    super(app);
    this.entries = entries;
    this.onChoose = onChoose;
    this.setPlaceholder("Search community plugins\u2026");
    this.setInstructions([
      { command: "\u2191\u2193", purpose: "navigate" },
      { command: "\u21B5", purpose: "open in Better Store" },
      { command: "esc", purpose: "dismiss" }
    ]);
    this.limit = 30;
  }
  getItems() {
    return this.entries;
  }
  getItemText(entry) {
    return `${entry.name} \u2014 ${entry.author}`;
  }
  onChooseItem(entry) {
    this.onChoose(entry);
  }
};

// src/main.ts
var GITHUB_TOKEN_SECRET = "better-store-github-token";
var BetterStorePlugin = class extends import_obsidian9.Plugin {
  settings = DEFAULT_SETTINGS;
  service;
  /** Set when a detail view is requested before the store view has loaded. */
  pendingDetailId = null;
  settingsListeners = [];
  detailListeners = [];
  tokenListeners = [];
  scanListeners = [];
  /** Live progress of a catalog-wide GitHub stats scan. */
  scanState = {
    running: false,
    done: 0,
    total: 0,
    rateLimited: false
  };
  scanCancelled = false;
  lastScanNotify = 0;
  serviceKey = "";
  ribbonEl = null;
  lastNotifiedUpdateCount = 0;
  async onload() {
    await this.loadSettings();
    this.service = this.createService();
    this.serviceKey = this.currentServiceKey();
    this.addSettingTab(new BetterStoreSettingTab(this.app, this));
    this.registerView(VIEW_TYPE_BETTER_STORE, (leaf) => new BetterStoreView(leaf, this));
    this.ribbonEl = this.addRibbonIcon("store", "Open Better Store", () => void this.activateView());
    this.addCommand({ id: "open", name: "Open store", callback: () => void this.activateView() });
    this.addCommand({
      id: "search-plugins",
      name: "Search plugins",
      callback: () => void this.openQuickJump()
    });
    this.addCommand({
      id: "export-plugin-list",
      name: "Export plugin list (Markdown)",
      callback: () => void this.exportPluginList("markdown")
    });
    this.addCommand({
      id: "export-plugin-list-json",
      name: "Export plugin list (JSON)",
      callback: () => void this.exportPluginList("json")
    });
    this.addCommand({
      id: "import-plugin-list",
      name: "Import plugin list",
      callback: () => new ImportModal(this.app, this).open()
    });
    this.addCommand({
      id: "apply-profile",
      name: "Apply plugin profile",
      callback: () => new ProfileSuggestModal(this.app, this).open()
    });
    this.addCommand({
      id: "scan-catalog",
      name: "Scan catalog for GitHub stars & issues",
      callback: () => void this.startCatalogScan()
    });
    this.app.workspace.onLayoutReady(() => {
      if (this.settings.backgroundUpdateCheck) {
        void this.checkForUpdates();
      }
      this.registerInterval(
        window.setInterval(() => {
          if (this.settings.backgroundUpdateCheck) void this.checkForUpdates();
        }, Math.max(1, this.settings.cacheTtlHours) * 36e5)
      );
    });
  }
  onunload() {
    this.scanCancelled = true;
  }
  async openQuickJump() {
    try {
      const catalog = await this.service.loadCatalog();
      const rank = new Map(this.settings.ui.recentlyViewed.map((id, i) => [id, i]));
      const entries = this.settings.trackRecentlyViewed ? [...catalog.entries].sort((a, b) => (rank.get(a.id) ?? Infinity) - (rank.get(b.id) ?? Infinity)) : catalog.entries;
      new QuickJumpModal(this.app, entries, (entry) => void this.openPluginDetail(entry.id)).open();
    } catch {
      new import_obsidian9.Notice("Better Store: could not load the plugin catalog.");
    }
  }
  async exportPluginList(format) {
    const api = getPluginsApi(this.app);
    const list = buildExportList(api.manifests, new Set(api.enabledPlugins));
    const text2 = format === "json" ? exportJson(list) : exportMarkdown(list, (/* @__PURE__ */ new Date()).toISOString().slice(0, 10));
    try {
      await navigator.clipboard.writeText(text2);
      new import_obsidian9.Notice(`Better Store: copied ${list.length} plugins to the clipboard as ${format === "json" ? "JSON" : "Markdown"}.`);
    } catch {
      new import_obsidian9.Notice("Better Store: could not write to the clipboard \u2014 click into Obsidian and try again.");
    }
  }
  /** Enable/disable installed plugins to match a saved profile. */
  async applyProfile(profile) {
    const api = getPluginsApi(this.app);
    const diff = diffProfile(
      profile.pluginIds,
      new Set(api.enabledPlugins),
      new Set(Object.keys(api.manifests)),
      this.manifest.id
    );
    try {
      for (const id of diff.toEnable) await api.enablePluginAndSave(id);
      for (const id of diff.toDisable) await api.disablePluginAndSave(id);
      const missing = diff.missing.length > 0 ? `, ${diff.missing.length} not installed` : "";
      new import_obsidian9.Notice(`Profile "${profile.name}": ${diff.toEnable.length} enabled, ${diff.toDisable.length} disabled${missing}.`);
    } catch (e) {
      new import_obsidian9.Notice(`Profile "${profile.name}" failed: ${e instanceof Error ? e.message : String(e)}`);
    }
  }
  /** Open (or reveal) the store and show the given plugin's detail pane. */
  async openPluginDetail(id) {
    this.pendingDetailId = id;
    await this.activateView();
    for (const cb of this.detailListeners) cb(id);
  }
  registerDetailListener(cb) {
    this.detailListeners.push(cb);
    return () => {
      this.detailListeners = this.detailListeners.filter((c) => c !== cb);
    };
  }
  /** Count installed catalog plugins with actionable upstream updates; badge the ribbon. */
  async checkForUpdates() {
    try {
      const catalog = await this.service.loadCatalog();
      const byId = new Map(catalog.entries.map((e) => [e.id, e]));
      const manifests = getPluginsApi(this.app).manifests;
      const prefs = this.updatePrefs();
      let count = 0;
      await Promise.all(
        Object.values(manifests).map(async (m) => {
          if (m.id === this.manifest.id) return;
          const entry = byId.get(m.id);
          if (!entry) return;
          const latest = await this.service.getLatestVersion(entry.repo);
          if (latest != null && compareVersions(latest, m.version) > 0 && isUpdateActionable(m.id, latest, prefs)) {
            count++;
          }
        })
      );
      const muted = isMuted(prefs, Date.now());
      const shown = muted ? 0 : count;
      this.ribbonEl?.toggleClass("bs-ribbon-updates", shown > 0);
      this.ribbonEl?.setAttribute(
        "aria-label",
        shown > 0 ? `Better Store \u2014 ${shown} update${shown === 1 ? "" : "s"} available` : "Open Better Store"
      );
      if (this.settings.updateNotice && !muted && count > this.lastNotifiedUpdateCount) {
        new import_obsidian9.Notice(`Better Store: ${count} plugin update${count === 1 ? "" : "s"} available.`);
      }
      this.lastNotifiedUpdateCount = count;
      return count;
    } catch {
      return 0;
    }
  }
  /** Current update-suppression preferences from settings. */
  updatePrefs() {
    return {
      ignored: this.settings.updateIgnored,
      skipped: this.settings.updateSkipped,
      muteUntil: this.settings.muteUpdatesUntil
    };
  }
  /** Suppress this specific version; it resurfaces once a newer one ships. */
  async skipUpdate(id, version) {
    this.settings.updateSkipped = { ...this.settings.updateSkipped, [id]: version };
    await this.saveSettings();
    await this.checkForUpdates();
  }
  /** Never flag updates for this plugin again. */
  async ignorePluginUpdates(id) {
    if (!this.settings.updateIgnored.includes(id)) {
      this.settings.updateIgnored = [...this.settings.updateIgnored, id];
      await this.saveSettings();
      await this.checkForUpdates();
    }
  }
  /** Silence all proactive update nags until the chosen duration elapses. */
  async muteUpdates(choice) {
    this.settings.muteUpdatesUntil = muteDeadline(choice, Date.now());
    await this.saveSettings();
    await this.checkForUpdates();
  }
  async unmuteUpdates() {
    this.settings.muteUpdatesUntil = 0;
    await this.saveSettings();
    await this.checkForUpdates();
  }
  /**
   * Read BRAT's own data file (read-only) to list the beta plugins it tracks.
   * Better Store never writes another plugin's files — beta actions hand off to
   * BRAT's own commands. Returns null when BRAT hasn't stored anything.
   */
  async readBratData() {
    const path = `${this.app.vault.configDir}/plugins/${BRAT_PLUGIN_ID}/data.json`;
    try {
      const adapter = this.app.vault.adapter;
      if (!await adapter.exists(path)) return null;
      return JSON.parse(await adapter.read(path));
    } catch {
      return null;
    }
  }
  async activateView() {
    const existing = this.app.workspace.getLeavesOfType(VIEW_TYPE_BETTER_STORE)[0];
    if (existing) {
      await this.app.workspace.revealLeaf(existing);
      return;
    }
    const location = this.settings.openLocation === "window" && !import_obsidian9.Platform.isDesktopApp ? "tab" : this.settings.openLocation;
    const leaf = this.app.workspace.getLeaf(location);
    await leaf.setViewState({ type: VIEW_TYPE_BETTER_STORE, active: true });
    await this.app.workspace.revealLeaf(leaf);
  }
  createService() {
    const adapter = this.app.vault.adapter;
    const io = {
      readFile: async (path) => await adapter.exists(path) ? adapter.read(path) : null,
      writeFile: (path, data) => adapter.write(path, data),
      fetchText: async (url, headers) => {
        const res = await (0, import_obsidian9.requestUrl)({ url, headers, throw: false });
        if (res.status >= 400) throw new Error(`HTTP ${res.status} for ${url}`);
        return res.text;
      },
      now: () => Date.now()
    };
    return new DataService(io, this.manifest.dir ?? ".", {
      ttlMs: this.settings.cacheTtlHours * 36e5,
      githubToken: this.getGithubToken() || void 0
    });
  }
  /** Resolve the GitHub token from the secret the user linked in settings. */
  getGithubToken() {
    const id = this.settings.githubSecretId;
    return id ? this.app.secretStorage.getSecret(id) ?? "" : "";
  }
  /** Store which secret holds the GitHub token and refresh the service. */
  async setGithubSecretId(id) {
    this.settings.githubSecretId = id;
    await this.saveSettings();
    this.service = this.createService();
  }
  /**
   * Check the linked token against the GitHub API and report the result in a
   * notice. Returns whether the token was accepted.
   */
  async testGithubToken() {
    const id = this.settings.githubSecretId;
    if (id && this.app.secretStorage.getSecret(id) == null) {
      new import_obsidian9.Notice(`The linked secret "${id}" no longer exists \u2014 link another one.`);
      return false;
    }
    const token = this.getGithubToken();
    try {
      const res = await (0, import_obsidian9.requestUrl)({
        url: "https://api.github.com/rate_limit",
        headers: token ? { Authorization: `Bearer ${token}` } : void 0,
        throw: false
      });
      const check = summarizeTokenCheck(token !== "", res.status, res.text);
      new import_obsidian9.Notice(check.message);
      return check.valid;
    } catch {
      new import_obsidian9.Notice("Could not reach the GitHub API \u2014 check your connection.");
      return false;
    }
  }
  /**
   * A token was just linked and verified: put it to work right away.
   * Open views re-fetch GitHub data that may have failed on the anonymous
   * rate limit, and the update check reruns now that it can afford to.
   */
  onTokenLinked() {
    for (const cb of this.tokenListeners) cb();
    if (this.settings.backgroundUpdateCheck) void this.checkForUpdates();
  }
  registerTokenListener(cb) {
    this.tokenListeners.push(cb);
    return () => {
      this.tokenListeners = this.tokenListeners.filter((c) => c !== cb);
    };
  }
  registerScanListener(cb) {
    this.scanListeners.push(cb);
    return () => {
      this.scanListeners = this.scanListeners.filter((c) => c !== cb);
    };
  }
  notifyScan() {
    for (const cb of this.scanListeners) cb();
  }
  /**
   * Scan every catalog plugin's GitHub repo for stars + open issues, filling the
   * persistent cache so the whole catalog can be sorted/filtered by those metrics.
   * Requires a token (60/hour is impractical for thousands of repos); resumable and
   * incremental, so a paused or cancelled scan continues where it left off.
   */
  async startCatalogScan() {
    if (this.scanState.running) {
      new import_obsidian9.Notice("Better Store: a catalog scan is already running.");
      return;
    }
    if (!this.service.hasGithubToken()) {
      new import_obsidian9.Notice("Better Store: link a GitHub token in settings before scanning the catalog.");
      return;
    }
    let repos;
    try {
      repos = (await this.service.loadCatalog()).entries.map((e) => e.repo);
    } catch {
      new import_obsidian9.Notice("Better Store: could not load the catalog to scan.");
      return;
    }
    new import_obsidian9.Notice("Better Store: catalog scan started. Progress and a Cancel button are in the store header.");
    this.scanCancelled = false;
    this.scanState = { running: true, done: 0, total: 0, rateLimited: false };
    this.notifyScan();
    const maxAgeMs = Math.max(1, this.settings.scanMaxAgeDays) * 864e5;
    const res = await this.service.scanRepos(repos, {
      maxAgeMs,
      onProgress: (done, total) => {
        this.scanState = { running: true, done, total, rateLimited: false };
        const now = Date.now();
        if (now - this.lastScanNotify >= 500) {
          this.lastScanNotify = now;
          this.notifyScan();
        }
      },
      isCancelled: () => this.scanCancelled
    });
    this.scanState = { running: false, done: res.scanned, total: res.total, rateLimited: res.rateLimited };
    this.notifyScan();
    if (res.rateLimited) {
      new import_obsidian9.Notice(`Better Store: scan paused at GitHub's rate limit \u2014 ${res.scanned} of ${res.total} done. Resume later to continue.`);
    } else if (res.cancelled) {
      new import_obsidian9.Notice(`Better Store: scan cancelled \u2014 ${res.scanned} scanned this run.`);
    } else {
      new import_obsidian9.Notice(`Better Store: scan complete \u2014 refreshed ${res.scanned} plugin${res.scanned === 1 ? "" : "s"}.`);
    }
  }
  cancelCatalogScan() {
    this.scanCancelled = true;
  }
  registerSettingsListener(cb) {
    this.settingsListeners.push(cb);
    return () => {
      this.settingsListeners = this.settingsListeners.filter((c) => c !== cb);
    };
  }
  async loadSettings() {
    const raw = await this.loadData() ?? {};
    this.settings = { ...structuredClone(DEFAULT_SETTINGS), ...raw };
    this.settings.ui = { ...structuredClone(DEFAULT_SETTINGS.ui), ...raw.ui ?? {} };
    if (this.settings.ui.lastTab === "updated") this.settings.ui.lastTab = "all";
    if (typeof raw.githubToken === "string") {
      if (raw.githubToken && !this.app.secretStorage.getSecret(GITHUB_TOKEN_SECRET)) {
        this.app.secretStorage.setSecret(GITHUB_TOKEN_SECRET, raw.githubToken);
        this.settings.githubSecretId = GITHUB_TOKEN_SECRET;
      }
      delete this.settings.githubToken;
      await this.saveData(this.settings);
    }
    if (!this.settings.githubSecretId) {
      const resolved = resolveLegacySecret(
        this.app.secretStorage.getSecret(GITHUB_TOKEN_SECRET),
        GITHUB_TOKEN_SECRET,
        this.app.secretStorage.listSecrets()
      );
      if (resolved.secretId || resolved.scrubLegacy) {
        this.settings.githubSecretId = resolved.secretId;
        if (resolved.scrubLegacy) this.app.secretStorage.setSecret(GITHUB_TOKEN_SECRET, "");
        await this.saveData(this.settings);
      }
    }
  }
  currentServiceKey() {
    return `${this.settings.cacheTtlHours}`;
  }
  async saveSettings() {
    await this.saveData(this.settings);
    const key2 = this.currentServiceKey();
    if (key2 !== this.serviceKey) {
      this.serviceKey = key2;
      this.service = this.createService();
    }
    for (const cb of this.settingsListeners) cb();
  }
};

/* nosourcemap */