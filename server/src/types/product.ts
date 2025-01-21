interface Product {
  productId: number;
  name: string;
  description: string | null; // description can be null according to the schema
  price: number;
  imageUrl: string | null; // imageUrl can be null according to the schema
  categoryId: number;
}

export default Product;
