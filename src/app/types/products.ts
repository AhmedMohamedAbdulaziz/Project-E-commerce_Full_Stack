export interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
 category?: { _id: string; name: string };
  image?: string;
  createdAt?: Date;
}
