// How a menu link marks the page the visitor is on: 'page' on that page
// itself, 'true' on a page under it (like a city page under Locations), and
// nothing anywhere else. The homepage link only matches the homepage.
export function getCurrent(
  pathname: string,
  href: string,
): 'page' | 'true' | undefined {
  if (pathname === href) return 'page';
  if (href !== '/' && pathname.startsWith(`${href}/`)) return 'true';
  return undefined;
}
