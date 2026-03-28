export interface Product {
  uid: string
  title: string
  description: string
  tag: string
  image_url: string
  /** Optional second photo (URL, path, or data URL). */
  image_url_secondary: string | null
  related_item_uid: string | null
  /** Usernames in claim order (first = earliest). */
  claimants: string[]
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
