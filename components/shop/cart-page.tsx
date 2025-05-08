"use client"

import { useState } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Trash2, Plus, Minus, ShoppingBag } from "lucide-react"
import { useCart } from "@/components/shop/cart-context"
import { useRouter } from "next/navigation"
import { Input } from "@/components/ui/input"

export function CartPage() {
  const { items, removeFromCart, updateQuantity, total } = useCart()
  const router = useRouter()
  const [note, setNote] = useState("")

  const formatPrice = (price: number) => {
    return `KSh ${price.toLocaleString()}`
  }

  const handleContactSeller = () => {
    // Create WhatsApp message with cart details
    let message = "Hello, I'm interested in buying books from your shop.\n\n"
    message += "My Cart:\n"

    items.forEach((item, index) => {
      message += `${index + 1}. ${item.name} - ${formatPrice(item.price)} x ${item.quantity}\n`
    })

    message += `\nTotal: ${formatPrice(total)}`

    if (note) {
      message += `\n\nNote: ${note}`
    }

    // Encode the message for URL
    const encodedMessage = encodeURIComponent(message)

    // Open WhatsApp with the message
    window.open(`https://wa.me/254707775531?text=${encodedMessage}`, "_blank")
  }

  return (
    <div className="container py-8">
      <h1 className="text-2xl font-bold mb-6 dark:text-white">Your Cart</h1>

      {items.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Card className="dark:bg-gray-800 dark:border-gray-700">
              <CardHeader>
                <CardTitle className="dark:text-white">Cart Items ({items.length})</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {items.map((item) => (
                    <div
                      key={item.id}
                      className="flex flex-col sm:flex-row items-start sm:items-center gap-4 pb-4 border-b dark:border-gray-700"
                    >
                      <div className="bg-gray-50 dark:bg-gray-700 p-2 rounded-md w-20 h-20 flex items-center justify-center flex-shrink-0">
                        <Image
                          src={item.image || "/placeholder.svg"}
                          alt={item.name}
                          width={60}
                          height={60}
                          className="object-contain"
                        />
                      </div>

                      <div className="flex-1">
                        <h3 className="font-medium dark:text-white">{item.name}</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">{formatPrice(item.price)}</p>

                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8 dark:border-gray-600 dark:text-white"
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            disabled={item.quantity <= 1}
                          >
                            <Minus className="h-3 w-3" />
                          </Button>

                          <span className="w-8 text-center dark:text-white">{item.quantity}</span>

                          <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8 dark:border-gray-600 dark:text-white"
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          >
                            <Plus className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>

                      <div className="flex flex-col items-end gap-2">
                        <span className="font-medium dark:text-white">{formatPrice(item.price * item.quantity)}</span>

                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 p-0 h-auto"
                          onClick={() => removeFromCart(item.id)}
                        >
                          <Trash2 className="h-4 w-4 mr-1" />
                          <span>Remove</span>
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <div>
            <Card className="dark:bg-gray-800 dark:border-gray-700">
              <CardHeader>
                <CardTitle className="dark:text-white">Order Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Subtotal</span>
                    <span className="font-medium dark:text-white">{formatPrice(total)}</span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Shipping</span>
                    <span className="font-medium dark:text-white">To be determined</span>
                  </div>

                  <div className="border-t pt-4 dark:border-gray-700">
                    <div className="flex justify-between mb-4">
                      <span className="font-medium dark:text-white">Total</span>
                      <span className="font-bold text-lg dark:text-white">{formatPrice(total)}</span>
                    </div>

                    <div className="mb-4">
                      <label htmlFor="note" className="block text-sm font-medium mb-1 dark:text-white">
                        Add a note (optional)
                      </label>
                      <Input
                        id="note"
                        placeholder="Any special instructions..."
                        value={note}
                        onChange={(e) => setNote(e.target.value)}
                        className="dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                      />
                    </div>

                    <Button
                      className="w-full bg-study-purple hover:bg-study-blue text-white"
                      onClick={handleContactSeller}
                    >
                      <ShoppingBag className="h-4 w-4 mr-2" />
                      Contact Seller
                    </Button>

                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 text-center">
                      Clicking "Contact Seller" will open WhatsApp to complete your purchase
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      ) : (
        <div className="text-center py-12">
          <ShoppingBag className="h-16 w-16 mx-auto text-gray-400 dark:text-gray-600 mb-4" />
          <h2 className="text-xl font-medium mb-2 dark:text-white">Your cart is empty</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Looks like you haven't added any books to your cart yet.
          </p>
          <Button className="bg-study-purple hover:bg-study-blue text-white" onClick={() => router.push("/shop")}>
            Continue Shopping
          </Button>
        </div>
      )}
    </div>
  )
}
