import type { Metadata } from "next"

export function generatePageMetadata(
  title: string,
  description: string,
  path = "",
  imageUrl = "/assets/images/mmu-genius-logo.png",
): Metadata {
  const baseUrl = "https://mmugenius.vercel.app"
  const fullUrl = `${baseUrl}${path}`

  return {
    title: `${title} | MMU Genius`,
    description,
    openGraph: {
      type: "website",
      url: fullUrl,
      title: `${title} | MMU Genius`,
      description,
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} | MMU Genius`,
      description,
      images: [imageUrl],
    },
  }
}
