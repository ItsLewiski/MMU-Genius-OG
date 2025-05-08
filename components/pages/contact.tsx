"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle, CheckCircle, Mail, Phone, MapPin, Send, Loader2 } from "lucide-react"
import { saveContactMessage } from "@/lib/auth"

export function Contact() {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [subject, setSubject] = useState("")
  const [message, setMessage] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Validate form
    if (!name || !email || !subject || !message) {
      setError("All fields are required")
      return
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      setError("Please enter a valid email address")
      return
    }

    setIsSubmitting(true)
    setError(null)

    // Save message to global storage
    saveContactMessage(name, email, subject, message)

    // Simulate form submission
    setTimeout(() => {
      setIsSubmitting(false)
      setSuccess(true)

      // Reset form
      setName("")
      setEmail("")
      setSubject("")
      setMessage("")

      // Reset success message after 5 seconds
      setTimeout(() => {
        setSuccess(false)
      }, 5000)
    }, 1500)
  }

  return (
    <div className="container py-8 max-w-4xl mx-auto">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Contact Us</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Have questions or feedback? We'd love to hear from you.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
        <Card className="p-6 flex flex-col items-center text-center">
          <div className="w-12 h-12 rounded-full bg-study-purple/10 flex items-center justify-center mb-4">
            <Mail className="h-6 w-6 text-study-purple" />
          </div>
          <h3 className="text-xl font-bold mb-2">Email Us</h3>
          <p className="text-muted-foreground mb-4">Our friendly team is here to help.</p>
          <a href="mailto:infocrib951@gmail.com" className="text-study-purple hover:underline">
            infocrib951@gmail.com
          </a>
        </Card>

        <Card className="p-6 flex flex-col items-center text-center">
          <div className="w-12 h-12 rounded-full bg-study-blue/10 flex items-center justify-center mb-4">
            <Phone className="h-6 w-6 text-study-blue" />
          </div>
          <h3 className="text-xl font-bold mb-2">Call Us</h3>
          <p className="text-muted-foreground mb-4">Mon-Fri from 8am to 5pm.</p>
          <a href="tel:+254707775531" className="text-study-blue hover:underline">
            +254 707 775 531
          </a>
        </Card>

        <Card className="p-6 flex flex-col items-center text-center">
          <div className="w-12 h-12 rounded-full bg-study-accent/10 flex items-center justify-center mb-4">
            <MapPin className="h-6 w-6 text-study-accent" />
          </div>
          <h3 className="text-xl font-bold mb-2">Visit Us</h3>
          <p className="text-muted-foreground mb-4">Come say hello at our office.</p>
          <p className="text-study-accent">
            Multimedia University of Kenya
            <br />
            Magadi Road, Nairobi
          </p>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl font-bold">Send us a message</CardTitle>
            <CardDescription>Fill out the form below and we'll get back to you as soon as possible.</CardDescription>
          </CardHeader>
          <CardContent>
            {error && (
              <Alert variant="destructive" className="mb-4">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {success && (
              <Alert className="mb-4 bg-green-50 text-green-800 border-green-200">
                <CheckCircle className="h-4 w-4" />
                <AlertTitle>Message Sent!</AlertTitle>
                <AlertDescription>Thank you for your message. We'll get back to you soon.</AlertDescription>
              </Alert>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Your Name</Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="John Doe"
                  disabled={isSubmitting || success}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="john@example.com"
                  disabled={isSubmitting || success}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="subject">Subject</Label>
                <Input
                  id="subject"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="How can we help you?"
                  disabled={isSubmitting || success}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="message">Message</Label>
                <Textarea
                  id="message"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Your message here..."
                  rows={5}
                  disabled={isSubmitting || success}
                />
              </div>

              <Button
                type="submit"
                className="w-full bg-study-purple hover:bg-study-blue text-white"
                disabled={isSubmitting || success}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4 mr-2" />
                    Send Message
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        <div className="h-[400px] rounded-lg overflow-hidden bg-gray-200">
          {/* This would be a map in a real application */}
          <div className="w-full h-full flex items-center justify-center text-gray-500">
            <p className="text-center">
              <MapPin className="h-8 w-8 mx-auto mb-2" />
              Map would be displayed here
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
