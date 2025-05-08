"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { MessageSquare, Users, TrendingUp, Target, CheckCircle } from "lucide-react"
import { MmuGeniusLogo } from "@/components/logo"
import Image from "next/image"

export function AdvertisePage() {
  const handleContactUs = () => {
    const message = encodeURIComponent("Hi, I'm interested in advertising on MMU Genius.")
    window.open(`https://wa.me/254707775531?text=${message}`, "_blank")
  }

  return (
    <div className="container py-12 max-w-4xl mx-auto">
      <div className="text-center mb-12">
        <MmuGeniusLogo width={80} height={80} className="mx-auto mb-6" />
        <h1 className="text-4xl font-bold mb-4">Advertise with MMU Genius</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Reach thousands of students and academic professionals with targeted advertising on our platform.
        </p>
      </div>

      {/* Why Advertise Section */}
      <div className="mb-16">
        <h2 className="text-2xl font-bold mb-6 text-center">Why Advertise with Us?</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardContent className="p-6 flex flex-col items-center text-center">
              <div className="w-12 h-12 rounded-full bg-study-purple/10 flex items-center justify-center mb-4">
                <Users className="h-6 w-6 text-study-purple" />
              </div>
              <h3 className="text-xl font-bold mb-2">Targeted Audience</h3>
              <p className="text-muted-foreground">
                Reach university students and academic professionals who are actively engaged in learning.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 flex flex-col items-center text-center">
              <div className="w-12 h-12 rounded-full bg-study-blue/10 flex items-center justify-center mb-4">
                <TrendingUp className="h-6 w-6 text-study-blue" />
              </div>
              <h3 className="text-xl font-bold mb-2">Growing Platform</h3>
              <p className="text-muted-foreground">
                Our user base is rapidly expanding, giving your brand increasing visibility over time.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 flex flex-col items-center text-center">
              <div className="w-12 h-12 rounded-full bg-study-accent/10 flex items-center justify-center mb-4">
                <Target className="h-6 w-6 text-study-accent" />
              </div>
              <h3 className="text-xl font-bold mb-2">Precise Targeting</h3>
              <p className="text-muted-foreground">
                Target specific subjects, courses, or academic interests relevant to your products or services.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Advertising Options */}
      <div className="mb-16">
        <h2 className="text-2xl font-bold mb-6 text-center">Advertising Options</h2>
        <div className="space-y-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row gap-6">
                <div className="md:w-2/3">
                  <h3 className="text-xl font-bold mb-2">Featured Products</h3>
                  <p className="text-muted-foreground mb-4">
                    Showcase your products or services in our marketplace with premium placement and enhanced
                    visibility.
                  </p>
                  <ul className="space-y-2">
                    <li className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                      <span>Premium position in product listings</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                      <span>Enhanced product descriptions and images</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                      <span>Featured tag to highlight your products</span>
                    </li>
                  </ul>
                </div>
                <div className="md:w-1/3 flex items-center justify-center">
                  <div className="text-center">
                    <p className="text-3xl font-bold text-study-purple">KSh 500</p>
                    <p className="text-sm text-muted-foreground">per month</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row gap-6">
                <div className="md:w-2/3">
                  <h3 className="text-xl font-bold mb-2">Banner Advertisements</h3>
                  <p className="text-muted-foreground mb-4">
                    Place your banner ads in strategic locations throughout our platform for maximum visibility.
                  </p>
                  <ul className="space-y-2">
                    <li className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                      <span>Homepage banner placement</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                      <span>Tool pages banner placement</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                      <span>Responsive design for all devices</span>
                    </li>
                  </ul>
                </div>
                <div className="md:w-1/3 flex items-center justify-center">
                  <div className="text-center">
                    <p className="text-3xl font-bold text-study-purple">KSh 1,000</p>
                    <p className="text-sm text-muted-foreground">per month</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row gap-6">
                <div className="md:w-2/3">
                  <h3 className="text-xl font-bold mb-2">Sponsored Content</h3>
                  <p className="text-muted-foreground mb-4">
                    Create educational content that promotes your brand while providing value to our users.
                  </p>
                  <ul className="space-y-2">
                    <li className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                      <span>Branded educational content</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                      <span>Featured in our resources section</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                      <span>Shared with our user base via notifications</span>
                    </li>
                  </ul>
                </div>
                <div className="md:w-1/3 flex items-center justify-center">
                  <div className="text-center">
                    <p className="text-3xl font-bold text-study-purple">KSh 2,000</p>
                    <p className="text-sm text-muted-foreground">per article</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Contact Section */}
      <div className="text-center mb-12">
        <h2 className="text-2xl font-bold mb-4">Ready to Advertise?</h2>
        <p className="text-muted-foreground max-w-2xl mx-auto mb-6">
          Contact us today to discuss your advertising needs and how we can help you reach your target audience.
        </p>
        <Button onClick={handleContactUs} className="bg-study-purple hover:bg-study-blue text-white px-8 py-6 text-lg">
          <MessageSquare className="h-5 w-5 mr-2" />
          Contact Us on WhatsApp
        </Button>
      </div>

      {/* Testimonials */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold mb-6 text-center">What Our Advertisers Say</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardContent className="p-6">
              <p className="italic mb-4">
                "Advertising on MMU Genius has significantly increased our visibility among university students. The
                targeted approach has led to a 30% increase in student customers."
              </p>
              <div className="flex items-center">
                <div className="relative w-10 h-10 rounded-full overflow-hidden mr-3">
                  <Image
                    src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Sarah%20Johnson-UUlkO2uID0Nf4QIL7ZB6Obv6YvvlZ2.png"
                    alt="Sarah Johnson"
                    fill
                    className="object-cover"
                  />
                </div>
                <div>
                  <p className="font-medium">Sarah Johnson</p>
                  <p className="text-sm text-muted-foreground">Marketing Director, Academic Books Ltd</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <p className="italic mb-4">
                "The sponsored content we created with MMU Genius provided excellent value to students while subtly
                promoting our services. We've seen great engagement and conversion rates."
              </p>
              <div className="flex items-center">
                <div className="relative w-10 h-10 rounded-full overflow-hidden mr-3">
                  <Image
                    src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Michael%20Odhiambo-rvQ25KK8VTqecIWTm9DUJFUk6hK9gM.png"
                    alt="Michael Odhiambo"
                    fill
                    className="object-cover"
                  />
                </div>
                <div>
                  <p className="font-medium">Michael Odhiambo</p>
                  <p className="text-sm text-muted-foreground">CEO, TechLearn Solutions</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
