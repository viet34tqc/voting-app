import { PropsWithChildren } from 'react'

const Layout = ({ children }: PropsWithChildren) => {
  return <main className='container grid place-content-center min-h-[100dvh]'>{children}</main>
}

export default Layout
