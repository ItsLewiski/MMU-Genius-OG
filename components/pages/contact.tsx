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

 const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault()

  if (!name || !email || !subject || !message) {
    setError("All fields are required")
    return
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(email)) {
    setError("Please enter a valid email address")
    return
  }

  setIsSubmitting(true)
  setError(null)

  try {
    const res = await fetch("https://formspree.io/f/xzzrgdpl", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        name,
        email,
        subject,
        message,
      }),
    })

    const data = await res.json()

    if (res.ok) {
      setSuccess(true)
      setName("")
      setEmail("")
      setSubject("")
      setMessage("")

      setTimeout(() => {
        setSuccess(false)
      }, 5000)
    } else {
      setError(data?.error || "Something went wrong, please try again.")
    }
  } catch (err) {
    setError("Failed to send message. Please try again later.")
  } finally {
    setIsSubmitting(false)
  }
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

       <div className="h-[400px] rounded-lg overflow-hidden">
  <iframe
    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3329.074649844702!2d36.76847999999999!3d-1.3822640000000002!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x182f059ba53cc253%3A0x84f65413371bebb!2sMultimedia%20University%20of%20Kenya!5e1!3m2!1sen!2ske!4v1746622930308!5m2!1sen!2ske"
    width="100%"
    height="100%"
    style={{ border: 0 }}
    allowFullScreen={true}
    loading="lazy"
    referrerPolicy="no-referrer-when-downgrade"
  ></iframe>
</div>

      </div>
    </div>
  )
}
