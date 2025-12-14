export type AppRole = 'admin' | 'seller' | 'buyer';

export interface UserProfile {
  id: string;
  user_id: string;
  full_name: string;
  email: string;
  phone: string | null;
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface UserRole {
  id: string;
  user_id: string;
  role: AppRole;
  created_at: string;
}

export interface Property {
  id: string;
  seller_id: string;
  title: string;
  description: string | null;
  price: number;
  property_type: 'house' | 'apartment' | 'land' | 'commercial' | 'villa' | 'condo';
  status: 'active' | 'sold' | 'pending' | 'inactive';
  bedrooms: number | null;
  bathrooms: number | null;
  area_sqft: number | null;
  address: string;
  city: string;
  state: string | null;
  country: string;
  zip_code: string | null;
  contact_number: string | null;
  latitude: number | null;
  longitude: number | null;
  created_at: string;
  updated_at: string;
}

export interface PropertyImage {
  id: string;
  property_id: string;
  image_url: string;
  is_primary: boolean;
  display_order: number;
  created_at: string;
}

export interface Favorite {
  id: string;
  user_id: string;
  property_id: string;
  created_at: string;
}

export interface PropertyWithImages extends Property {
  property_images: PropertyImage[];
  seller_profile?: UserProfile;
}
