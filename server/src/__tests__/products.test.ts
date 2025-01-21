import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { pool } from '../models/db/database'; // Assuming this file handles the database connection
import Product from '../types/product'; // Assuming this is your product type definition


describe('get products', () => {
  let testProduct: Product;

  beforeAll(async () => {
    // Insert a test product.  Adjust column names to match your database schema.
    const result = await pool.query(
      `INSERT INTO products (name, description, price, image_url, category_id) 
       VALUES ($1, $2, $3, $4, $5) RETURNING *;`,
      ['Test Product', 'Test Description', 9.99, 'test.jpg', 1] // Replace 1 with a valid category ID if needed.
    );
    testProduct = result.rows[0] as Product;
  });

  afterAll(async () => {
    await pool.query('DELETE FROM products WHERE product_id = $1', [testProduct.productId]);
    await pool.end();
  });

  it('should retrieve all products', async () => {
    const result = await pool.query('SELECT * FROM products;');
    const products = result.rows as Product[];
    expect(products).toBeDefined();
    expect(Array.isArray(products)).toBe(true);
    expect(products.length).toBeGreaterThanOrEqual(1); // Expect at least one product (the test product)

     //Check that the test product exists in the retrieved data.
    expect(products.some(product => product.productId === testProduct.productId)).toBe(true);

  });

  // it('should retrieve a specific product by ID', async () => {
  //   const result = await pool.query('SELECT * FROM products WHERE product_id = $1', [testProduct.productId]);
  //   const product = result.rows[0] as Product;
  //   console.log("result:", result.rows)
  //   expect(product).toBeDefined();
  //   expect(product.productId).toBe(testProduct.productId);
  //   expect(product.name).toBe('Test Product'); // Check specific attributes
  // });


  //Add more tests as needed to cover different scenarios like:

  // it('should handle errors gracefully when product ID is invalid', async () => {
  //   // ... your test logic to handle invalid IDs
  // });


});
