"use client"

import type React from "react"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { ShoppingCart, Check, Shield, Truck } from "lucide-react"
import Image from "next/image"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useAuth } from "@/contexts/auth-context"

interface BookModalProps {
  book: any
  isOpen: boolean
  onClose: () => void
  onAddToCart: (book: any) => void
  formatPrice: (price: number) => string
  renderRating: (rating: number) => React.ReactNode[]
}

export function BookModal({ book, isOpen, onClose, onAddToCart, formatPrice, renderRating }: BookModalProps) {
  const { isAuthenticated } = useAuth()

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto dark:bg-gray-800 dark:text-white">
        <DialogHeader>
          <DialogTitle className="text-xl dark:text-white">{book.name}</DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
          {/* Book image */}
          <div className="bg-gray-50 dark:bg-gray-700 p-6 rounded-md flex items-center justify-center">
            <Image
              src={book.image || "/placeholder.svg"}
              alt={book.name}
              width={300}
              height={300}
              className="object-contain max-h-[300px]"
            />
          </div>

          {/* Book details */}
          <div>
            <h2 className="text-2xl font-medium mb-2 dark:text-white">{book.name}</h2>
            <p className="text-sm text-study-blue dark:text-study-blue mb-2">by {book.author}</p>

            <div className="flex items-center mb-2">
              <div className="flex mr-2">{renderRating(book.rating)}</div>
              <span className="text-sm text-study-blue hover:text-study-purple hover:underline cursor-pointer dark:text-study-blue">
                {book.reviews.toLocaleString()} ratings
              </span>
            </div>

            {book.bestSeller && (
              <div className="inline-block bg-yellow-300 text-black text-xs font-bold px-2 py-1 rounded mb-2">
                Best Seller
              </div>
            )}

            <div className="border-t border-b py-3 my-3 border-gray-200 dark:border-gray-700">
              <div className="mb-1">
                <span className="text-sm dark:text-gray-300">Price:</span>
                <span className="text-xl font-bold ml-2 dark:text-white">{formatPrice(book.price)}</span>
              </div>
            </div>

            <div className="mb-4">
              <p className="font-medium mb-2 dark:text-white">About this book:</p>
              <p className="text-sm dark:text-gray-300">{book.description}</p>
            </div>

            <div className="space-y-3">
              <div className="flex items-start">
                <Check className="h-5 w-5 text-green-600 dark:text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-medium dark:text-white">In Stock</p>
                  {book.inStock ? (
                    <p className="text-sm text-green-700 dark:text-green-500">
                      Get it by <span className="font-bold">{book.deliveryDate}</span>
                    </p>
                  ) : (
                    <p className="text-sm text-red-600 dark:text-red-400">Currently unavailable</p>
                  )}
                </div>
              </div>

              <div className="flex items-start">
                <Shield className="h-5 w-5 text-gray-600 dark:text-gray-400 mr-2 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-medium dark:text-white">Secure transaction</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Your transaction is secure. We work hard to protect your security and privacy.
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <Truck className="h-5 w-5 text-gray-600 dark:text-gray-400 mr-2 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-medium dark:text-white">Shipping Details</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Ships from and sold by MMU Genius. Gift-wrap available.
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-6">
              <Button
                className="w-full bg-study-purple hover:bg-study-blue text-white"
                onClick={() => onAddToCart(book)}
                disabled={!book.inStock}
              >
                <ShoppingCart className="h-4 w-4 mr-2" />
                Add to Cart
              </Button>
            </div>
          </div>
        </div>

        {/* Book tabs */}
        <Tabs defaultValue="description" className="mt-6">
          <TabsList className="grid w-full grid-cols-3 dark:bg-gray-700">
            <TabsTrigger value="description" className="dark:data-[state=active]:bg-gray-600">
              Description
            </TabsTrigger>
            <TabsTrigger value="details" className="dark:data-[state=active]:bg-gray-600">
              Product Details
            </TabsTrigger>
            <TabsTrigger value="reviews" className="dark:data-[state=active]:bg-gray-600">
              Customer Reviews
            </TabsTrigger>
          </TabsList>
          <TabsContent value="description" className="p-4 dark:text-gray-300">
            <p>{book.description}</p>
          </TabsContent>
          <TabsContent value="details" className="p-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="font-medium dark:text-white">Category</p>
                <p className="text-sm dark:text-gray-300">{book.category}</p>
              </div>
              <div>
                <p className="font-medium dark:text-white">Author</p>
                <p className="text-sm dark:text-gray-300">{book.author}</p>
              </div>
              <div>
                <p className="font-medium dark:text-white">Rating</p>
                <div className="flex items-center">
                  <div className="flex">{renderRating(book.rating)}</div>
                  <span className="text-sm ml-2 dark:text-gray-300">{book.rating} out of 5</span>
                </div>
              </div>
              <div>
                <p className="font-medium dark:text-white">Availability</p>
                <p className="text-sm dark:text-gray-300">{book.inStock ? "In Stock" : "Out of Stock"}</p>
              </div>
            </div>
          </TabsContent>
          <TabsContent value="reviews" className="p-4">
            <div className="space-y-4">
              <div className="flex items-center">
                <div className="flex-1">
                  <div className="flex items-center">
                    <div className="flex">{renderRating(book.rating)}</div>
                    <span className="text-lg font-medium ml-2 dark:text-white">{book.rating} out of 5</span>
                  </div>
                  <p className="text-sm dark:text-gray-300">{book.reviews.toLocaleString()} global ratings</p>
                </div>
                <Button variant="outline" className="dark:text-white dark:border-gray-600">
                  Write a review
                </Button>
              </div>

              {/* Sample reviews */}
              <div className="space-y-4 mt-4">
                <div className="border-b pb-4 border-gray-200 dark:border-gray-700">
                  <div className="flex items-center mb-2">
                    <div className="h-8 w-8 rounded-full bg-gray-200 dark:bg-gray-600 mr-2"></div>
                    <div>
                      <p className="font-medium dark:text-white">John D.</p>
                      <div className="flex">{renderRating(5)}</div>
                    </div>
                  </div>
                  <p className="font-medium dark:text-white">Excellent book!</p>
                  <p className="text-sm dark:text-gray-300">
                    This is exactly what I needed for my studies. Highly recommended for all students.
                  </p>
                </div>

                <div className="border-b pb-4 border-gray-200 dark:border-gray-700">
                  <div className="flex items-center mb-2">
                    <div className="h-8 w-8 rounded-full bg-gray-200 dark:bg-gray-600 mr-2"></div>
                    <div>
                      <p className="font-medium dark:text-white">Mary K.</p>
                      <div className="flex">{renderRating(4)}</div>
                    </div>
                  </div>
                  <p className="font-medium dark:text-white">Good value for money</p>
                  <p className="text-sm dark:text-gray-300">
                    Quality book at a reasonable price. Delivery was prompt and packaging was good.
                  </p>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}
