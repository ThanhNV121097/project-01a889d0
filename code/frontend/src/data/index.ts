/**
 * The site's records — products, categories, a menu, branches, the team —
 * one JSON file per kind in this folder, described in schema.json. Words
 * that are not records stay in content.json.
 *
 * Components read records ONLY through these hooks, never by importing a
 * JSON file: in the design they read the files here; once the site has a
 * backend, this one module is rewritten to call its API — base
 * import.meta.env.VITE_API_URL ?? "/api";
 * GET <base>/v1/<name>?page=&limit=&<field>=<value> → { items, total, page, limit };
 * GET <base>/v1/<name>/<id> → the record — and the JSON files are deleted. The
 * components, their paging and their loading states stay exactly as they are,
 * and so does useCollection's return: `items` (the pages loaded) and `total`
 * (every match, for "24 products").
 */
import { useCallback, useEffect, useState, useSyncExternalStore } from "react";
import schemaFile from "./schema.json";

/** Where a record came from: the owner's own data, a page on the web, or an assumption. */
export type Source = "owner" | "assumed" | `web:${string}`;

export interface Row {
  id: string;
  _source?: Source;
  [field: string]: unknown;
}

export interface Field {
  key: string;
  label?: string;
  /** text | longtext | number | price | image | url | bool | ref:<collection> | list */
  type: string;
  currency?: string;
}

export interface Collection {
  label?: string;
  fields: Field[];
}

export const schema = schemaFile as { collections: Record<string, Collection> };

const files = import.meta.glob<{ default: Row[] }>(["./*.json", "!./schema.json"], { eager: true });

let store: Record<string, Row[]> = {};
for (const [path, mod] of Object.entries(files)) {
  store[path.slice(2, -5)] = mod.default;
}
const listeners = new Set<() => void>();

/** The Studio's unsaved edits, shown live in its frame. */
export function setCollection(name: string, rows: Row[]) {
  store = { ...store, [name]: rows };
  listeners.forEach((l) => l());
}

export function collections(): Record<string, Row[]> {
  return store;
}

function subscribe(l: () => void) {
  listeners.add(l);
  return () => {
    listeners.delete(l);
  };
}

function useRows(name: string): Row[] {
  return useSyncExternalStore(subscribe, () => store[name] ?? EMPTY);
}
const EMPTY: Row[] = [];

export interface Query {
  /** Records whose field equals the value, e.g. { category: "iphone" }. */
  where?: Record<string, string | number | boolean>;
  /** How many a page holds. */
  pageSize?: number;
}

function matches(row: Row, where?: Query["where"]): boolean {
  if (!where) return true;
  return Object.entries(where).every(([k, v]) => row[k] === v);
}

/**
 * A page at a time: `items` grows by `pageSize` with each `loadMore()` — wire
 * it to a "Show more" button or an IntersectionObserver for lazy loading.
 *
 * Returns { items, total, hasMore, loading, error, loadMore }:
 * - `items` — the records loaded so far (the first pages only);
 * - `total` — how many records match `where` in all, loaded or not. A count
 *   the visitor reads ("24 products", "Showing 12 of 24") is `total`, never
 *   `items.length`, which is only the page. Once the site has a backend,
 *   `total` is the API's `total`.
 */
// T is the record's shape as the page reads it. Any shape with an id will do —
// an interface included: `T extends Row` asked for Row's index signature,
// which no interface has, and a design turn spent 24 builds on the error.
export function useCollection<T extends { id: string } = Row>(name: string, query: Query = {}) {
  const rows = useRows(name);
  const pageSize = query.pageSize ?? 12;
  const key = JSON.stringify(query.where ?? {});
  const [pages, setPages] = useState(1);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    setPages(1);
  }, [name, key]);
  useEffect(() => {
    // Async on purpose, as the API will be: components handle loading now.
    setLoading(true);
    const t = window.setTimeout(() => setLoading(false), 0);
    return () => {
      window.clearTimeout(t);
    };
  }, [name, key, pages]);
  const all = rows.filter((r) => matches(r, query.where)) as unknown as T[];
  const items = all.slice(0, pages * pageSize);
  const loadMore = useCallback(() => setPages((p) => p + 1), []);
  return { items, total: all.length, hasMore: items.length < all.length, loading, error: null as Error | null, loadMore };
}

/** One record by id. */
export function useRecord<T extends { id: string } = Row>(name: string, id: string | undefined) {
  const rows = useRows(name);
  const item = rows.find((r) => r.id === id) as unknown as T | undefined;
  return { item, loading: false, error: null as Error | null };
}
