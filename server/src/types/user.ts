export interface User {
  userId?: number; // Optional if it's auto-generated
  username: string;
  email: string;
  password: string;
  streetAddress?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  country?: string;
}

export enum UserOptions {
  USERNAME = "username",
  EMAIL = "email",
  PASSWORD = "password_hash",
  STREET_ADDRESS = "street_address",
  CITY = "city",
  STATE = "state",
  ZIP = "zip_code",
  COUNTRY = "country"
}
