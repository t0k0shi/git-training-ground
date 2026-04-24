/**
 * Prefixes a static asset path with the configured Next.js base path.
 *
 * If the environment variable NEXT_PUBLIC_BASE_PATH is set, that value is used as the prefix; otherwise an empty string is used. The provided `path` will be normalized to start with `/` if it does not already.
 *
 * @param path - Asset path which may or may not start with `/`
 * @returns The resulting path with the base path prefixed (e.g., `basePath + /your/asset.png`)
 */
export function asset(path: string): string {
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? '';
  const normalized = path.startsWith('/') ? path : `/${path}`;
  return `${basePath}${normalized}`;
}
