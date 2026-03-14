import type { User } from '@/features/auth/types'

// 模拟数据库
const users: Map<string, { password: string; user: User }> = new Map()

// token 存储 (token -> email 映射)
const tokens: Map<string, string> = new Map()

// 生成简单的 token
function generateToken(): string {
  return `token_${Date.now()}_${Math.random().toString(36).slice(2)}`
}

// 存储 token 与用户关联
function storeToken(token: string, email: string): void {
  tokens.set(token, email)
}

// 根据 token 获取用户邮箱
function getEmailByToken(token: string): string | undefined {
  return tokens.get(token)
}

// 移除 token (登出时使用)
function removeToken(token: string): boolean {
  return tokens.delete(token)
}

// 更新用户信息
function updateUser(email: string, data: Partial<User>): User | null {
  const record = users.get(email)
  if (!record) return null

  const updatedUser = { ...record.user, ...data }
  users.set(email, { ...record, user: updatedUser })
  return updatedUser
}

// 删除用户
function deleteUser(email: string): boolean {
  return users.delete(email)
}

// 初始化测试账户
function seedMockUsers(): void {
  const testUser: User = {
    id: 1,
    email: 'test@vidora.com',
    username: '测试用户',
    role: 'admin',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=test',
    about: '这是一个测试用户',
  }

  users.set('test@vidora.com', {
    password: '123456',
    user: testUser,
  })

  // 管理员账户
  const adminUser: User = {
    id: 2,
    email: 'admin@vidora.com',
    username: '管理员',
    role: 'admin',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=admin',
  }

  users.set('admin@vidora.com', {
    password: 'admin123',
    user: adminUser,
  })
}

// 自动初始化
seedMockUsers()

export {
  users,
  tokens,
  generateToken,
  storeToken,
  getEmailByToken,
  removeToken,
  updateUser,
  deleteUser,
}
