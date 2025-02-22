CREATE TABLE "users" (
  "user_id" INTEGER GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
  "username" varchar(255) UNIQUE NOT NULL,
  "email" varchar(255) UNIQUE NOT NULL,
  "password_hash" varchar(255) NOT NULL,
  "street_address" varchar(255),
  "city" varchar(255),
  "state" varchar(255),
  "zip_code" varchar(20),
  "country" varchar(255)
);

CREATE TABLE "products" (
  "product_id" INTEGER GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
  "name" varchar(255) NOT NULL,
  "description" text,
  "price" decimal NOT NULL,
  "image_url" varchar(255),
  "category_id" int
);

CREATE TABLE "categories" (
  "category_id" INTEGER GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
  "name" varchar(255) NOT NULL
);

CREATE TABLE "carts" (
  "cart_id" INTEGER GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
  "user_id" integer NOT NULL
);

CREATE TABLE "cart_items" (
  "cart_item_id" INTEGER GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
  "cart_id" integer NOT NULL,
  "product_id" integer NOT NULL,
  "quantity" integer NOT NULL
);

CREATE TABLE "orders" (
  "order_id" INTEGER GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
  "user_id" integer NOT NULL,
  "order_date" timestamptz NOT NULL DEFAULT (now()),
  "total_amount" decimal NOT NULL
);

CREATE TABLE "order_items" (
  "order_item_id" INTEGER GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
  "order_id" integer NOT NULL,
  "product_id" integer NOT NULL,
  "quantity" integer NOT NULL,
  "price" decimal NOT NULL
);

CREATE TABLE "checkouts" (
  "checkout_id" INTEGER GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
  "user_id" integer NOT NULL,
  "checkout_date" timestamptz NOT NULL DEFAULT (now()),
  "total_amount" decimal NOT NULL
);

CREATE TABLE refresh_tokens (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(user_id) ON DELETE CASCADE,
    token TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX idx_refresh_tokens_token ON refresh_tokens (token);


ALTER TABLE "checkouts" ADD FOREIGN KEY ("user_id") REFERENCES "users" ("user_id");

ALTER TABLE "carts" ADD FOREIGN KEY ("user_id") REFERENCES "users" ("user_id");

ALTER TABLE "cart_items" ADD FOREIGN KEY ("cart_id") REFERENCES "carts" ("cart_id");

ALTER TABLE "cart_items" ADD FOREIGN KEY ("product_id") REFERENCES "products" ("product_id");

ALTER TABLE "orders" ADD FOREIGN KEY ("user_id") REFERENCES "users" ("user_id");

ALTER TABLE "order_items" ADD FOREIGN KEY ("order_id") REFERENCES "orders" ("order_id");

ALTER TABLE "order_items" ADD FOREIGN KEY ("product_id") REFERENCES "products" ("product_id");

ALTER TABLE "products" ADD FOREIGN KEY ("category_id") REFERENCES "categories" ("category_id");