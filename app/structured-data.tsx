export function WebsiteStructuredData() {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "WebSite",
          name: "MMU Genius",
          url: "https://mmugenius.vercel.app",
          potentialAction: {
            "@type": "SearchAction",
            target: "https://mmugenius.vercel.app/search?q={search_term_string}",
            "query-input": "required name=search_term_string",
          },
          description:
            "AI-powered study tools for students to transform notes into summaries, flashcards, and practice questions.",
        }),
      }}
    />
  )
}

export function OrganizationStructuredData() {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Organization",
          name: "MMU Genius",
          url: "https://mmugenius.vercel.app",
          logo: "https://mmugenius.vercel.app/favicon.png",
          sameAs: [
            "https://twitter.com/mmugenius",
            "https://facebook.com/mmugenius",
            "https://instagram.com/mmugenius",
          ],
          contactPoint: {
            "@type": "ContactPoint",
            telephone: "+254-700-000-000",
            contactType: "customer service",
            availableLanguage: "English",
          },
        }),
      }}
    />
  )
}
