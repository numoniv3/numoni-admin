'use client'

import { useState } from 'react'
import { PageTabs } from '@/modules/ms/components/shared/bits'
import { CartTab } from './CartTab'
import { DiscoverTab } from './DiscoverTab'
import type { ProductCard } from './items'
import { OrderSheet, OrdersTab, WishlistTab } from './OrdersTab'
import { ProductView } from './ProductView'
import { StoreView } from './StoreView'

/**
 * The customer marketplace (Marketplace MS): discover, a store's page, cart &
 * checkout, orders and wishlist. With `slug` (brand app) it opens straight on
 * that one store.
 */
export function StorefrontPanel({ slug }: { slug?: string }) {
  const [store, setStore] = useState<string | null>(null)
  const [product, setProduct] = useState<ProductCard | null>(null)
  const [order, setOrder] = useState<{ storeId: string; orderNumber: string } | null>(null)
  const openOrder = (storeId: string, orderNumber: string) => orderNumber && setOrder({ storeId, orderNumber })
  const shopSlug = slug ?? store

  return (
    <div>
      <PageTabs tabs={[
        {
          id: 'shop', label: slug ? 'Shop' : 'Discover',
          content: shopSlug
            ? <StoreView slug={shopSlug} onBack={slug ? undefined : () => setStore(null)} onProduct={setProduct} onOrder={openOrder} />
            : <DiscoverTab onProduct={setProduct} onStore={setStore} />,
        },
        { id: 'cart', label: 'Cart', content: <CartTab onOrder={openOrder} /> },
        { id: 'orders', label: 'Orders', content: <OrdersTab onOrder={openOrder} /> },
        { id: 'wishlist', label: 'Wishlist', content: <WishlistTab onProduct={setProduct} /> },
      ]} />
      <ProductView product={product} onClose={() => setProduct(null)} onOpenStore={slug ? undefined : (s) => { setProduct(null); setStore(s) }} />
      <OrderSheet target={order} onClose={() => setOrder(null)} />
    </div>
  )
}
