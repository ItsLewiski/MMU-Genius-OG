"use client"

import { useEffect, useRef } from "react"

export function useScrollAnimation() {
  const observerRef = useRef<IntersectionObserver | null>(null)

  useEffect(() => {
    // Initialize the Intersection Observer
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible")
            // Once the animation has played, we can stop observing this element
            observerRef.current?.unobserve(entry.target)
          }
        })
      },
      {
        threshold: 0.1, // Trigger when at least 10% of the element is visible
        rootMargin: "0px 0px -50px 0px", // Slightly before the element comes into view
      },
    )

    // Select all elements with the animate-on-scroll class
    const animatedElements = document.querySelectorAll(".animate-on-scroll")

    // Start observing each element
    animatedElements.forEach((element) => {
      observerRef.current?.observe(element)
    })

    // Cleanup function
    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect()
      }
    }
  }, [])

  return null
}
