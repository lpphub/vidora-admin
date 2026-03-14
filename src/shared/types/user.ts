export interface User {
  id: number
  username: string
  email: string
  avatar?: string
  role: 'admin' | 'editor' | 'viewer'
  createdAt?: string
}

export interface LoginRequest {
  email: string
  password: string
}

export interface AuthData {
  user: User
  accessToken: string
  refreshToken: string
}
