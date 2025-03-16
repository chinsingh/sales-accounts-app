export interface User {
  email: string;
  password_hash: string;
  session_id?: string;
  session_expires?: Date;
}