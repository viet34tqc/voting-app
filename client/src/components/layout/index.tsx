import { PropsWithChildren } from 'react'

const Layout = ({ children }: PropsWithChildren) => {
  return (
    <main className='bg-green-50 flex items-center justify-center min-h-[100svh] px-4'>
      {children}
    </main>
  )
}

export default Layout
