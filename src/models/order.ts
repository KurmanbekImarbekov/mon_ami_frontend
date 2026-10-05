export type PaymentMethod = "MBank" | "Bakai" | "Cash";

export type DeliveryMethod = "delivery" | "pickup";

export type OrderStatus =
  | "created"
  | "confirmed"
  | "preparing"
  | "on_the_way"
  | "ready_for_pickup"
  | "delivered"
  | "cancelled";

export interface CartItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  weight?: string | null;
  image?: string | null;
  categoryId?: string | null;
}

export interface Customer {
  name: string;
  phone: string;
}

export interface DeliveryAddress {
  address: string;
  apartment: string;
  floor: string;
  entrance: string;
  comment?: string;
}

export interface OrderTotals {
  subtotal: number;
  deliveryFee: number;
  serviceFee: number;
  discount: number;
  total: number;
}

export interface Order {
  id: string;
  orderNumber: string;
  customer: Customer;
  deliveryMethod: DeliveryMethod;
  deliveryAddress: DeliveryAddress | null;
  paymentMethod: PaymentMethod;
  items: CartItem[];
  promoCode?: string;
  totals: OrderTotals;
  estimatedDelivery: string;
  status: OrderStatus;
  createdAt: string;
  updatedAt: string;
}
