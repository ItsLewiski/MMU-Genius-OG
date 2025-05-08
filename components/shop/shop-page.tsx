"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { BookList } from "@/components/shop/book-list"
import { ShoeList } from "@/components/shop/shoe-list"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search, Filter, ShoppingCart } from "lucide-react"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { useRouter } from "next/navigation"
import { useCart } from "./cart-context"
import { CartNotification } from "./cart-notification"

export function ShopPage() {
  const router = useRouter()
  const { cartItems } = useCart()
  const [searchQuery, setSearchQuery] = useState("")
  const [searchInput, setSearchInput] = useState("")
  const [activeTab, setActiveTab] = useState("all")
  const [showNotification, setShowNotification] = useState(false)
  const [addedProductName, setAddedProductName] = useState("")

  // Filter states
  const [selectedAuthors, setSelectedAuthors] = useState<string[]>([])
  const [selectedBrands, setSelectedBrands] = useState<string[]>([])
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 2000])
  const [sortBy, setSortBy] = useState<string>("featured")

  // Sample authors and brands for filters
  const authors = ["James Clear", "Morgan Housel", "Robert Kiyosaki", "Napoleon Hill", "Richard Koch", "Robert Greene"]
  const brands = ["Nike", "Adidas", "Puma", "New Balance", "Reebok"]

  // Listen for cart notifications
  useEffect(() => {
    const handleCustomEvent = (event: CustomEvent) => {
      if (event.detail?.productName) {
        setAddedProductName(event.detail.productName)
        setShowNotification(true)
      }
    }

    window.addEventListener("addToCart" as any, handleCustomEvent as EventListener)

    return () => {
      window.removeEventListener("addToCart" as any, handleCustomEvent as EventListener)
    }
  }, [])

  const handleSearch = () => {
    setSearchQuery(searchInput)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch()
    }
  }

  const formatPrice = (price: number) => {
    return `KSh ${price.toLocaleString()}`
  }

  const resetFilters = () => {
    setSelectedAuthors([])
    setSelectedBrands([])
    setPriceRange([0, 2000])
    setSortBy("featured")
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 dark:text-white">Genius Shop</h1>

      {/* Search, categories, and filter bar - all in one line */}
      <div className="flex flex-col lg:flex-row gap-4 mb-6 items-center">
        <div className="flex flex-1 w-full lg:w-auto">
          <Input
            type="text"
            placeholder="Search products..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            onKeyDown={handleKeyDown}
            className="rounded-r-none w-full"
          />
          <Button className="rounded-l-none bg-study-purple hover:bg-study-blue text-white" onClick={handleSearch}>
            <Search className="h-4 w-4" />
          </Button>
        </div>

        {/* Categories dropdown for smaller screens */}
        <div className="hidden sm:flex lg:hidden w-full">
          <Select value={activeTab} onValueChange={setActiveTab}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Products</SelectItem>
              <SelectItem value="books">Books</SelectItem>
              <SelectItem value="shoes">Shoes</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Categories tabs for larger screens */}
        <div className="hidden lg:flex">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="border-0">
            <TabsList className="bg-white dark:bg-gray-800 border rounded-md p-1">
              <TabsTrigger value="all" className="data-[state=active]:bg-study-purple data-[state=active]:text-white">
                All Products
              </TabsTrigger>
              <TabsTrigger value="books" className="data-[state=active]:bg-study-purple data-[state=active]:text-white">
                Books
              </TabsTrigger>
              <TabsTrigger value="shoes" className="data-[state=active]:bg-study-purple data-[state=active]:text-white">
                Shoes
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        {/* Filter button */}
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" className="dark:bg-gray-800 dark:text-white dark:border-gray-700 ml-auto">
              <Filter className="h-4 w-4 mr-2" />
              Filters
            </Button>
          </SheetTrigger>
          <SheetContent className="overflow-y-auto">
            <SheetHeader>
              <SheetTitle>Filter Products</SheetTitle>
              <SheetDescription>Refine your search results</SheetDescription>
            </SheetHeader>

            <div className="py-4 space-y-6">
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

              {/* Price range filter */}
              <div>
                <h3 className="font-medium mb-2">Price Range</h3>
                <div className="px-2">
                  <Slider
                    defaultValue={[0, 2000]}
                    min={0}
                    max={2000}
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

              {/* Author filter (for books) */}
              {(activeTab === "books" || activeTab === "all") && (
                <div>
                  <h3 className="font-medium mb-2">Author</h3>
                  <div className="space-y-2">
                    {authors.map((author) => (
                      <div key={author} className="flex items-center">
                        <Checkbox
                          id={`author-${author}`}
                          checked={selectedAuthors.includes(author)}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              setSelectedAuthors([...selectedAuthors, author])
                            } else {
                              setSelectedAuthors(selectedAuthors.filter((a) => a !== author))
                            }
                          }}
                        />
                        <Label htmlFor={`author-${author}`} className="ml-2 text-sm font-normal">
                          {author}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Brand filter (for shoes) */}
              {(activeTab === "shoes" || activeTab === "all") && (
                <div>
                  <h3 className="font-medium mb-2">Brand</h3>
                  <div className="space-y-2">
                    {brands.map((brand) => (
                      <div key={brand} className="flex items-center">
                        <Checkbox
                          id={`brand-${brand}`}
                          checked={selectedBrands.includes(brand)}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              setSelectedBrands([...selectedBrands, brand])
                            } else {
                              setSelectedBrands(selectedBrands.filter((b) => b !== brand))
                            }
                          }}
                        />
                        <Label htmlFor={`brand-${brand}`} className="ml-2 text-sm font-normal">
                          {brand}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex justify-end mt-4 space-x-2">
                <Button variant="outline" onClick={resetFilters}>
                  Reset Filters
                </Button>
                <Button className="bg-study-purple hover:bg-study-blue text-white">Apply Filters</Button>
              </div>
            </div>
          </SheetContent>
        </Sheet>

        {/* Cart button */}
        <Button
          onClick={() => router.push("/cart")}
          className="lg:ml-2 bg-study-purple hover:bg-study-blue text-white relative"
          aria-label="View Cart"
        >
          <ShoppingCart className="h-4 w-4 mr-2" />
          <span>Cart</span>
          {cartItems?.length > 0 && (
            <span className="absolute -top-2 -right-2 bg-study-blue text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
              {cartItems.length}
            </span>
          )}
        </Button>
      </div>

      {/* Product content based on active tab */}
      {activeTab === "all" && (
        <div className="space-y-10">
          <div>
            <h2 className="text-2xl font-semibold mb-4">Featured Books</h2>
            <BookList searchQuery={searchQuery} limit={4} showViewAll />
          </div>
          <div>
            <h2 className="text-2xl font-semibold mb-4">Featured Shoes</h2>
            <ShoeList searchQuery={searchQuery} limit={4} showViewAll />
          </div>
        </div>
      )}

      {activeTab === "books" && <BookList searchQuery={searchQuery} />}
      {activeTab === "shoes" && <ShoeList searchQuery={searchQuery} />}

      {/* Cart notification that appears above all elements */}
      {showNotification && (
        <CartNotification
          isOpen={showNotification}
          onClose={() => setShowNotification(false)}
          productName={addedProductName}
        />
      )}
    </div>
  )
}
