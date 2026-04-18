export interface Product {
  id: number;
  name: string;
  description?: string;
  price: number;
  stock: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateProductRequest {
  name: string;
  description?: string;
  price: number;
  stock?: number;
  isActive?: boolean;
}

export interface UpdateProductRequest {
  name?: string;
  description?: string;
  price?: number;
  stock?: number;
  isActive?: boolean;
}

export interface ProductSearchParams {
  page?: number;
  size?: number;
  paginated?: boolean;
  name?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total_results: number;
}
