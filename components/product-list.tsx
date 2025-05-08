"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { ProductModal } from "@/components/product-modal"
import { Star, Search, ShoppingCart, Filter, ChevronDown, ChevronUp } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

// Sample product data
const products = [
  {
    id: 1,
    name: "Atomic Habits",
    author: "James Clear",
    price: 1200,
    rating: 4.8,
    reviews: 12453,
    image: "/assets/images/products/atomic-habits.png",
    description: "Tiny Changes, Remarkable Results. Learn how to build good habits and break bad ones.",
    category: "Books",
    bestSeller: true,
    inStock: true,
    deliveryDate: "Tomorrow",
    prime: true,
  },
  {
    id: 2,
    name: "The Psychology of Money",
    author: "Morgan Housel",
    price: 1500,
    rating: 4.7,
    reviews: 8932,
    image: "/assets/images/products/psychology-of-money.png",
    description: "Timeless lessons on wealth, greed, and happiness.",
    category: "Books",
    bestSeller: true,
    inStock: true,
    deliveryDate: "Tomorrow",
    prime: true,
  },
  {
    id: 3,
    name: "MMU Genius Premium Notebook",
    author: "MMU Genius",
    price: 350,
    rating: 4.5,
    reviews: 423,
    image: "/placeholder.svg?height=300&width=200",
    description: "High-quality notebook for all your study needs. 200 pages, hardcover.",
    category: "Stationery",
    bestSeller: false,
    inStock: true,
    deliveryDate: "2-3 days",
    prime: false,
  },
  {
    id: 4,
    name: "Study Planner 2023",
    author: "MMU Genius",
    price: 450,
    rating: 4.6,
    reviews: 289,
    image: "/placeholder.svg?height=300&width=200",
    description: "Plan your academic year effectively with this comprehensive study planner.",
    category: "Stationery",
    bestSeller: false,
    inStock: true,
    deliveryDate: "2-3 days",
    prime: false,
  },
  {
    id: 5,
    name: "Digital Flashcards Subscription",
    author: "MMU Genius",
    price: 800,
    rating: 4.9,
    reviews: 1203,
    image: "/placeholder.svg?height=300&width=200",
    description: "Access to premium digital flashcards for all university subjects. 3-month subscription.",
    category: "Digital",
    bestSeller: true,
    inStock: true,
    deliveryDate: "Instant Access",
    prime: true,
  },
  {
    id: 6,
    name: "Study Desk Lamp",
    author: "LightPro",
    price: 1800,
    rating: 4.4,
    reviews: 567,
    image: "/placeholder.svg?height=300&width=200",
    description: "Adjustable LED desk lamp with multiple brightness levels and color temperatures.",
    category: "Accessories",
    bestSeller: false,
    inStock: false,
    deliveryDate: "Out of stock",
    prime: false,
  },
]

// Categories for filtering
const categories = [
  { id: "all", name: "All Categories" },
  { id: "books", name: "Books" },
  { id: "stationery", name: "Stationery" },
  { id: "digital", name: "Digital Products" },
  { id: "accessories", name: "Accessories" },
]

// Sort options
const sortOptions = [
  { id: "featured", name: "Featured" },
  { id: "price-low", name: "Price: Low to High" },
  { id: "price-high", name: "Price: High to Low" },
  { id: "rating", name: "Avg. Customer Review" },
  { id: "newest", name: "Newest Arrivals" },
]

export function ProductList() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [sortBy, setSortBy] = useState("featured")
  const [selectedProduct, setSelectedProduct] = useState<any>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [filteredProducts, setFilteredProducts] = useState(products)
  const [cart, setCart] = useState<any[]>([])
  const [showFilters, setShowFilters] = useState(false)

  // Filter and sort products
  useEffect(() => {
    let result = [...products]

    // Apply category filter
    if (selectedCategory !== "all") {
      result = result.filter((product) => product.category.toLowerCase() === selectedCategory.toLowerCase())
    }

    // Apply search filter
    if (searchTerm) {
      result = result.filter(
        (product) =>
          product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          product.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
          product.author.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    // Apply sorting
    switch (sortBy) {
      case "price-low":
        result.sort((a, b) => a.price - b.price)
        break
      case "price-high":
        result.sort((a, b) => b.price - a.price)
        break
      case "rating":
        result.sort((a, b) => b.rating - a.rating)
        break
      case "newest":
        // For demo purposes, we'll just reverse the array
        result.reverse()
        break
      default:
        // Featured - sort by bestseller first, then rating
        result.sort((a, b) => {
          if (a.bestSeller && !b.bestSeller) return -1
          if (!a.bestSeller && b.bestSeller) return 1
          return b.rating - a.rating
        })
    }

    setFilteredProducts(result)
  }, [searchTerm, selectedCategory, sortBy])

  const handleProductClick = (product: any) => {
    setSelectedProduct(product)
    setIsModalOpen(true)
  }

  const handleAddToCart = (product: any, event?: React.MouseEvent) => {
    if (event) {
      event.stopPropagation()
    }
    setCart([...cart, product])
    // Show a toast or notification here
  }

  const formatPrice = (price: number) => {
    return `KSh ${price.toLocaleString()}`
  }

  // Render star ratings
  const renderRating = (rating: number) => {
    const fullStars = Math.floor(rating)
    const hasHalfStar = rating % 1 >= 0.5
    const stars = []

    for (let i = 0; i < fullStars; i++) {
      stars.push(<Star key={`full-${i}`} className="h-4 w-4 fill-yellow-400 text-yellow-400" />)
    }

    if (hasHalfStar) {
      stars.push(
        <div key="half" className="relative">
          <Star className="h-4 w-4 text-gray-300" />
          <div className="absolute top-0 left-0 overflow-hidden w-1/2">
            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
          </div>
        </div>,
      )
    }

    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0)
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<Star key={`empty-${i}`} className="h-4 w-4 text-gray-300" />)
    }

    return stars
  }

  return (
    <div className="container py-8">
      {/* Amazon-style header */}
      <div className="bg-[#232F3E] text-white p-4 rounded-t-md mb-6">
        <div className="flex flex-col md:flex-row items-center gap-4">
          <div className="flex-1 w-full">
            <div className="flex">
              <div className="relative flex-1">
                <Input
                  type="text"
                  placeholder="Search products..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 rounded-l-md text-black w-full"
                />
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
              </div>
              <Button className="rounded-l-none bg-[#FEBD69] hover:bg-[#F3A847] text-black">
                <Search className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <div className="flex items-center gap-2 w-full md:w-auto">
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-full md:w-[180px] bg-white text-black">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                {sortOptions.map((option) => (
                  <SelectItem key={option.id} value={option.id}>
                    {option.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button
              variant="outline"
              className="bg-white text-black border-gray-300 hover:bg-gray-100"
              onClick={() => setShowFilters(!showFilters)}
            >
              <Filter className="h-4 w-4 mr-2" />
              Filters
              {showFilters ? <ChevronUp className="h-4 w-4 ml-2" /> : <ChevronDown className="h-4 w-4 ml-2" />}
            </Button>
          </div>
        </div>

        {/* Filters section */}
        {showFilters && (
          <div className="mt-4 p-4 bg-white text-black rounded-md">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <h3 className="font-medium mb-2">Department</h3>
                <div className="space-y-1">
                  {categories.map((category) => (
                    <div key={category.id} className="flex items-center">
                      <input
                        type="radio"
                        id={category.id}
                        name="category"
                        checked={selectedCategory === category.id}
                        onChange={() => setSelectedCategory(category.id)}
                        className="mr-2"
                      />
                      <label htmlFor={category.id}>{category.name}</label>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <h3 className="font-medium mb-2">Customer Review</h3>
                <div className="space-y-1">
                  {[4, 3, 2, 1].map((rating) => (
                    <div key={rating} className="flex items-center">
                      <input type="checkbox" id={`rating-${rating}`} className="mr-2" />
                      <label htmlFor={`rating-${rating}`} className="flex items-center">
                        {Array(rating)
                          .fill(0)
                          .map((_, i) => (
                            <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                          ))}
                        {Array(5 - rating)
                          .fill(0)
                          .map((_, i) => (
                            <Star key={i} className="h-4 w-4 text-gray-300" />
                          ))}
                        <span className="ml-1">& Up</span>
                      </label>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <h3 className="font-medium mb-2">Price</h3>
                <div className="space-y-1">
                  <div>Under KSh 500</div>
                  <div>KSh 500 to KSh 1,000</div>
                  <div>KSh 1,000 to KSh 2,000</div>
                  <div>Over KSh 2,000</div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Results count */}
      <div className="mb-4 flex justify-between items-center">
        <p className="text-sm text-gray-600">
          {filteredProducts.length} results {searchTerm ? `for "${searchTerm}"` : ""}
        </p>
        {cart.length > 0 && (
          <Button variant="outline" className="flex items-center gap-2">
            <ShoppingCart className="h-4 w-4" />
            <span>{cart.length} item(s) in cart</span>
          </Button>
        )}
      </div>

      {/* Product grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredProducts.map((product) => (
          <Card
            key={product.id}
            className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer border border-gray-200"
            onClick={() => handleProductClick(product)}
          >
            <CardContent className="p-0">
              <div className="relative bg-gray-50 p-4 flex justify-center items-center h-[200px]">
                <Image
                  src={product.image || "/placeholder.svg"}
                  alt={product.name}
                  width={150}
                  height={150}
                  className="object-contain max-h-[150px]"
                />
                {product.bestSeller && (
                  <div className="absolute top-2 left-2 bg-[#F0C14B] text-xs font-bold px-2 py-1 rounded">
                    Best Seller
                  </div>
                )}
                {product.prime && (
                  <div className="absolute bottom-2 right-2 bg-[#232F3E] text-white text-xs font-bold px-2 py-1 rounded">
                    Prime
                  </div>
                )}
              </div>
              <div className="p-4">
                <h3 className="font-medium text-blue-600 hover:text-orange-500 hover:underline mb-1 line-clamp-2">
                  {product.name}
                </h3>
                <p className="text-sm text-gray-600 mb-1">by {product.author}</p>
                <div className="flex items-center mb-1">
                  <div className="flex mr-2">{renderRating(product.rating)}</div>
                  <span className="text-sm text-blue-500">{product.reviews.toLocaleString()}</span>
                </div>
                <div className="mb-2">
                  <span className="text-lg font-bold">{formatPrice(product.price)}</span>
                </div>
                <div className="text-sm mb-3">
                  {product.inStock ? (
                    <span className="text-green-700">
                      Get it by <span className="font-bold">{product.deliveryDate}</span>
                    </span>
                  ) : (
                    <span className="text-red-600 font-medium">Currently unavailable</span>
                  )}
                </div>
                <Button
                  className="w-full bg-[#FFD814] hover:bg-[#F7CA00] text-black border border-[#FCD200]"
                  onClick={(e) => handleAddToCart(product, e)}
                  disabled={!product.inStock}
                >
                  <ShoppingCart className="h-4 w-4 mr-2" />
                  Add to Cart
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Empty state */}
      {filteredProducts.length === 0 && (
        <div className="text-center py-12">
          <p className="text-xl font-medium mb-2">No products found</p>
          <p className="text-gray-600">Try adjusting your search or filter criteria</p>
        </div>
      )}

      {/* Product modal */}
      {selectedProduct && (
        <ProductModal
          product={selectedProduct}
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onAddToCart={handleAddToCart}
          formatPrice={formatPrice}
          renderRating={renderRating}
        />
      )}
    </div>
  )
}
