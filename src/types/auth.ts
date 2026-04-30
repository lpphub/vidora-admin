export interface User {
  id: number
  username: string
  email: string
  avatar?: string
  about?: string
  role: 'admin' | 'editor' | 'viewer'
  createdAt?: string
}

export interface LoginReq {
  email: string
  password: string
}

export interface AuthResp {
  user: User
  accessToken: string
  refreshToken: string
}
