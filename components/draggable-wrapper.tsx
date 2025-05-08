"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import type { ReactNode } from "react"

interface DraggableWrapperProps {
  children: ReactNode
}

export function DraggableWrapper({ children }: DraggableWrapperProps) {
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [isDragging, setIsDragging] = useState(false)
  const [offset, setOffset] = useState({ x: 0, y: 0 })
  const [initialPosition, setInitialPosition] = useState(true)
  const wrapperRef = useRef<HTMLDivElement>(null)

  // Set initial position based on screen size
  useEffect(() => {
    if (initialPosition && wrapperRef.current) {
      // Always position in the bottom right with fixed spacing
      const right = 20
      const bottom = 20

      setPosition({
        x: window.innerWidth - wrapperRef.current.offsetWidth - right,
        y: window.innerHeight - wrapperRef.current.offsetHeight - bottom,
      })
      setInitialPosition(false)
    }
  }, [initialPosition])

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      if (wrapperRef.current) {
        // Maintain bottom-right position on resize
        const right = 20
        const bottom = 20

        setPosition({
          x: window.innerWidth - wrapperRef.current.offsetWidth - right,
          y: window.innerHeight - wrapperRef.current.offsetHeight - bottom,
        })
      }
    }

    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  // Ensure position is valid relative to viewport
  useEffect(() => {
    if (wrapperRef.current && !isDragging) {
      const handlePositionCheck = () => {
        const width = wrapperRef.current?.offsetWidth || 0
        const height = wrapperRef.current?.offsetHeight || 0

        // Make sure the element stays within viewport bounds
        let newX = position.x
        let newY = position.y

        if (newX < 0) newX = 0
        if (newY < 0) newY = 0
        if (newX > window.innerWidth - width) newX = window.innerWidth - width
        if (newY > window.innerHeight - height) newY = window.innerHeight - height

        if (newX !== position.x || newY !== position.y) {
          setPosition({ x: newX, y: newY })
        }
      }

      handlePositionCheck()
      window.addEventListener("scroll", handlePositionCheck)
      return () => window.removeEventListener("scroll", handlePositionCheck)
    }
  }, [position, isDragging])

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true)
    setOffset({
      x: e.clientX - position.x,
      y: e.clientY - position.y,
    })
  }

  const handleTouchStart = (e: React.TouchEvent) => {
    setIsDragging(true)
    setOffset({
      x: e.touches[0].clientX - position.x,
      y: e.touches[0].clientY - position.y,
    })
  }

  const handleMouseMove = (e: MouseEvent) => {
    if (isDragging) {
      const newPosition = {
        x: e.clientX - offset.x,
        y: e.clientY - offset.y,
      }

      // Boundary checks to keep assistant within viewport
      if (wrapperRef.current) {
        const width = wrapperRef.current.offsetWidth
        const height = wrapperRef.current.offsetHeight

        if (newPosition.x < 0) newPosition.x = 0
        if (newPosition.y < 0) newPosition.y = 0
        if (newPosition.x > window.innerWidth - width) newPosition.x = window.innerWidth - width
        if (newPosition.y > window.innerHeight - height) newPosition.y = window.innerHeight - height
      }

      setPosition(newPosition)
    }
  }

  const handleTouchMove = (e: TouchEvent) => {
    if (isDragging) {
      const newPosition = {
        x: e.touches[0].clientX - offset.x,
        y: e.touches[0].clientY - offset.y,
      }

      // Boundary checks
      if (wrapperRef.current) {
        const width = wrapperRef.current.offsetWidth
        const height = wrapperRef.current.offsetHeight

        if (newPosition.x < 0) newPosition.x = 0
        if (newPosition.y < 0) newPosition.y = 0
        if (newPosition.x > window.innerWidth - width) newPosition.x = window.innerWidth - width
        if (newPosition.y > window.innerHeight - height) newPosition.y = window.innerHeight - height
      }

      setPosition(newPosition)
    }
  }

  const handleMouseUp = () => {
    setIsDragging(false)

    // Save position to localStorage
    try {
      localStorage.setItem("ai_assistant_position", JSON.stringify(position))
    } catch (e) {
      console.log("Could not save position to localStorage")
    }
  }

  useEffect(() => {
    if (isDragging) {
      window.addEventListener("mousemove", handleMouseMove)
      window.addEventListener("mouseup", handleMouseUp)
      window.addEventListener("touchmove", handleTouchMove)
      window.addEventListener("touchend", handleMouseUp)

      return () => {
        window.removeEventListener("mousemove", handleMouseMove)
        window.removeEventListener("mouseup", handleMouseUp)
        window.removeEventListener("touchmove", handleTouchMove)
        window.removeEventListener("touchend", handleMouseUp)
      }
    }
  }, [isDragging])

  // Load saved position from localStorage on component mount
  useEffect(() => {
    try {
      const savedPosition = localStorage.getItem("ai_assistant_position")
      if (savedPosition) {
        const parsedPosition = JSON.parse(savedPosition)
        setPosition(parsedPosition)
        setInitialPosition(false)
      }
    } catch (e) {
      console.log("Could not load position from localStorage")
    }
  }, [])

  return (
    <div
      ref={wrapperRef}
      className="fixed z-50"
      style={{
        transform: `translate(${position.x}px, ${position.y}px)`,
        cursor: isDragging ? "grabbing" : "grab",
        touchAction: "none",
      }}
      onMouseDown={handleMouseDown}
      onTouchStart={handleTouchStart}
    >
      {children}
    </div>
  )
}
