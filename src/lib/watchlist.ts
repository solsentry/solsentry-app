"use client";

import { useEffect, useSyncExternalStore } from "react";
import { fetchWithSession, UnauthenticatedError } from "@/lib/api-session";

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
  code: "slot_limit" | "validation_error" | "storage_error" | "unauthenticated" | "api_error";
  limit?: number;
  field?: "addr" | "kind" | "label" | "tags" | "notes" | "alerts" | "patch";
}

export type AddWatchResult = { item: WatchItem; created: boolean } | WatchlistError;
export type UpdateWatchResult = WatchItem | WatchlistError | null;
export type RemoveWatchResult = { deleted: string } | WatchlistError;
export type ListWatchlistResult = WatchlistList | WatchlistError;

export interface WatchlistSnapshot extends WatchlistList {
  loading: boolean;
  initialized: boolean;
  error: WatchlistError | null;
  notice: string | null;
}

type Listener = () => void;

const EMPTY_LIST: WatchlistList = {
  count: 0,
  limit: WATCHLIST_LIMIT,
  items: [],
};

const SERVER_SNAPSHOT: WatchlistSnapshot = {
  ...EMPTY_LIST,
  loading: true,
  initialized: false,
  error: null,
  notice: null,
};

const listeners = new Set<Listener>();
let cachedRaw: string | null | undefined;
let cachedList: WatchlistList = EMPTY_LIST;
let snapshot: WatchlistSnapshot = SERVER_SNAPSHOT;
let storageListenerAttached = false;
let refreshPromise: Promise<ListWatchlistResult> | null = null;
let migrationPromise: Promise<void> | null = null;
let migrationComplete = false;
let migrationBlocked = false;

function apiEnabled(): boolean {
  return process.env.NEXT_PUBLIC_WATCHLIST_API === "on";
}

function storageError(): WatchlistError {
  return {
    error: "Could not save the watchlist in this browser.",
    code: "storage_error",
  };
}

function unauthenticatedError(): WatchlistError {
  return {
    error: "Sign in to manage your watchlist.",
    code: "unauthenticated",
  };
}

function apiError(): WatchlistError {
  return {
    error: "Could not load your watchlist. Try again.",
    code: "api_error",
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

function isWatchlistList(value: unknown): value is WatchlistList {
  if (!value || typeof value !== "object") return false;
  const list = value as Partial<WatchlistList>;
  return (
    typeof list.count === "number" &&
    typeof list.limit === "number" &&
    Array.isArray(list.items) &&
    list.items.every(isWatchItem)
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

function emit(next: Partial<WatchlistSnapshot>) {
  snapshot = { ...snapshot, ...next };
  listeners.forEach((listener) => listener());
}

function emitList(list: WatchlistList, error: WatchlistError | null = null) {
  emit({ ...list, loading: false, initialized: true, error });
}

function persist(list: WatchlistList): boolean {
  if (typeof window === "undefined") return false;
  try {
    const raw = JSON.stringify(list);
    window.localStorage.setItem(WATCHLIST_STORAGE_KEY, raw);
    cachedRaw = raw;
    cachedList = list;
    emitList(list);
    return true;
  } catch {
    return false;
  }
}

function readLocalList(): WatchlistList {
  if (typeof window === "undefined") return EMPTY_LIST;

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

function readLocalMigrationList(): WatchlistList {
  if (typeof window === "undefined") return EMPTY_LIST;
  try {
    return parseStoredList(window.localStorage.getItem(WATCHLIST_STORAGE_KEY)).list;
  } catch {
    return EMPTY_LIST;
  }
}

function writeLocalMigrationRemainder(items: WatchItem[]): boolean {
  if (typeof window === "undefined") return false;
  try {
    if (items.length === 0) {
      window.localStorage.removeItem(WATCHLIST_STORAGE_KEY);
      cachedRaw = null;
      cachedList = EMPTY_LIST;
    } else {
      const list = createList(items);
      const raw = JSON.stringify(list);
      window.localStorage.setItem(WATCHLIST_STORAGE_KEY, raw);
      cachedRaw = raw;
      cachedList = list;
    }
    return true;
  } catch {
    return false;
  }
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

function normalizeAddInput(input: AddWatchInput): AddWatchInput | WatchlistError {
  const addr = typeof input.addr === "string" ? input.addr.trim() : "";
  if (!addr) return validationError("addr", "Enter an address to track.");
  if (!isWatchKind(input.kind)) {
    return validationError("kind", "Watch kind must be operator or token.");
  }
  if (input.alerts !== undefined && typeof input.alerts !== "boolean") {
    return validationError("alerts", "alerts must be true or false.");
  }

  const label = normalizeOptionalText(input.label, "label", 80);
  if (typeof label === "object") return label;
  const notes = normalizeOptionalText(input.notes, "notes", 500);
  if (typeof notes === "object") return notes;
  const tags = normalizeTags(input.tags);
  if (!Array.isArray(tags)) return tags;

  return {
    addr,
    kind: input.kind,
    ...(label ? { label } : {}),
    tags,
    ...(notes ? { notes } : {}),
    alerts: input.alerts ?? true,
  };
}

function normalizePatch(patch: WatchPatch): WatchPatch | WatchlistError {
  const keys = Object.keys(patch);
  if (
    keys.length === 0 ||
    keys.some((key) => !["label", "tags", "notes", "alerts"].includes(key))
  ) {
    return validationError("patch", "Update label, tags, notes, or alerts.");
  }

  const next: WatchPatch = {};
  if ("label" in patch) {
    const label = normalizeOptionalText(patch.label, "label", 80);
    if (typeof label === "object") return label;
    next.label = label ?? "";
  }
  if ("notes" in patch) {
    const notes = normalizeOptionalText(patch.notes, "notes", 500);
    if (typeof notes === "object") return notes;
    next.notes = notes ?? "";
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
  return next;
}

function localAddWatch(input: AddWatchInput): AddWatchResult {
  const normalized = normalizeAddInput(input);
  if (isWatchlistError(normalized)) return normalized;

  const current = readLocalList();
  const existing = current.items.find(
    (item) => item.addr === normalized.addr && item.kind === normalized.kind,
  );
  if (existing) return { item: existing, created: false };

  if (current.count >= current.limit) {
    return {
      error: "Watchlist slot limit reached.",
      code: "slot_limit",
      limit: current.limit,
    };
  }

  const item: WatchItem = {
    id: makeId(),
    addr: normalized.addr,
    kind: normalized.kind,
    ...(normalized.label ? { label: normalized.label } : {}),
    tags: normalized.tags ?? [],
    ...(normalized.notes ? { notes: normalized.notes } : {}),
    alerts: normalized.alerts ?? true,
    created_at: Date.now() / 1000,
  };

  if (!persist(createList([...current.items, item]))) return storageError();
  return { item, created: true };
}

function localUpdateWatch(id: string, patch: WatchPatch): UpdateWatchResult {
  const normalized = normalizePatch(patch);
  if (isWatchlistError(normalized)) return normalized;

  const current = readLocalList();
  const existing = current.items.find((item) => item.id === id);
  if (!existing) return null;

  const next: WatchItem = { ...existing };
  if ("label" in normalized) {
    if (normalized.label) next.label = normalized.label;
    else delete next.label;
  }
  if ("notes" in normalized) {
    if (normalized.notes) next.notes = normalized.notes;
    else delete next.notes;
  }
  if ("tags" in normalized) next.tags = normalized.tags ?? [];
  if ("alerts" in normalized) next.alerts = normalized.alerts ?? true;

  const items = current.items.map((item) => (item.id === id ? next : item));
  if (!persist(createList(items))) return storageError();
  return next;
}

function localRemoveWatch(id: string): RemoveWatchResult {
  const current = readLocalList();
  const items = current.items.filter((item) => item.id !== id);
  if (items.length === current.items.length) return { deleted: id };
  if (!persist(createList(items))) return storageError();
  return { deleted: id };
}

function mapRequestError(error: unknown): WatchlistError {
  return error instanceof UnauthenticatedError ? unauthenticatedError() : apiError();
}

async function readError(response: Response): Promise<Record<string, unknown>> {
  try {
    const value: unknown = await response.json();
    return value && typeof value === "object" ? (value as Record<string, unknown>) : {};
  } catch {
    return {};
  }
}

async function apiListWatchlist(): Promise<ListWatchlistResult> {
  try {
    const response = await fetchWithSession("/v1/watchlist");
    if (!response.ok) return apiError();
    const value: unknown = await response.json();
    return isWatchlistList(value) ? value : apiError();
  } catch (error) {
    return mapRequestError(error);
  }
}

async function apiAddWatch(input: AddWatchInput): Promise<AddWatchResult> {
  const normalized = normalizeAddInput(input);
  if (isWatchlistError(normalized)) return normalized;

  try {
    const response = await fetchWithSession("/v1/watchlist", {
      method: "POST",
      body: JSON.stringify(normalized),
    });
    const value = await readError(response);
    if (response.status === 402 && value.code === "slot_limit") {
      return {
        error: typeof value.error === "string" ? value.error : "Watchlist slot limit reached.",
        code: "slot_limit",
        limit: typeof value.limit === "number" ? value.limit : undefined,
      };
    }
    if (!response.ok) return apiError();
    if (!isWatchItem(value.item) || typeof value.created !== "boolean") return apiError();
    return { item: value.item, created: value.created };
  } catch (error) {
    return mapRequestError(error);
  }
}

async function apiUpdateWatch(id: string, patch: WatchPatch): Promise<UpdateWatchResult> {
  const normalized = normalizePatch(patch);
  if (isWatchlistError(normalized)) return normalized;

  try {
    const response = await fetchWithSession(`/v1/watchlist/${encodeURIComponent(id)}`, {
      method: "PATCH",
      body: JSON.stringify(normalized),
    });
    if (response.status === 404) return null;
    if (!response.ok) return apiError();
    const value: unknown = await response.json();
    const item =
      value && typeof value === "object" && "item" in value
        ? (value as { item: unknown }).item
        : value;
    return isWatchItem(item) ? item : apiError();
  } catch (error) {
    return mapRequestError(error);
  }
}

async function apiRemoveWatch(id: string): Promise<RemoveWatchResult> {
  try {
    const response = await fetchWithSession(`/v1/watchlist/${encodeURIComponent(id)}`, {
      method: "DELETE",
    });
    if (response.status === 404) return { deleted: id };
    if (!response.ok) return apiError();
    const value: unknown = await response.json();
    if (
      !value ||
      typeof value !== "object" ||
      typeof (value as { deleted?: unknown }).deleted !== "string"
    ) {
      return apiError();
    }
    return { deleted: (value as { deleted: string }).deleted };
  } catch (error) {
    return mapRequestError(error);
  }
}

function mergeApiItem(result: { item: WatchItem; created: boolean }) {
  const exists = snapshot.items.some((item) => item.id === result.item.id);
  const items = exists
    ? snapshot.items.map((item) => (item.id === result.item.id ? result.item : item))
    : [...snapshot.items, result.item];
  emitList({ count: items.length, limit: snapshot.limit, items });
}

async function syncApiList() {
  const result = await apiListWatchlist();
  if (isWatchlistError(result)) emit({ error: result });
  else emitList(result);
}

async function migrateLocalItems(): Promise<void> {
  if (migrationComplete || migrationBlocked || typeof window === "undefined") return;
  if (migrationPromise) return migrationPromise;

  migrationPromise = (async () => {
    const localItems = readLocalMigrationList().items;
    if (localItems.length === 0) {
      migrationComplete = true;
      return;
    }

    let imported = 0;
    for (let index = 0; index < localItems.length; index += 1) {
      const localItem = localItems[index];
      const result = await apiAddWatch({
        addr: localItem.addr,
        kind: localItem.kind,
        ...(localItem.label ? { label: localItem.label } : {}),
        tags: localItem.tags,
        ...(localItem.notes ? { notes: localItem.notes } : {}),
        alerts: localItem.alerts,
      });

      if (isWatchlistError(result)) {
        const remaining = localItems.slice(index);
        if (result.code === "slot_limit") {
          migrationBlocked = true;
          emit({
            notice: `Your watchlist is full. ${remaining.length} local ${remaining.length === 1 ? "item" : "items"} remain saved in this browser.`,
          });
        } else {
          emit({
            error: result,
            notice: `Import paused. ${remaining.length} local ${remaining.length === 1 ? "item remains" : "items remain"} saved in this browser.`,
          });
        }
        return;
      }

      mergeApiItem(result);
      imported += 1;
      const remaining = localItems.slice(index + 1);
      if (!writeLocalMigrationRemainder(remaining)) {
        emit({
          notice:
            "Imported items are safe in your account, but the browser copy could not be cleared.",
        });
        return;
      }
    }

    migrationComplete = true;
    await syncApiList();
    emit({
      notice: `Imported ${imported} saved ${imported === 1 ? "item" : "items"} from this browser.`,
    });
  })().finally(() => {
    migrationPromise = null;
  });

  return migrationPromise;
}

export function isWatchlistError(result: unknown): result is WatchlistError {
  return Boolean(result && typeof result === "object" && "code" in result);
}

export async function listWatchlist(): Promise<ListWatchlistResult> {
  const result = apiEnabled() ? await apiListWatchlist() : readLocalList();
  if (isWatchlistError(result)) {
    emit({ loading: false, initialized: true, error: result });
  } else {
    emitList(result);
    if (apiEnabled()) await migrateLocalItems();
  }
  return result;
}

export function refreshWatchlist(): Promise<ListWatchlistResult> {
  if (refreshPromise) return refreshPromise;
  emit({ loading: true });
  refreshPromise = listWatchlist().finally(() => {
    refreshPromise = null;
  });
  return refreshPromise;
}

export async function addWatch(input: AddWatchInput): Promise<AddWatchResult> {
  const result = apiEnabled() ? await apiAddWatch(input) : localAddWatch(input);
  if (isWatchlistError(result)) {
    emit({ error: result });
  } else if (apiEnabled()) {
    mergeApiItem(result);
    await syncApiList();
  }
  return result;
}

export async function updateWatch(id: string, patch: WatchPatch): Promise<UpdateWatchResult> {
  const result = apiEnabled() ? await apiUpdateWatch(id, patch) : localUpdateWatch(id, patch);
  if (isWatchlistError(result)) {
    emit({ error: result });
  } else if (apiEnabled() && result) {
    const items = snapshot.items.map((item) => (item.id === id ? result : item));
    emitList({ count: snapshot.count, limit: snapshot.limit, items });
    await syncApiList();
  }
  return result;
}

export async function removeWatch(id: string): Promise<RemoveWatchResult> {
  const result = apiEnabled() ? await apiRemoveWatch(id) : localRemoveWatch(id);
  if (isWatchlistError(result)) {
    emit({ error: result });
  } else if (apiEnabled()) {
    const items = snapshot.items.filter((item) => item.id !== id);
    emitList({ count: items.length, limit: snapshot.limit, items });
    await syncApiList();
  }
  return result;
}

function handleStorage(event: StorageEvent) {
  if (apiEnabled() || event.key !== WATCHLIST_STORAGE_KEY) return;
  cachedRaw = undefined;
  emitList(readLocalList());
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

export function getWatchlistSnapshot(): WatchlistSnapshot {
  return snapshot;
}

export function useWatchlist(): WatchlistSnapshot {
  const current = useSyncExternalStore(subscribe, getWatchlistSnapshot, () => SERVER_SNAPSHOT);

  useEffect(() => {
    if (!current.initialized) void refreshWatchlist();
  }, [current.initialized]);

  return current;
}
