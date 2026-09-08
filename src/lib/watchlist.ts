export const WATCHLIST_STORAGE_KEY = "solsentry:watchlist";
export const WATCHLIST_LIMIT = 10;

export type WatchKind = "operator" | "token";

export interface WatchItem {
  id: string;
  addr: string;
  kind: WatchKind;
  label?: string;
  tags: string[];
  notes?: string;
  alerts: boolean;
  created_at: number;
}

export interface WatchlistList {
  count: number;
  limit: number;
  items: WatchItem[];
}

export interface AddWatchInput {
  addr: string;
  kind: WatchKind;
  label?: string;
  tags?: string[];
  notes?: string;
  alerts?: boolean;
}

export type WatchPatch = Partial<Pick<WatchItem, "label" | "tags" | "notes" | "alerts">>;

export interface WatchlistError {
  error: string;
  code: "slot_limit" | "validation_error" | "storage_error";
  limit?: number;
  field?: "addr" | "kind" | "label" | "tags" | "notes" | "alerts" | "patch";
}

export type AddWatchResult = { item: WatchItem; created: boolean } | WatchlistError;
export type UpdateWatchResult = WatchItem | WatchlistError | null;
export type RemoveWatchResult = { deleted: string } | WatchlistError;

type Listener = () => void;

const EMPTY_LIST: WatchlistList = {
  count: 0,
  limit: WATCHLIST_LIMIT,
  items: [],
};

const listeners = new Set<Listener>();
let cachedRaw: string | null | undefined;
let cachedList: WatchlistList = EMPTY_LIST;
let storageListenerAttached = false;
let warnedAboutApiStub = false;

function warnIfApiStubEnabled() {
  if (
    typeof window !== "undefined" &&
    process.env.NEXT_PUBLIC_WATCHLIST_API === "on" &&
    !warnedAboutApiStub
  ) {
    warnedAboutApiStub = true;
    // TODO(F1b): replace this fallback with the first-party /api/watchlist/* proxy.
    console.warn("Watchlist API proxy is not available yet; using local storage.");
  }
}

function storageError(): WatchlistError {
  return {
    error: "Could not save the watchlist in this browser.",
    code: "storage_error",
  };
}

function validationError(field: WatchlistError["field"], error: string): WatchlistError {
  return { error, code: "validation_error", field };
}

function makeId(prefix = "watch"): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}

function isWatchKind(value: unknown): value is WatchKind {
  return value === "operator" || value === "token";
}

function isWatchItem(value: unknown): value is WatchItem {
  if (!value || typeof value !== "object") return false;
  const item = value as Partial<WatchItem>;
  return (
    typeof item.id === "string" &&
    typeof item.addr === "string" &&
    isWatchKind(item.kind) &&
    (item.label === undefined || typeof item.label === "string") &&
    Array.isArray(item.tags) &&
    item.tags.every((tag) => typeof tag === "string") &&
    (item.notes === undefined || typeof item.notes === "string") &&
    typeof item.alerts === "boolean" &&
    typeof item.created_at === "number" &&
    Number.isFinite(item.created_at)
  );
}

function createList(items: WatchItem[]): WatchlistList {
  return {
    count: items.length,
    limit: WATCHLIST_LIMIT,
    items,
  };
}

function migrateLegacyList(addresses: string[]): WatchlistList {
  const createdAt = Date.now() / 1000;
  const seen = new Set<string>();
  const items = addresses.flatMap((value, index) => {
    const addr = value.trim();
    if (!addr || seen.has(addr)) return [];
    seen.add(addr);
    return [
      {
        id: makeId("legacy"),
        addr,
        kind: "operator" as const,
        tags: [],
        alerts: true,
        created_at: createdAt + index / 1000,
      },
    ];
  });
  return createList(items);
}

function parseStoredList(raw: string | null): { list: WatchlistList; migrated: boolean } {
  if (!raw) return { list: EMPTY_LIST, migrated: false };

  try {
    const parsed: unknown = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      const legacy = parsed.filter((value): value is string => typeof value === "string");
      return { list: migrateLegacyList(legacy), migrated: true };
    }

    if (parsed && typeof parsed === "object") {
      const stored = parsed as Partial<WatchlistList>;
      if (Array.isArray(stored.items)) {
        const items = stored.items.filter(isWatchItem);
        return {
          list: createList(items),
          migrated: false,
        };
      }
    }
  } catch {
    // A malformed value behaves like an empty list and is left untouched.
  }

  return { list: EMPTY_LIST, migrated: false };
}

function persist(list: WatchlistList): boolean {
  if (typeof window === "undefined") return false;
  try {
    const raw = JSON.stringify(list);
    window.localStorage.setItem(WATCHLIST_STORAGE_KEY, raw);
    cachedRaw = raw;
    cachedList = list;
    listeners.forEach((listener) => listener());
    return true;
  } catch {
    return false;
  }
}

function readLocalList(): WatchlistList {
  if (typeof window === "undefined") return EMPTY_LIST;
  warnIfApiStubEnabled();

  let raw: string | null;
  try {
    raw = window.localStorage.getItem(WATCHLIST_STORAGE_KEY);
  } catch {
    return EMPTY_LIST;
  }

  if (raw === cachedRaw) return cachedList;

  const { list, migrated } = parseStoredList(raw);
  cachedRaw = raw;
  cachedList = list;

  if (migrated) persist(list);
  return list;
}

function normalizeOptionalText(
  value: string | undefined,
  field: "label" | "notes",
  max: number,
): string | undefined | WatchlistError {
  if (value === undefined) return undefined;
  if (typeof value !== "string") return validationError(field, `${field} must be text.`);
  const normalized = value.trim();
  if (normalized.length > max) {
    return validationError(field, `${field} must be ${max} characters or fewer.`);
  }
  return normalized || undefined;
}

function normalizeTags(tags: string[] | undefined): string[] | WatchlistError {
  if (tags === undefined) return [];
  if (!Array.isArray(tags) || tags.some((tag) => typeof tag !== "string")) {
    return validationError("tags", "tags must be a list of text values.");
  }
  if (tags.length > 10) return validationError("tags", "Use no more than 10 tags.");

  const normalized = Array.from(new Set(tags.map((tag) => tag.trim()).filter(Boolean)));
  if (normalized.some((tag) => tag.length > 32)) {
    return validationError("tags", "Each tag must be 32 characters or fewer.");
  }
  return normalized;
}

export function isWatchlistError(
  result: AddWatchResult | UpdateWatchResult | RemoveWatchResult,
): result is WatchlistError {
  return Boolean(result && "code" in result);
}

export function listWatchlist(): WatchlistList {
  return readLocalList();
}

export function addWatch(input: AddWatchInput): AddWatchResult {
  const addr = typeof input.addr === "string" ? input.addr.trim() : "";
  if (!addr) return validationError("addr", "Enter an address to track.");
  if (!isWatchKind(input.kind)) {
    return validationError("kind", "Watch kind must be operator or token.");
  }
  if (input.alerts !== undefined && typeof input.alerts !== "boolean") {
    return validationError("alerts", "alerts must be true or false.");
  }

  const current = readLocalList();
  const existing = current.items.find((item) => item.addr === addr && item.kind === input.kind);
  if (existing) return { item: existing, created: false };

  const label = normalizeOptionalText(input.label, "label", 80);
  if (typeof label === "object") return label;
  const notes = normalizeOptionalText(input.notes, "notes", 500);
  if (typeof notes === "object") return notes;
  const tags = normalizeTags(input.tags);
  if (!Array.isArray(tags)) return tags;

  if (current.count >= current.limit) {
    return {
      error: "Watchlist slot limit reached.",
      code: "slot_limit",
      limit: current.limit,
    };
  }

  const item: WatchItem = {
    id: makeId(),
    addr,
    kind: input.kind,
    ...(label ? { label } : {}),
    tags,
    ...(notes ? { notes } : {}),
    alerts: input.alerts ?? true,
    created_at: Date.now() / 1000,
  };

  if (!persist(createList([...current.items, item]))) return storageError();
  return { item, created: true };
}

export function updateWatch(id: string, patch: WatchPatch): UpdateWatchResult {
  const keys = Object.keys(patch);
  if (
    keys.length === 0 ||
    keys.some((key) => !["label", "tags", "notes", "alerts"].includes(key))
  ) {
    return validationError("patch", "Update label, tags, notes, or alerts.");
  }

  const current = readLocalList();
  const existing = current.items.find((item) => item.id === id);
  if (!existing) return null;

  let next: WatchItem = { ...existing };
  if ("label" in patch) {
    const label = normalizeOptionalText(patch.label, "label", 80);
    if (typeof label === "object") return label;
    if (label) next.label = label;
    else delete next.label;
  }
  if ("notes" in patch) {
    const notes = normalizeOptionalText(patch.notes, "notes", 500);
    if (typeof notes === "object") return notes;
    if (notes) next.notes = notes;
    else delete next.notes;
  }
  if ("tags" in patch) {
    const tags = normalizeTags(patch.tags);
    if (!Array.isArray(tags)) return tags;
    next.tags = tags;
  }
  if ("alerts" in patch) {
    if (typeof patch.alerts !== "boolean") {
      return validationError("patch", "alerts must be true or false.");
    }
    next.alerts = patch.alerts;
  }

  const items = current.items.map((item) => (item.id === id ? next : item));
  if (!persist(createList(items))) return storageError();
  return next;
}

export function removeWatch(id: string): RemoveWatchResult {
  const current = readLocalList();
  const items = current.items.filter((item) => item.id !== id);
  if (items.length === current.items.length) return { deleted: id };
  if (!persist(createList(items))) return storageError();
  return { deleted: id };
}

function handleStorage(event: StorageEvent) {
  if (event.key !== WATCHLIST_STORAGE_KEY) return;
  cachedRaw = undefined;
  readLocalList();
  listeners.forEach((listener) => listener());
}

export function subscribe(listener: Listener): () => void {
  listeners.add(listener);
  if (typeof window !== "undefined" && !storageListenerAttached) {
    window.addEventListener("storage", handleStorage);
    storageListenerAttached = true;
  }

  return () => {
    listeners.delete(listener);
    if (typeof window !== "undefined" && listeners.size === 0 && storageListenerAttached) {
      window.removeEventListener("storage", handleStorage);
      storageListenerAttached = false;
    }
  };
}
