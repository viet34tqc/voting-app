import { PropsWithChildren } from 'react'

const Layout = ({ children }: PropsWithChildren) => {
  return (
    <main className='container flex items-center justify-center min-h-[100svh]'>{children}</main>
  )
}

export default Layout
