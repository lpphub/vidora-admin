import {
  createContext,
  type PropsWithChildren,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react'

export const LoginStateEnum = {
  LOGIN: 0,
  REGISTER: 1,
  RESET_PASSWORD: 2,
} as const

export type LoginState = (typeof LoginStateEnum)[keyof typeof LoginStateEnum]

interface LoginStateContextType {
  loginState: LoginState
  setLoginState: (loginState: LoginState) => void
  backToLogin: () => void
}

const LoginStateContext = createContext<LoginStateContextType>({
  loginState: LoginStateEnum.LOGIN,
  setLoginState: () => {},
  backToLogin: () => {},
})

export function useLoginStateContext() {
  return useContext(LoginStateContext)
}

export function LoginProvider({ children }: PropsWithChildren) {
  const [loginState, setLoginState] = useState<LoginState>(LoginStateEnum.LOGIN)

  const backToLogin = useCallback(() => {
    setLoginState(LoginStateEnum.LOGIN)
  }, [])

  const value = useMemo(
    () => ({ loginState, setLoginState, backToLogin }),
    [loginState, backToLogin]
  )

  return <LoginStateContext.Provider value={value}>{children}</LoginStateContext.Provider>
}
