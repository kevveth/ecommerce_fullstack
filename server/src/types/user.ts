export type User = {
  user_id?: number; // Optional if it's auto-generated
  username: string;
  email: string;
  password_hash: string;
  street_address?: string;
  city?: string;
  state?: string;
  zip_code?: string;
  country?: string;
}
