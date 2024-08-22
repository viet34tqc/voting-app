import { createRootRoute, Outlet } from '@tanstack/react-router'

export const Route = createRootRoute({
  component: () => (
    <main className='container grid place-content-center min-h-[100dvh]'>
      <Outlet />
    </main>
  ),
})
