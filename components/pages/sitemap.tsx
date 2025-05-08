"use client"

import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { MmuGeniusLogo } from "@/components/logo"

interface SitemapItem {
  title: string
  url: string
  description?: string
  children?: SitemapItem[]
}

export function Sitemap() {
  // Define the site structure
  const siteStructure: SitemapItem[] = [
    {
      title: "Main Pages",
      url: "",
      children: [
        {
          title: "Home",
          url: "/",
          description: "AI-powered study tools for students",
        },
        {
          title: "About",
          url: "/about",
          description: "Learn about MMU Genius and our mission",
        },
        {
          title: "Contact",
          url: "/contact",
          description: "Get in touch with our team",
        },
        {
          title: "Products",
          url: "/products",
          description: "Browse our educational products",
        },
        {
          title: "Advertise",
          url: "/advertise",
          description: "Advertise your products or services on MMU Genius",
        },
        {
          title: "Sitemap",
          url: "/sitemap",
          description: "View all pages on our website",
        },
      ],
    },
    {
      title: "Study Tools",
      url: "/tools",
      description: "Explore our range of AI-powered study tools",
      children: [
        {
          title: "All Tools",
          url: "/tools",
          description: "Overview of all available tools",
        },
        {
          title: "Ask Anything",
          url: "/tools/ask-anything",
          description: "Chat with our AI assistant",
        },
        {
          title: "AI Detector",
          url: "/tools/ai-detector",
          description: "Check if text was written by AI",
        },
        {
          title: "Humaniser",
          url: "/tools/humaniser",
          description: "Make AI-generated text sound more human",
        },
      ],
    },
    {
      title: "User Account",
      url: "",
      children: [
        {
          title: "Login",
          url: "/login",
          description: "Sign in to your account",
        },
        {
          title: "Register",
          url: "/register",
          description: "Create a new account",
        },
        {
          title: "Account Dashboard",
          url: "/account",
          description: "Manage your account and view your progress",
        },
        {
          title: "Subscription",
          url: "/subscription",
          description: "View and manage your subscription",
        },
      ],
    },
    {
      title: "Legal",
      url: "",
      children: [
        {
          title: "Privacy Policy",
          url: "/privacy-policy",
          description: "Our privacy policy",
        },
        {
          title: "Terms of Service",
          url: "/terms",
          description: "Terms and conditions for using our service",
        },
      ],
    },
  ]

  // Render a section of the sitemap
  const renderSitemapSection = (section: SitemapItem) => (
    <Card key={section.title} className="mb-6">
      <CardHeader className="pb-2">
        <CardTitle className="text-xl">
          {section.url ? (
            <Link href={section.url} className="hover:text-study-purple transition-colors">
              {section.title}
            </Link>
          ) : (
            section.title
          )}
        </CardTitle>
        {section.description && <p className="text-sm text-muted-foreground">{section.description}</p>}
      </CardHeader>
      <CardContent>
        <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {section.children?.map((item) => (
            <li key={item.url} className="border rounded-md p-4 hover:border-study-purple transition-colors">
              <Link href={item.url} className="block">
                <h3 className="font-medium text-lg hover:text-study-purple transition-colors">{item.title}</h3>
                {item.description && <p className="text-sm text-muted-foreground">{item.description}</p>}
              </Link>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  )

  return (
    <div className="container py-8 max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <MmuGeniusLogo width={64} height={64} className="mx-auto mb-4" />
        <h1 className="text-3xl font-bold mb-2">Sitemap</h1>
        <p className="text-muted-foreground">Find all pages and resources available on MMU Genius</p>
      </div>

      {siteStructure.map(renderSitemapSection)}
    </div>
  )
}
