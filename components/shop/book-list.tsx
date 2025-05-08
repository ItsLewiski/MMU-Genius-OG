"use client"

import type React from "react"

import { useState } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { BookModal } from "@/components/shop/book-modal"
import { Star, ShoppingCart, AlertCircle } from "lucide-react"
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

interface BookListProps {
  searchQuery?: string
  limit?: number
  showViewAll?: boolean
}

export function BookList({ searchQuery = "", limit, showViewAll = false }: BookListProps) {
  // All hooks must be called at the top level
  const { isAuthenticated } = useAuth()
  const { addToCart } = useCart()
  const router = useRouter()

  const [selectedBook, setSelectedBook] = useState<any>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [filteredBooksState, setFilteredBooksState] = useState(books)
  const [isLoginDialogOpen, setIsLoginDialogOpen] = useState(false)
  const [showCartNotification, setShowCartNotification] = useState(false)
  const [addedProductName, setAddedProductName] = useState("")

  // Filter books based on search query
  const filteredBooks = books.filter(
    (book) =>
      book.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      book.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
      book.description.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  // Apply limit if provided
  const displayedBooks = limit ? filteredBooks.slice(0, limit) : filteredBooks

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

  const handleViewAll = () => {
    router.push("/shop?category=books")
  }

  return (
    <div className="container py-8">
      {/* Results count */}
      {!showViewAll && (
        <div className="mb-4">
          <h1 className="text-2xl font-bold mb-2 dark:text-white">Books</h1>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {displayedBooks.length} results {searchQuery ? `for "${searchQuery}"` : ""}
          </p>
        </div>
      )}

      {/* Book grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {displayedBooks.map((book) => (
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

      {/* View All button */}
      {showViewAll && filteredBooks.length > limit! && (
        <div className="flex justify-center mt-6">
          <Button
            onClick={handleViewAll}
            variant="outline"
            className="border-study-purple text-study-purple hover:bg-study-purple/10"
          >
            View All Books
          </Button>
        </div>
      )}

      {/* Empty state */}
      {displayedBooks.length === 0 && (
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
