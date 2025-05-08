"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Star, ShoppingCart, Check, Clock, Truck } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { useCart } from "@/components/shop/cart-context"
import { safeGet } from "@/lib/safe-data"

interface BookModalProps {
  book: any
  isOpen: boolean
  onClose: () => void
}

export function BookModal({ book, isOpen, onClose }: BookModalProps) {
  const [quantity, setQuantity] = useState(1)
  const { addToCart } = useCart()
  const { toast } = useToast()

  // Safely handle undefined book
  if (!book) {
    return null
  }

  const handleAddToCart = () => {
    try {
      addToCart({
        id: book.id,
        title: book.title,
        price: book.price,
        image: book.image,
        quantity,
      })

      toast({
        title: "Added to cart",
        description: `${book.title} has been added to your cart.`,
        duration: 3000,
      })

      onClose()
    } catch (error) {
      console.error("Error adding to cart:", error)
      toast({
        title: "Error",
        description: "Could not add item to cart. Please try again.",
        variant: "destructive",
      })
    }
  }

  const renderRating = (rating: number) => {
    const stars = []
    const fullStars = Math.floor(rating)
    const hasHalfStar = rating % 1 >= 0.5

    // Add full stars
    for (let i = 0; i < fullStars; i++) {
      stars.push(<Star key={`full-${i}`} className="h-4 w-4 fill-yellow-400 text-yellow-400" />)
    }

    // Add half star if needed
    if (hasHalfStar) {
      stars.push(
        <span key="half" className="relative">
          <Star className="h-4 w-4 text-yellow-400" />
          <Star
            className="absolute top-0 left-0 h-4 w-4 fill-yellow-400 text-yellow-400 overflow-hidden"
            style={{ clipPath: "inset(0 50% 0 0)" }}
          />
        </span>,
      )
    }

    // Add empty stars
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0)
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<Star key={`empty-${i}`} className="h-4 w-4 text-gray-300" />)
    }

    return (
      <div className="flex items-center">
        <div className="flex mr-1">{stars}</div>
        <span className="text-sm text-gray-600 dark:text-gray-400">({book.reviews} reviews)</span>
      </div>
    )
  }

  const title = safeGet(book, "title", "Book Title")
  const author = safeGet(book, "author", "Unknown Author")
  const description = safeGet(book, "description", "No description available")
  const price = safeGet(book, "price", 0)
  const rating = safeGet(book, "rating", 0)
  const reviews = safeGet(book, "reviews", 0)
  const image = safeGet(book, "image", "/placeholder.svg?height=300&width=200")
  const isBestSeller = safeGet(book, "bestSeller", false)
  const inStock = safeGet(book, "inStock", true)

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">{title}</DialogTitle>
          <DialogDescription className="text-base">by {author}</DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
          <div className="flex justify-center">
            <div className="relative">
              <img
                src={image || "/placeholder.svg"}
                alt={title}
                className="object-cover rounded-md shadow-md max-h-[300px]"
              />
              {isBestSeller && <Badge className="absolute top-2 left-2 bg-amber-500 text-white">Best Seller</Badge>}
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold">${price.toFixed(2)}</span>
                {inStock ? (
                  <Badge className="bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100">In Stock</Badge>
                ) : (
                  <Badge variant="outline" className="text-gray-500">
                    Out of Stock
                  </Badge>
                )}
              </div>

              {renderRating(rating)}

              <div className="mt-4 flex items-center text-sm text-gray-600 dark:text-gray-400">
                <Truck className="h-4 w-4 mr-1" />
                <span>Free delivery on orders over $35</span>
              </div>

              <div className="flex items-center text-sm text-gray-600 dark:text-gray-400 mt-1">
                <Clock className="h-4 w-4 mr-1" />
                <span>Get it by tomorrow if you order within 3 hrs</span>
              </div>
            </div>

            <div className="border-t border-b py-4">
              <h3 className="font-medium mb-2">Description</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">{description}</p>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  disabled={quantity <= 1}
                  className="h-8 w-8"
                >
                  -
                </Button>
                <span className="w-8 text-center">{quantity}</span>
                <Button variant="outline" size="icon" onClick={() => setQuantity(quantity + 1)} className="h-8 w-8">
                  +
                </Button>
              </div>

              <Button
                onClick={handleAddToCart}
                className="flex-1 bg-amber-500 hover:bg-amber-600 text-white"
                disabled={!inStock}
              >
                <ShoppingCart className="h-4 w-4 mr-2" />
                Add to Cart
              </Button>
            </div>

            <div className="text-sm text-gray-600 dark:text-gray-400">
              <div className="flex items-center">
                <Check className="h-4 w-4 mr-1 text-green-500" />
                <span>30-day returns</span>
              </div>
              <div className="flex items-center">
                <Check className="h-4 w-4 mr-1 text-green-500" />
                <span>Secure transaction</span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6">
          <h3 className="font-medium mb-2">Customer Reviews</h3>
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="border-b pb-3">
                <div className="flex items-center gap-2">
                  <div className="flex">
                    {Array(5)
                      .fill(0)
                      .map((_, j) => (
                        <Star
                          key={j}
                          className={`h-3 w-3 ${j < 4 ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`}
                        />
                      ))}
                  </div>
                  <span className="text-sm font-medium">Verified Purchase</span>
                </div>
                <p className="text-sm mt-1">
                  {i === 1
                    ? `This book changed my perspective on ${title.split(" ")[0].toLowerCase()}. Highly recommended!`
                    : i === 2
                      ? "The author does a great job explaining complex concepts in simple terms."
                      : "I couldn't put this book down. A must-read for anyone interested in this topic."}
                </p>
              </div>
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
