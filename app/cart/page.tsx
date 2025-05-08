import { CartPage } from "@/components/shop/cart-page"
import { PageLayout } from "@/components/layout/page-layout"
import { CartProvider } from "@/components/shop/cart-context"

export default function Cart() {
  return (
    <PageLayout>
      <CartProvider>
        <CartPage />
      </CartProvider>
    </PageLayout>
  )
}
