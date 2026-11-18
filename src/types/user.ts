export interface User {
  id: string
  email: string
  password: string
}

export type AuthResult = { success: true } | { success: false; message: string }
