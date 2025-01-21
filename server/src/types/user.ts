export interface User {
  userId?: number; // Optional if it's auto-generated
  username: string;
  email: string;
  passwordHash: string;
  streetAddress?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  country?: string;
}
