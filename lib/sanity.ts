import { createClient } from "next-sanity";
import { createImageUrlBuilder } from "@sanity/image-url";
import type { SanityImageSource } from "@sanity/image-url";

export const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "roa0vh8v",
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "production",
  apiVersion: "2025-05-08",
  useCdn: false,
});

const builder = createImageUrlBuilder(client);

export function urlFor(source: SanityImageSource) {
  return builder.image(source);
}

export function getSanityImageUrl(
  source: SanityImageSource | undefined | null,
  width?: number,
  height?: number
): string | null {
  if (!source) return null;
  try {
    let img = urlFor(source);
    if (width) img = img.width(width);
    if (height) img = img.height(height);
    const url = img.url();
    if (url && url.startsWith("http")) return url;
    return null;
  } catch {
    return null;
  }
}
