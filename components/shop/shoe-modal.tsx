"use client"

import { useState } from "react"
import Image from "next/image"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Star, StarHalf } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface Review {
  id: number
  author: string
  rating: number
  date: string
  comment: string
}

interface ShoeModalProps {
  shoe: any
  isOpen: boolean
  onClose: () => void
  onAddToCart: (shoe: any, size?: number) => void
}

export function ShoeModal({ shoe, isOpen, onClose, onAddToCart }: ShoeModalProps) {
  const [selectedSize, setSelectedSize] = useState<number | null>(null)
  const [activeTab, setActiveTab] = useState("details")

  // Format price from cents to dollars
  const formatPrice = (price: number) => {
    return `KSh ${Math.floor(price / 100)},${(price % 100).toString().padStart(2, "0")}`
  }

  const handleAddToCart = () => {
    onAddToCart(shoe, selectedSize || undefined)
    onClose()
  }

  // Render star rating
  const renderRating = (rating: number) => {
    const stars = []
    const fullStars = Math.floor(rating)
    const hasHalfStar = rating % 1 >= 0.5

    // Add full stars
    for (let i = 0; i < fullStars; i++) {
      stars.push(<Star key={`star-${i}`} className="h-4 w-4 fill-yellow-400 text-yellow-400" />)
    }

    // Add half star if needed
    if (hasHalfStar) {
      stars.push(<StarHalf key="half-star" className="h-4 w-4 fill-yellow-400 text-yellow-400" />)
    }

    // Add empty stars
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0)
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<Star key={`empty-star-${i}`} className="h-4 w-4 text-gray-300" />)
    }

    return (
      <div className="flex items-center">
        <div className="flex mr-1">{stars}</div>
        <span className="text-sm text-gray-600 dark:text-gray-400">({rating.toFixed(1)})</span>
      </div>
    )
  }

  if (!shoe) return null

  // Sample reviews for the shoe
  const reviews: Review[] = [
    {
      id: 1,
      author: "Sarah J.",
      rating: 4.5,
      date: "2023-10-15",
      comment: "These shoes are incredibly comfortable and stylish. I've received many compliments wearing them.",
    },
    {
      id: 2,
      author: "Michael T.",
      rating: 5,
      date: "2023-09-28",
      comment: "Perfect fit and great quality. Definitely worth the price!",
    },
    {
      id: 3,
      author: "Jessica L.",
      rating: 3.5,
      date: "2023-11-02",
      comment: "Good looking shoes but they run a bit small. Consider ordering half a size up.",
    },
    {
      id: 4,
      author: "David K.",
      rating: 4,
      date: "2023-10-05",
      comment: "Very stylish and comfortable for everyday wear. The color is exactly as shown in the pictures.",
    },
  ]

  // Calculate average rating
  const averageRating = reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">{shoe.name}</DialogTitle>
        </DialogHeader>

        <div className="mt-4">
          <Tabs defaultValue="details" onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="details">Details</TabsTrigger>
              <TabsTrigger value="reviews">Reviews ({reviews.length})</TabsTrigger>
            </TabsList>

            <TabsContent value="details" className="pt-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="relative h-[250px] bg-gray-50 rounded-md">
                  <Image src={shoe.image || "/placeholder.svg"} alt={shoe.name} fill className="object-contain p-4" />
                  {shoe.isBestSeller && (
                    <Badge className="absolute top-2 left-2 bg-amber-500 text-white">Best Seller</Badge>
                  )}
                </div>

                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-muted-foreground">{shoe.brand}</p>
                    <p className="text-xl font-bold mt-1">{formatPrice(shoe.price)}</p>
                    <div className="flex items-center mt-2">
                      {renderRating(averageRating)}
                      <span className="ml-2 text-sm text-muted-foreground">
                        {reviews.length} {reviews.length === 1 ? "review" : "reviews"}
                      </span>
                    </div>
                    <Badge variant="outline" className="mt-2">
                      {shoe.inStock ? "In Stock" : "Out of Stock"}
                    </Badge>
                  </div>

                  <div>
                    <h4 className="font-medium mb-2">Size</h4>
                    <div className="grid grid-cols-4 gap-2">
                      {shoe.sizes.map((size: number) => (
                        <Button
                          key={size}
                          type="button"
                          variant={selectedSize === size ? "default" : "outline"}
                          className={selectedSize === size ? "bg-study-purple hover:bg-study-blue" : ""}
                          onClick={() => setSelectedSize(size)}
                        >
                          {size}
                        </Button>
                      ))}
                    </div>
                    {shoe.inStock && !selectedSize && (
                      <p className="text-xs text-muted-foreground mt-2">Please select a size</p>
                    )}
                  </div>

                  <p className="text-sm">{shoe.description}</p>

                  <Button
                    onClick={handleAddToCart}
                    className="w-full bg-study-purple hover:bg-study-blue text-white"
                    disabled={!shoe.inStock || !selectedSize}
                  >
                    Add to Cart
                  </Button>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="reviews" className="pt-4">
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold">Customer Reviews</h3>
                    <div className="flex items-center mt-1">
                      {renderRating(averageRating)}
                      <span className="ml-2 text-sm">
                        Based on {reviews.length} {reviews.length === 1 ? "review" : "reviews"}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  {reviews.map((review) => (
                    <div key={review.id} className="border-b pb-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-medium">{review.author}</p>
                          <div className="flex items-center mt-1">
                            {renderRating(review.rating)}
                            <span className="ml-2 text-xs text-gray-500">{review.date}</span>
                          </div>
                        </div>
                      </div>
                      <p className="mt-2 text-sm">{review.comment}</p>
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  )
}
