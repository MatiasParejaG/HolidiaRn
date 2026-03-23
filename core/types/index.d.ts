interface Property {
  id: string;
  name: string;
  description: string;
  price_per_night: number;
  owner_id: string;
  created_at: string;
  images: string[];
  address: string;
  city: string;
  country: string;
  amenities: string;
  capacity: number;
  longitude: number;
  latitude: number;
  latitude_delta: number;
  longitude_delta: number;
  is_favorite: boolean;
  rating?: number;
}

interface User {
  id: string;
  name: string;
  created_at: string;
  username: string;
  email: string;
  avatar: string;
  properties: Property[] | null;
  bookings: Booking[] | null;
}

interface Booking {
  id: string;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  property_id: string;
  user_id: string;
  check_in: string;
  check_out: string;
  total_price: number;
  status: 'pending_payment' | 'succeeded' | 'failed' | string;
  guest_count: number;
  special_requests: string;
  property: Property;
  user: User;
  payment_intent_id: string;
  payment_status: string;
}

interface ICartItem {
  id: string;
  name: string;
  price_per_night: number;
  quantity: number;
  product: string;
  startDate: string | Date;
  endDate: string | Date;
  days: number;
  image: string;
  property?: Property;
}
