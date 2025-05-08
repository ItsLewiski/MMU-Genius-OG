"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { BookModal } from "@/components/shop/book-modal"
import { Star, Search, ShoppingCart, AlertCircle, Filter } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import { useCart } from "@/components/shop/cart-context"
import { useRouter } from "next/navigation"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { CartNotification } from "@/components/shop/cart-notification"

// Sample book data - only showing books category
const books = [
  {
    id: 1,
    name: "Atomic Habits",
    author: "James Clear",
    price: 900,
    rating: 4.8,
    reviews: 12453,
    image:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/HM-Blog-Atomic-Habits-Ekf9PPRjNvzHpypwc24izjtmxPU50S.png",
    description: "Tiny Changes, Remarkable Results. Learn how to build good habits and break bad ones.",
    category: "Books",
    bestSeller: true,
    inStock: true,
    deliveryDate: "Tomorrow",
  },
  {
    id: 2,
    name: "The Psychology of Money",
    author: "Morgan Housel",
    price: 950,
    rating: 4.7,
    reviews: 8932,
    image:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/The%20psychology%20of%20Money%20%281%29-D79bxmiswlWNM4J6zSPedwVdfJvxGD.png",
    description: "Timeless lessons on wealth, greed, and happiness.",
    category: "Books",
    bestSeller: true,
    inStock: true,
    deliveryDate: "Tomorrow",
  },
  {
    id: 3,
    name: "Rich Dad Poor Dad",
    author: "Robert Kiyosaki",
    price: 850,
    rating: 4.6,
    reviews: 15678,
    image:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Rich%20Dad%20%20Poor%20Dad-ra6n8ia5d3LJZm4Y7ChXKWS4WY8MHb.png",
    description: "What the Rich Teach Their Kids About Money That the Poor and Middle Class Do Not!",
    category: "Books",
    bestSeller: true,
    inStock: true,
    deliveryDate: "2-3 days",
  },
  {
    id: 4,
    name: "Think and Grow Rich",
    author: "Napoleon Hill",
    price: 800,
    rating: 4.5,
    reviews: 7890,
    image:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/think%20and%20grow%20rich%20%281%29-JGLnAHaGoYCiM8EQ29bpZmJgkRFE4A.png",
    description: "The classic book on personal success and wealth creation.",
    category: "Books",
    bestSeller: false,
    inStock: true,
    deliveryDate: "2-3 days",
  },
  {
    id: 5,
    name: "The 80/20 Principle",
    author: "Richard Koch",
    price: 1050,
    rating: 4.7,
    reviews: 9876,
    image:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/The%2080_20%20Pinciple%20%281%29-PdkthWjMkqlO0inObWj4y2sDsdCBfa.png",
    description: "The Secret to Achieving More with Less.",
    category: "Books",
    bestSeller: false,
    inStock: true,
    deliveryDate: "3-5 days",
  },
  {
    id: 6,
    name: "48 Laws of Power",
    author: "Robert Greene",
    price: 1200,
    rating: 4.6,
    reviews: 8765,
    image:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/48%20laws%20of%20power%20%281%29-ClvZb6MWFXIYf9tsHEksk1uCvnLMz0.png",
    description: "A guide to understanding the rules of social power dynamics.",
    category: "Books",
    bestSeller: false,
    inStock: true,
    deliveryDate: "3-5 days",
  },
]

export function BookList() {
  // All hooks must be called at the top level
  const { isAuthenticated } = useAuth()
  const { addToCart } = useCart()
  const router = useRouter()

  const [searchTerm, setSearchTerm] = useState("")
  const [selectedBook, setSelectedBook] = useState<any>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [filteredBooks, setFilteredBooks] = useState(books)
  const [isLoginDialogOpen, setIsLoginDialogOpen] = useState(false)
  const [isFilterOpen, setIsFilterOpen] = useState(false)

  // Filter states
  const [selectedAuthors, setSelectedAuthors] = useState<string[]>([])
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 2000])
  const [sortBy, setSortBy] = useState<string>("featured")

  const [showCartNotification, setShowCartNotification] = useState(false)
  const [addedProductName, setAddedProductName] = useState("")

  // Get unique authors for filter
  const authors = Array.from(new Set(books.map((book) => book.author)))

  // Price range for filter
  const minPrice = Math.min(...books.map((book) => book.price))
  const maxPrice = Math.max(...books.map((book) => book.price))

  // Apply filters and search
  useEffect(() => {
    let results = [...books]

    // Apply search term
    if (searchTerm) {
      results = results.filter(
        (book) =>
          book.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          book.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
          book.author.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    // Apply author filter
    if (selectedAuthors.length > 0) {
      results = results.filter((book) => selectedAuthors.includes(book.author))
    }

    // Apply price range filter
    results = results.filter((book) => book.price >= priceRange[0] && book.price <= priceRange[1])

    // Apply sorting
    if (sortBy === "price-low") {
      results.sort((a, b) => a.price - b.price)
    } else if (sortBy === "price-high") {
      results.sort((a, b) => b.price - a.price)
    } else if (sortBy === "rating") {
      results.sort((a, b) => b.rating - a.rating)
    }

    setFilteredBooks(results)
  }, [searchTerm, selectedAuthors, priceRange, sortBy])

  const handleBookClick = (book: any) => {
    setSelectedBook(book)
    setIsModalOpen(true)
  }

  const handleAddToCart = (book: any, event?: React.MouseEvent) => {
    if (event) {
      event.stopPropagation()
    }

    if (!isAuthenticated) {
      setIsLoginDialogOpen(true)
      return
    }

    // Use the CartProvider context
    addToCart(book)

    // Show notification
    setAddedProductName(book.name)
    setShowCartNotification(true)
  }

  const formatPrice = (price: number) => {
    return `KSh ${price.toLocaleString()}`
  }

  const toggleAuthorFilter = (author: string) => {
    setSelectedAuthors((prev) => (prev.includes(author) ? prev.filter((a) => a !== author) : [...prev, author]))
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
          <Star className="h-4 w-4 text-gray-300 dark:text-gray-600" />
          <div className="absolute top-0 left-0 overflow-hidden w-1/2">
            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
          </div>
        </div>,
      )
    }

    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0)
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<Star key={`empty-${i}`} className="h-4 w-4 text-gray-300 dark:text-gray-600" />)
    }

    return stars
  }

  return (
    <div className="container py-8">
      {/* Header with search */}
      <div className="bg-study-purple dark:bg-study-purple/80 text-white p-4 rounded-md mb-6">
        <div className="flex flex-col md:flex-row items-center gap-4">
          <div className="flex-1 w-full">
            <div className="flex">
              <div className="relative flex-1">
                <Input
                  type="text"
                  placeholder="Search books..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 rounded-l-md text-black dark:text-white dark:bg-gray-800 dark:border-gray-700 w-full bg-white"
                />
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500 dark:text-gray-400" />
              </div>
              <Button className="rounded-l-none bg-study-blue hover:bg-study-blue/80 text-white">
                <Search className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <Button
            variant="outline"
            className="text-white border-white hover:bg-white/20 w-full md:w-auto"
            onClick={() => setIsFilterOpen(!isFilterOpen)}
          >
            <Filter className="h-4 w-4 mr-2" />
            Filters
          </Button>
        </div>

        {/* Filter options */}
        {isFilterOpen && (
          <div className="mt-4 p-4 bg-white dark:bg-gray-800 rounded-md text-black dark:text-white">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Author filter */}
              <div>
                <h3 className="font-medium mb-2">Author</h3>
                <div className="space-y-2">
                  {authors.map((author) => (
                    <div key={author} className="flex items-center">
                      <Checkbox
                        id={`author-${author}`}
                        checked={selectedAuthors.includes(author)}
                        onCheckedChange={() => toggleAuthorFilter(author)}
                      />
                      <Label htmlFor={`author-${author}`} className="ml-2 text-sm font-normal">
                        {author}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Price range filter */}
              <div>
                <h3 className="font-medium mb-2">Price Range</h3>
                <div className="px-2">
                  <Slider
                    defaultValue={[minPrice, maxPrice]}
                    min={minPrice}
                    max={maxPrice}
                    step={50}
                    value={priceRange}
                    onValueChange={(value) => setPriceRange(value as [number, number])}
                    className="my-6"
                  />
                  <div className="flex justify-between text-sm">
                    <span>{formatPrice(priceRange[0])}</span>
                    <span>{formatPrice(priceRange[1])}</span>
                  </div>
                </div>
              </div>

              {/* Sort options */}
              <div>
                <h3 className="font-medium mb-2">Sort By</h3>
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="featured">Featured</SelectItem>
                    <SelectItem value="price-low">Price: Low to High</SelectItem>
                    <SelectItem value="price-high">Price: High to Low</SelectItem>
                    <SelectItem value="rating">Highest Rated</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex justify-end mt-4 space-x-2">
              <Button
                variant="outline"
                onClick={() => {
                  setSelectedAuthors([])
                  setPriceRange([minPrice, maxPrice])
                  setSortBy("featured")
                }}
              >
                Reset Filters
              </Button>
              <Button className="bg-study-purple hover:bg-study-blue text-white" onClick={() => setIsFilterOpen(false)}>
                Apply Filters
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Results count */}
      <div className="mb-4">
        <h1 className="text-2xl font-bold mb-2 dark:text-white">Books</h1>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          {filteredBooks.length} results {searchTerm ? `for "${searchTerm}"` : ""}
        </p>
      </div>

      {/* Book grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredBooks.map((book) => (
          <Card
            key={book.id}
            className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer border border-gray-200 dark:border-gray-700 dark:bg-gray-800"
            onClick={() => handleBookClick(book)}
          >
            <CardContent className="p-0">
              <div className="relative bg-gray-50 dark:bg-gray-700 p-4 flex justify-center items-center h-[200px]">
                <Image
                  src={book.image || "/placeholder.svg"}
                  alt={book.name}
                  width={150}
                  height={150}
                  className="object-contain max-h-[150px]"
                />
                {book.bestSeller && (
                  <div className="absolute top-2 left-2 bg-yellow-300 text-black text-xs font-bold px-2 py-1 rounded">
                    Best Seller
                  </div>
                )}
              </div>
              <div className="p-4">
                <h3 className="font-medium text-study-blue hover:text-study-purple hover:underline mb-1 line-clamp-2 dark:text-white">
                  {book.name}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">by {book.author}</p>
                <div className="flex items-center mb-1">
                  <div className="flex mr-2">{renderRating(book.rating)}</div>
                  <span className="text-sm text-study-blue dark:text-study-blue">{book.reviews.toLocaleString()}</span>
                </div>
                <div className="mb-2">
                  <span className="text-lg font-bold dark:text-white">{formatPrice(book.price)}</span>
                </div>
                <div className="text-sm mb-3">
                  {book.inStock ? (
                    <span className="text-green-700 dark:text-green-500">
                      Get it by <span className="font-bold">{book.deliveryDate}</span>
                    </span>
                  ) : (
                    <span className="text-red-600 dark:text-red-400 font-medium">Currently unavailable</span>
                  )}
                </div>
                <Button
                  className="w-full bg-study-purple hover:bg-study-blue text-white"
                  onClick={(e) => handleAddToCart(book, e)}
                  disabled={!book.inStock}
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
      {filteredBooks.length === 0 && (
        <div className="text-center py-12">
          <p className="text-xl font-medium mb-2 dark:text-white">No books found</p>
          <p className="text-gray-600 dark:text-gray-400">Try adjusting your search criteria</p>
        </div>
      )}

      {/* Book modal */}
      {selectedBook && (
        <BookModal
          book={selectedBook}
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onAddToCart={handleAddToCart}
          formatPrice={formatPrice}
          renderRating={renderRating}
        />
      )}

      {/* Login dialog */}
      <Dialog open={isLoginDialogOpen} onOpenChange={setIsLoginDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Login Required</DialogTitle>
            <DialogDescription>Please log in to add items to your cart.</DialogDescription>
          </DialogHeader>
          <div className="flex items-center space-x-2 py-4">
            <AlertCircle className="h-6 w-6 text-study-purple" />
            <p className="text-sm text-gray-600 dark:text-gray-400">
              You need to be logged in to add books to your cart and make purchases.
            </p>
          </div>
          <DialogFooter className="sm:justify-start">
            <Button
              type="button"
              variant="default"
              className="bg-study-purple hover:bg-study-blue text-white"
              onClick={() => {
                setIsLoginDialogOpen(false)
                router.push("/login")
              }}
            >
              Go to Login
            </Button>
            <Button type="button" variant="outline" onClick={() => setIsLoginDialogOpen(false)}>
              Cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      {/* Cart notification */}
      <CartNotification
        isOpen={showCartNotification}
        onClose={() => setShowCartNotification(false)}
        productName={addedProductName}
      />
    </div>
  )
}
