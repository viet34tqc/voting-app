const config = {
  'client/**/*.{js,jsx,ts,tsx}': ['pnpm --filter client lint', 'pnpm format'],
  'server/**/.{js,jsx,ts,tsx}': ['pnpm --filter server lint', 'pnpm format'],
}
export default config
