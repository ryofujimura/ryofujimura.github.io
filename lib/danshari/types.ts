export interface Product {
  uid: string
  title: string
  description: string
  /** Category labels; used for display and “more items” grouping. */
  tags: string[]
  image_url: string
  /** Smaller image for grids/carousels; set on publish from data URLs. */
  image_thumb_url: string | null
  /** Responsive thumb variants (Storage); optional for legacy docs. */
  image_thumb_320_url: string | null
  image_thumb_160_url: string | null
  /** Optional second photo (URL, path, or data URL). */
  image_url_secondary: string | null
  image_thumb_secondary: string | null
  image_thumb_secondary_320_url: string | null
  image_thumb_secondary_160_url: string | null
  /** Tiny JPEG data URL for grid blur-up; set on publish. */
  image_placeholder_data_url: string | null
  image_placeholder_secondary_data_url: string | null
  related_item_uid: string | null
  /** Usernames in claim order (first = earliest). */
  claimants: string[]
  /** Admin-only copy shown above the catalog for targeted users. */
  promotion_message: string
  /** Lowercase logins that see this product in the Promotion block. */
  promotion_usernames: string[]
  /** When true, listings show as sold and the product page is not reachable for guests. */
  sold: boolean
  created_at: string
}

export interface Comment {
  id: string
  product_uid: string
  username: string
  text: string
  price: number | null
  created_at: string
}

export interface User {
  username: string
  is_admin: boolean
}
