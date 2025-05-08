"use client"

import type React from "react"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { ShoppingCart, Check, Shield, Truck } from "lucide-react"
import Image from "next/image"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface ProductModalProps {
  product: any
  isOpen: boolean
  onClose: () => void
  onAddToCart: (product: any) => void
  formatPrice: (price: number) => string
  renderRating: (rating: number) => React.ReactNode[]
}

export function ProductModal({ product, isOpen, onClose, onAddToCart, formatPrice, renderRating }: ProductModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl">{product.name}</DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
          {/* Product image */}
          <div className="bg-gray-50 p-6 rounded-md flex items-center justify-center">
            <Image
              src={product.image || "/placeholder.svg"}
              alt={product.name}
              width={300}
              height={300}
              className="object-contain max-h-[300px]"
            />
          </div>

          {/* Product details */}
          <div>
            <h2 className="text-2xl font-medium mb-2">{product.name}</h2>
            <p className="text-sm text-blue-600 mb-2">by {product.author}</p>

            <div className="flex items-center mb-2">
              <div className="flex mr-2">{renderRating(product.rating)}</div>
              <span className="text-sm text-blue-500 hover:text-orange-500 hover:underline cursor-pointer">
                {product.reviews.toLocaleString()} ratings
              </span>
            </div>

            {product.bestSeller && (
              <div className="inline-block bg-[#F0C14B] text-xs font-bold px-2 py-1 rounded mb-2">Best Seller</div>
            )}

            <div className="border-t border-b py-3 my-3">
              <div className="mb-1">
                <span className="text-sm">Price:</span>
                <span className="text-xl font-bold ml-2">{formatPrice(product.price)}</span>
              </div>
              {product.prime && (
                <div className="flex items-center text-sm">
                  <div className="bg-[#232F3E] text-white text-xs font-bold px-2 py-1 rounded mr-2">Prime</div>
                  <span>FREE Delivery</span>
                </div>
              )}
            </div>

            <div className="mb-4">
              <p className="font-medium mb-2">About this item:</p>
              <p className="text-sm">{product.description}</p>
            </div>

            <div className="space-y-3">
              <div className="flex items-start">
                <Check className="h-5 w-5 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-medium">In Stock</p>
                  {product.inStock ? (
                    <p className="text-sm text-green-700">
                      Get it by <span className="font-bold">{product.deliveryDate}</span>
                    </p>
                  ) : (
                    <p className="text-sm text-red-600">Currently unavailable</p>
                  )}
                </div>
              </div>

              <div className="flex items-start">
                <Shield className="h-5 w-5 text-gray-600 mr-2 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-medium">Secure transaction</p>
                  <p className="text-sm text-gray-600">
                    Your transaction is secure. We work hard to protect your security and privacy.
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <Truck className="h-5 w-5 text-gray-600 mr-2 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-medium">Shipping Details</p>
                  <p className="text-sm text-gray-600">Ships from and sold by MMU Genius. Gift-wrap available.</p>
                </div>
              </div>
            </div>

            <div className="mt-6 space-y-3">
              <Button
                className="w-full bg-[#FFD814] hover:bg-[#F7CA00] text-black border border-[#FCD200]"
                onClick={() => onAddToCart(product)}
                disabled={!product.inStock}
              >
                <ShoppingCart className="h-4 w-4 mr-2" />
                Add to Cart
              </Button>
              <Button
                className="w-full bg-[#FA8900] hover:bg-[#E47911] text-black border border-[#C89411]"
                disabled={!product.inStock}
              >
                Buy Now
              </Button>
            </div>
          </div>
        </div>

        {/* Product tabs */}
        <Tabs defaultValue="description" className="mt-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="description">Description</TabsTrigger>
            <TabsTrigger value="details">Product Details</TabsTrigger>
            <TabsTrigger value="reviews">Customer Reviews</TabsTrigger>
          </TabsList>
          <TabsContent value="description" className="p-4">
            <p>{product.description}</p>
          </TabsContent>
          <TabsContent value="details" className="p-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="font-medium">Category</p>
                <p className="text-sm">{product.category}</p>
              </div>
              <div>
                <p className="font-medium">Author/Brand</p>
                <p className="text-sm">{product.author}</p>
              </div>
              <div>
                <p className="font-medium">Rating</p>
                <div className="flex items-center">
                  <div className="flex">{renderRating(product.rating)}</div>
                  <span className="text-sm ml-2">{product.rating} out of 5</span>
                </div>
              </div>
              <div>
                <p className="font-medium">Availability</p>
                <p className="text-sm">{product.inStock ? "In Stock" : "Out of Stock"}</p>
              </div>
            </div>
          </TabsContent>
          <TabsContent value="reviews" className="p-4">
            <div className="space-y-4">
              <div className="flex items-center">
                <div className="flex-1">
                  <div className="flex items-center">
                    <div className="flex">{renderRating(product.rating)}</div>
                    <span className="text-lg font-medium ml-2">{product.rating} out of 5</span>
                  </div>
                  <p className="text-sm">{product.reviews.toLocaleString()} global ratings</p>
                </div>
                <Button variant="outline">Write a review</Button>
              </div>

              {/* Sample reviews */}
              <div className="space-y-4 mt-4">
                <div className="border-b pb-4">
                  <div className="flex items-center mb-2">
                    <div className="h-8 w-8 rounded-full bg-gray-200 mr-2"></div>
                    <div>
                      <p className="font-medium">John D.</p>
                      <div className="flex">{renderRating(5)}</div>
                    </div>
                  </div>
                  <p className="font-medium">Excellent product!</p>
                  <p className="text-sm">
                    This is exactly what I needed for my studies. Highly recommended for all students.
                  </p>
                </div>

                <div className="border-b pb-4">
                  <div className="flex items-center mb-2">
                    <div className="h-8 w-8 rounded-full bg-gray-200 mr-2"></div>
                    <div>
                      <p className="font-medium">Mary K.</p>
                      <div className="flex">{renderRating(4)}</div>
                    </div>
                  </div>
                  <p className="font-medium">Good value for money</p>
                  <p className="text-sm">
                    Quality product at a reasonable price. Delivery was prompt and packaging was good.
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
