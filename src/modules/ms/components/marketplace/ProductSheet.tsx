'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { FormSheet } from '@/components/ui/form-sheet'
import { Input } from '@/components/ui/input'
import type { ProductResponseDto } from '@/lib/api/numoni'
import {
  useCreateProductV2, useDeleteProductImage, usePricingPreview, useSetProductImages, useStoreAction, useUpdateProduct, useUploadProductImages,
  type StoreOps,
} from '@/modules/ms/api/useMarketplaceMerchant'
import { ActionForm, type Values } from '@/modules/ms/components/shared/ActionForm'
import { RecordView } from '@/modules/ms/components/shared/DataView'
import { recordOf } from '@/modules/ms/components/shared/fields'
import { productFields } from './store-fields'

function PricingPreview({ storeId }: { storeId: string }) {
  const preview = usePricingPreview()
  const [price, setPrice] = useState('')
  const [discount, setDiscount] = useState('')
  const run = (v1: boolean) => preview.mutate({ storeId, price: Number(price), discountPercent: Number(discount), v1 })
  return (
    <div className="rounded-2xl border p-4 space-y-2">
      <div className="label-caps">Pricing preview</div>
      <div className="flex gap-2">
        <Input value={price} onChange={(e) => setPrice(e.target.value.replace(/[^\d.]/g, ''))} placeholder="Price ₦" className="tnum" />
        <Input value={discount} onChange={(e) => setDiscount(e.target.value.replace(/[^\d.]/g, ''))} placeholder="Discount %" className="tnum" />
        <Button variant="outline" disabled={!price || preview.isPending} onClick={() => run(false)}>Preview</Button>
        <Button variant="ghost" disabled={!price || preview.isPending} onClick={() => run(true)} title="v1 pricing">v1</Button>
      </div>
      {preview.data && <RecordView data={recordOf(preview.data)} />}
    </div>
  )
}

function Images({ storeId, product }: { storeId: string; product: ProductResponseDto }) {
  const upload = useUploadProductImages()
  const save = useSetProductImages()
  const remove = useDeleteProductImage()
  const images = product.images ?? []
  return (
    <div className="rounded-2xl border p-4 space-y-3">
      <div className="label-caps">Images</div>
      <div className="flex flex-wrap gap-2">
        {images.map((url) => (
          <div key={url} className="relative">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={url} alt="" className="h-20 w-20 rounded-lg object-cover border" />
            <button className="absolute -top-1.5 -right-1.5 rounded-full bg-red-500 text-white text-[10px] h-5 w-5" title="Remove"
              onClick={() => remove.mutate({ storeId, body: { imageUrl: url } }, { onSuccess: () => save.mutate({ storeId, id: product.id, images: images.filter((x) => x !== url) }) })}>×</button>
          </div>
        ))}
      </div>
      <Input type="file" accept="image/*" multiple disabled={upload.isPending || save.isPending}
        onChange={(e) => {
          const files = Array.from(e.target.files ?? [])
          e.target.value = ''
          if (files.length) upload.mutate({ storeId, files }, { onSuccess: (r) => save.mutate({ storeId, id: product.id, images: [...images, ...r.images] }) })
        }} />
    </div>
  )
}

interface ProductSheetProps {
  storeId: string
  product: ProductResponseDto | null
  open: boolean
  onOpenChange: (open: boolean) => void
  categories: string[]
  ops: StoreOps
  /** Admin creates through the on-behalf route and can't edit. */
  admin?: boolean
}

/** Create (v2, or v1 / admin on-behalf) or edit a product, with pricing preview and image management. */
export function ProductSheet({ storeId, product, open, onOpenChange, categories, ops, admin }: ProductSheetProps) {
  const [v1, setV1] = useState(false)
  const createV2 = useCreateProductV2()
  const createV1 = useStoreAction((body: Values) => ops.createProduct(storeId, body as never), 'Product created', 'Couldn’t create the product')
  const update = useUpdateProduct()
  const close = () => onOpenChange(false)
  const pending = createV2.isPending || createV1.isPending || update.isPending

  const submit = (body: Values) => {
    if (product) update.mutate({ storeId, id: product.id, body, v1 }, { onSuccess: close })
    else if (v1 || admin) createV1.mutate(body, { onSuccess: close })
    else createV2.mutate({ storeId, body: body as never }, { onSuccess: close })
  }

  return (
    <FormSheet open={open} onOpenChange={onOpenChange} title={product ? `Edit ${product.name}` : 'New product'} sub={product?.id} wide>
      {open && (
        <div className="space-y-4 pb-2">
          {!admin && (
            <label className="flex items-center gap-2 text-xs text-muted-foreground">
              <input type="checkbox" checked={v1} onChange={(e) => setV1(e.target.checked)} /> Use the v1 API (discount includes nuMoni’s commission)
            </label>
          )}
          <PricingPreview storeId={storeId} />
          {product && !admin && <Images storeId={storeId} product={product} />}
          <ActionForm
            fields={productFields(categories, !product)}
            initial={product ? { ...product, price: Number(product.price), discountPercent: Number(product.discountPercent) } : { type: 'GOODS', status: 'PUBLISHED', isVisible: true, enhanceImage: true }}
            submitLabel={product ? 'Save product' : 'Create product'} pending={pending} onSubmit={submit}
          />
        </div>
      )}
    </FormSheet>
  )
}
