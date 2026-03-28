export interface Product {
  uid: string
  title: string
  description: string
  tag: string
  image_url: string
  related_item_uid: string | null
  claimant: string | null
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
