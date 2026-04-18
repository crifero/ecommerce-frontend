export interface OrderItem {
  id: number;
  productId: number;
  productName: string;
  productPrice: number;
  quantity: number;
  subtotal: number;
  isActive: boolean;
  wasDeleted: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Order {
  id: number;
  userId: number;
  status: string;
  total: number;
  observations?: string;
  items: OrderItem[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateOrderItemRequest {
  productId: number;
  quantity: number;
}

export interface CreateOrderRequest {
  items: CreateOrderItemRequest[];
  observations?: string;
}

export interface OrderSearchParams {
  page?: number;
  size?: number;
  paginated?: boolean;
  startDate?: string;
  endDate?: string;
}
