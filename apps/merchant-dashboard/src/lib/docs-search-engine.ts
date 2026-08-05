import MiniSearch from "minisearch";
import { docsSearchData, SearchDocItem } from "./docs-search-index";

export interface SearchResultItem extends SearchDocItem {}

export interface SearchResultGroup {
  title: string;
  section: string;
  items: SearchResultItem[];
}

const miniSearch = new MiniSearch<SearchDocItem>({
  fields: ["title", "heading", "content", "section"],
  storeFields: ["title", "heading", "content", "href", "section"],
  searchOptions: {
    boost: { heading: 3, title: 2, content: 1 },
    prefix: true,
    fuzzy: 0.2,
  },
});

miniSearch.addAll(docsSearchData);

export function searchDocs(query: string): SearchResultGroup[] {
  const trimmed = query.trim();
  if (!trimmed) {
    return groupResults(docsSearchData.slice(0, 15));
  }

  let searchResults = miniSearch.search(trimmed, {
    prefix: true,
    fuzzy: 0.2,
    combineWith: "AND",
  });

  if (searchResults.length === 0) {
    searchResults = miniSearch.search(trimmed, {
      prefix: true,
      fuzzy: 0.25,
      combineWith: "OR",
    });
  }

  const items: SearchResultItem[] = searchResults.map((r) => ({
    id: String(r.id),
    title: String(r.title),
    heading: r.heading ? String(r.heading) : undefined,
    content: String(r.content),
    href: String(r.href),
    section: String(r.section),
  }));

  return groupResults(items);
}

function groupResults(items: SearchResultItem[]): SearchResultGroup[] {
  const groupsMap = new Map<string, SearchResultItem[]>();

  for (const item of items) {
    const groupKey = item.title;
    if (!groupsMap.has(groupKey)) {
      groupsMap.set(groupKey, []);
    }
    groupsMap.get(groupKey)!.push(item);
  }

  const groups: SearchResultGroup[] = [];
  for (const [title, groupItems] of groupsMap.entries()) {
    groups.push({
      title,
      section: groupItems[0]?.section || "",
      items: groupItems,
    });
  }

  return groups;
}
