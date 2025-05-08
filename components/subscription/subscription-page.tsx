"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Check, CreditCard } from "lucide-react"
import { getCurrentUser } from "@/lib/auth"
import { Badge } from "@/components/ui/badge"

export function SubscriptionPage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [currentPlan, setCurrentPlan] = useState("free")

  useEffect(() => {
    // Check if user is logged in
    const currentUser = getCurrentUser()
    if (!currentUser) {
      router.push("/login")
      return
    }

    setUser(currentUser)

    // In a real app, you would fetch the user's subscription status from your backend
    // For this demo, we'll just assume they're on the free plan
    setCurrentPlan("free")
  }, [router])

  if (!user) {
    return <div className="container py-8 flex items-center justify-center">Loading...</div>
  }

  return (
    <div className="container py-8 max-w-5xl mx-auto">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Subscription Plans</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Choose the plan that best fits your needs and start studying smarter today.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Free Plan */}
        <Card
          className={`border ${currentPlan === "free" ? "border-2 border-study-purple" : ""} rounded-lg overflow-hidden transform transition-all duration-300 hover:scale-105 hover:shadow-lg`}
        >
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-2xl font-bold">🎉 Free Plan</h3>
                <p className="text-muted-foreground">Get started at no cost</p>
              </div>
              <div className="text-3xl font-bold">$0</div>
            </div>
            {currentPlan === "free" && <Badge className="mb-4 bg-study-purple">Current Plan</Badge>}
            <ul className="space-y-3 mb-6">
              <li className="flex items-start">
                <Check className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                <span>Limited to 5 flashcards</span>
              </li>
              <li className="flex items-start">
                <Check className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                <span>Limited character count for notes</span>
              </li>
              <li className="flex items-start">
                <Check className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                <span>No customer support</span>
              </li>
              <li className="flex items-start">
                <Check className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                <span>No priority processing</span>
              </li>
              <li className="flex items-start">
                <Check className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                <span>No access to premium templates</span>
              </li>
            </ul>
          </div>
          <div className="px-6 pb-6">
            <Button disabled={currentPlan === "free"} className="w-full bg-gray-100 hover:bg-gray-100 text-black">
              {currentPlan === "free" ? "Current Plan" : "Select Plan"}
            </Button>
          </div>
        </Card>

        {/* Standard Plan */}
        <Card
          className={`border ${currentPlan === "standard" ? "border-2 border-study-purple" : ""} rounded-lg overflow-hidden transform transition-all duration-300 hover:scale-105 hover:shadow-lg`}
        >
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-2xl font-bold">🔹 Standard Plan</h3>
                <p className="text-muted-foreground">More power for students</p>
              </div>
              <div className="text-3xl font-bold">
                $2<span className="text-base font-normal">/month</span>
              </div>
            </div>
            {currentPlan === "standard" && <Badge className="mb-4 bg-study-purple">Current Plan</Badge>}
            <ul className="space-y-3 mb-6">
              <li className="flex items-start">
                <Check className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                <span>Up to 10 flashcards</span>
              </li>
              <li className="flex items-start">
                <Check className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                <span>Higher character limit for notes</span>
              </li>
              <li className="flex items-start">
                <Check className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                <span>Basic customer support</span>
              </li>
              <li className="flex items-start">
                <Check className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                <span>Faster processing</span>
              </li>
              <li className="flex items-start">
                <Check className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                <span>Access to some premium templates</span>
              </li>
            </ul>
          </div>
          <div className="px-6 pb-6">
            <Button
              className={`w-full ${currentPlan === "standard" ? "bg-gray-100 hover:bg-gray-100 text-black" : "bg-study-blue hover:bg-study-purple text-white"}`}
              disabled={currentPlan === "standard"}
            >
              {currentPlan === "standard" ? "Current Plan" : "Select Plan"}
            </Button>
          </div>
        </Card>

        {/* Premium Plan */}
        <Card
          className={`border ${currentPlan === "premium" ? "border-2 border-study-purple" : "border-2 border-study-purple"} rounded-lg overflow-hidden relative transform transition-all duration-300 hover:scale-105 hover:shadow-lg`}
        >
          {currentPlan !== "premium" && (
            <div className="absolute top-0 right-0 bg-study-purple text-white px-3 py-1 text-sm font-medium rounded-bl-lg">
              Best Value
            </div>
          )}
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-2xl font-bold">🔥 Premium Plan</h3>
                <p className="text-muted-foreground">Ultimate learning experience</p>
              </div>
              <div className="text-3xl font-bold">
                $5<span className="text-base font-normal">/month</span>
              </div>
            </div>
            {currentPlan === "premium" && <Badge className="mb-4 bg-study-purple">Current Plan</Badge>}
            <ul className="space-y-3 mb-6">
              <li className="flex items-start">
                <Check className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                <span>Up to 15,000 characters for notes</span>
              </li>
              <li className="flex items-start">
                <Check className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                <span>Unlimited flashcards & practice questions</span>
              </li>
              <li className="flex items-start">
                <Check className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                <span>24/7 priority customer support</span>
              </li>
              <li className="flex items-start">
                <Check className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                <span>Fastest processing speed + AI-powered suggestions</span>
              </li>
              <li className="flex items-start">
                <Check className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                <span>Full access to all premium templates & features</span>
              </li>
            </ul>
          </div>
          <div className="px-6 pb-6">
            <Button
              className={`w-full ${currentPlan === "premium" ? "bg-gray-100 hover:bg-gray-100 text-black" : "bg-study-purple hover:bg-study-blue text-white"}`}
              disabled={currentPlan === "premium"}
            >
              {currentPlan === "premium" ? "Current Plan" : "Subscribe Now"}
            </Button>
          </div>
        </Card>
      </div>

      <div className="mt-12 p-6 border rounded-lg bg-muted/30">
        <div className="flex items-center gap-4 mb-4">
          <div className="bg-study-purple/10 p-3 rounded-full">
            <CreditCard className="h-6 w-6 text-study-purple" />
          </div>
          <h2 className="text-xl font-bold">Payment Information</h2>
        </div>
        <p className="text-muted-foreground mb-4">
          Your subscription will be billed monthly. You can cancel or change your plan at any time. All plans include
          access to our core features, with premium plans offering enhanced capabilities.
        </p>
        <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-md border border-yellow-200 dark:border-yellow-800">
          <p className="text-yellow-800 dark:text-yellow-300 text-sm">
            <strong>Note:</strong> This is a demo application. No actual payment will be processed.
          </p>
        </div>
      </div>
    </div>
  )
}
