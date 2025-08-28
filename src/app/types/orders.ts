export interface OrderItem {
  product: string | { _id: string; name: string; price: number; image?: string }; // Product ID or populated product object
  quantity: number;
  _id?: string;
}

export interface ShippingAddress {
  street: string;
  city: string;
  country: string;
  phoneNumber: string;
}

export interface Order {
  _id?: string;
  orderNumber?: string;
  userId: string;
  items: OrderItem[];
  itemsPrice: number;
  shippingCost: number;
  shippingAddress: ShippingAddress;
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';
  notes?: string;
  createdAt?: Date;
  updatedAt?: Date;
  totalPrice: number;
}

export interface CreateOrderRequest {
  items: Array<{
    product: string;
    quantity: number;
  }>;
  shippingAddress: ShippingAddress;
  notes?: string;
}

export interface OrderResponse {
  message: string;
  order: Order;
}

export interface OrdersResponse {
  orders: Order[];
}
