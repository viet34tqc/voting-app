const config = {
  'client/**/*.{js,jsx,ts,tsx}': ['pnpm --filter client lint', 'pnpm format'],
  'server/**/*.{js,ts}': ['pnpm --filter server lint', 'pnpm format'],
}
export default config
