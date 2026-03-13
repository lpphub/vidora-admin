// 用户类型
export interface User {
  id: number
  username: string
  email: string
  avatar?: string
  role: 'admin' | 'editor' | 'viewer'
  createdAt?: string
}

// 登录请求
export interface LoginRequest {
  email: string
  password: string
}

// 认证数据
export interface AuthData {
  user: User
  accessToken: string
  refreshToken: string
}
