const config = {
  '*.{js,jsx,ts,tsx}': ['pnpm lint', 'pnpm format', 'git add .'], // If your `pnpm lint` command also fixed some bug, we should staged all the fixed file by using `git add .`
}
export default config
