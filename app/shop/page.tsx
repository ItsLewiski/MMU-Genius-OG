import { ShopPage } from "@/components/shop/shop-page"
import { PageLayout } from "@/components/layout/page-layout"
import { CartProvider } from "@/components/shop/cart-context"

export default function Shop() {
  return (
    <PageLayout>
      <CartProvider>
        <ShopPage />
      </CartProvider>
    </PageLayout>
  )
}
