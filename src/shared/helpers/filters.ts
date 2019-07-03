export function includesSearchValue(text: string, searchText: string): boolean {
  if (text) {
    return text.toLowerCase().includes(searchText.toLowerCase());
  }
  return false;
}
