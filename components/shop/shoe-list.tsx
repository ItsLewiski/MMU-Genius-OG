"use client"

import { useState } from "react"
import Image from "next/image"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ShoeModal } from "./shoe-modal"
import { Button } from "@/components/ui/button"
import { useCart } from "./cart-context"
import { useRouter } from "next/navigation"
import { Star } from "lucide-react"

// Sample shoe data with added reviews and best seller flags
const shoes = [
  {
    id: 101,
    name: "Nike Air Force 1 Low",
    brand: "Nike",
    price: 999900,
    image: "/assets/images/shoes/nike-air-force-1-glitter.png",
    description:
      "White leather with glitter swoosh and gold accents. White leather upper, glitter silver Swoosh, gold eyelets/heel/branding, 'Air' cushioned sole.",
    categories: ["sneakers", "nike", "air-force"],
    sizes: [36, 37, 38, 39, 40, 41, 42, 43, 44, 45],
    inStock: true,
    rating: 4.8,
    reviewCount: 124,
    isBestSeller: true,
  },
  {
    id: 102,
    name: "Nike Dunk Low Panda",
    brand: "Nike",
    price: 899900,
    image: "/assets/images/shoes/nike-dunk-low-panda.png",
    description:
      "Classic black and white colorway. Black and white leather upper, black Swoosh, white midsole, black outsole.",
    categories: ["sneakers", "nike", "dunk-low"],
    sizes: [38, 39, 40, 41, 42, 43, 44],
    inStock: true,
    rating: 4.5,
    reviewCount: 98,
    isBestSeller: true,
  },
  {
    id: 103,
    name: "Nike Air Force 1 Low",
    brand: "Nike",
    price: 849900,
    image: "/assets/images/shoes/nike-air-force-1-white.png",
    description:
      "All-white with unique side detail. All-white leather, subtle side signature/detail, classic AF1 silhouette.",
    categories: ["sneakers", "nike", "air-force"],
    sizes: [36, 37, 38, 39, 40, 41, 42, 44, 45],
    inStock: true,
    rating: 4.3,
    reviewCount: 76,
    isBestSeller: false,
  },
  {
    id: 104,
    name: "Adidas Samba",
    brand: "Adidas",
    price: 799900,
    image: "/assets/images/shoes/adidas-samba.png",
    description:
      "White with black stripes and brown sole. White leather, black Adidas stripes, gold 'SAMBA' text, brown rubber outsole.",
    categories: ["sneakers", "adidas", "classics"],
    sizes: [37, 38, 39, 40, 41, 42, 43, 44, 45],
    inStock: true,
    rating: 4.7,
    reviewCount: 112,
    isBestSeller: true,
  },
  {
    id: 105,
    name: "Nike Dunk Low Rosewood",
    brand: "Nike",
    price: 949900,
    image: "/assets/images/shoes/nike-dunk-low-rosewood.png",
    description:
      "White and rosewood colorway. White leather base, rosewood overlays/Swoosh/laces, white midsole/outsole.",
    categories: ["sneakers", "nike", "dunk-low"],
    sizes: [36, 37, 38, 39, 40, 41],
    inStock: true,
    rating: 4.2,
    reviewCount: 45,
    isBestSeller: false,
  },
  {
    id: 106,
    name: "Nike SB Dunk PandaPrank",
    brand: "Nike",
    price: 1199900,
    image: "/assets/images/shoes/nike-sb-dunk-pandaprank.png",
    description:
      "Unique white/black/brown/blue design. White/black panels, brown Swoosh, blue lining, 'PandaPrank' branding.",
    categories: ["sneakers", "nike", "sb-dunk"],
    sizes: [39, 40, 41, 42, 43, 44, 45],
    inStock: true,
    rating: 4.6,
    reviewCount: 67,
    isBestSeller: false,
  },
  {
    id: 107,
    name: "Nike Dunk Low Disrupt 2",
    brand: "Nike",
    price: 999900,
    image: "/assets/images/shoes/nike-dunk-low-disrupt.png",
    description:
      "Deconstructed black and white look. Layered black/white panels, visible stitching, modern Dunk twist.",
    categories: ["sneakers", "nike", "dunk-low"],
    sizes: [36, 37, 38, 39, 40, 41],
    inStock: true,
    rating: 4.1,
    reviewCount: 38,
    isBestSeller: false,
  },
  {
    id: 108,
    name: "Nike Dunk Low Teddy Bear",
    brand: "Nike",
    price: 1049900,
    image: "/assets/images/shoes/nike-dunk-low-brown.png",
    description:
      "Brown and white with teddy bear graphic. Brown/white leather, brown Swoosh, teddy bear heel graphic, Nike tag.",
    categories: ["sneakers", "nike", "dunk-low"],
    sizes: [38, 39, 40, 41, 42, 43, 44],
    inStock: true,
    rating: 4.4,
    reviewCount: 52,
    isBestSeller: false,
  },
]

interface ShoeListProps {
  searchQuery?: string
  limit?: number
  showViewAll?: boolean
}

export function ShoeList({ searchQuery = "", limit, showViewAll = false }: ShoeListProps) {
  const router = useRouter()
  const [selectedShoe, setSelectedShoe] = useState<any>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const { addToCart } = useCart()

  // Filter shoes based on search query
  const filteredShoes = shoes.filter(
    (shoe) =>
      shoe.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      shoe.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
      shoe.description.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  // Apply limit if provided
  const displayedShoes = limit ? filteredShoes.slice(0, limit) : filteredShoes

  const handleShoeClick = (shoe: any) => {
    setSelectedShoe(shoe)
    setIsModalOpen(true)
  }

  const handleAddToCart = (shoe: any, size?: number) => {
    const productWithSize = size ? { ...shoe, selectedSize: size } : shoe
    addToCart(productWithSize)

    // Dispatch custom event for notification
    const addToCartEvent = new CustomEvent("addToCart", {
      detail: { productName: shoe.name },
    })
    window.dispatchEvent(addToCartEvent)

    setIsModalOpen(false)
  }

  // Format price from cents to dollars with KSh currency
  const formatPrice = (price: number) => {
    return `KSh ${Math.floor(price / 100)},${(price % 100).toString().padStart(2, "0")}`
  }

  // Render star rating (simplified version for the card)
  const renderRating = (rating: number, reviewCount: number) => {
    return (
      <div className="flex items-center mt-1">
        <div className="flex items-center">
          <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
          <span className="ml-1 text-xs text-gray-600 dark:text-gray-400">
            {rating.toFixed(1)} ({reviewCount})
          </span>
        </div>
      </div>
    )
  }

  const handleViewAll = () => {
    router.push("/shop?tab=shoes")
  }

  return (
    <div>
      {displayedShoes.length > 0 ? (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {displayedShoes.map((shoe) => (
              <Card key={shoe.id} className="overflow-hidden hover:shadow-lg transition-all duration-300">
                <div className="h-48 relative cursor-pointer" onClick={() => handleShoeClick(shoe)}>
                  <Image src={shoe.image || "/placeholder.svg"} alt={shoe.name} fill className="object-contain p-2" />
                  {shoe.isBestSeller && (
                    <Badge className="absolute top-2 left-2 bg-amber-500 text-white">Best Seller</Badge>
                  )}
                </div>
                <CardContent className="p-4">
                  <h3 className="font-semibold text-base truncate">{shoe.name}</h3>
                  <p className="text-sm text-muted-foreground mb-1">{shoe.brand}</p>
                  {renderRating(shoe.rating, shoe.reviewCount)}
                  <div className="flex justify-between items-center mt-2">
                    <span className="font-bold">{formatPrice(shoe.price)}</span>
                    <Badge variant="outline" className="text-xs">
                      {shoe.inStock ? "In Stock" : "Out of Stock"}
                    </Badge>
                  </div>
                </CardContent>
                <CardFooter className="p-4 pt-0">
                  <Button
                    onClick={() => handleShoeClick(shoe)}
                    className="w-full bg-study-purple hover:bg-study-blue text-white"
                  >
                    View Details
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>

          {showViewAll && filteredShoes.length > limit! && (
            <div className="flex justify-center mt-6">
              <Button
                onClick={handleViewAll}
                variant="outline"
                className="border-study-purple text-study-purple hover:bg-study-purple/10"
              >
                View All Shoes
              </Button>
            </div>
          )}
        </>
      ) : (
        <div className="text-center py-12">
          <h3 className="text-xl font-semibold mb-2">No shoes found</h3>
          <p className="text-muted-foreground">Try adjusting your search or filters</p>
        </div>
      )}

      {selectedShoe && (
        <ShoeModal
          shoe={selectedShoe}
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onAddToCart={handleAddToCart}
        />
      )}
    </div>
  )
}
